import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONFIG = JSON.parse(await fs.readFile(path.join(ROOT, "src", "data", "seoRoutes.json"), "utf8"));
const BASE_URL = process.env.BASE_URL || "http://127.0.0.1:4173/";
const REPORT_DIR = path.join(ROOT, "artifacts", "route-uiux");

const viewports = [
    { id: "desktop-1365", label: "Desktop 1365×900", width: 1365, height: 900, mobile: false },
    { id: "mobile-390", label: "Mobile 390×844", width: 390, height: 844, mobile: true },
    { id: "mobile-360", label: "Mobile compacto 360×800", width: 360, height: 800, mobile: true },
];

const results = [];
const navigationResults = [];
const failures = [];
const interactionResults = [];

function addFailure(scope, id, message) {
    failures.push({ scope, id, message });
    console.error("[ERROR][" + scope + "][" + id + "] " + message);
}

function routeSlug(route) {
    return route === "/" ? "home" : route.slice(1).replaceAll("/", "-");
}

async function waitForPreloaderToFinish(page, scope) {
    const preloader = page.locator(".site-preloader");
    if (await preloader.count() === 0) return;

    try {
        await preloader.waitFor({ state: "detached", timeout: 20000 });
    } catch {
        addFailure(scope, "preloader-not-dismissed", "O preloader permaneceu visível por mais de 20 segundos.");
        throw new Error("Preloader não foi removido dentro do tempo esperado.");
    }
}

async function revealFullPage(page) {
    let previousHeight = -1;

    for (let pass = 0; pass < 3; pass += 1) {
        for (let step = 0; step < 60; step += 1) {
            const state = await page.evaluate(() => ({
                y: window.scrollY,
                viewport: window.innerHeight,
                height: Math.max(document.documentElement.scrollHeight, document.body.scrollHeight),
            }));
            const maxY = Math.max(0, state.height - state.viewport);
            const nextY = Math.min(maxY, state.y + Math.max(250, Math.floor(state.viewport * 0.75)));
            if (nextY <= state.y + 1) break;

            await page.mouse.wheel(0, nextY - state.y);
            await page.waitForTimeout(250);

            const actualY = await page.evaluate(() => window.scrollY);
            if (Math.abs(actualY - nextY) > Math.max(100, state.viewport * 0.2)) {
                await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), nextY);
            }
            await page.waitForTimeout(250);
        }

        await page.waitForTimeout(700);
        const height = await page.evaluate(() => Math.max(
            document.documentElement.scrollHeight,
            document.body.scrollHeight,
        ));
        if (height === previousHeight) break;
        previousHeight = height;
        await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
        await page.waitForTimeout(300);
    }

    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(900);
}

async function waitForRoute(page, route) {
    const expectedUrl = new URL(route, BASE_URL).href;
    await page.waitForURL(expectedUrl, { timeout: 20000 });
    await page.locator("main").first().waitFor({ state: "visible", timeout: 20000 });
    await page.waitForFunction(
        (expectedTitle) => document.title === expectedTitle,
        CONFIG.routes[route].title,
        { timeout: 20000 },
    );
    await page.waitForTimeout(700);
}

async function readRouteMetadata(page) {
    return page.evaluate(() => ({
        title: document.title,
        description: document.querySelector('meta[name="description"]')?.content ?? "",
        canonical: document.querySelector('link[rel="canonical"]')?.href ?? "",
        openGraphTitle: document.querySelector('meta[property="og:title"]')?.content ?? "",
        twitterTitle: document.querySelector('meta[name="twitter:title"]')?.content ?? "",
        routeJsonLdCount: document.querySelectorAll("#route-seo-jsonld").length,
        descriptionTagCount: document.querySelectorAll('meta[name="description"]').length,
        canonicalTagCount: document.querySelectorAll('link[rel="canonical"]').length,
    }));
}

function validateMetadata(route, metadata, scope) {
    const expected = CONFIG.routes[route];
    const canonical = new URL(route, CONFIG.siteUrl).href;
    const checks = [
        ["title", metadata.title === expected.title, "Título da rota não corresponde ao seoRoutes.json."],
        ["description", metadata.description === expected.description, "Meta description não corresponde ao seoRoutes.json."],
        ["canonical", metadata.canonical === canonical, "Canonical não corresponde à URL da rota."],
        ["og-title", metadata.openGraphTitle === expected.title, "Open Graph title não acompanha a rota."],
        ["twitter-title", metadata.twitterTitle === expected.title, "Twitter title não acompanha a rota."],
        ["metadata-unique", metadata.routeJsonLdCount === 1 && metadata.descriptionTagCount === 1 && metadata.canonicalTagCount === 1, "Metadados duplicados ou JSON-LD de rota ausente."],
    ];

    for (const [id, passed, message] of checks) {
        if (!passed) addFailure(scope, id, route + ": " + message);
    }
    return checks.map(([id, passed, message]) => ({ id, passed, message: passed ? "OK" : message }));
}

async function auditDirectRoute(browser, route, viewport) {
    const scope = route + " — " + viewport.label;
    const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        deviceScaleFactor: 1,
        isMobile: viewport.mobile,
        hasTouch: viewport.mobile,
    });
    const page = await context.newPage();
    const pageErrors = [];
    const consoleErrors = [];
    const sameOriginFailures = [];
    const origin = new URL(BASE_URL).origin;

    page.on("pageerror", (error) => pageErrors.push(error.message));
    page.on("console", (message) => {
        if (message.type() === "error") consoleErrors.push(message.text());
    });
    page.on("requestfailed", (request) => {
        try {
            if (new URL(request.url()).origin === origin) {
                sameOriginFailures.push({ url: request.url(), error: request.failure()?.errorText ?? "request failed" });
            }
        } catch {
            // Ignore malformed or non-HTTP request URLs.
        }
    });
    page.on("response", (response) => {
        try {
            if (new URL(response.url()).origin === origin && response.status() >= 400) {
                sameOriginFailures.push({ url: response.url(), status: response.status() });
            }
        } catch {
            // Ignore malformed or non-HTTP response URLs.
        }
    });

    let measurements = null;
    let metadataChecks = [];
    let screenshot = null;
    try {
        await page.goto(new URL(route, BASE_URL).href, { waitUntil: "domcontentloaded", timeout: 60000 });
        await page.locator("main").first().waitFor({ state: "visible", timeout: 25000 });
        await page.locator("h1").first().waitFor({ state: "visible", timeout: 25000 });
        await waitForPreloaderToFinish(page, scope);
        await revealFullPage(page);

        const metadata = await readRouteMetadata(page);
        metadataChecks = validateMetadata(route, metadata, scope);

        measurements = await page.evaluate(() => {
            const visible = (element) => {
                const style = getComputedStyle(element);
                const rect = element.getBoundingClientRect();
                return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
            };
            const controls = [...document.querySelectorAll("button, input, select, textarea, [role='button']")].filter(visible);
            const smallControls = controls
                .map((element) => {
                    const rect = element.getBoundingClientRect();
                    return {
                        element: element.tagName.toLowerCase(),
                        label: element.getAttribute("aria-label") || element.textContent?.trim().slice(0, 60) || element.getAttribute("title") || "",
                        width: Math.round(rect.width),
                        height: Math.round(rect.height),
                    };
                })
                .filter((item) => item.width < 24 || item.height < 24);

            return {
                viewportWidth: window.innerWidth,
                documentWidth: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
                documentHeight: Math.max(document.documentElement.scrollHeight, document.body.scrollHeight),
                visibleMainCount: [...document.querySelectorAll("main")].filter(visible).length,
                visibleH1Count: [...document.querySelectorAll("h1")].filter(visible).length,
                imageCount: document.images.length,
                imagesWithoutAlt: [...document.images].filter((image) => !image.hasAttribute("alt")).length,
                visibleControlCount: controls.length,
                controlsBelow24px: smallControls,
            };
        });

        if (measurements.documentWidth > measurements.viewportWidth + 1) {
            addFailure(scope, "horizontal-overflow", "Documento excede a largura do viewport: " + measurements.documentWidth + "px > " + measurements.viewportWidth + "px.");
        }
        if (measurements.visibleMainCount !== 1) {
            addFailure(scope, "main-landmark", "Esperado exatamente um main visível; encontrado(s): " + measurements.visibleMainCount + ".");
        }
        if (measurements.visibleH1Count !== 1) {
            addFailure(scope, "visible-h1", "Esperado exatamente um H1 visível; encontrado(s): " + measurements.visibleH1Count + ".");
        }
        if (measurements.imagesWithoutAlt > 0) {
            addFailure(scope, "image-alt-attribute", measurements.imagesWithoutAlt + " imagem(ns) sem atributo alt.");
        }
        if (pageErrors.length > 0) {
            addFailure(scope, "uncaught-page-errors", pageErrors.join(" | "));
        }
        if (sameOriginFailures.length > 0) {
            addFailure(scope, "same-origin-resource-failures", JSON.stringify(sameOriginFailures));
        }

        const screenshotDir = path.join(REPORT_DIR, viewport.id);
        await fs.mkdir(screenshotDir, { recursive: true });
        screenshot = path.join("artifacts", "route-uiux", viewport.id, routeSlug(route) + ".png");
        await page.screenshot({
            path: path.join(ROOT, screenshot),
            fullPage: true,
            animations: "disabled",
            timeout: 60000,
        });
    } catch (error) {
        addFailure(scope, "audit-execution", String(error?.stack ?? error));
    } finally {
        results.push({
            route,
            viewport: viewport.label,
            viewportId: viewport.id,
            measurements,
            metadataChecks,
            pageErrors,
            consoleErrors,
            sameOriginFailures,
            screenshot,
        });
        await context.close();
    }
}

async function navigateToRoute(page, route, mobile) {
    if (mobile) {
        const trigger = page.getByRole("button", { name: /abrir menu/i }).first();
        await trigger.waitFor({ state: "visible", timeout: 15000 });
        await trigger.click();
        const menu = page.locator("[data-mobile-menu]");
        await menu.waitFor({ state: "visible", timeout: 10000 });

        const targetLink = route === "/"
            ? page.locator("a[data-mobile-menu-link]").filter({ hasText: "Início" }).first()
            : page.locator('a[data-mobile-menu-link][href="' + route + '"]').first();
        await targetLink.click();
    } else if (route === "/") {
        await page.locator('a[aria-label^="KLEBER DEV"][href="/"]:visible').first().click();
    } else {
        await page.locator('a[href="' + route + '"]:visible').first().click();
    }

    await waitForRoute(page, route);
    const metadata = await readRouteMetadata(page);
    const checks = validateMetadata(route, metadata, (mobile ? "mobile" : "desktop") + " SPA navigation");
    navigationResults.push({ route, mode: mobile ? "mobile menu" : "desktop navigation", metadata, checks });
}

async function auditSpaNavigation(browser, mobile) {
    const label = mobile ? "Mobile SPA navigation" : "Desktop SPA navigation";
    const context = await browser.newContext({
        viewport: mobile ? { width: 390, height: 844 } : { width: 1365, height: 900 },
        deviceScaleFactor: 1,
        isMobile: mobile,
        hasTouch: mobile,
    });
    const page = await context.newPage();
    page.on("pageerror", (error) => addFailure(label, "uncaught-page-error", error.message));

    try {
        await page.goto(new URL("/", BASE_URL).href, { waitUntil: "domcontentloaded", timeout: 60000 });
        await waitForRoute(page, "/");
        validateMetadata("/", await readRouteMetadata(page), label);

        for (const route of ["/projetos", "/sobre", "/contato", "/"]) {
            await navigateToRoute(page, route, mobile);
        }
    } catch (error) {
        addFailure(label, "navigation-flow", String(error?.stack ?? error));
    } finally {
        await context.close();
    }
}

function recordInteraction(scope, id, passed, message) {
    const result = { scope, id, passed, message };
    interactionResults.push(result);
    if (!passed) addFailure(scope, id, message);
    else console.log("[PASS][" + scope + "][" + id + "] " + message);
}

async function auditSkipLink(browser, viewport) {
    const scope = "Skip link — " + viewport.label;
    const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        deviceScaleFactor: 1,
        isMobile: viewport.mobile,
        hasTouch: viewport.mobile,
    });
    const page = await context.newPage();

    try {
        await page.goto(new URL("/", BASE_URL).href, { waitUntil: "domcontentloaded", timeout: 60000 });
        await page.locator("main#main-content").waitFor({ state: "visible", timeout: 25000 });
        await waitForPreloaderToFinish(page, scope);
        await page.keyboard.press("Tab");

        const focusedLink = await page.evaluate(() => ({
            text: document.activeElement?.textContent?.trim() ?? "",
            visible: (() => {
                const rect = document.activeElement?.getBoundingClientRect();
                const style = document.activeElement ? getComputedStyle(document.activeElement) : null;
                return Boolean(rect && style && rect.width > 0 && rect.height > 0 && style.visibility !== "hidden");
            })(),
        }));
        const linkFocused = focusedLink.text.includes("Pular para o conteúdo principal") && focusedLink.visible;
        recordInteraction(scope, "skip-link-keyboard-focus", linkFocused,
            linkFocused ? "O primeiro Tab revela o link para o conteúdo principal." : "O primeiro Tab não revelou o link de salto.");

        await page.keyboard.press("Enter");
        const focusMovedToMain = await page.evaluate(() => document.activeElement?.id === "main-content");
        recordInteraction(scope, "skip-link-main-focus", focusMovedToMain,
            focusMovedToMain ? "O link move o foco para main#main-content." : "O link não moveu o foco para main#main-content.");
    } catch (error) {
        recordInteraction(scope, "skip-link-execution", false, String(error?.message ?? error));
    } finally {
        await context.close();
    }
}

async function auditProjectInteractions(browser, viewport) {
    const scope = "Projetos — " + viewport.label;
    const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        deviceScaleFactor: 1,
        isMobile: viewport.mobile,
        hasTouch: viewport.mobile,
    });
    const page = await context.newPage();

    try {
        await page.goto(new URL("/projetos", BASE_URL).href, { waitUntil: "domcontentloaded", timeout: 60000 });
        await page.locator("main").first().waitFor({ state: "visible", timeout: 25000 });
        await waitForPreloaderToFinish(page, scope);

        const rows = page.locator("[data-project-id]");
        await rows.first().waitFor({ state: "visible", timeout: 20000 });
        const initialIds = await rows.evaluateAll((items) => items.map((item) => item.getAttribute("data-project-id")));
        recordInteraction(scope, "catalog-initial-page", initialIds.length === 10,
            "A primeira página exibe " + initialIds.length + " projetos (esperado: 10).");

        const next = page.getByRole("button", { name: "Próxima página" });
        const canPaginate = await next.count() > 0 && await next.isEnabled();
        if (canPaginate) {
            const previousFirstId = initialIds[0];
            await next.click();
            await page.waitForFunction(
                (id) => document.querySelector("[data-project-id]")?.getAttribute("data-project-id") !== id,
                previousFirstId,
                { timeout: 12000 },
            );
            const secondPageIds = await rows.evaluateAll((items) => items.map((item) => item.getAttribute("data-project-id")));
            const changed = secondPageIds.length > 0 && secondPageIds[0] !== previousFirstId;
            recordInteraction(scope, "catalog-pagination-next", changed,
                changed ? "A paginação alterou o conjunto de projetos." : "A paginação não alterou os projetos.");
        } else {
            recordInteraction(scope, "catalog-pagination-next", false, "Não há próxima página em Todos.");
        }

        const filter = page.getByRole("button", { name: /^Front-end,/ }).first();
        await filter.waitFor({ state: "visible", timeout: 15000 });
        const label = await filter.getAttribute("aria-label");
        const expectedCount = Number(label?.match(/(\d+) projetos?$/)?.[1] ?? NaN);
        await filter.click();
        await page.waitForFunction(() => [...document.querySelectorAll('button[aria-pressed="true"]')]
            .some((element) => (element.getAttribute("aria-label") || "").startsWith("Front-end,")), null, { timeout: 10000 });

        const filteredIds = await rows.evaluateAll((items) => items.map((item) => item.getAttribute("data-project-id")));
        const expectedVisible = Number.isFinite(expectedCount) ? Math.min(expectedCount, 10) : -1;
        recordInteraction(scope, "catalog-category-filter", filteredIds.length === expectedVisible,
            "Filtro Front-end: " + filteredIds.length + " projetos visíveis; esperado: " + expectedVisible + ".");

        const activeFilterCount = await page.locator('button[aria-pressed="true"][aria-label^="Front-end,"]').count();
        recordInteraction(scope, "catalog-filter-aria-pressed", activeFilterCount === 1,
            activeFilterCount === 1 ? "Filtro ativo expõe aria-pressed=true." : "Filtro ativo não expõe estado acessível único.");
    } catch (error) {
        recordInteraction(scope, "catalog-interaction-execution", false, String(error?.message ?? error));
    } finally {
        await context.close();
    }
}

async function fillValidContactForm(page) {
    await page.locator('input[name="nome"]').fill("Pessoa de Teste");
    await page.locator('input[name="email"]').fill("teste@example.com");
    await page.locator('input[name="assunto"]').fill("Teste automatizado");
    await page.locator('textarea[name="mensagem"]').fill("Esta é uma mensagem fictícia usada somente na auditoria automatizada.");
}

async function auditContactForm(browser, viewport) {
    const scope = "Contato — " + viewport.label;
    const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        deviceScaleFactor: 1,
        isMobile: viewport.mobile,
        hasTouch: viewport.mobile,
    });
    const page = await context.newPage();
    let mockMode = "success";
    let interceptedRequests = 0;

    try {
        await page.route("https://usebasin.com/f/route-uiux-audit", async (route) => {
            if (route.request().method() !== "POST") {
                await route.continue();
                return;
            }
            interceptedRequests += 1;
            await route.fulfill({
                status: mockMode === "success" ? 200 : 422,
                contentType: "application/json",
                body: JSON.stringify({ success: mockMode === "success" }),
            });
        });

        await page.goto(new URL("/contato", BASE_URL).href, { waitUntil: "domcontentloaded", timeout: 60000 });
        await page.locator('form input[name="nome"]').waitFor({ state: "visible", timeout: 25000 });
        await waitForPreloaderToFinish(page, scope);

        const form = page.locator("form").first();
        const name = form.locator('input[name="nome"]');
        const email = form.locator('input[name="email"]');
        const subject = form.locator('input[name="assunto"]');
        const message = form.locator('textarea[name="mensagem"]');
        const submit = form.locator('button[type="submit"]');

        await name.fill("K");
        await name.blur();
        const nameInvalid = await name.getAttribute("aria-invalid") === "true" && Boolean(await name.getAttribute("aria-describedby"));
        recordInteraction(scope, "form-name-validation", nameInvalid,
            nameInvalid ? "Nome inválido recebe aria-invalid e aria-describedby." : "Nome inválido sem estado acessível de erro.");

        await name.fill("Pessoa de Teste");
        await email.fill("email-invalido");
        await email.blur();
        const emailInvalid = await email.getAttribute("aria-invalid") === "true" && Boolean(await email.getAttribute("aria-describedby"));
        recordInteraction(scope, "form-email-validation", emailInvalid,
            emailInvalid ? "E-mail inválido recebe aria-invalid e aria-describedby." : "E-mail inválido sem estado acessível de erro.");

        await email.fill("teste@example.com");
        await subject.fill("Teste automatizado");
        await message.fill("Esta é uma mensagem fictícia usada somente na auditoria automatizada.");
        const enabled = await submit.isEnabled();
        recordInteraction(scope, "form-valid-enables-submit", enabled,
            enabled ? "Quatro campos válidos habilitam o envio." : "Envio permaneceu desabilitado com campos válidos.");

        await submit.click();
        await form.locator('[role="status"]').filter({ hasText: "Mensagem enviada com sucesso." })
            .waitFor({ state: "visible", timeout: 12000 });
        recordInteraction(scope, "form-success-state", interceptedRequests === 1,
            interceptedRequests === 1 ? "Resposta de sucesso simulada foi interceptada." : "Envio de sucesso não foi interceptado uma única vez.");

        mockMode = "failure";
        await fillValidContactForm(page);
        await submit.waitFor({ state: "visible", timeout: 10000 });
        await page.waitForFunction(() => {
            const button = document.querySelector('form button[type="submit"]');
            return Boolean(button && !button.disabled);
        }, null, { timeout: 10000 });
        const retryButtonState = await submit.evaluate((button) => ({
            disabled: button.disabled,
            text: button.textContent?.trim() ?? "",
        }));
        recordInteraction(scope, "form-retry-enabled-after-reset", !retryButtonState.disabled,
            !retryButtonState.disabled
                ? "Após o reset, preencher novamente os campos válidos reabilita o envio."
                : "Após o reset, o botão continuou desabilitado: " + retryButtonState.text);
        await submit.click();
        const errorAlert = form.locator('[role="alert"]');
        await errorAlert.waitFor({ state: "visible", timeout: 12000 });
        const errorText = await errorAlert.textContent();
        recordInteraction(scope, "form-error-state", interceptedRequests === 2 && errorText?.includes("Não foi possível enviar a mensagem"),
            interceptedRequests === 2 && errorText?.includes("Não foi possível enviar a mensagem")
                ? "Resposta HTTP simulada de falha apresenta alerta acessível."
                : "A resposta simulada de falha não gerou o alerta acessível esperado.");
    } catch (error) {
        recordInteraction(scope, "form-interaction-execution", false, String(error?.message ?? error));
    } finally {
        await context.close();
    }
}

async function main() {
    await fs.mkdir(REPORT_DIR, { recursive: true });
    const browser = await chromium.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-dev-shm-usage"],
    });

    try {
        for (const viewport of viewports) {
            for (const route of Object.keys(CONFIG.routes)) {
                console.log("Auditoria UI/UX: " + route + " — " + viewport.label);
                await auditDirectRoute(browser, route, viewport);
            }
        }

        await auditSpaNavigation(browser, false);
        await auditSpaNavigation(browser, true);

        for (const viewport of [
            { id: "desktop-1365", label: "Desktop 1365×900", width: 1365, height: 900, mobile: false },
            { id: "mobile-390", label: "Mobile 390×844", width: 390, height: 844, mobile: true },
        ]) {
            await auditSkipLink(browser, viewport);
            await auditProjectInteractions(browser, viewport);
            await auditContactForm(browser, viewport);
        }
    } finally {
        await browser.close();
    }

    const report = {
        generatedAt: new Date().toISOString(),
        baseUrl: BASE_URL,
        routes: Object.keys(CONFIG.routes),
        viewports,
        directRouteAudits: results,
        spaNavigation: navigationResults,
        interactionAudits: interactionResults,
        failures,
        summary: {
            scenarios: results.length,
            spaNavigationChecks: navigationResults.length,
            interactionChecks: interactionResults.length,
            interactionFailures: interactionResults.filter((item) => !item.passed).length,
            failures: failures.length,
        },
        notes: [
            "Controles menores que 24×24 px são registrados para revisão; não são reprovados automaticamente porque o WCAG 2.2 possui exceções contextuais para alvos de interação.",
            "Erros de console são registrados para triagem; falhas de execução não capturadas e recursos da mesma origem com status de erro reprovam o cenário.",
            "Capturas de tela exigem revisão visual humana; o teste geométrico não substitui avaliação de legibilidade, hierarquia, qualidade visual ou usabilidade.",
        ],
    };

    await fs.writeFile(path.join(REPORT_DIR, "route-uiux-report.json"), JSON.stringify(report, null, 2) + "\n");
    const lines = [
        "# Route UI/UX audit",
        "",
        "- Base URL: " + BASE_URL,
        "- Rotas: " + report.routes.join(", "),
        "- Cenários diretos: " + report.summary.scenarios,
        "- Checagens de navegação SPA: " + report.summary.spaNavigationChecks,
        "- Checagens funcionais: " + report.summary.interactionChecks,
        "- Falhas funcionais: " + report.summary.interactionFailures,
        "- Falhas: " + report.summary.failures,
        "",
        "## Resultados por rota e viewport",
        "",
        "| Rota | Viewport | Largura do documento | H1 visíveis | Main visível | Imagens sem alt | Controles <24px | Captura |",
        "|---|---|---:|---:|---:|---:|---:|---|",
    ];

    for (const item of results) {
        const m = item.measurements;
        lines.push("| " + item.route + " | " + item.viewport + " | " +
            (m ? m.documentWidth + " / " + m.viewportWidth + " px" : "—") + " | " +
            (m?.visibleH1Count ?? "—") + " | " + (m?.visibleMainCount ?? "—") + " | " +
            (m?.imagesWithoutAlt ?? "—") + " | " + (m?.controlsBelow24px?.length ?? "—") + " | " +
            (item.screenshot || "—") + " |");
    }

    lines.push("", "## Navegação SPA", "");
    for (const item of navigationResults) {
        lines.push("- " + item.mode + " → **" + item.route + "**: " +
            (item.checks.every((check) => check.passed) ? "metadados sincronizados" : "metadados com falha"));
    }

    lines.push("", "## Interações funcionais", "");
    for (const item of interactionResults) {
        lines.push("- " + (item.passed ? "PASS" : "FAIL") + " — " + item.scope + " — " + item.id + ": " + item.message);
    }

    lines.push(
        "",
        "## Falhas",
        "",
        ...(failures.length ? failures.map((item) => "- **" + item.scope + " — " + item.id + ":** " + item.message) : ["- Nenhuma falha automatizada encontrada."]),
        "",
        "## Observações",
        "",
        ...report.notes.map((note) => "- " + note),
        "",
    );

    await fs.writeFile(path.join(REPORT_DIR, "summary.md"), lines.join("\n"), "utf8");
    console.log(lines.join("\n"));
    if (failures.length > 0) process.exitCode = 1;
}

await main();

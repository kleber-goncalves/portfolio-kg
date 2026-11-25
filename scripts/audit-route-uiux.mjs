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
        failures,
        summary: {
            scenarios: results.length,
            spaNavigationChecks: navigationResults.length,
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

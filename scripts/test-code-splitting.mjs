import assert from "node:assert/strict";
import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL || "http://127.0.0.1:4173/";
const browser = await chromium.launch({ headless: true });

function makeRecorder(page) {
    const scripts = new Set();
    const errors = [];

    page.on("request", (request) => {
        if (request.resourceType() !== "script") return;
        try {
            const name = new URL(request.url()).pathname.split("/").pop();
            if (name?.endsWith(".js")) scripts.add(name);
        } catch {
            // Ignora URLs de script que não possam ser interpretadas.
        }
    });

    page.on("pageerror", (error) => errors.push(error.message));
    return { scripts, errors };
}

function hasChunk(scripts, prefix) {
    return [...scripts].some((name) => name.startsWith(prefix) && name.endsWith(".js"));
}

async function waitForReadySection(page, id) {
    await page.locator("#" + id + '[aria-busy="false"]').waitFor({
        state: "attached",
        timeout: 60000,
    });
}

async function testViewport({ width, height, mobile }) {
    const context = await browser.newContext({
        viewport: { width, height },
        deviceScaleFactor: mobile ? 3 : 1,
        isMobile: mobile,
        hasTouch: mobile,
        reducedMotion: "no-preference",
    });
    const page = await context.newPage();
    const { scripts, errors } = makeRecorder(page);

    try {
        await page.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
        await page.waitForFunction(() =>
            Boolean(
                document.querySelector('[data-deferred-section="competencia"]') &&
                document.querySelector('[data-deferred-section="diferenciais"]') &&
                document.querySelector('[data-deferred-section="formacao"]') &&
                document.querySelector('[data-deferred-section="footer"]') &&
                document.querySelector("#projetos")
            ),
            null,
            { timeout: 60000 },
        );
        await page.waitForTimeout(500);

        const initialScripts = new Set(scripts);
        assert.equal(
            hasChunk(initialScripts, "Formacao-"),
            false,
            "A seção Formação não deve ser transferida na primeira tela.",
        );
        assert.equal(
            hasChunk(initialScripts, "Footer-"),
            false,
            "O Footer não deve ser transferido na primeira tela.",
        );

        if (mobile) {
            assert.equal(
                hasChunk(initialScripts, "SeclogsMobile-"),
                false,
                "A seção de tecnologias mobile não deve ser baixada na primeira tela.",
            );

            // Ao aproximar-se de Stack, carrega os logotipos e preserva a atualização dos ScrollTriggers.
            await page.locator("#stack").scrollIntoViewIfNeeded();
            await page.getByText(/TECNOLOGIAS & FERRAMENTAS/).waitFor({
                state: "attached",
                timeout: 60000,
            });
            await page.waitForFunction(
                () => performance.getEntriesByType("resource").some((entry) =>
                    new URL(entry.name).pathname.split("/").pop()?.startsWith("SeclogsMobile-")
                ),
                null,
                { timeout: 60000 },
            );
            assert.equal(
                hasChunk(scripts, "SeclogsMobile-"),
                true,
                "O chunk de tecnologias mobile deve carregar quando Stack se aproxima da viewport.",
            );
        }

        // Carrega Projetos apenas ao aproximar-se da seção.
        await page.locator("#projetos").scrollIntoViewIfNeeded();

        if (mobile) {
            await page.locator("#projetos .swiper").waitFor({
                state: "attached",
                timeout: 60000,
            });
            await page.waitForFunction(
                () => performance.getEntriesByType("resource").some((entry) =>
                    new URL(entry.name).pathname.split("/").pop()?.startsWith("ProjetoCarouselMobile-")
                ),
                null,
                { timeout: 60000 },
            );

            assert.equal(
                hasChunk(scripts, "ProjetoDesktop-"),
                false,
                "O celular não deve baixar o chunk exclusivo do ProjetoDesktop.",
            );
            assert.equal(
                hasChunk(scripts, "ProjetoCarouselMobile-"),
                true,
                "O carrossel Swiper mobile deve ser carregado quando Projetos é solicitado.",
            );
        } else {
            await page.locator('#projetos [data-project-index="0"]').waitFor({
                state: "attached",
                timeout: 60000,
            });
            await page.waitForFunction(
                () => performance.getEntriesByType("resource").some((entry) =>
                    new URL(entry.name).pathname.split("/").pop()?.startsWith("ProjetoDesktop-")
                ),
                null,
                { timeout: 60000 },
            );

            assert.equal(
                hasChunk(scripts, "ProjetoDesktop-"),
                true,
                "Desktop deve baixar o chunk do ProjetoDesktop ao carregar Projetos.",
            );
            assert.equal(
                hasChunk(scripts, "ProjetoCarouselMobile-"),
                false,
                "Desktop não deve baixar o chunk do carrossel mobile.",
            );
        }

        // Os IDs das âncoras existem mesmo antes dos chunks serem carregados.
        await page.locator("#formacao").scrollIntoViewIfNeeded();
        await waitForReadySection(page, "formacao");
        assert.equal(
            hasChunk(scripts, "Formacao-"),
            true,
            "Formação deve ser carregada ao aproximar-se da seção.",
        );

        await page.locator("#footer").scrollIntoViewIfNeeded();
        await waitForReadySection(page, "footer");
        assert.equal(
            hasChunk(scripts, "Footer-"),
            true,
            "Footer deve ser carregado ao aproximar-se do final da página.",
        );

        const relevantErrors = errors.filter((message) =>
            /tecnologias is not defined|Failed to fetch dynamically imported module|ProjetoDesktop|ProjetoCarouselMobile|SeclogsMobile|DeferredLayoutSection|ScrollTrigger/i.test(message)
        );
        assert.deepEqual(
            relevantErrors,
            [],
            "Erros de runtime relacionados ao code splitting: " + relevantErrors.join(" | "),
        );

        console.log(JSON.stringify({
            viewport: mobile ? "mobile" : "desktop",
            width,
            initialFormacaoChunk: hasChunk(initialScripts, "Formacao-"),
            initialFooterChunk: hasChunk(initialScripts, "Footer-"),
            initialSeclogsMobileChunk: hasChunk(initialScripts, "SeclogsMobile-"),
            seclogsMobileChunk: hasChunk(scripts, "SeclogsMobile-"),
            projectDesktopChunk: hasChunk(scripts, "ProjetoDesktop-"),
            projectCarouselMobileChunk: hasChunk(scripts, "ProjetoCarouselMobile-"),
            deferredFormacaoLoaded: hasChunk(scripts, "Formacao-"),
            deferredFooterLoaded: hasChunk(scripts, "Footer-"),
            result: "passed",
        }));
    } finally {
        await context.close();
    }
}

try {
    await testViewport({ width: 390, height: 844, mobile: true });
    await testViewport({ width: 1365, height: 900, mobile: false });
    console.log("Deferred sections and viewport-specific project chunks passed.");
} finally {
    await browser.close();
}

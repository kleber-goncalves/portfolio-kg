import assert from "node:assert/strict";
import { chromium } from "playwright";

const baseUrl = process.env.MENU_TEST_URL || "http://127.0.0.1:4173/";
const viewport = { width: 1365, height: 900 };

function logBrowserDiagnostics(page, scenario) {
    page.on("console", (message) => {
        if (message.type() === "error") {
            console.log(`[browser console error][${scenario}] ${message.text()}`);
        }
    });

    page.on("pageerror", (error) => {
        console.log(`[browser pageerror][${scenario}] ${error.message}`);
    });
}

async function waitForPageReady(page, expectedMode, options = {}) {
    if (options.navigate !== false) {
        await page.goto(baseUrl, {
            waitUntil: "domcontentloaded",
            timeout: 60000,
        });
    }

    const actualMode = await page.evaluate(() => localStorage.getItem("experienceMode"));
    assert.equal(
        actualMode,
        expectedMode,
        "Expected experienceMode=" + expectedMode + ", got " + String(actualMode) + ".",
    );

    await page.waitForFunction(
        () => document.body?.style.overflow !== "hidden" &&
            !document.querySelector('[role="status"]'),
        null,
        { timeout: 30000 },
    );

    // Aguarda o Hero lazy e a inicialização do menu após o layout.
    await page.waitForTimeout(1200);
}

async function readHamburgerState(page) {
    return page.evaluate(() => {
        const button = document.querySelector(
            'button[aria-label="Abrir menu"], button[aria-label="Fechar menu"]',
        );

        const hero = document.querySelector("#hero");
        const stack = document.querySelector("#stack");
        const media = {
            width: window.innerWidth,
            height: window.innerHeight,
            touchQuery: window.matchMedia("(hover: none) and (pointer: coarse)").matches,
            finePointer: window.matchMedia("(pointer: fine)").matches,
            hover: window.matchMedia("(hover: hover)").matches,
            landscape: window.matchMedia("(orientation: landscape)").matches,
            desktopHeroContent: Boolean(document.querySelector('[data-hero-element="dotfield"]')),
            mobileHeroContent: Boolean(document.querySelector("#hero img[alt='Retrato de Kleber Gonçalves']")),
            pinSpacerCount: document.querySelectorAll(".pin-spacer").length,
            stackTransform: stack ? getComputedStyle(stack).transform : null,
            stackTranslate: stack ? getComputedStyle(stack).translate : null,
            stackRectTop: stack?.getBoundingClientRect().top ?? null,
        };

        if (!button) {
            return {
                exists: false,
                label: null,
                opacity: 0,
                pointerEvents: "none",
                scrollY: window.scrollY,
                heroBottom: hero?.getBoundingClientRect().bottom ?? null,
                diagnostics: media,
            };
        }

        const style = getComputedStyle(button);
        const rect = button.getBoundingClientRect();

        return {
            exists: true,
            label: button.getAttribute("aria-label"),
            opacity: Number(style.opacity),
            pointerEvents: style.pointerEvents,
            width: rect.width,
            height: rect.height,
            scrollY: window.scrollY,
            heroBottom: hero?.getBoundingClientRect().bottom ?? null,
            diagnostics: media,
        };
    });
}

function isHamburgerAvailable(state) {
    return state.exists &&
        state.opacity >= 0.8 &&
        state.pointerEvents === "auto" &&
        state.width > 0 &&
        state.height > 0;
}

async function assertHamburgerAvailable(page, scenario) {
    let waitError = null;

    try {
        await page.waitForFunction(() => {
            const button = document.querySelector(
                'button[aria-label="Abrir menu"], button[aria-label="Fechar menu"]',
            );

            if (!button) return false;

            const style = getComputedStyle(button);
            const rect = button.getBoundingClientRect();

            return Number(style.opacity) >= 0.8 &&
                style.pointerEvents === "auto" &&
                rect.width > 0 &&
                rect.height > 0;
        }, null, { timeout: 10000 });
    } catch (error) {
        waitError = error;
    }

    const state = await readHamburgerState(page);
    assert.ok(
        isHamburgerAvailable(state),
        scenario + ": desktop hamburger is missing or hidden. State=" +
            JSON.stringify(state) + "; waitError=" + (waitError?.message ?? "none"),
    );

    return state;
}

async function scrollUntilHamburgerAvailable(page, scenario) {
    for (let step = 0; step < 30; step += 1) {
        await page.mouse.wheel(0, 420);
        await page.waitForTimeout(150);

        const state = await readHamburgerState(page);
        if (isHamburgerAvailable(state)) return state;
    }

    const state = await readHamburgerState(page);
    assert.fail(
        scenario + ": hamburger never became available while scrolling. State=" +
        JSON.stringify(state),
    );
}

async function testFullToReduced(page) {
    console.log("Testing real Full -> Reduced switch and menu visibility");

    // Seleciona Full apenas na primeira navegação; o reload real deve preservar Reduced.
    await page.context().addInitScript(() => {
        try {
            if (sessionStorage.getItem("__menu_mode_initialized") !== "1") {
                localStorage.setItem("experienceMode", "full");
                sessionStorage.setItem("__menu_mode_initialized", "1");
            }
        } catch {
            // The about:blank origin may not expose localStorage.
        }
    });

    await waitForPageReady(page, "full");
    const before = await scrollUntilHamburgerAvailable(page, "Full before switching mode");

    await page.locator('button[aria-label="Abrir menu"]').click();
    const reducedOption = page.locator('[data-experience-mode-option="reduced"]');
    await reducedOption.waitFor({ state: "visible", timeout: 10000 });

    const reload = page.waitForNavigation({
        waitUntil: "domcontentloaded",
        timeout: 60000,
    });

    await reducedOption.click();
    await reload;
    await waitForPageReady(page, "reduced", { navigate: false });

    // O navegador pode restaurar a posição antiga depois do reload mesmo com scrollTo(0, 0).
    // Não exigimos uma posição específica: verificamos que o menu se torna acessível
    // no Reduced, seja a página reaberta no topo ou no meio do conteúdo.
    const afterSwitchScrollY = await page.evaluate(() => window.scrollY);
    const after = await scrollUntilHamburgerAvailable(page, "Reduced after real mode switch");

    console.log(JSON.stringify({
        scenario: "Full -> Reduced via real MenuDesktop",
        scrollBeforeSwitch: Math.round(before.scrollY),
        scrollAfterReload: Math.round(afterSwitchScrollY),
        menuAfterScrollingInReduced: isHamburgerAvailable(after),
    }));
}

async function testReducedReloadAtMiddle(browser) {
    const context = await browser.newContext({
        viewport,
        deviceScaleFactor: 1,
        isMobile: false,
        hasTouch: false,
        reducedMotion: "no-preference",
    });

    await context.addInitScript(() => {
        try {
            localStorage.setItem("experienceMode", "reduced");
            // Controla a posição no próprio teste: Chromium nem sempre restaura reloads
            // programáticos da mesma forma que uma atualização manual do navegador.
            history.scrollRestoration = "manual";

            window.addEventListener("DOMContentLoaded", () => {
                if (sessionStorage.getItem("__menu_test_restore_midpage") !== "1") return;

                sessionStorage.removeItem("__menu_test_restore_midpage");
                document.documentElement.style.scrollBehavior = "auto";

                // Restaura após o HTML inicial, mas antes de o Hero lazy concluir onReady.
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        const target = document.querySelector("#competencias");
                        if (!target) return;

                        const targetY =
                            window.scrollY +
                            target.getBoundingClientRect().top -
                            window.innerHeight * 0.25;

                        window.scrollTo(0, Math.max(0, targetY));
                    });
                });
            });
        } catch {
            // Ignore storage access failures before navigation.
        }
    });

    const page = await context.newPage();
    logBrowserDiagnostics(page, "reduced-midpage-refresh");

    try {
        console.log("Testing Reduced refresh while scrolled away from Hero");
        await waitForPageReady(page, "reduced");

        await page.locator("#competencias").scrollIntoViewIfNeeded();
        await page.waitForTimeout(350);

        const beforeReload = await assertHamburgerAvailable(
            page,
            "Reduced before refresh at mid-page",
        );

        assert.ok(
            beforeReload.scrollY > viewport.height,
            "The test must refresh away from Hero; scrollY=" + beforeReload.scrollY + ".",
        );

        // Força uma restauração de posição controlada durante o reload para reproduzir
        // o cenário sem depender do comportamento variável de scroll restoration do Chromium.
        await page.evaluate(() => {
            sessionStorage.setItem("__menu_test_restore_midpage", "1");
        });

        await page.reload({
            waitUntil: "domcontentloaded",
            timeout: 60000,
        });
        await waitForPageReady(page, "reduced", { navigate: false });

        const afterReload = await readHamburgerState(page);
        assert.ok(
            afterReload.scrollY > viewport.height,
            "The browser did not restore the mid-page position; regression scenario not reproduced. scrollY=" +
                afterReload.scrollY + ".",
        );

        await assertHamburgerAvailable(
            page,
            "Reduced after refresh with restored mid-page scroll",
        );

        console.log(JSON.stringify({
            scenario: "Reduced reload with scroll restoration",
            scrollBeforeReload: Math.round(beforeReload.scrollY),
            scrollAfterReload: Math.round(afterReload.scrollY),
            menuVisible: true,
        }));
    } finally {
        await context.close();
    }
}

const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

try {
    const switchContext = await browser.newContext({
        viewport,
        deviceScaleFactor: 1,
        isMobile: false,
        hasTouch: false,
        reducedMotion: "no-preference",
    });

    try {
        const switchPage = await switchContext.newPage();
        logBrowserDiagnostics(switchPage, "full-to-reduced");
        await testFullToReduced(switchPage);
    } finally {
        await switchContext.close();
    }

    await testReducedReloadAtMiddle(browser);
} finally {
    await browser.close();
}

console.log("MenuDesktop Reduced visibility regression checks passed.");

import assert from "node:assert/strict";
import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL || "http://127.0.0.1:4173/";
const browser = await chromium.launch({ headless: true });

function panelLocator(page) {
    return page.getByRole("heading", { name: "Redes Sociais", exact: true })
        .locator("xpath=../../..");
}

async function createPage(cpuThrottleRate = 1) {
    const context = await browser.newContext({
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
        reducedMotion: "no-preference",
    });
    const page = await context.newPage();

    await page.addInitScript(() => {
        const diag = {
            awaitingMount: false,
            panelMountedAt: null,
            clickAt: null,
            pointerDownAt: null,
            pointerUpAt: null,
            longTasks: [],
        };
        window.__socialsPerf = diag;

        const isOpenButton = (target) =>
            target instanceof Element &&
            Boolean(target.closest('button[aria-label="Arraste para abrir as redes sociais"]'));

        document.addEventListener("click", (event) => {
            if (isOpenButton(event.target)) {
                diag.clickAt = performance.now();
            }
        }, true);

        document.addEventListener("pointerdown", (event) => {
            if (isOpenButton(event.target)) {
                diag.pointerDownAt = performance.now();
            }
        }, true);

        document.addEventListener("pointerup", (event) => {
            if (isOpenButton(event.target)) {
                diag.pointerUpAt = performance.now();
            }
        }, true);

        const containsSocialsHeading = (node) => {
            if (!(node instanceof Element)) return false;
            if (node.matches("h2") && node.textContent.trim() === "Redes Sociais") {
                return true;
            }
            return Array.from(node.querySelectorAll("h2"))
                .some((heading) => heading.textContent.trim() === "Redes Sociais");
        };

        new MutationObserver((mutations) => {
            if (!diag.awaitingMount || diag.panelMountedAt !== null) return;
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (containsSocialsHeading(node)) {
                        diag.panelMountedAt = performance.now();
                        return;
                    }
                }
            }
        }).observe(document, { childList: true, subtree: true });

        if ("PerformanceObserver" in window) {
            try {
                new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        diag.longTasks.push({
                            startTime: entry.startTime,
                            duration: entry.duration,
                        });
                    }
                }).observe({ type: "longtask", buffered: true });
            } catch {
                // Navegadores sem suporte ao entry type "longtask" seguem o teste.
            }
        }
    });

    const navigationStartedAt = Date.now();
    await page.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 60000 });

    const preloader = page.locator('[aria-label^="Carregamento do site:"]');
    await preloader.waitFor({ state: "attached", timeout: 30000 });
    await preloader.waitFor({ state: "detached", timeout: 60000 });

    const preloaderDismissMs = Date.now() - navigationStartedAt;
    console.log(JSON.stringify({
        check: "preloader-interactive-readiness",
        cpuThrottleRate,
        navigationToPreloaderDismissMs: preloaderDismissMs,
        result: "passed",
    }));

    if (cpuThrottleRate > 1) {
        const cdp = await context.newCDPSession(page);
        await cdp.send("Emulation.setCPUThrottlingRate", { rate: cpuThrottleRate });
    }

    return { context, page, preloaderDismissMs };
}

async function resetMeasurements(page) {
    await page.evaluate(() => {
        const diag = window.__socialsPerf;
        diag.awaitingMount = true;
        diag.panelMountedAt = null;
        diag.clickAt = null;
        diag.pointerDownAt = null;
        diag.pointerUpAt = null;
        diag.longTasks = [];
        diag.resourceStartAt = performance.now();
    });
}

async function readMetrics(page, mode, iteration, cpuThrottleRate) {
    const metrics = await page.evaluate(() => {
        const diag = window.__socialsPerf;
        const startAt = modeIsClick ? diag.clickAt : diag.pointerDownAt;
        const panelMountedAt = diag.panelMountedAt;
        const fadeStartedAt = performance.now();
        const resources = performance.getEntriesByType("resource")
            .filter((entry) => entry.startTime >= diag.resourceStartAt)
            .filter((entry) => entry.initiatorType === "script" || /\.js(?:$|\?)/i.test(entry.name))
            .map((entry) => ({
                name: entry.name.split("/").pop(),
                startMsAfterInteraction: Math.round(entry.startTime - diag.resourceStartAt),
                durationMs: Math.round(entry.duration),
            }));

        return {
            interactionStartAt: startAt,
            panelMountedAt,
            clickAt: diag.clickAt,
            pointerDownAt: diag.pointerDownAt,
            pointerUpAt: diag.pointerUpAt,
            pointerUpToPanelMountedMs: diag.pointerUpAt === null || panelMountedAt === null
                ? null
                : Math.round(panelMountedAt - diag.pointerUpAt),
            interactionToPanelMountedMs: startAt === null || panelMountedAt === null
                ? null
                : Math.round(panelMountedAt - startAt),
            longTasks: diag.longTasks
                .filter((entry) => entry.startTime >= diag.resourceStartAt)
                .map((entry) => ({
                    startMsAfterInteraction: Math.round(entry.startTime - diag.resourceStartAt),
                    durationMs: Math.round(entry.duration),
                })),
            javascriptResourcesStartedAfterInteraction: resources,
        };
    }, { modeIsClick: mode === "click" });

    const panel = panelLocator(page);
    await page.waitForFunction(() => {
        const heading = Array.from(document.querySelectorAll("h2"))
            .find((element) => element.textContent.trim() === "Redes Sociais");
        const root = heading?.parentElement?.parentElement?.parentElement;
        return root && Number.parseFloat(getComputedStyle(root).opacity) < 0.98;
    }, null, { timeout: 5000 });

    const fadeStartedAt = await page.evaluate(() => performance.now());
    await page.waitForFunction(() => {
        const heading = Array.from(document.querySelectorAll("h2"))
            .find((element) => element.textContent.trim() === "Redes Sociais");
        const root = heading?.parentElement?.parentElement?.parentElement;
        return root && Number.parseFloat(getComputedStyle(root).opacity) >= 0.98;
    }, null, { timeout: 5000 });

    const nearlyVisibleAt = await page.evaluate(() => performance.now());
    const timing = await page.evaluate(({ mode, fadeStartedAt, nearlyVisibleAt }) => {
        const diag = window.__socialsPerf;
        const startAt = mode === "click" ? diag.clickAt : diag.pointerDownAt;
        return {
            interactionToFadeStartedMs: Math.round(fadeStartedAt - startAt),
            interactionToNearlyFullyVisibleMs: Math.round(nearlyVisibleAt - startAt),
            pointerUpToPanelMountedMs: diag.pointerUpAt === null || diag.panelMountedAt === null
                ? null
                : Math.round(diag.panelMountedAt - diag.pointerUpAt),
            estimatedMountOverheadAfter200msSnapMs: diag.pointerUpAt === null || diag.panelMountedAt === null
                ? null
                : Math.round(diag.panelMountedAt - diag.pointerUpAt - 200),
            longTasksDuringOpen: diag.longTasks.map((entry) => ({
                startMsAfterInteraction: Math.round(entry.startTime - (startAt ?? entry.startTime)),
                durationMs: Math.round(entry.duration),
            })),
        };
    }, { mode, fadeStartedAt, nearlyVisibleAt });

    const report = {
        check: "socials-panel-cold-vs-repeat-render",
        mode,
        iteration,
        cpuThrottleRate,
        interactionToPanelMountedMs: metrics.interactionToPanelMountedMs,
        pointerUpToPanelMountedMs: timing.pointerUpToPanelMountedMs,
        estimatedMountOverheadAfter200msSnapMs: timing.estimatedMountOverheadAfter200msSnapMs,
        interactionToFadeStartedMs: timing.interactionToFadeStartedMs,
        interactionToNearlyFullyVisibleMs: timing.interactionToNearlyFullyVisibleMs,
        longTasksDuringOpen: timing.longTasksDuringOpen,
        javascriptResourcesStartedAfterInteraction: metrics.javascriptResourcesStartedAfterInteraction,
    };

    console.log(JSON.stringify(report));

    if (mode === "click") {
        assert.ok(
            metrics.interactionToPanelMountedMs !== null &&
            metrics.interactionToPanelMountedMs < 1500,
            "O painel demorou demais para ser montado após clique.",
        );
    } else {
        assert.ok(
            timing.pointerUpToPanelMountedMs !== null &&
            timing.pointerUpToPanelMountedMs < 1500,
            "O painel demorou demais para ser montado após soltar o arraste.",
        );
    }
    assert.ok(
        timing.interactionToNearlyFullyVisibleMs < 3000,
        "O painel demorou demais para ficar visualmente aberto.",
    );

    return report;
}

async function closePanel(page) {
    await page.getByRole("button", { name: "Fechar redes sociais", exact: true })
        .click({ timeout: 10000 });
    await page.waitForFunction(() =>
        !Array.from(document.querySelectorAll("h2"))
            .some((element) => element.textContent.trim() === "Redes Sociais"),
    null, { timeout: 10000 });
    await page.getByRole("button", {
        name: "Arraste para abrir as redes sociais",
        exact: true,
    }).waitFor({ state: "visible", timeout: 10000 });
}

async function measureClick(page, iteration, cpuThrottleRate) {
    const opener = page.getByRole("button", {
        name: "Arraste para abrir as redes sociais",
        exact: true,
    });
    await opener.scrollIntoViewIfNeeded();
    await resetMeasurements(page);
    await opener.click({ timeout: 10000 });
    await panelLocator(page).waitFor({ state: "attached", timeout: 10000 });
    return readMetrics(page, "click", iteration, cpuThrottleRate);
}

async function measureDrag(page, iteration, cpuThrottleRate) {
    const opener = page.getByRole("button", {
        name: "Arraste para abrir as redes sociais",
        exact: true,
    });
    await opener.scrollIntoViewIfNeeded();
    const box = await opener.boundingBox();
    assert.ok(box, "O botão Socials precisa estar visível antes do arraste.");

    const geometry = await opener.evaluate((button) => ({
        containerWidth: button.parentElement?.parentElement?.offsetWidth ?? 0,
        buttonWidth: button.offsetWidth,
    }));
    const maxDrag = geometry.containerWidth - geometry.buttonWidth - 16;
    assert.ok(maxDrag > 20, "A distância de arraste calculada precisa ser positiva.");

    await resetMeasurements(page);
    const startX = box.x + box.width / 2;
    const startY = box.y + box.height / 2;
    const endX = Math.min(startX + maxDrag * 0.99, 388);

    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(endX, startY, { steps: 12 });
    await page.mouse.up();

    await panelLocator(page).waitFor({ state: "attached", timeout: 10000 });
    return readMetrics(page, "drag", iteration, cpuThrottleRate);
}

try {
    // Contexto limpo: mede a primeira montagem por clique e, depois, uma reabertura.
    const clickTest = await createPage(1);
    const clickFirst = await measureClick(clickTest.page, 1, 1);
    await closePanel(clickTest.page);
    const clickRepeat = await measureClick(clickTest.page, 2, 1);

    const socialsChunk = await clickTest.page.evaluate(() =>
        performance.getEntriesByType("resource")
            .map((entry) => entry.name.split("/").pop())
            .find((name) => /socials/i.test(name)) ?? null,
    );

    // Página nova com CPU 4x mais lento, para aproximar um dispositivo móvel modesto.
    // A limitação é aplicada só depois do preloader para isolar a montagem do painel.
    const dragTest = await createPage(4);
    const dragFirst = await measureDrag(dragTest.page, 1, 4);
    await closePanel(dragTest.page);
    const dragRepeat = await measureDrag(dragTest.page, 2, 4);

    console.log(JSON.stringify({
        check: "socials-panel-render-diagnosis-summary",
        socialsJavaScriptChunkPresentBeforeOpening: Boolean(socialsChunk),
        socialsChunkName: socialsChunk,
        firstClickMountMs: clickFirst.interactionToPanelMountedMs,
        repeatClickMountMs: clickRepeat.interactionToPanelMountedMs,
        firstThrottledDragMountAfterPointerUpMs: dragFirst.pointerUpToPanelMountedMs,
        repeatThrottledDragMountAfterPointerUpMs: dragRepeat.pointerUpToPanelMountedMs,
        firstThrottledDragEstimatedOverheadAfterSnapMs: dragFirst.estimatedMountOverheadAfter200msSnapMs,
        repeatThrottledDragEstimatedOverheadAfterSnapMs: dragRepeat.estimatedMountOverheadAfter200msSnapMs,
        result: "passed",
    }));

    await clickTest.context.close();
    await dragTest.context.close();
} finally {
    await browser.close();
}

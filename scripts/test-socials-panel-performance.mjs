import assert from "node:assert/strict";
import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL || "http://127.0.0.1:4173/";
const browser = await chromium.launch({ headless: true });
const results = [];

function panelRootLocator(page) {
    return page.getByRole("heading", { name: "Redes Sociais", exact: true })
        .locator("xpath=../../..");
}

async function measureOpen(page, opener, iteration) {
    // Prepara o botão no viewport antes de iniciar o cronômetro do clique;
    // assim a rolagem automática do Playwright não contamina a medida de abertura.
    await opener.scrollIntoViewIfNeeded({ timeout: 15000 });

    // Marca o tempo no evento real de clique, não antes da espera de actionability do Playwright.
    await page.evaluate(() => {
        const target = document.querySelector(
            'button[aria-label="Arraste para abrir as redes sociais"]',
        );
        if (!target) throw new Error("Botão de abrir Socials não encontrado.");

        window.__socialsOpenStartedAt = null;
        target.addEventListener("click", () => {
            window.__socialsOpenStartedAt = performance.now();
        }, { once: true, capture: true });
    });

    const actionStartedAt = Date.now();
    await opener.click({ timeout: 15000 });
    const playwrightActionDurationMs = Date.now() - actionStartedAt;

    const panel = panelRootLocator(page);
    await panel.waitFor({ state: "attached", timeout: 5000 });

    const mounted = await page.evaluate(() =>
        performance.now() - window.__socialsOpenStartedAt,
    );

    // Aguarda observar o início do fade-in (opacidade abaixo de 0,98).
    await page.waitForFunction(() => {
        const title = Array.from(document.querySelectorAll("h2"))
            .find((element) => element.textContent.trim() === "Redes Sociais");
        const root = title?.parentElement?.parentElement?.parentElement;
        return root && Number.parseFloat(getComputedStyle(root).opacity) < 0.98;
    }, null, { timeout: 3000 });

    const animationStarted = await page.evaluate(() =>
        performance.now() - window.__socialsOpenStartedAt,
    );

    await page.waitForFunction(() => {
        const title = Array.from(document.querySelectorAll("h2"))
            .find((element) => element.textContent.trim() === "Redes Sociais");
        const root = title?.parentElement?.parentElement?.parentElement;
        return root && Number.parseFloat(getComputedStyle(root).opacity) >= 0.98;
    }, null, { timeout: 3000 });

    const fullyVisible = await page.evaluate(() =>
        performance.now() - window.__socialsOpenStartedAt,
    );

    const resources = await page.evaluate(() => {
        const clickStart = window.__socialsOpenStartedAt;
        return performance.getEntriesByType("resource")
            .filter((entry) => /\.js(?:$|\?)/i.test(entry.name))
            .filter((entry) => entry.startTime >= clickStart)
            .map((entry) => ({
                name: entry.name.split("/").pop(),
                startMsAfterClick: Math.round(entry.startTime - clickStart),
                durationMs: Math.round(entry.duration),
            }));
    });

    const report = {
        iteration,
        playwrightActionDurationMs,
        clickToPanelMountedMs: Math.round(mounted),
        clickToFadeStartedMs: Math.round(animationStarted),
        clickToNearlyFullyVisibleMs: Math.round(fullyVisible),
        javascriptResourcesStartedAfterClick: resources,
    };
    results.push(report);
    console.log(JSON.stringify({ check: "socials-first-open-timing", ...report }));

    assert.ok(mounted < 1000, `O painel levou ${Math.round(mounted)} ms para montar no ciclo ${iteration}.`);
    assert.ok(fullyVisible < 2000, `O painel levou ${Math.round(fullyVisible)} ms para ficar visível no ciclo ${iteration}.`);

    return report;
}

async function measureDragOpen(page, opener, iteration) {
    await opener.scrollIntoViewIfNeeded({ timeout: 15000 });
    const box = await opener.boundingBox();
    assert.ok(box, "O botão Socials precisa ter uma área visível para testar o gesto.");

    const geometry = await opener.evaluate((button) => {
        const shell = button.parentElement?.parentElement;
        return {
            containerWidth: shell?.offsetWidth ?? 0,
            buttonWidth: button.offsetWidth,
        };
    });

    const maxDrag = geometry.containerWidth - geometry.buttonWidth - 16;
    assert.ok(maxDrag > 20, "A distância de arraste calculada precisa ser positiva.");

    await opener.evaluate((button) => {
        window.__socialsDragStartedAt = null;
        button.addEventListener("pointerdown", () => {
            window.__socialsDragStartedAt = performance.now();
        }, { once: true, capture: true });
    });

    const startedAt = Date.now();
    const startX = box.x + box.width / 2;
    const startY = box.y + box.height / 2;
    const endX = Math.min(startX + maxDrag * 0.99, 388);

    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(endX, startY, { steps: 12 });
    await page.mouse.up();

    const panel = panelRootLocator(page);
    await panel.waitFor({ state: "attached", timeout: 5000 });
    const mountedMs = await page.evaluate(() =>
        performance.now() - window.__socialsDragStartedAt,
    );

    // Espera o requestAnimationFrame que inicia o GSAP, para não confundir
    // o estado inicial opaco com o painel já plenamente animado.
    await page.waitForFunction(() => {
        const heading = Array.from(document.querySelectorAll("h2"))
            .find((element) => element.textContent.trim() === "Redes Sociais");
        const root = heading?.parentElement?.parentElement?.parentElement;
        return root && Number.parseFloat(getComputedStyle(root).opacity) < 0.98;
    }, null, { timeout: 3000 });

    const fadeStartedMs = await page.evaluate(() =>
        performance.now() - window.__socialsDragStartedAt,
    );

    await page.waitForFunction(() => {
        const heading = Array.from(document.querySelectorAll("h2"))
            .find((element) => element.textContent.trim() === "Redes Sociais");
        const root = heading?.parentElement?.parentElement?.parentElement;
        return root && Number.parseFloat(getComputedStyle(root).opacity) >= 0.98;
    }, null, { timeout: 3000 });

    const fullyVisibleMs = await page.evaluate(() =>
        performance.now() - window.__socialsDragStartedAt,
    );
    const actionDurationMs = Date.now() - startedAt;

    const report = {
        iteration,
        actionDurationMs,
        pointerDownToPanelMountedMs: Math.round(mountedMs),
        pointerDownToFadeStartedMs: Math.round(fadeStartedMs),
        pointerDownToNearlyFullyVisibleMs: Math.round(fullyVisibleMs),
        maxDragPx: Math.round(maxDrag),
    };
    console.log(JSON.stringify({ check: "socials-drag-first-vs-repeat", ...report }));

    assert.ok(mountedMs < 1500, `A montagem após o arraste ${iteration} demorou ${Math.round(mountedMs)} ms.`);
    assert.ok(fullyVisibleMs < 2500, `A abertura após o arraste ${iteration} demorou ${Math.round(fullyVisibleMs)} ms.`);

    return report;
}

try {
    const context = await browser.newContext({
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
        reducedMotion: "no-preference",
    });
    const page = await context.newPage();
    const pageErrors = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    const navigationStartedAt = Date.now();
    await page.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 60000 });

    const preloader = page.locator('[aria-label^="Carregamento do site:"]');
    await preloader.waitFor({ state: "attached", timeout: 30000 });
    await preloader.waitFor({ state: "detached", timeout: 60000 });
    const preloaderDismissMs = Date.now() - navigationStartedAt;
    console.log(JSON.stringify({
        check: "preloader-interactive-readiness",
        navigationToPreloaderDismissMs: preloaderDismissMs,
        result: "passed",
    }));

    const opener = page.getByRole("button", {
        name: "Arraste para abrir as redes sociais",
        exact: true,
    });
    await opener.waitFor({ state: "visible", timeout: 60000 });
    await opener.waitFor({ state: "attached" });

    const beforeOpen = await page.evaluate(() => ({
        resources: performance.getEntriesByType("resource")
            .filter((entry) => /\.js(?:$|\?)/i.test(entry.name))
            .map((entry) => entry.name.split("/").pop()),
    }));
    const socialsChunk = beforeOpen.resources.find((name) => /socials/i.test(name));

    // O usuário relata demora principalmente no primeiro gesto, então medimos
    // arraste real (pointer events) antes de qualquer abertura por clique.
    const firstDrag = await measureDragOpen(page, opener, 1);

    await page.getByRole("button", { name: "Fechar redes sociais", exact: true })
        .click({ timeout: 5000 });
    await page.waitForFunction(() =>
        !Array.from(document.querySelectorAll("h2"))
            .some((element) => element.textContent.trim() === "Redes Sociais"),
    null, { timeout: 5000 });
    await opener.waitFor({ state: "visible", timeout: 5000 });

    const secondDrag = await measureDragOpen(page, opener, 2);

    await page.getByRole("button", { name: "Fechar redes sociais", exact: true })
        .click({ timeout: 5000 });
    await page.waitForFunction(() =>
        !Array.from(document.querySelectorAll("h2"))
            .some((element) => element.textContent.trim() === "Redes Sociais"),
    null, { timeout: 5000 });
    await opener.waitFor({ state: "visible", timeout: 5000 });

    const first = await measureOpen(page, opener, 1);

    await page.getByRole("button", { name: "Fechar redes sociais", exact: true })
        .click({ timeout: 5000 });
    await page.waitForFunction(() =>
        !Array.from(document.querySelectorAll("h2"))
            .some((element) => element.textContent.trim() === "Redes Sociais"),
    null, { timeout: 5000 });

    const second = await measureOpen(page, opener, 2);

    assert.equal(
        pageErrors.some((message) => /Socials|GSAP|React/i.test(message)),
        false,
        `Erro de execução relacionado ao painel: ${pageErrors.join(" | ")}`,
    );

    console.log(JSON.stringify({
        check: "socials-first-open-diagnosis",
        socialsJavaScriptChunkPresentBeforeOpening: Boolean(socialsChunk),
        socialsChunkName: socialsChunk ?? null,
        firstDragFullyVisibleMs: firstDrag.pointerDownToNearlyFullyVisibleMs,
        secondDragFullyVisibleMs: secondDrag.pointerDownToNearlyFullyVisibleMs,
        firstOpenFullyVisibleMs: first.clickToNearlyFullyVisibleMs,
        secondOpenFullyVisibleMs: second.clickToNearlyFullyVisibleMs,
        preloaderDismissMs,
        result: "passed",
    }));

    await context.close();
} finally {
    await browser.close();
}

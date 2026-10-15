import assert from "node:assert/strict";
import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL || "http://127.0.0.1:4173";
const viewport = { width: 360, height: 803 };
const browser = await chromium.launch({ headless: true });
const pageErrors = [];

async function waitForTrackState(page, index, expectedState, expectedReason) {
    await page.waitForFunction(
        ({ index: trackIndex, state, reason }) => {
            const track = document.querySelectorAll("#stack .logoloop__track")[trackIndex];
            return Boolean(
                track &&
                track.dataset.animationState === state &&
                (reason === null || track.dataset.animationPauseReason === reason),
            );
        },
        {
            index,
            state: expectedState,
            reason: expectedReason ?? null,
        },
        { timeout: 15000 },
    );
}

async function readTrack(page, index) {
    return page.locator("#stack .logoloop__track").nth(index).evaluate((track) => ({
        state: track.dataset.animationState,
        reason: track.dataset.animationPauseReason ?? null,
        transform: track.style.transform,
        willChange: getComputedStyle(track).willChange,
    }));
}

async function scrollToBottom(page) {
    await page.evaluate(() => {
        document.documentElement.style.scrollBehavior = "auto";
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" });
    });
}

try {
    const context = await browser.newContext({
        viewport,
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
        reducedMotion: "no-preference",
    });

    const page = await context.newPage();
    page.on("pageerror", (error) => pageErrors.push(error.message));

    await page.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForFunction(
        () => {
            const tracks = document.querySelectorAll("#stack .logoloop__track");
            return tracks.length === 3 &&
                [...tracks].every((track) => track.dataset.animationState !== undefined);
        },
        null,
        { timeout: 60000 },
    );

    const trackCount = await page.locator("#stack .logoloop__track").count();
    assert.equal(trackCount, 3, "A SecLogs mobile deve renderizar as três faixas de logotipos.");

    // 1. Fora da viewport: o estado deve ser pausado e o transform deve permanecer estável.
    await scrollToBottom(page);
    for (let index = 0; index < trackCount; index += 1) {
        await waitForTrackState(page, index, "paused", "outside-viewport");
    }

    const offscreenBefore = await Promise.all(
        Array.from({ length: trackCount }, (_, index) => readTrack(page, index)),
    );
    await page.waitForTimeout(250);
    const offscreenAfter = await Promise.all(
        Array.from({ length: trackCount }, (_, index) => readTrack(page, index)),
    );

    offscreenBefore.forEach((before, index) => {
        assert.equal(offscreenAfter[index].state, "paused");
        assert.equal(offscreenAfter[index].reason, "outside-viewport");
        assert.equal(
            offscreenAfter[index].transform,
            before.transform,
            `A faixa ${index + 1} continuou alterando o transform fora da viewport.`,
        );
        assert.notEqual(
            offscreenAfter[index].willChange,
            "transform",
            `A faixa ${index + 1} manteve will-change ativo fora da viewport.`,
        );
    });

    console.log(JSON.stringify({
        check: "offscreen-pause",
        viewport,
        tracks: offscreenAfter.map(({ state, reason, willChange }) => ({ state, reason, willChange })),
        result: "passed",
    }));

    // 2. Cada faixa deve retomar o movimento quando entra na viewport.
    for (let index = 0; index < trackCount; index += 1) {
        const track = page.locator("#stack .logoloop__track").nth(index);
        await track.evaluate((element) => {
            element.scrollIntoView({ block: "center", behavior: "instant" });
        });

        await waitForTrackState(page, index, "running", null);
        const before = await readTrack(page, index);
        await page.waitForTimeout(300);
        const after = await readTrack(page, index);

        assert.notEqual(
            after.transform,
            before.transform,
            `A faixa ${index + 1} não alterou o transform quando estava visível.`,
        );
        assert.equal(
            after.willChange,
            "transform",
            `A faixa ${index + 1} deveria otimizar transform somente enquanto anima.`,
        );

        console.log(JSON.stringify({
            check: "visible-animation",
            track: index + 1,
            before: before.transform,
            after: after.transform,
            willChange: after.willChange,
            result: "passed",
        }));

        await scrollToBottom(page);
        await waitForTrackState(page, index, "paused", "outside-viewport");
        const pausedBefore = await readTrack(page, index);
        await page.waitForTimeout(200);
        const pausedAfter = await readTrack(page, index);

        assert.equal(pausedAfter.transform, pausedBefore.transform);
    }

    // 3. Simula a aba em segundo plano e verifica se visibilitychange pausa o loop.
    const firstTrack = page.locator("#stack .logoloop__track").first();
    await firstTrack.evaluate((element) => {
        element.scrollIntoView({ block: "center", behavior: "instant" });
    });
    await waitForTrackState(page, 0, "running", null);

    await page.evaluate(() => {
        Object.defineProperty(document, "visibilityState", {
            configurable: true,
            get: () => window.__logoLoopTestVisibility || "visible",
        });
        window.__logoLoopTestVisibility = "hidden";
        document.dispatchEvent(new Event("visibilitychange"));
    });
    await waitForTrackState(page, 0, "paused", "page-hidden");
    const hiddenBefore = await readTrack(page, 0);
    await page.waitForTimeout(250);
    const hiddenAfter = await readTrack(page, 0);
    assert.equal(hiddenAfter.transform, hiddenBefore.transform);

    await page.evaluate(() => {
        window.__logoLoopTestVisibility = "visible";
        document.dispatchEvent(new Event("visibilitychange"));
        delete document.visibilityState;
        delete window.__logoLoopTestVisibility;
        document.dispatchEvent(new Event("visibilitychange"));
    });
    await waitForTrackState(page, 0, "running", null);

    console.log(JSON.stringify({
        check: "hidden-page-pause",
        state: hiddenAfter.state,
        reason: hiddenAfter.reason,
        transformStable: hiddenAfter.transform === hiddenBefore.transform,
        result: "passed",
    }));

    // 4. Movimento reduzido precisa desligar o requestAnimationFrame, não apenas o CSS.
    await page.emulateMedia({ reducedMotion: "reduce" });
    await waitForTrackState(page, 0, "paused", "reduced-motion");
    const reducedBefore = await readTrack(page, 0);
    await page.waitForTimeout(250);
    const reducedAfter = await readTrack(page, 0);

    assert.equal(reducedAfter.transform, reducedBefore.transform);
    assert.notEqual(reducedAfter.willChange, "transform");

    console.log(JSON.stringify({
        check: "reduced-motion",
        state: reducedAfter.state,
        reason: reducedAfter.reason,
        transformStable: reducedAfter.transform === reducedBefore.transform,
        willChange: reducedAfter.willChange,
        result: "passed",
    }));

    assert.equal(
        pageErrors.some((message) => /LogoLoop|isVertical|animationPauseReason/i.test(message)),
        false,
        `Erro de execução relacionado ao LogoLoop: ${pageErrors.join(" | ")}`,
    );

    await context.close();
    console.log("LogoLoop visibility, hidden-page, and reduced-motion checks passed.");
} finally {
    await browser.close();
}

import assert from "node:assert/strict";
import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL || "http://127.0.0.1:4173/";
const diagnosticsKey = "__uiSfxMobileInteractionTest";
const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

async function readDiagnostics(page) {
    return page.evaluate((key) => ({
        audioContextCount: window[key]?.contexts.length ?? -1,
        audioContextStates: window[key]?.contexts.map((context) => context.state) ?? [],
        sourceStarts: window[key]?.sourceStarts ?? -1,
    }), diagnosticsKey);
}

async function waitForNewSound(page, previousStarts, label) {
    await page.waitForFunction(
        ({ key, previous }) => (window[key]?.sourceStarts ?? 0) > previous,
        { key: diagnosticsKey, previous: previousStarts },
        { timeout: 10000 },
    );
    await page.waitForTimeout(500);
    const diagnostics = await readDiagnostics(page);
    assert.ok(
        diagnostics.sourceStarts > previousStarts,
        label + " should start at least one Web Audio source. " + JSON.stringify(diagnostics),
    );
    return diagnostics.sourceStarts;
}

async function waitForPageReady(page) {
    await page.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.locator('[aria-label^="Carregamento do site:"]').waitFor({
        state: "detached",
        timeout: 60000,
    });
}

async function swipeProjectCarousel(page, context) {
    const section = page.locator("#projetos");
    await section.scrollIntoViewIfNeeded();

    const swiper = page.locator("#projetos .swiper").first();
    await swiper.waitFor({ state: "visible", timeout: 45000 });
    await page.waitForFunction(
        () => {
            const element = document.querySelector("#projetos .swiper");
            return Boolean(element?.swiper && element.swiper.slides?.length > 1);
        },
        null,
        { timeout: 20000 },
    );

    const startingIndex = await swiper.evaluate((element) => element.swiper.activeIndex);
    const bounds = await swiper.boundingBox();
    assert.ok(bounds && bounds.width > 200 && bounds.height > 100, "The mobile project carousel must have a usable touch area.");

    const startX = bounds.x + bounds.width * 0.76;
    const endX = bounds.x + bounds.width * 0.24;
    const y = bounds.y + bounds.height * 0.55;
    const session = await context.newCDPSession(page);
    const point = (x) => ({
        x: Math.round(x),
        y: Math.round(y),
        id: 1,
        radiusX: 3,
        radiusY: 3,
        force: 1,
    });

    try {
        await session.send("Input.dispatchTouchEvent", {
            type: "touchStart",
            touchPoints: [point(startX)],
        });

        for (let index = 1; index <= 8; index += 1) {
            const progress = index / 8;
            const x = startX + (endX - startX) * progress;
            await session.send("Input.dispatchTouchEvent", {
                type: "touchMove",
                touchPoints: [point(x)],
            });
        }

        await session.send("Input.dispatchTouchEvent", {
            type: "touchEnd",
            touchPoints: [],
        });
    } finally {
        await session.detach();
    }

    await page.waitForFunction(
        (previousIndex) => {
            const element = document.querySelector("#projetos .swiper");
            return Boolean(element?.swiper && element.swiper.activeIndex !== previousIndex);
        },
        startingIndex,
        { timeout: 10000 },
    );

    return startingIndex;
}

const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
    reducedMotion: "no-preference",
});

try {
    await context.addInitScript((key) => {
        const diagnostics = { contexts: [], sourceStarts: 0 };
        window[key] = diagnostics;

        const NativeAudioContext = window.AudioContext;
        if (NativeAudioContext) {
            window.AudioContext = new Proxy(NativeAudioContext, {
                construct(target, args) {
                    const audioContext = Reflect.construct(target, args);
                    diagnostics.contexts.push(audioContext);
                    return audioContext;
                },
            });
        }

        const sourcePrototype = window.AudioBufferSourceNode?.prototype;
        if (sourcePrototype && typeof sourcePrototype.start === "function") {
            const nativeStart = sourcePrototype.start;
            sourcePrototype.start = function (...args) {
                diagnostics.sourceStarts += 1;
                return nativeStart.apply(this, args);
            };
        }

        try {
            localStorage.setItem("kleber-dev:ui-sounds-enabled", "true");
            localStorage.setItem("kleber-dev:ui-sounds-volume", "200");
            localStorage.setItem("kleber-dev:ui-sounds-volume-v2-migrated", "true");
            localStorage.setItem("experienceMode", "reduced");
        } catch {
            // Failures in storage are caught by assertions and the UI itself.
        }
    }, diagnosticsKey);

    const page = await context.newPage();
    console.log("Scenario A: the page loads without starting sound automatically.");
    await waitForPageReady(page);

    let diagnostics = await readDiagnostics(page);
    assert.equal(diagnostics.audioContextCount, 0, "A fresh mobile page must not eagerly create an AudioContext.");
    assert.equal(diagnostics.sourceStarts, 0, "A fresh mobile page must not autoplay interface sounds.");

    console.log("Scenario B: opening and closing Socials each plays its state-change cue.");
    const socialButton = page.getByRole("button", { name: "Arraste para abrir as redes sociais" });
    await socialButton.waitFor({ state: "visible", timeout: 30000 });
    await socialButton.scrollIntoViewIfNeeded();

    const beforeExpand = (await readDiagnostics(page)).sourceStarts;
    await socialButton.tap();
    await page.getByRole("button", { name: "Fechar redes sociais" }).waitFor({
        state: "visible",
        timeout: 10000,
    });
    let lastSourceCount = await waitForNewSound(page, beforeExpand, "The Socials expand cue");

    await page.getByRole("button", { name: "Fechar redes sociais" }).tap();
    await page.getByRole("button", { name: "Arraste para abrir as redes sociais" }).waitFor({
        state: "visible",
        timeout: 10000,
    });
    lastSourceCount = await waitForNewSound(page, lastSourceCount, "The Socials collapse cue");

    console.log("Scenario C: a real horizontal touch swipe advances the project carousel and plays drag-start.");
    const sourceCountBeforeSwipe = lastSourceCount;
    const previousIndex = await swipeProjectCarousel(page, context);
    await waitForNewSound(page, sourceCountBeforeSwipe, "The project carousel drag-start cue");

    const finalIndex = await page.locator("#projetos .swiper").first().evaluate(
        (element) => element.swiper.activeIndex,
    );
    assert.notEqual(finalIndex, previousIndex, "The swipe must advance to a different project slide.");
    diagnostics = await readDiagnostics(page);
    assert.ok(diagnostics.sourceStarts > sourceCountBeforeSwipe, "The carousel swipe must start an audio source.");

    console.log(JSON.stringify({
        scenarios: ["no autoplay", "Socials expand", "Socials collapse", "carousel drag-start"],
        previousIndex,
        finalIndex,
        sourceStarts: diagnostics.sourceStarts,
        audioContexts: diagnostics.audioContextCount,
        result: "passed",
    }));
} finally {
    await context.close();
    await browser.close();
}

console.log("Mobile Socials and project carousel sound checks passed.");

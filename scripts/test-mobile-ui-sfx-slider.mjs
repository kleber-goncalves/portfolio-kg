import assert from "node:assert/strict";
import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL || "http://127.0.0.1:4173/";
const enabledKey = "kleber-dev:ui-sounds-enabled";
const volumeKey = "kleber-dev:ui-sounds-volume";
const maxVolume = 800;
const browser = await chromium.launch({ headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });

async function waitForReady(page) {
    await page.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.locator('[aria-label^="Carregamento do site:"]').waitFor({
        state: "detached",
        timeout: 60000,
    });
    await page.getByRole("button", { name: "Abrir menu" }).waitFor({
        state: "visible",
        timeout: 30000,
    });
}

async function readDiagnostics(page) {
    return page.evaluate(() => ({
        audioContextCount: window.__uiSfxMobileTest?.contexts.length ?? -1,
        audioContextStates: window.__uiSfxMobileTest?.contexts.map((context) => context.state) ?? [],
        sourceStarts: window.__uiSfxMobileTest?.sourceStarts ?? -1,
        sourceStartStates: window.__uiSfxMobileTest?.sourceStartStates ?? [],
    }));
}

async function waitForRunningAudio(page) {
    await page.waitForFunction(
        () => window.__uiSfxMobileTest?.contexts.some((context) => context.state === "running"),
        null,
        { timeout: 10000 },
    );
}

async function waitForSourceStarts(page, minimum) {
    await page.waitForFunction(
        (target) => (window.__uiSfxMobileTest?.sourceStarts ?? 0) >= target,
        minimum,
        { timeout: 10000 },
    );
}

async function openMobileMenu(page) {
    await page.getByRole("button", { name: "Abrir menu" }).tap();
    await page.locator("[data-mobile-menu-overlay]").waitFor({
        state: "visible",
        timeout: 15000,
    });
    await page.getByRole("slider", { name: "Volume dos sons" }).waitFor({
        state: "visible",
        timeout: 15000,
    });
}

async function dragSliderWithTouch(page, context, slider, targetRatio) {
    await slider.scrollIntoViewIfNeeded();
    const bounds = await slider.boundingBox();
    assert.ok(bounds && bounds.width > 100, "The mobile volume slider must have a usable touch width.");

    const currentValue = Number(await slider.inputValue());
    const inset = 8;
    const usableWidth = Math.max(1, bounds.width - inset * 2);
    const y = bounds.y + bounds.height / 2;
    const startX = bounds.x + inset + (currentValue / maxVolume) * usableWidth;
    const endX = bounds.x + inset + targetRatio * usableWidth;
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

        // A preferência só é persistida ao soltar o dedo, não a cada touchmove.
        const storedDuringDrag = await page.evaluate((key) => localStorage.getItem(key), volumeKey);
        assert.equal(
            storedDuringDrag,
            String(currentValue),
            "The mobile slider must not persist each intermediate touch movement.",
        );

        const fillTransition = await page.locator("[data-volume-fill]").evaluate((element) => ({
            duration: getComputedStyle(element).transitionDuration,
        }));
        assert.equal(
            fillTransition.duration,
            "0s",
            "The filled track must follow the finger without a CSS transition while dragging.",
        );

        await page.waitForFunction(() => {
            const sliderElement = document.querySelector('[data-mobile-sound-volume] input[type="range"]');
            const fill = document.querySelector("[data-volume-fill]");
            const displayedValue = document.querySelector("[data-volume-value]");
            if (!sliderElement || !fill || !displayedValue) return false;

            const sliderValue = Number(sliderElement.value);
            const fillPercentage = Number.parseFloat(fill.style.width);
            return Math.abs(fillPercentage - sliderValue / 8) < 0.8 &&
                displayedValue.textContent.trim() === String(sliderValue) + "%";
        }, null, { timeout: 5000 });

        await session.send("Input.dispatchTouchEvent", {
            type: "touchEnd",
            touchPoints: [],
        });
    } finally {
        await session.detach();
    }

    await page.waitForFunction(
        (previousValue) => Number(document.querySelector('[data-mobile-sound-volume] input[type="range"]')?.value) !== previousValue,
        currentValue,
        { timeout: 5000 },
    );

    const nextValue = Number(await slider.inputValue());
    assert.ok(nextValue >= 0 && nextValue <= maxVolume, "The dragged volume must remain within range.");
    assert.equal(nextValue % 5, 0, "The dragged volume must respect the five-point slider step.");

    const storedValue = await page.evaluate((key) => localStorage.getItem(key), volumeKey);
    assert.equal(storedValue, String(nextValue), "Dragging the mobile slider must persist the new volume.");

    return nextValue;
}

const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
    reducedMotion: "no-preference",
});

try {
    await context.addInitScript(() => {
        const diagnostics = { contexts: [], sourceStarts: 0, sourceStartStates: [] };
        window.__uiSfxMobileTest = diagnostics;

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

        const bufferSourcePrototype = window.AudioBufferSourceNode?.prototype;
        if (bufferSourcePrototype && typeof bufferSourcePrototype.start === "function") {
            const nativeStart = bufferSourcePrototype.start;
            bufferSourcePrototype.start = function (...args) {
                diagnostics.sourceStarts += 1;
                diagnostics.sourceStartStates.push({
                    contextState: this.context?.state ?? "unknown",
                    userActivation: navigator.userActivation?.isActive ?? null,
                });
                return nativeStart.apply(this, args);
            };
        }

        try {
            if (sessionStorage.getItem("__ui_sfx_mobile_test_initialized") !== "1") {
                localStorage.removeItem("kleber-dev:ui-sounds-enabled");
                localStorage.removeItem("kleber-dev:ui-sfx");
                localStorage.setItem("kleber-dev:ui-sounds-volume", "200");
                localStorage.setItem("kleber-dev:ui-sounds-volume-v2-migrated", "true");
                sessionStorage.setItem("__ui_sfx_mobile_test_initialized", "1");
            }
            localStorage.setItem("experienceMode", "reduced");
        } catch {
            // Assertions fail explicitly if browser storage is unavailable.
        }
    });

    const page = await context.newPage();

    console.log("Mobile scenario A: no audio context or playback on first page load.");
    await waitForReady(page);

    let diagnostics = await readDiagnostics(page);
    assert.equal(diagnostics.audioContextCount, 0, "Mobile page load must not create an AudioContext.");
    assert.equal(diagnostics.sourceStarts, 0, "Mobile page load must not start audio sources.");

    console.log("Mobile scenario B: trusted touch opens the menu and unlocks audio.");
    await openMobileMenu(page);
    await waitForRunningAudio(page);
    await waitForSourceStarts(page, 1);

    const soundToggle = page.getByRole("button", { name: "Desativar efeitos sonoros" });
    const slider = page.getByRole("slider", { name: "Volume dos sons" });
    await soundToggle.scrollIntoViewIfNeeded();
    await slider.scrollIntoViewIfNeeded();

    const toggleBounds = await soundToggle.boundingBox();
    const sliderBounds = await slider.boundingBox();
    assert.ok(toggleBounds && sliderBounds, "The sound toggle and volume slider must be visible in the menu.");
    assert.ok(
        sliderBounds.y > toggleBounds.y + toggleBounds.height - 1,
        "The mobile volume slider must sit directly below the enable/disable sound control.",
    );

    const outsideRight = sliderBounds.x + sliderBounds.width;
    assert.ok(outsideRight <= 360, "The volume control should fit inside the mobile menu without horizontal overflow.");

    console.log("Mobile scenario C: a touch drag changes and saves the volume.");
    const sourceStartsBeforeDrag = (await readDiagnostics(page)).sourceStarts;
    const volumeAfterDrag = await dragSliderWithTouch(page, context, slider, 0.68);
    await waitForSourceStarts(page, sourceStartsBeforeDrag + 1);
    assert.equal(Number(await slider.inputValue()), volumeAfterDrag);

    console.log("Mobile scenario D: disabled sounds remain silent while the slider still saves preferences.");
    await soundToggle.tap();
    await page.getByRole("button", { name: "Ativar efeitos sonoros" }).waitFor({ state: "visible" });
    await page.waitForFunction(
        (key) => localStorage.getItem(key) === "false",
        enabledKey,
        { timeout: 5000 },
    );

    const sourceStartsWhileDisabled = (await readDiagnostics(page)).sourceStarts;
    const volumeWhileDisabled = await dragSliderWithTouch(
        page,
        context,
        page.getByRole("slider", { name: "Volume dos sons" }),
        0.42,
    );
    await page.waitForTimeout(300);
    diagnostics = await readDiagnostics(page);
    assert.equal(
        diagnostics.sourceStarts,
        sourceStartsWhileDisabled,
        "Adjusting volume while effects are disabled must not start new audio sources.",
    );

    console.log("Mobile scenario E: reload keeps the off preference and saved volume without autoplay.");
    await page.reload({ waitUntil: "domcontentloaded", timeout: 60000 });
    await page.locator('[aria-label^="Carregamento do site:"]').waitFor({
        state: "detached",
        timeout: 60000,
    });
    await page.getByRole("button", { name: "Abrir menu" }).waitFor({ state: "visible", timeout: 30000 });

    diagnostics = await readDiagnostics(page);
    assert.equal(diagnostics.audioContextCount, 0, "Reload must not create an AudioContext before a touch.");
    assert.equal(diagnostics.sourceStarts, 0, "Reload must not autoplay effects.");

    await openMobileMenu(page);
    await page.getByRole("button", { name: "Ativar efeitos sonoros" }).waitFor({ state: "visible" });
    assert.equal(
        Number(await page.getByRole("slider", { name: "Volume dos sons" }).inputValue()),
        volumeWhileDisabled,
        "Saved volume must be restored after reload while effects remain disabled.",
    );
    assert.equal(
        await page.evaluate((key) => localStorage.getItem(key), enabledKey),
        "false",
        "Disabled preference must remain off after reload.",
    );
    diagnostics = await readDiagnostics(page);
    assert.equal(diagnostics.audioContextCount, 0, "Opening the menu must not unlock audio when sound is disabled.");

    console.log("Mobile scenario F: re-enabling from a trusted touch restores sound.");
    await page.getByRole("button", { name: "Ativar efeitos sonoros" }).tap();
    await page.getByRole("button", { name: "Desativar efeitos sonoros" }).waitFor({ state: "visible", timeout: 10000 });
    await page.waitForFunction(
        (key) => localStorage.getItem(key) === "true",
        enabledKey,
        { timeout: 5000 },
    );
    await waitForRunningAudio(page);
    await waitForSourceStarts(page, 1);

    console.log("Mobile scenario G: first trusted touch after reload must play a cue while preference stays enabled.");
    await page.reload({ waitUntil: "domcontentloaded", timeout: 60000 });
    await page.locator('[aria-label^="Carregamento do site:"]').waitFor({
        state: "detached",
        timeout: 60000,
    });
    await page.getByRole("button", { name: "Abrir menu" }).waitFor({ state: "visible", timeout: 30000 });

    diagnostics = await readDiagnostics(page);
    assert.equal(diagnostics.audioContextCount, 0, "Enabled preference must not autoplay or create audio on reload.");
    assert.equal(diagnostics.sourceStarts, 0, "Reload must reset diagnostics without autoplaying audio.");
    assert.equal(
        await page.evaluate((key) => localStorage.getItem(key), enabledKey),
        "true",
        "The enabled preference must already be true before the first touch after reload.",
    );

    const sourceStartsBeforeFirstTouch = diagnostics.sourceStarts;
    const sourceStartStatesBeforeFirstTouch = diagnostics.sourceStartStates.length;
    await openMobileMenu(page);
    await page.getByRole("button", { name: "Desativar efeitos sonoros" }).waitFor({ state: "visible" });
    await waitForSourceStarts(page, sourceStartsBeforeFirstTouch + 1);
    diagnostics = await readDiagnostics(page);
    const firstPostReloadSources = diagnostics.sourceStartStates.slice(sourceStartStatesBeforeFirstTouch);
    assert.ok(
        firstPostReloadSources.length > 0,
        "The first touch after reload should record the audio source state.",
    );
    assert.ok(
        firstPostReloadSources.every((source) => source.contextState === "running"),
        "The first post-reload cue must start only after its AudioContext is running. " +
            JSON.stringify(firstPostReloadSources),
    );
    console.log("First post-reload sound diagnostics: " + JSON.stringify({
        preference: await page.evaluate((key) => localStorage.getItem(key), enabledKey),
        contextStates: diagnostics.audioContextStates,
        sources: firstPostReloadSources,
    }));
    assert.equal(
        await page.evaluate((key) => localStorage.getItem(key), enabledKey),
        "true",
        "The first touch after reload must play audio without requiring a preference toggle.",
    );
    assert.equal(
        Number(await page.getByRole("slider", { name: "Volume dos sons" }).inputValue()),
        volumeWhileDisabled,
        "The latest mobile volume must be restored in the enabled state too.",
    );
    await waitForRunningAudio(page);

    console.log("Mobile UI sound slider checks passed.");
} finally {
    await context.close();
    await browser.close();
}

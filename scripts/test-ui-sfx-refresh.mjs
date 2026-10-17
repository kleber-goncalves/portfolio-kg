import assert from "node:assert/strict";
import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL || "http://127.0.0.1:4173/";
const enabledKey = "kleber-dev:ui-sounds-enabled";
const volumeKey = "kleber-dev:ui-sounds-volume";
const browser = await chromium.launch({ headless: true });

async function waitForReady(page, soundLabel) {
    await page.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 60000 });

    await page.locator('[aria-label^="Carregamento do site:"]').waitFor({
        state: "detached",
        timeout: 60000,
    });

    await page.getByRole("button", { name: soundLabel }).waitFor({
        state: "visible",
        timeout: 30000,
    });
}

async function readDiagnostics(page) {
    return page.evaluate(() => ({
        audioContextCount: window.__uiSfxTest?.contexts.length ?? -1,
        audioContextStates: window.__uiSfxTest?.contexts.map((context) => context.state) ?? [],
        sourceStarts: window.__uiSfxTest?.sourceStarts ?? -1,
    }));
}

async function waitForRunningContext(page) {
    await page.waitForFunction(
        () => window.__uiSfxTest?.contexts.some((context) => context.state === "running"),
        null,
        { timeout: 10000 },
    );
}

async function assertSoundPreference(page, expected, scenario) {
    const actual = await page.evaluate((key) => localStorage.getItem(key), enabledKey);
    assert.equal(actual, String(expected), scenario + ": unexpected persisted sound preference.");
}

try {
    const context = await browser.newContext({
        viewport: { width: 1365, height: 900 },
        reducedMotion: "reduce",
    });

    await context.addInitScript(() => {
        const diagnostics = {
            contexts: [],
            sourceStarts: 0,
        };
        window.__uiSfxTest = diagnostics;

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

        const sourcePrototype = window.AudioScheduledSourceNode?.prototype;
        if (sourcePrototype && typeof sourcePrototype.start === "function") {
            const nativeStart = sourcePrototype.start;
            sourcePrototype.start = function (...args) {
                diagnostics.sourceStarts += 1;
                return nativeStart.apply(this, args);
            };
        }

        try {
            // Limpa uma vez por contexto, sem apagar preferências nos reloads.
            if (sessionStorage.getItem("__ui_sfx_test_initialized") !== "1") {
                localStorage.removeItem("kleber-dev:ui-sounds-enabled");
                localStorage.removeItem("kleber-dev:ui-sfx");
                localStorage.setItem("kleber-dev:ui-sounds-volume", "200");
                localStorage.setItem("kleber-dev:ui-sounds-volume-v2-migrated", "true");
                sessionStorage.setItem("__ui_sfx_test_initialized", "1");
            }

            localStorage.setItem("experienceMode", "reduced");
        } catch {
            // As asserções abaixo falham se as preferências não puderem ser testadas.
        }
    });

    const page = await context.newPage();

    console.log("Scenario A: first visit defaults to enabled without autoplay.");
    await waitForReady(page, "Desativar efeitos sonoros");
    assert.equal(
        await page.evaluate((key) => localStorage.getItem(key), enabledKey),
        null,
        "First-visit test must start without an explicit sound preference.",
    );
    assert.equal(
        await page.getByRole("button", { name: "Desativar efeitos sonoros" }).getAttribute("aria-pressed"),
        "true",
        "The first-visit sound control must be enabled by default.",
    );

    let diagnostics = await readDiagnostics(page);
    assert.equal(diagnostics.audioContextCount, 0, "AudioContext must not be created during page load.");

    await page.getByRole("button", { name: "Desativar efeitos sonoros" }).hover();
    await page.waitForTimeout(250);
    diagnostics = await readDiagnostics(page);
    assert.equal(diagnostics.audioContextCount, 0, "Hover alone must not attempt to unlock audio.");
    assert.equal(diagnostics.sourceStarts, 0, "Hover alone must not start audio sources.");

    console.log("Scenario B: explicit toggle persists on/off and starts audio only after a gesture.");
    await page.getByRole("button", { name: "Desativar efeitos sonoros" }).click();
    await page.getByRole("button", { name: "Ativar efeitos sonoros" }).waitFor({ state: "visible" });
    await assertSoundPreference(page, false, "After disabling sound");

    await page.getByRole("button", { name: "Ativar efeitos sonoros" }).click();
    await page.getByRole("button", { name: "Desativar efeitos sonoros" }).waitFor({ state: "visible" });
    await assertSoundPreference(page, true, "After enabling sound");
    await waitForRunningContext(page);
    await page.waitForFunction(
        () => (window.__uiSfxTest?.sourceStarts ?? 0) > 0,
        null,
        { timeout: 10000 },
    );

    console.log("Scenario C: volume change persists and is restored after reload.");
    const volumeButton = () => page.getByRole("button", { name: /^Configurar volume:/ });
    await volumeButton().click();
    const slider = page.getByRole("slider", { name: "Volume dos sons" });
    await slider.waitFor({ state: "visible" });
    await slider.focus();
    await slider.press("ArrowRight");
    await page.waitForFunction(
        (key) => localStorage.getItem(key) === "205",
        volumeKey,
        { timeout: 5000 },
    );
    assert.equal(await slider.getAttribute("aria-valuenow"), "205");

    console.log("Scenario D: reload restores enabled preference and volume; next interaction unlocks audio.");
    await page.reload({ waitUntil: "domcontentloaded", timeout: 60000 });
    await page.locator('[aria-label^="Carregamento do site:"]').waitFor({
        state: "detached",
        timeout: 60000,
    });
    await page.getByRole("button", { name: "Desativar efeitos sonoros" }).waitFor({
        state: "visible",
        timeout: 30000,
    });
    await assertSoundPreference(page, true, "After enabled-state reload");

    diagnostics = await readDiagnostics(page);
    assert.equal(diagnostics.audioContextCount, 0, "Reload must not force playback or create an AudioContext.");

    await volumeButton().hover();
    await page.waitForTimeout(200);
    diagnostics = await readDiagnostics(page);
    assert.equal(diagnostics.audioContextCount, 0, "Hover after reload must not unlock audio.");

    await volumeButton().click();
    await waitForRunningContext(page);
    await page.waitForFunction(
        () => (window.__uiSfxTest?.sourceStarts ?? 0) > 0,
        null,
        { timeout: 10000 },
    );
    assert.equal(
        await page.getByRole("slider", { name: "Volume dos sons" }).getAttribute("aria-valuenow"),
        "205",
        "The volume slider must restore the persisted value after reload.",
    );

    console.log("Scenario E: disabled preference survives reload and produces no audio.");
    await page.getByRole("button", { name: "Desativar efeitos sonoros" }).click();
    await page.getByRole("button", { name: "Ativar efeitos sonoros" }).waitFor({ state: "visible" });
    await assertSoundPreference(page, false, "After disabling sound");

    await page.reload({ waitUntil: "domcontentloaded", timeout: 60000 });
    await page.locator('[aria-label^="Carregamento do site:"]').waitFor({
        state: "detached",
        timeout: 60000,
    });
    await page.getByRole("button", { name: "Ativar efeitos sonoros" }).waitFor({
        state: "visible",
        timeout: 30000,
    });
    await assertSoundPreference(page, false, "After disabled-state reload");

    await volumeButton().hover();
    await page.waitForTimeout(250);
    diagnostics = await readDiagnostics(page);
    assert.equal(diagnostics.audioContextCount, 0, "Disabled preference must not create an AudioContext.");
    assert.equal(diagnostics.sourceStarts, 0, "Disabled preference must not start audio sources.");
    assert.equal(
        await page.evaluate((key) => localStorage.getItem(key), volumeKey),
        "205",
        "Volume preference must remain persisted even when sound is disabled.",
    );

    await context.close();
    console.log("UI sound refresh regression checks passed.");
} finally {
    await browser.close();
}

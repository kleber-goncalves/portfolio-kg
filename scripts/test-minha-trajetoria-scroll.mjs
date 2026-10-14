import assert from "node:assert/strict";
import { chromium } from "playwright";

const baseUrl = process.env.TRAJECTORY_TEST_URL || "http://127.0.0.1:4173/";
const viewport = { width: 1365, height: 900 };
const modes = ["reduced", "full"];
const wheelDelta = 420;
const wheelPauseMs = 140;
const maxStepsPerDirection = 85;

async function waitForPageReady(page, expectedMode) {
    await page.goto(baseUrl, {
        waitUntil: "domcontentloaded",
        timeout: 60000,
    });

    const actualMode = await page.evaluate(() => localStorage.getItem("experienceMode"));
    assert.equal(
        actualMode,
        expectedMode,
        `Expected experienceMode="${expectedMode}" before app startup, got "${String(actualMode)}".`,
    );

    await page.waitForFunction(
        () =>
            document.body?.style.overflow !== "hidden" &&
            !document.querySelector('[role="status"]'),
        null,
        { timeout: 30000 },
    );

    await page.evaluate(async () => {
        if (document.fonts?.ready) {
            await Promise.race([
                document.fonts.ready,
                new Promise((resolve) => setTimeout(resolve, 8000)),
            ]);
        }
    });

    // Aguarda a inicialização do Lenis, das linhas e dos ScrollTriggers.
    await page.waitForTimeout(1400);
}

async function readLineProgress(page) {
    return page.evaluate(() => {
        const lines = Array.from(
            document.querySelectorAll("[data-trajectory-progress-line]"),
        );

        const line = lines.find((element) => {
            const style = getComputedStyle(element);
            return (
                style.display !== "none" &&
                style.visibility !== "hidden" &&
                element.offsetHeight > 0
            );
        });

        if (!line) {
            return {
                progress: null,
                visibleLineCount: lines.filter((element) => {
                    const style = getComputedStyle(element);
                    return style.display !== "none" && element.offsetHeight > 0;
                }).length,
                scrollY: window.scrollY,
            };
        }

        const transform = getComputedStyle(line).transform;
        const progress = transform === "none"
            ? 1
            : new DOMMatrixReadOnly(transform).m22;

        return {
            progress,
            line: line.dataset.trajectoryProgressLine,
            scrollY: window.scrollY,
        };
    });
}

async function scrollAndSample(page, direction) {
    const samples = [];
    let previousY = await page.evaluate(() => window.scrollY);
    let stationaryAtBoundary = 0;

    for (let step = 0; step < maxStepsPerDirection; step += 1) {
        await page.mouse.wheel(0, direction * wheelDelta);
        await page.waitForTimeout(wheelPauseMs);

        const sample = await readLineProgress(page);
        assert.notEqual(
            sample.progress,
            null,
            "Could not locate a visible MinhaTrajetoria progress line.",
        );
        samples.push(sample);

        const bounds = await page.evaluate(() => ({
            y: window.scrollY,
            maxY: Math.max(
                document.documentElement.scrollHeight,
                document.body.scrollHeight,
            ) - window.innerHeight,
        }));

        const atBoundary = direction > 0
            ? bounds.y >= bounds.maxY - 10
            : bounds.y <= 10;

        if (atBoundary && Math.abs(bounds.y - previousY) < 1) {
            stationaryAtBoundary += 1;
        } else {
            stationaryAtBoundary = 0;
        }

        previousY = bounds.y;

        const reachedExpectedProgress = direction > 0
            ? sample.progress >= 0.98
            : sample.progress <= 0.02;

        if (reachedExpectedProgress) {
            await page.waitForTimeout(750);
            const settled = await readLineProgress(page);
            samples.push(settled);

            const stillAtExpectedProgress = direction > 0
                ? settled.progress >= 0.95
                : settled.progress <= 0.05;

            if (stillAtExpectedProgress) break;
        }

        if (stationaryAtBoundary >= 3) break;
    }

    return samples;
}

function assertProgressIsMonotonic(samples, direction, mode) {
    for (let index = 1; index < samples.length; index += 1) {
        const previous = samples[index - 1].progress;
        const current = samples[index].progress;

        if (direction > 0) {
            assert.ok(
                current >= previous - 0.12,
                `Line progress regressed while scrolling down in ${mode}: ${previous.toFixed(3)} -> ${current.toFixed(3)}.`,
            );
        } else {
            assert.ok(
                current <= previous + 0.12,
                `Line progress increased while scrolling up in ${mode}: ${previous.toFixed(3)} -> ${current.toFixed(3)}.`,
            );
        }
    }
}

function intermediateProgressBands(samples) {
    return new Set(
        samples
            .map((sample) => sample.progress)
            .filter((progress) => progress > 0.08 && progress < 0.92)
            .map((progress) => Math.round(progress * 5)),
    );
}

async function testMode(browser, mode) {
    const context = await browser.newContext({
        viewport,
        deviceScaleFactor: 1,
        isMobile: false,
        hasTouch: false,
        reducedMotion: "no-preference",
    });

    await context.addInitScript((selectedMode) => {
        try {
            window.localStorage.setItem("experienceMode", selectedMode);
        } catch {
            // The about:blank origin may not expose localStorage.
        }
    }, mode);

    const page = await context.newPage();

    try {
        console.log(`Testing MinhaTrajetoria scroll progress: mode=${mode}`);
        await waitForPageReady(page, mode);

        const initial = await readLineProgress(page);
        assert.notEqual(
            initial.progress,
            null,
            "Could not locate a visible MinhaTrajetoria progress line after startup.",
        );
        assert.ok(
            initial.progress <= 0.08,
            `Expected the trajectory line to start empty at the page top in ${mode}; found scaleY=${initial.progress.toFixed(3)}.`,
        );

        const downSamples = await scrollAndSample(page, 1);
        assertProgressIsMonotonic(downSamples, 1, mode);

        const downValues = downSamples.map((sample) => sample.progress);
        const downMax = Math.max(...downValues);
        assert.ok(
            downMax >= 0.95,
            `Expected the trajectory line to reach the end while scrolling down in ${mode}; max scaleY=${downMax.toFixed(3)}.`,
        );
        assert.ok(
            intermediateProgressBands(downSamples).size >= 2,
            `Expected intermediate line progress values while scrolling down in ${mode}; samples did not show a gradual fill.`,
        );

        const upSamples = await scrollAndSample(page, -1);
        assertProgressIsMonotonic(upSamples, -1, mode);

        const upValues = upSamples.map((sample) => sample.progress);
        const upMin = Math.min(...upValues);
        assert.ok(
            upMin <= 0.08,
            `Expected the trajectory line to return nearly empty at the top while scrolling up in ${mode}; min scaleY=${upMin.toFixed(3)}.`,
        );
        assert.ok(
            intermediateProgressBands(upSamples).size >= 2,
            `Expected intermediate line progress values while scrolling up in ${mode}; samples did not show a gradual reverse.`,
        );

        const report = {
            mode,
            initialProgress: Number(initial.progress.toFixed(3)),
            downMin: Number(Math.min(...downValues).toFixed(3)),
            downMax: Number(downMax.toFixed(3)),
            downSamples: downSamples.length,
            upMin: Number(upMin.toFixed(3)),
            upMax: Number(Math.max(...upValues).toFixed(3)),
            upSamples: upSamples.length,
            lineElement: initial.line,
        };

        console.log(JSON.stringify(report));
        return report;
    } finally {
        await context.close();
    }
}

const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

const reports = [];

try {
    for (const mode of modes) {
        reports.push(await testMode(browser, mode));
    }
} finally {
    await browser.close();
}

assert.equal(reports.length, modes.length);
console.log("MinhaTrajetoria scroll progress regression checks passed.");

import assert from "node:assert/strict";
import { appendFileSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const baseUrl = process.env.SCROLL_PERF_URL || "http://127.0.0.1:4173/";
const outputDirectory = path.resolve("artifacts/desktop-scroll-performance");
const viewport = { width: 1365, height: 900 };
const runsPerMode = 3;
const wheelDelta = 650;
const wheelPauseMs = 65;
const maxWheelStepsPerDirection = 60;
const modes = ["full", "reduced"];
const schedule = [
    { mode: "full", run: 1 },
    { mode: "reduced", run: 1 },
    { mode: "reduced", run: 2 },
    { mode: "full", run: 2 },
    { mode: "full", run: 3 },
    { mode: "reduced", run: 3 },
];

function percentile(values, p) {
    if (!values.length) return null;
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.min(
        sorted.length - 1,
        Math.max(0, Math.ceil((p / 100) * sorted.length) - 1),
    );
    return sorted[index];
}

function median(values) {
    if (!values.length) return null;
    const sorted = [...values].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    return sorted.length % 2
        ? sorted[middle]
        : (sorted[middle - 1] + sorted[middle]) / 2;
}

function summarizeSample(sample) {
    const intervals = sample.frameIntervalsMs;
    const longTasks = sample.longTasksDuringScroll;
    const longFrames = sample.longAnimationFramesDuringScroll;

    return {
        mode: sample.mode,
        run: sample.run,
        durationSeconds: sample.durationMs / 1000,
        frameSamples: intervals.length,
        medianFrameIntervalMs: median(intervals),
        p95FrameIntervalMs: percentile(intervals, 95),
        framesOver20ms: intervals.filter((value) => value > 20).length,
        framesOver20msPct: intervals.length
            ? (intervals.filter((value) => value > 20).length / intervals.length) * 100
            : null,
        framesOver33ms: intervals.filter((value) => value > 33.33).length,
        framesOver50ms: intervals.filter((value) => value > 50).length,
        estimatedDroppedFrames: intervals.reduce(
            (total, value) => total + Math.max(0, Math.floor(value / (1000 / 60)) - 1),
            0,
        ),
        longTaskCount: longTasks.length,
        longTaskTotalMs: longTasks.reduce((total, task) => total + task.overlapMs, 0),
        estimatedBlockingMs: longTasks.reduce(
            (total, task) => total + Math.max(0, task.overlapMs - 50),
            0,
        ),
        longestLongTaskMs: longTasks.reduce((max, task) => Math.max(max, task.overlapMs), 0),
        longAnimationFrameCount: longFrames.length,
        longAnimationFrameTotalMs: longFrames.reduce((total, frame) => total + frame.overlapMs, 0),
        scrollEventCount: sample.scrollEventCount,
        scrollDistancePx: sample.scrollDistancePx,
        maxScrollCoveragePct: sample.maxScrollY > 0
            ? Math.min(100, (sample.maxObservedScrollY / sample.maxScrollY) * 100)
            : 0,
        maxScrollY: sample.maxScrollY,
        maxObservedScrollY: sample.maxObservedScrollY,
        reachedTop: sample.endingScrollY <= 10,
    };
}

function format(value, digits = 1) {
    return Number.isFinite(value) ? value.toFixed(digits) : "n/a";
}

function formatDelta(reduced, full, unit = "", digits = 1) {
    if (!Number.isFinite(reduced) || !Number.isFinite(full)) return "n/a";
    const delta = reduced - full;
    const sign = delta > 0 ? "+" : delta < 0 ? "−" : "";
    return `${sign}${Math.abs(delta).toFixed(digits)}${unit}`;
}

function modeMedian(samples, key) {
    return median(samples.filter((sample) => sample.mode === key).map((sample) => sample[key]));
}

function aggregate(samples, mode) {
    const selected = samples.filter((sample) => sample.mode === mode);
    const numericKeys = [
        "durationSeconds",
        "frameSamples",
        "medianFrameIntervalMs",
        "p95FrameIntervalMs",
        "framesOver20ms",
        "framesOver20msPct",
        "framesOver33ms",
        "framesOver50ms",
        "estimatedDroppedFrames",
        "longTaskCount",
        "longTaskTotalMs",
        "estimatedBlockingMs",
        "longestLongTaskMs",
        "longAnimationFrameCount",
        "longAnimationFrameTotalMs",
        "scrollEventCount",
        "scrollDistancePx",
        "maxScrollCoveragePct",
    ];

    return Object.fromEntries([
        ["mode", mode],
        ["sampleCount", selected.length],
        ...numericKeys.map((key) => [key, median(selected.map((sample) => sample[key]))]),
        ["runs", selected.map((sample) => sample.run)],
    ]);
}

async function installInstrumentation(context, mode) {
    await context.addInitScript((selectedMode) => {
        try {
            window.localStorage.setItem("experienceMode", selectedMode);
        } catch {
            // about:blank may not expose localStorage; the application origin will.
        }

        const state = {
            mode: selectedMode,
            active: false,
            startTime: null,
            endTime: null,
            frameIntervalsMs: [],
            longTasks: [],
            longAnimationFrames: [],
            scrollEventCount: 0,
            scrollDistancePx: 0,
            previousScrollY: null,
            maxObservedScrollY: 0,
        };

        window.__scrollInteractionPerf = state;

        let previousFrameTimestamp = null;
        const observeFrames = (timestamp) => {
            if (state.active) {
                if (previousFrameTimestamp !== null) {
                    state.frameIntervalsMs.push(timestamp - previousFrameTimestamp);
                }
                previousFrameTimestamp = timestamp;
            } else {
                previousFrameTimestamp = null;
            }

            requestAnimationFrame(observeFrames);
        };
        requestAnimationFrame(observeFrames);

        window.addEventListener("scroll", () => {
            if (!state.active) return;

            const currentY = window.scrollY;

            if (Number.isFinite(state.previousScrollY)) {
                state.scrollDistancePx += Math.abs(currentY - state.previousScrollY);
            }

            state.previousScrollY = currentY;
            state.scrollEventCount += 1;
            state.maxObservedScrollY = Math.max(state.maxObservedScrollY, currentY);
        }, { passive: true });

        if (typeof PerformanceObserver !== "undefined") {
            try {
                const longTaskObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        state.longTasks.push({
                            startTime: entry.startTime,
                            duration: entry.duration,
                        });
                    }
                });
                longTaskObserver.observe({ type: "longtask", buffered: true });
            } catch {
                // Not every Chromium build enables the long-task entry type.
            }

            try {
                const frameObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        state.longAnimationFrames.push({
                            startTime: entry.startTime,
                            duration: entry.duration,
                        });
                    }
                });
                frameObserver.observe({ type: "long-animation-frame", buffered: true });
            } catch {
                // Long Animation Frame entries are optional; RAF gaps remain available.
            }
        }
    }, mode);
}

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

    // Let initial Hero entry animations and ScrollTrigger setup settle before recording.
    await page.waitForTimeout(1500);
}

async function scrollToBoundary(page, direction) {
    let stationaryAtBoundary = 0;
    let lastY = await page.evaluate(() => window.scrollY);
    let steps = 0;

    await page.mouse.move(Math.floor(viewport.width * 0.75), Math.floor(viewport.height * 0.55));

    while (steps < maxWheelStepsPerDirection && stationaryAtBoundary < 3) {
        await page.mouse.wheel(0, direction * wheelDelta);
        await page.waitForTimeout(wheelPauseMs);
        steps += 1;

        const position = await page.evaluate(() => ({
            y: window.scrollY,
            maxY: Math.max(
                document.documentElement.scrollHeight,
                document.body.scrollHeight,
            ) - window.innerHeight,
        }));

        const atBoundary = direction > 0
            ? position.y >= position.maxY - 10
            : position.y <= 10;

        if (atBoundary && Math.abs(position.y - lastY) < 1) {
            stationaryAtBoundary += 1;
        } else if (atBoundary) {
            stationaryAtBoundary = 0;
        } else {
            stationaryAtBoundary = 0;
        }

        lastY = position.y;
    }

    return { steps, reachedBoundary: stationaryAtBoundary >= 3 };
}

async function runSample(browser, mode, run) {
    const context = await browser.newContext({
        viewport,
        deviceScaleFactor: 1,
        isMobile: false,
        hasTouch: false,
        reducedMotion: "no-preference",
    });

    const page = await context.newPage();
    await installInstrumentation(context, mode);

    try {
        console.log(`Starting desktop scroll measurement: mode=${mode}, run=${run}/${runsPerMode}`);
        await waitForPageReady(page, mode);

        const dimensions = await page.evaluate(() => ({
            viewportHeight: window.innerHeight,
            documentHeight: Math.max(
                document.documentElement.scrollHeight,
                document.body.scrollHeight,
            ),
            startY: window.scrollY,
        }));

        await page.evaluate(() => {
            const state = window.__scrollInteractionPerf;
            state.active = true;
            state.startTime = performance.now();
            state.endTime = null;
            state.frameIntervalsMs = [];
            state.scrollEventCount = 0;
            state.scrollDistancePx = 0;
            state.previousScrollY = window.scrollY;
            state.maxObservedScrollY = window.scrollY;
            state.measurementStartY = window.scrollY;
        });

        const down = await scrollToBoundary(page, 1);
        await page.waitForTimeout(180);
        const up = await scrollToBoundary(page, -1);
        await page.waitForTimeout(180);

        const captured = await page.evaluate(() => {
            const state = window.__scrollInteractionPerf;
            state.endTime = performance.now();
            state.active = false;

            const start = state.startTime;
            const end = state.endTime;

            const overlappingEntries = (entries) => entries
                .map((entry) => {
                    const entryEnd = entry.startTime + entry.duration;
                    const overlapStart = Math.max(start, entry.startTime);
                    const overlapEnd = Math.min(end, entryEnd);
                    return {
                        startTime: entry.startTime,
                        duration: entry.duration,
                        overlapMs: Math.max(0, overlapEnd - overlapStart),
                    };
                })
                .filter((entry) => entry.overlapMs > 0);

            return {
                mode: state.mode,
                run: null,
                durationMs: end - start,
                frameIntervalsMs: [...state.frameIntervalsMs],
                longTasksDuringScroll: overlappingEntries(state.longTasks),
                longAnimationFramesDuringScroll: overlappingEntries(state.longAnimationFrames),
                scrollEventCount: state.scrollEventCount,
                scrollDistancePx: state.scrollDistancePx,
                maxObservedScrollY: state.maxObservedScrollY,
                endingScrollY: window.scrollY,
                maxScrollY: Math.max(
                    document.documentElement.scrollHeight,
                    document.body.scrollHeight,
                ) - window.innerHeight,
                documentHeightBeforeScroll: null,
            };
        });

        await page.waitForTimeout(150);
        captured.run = run;
        captured.documentHeightBeforeScroll = dimensions.documentHeight;
        captured.downwardSteps = down.steps;
        captured.upwardSteps = up.steps;
        captured.reachedBottom = down.reachedBoundary;
        captured.reachedTop = up.reachedBoundary;

        assert.ok(
            captured.frameIntervalsMs.length > 20,
            `Not enough animation-frame samples for mode=${mode}, run=${run}.`,
        );

        if (!captured.reachedBottom || !captured.reachedTop) {
            console.warn(
                `Scroll boundary warning mode=${mode} run=${run}: ` +
                `bottom=${captured.reachedBottom}, top=${captured.reachedTop}.`,
            );
        }

        const sample = summarizeSample(captured);
        sample.reachedBottom = captured.reachedBottom;
        sample.reachedTop = captured.reachedTop;
        sample.downwardWheelSteps = captured.downwardSteps;
        sample.upwardWheelSteps = captured.upwardSteps;
        sample.documentHeightBeforeScroll = captured.documentHeightBeforeScroll;

        console.log(JSON.stringify(sample));
        return sample;
    } finally {
        await context.close();
    }
}

const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

const samples = [];

try {
    for (const item of schedule) {
        samples.push(await runSample(browser, item.mode, item.run));
    }
} finally {
    await browser.close();
}

for (const mode of modes) {
    assert.equal(
        samples.filter((sample) => sample.mode === mode).length,
        runsPerMode,
        `Expected ${runsPerMode} samples for mode ${mode}.`,
    );
}

const summaries = Object.fromEntries(
    modes.map((mode) => {
        const selected = samples.filter((sample) => sample.mode === mode);
        const keys = [
            "durationSeconds",
            "frameSamples",
            "medianFrameIntervalMs",
            "p95FrameIntervalMs",
            "framesOver20ms",
            "framesOver20msPct",
            "framesOver33ms",
            "framesOver50ms",
            "estimatedDroppedFrames",
            "longTaskCount",
            "longTaskTotalMs",
            "estimatedBlockingMs",
            "longestLongTaskMs",
            "longAnimationFrameCount",
            "longAnimationFrameTotalMs",
            "scrollEventCount",
            "scrollDistancePx",
            "maxScrollCoveragePct",
        ];

        const values = Object.fromEntries(
            keys.map((key) => [key, median(selected.map((sample) => sample[key]))]),
        );

        return [mode, { mode, runs: selected.length, ...values }];
    }),
);

const full = summaries.full;
const reduced = summaries.reduced;

const comparisonDefinitions = [
    ["Median frame interval", "medianFrameIntervalMs", "ms", 2],
    ["95th percentile frame interval", "p95FrameIntervalMs", "ms", 1],
    ["Frame intervals over 20 ms", "framesOver20msPct", "%", 1],
    ["Frame intervals over 33.3 ms", "framesOver33ms", "", 0],
    ["Frame intervals over 50 ms", "framesOver50ms", "", 0],
    ["Estimated dropped frames", "estimatedDroppedFrames", "", 0],
    ["Long tasks (50 ms+)", "longTaskCount", "", 0],
    ["Long task duration", "longTaskTotalMs", " ms", 1],
    ["Estimated blocking time", "estimatedBlockingMs", " ms", 1],
    ["Long Animation Frame entries", "longAnimationFrameCount", "", 0],
    ["Scroll events", "scrollEventCount", "", 0],
    ["Measured scroll distance", "scrollDistancePx", " px", 0],
];

const tableRows = comparisonDefinitions.map(([label, key, unit, digits]) =>
    `| ${label} | ${format(full[key], digits)}${unit} | ${format(reduced[key], digits)}${unit} | ${formatDelta(reduced[key], full[key], unit, digits)} |`,
);

const sampleRows = samples.map((sample) =>
    `| ${sample.mode} | ${sample.run} | ${format(sample.durationSeconds, 2)} s | ${format(sample.medianFrameIntervalMs, 2)} ms | ${format(sample.p95FrameIntervalMs, 1)} ms | ${format(sample.framesOver20msPct, 1)}% | ${sample.framesOver33ms} | ${sample.framesOver50ms} | ${sample.longTaskCount} | ${format(sample.estimatedBlockingMs, 1)} ms | ${format(sample.maxScrollCoveragePct, 1)}% |`,
);

const summary = [
    "# Desktop scroll interaction performance",
    "",
    "- **Test type:** scripted real mouse-wheel input in Chromium while collecting browser performance entries.",
    "- **Viewport:** 1365 × 900, desktop, device scale factor 1.",
    "- **Runs:** 3 per mode; tables show the median of each mode's three samples.",
    "- **Important:** this measures scroll interaction, not the standard Lighthouse page-load score. Frame gaps over 20/33/50 ms are proxies for delayed frames, not a direct physical display measurement.",
    "- **Navigation:** every sample uses a fresh browser context with the requested `experienceMode` set before the app code executes.",
    "",
    "## Median comparison",
    "",
    "| Metric | Full animation | Reduced animation | Reduced − Full |",
    "|---|---:|---:|---:|",
    ...tableRows,
    "",
    "Lower values are generally better for frame intervals, delayed frames and blocking work. Scroll distance and event count depend partly on how smoothly each implementation reaches the page boundaries, so interpret those alongside the boundary/coverage columns.",
    "",
    "## Individual samples",
    "",
    "| Mode | Run | Duration | Median frame interval | p95 frame interval | Frames >20 ms | Frames >33 ms | Frames >50 ms | Long tasks | Blocking time | Max scroll coverage |",
    "|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|",
    ...sampleRows,
    "",
    "## Interpretation notes",
    "",
    "- A lower p95 frame interval and fewer intervals over 33/50 ms usually indicate a steadier scroll experience.",
    "- Estimated blocking time is calculated from long tasks observed during the measurement window; Long Animation Frame data is shown when the browser supports that entry type.",
    "- Browser automation runs on a GitHub-hosted Linux runner. The relative comparison is useful under identical test conditions, but absolute results can differ on the user's PC and browser.",
].join("\n");

mkdirSync(outputDirectory, { recursive: true });
writeFileSync(
    path.join(outputDirectory, "scroll-performance.json"),
    JSON.stringify(
        {
            measuredAt: new Date().toISOString(),
            baseUrl,
            viewport,
            runsPerMode,
            medians: summaries,
            samples,
        },
        null,
        2,
    ),
);
writeFileSync(path.join(outputDirectory, "scroll-performance.md"), summary);
console.log(summary);

if (process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${summary}\n`);
}

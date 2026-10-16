import assert from "node:assert/strict";
import { chromium } from "playwright";

const baseUrl = process.env.TRAJECTORY_TEST_URL || "http://127.0.0.1:4173/";
const viewport = { width: 1365, height: 900 };
const modes = ["reduced", "full"];
const wheelDelta = 420;
const wheelPauseMs = 140;
const maxStepsPerDirection = 85;

async function waitForPageReady(page, expectedMode, { navigate = true } = {}) {
    if (navigate) {
        await page.goto(baseUrl, {
            waitUntil: "domcontentloaded",
            timeout: 60000,
        });
    }

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

    // Formação agora é lazy: monte a seção antes de medir a linha e volte ao topo.
    await page.evaluate(() => {
        document.documentElement.style.scrollBehavior = "auto";
        const formation = document.querySelector("#formacao");
        formation?.scrollIntoView({ block: "center", behavior: "instant" });
    });

    await page.locator('#formacao[aria-busy="false"]').waitFor({
        state: "attached",
        timeout: 60000,
    });

    await page.evaluate(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
    });

    // Aguarda Lenis, a linha de progresso e os ScrollTriggers assentarem novamente.
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

        const formation = document.querySelector("#formacao");
        const formationTop = formation?.getBoundingClientRect().top ?? null;
        const timeline = document.querySelector("[data-trajectory-timeline]");
        const timelineTop = timeline?.getBoundingClientRect().top ?? null;

        if (!line) {
            return {
                progress: null,
                visibleLineCount: lines.filter((element) => {
                    const style = getComputedStyle(element);
                    return style.display !== "none" && element.offsetHeight > 0;
                }).length,
                scrollY: window.scrollY,
                lineTop: null,
                formationTop,
                timelineTop,
                viewportHeight: window.innerHeight,
            };
        }

        const transform = getComputedStyle(line).transform;
        const progress = transform === "none"
            ? 1
            : new DOMMatrixReadOnly(transform).m22;
        const lineTop = line.getBoundingClientRect().top;

        return {
            progress,
            line: line.dataset.trajectoryProgressLine,
            scrollY: window.scrollY,
            lineTop,
            formationTop,
            timelineTop,
            viewportHeight: window.innerHeight,
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

function assertLineStaysEmptyBeforeFormation(samples, mode) {
    for (const sample of samples) {
        assert.notEqual(
            sample.formationTop,
            null,
            `Could not locate #formacao while checking premature progress in ${mode}.`,
        );

        const details =
            `scaleY=${sample.progress.toFixed(3)}, lineTop=${sample.lineTop?.toFixed(1)}, ` +
            `formationTop=${sample.formationTop.toFixed(1)}, scrollY=${sample.scrollY}.`;

        // A linha não deve avançar enquanto o topo da Formação ainda está abaixo da viewport.
        if (sample.formationTop > sample.viewportHeight + 40) {
            assert.ok(
                sample.progress <= 0.08,
                `Trajectory line advanced before #formacao entered the viewport in ${mode}: ${details}`,
            );
        }

        // O trigger é a área inteira da trajetória, não a linha decorativa.
        // O teste envia wheel events em intervalos curtos, enquanto Lenis e scrub: 1
        // continuam suavizando a posição. Tolera 220px ao redor do início para evitar
        // classificar a defasagem visual do scrub como avanço prematuro.
        assert.notEqual(
            sample.timelineTop,
            null,
            `Could not locate [data-trajectory-timeline] in ${mode}.`,
        );

        const expectedTriggerStartTop = sample.viewportHeight * 0.78 + 220;
        if (sample.timelineTop > expectedTriggerStartTop) {
            assert.ok(
                sample.progress <= 0.08,
                `Trajectory line advanced before its ScrollTrigger trigger reached the start in ${mode}: ${details} timelineTop=${sample.timelineTop.toFixed(1)}.`,
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
        assertLineStaysEmptyBeforeFormation(downSamples, mode);
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

async function testModeSwitchReload(browser) {
    const context = await browser.newContext({
        viewport,
        deviceScaleFactor: 1,
        isMobile: false,
        hasTouch: false,
        reducedMotion: "no-preference",
    });

    // Inicia em Reduced e preserva o modo escolhido durante o reload da página.
    await context.addInitScript(() => {
        try {
            if (sessionStorage.getItem("__trajectory_mode_initialized") !== "1") {
                localStorage.setItem("experienceMode", "reduced");
                sessionStorage.setItem("__trajectory_mode_initialized", "1");
            }
        } catch {
            // The about:blank origin may not expose storage.
        }
    });

    const page = await context.newPage();

    try {
        console.log("Testing real mode switch: reduced -> full from MinhaTrajetoria");
        await waitForPageReady(page, "reduced");

        // Coloca a linha real da trajetória na viewport antes de trocar de modo.
        await page.evaluate(() => {
            document.documentElement.style.scrollBehavior = "auto";
            const line = document.querySelector('[data-trajectory-progress-line="desktop"]');

            if (!line) {
                throw new Error("Could not find the desktop trajectory line before switching modes.");
            }

            const targetY =
                window.scrollY +
                line.getBoundingClientRect().top -
                window.innerHeight * 0.4;

            window.scrollTo(0, Math.max(0, targetY));
        });

        await page.waitForFunction(
            () => {
                const button = document.querySelector('button[aria-label="Abrir menu"]');
                return Boolean(
                    button &&
                    getComputedStyle(button).pointerEvents !== "none" &&
                    Number(getComputedStyle(button).opacity) > 0.8
                );
            },
            null,
            { timeout: 15000 },
        );

        const beforeSwitch = await readLineProgress(page);
        const beforeSwitchY = await page.evaluate(() => window.scrollY);
        assert.ok(
            beforeSwitchY > 100,
            "The test must switch modes while scrolled into MinhaTrajetoria; scrollY=" + beforeSwitchY + ".",
        );

        await page.locator('button[aria-label="Abrir menu"]').click();

        const fullOption = page.locator('[data-experience-mode-option="full"]');
        await fullOption.waitFor({ state: "visible", timeout: 10000 });

        const reload = page.waitForNavigation({
            waitUntil: "domcontentloaded",
            timeout: 60000,
        });

        await fullOption.click();
        await reload;
        await waitForPageReady(page, "full", { navigate: false });

        const afterReload = await readLineProgress(page);
        assert.notEqual(
            afterReload.progress,
            null,
            "Could not locate the trajectory line after switching to Full.",
        );
        assert.ok(
            afterReload.scrollY <= 5,
            "Changing to Full should restart at the top to avoid restoring a scroll position from the old layout; scrollY=" +
                afterReload.scrollY + ".",
        );
        assert.ok(
            afterReload.progress <= 0.08,
            "The trajectory line should be empty at the top after switching to Full; scaleY=" +
                afterReload.progress.toFixed(3) + ".",
        );

        const downSamples = await scrollAndSample(page, 1);
        assertLineStaysEmptyBeforeFormation(downSamples, "Full after mode switch");
        assertProgressIsMonotonic(downSamples, 1, "Full after mode switch");

        const downValues = downSamples.map((sample) => sample.progress);
        const downMax = Math.max(...downValues);
        assert.ok(
            downMax >= 0.95,
            "The line should reach the end after switching to Full; max scaleY=" + downMax.toFixed(3) + ".",
        );
        assert.ok(
            intermediateProgressBands(downSamples).size >= 2,
            "The line should fill gradually after switching to Full.",
        );

        const upSamples = await scrollAndSample(page, -1);
        assertProgressIsMonotonic(upSamples, -1, "Full after mode switch");

        const upValues = upSamples.map((sample) => sample.progress);
        const upMin = Math.min(...upValues);
        assert.ok(
            upMin <= 0.08,
            "The line should return nearly empty when scrolling back up after switching to Full; min scaleY=" +
                upMin.toFixed(3) + ".",
        );
        assert.ok(
            intermediateProgressBands(upSamples).size >= 2,
            "The line should reverse gradually after switching to Full.",
        );

        console.log(JSON.stringify({
            scenario: "reduced -> full from MinhaTrajetoria",
            scrollBeforeSwitch: Math.round(beforeSwitchY),
            progressBeforeSwitch: Number(beforeSwitch.progress.toFixed(3)),
            scrollAfterReload: Math.round(afterReload.scrollY),
            initialLineProgress: Number(afterReload.progress.toFixed(3)),
            downMax: Number(downMax.toFixed(3)),
            upMin: Number(upMin.toFixed(3)),
        }));
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

    await testModeSwitchReload(browser);
} finally {
    await browser.close();
}

assert.equal(reports.length, modes.length);
console.log("MinhaTrajetoria scroll progress regression checks passed.");

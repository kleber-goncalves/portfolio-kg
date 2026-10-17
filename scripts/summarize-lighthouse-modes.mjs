import { appendFileSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const outputRoot = path.resolve("lighthouse-comparison");
const modes = ["full", "reduced"];

const metricDefinitions = [
    {
        key: "performance",
        label: "Performance",
        kind: "score",
        read: (lhr) => {
            const score = lhr.categories?.performance?.score;
            return Number.isFinite(score) ? score * 100 : null;
        },
    },
    {
        key: "first-contentful-paint",
        label: "First Contentful Paint (FCP)",
        kind: "time",
    },
    {
        key: "largest-contentful-paint",
        label: "Largest Contentful Paint (LCP)",
        kind: "time",
    },
    {
        key: "total-blocking-time",
        label: "Total Blocking Time (TBT)",
        kind: "time",
    },
    {
        key: "speed-index",
        label: "Speed Index",
        kind: "time",
    },
    {
        key: "cumulative-layout-shift",
        label: "Cumulative Layout Shift (CLS)",
        kind: "decimal",
    },
    {
        key: "total-byte-weight",
        label: "Total transfer size",
        kind: "bytes",
    },
    {
        key: "dom-size",
        label: "DOM elements",
        kind: "integer",
    },
];

function getMetricValue(lhr, metric) {
    if (metric.key === "performance") {
        return metric.read(lhr);
    }

    const value = lhr.audits?.[metric.key]?.numericValue;
    return Number.isFinite(value) ? value : null;
}

function median(values) {
    const sorted = [...values].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);

    if (sorted.length === 0) return null;

    return sorted.length % 2 === 0
        ? (sorted[middle - 1] + sorted[middle]) / 2
        : sorted[middle];
}

function loadReports(mode) {
    const directory = path.join(outputRoot, mode);
    const files = readdirSync(directory)
        .filter((file) => /^lhr-.*\.json$/.test(file))
        .sort();

    if (files.length !== 3) {
        throw new Error(
            `Expected 3 Lighthouse JSON reports for "${mode}", found ${files.length} in ${directory}.`,
        );
    }

    return files.map((file) => {
        const fullPath = path.join(directory, file);
        return JSON.parse(readFileSync(fullPath, "utf8"));
    });
}

function formatSigned(value, formatter) {
    const sign = value > 0 ? "+" : value < 0 ? "−" : "";
    return `${sign}${formatter(Math.abs(value))}`;
}

function formatMetric(value, kind) {
    if (value === null || !Number.isFinite(value)) return "n/a";

    switch (kind) {
        case "score":
            return `${value.toFixed(0)}/100`;
        case "time":
            return value >= 1000
                ? `${(value / 1000).toFixed(2)} s`
                : `${Math.round(value)} ms`;
        case "decimal":
            return value.toFixed(3);
        case "bytes":
            return `${(value / 1024).toFixed(1)} KiB`;
        case "integer":
            return Math.round(value).toLocaleString("en-US");
        default:
            return String(value);
    }
}

function formatDelta(fullValue, reducedValue, kind) {
    if (
        fullValue === null ||
        reducedValue === null ||
        !Number.isFinite(fullValue) ||
        !Number.isFinite(reducedValue)
    ) {
        return "n/a";
    }

    const delta = reducedValue - fullValue;
    let deltaText;

    switch (kind) {
        case "score":
            deltaText = formatSigned(delta, (value) => `${value.toFixed(0)} pts`);
            break;
        case "time":
            deltaText = formatSigned(delta, (value) =>
                value >= 1000 ? `${(value / 1000).toFixed(2)} s` : `${Math.round(value)} ms`,
            );
            break;
        case "decimal":
            deltaText = formatSigned(delta, (value) => value.toFixed(3));
            break;
        case "bytes":
            deltaText = formatSigned(delta, (value) => `${(value / 1024).toFixed(1)} KiB`);
            break;
        case "integer":
            deltaText = formatSigned(delta, (value) =>
                `${Math.round(value).toLocaleString("en-US")} elements`,
            );
            break;
        default:
            deltaText = String(delta);
    }

    if (kind === "score" || fullValue === 0) return deltaText;

    const percent = (delta / fullValue) * 100;
    const percentText = `${percent > 0 ? "+" : ""}${percent.toFixed(1)}%`;
    return `${deltaText} (${percentText})`;
}

const reportsByMode = Object.fromEntries(
    modes.map((mode) => [mode, loadReports(mode)]),
);

const results = {};

for (const mode of modes) {
    results[mode] = {};

    for (const metric of metricDefinitions) {
        const values = reportsByMode[mode]
            .map((lhr) => getMetricValue(lhr, metric))
            .filter((value) => value !== null);

        if (values.length !== 3) {
            throw new Error(
                `Metric "${metric.key}" did not produce 3 numeric samples for mode "${mode}".`,
            );
        }

        results[mode][metric.key] = median(values);
    }
}

const rows = metricDefinitions.map((metric) => {
    const full = results.full[metric.key];
    const reduced = results.reduced[metric.key];

    return `| ${metric.label} | ${formatMetric(full, metric.kind)} | ${formatMetric(reduced, metric.kind)} | ${formatDelta(full, reduced, metric.kind)} |`;
});

const summary = [
    "## Lighthouse: experiência completa vs. reduzida",
    "",
    "Medição mobile com 3 execuções por modo; a tabela apresenta a mediana. Valores da coluna de diferença são **Reduzida − Completa**. Para os tempos, CLS, transferência e DOM, valores negativos geralmente são melhores; para a pontuação Performance, valores positivos são melhores.",
    "",
    "| Métrica | Completa (mediana) | Reduzida (mediana) | Diferença (Reduzida − Completa) |",
    "|---|---:|---:|---:|",
    ...rows,
    "",
    "Os relatórios JSON/HTML individuais de cada execução estão no artefato `lighthouse-experience-mode-comparison`.",
].join("\n");

console.log(summary);

if (process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${summary}\n`);
}

mkdirSync(outputRoot, { recursive: true });
writeFileSync(
    path.join(outputRoot, "summary.json"),
    JSON.stringify(
        {
            measuredAt: new Date().toISOString(),
            runsPerMode: 3,
            strategy: "mobile",
            results,
        },
        null,
        2,
    ),
);

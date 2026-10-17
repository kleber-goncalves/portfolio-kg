import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { gzipSync } from "node:zlib";
import { chromium } from "playwright";
import { TraceMap, decodedMappings } from "@jridgewell/trace-mapping";

const root = process.cwd();
const assetsDir = path.join(root, "dist", "assets");
const outputDir = path.join(root, "dist");
const baseUrl = process.env.COVERAGE_URL || "http://127.0.0.1:4173/";

const scenarios = [
    { id: "desktop-initial", title: "Desktop — primeira tela", mobile: false, fullPage: false, width: 1365, height: 900 },
    { id: "desktop-full-page", title: "Desktop — página percorrida", mobile: false, fullPage: true, width: 1365, height: 900 },
    { id: "mobile-initial", title: "Celular — primeira tela", mobile: true, fullPage: false, width: 390, height: 844 },
    { id: "mobile-full-page", title: "Celular — página percorrida", mobile: true, fullPage: true, width: 390, height: 844 },
];

const toKiB = (bytes) => (bytes / 1024).toFixed(1);
const toPct = (part, total) => (total > 0 ? ((part / total) * 100).toFixed(1) : "0.0");

function sourceLabel(source, sourceRoot = "") {
    if (source == null) return "[código gerado sem mapeamento]";
    let value = String(source);
    if (sourceRoot && !value.startsWith("/") && !value.startsWith("webpack://")) {
        value = path.posix.join(String(sourceRoot), value);
    }
    value = value.replace(/\\/g, "/").replace(/^file:\/\/[^/]+/, "");

    const nodeModulesPosition = value.lastIndexOf("/node_modules/");
    if (nodeModulesPosition >= 0) {
        value = value.slice(nodeModulesPosition + 1);
    } else if (!value.startsWith("node_modules/")) {
        const srcPosition = value.lastIndexOf("/src/");
        if (srcPosition >= 0) value = value.slice(srcPosition + 1);
        else value = value.replace(/^(\.\.\/)+/, "").replace(/^\/+/, "");
    }
    if (value.startsWith("webpack://")) value = value.replace(/^webpack:\/\/[^/]+\//, "");
    return value || "[código gerado sem mapeamento]";
}

function packageLabel(modulePath) {
    if (!modulePath || modulePath.startsWith("[")) return "código gerado";
    if (!modulePath.startsWith("node_modules/")) return "código da aplicação";
    const parts = modulePath.split("/");
    if (parts[1] === ".vite" && parts[2] === "deps" && parts[3]) {
        return "npm:" + parts[3].replace(/\.(mjs|cjs|js)$/, "");
    }
    const name = parts[1] && parts[1].startsWith("@")
        ? parts.slice(1, 3).join("/")
        : parts[1];
    return "npm:" + (name || "desconhecido");
}

// Converte as faixas aninhadas do V8 em intervalos sem sobreposição.
// A faixa mais interna prevalece, então uma função não chamada não herda
// incorretamente a cobertura da função externa.
function buildUsedIntervals(functions, sourceLength) {
    const events = new Map();
    const addEvent = (offset, type, range) => {
        if (!events.has(offset)) events.set(offset, { starts: [], ends: [] });
        events.get(offset)[type].push(range);
    };

    let id = 0;
    for (const fn of functions || []) {
        for (const item of fn.ranges || []) {
            const start = Math.max(0, Math.min(sourceLength, item.startOffset));
            const end = Math.max(0, Math.min(sourceLength, item.endOffset));
            if (end <= start) continue;
            const range = { id: id++, start, end, length: end - start, count: Number(item.count) || 0 };
            addEvent(start, "starts", range);
            addEvent(end, "ends", range);
        }
    }

    const positions = Array.from(events.keys()).sort((a, b) => a - b);
    const active = new Map();
    const used = [];

    for (let i = 0; i < positions.length - 1; i += 1) {
        const position = positions[i];
        const event = events.get(position);
        for (const range of event.ends) active.delete(range.id);
        for (const range of event.starts) active.set(range.id, range);

        const next = positions[i + 1];
        if (next <= position || active.size === 0) continue;

        let deepest = null;
        for (const range of active.values()) {
            if (range.start > position || range.end < next) continue;
            if (
                deepest === null ||
                range.length < deepest.length ||
                (range.length === deepest.length && range.count > deepest.count)
            ) deepest = range;
        }

        if (!deepest || deepest.count <= 0) continue;
        const last = used[used.length - 1];
        if (last && last.end === position) last.end = next;
        else used.push({ start: position, end: next });
    }

    return used;
}

function makeSourceSpans(code, map) {
    const lines = decodedMappings(new TraceMap(map));
    const lineStarts = [0];
    for (let i = 0; i < code.length; i += 1) {
        if (code.charCodeAt(i) === 10) lineStarts.push(i + 1);
    }

    const spans = [];
    for (let lineIndex = 0; lineIndex < lineStarts.length; lineIndex += 1) {
        const lineStart = lineStarts[lineIndex];
        const lineEnd = lineIndex + 1 < lineStarts.length ? lineStarts[lineIndex + 1] - 1 : code.length;
        const lineLength = lineEnd - lineStart;
        const mappings = lines[lineIndex] || [];
        let cursor = 0;

        if (mappings.length === 0) {
            if (lineLength > 0) spans.push({ start: lineStart, end: lineEnd, module: "[código gerado sem mapeamento]" });
        } else {
            for (let i = 0; i < mappings.length; i += 1) {
                const segment = mappings[i];
                const startColumn = Math.max(cursor, Math.min(lineLength, segment[0]));
                const endColumn = Math.max(
                    startColumn,
                    Math.min(lineLength, i + 1 < mappings.length ? mappings[i + 1][0] : lineLength),
                );

                if (startColumn > cursor) {
                    spans.push({ start: lineStart + cursor, end: lineStart + startColumn, module: "[código gerado sem mapeamento]" });
                }

                if (endColumn > startColumn) {
                    const sourceIndex = segment.length >= 4 ? segment[1] : null;
                    const src = sourceIndex == null ? null : map.sources[sourceIndex];
                    spans.push({
                        start: lineStart + startColumn,
                        end: lineStart + endColumn,
                        module: sourceLabel(src, map.sourceRoot || ""),
                    });
                    cursor = endColumn;
                }
            }
            if (cursor < lineLength) {
                spans.push({ start: lineStart + cursor, end: lineEnd, module: "[código gerado sem mapeamento]" });
            }
        }

        if (lineIndex + 1 < lineStarts.length) {
            spans.push({ start: lineEnd, end: lineEnd + 1, module: "[quebra de linha]" });
        }
    }
    return spans.filter((span) => span.end > span.start).sort((a, b) => a.start - b.start);
}

function measureModules(spans, usedIntervals) {
    const modules = new Map();
    let firstPossibleInterval = 0;

    for (const span of spans) {
        const length = span.end - span.start;
        let used = 0;
        while (
            firstPossibleInterval < usedIntervals.length &&
            usedIntervals[firstPossibleInterval].end <= span.start
        ) firstPossibleInterval += 1;

        for (
            let i = firstPossibleInterval;
            i < usedIntervals.length && usedIntervals[i].start < span.end;
            i += 1
        ) {
            const interval = usedIntervals[i];
            used += Math.max(0, Math.min(span.end, interval.end) - Math.max(span.start, interval.start));
        }

        const row = modules.get(span.module) || {
            module: span.module,
            package: packageLabel(span.module),
            totalChars: 0,
            usedChars: 0,
        };
        row.totalChars += length;
        row.usedChars += used;
        modules.set(span.module, row);
    }

    return Array.from(modules.values()).map((row) => ({
        ...row,
        unusedChars: Math.max(0, row.totalChars - row.usedChars),
        usedPercent: Number(toPct(row.usedChars, row.totalChars)),
    }));
}

async function scrollThroughPage(page) {
    let previousHeight = -1;
    for (let pass = 0; pass < 3; pass += 1) {
        for (let step = 0; step < 45; step += 1) {
            const before = await page.evaluate(() => ({
                y: window.scrollY,
                viewport: window.innerHeight,
                height: Math.max(document.documentElement.scrollHeight, document.body.scrollHeight),
            }));
            const maxY = Math.max(0, before.height - before.viewport);
            const target = Math.min(maxY, before.y + Math.max(250, Math.floor(before.viewport * 0.78)));
            if (target <= before.y + 1) break;

            await page.mouse.wheel(0, target - before.y);
            await page.waitForTimeout(250);
            const actualY = await page.evaluate(() => window.scrollY);
            if (Math.abs(actualY - target) > Math.max(100, before.viewport * 0.2)) {
                await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), target);
            }
            await page.waitForTimeout(250);
        }

        await page.waitForTimeout(1200);
        const height = await page.evaluate(() =>
            Math.max(document.documentElement.scrollHeight, document.body.scrollHeight),
        );
        if (height === previousHeight) break;
        previousHeight = height;
        await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
        await page.waitForTimeout(350);
    }

    await page.evaluate(() => window.scrollTo({
        top: Math.max(document.documentElement.scrollHeight, document.body.scrollHeight),
        behavior: "instant",
    }));
    await page.waitForTimeout(1600);
}

function mergeModuleRows(left, right) {
    const combined = new Map();
    for (const row of [...(left || []), ...(right || [])]) {
        const current = combined.get(row.module) || {
            module: row.module,
            package: row.package,
            totalChars: 0,
            usedChars: 0,
        };
        current.totalChars = Math.max(current.totalChars, row.totalChars);
        current.usedChars = Math.max(current.usedChars, row.usedChars);
        combined.set(row.module, current);
    }
    return Array.from(combined.values());
}

async function analyzeScenario(browser, scenario, knownAssets) {
    const context = await browser.newContext({
        viewport: { width: scenario.width, height: scenario.height },
        deviceScaleFactor: 1,
        isMobile: scenario.mobile,
        hasTouch: scenario.mobile,
    });
    const page = await context.newPage();
    const cdp = await context.newCDPSession(page);
    await cdp.send("Profiler.enable");
    await cdp.send("Profiler.startPreciseCoverage", { callCount: false, detailed: true });

    try {
        await page.goto(baseUrl, { waitUntil: "load", timeout: 60000 });
        await page.waitForTimeout(2500);
        if (scenario.fullPage) await scrollThroughPage(page);

        const result = await cdp.send("Profiler.takePreciseCoverage");
        const scriptCoverage = (result.result || []).filter((item) => item.url && item.url.endsWith(".js"));
        const perAsset = new Map();

        for (const script of scriptCoverage) {
            let filename;
            try {
                filename = path.basename(new URL(script.url).pathname);
            } catch {
                continue;
            }
            const asset = knownAssets.get(filename);
            if (!asset) continue;

            const usedIntervals = buildUsedIntervals(script.functions, asset.code.length);
            const usedChars = usedIntervals.reduce((sum, row) => sum + row.end - row.start, 0);
            let modules;

            if (asset.map) {
                modules = measureModules(makeSourceSpans(asset.code, asset.map), usedIntervals);
            } else {
                modules = [{
                    module: "[mapa de origem ausente: " + filename + "]",
                    package: "código gerado",
                    totalChars: asset.code.length,
                    usedChars,
                    unusedChars: Math.max(0, asset.code.length - usedChars),
                    usedPercent: Number(toPct(usedChars, asset.code.length)),
                }];
            }

            const existing = perAsset.get(filename);
            if (existing) {
                existing.usedChars = Math.max(existing.usedChars, usedChars);
                existing.modules = mergeModuleRows(existing.modules, modules);
            } else {
                perAsset.set(filename, {
                    file: filename,
                    url: script.url,
                    rawBytes: asset.rawBytes,
                    gzipBytes: asset.gzipBytes,
                    totalChars: asset.code.length,
                    usedChars,
                    unusedChars: Math.max(0, asset.code.length - usedChars),
                    modules,
                });
            }
        }

        if (perAsset.size === 0) {
            throw new Error("Nenhum script do site foi associado a dist/assets. Verifique o preview e a instrumentação do Chrome.");
        }

        const assets = Array.from(perAsset.values()).map((asset) => ({
            ...asset,
            unusedPercent: Number(toPct(asset.unusedChars, asset.totalChars)),
            modules: asset.modules.map((row) => ({
                ...row,
                unusedChars: Math.max(0, row.totalChars - row.usedChars),
                usedPercent: Number(toPct(row.usedChars, row.totalChars)),
            })).sort((a, b) => b.unusedChars - a.unusedChars),
        })).sort((a, b) => b.rawBytes - a.rawBytes);

        const moduleMap = new Map();
        for (const asset of assets) {
            for (const module of asset.modules) {
                const current = moduleMap.get(module.module) || {
                    module: module.module,
                    package: module.package,
                    totalChars: 0,
                    usedChars: 0,
                };
                current.totalChars += module.totalChars;
                current.usedChars += module.usedChars;
                moduleMap.set(module.module, current);
            }
        }
        const modules = Array.from(moduleMap.values()).map((row) => ({
            ...row,
            unusedChars: Math.max(0, row.totalChars - row.usedChars),
            usedPercent: Number(toPct(row.usedChars, row.totalChars)),
        }));

        const packageMap = new Map();
        for (const module of modules) {
            const current = packageMap.get(module.package) || {
                package: module.package,
                totalChars: 0,
                usedChars: 0,
            };
            current.totalChars += module.totalChars;
            current.usedChars += module.usedChars;
            packageMap.set(module.package, current);
        }
        const packages = Array.from(packageMap.values()).map((row) => ({
            ...row,
            unusedChars: Math.max(0, row.totalChars - row.usedChars),
            usedPercent: Number(toPct(row.usedChars, row.totalChars)),
        })).sort((a, b) => b.unusedChars - a.unusedChars);

        const totalChars = assets.reduce((sum, asset) => sum + asset.totalChars, 0);
        const usedChars = assets.reduce((sum, asset) => sum + asset.usedChars, 0);
        return {
            id: scenario.id,
            title: scenario.title,
            viewport: scenario.width + "x" + scenario.height,
            scriptsLoaded: assets.length,
            rawBytes: assets.reduce((sum, asset) => sum + asset.rawBytes, 0),
            gzipBytes: assets.reduce((sum, asset) => sum + asset.gzipBytes, 0),
            totalChars,
            usedChars,
            unusedChars: Math.max(0, totalChars - usedChars),
            unusedPercent: Number(toPct(Math.max(0, totalChars - usedChars), totalChars)),
            assets,
            modules: modules.map((row) => ({
                ...row,
                unusedChars: Math.max(0, row.totalChars - row.usedChars),
                usedPercent: Number(toPct(row.usedChars, row.totalChars)),
            })).sort((a, b) => b.unusedChars - a.unusedChars),
            packages,
        };
    } finally {
        await cdp.detach().catch(() => {});
        await context.close();
    }
}

function renderMarkdown(results) {
    const lines = [
        "# Diagnóstico de JavaScript não executado",
        "",
        "Gerado pelo GitHub Actions em " + new Date().toISOString() + ".",
        "",
        "## Como interpretar",
        "",
        "- A medição usa cobertura precisa do V8/Chrome e mapas de origem do build de diagnóstico para estimar quais trechos foram executados em quatro cenários.",
        "- 'Não executado' significa que o trecho não rodou durante o caminho de teste; não prova que seja código morto. Botões, menus, formulários e estados alternativos precisam ser exercitados antes de considerar remoção.",
        "- A cobertura usa unidades de caracteres do JavaScript gerado, não bytes transferidos. O tamanho gzip é uma estimativa local e não equivale diretamente à economia indicada pelo Lighthouse.",
        "- O build com mapas de origem é exclusivo do diagnóstico: não altera o build normal nem publica mapas na Vercel.",
        "",
        "## Resumo por cenário",
        "",
        "| Cenário | Arquivos JS observados | JS sem compressão | gzip estimado | Código não executado no caminho testado |",
        "|---|---:|---:|---:|---:|",
    ];

    for (const row of results) {
        lines.push(
            "| " + row.title +
            " | " + row.scriptsLoaded +
            " | " + toKiB(row.rawBytes) + " KiB" +
            " | " + toKiB(row.gzipBytes) + " KiB" +
            " | " + toPct(row.unusedChars, row.totalChars) + "% (" + row.unusedChars.toLocaleString("pt-BR") + " / " + row.totalChars.toLocaleString("pt-BR") + " chars) |",
        );
    }

    for (const row of results) {
        lines.push(
            "",
            "## " + row.title,
            "",
            "Cobertura agregada do código gerado: **" + toPct(row.usedChars, row.totalChars) + "% executado** e **" + toPct(row.unusedChars, row.totalChars) + "% não executado** neste caminho de teste.",
            "",
            "### Arquivos carregados",
            "",
            "| Arquivo | Sem compressão | gzip estimado | Executado | Não executado |",
            "|---|---:|---:|---:|---:|",
        );

        for (const asset of row.assets) {
            lines.push(
                "| " + asset.file +
                " | " + toKiB(asset.rawBytes) + " KiB" +
                " | " + toKiB(asset.gzipBytes) + " KiB" +
                " | " + toPct(asset.usedChars, asset.totalChars) + "%" +
                " | " + toPct(asset.unusedChars, asset.totalChars) + "% (" + asset.unusedChars.toLocaleString("pt-BR") + " chars) |",
            );
        }

        const candidates = row.modules.filter((module) => module.unusedChars >= 500).slice(0, 15);
        lines.push(
            "",
            "### Módulos com mais código não executado",
            "",
            "| Módulo de origem | Pacote/grupo | Total mapeado | Executado | Não executado |",
            "|---|---|---:|---:|---:|",
        );

        if (candidates.length === 0) {
            lines.push("| Nenhum módulo atingiu o limite de 500 caracteres | — | — | — | — |");
        } else {
            for (const module of candidates) {
                lines.push(
                    "| " + module.module.replace(/\|/g, "\\|") +
                    " | " + module.package.replace(/\|/g, "\\|") +
                    " | " + module.totalChars.toLocaleString("pt-BR") +
                    " | " + toPct(module.usedChars, module.totalChars) + "%" +
                    " | " + module.unusedChars.toLocaleString("pt-BR") + " (" + toPct(module.unusedChars, module.totalChars) + "%) |",
                );
            }
        }

        lines.push(
            "",
            "### Pacotes/grupos com mais código não executado",
            "",
            "| Pacote/grupo | Total mapeado | Executado | Não executado |",
            "|---|---:|---:|---:|",
        );

        for (const item of row.packages.slice(0, 10)) {
            lines.push(
                "| " + item.package.replace(/\|/g, "\\|") +
                " | " + item.totalChars.toLocaleString("pt-BR") +
                " | " + toPct(item.usedChars, item.totalChars) + "%" +
                " | " + item.unusedChars.toLocaleString("pt-BR") + " (" + toPct(item.unusedChars, item.totalChars) + "%) |",
            );
        }
    }

    lines.push(
        "",
        "## Próxima etapa",
        "",
        "Priorizar dependências do bundle principal com muito código não executado na primeira tela; exercitar as interações correspondentes antes de remover módulos; validar cada ajuste novamente com Lighthouse. Cobertura de runtime, sozinha, não prova que um trecho seja removível nem garante aumento da pontuação.",
        "",
    );
    return lines.join("\n");
}

const filenames = (await readdir(assetsDir)).filter((name) => name.endsWith(".js"));
if (filenames.length === 0) throw new Error("Nenhum arquivo JavaScript foi encontrado em dist/assets.");

const knownAssets = new Map();
for (const filename of filenames) {
    const filePath = path.join(assetsDir, filename);
    const buffer = await readFile(filePath);
    const mapText = await readFile(filePath + ".map", "utf8").catch(() => null);
    knownAssets.set(filename, {
        code: buffer.toString("utf8"),
        rawBytes: buffer.byteLength,
        gzipBytes: gzipSync(buffer, { level: 9 }).byteLength,
        map: mapText ? JSON.parse(mapText) : null,
    });
}

const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

const results = [];
try {
    for (const scenario of scenarios) {
        console.log("Analisando cenário: " + scenario.title);
        results.push(await analyzeScenario(browser, scenario, knownAssets));
    }
} finally {
    await browser.close();
}

const report = {
    generatedAt: new Date().toISOString(),
    testedUrl: baseUrl,
    note: "A cobertura representa apenas os caminhos percorridos durante o teste; código não executado não é necessariamente código morto.",
    scenarios: results,
};

const markdown = renderMarkdown(results);
await writeFile(path.join(outputDir, "js-runtime-coverage.json"), JSON.stringify(report, null, 2) + "\n");
await writeFile(path.join(outputDir, "js-runtime-coverage.md"), markdown + "\n");
console.log(markdown);

import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import {
    brotliCompressSync,
    constants as zlibConstants,
    gzipSync,
} from "node:zlib";

const distDir = path.resolve("dist");
const assetsDir = path.join(distDir, "assets");
const visualizerPath = path.join(distDir, "bundle-analysis.html");

const visualizerInfo = await stat(visualizerPath).catch(() => null);
if (!visualizerInfo?.isFile()) {
    throw new Error("O relatório bundle-analysis.html não foi gerado pelo visualizador.");
}

const names = await readdir(assetsDir);
const jsNames = names.filter((name) => name.endsWith(".js"));

if (jsNames.length === 0) {
    throw new Error("Nenhum arquivo JavaScript foi encontrado em dist/assets.");
}

const assets = [];
for (const name of jsNames) {
    const filePath = path.join(assetsDir, name);
    const buffer = await readFile(filePath);

    assets.push({
        file: name,
        rawBytes: buffer.byteLength,
        gzipBytes: gzipSync(buffer, { level: 9 }).byteLength,
        brotliBytes: brotliCompressSync(buffer, {
            params: {
                [zlibConstants.BROTLI_PARAM_QUALITY]: 11,
            },
        }).byteLength,
    });
}

assets.sort((a, b) => b.rawBytes - a.rawBytes);

const total = assets.reduce(
    (acc, asset) => ({
        rawBytes: acc.rawBytes + asset.rawBytes,
        gzipBytes: acc.gzipBytes + asset.gzipBytes,
        brotliBytes: acc.brotliBytes + asset.brotliBytes,
    }),
    { rawBytes: 0, gzipBytes: 0, brotliBytes: 0 },
);

const toKiB = (bytes) => (bytes / 1024).toFixed(1);
const report = {
    generatedAt: new Date().toISOString(),
    javascriptFileCount: assets.length,
    totals: total,
    assets,
};

const markdown = [
    "# Diagnóstico do bundle JavaScript",
    "",
    `Gerado pelo GitHub Actions em ${report.generatedAt}.`,
    "",
    "## Resumo",
    "",
    `- Arquivos JavaScript: **${assets.length}**`,
    `- Tamanho combinado sem compressão: **${toKiB(total.rawBytes)} KiB**`,
    `- Estimativa combinada com gzip: **${toKiB(total.gzipBytes)} KiB**`,
    `- Estimativa combinada com Brotli: **${toKiB(total.brotliBytes)} KiB**`,
    "",
    "## Arquivos gerados",
    "",
    "| Arquivo | Sem compressão | gzip estimado | Brotli estimado |",
    "|---|---:|---:|---:|",
    ...assets.map(
        (asset) =>
            `| ${asset.file} | ${toKiB(asset.rawBytes)} KiB | ${toKiB(asset.gzipBytes)} KiB | ${toKiB(asset.brotliBytes)} KiB |`,
    ),
    "",
    "## Como interpretar",
    "",
    "- Abra **bundle-analysis.html** para ver a distribuição do bundle por módulo e dependência.",
    "- Esta tabela mede o tamanho dos arquivos de build; sozinha, ela não comprova quanto tempo cada módulo ocupa na CPU.",
    "- Os tamanhos comprimidos são estimativas locais. O valor real transferido depende da compressão e dos cabeçalhos do servidor/CDN.",
    "- Cruze o treemap com os diagnósticos de Lighthouse de **JavaScript não utilizado**, **tempo de inicialização** e **trabalho da thread principal** antes de remover ou dividir código.",
    "",
].join("\n");

await writeFile(
    path.join(distDir, "js-bundle-report.json"),
    `${JSON.stringify(report, null, 2)}\n`,
);
await writeFile(path.join(distDir, "js-bundle-report.md"), markdown);

console.log(markdown);

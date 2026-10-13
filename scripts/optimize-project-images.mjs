import { readdir, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const inputRoot = path.join(root, "src/assets/projetos");
const outputRoot = path.join(root, "public/_optimized/projetos");
const metadataPath = path.join(root, "src/generated/imageMetadata.json");
const widths = [320, 640, 960, 1280];
const supported = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const metadata = {};

async function walk(directory) {
    let entries;

    try {
        entries = await readdir(directory, { withFileTypes: true });
    } catch {
        return [];
    }

    const files = [];

    for (const entry of entries) {
        const fullPath = path.join(directory, entry.name);

        if (entry.isDirectory()) {
            files.push(...(await walk(fullPath)));
        } else if (supported.has(path.extname(entry.name).toLowerCase())) {
            files.push(fullPath);
        }
    }

    return files;
}

const files = await walk(inputRoot);

if (files.length === 0) {
    console.log("Nenhuma imagem encontrada em src/assets/projetos.");
}

for (const file of files) {
    const relative = path.relative(inputRoot, file);
    const parsed = path.parse(relative);
    const outputDirectory = path.join(outputRoot, parsed.dir);
    const key = parsed.base;
    const image = sharp(file, { failOn: "none" });
    const info = await image.metadata();

    if (!info.width || !info.height) {
        console.warn(`Ignorando imagem sem dimensões: ${relative}`);
        continue;
    }

    await mkdir(outputDirectory, { recursive: true });

    const availableWidths = widths.filter((width) => width < info.width);
    if (!availableWidths.includes(info.width)) availableWidths.push(info.width);
    const variants = [];

    for (const width of [...new Set(availableWidths)].sort((a, b) => a - b)) {
        const suffix = width === info.width ? "original" : String(width);
        const filename = `${parsed.name}-${suffix}.webp`;
        const destination = path.join(outputDirectory, filename);

        await sharp(file)
            .resize({ width, withoutEnlargement: true })
            .webp({ quality: 78, effort: 5 })
            .toFile(destination);

        const publicPath = `/_optimized/projetos/${parsed.dir ? `${parsed.dir.replaceAll(path.sep, "/")}/` : ""}${filename}`;
        variants.push({ width: Math.min(width, info.width), src: publicPath });
    }

    const largest = variants[variants.length - 1];
    const fallback = variants.find((variant) => variant.width >= Math.min(640, info.width)) ?? largest;

    metadata[key] = {
        src: fallback.src,
        width: info.width,
        height: info.height,
        srcSet: variants.map(({ src, width }) => `${src} ${width}w`).join(", "),
        sizes: "(max-width: 640px) 89vw, (max-width: 1024px) 70vw, 560px",
    };

    console.log(`Otimizadas: ${relative} (${info.width}×${info.height})`);
}

await mkdir(path.dirname(metadataPath), { recursive: true });
await writeFile(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`);
console.log(`Metadados escritos: ${Object.keys(metadata).length} imagens.`);

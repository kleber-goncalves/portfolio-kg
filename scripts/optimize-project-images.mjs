import { readdir, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const inputRoot = path.join(root, "src/assets/projetos");
const optimizedRoot = path.join(root, "public/_optimized");
const metadataPath = path.join(root, "src/generated/imageMetadata.json");
const heroProfileUrl = "https://github.com/kleber-goncalves.png";
const widths = [320, 640, 960, 1280, 1600];
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

async function optimizeImage({
    input,
    key,
    baseName,
    outputDirectory,
    publicDirectory,
    sizes,
    fallbackWidth = 640,
    label = key,
}) {
    const info = await sharp(input, { failOn: "none" }).metadata();

    if (!info.width || !info.height) {
        console.warn(`Ignorando imagem sem dimensões: ${label}`);
        return;
    }

    const destinationDirectory = path.join(optimizedRoot, outputDirectory);
    await mkdir(destinationDirectory, { recursive: true });

    const availableWidths = widths.filter((width) => width < info.width);

    if (info.width <= 1600 && !availableWidths.includes(info.width)) {
        availableWidths.push(info.width);
    }

    const variants = [];

    for (const width of [...new Set(availableWidths)].sort((a, b) => a - b)) {
        const suffix = width === info.width ? "original" : String(width);
        const filename = `${baseName}-${suffix}.webp`;
        const destination = path.join(destinationDirectory, filename);

        await sharp(input, { failOn: "none" })
            .resize({ width, withoutEnlargement: true })
            .webp({ quality: 78, effort: 5 })
            .toFile(destination);

        const publicPath = `/_optimized/${publicDirectory ? `${publicDirectory}/` : ""}${filename}`;
        variants.push({ width: Math.min(width, info.width), src: publicPath });
    }

    const fallback =
        variants.find((variant) => variant.width >= Math.min(fallbackWidth, info.width)) ??
        variants[variants.length - 1];

    metadata[key] = {
        src: fallback.src,
        width: info.width,
        height: info.height,
        srcSet: variants.map(({ src, width }) => `${src} ${width}w`).join(", "),
        sizes,
    };

    console.log(`Otimizadas: ${label} (${info.width}×${info.height})`);
}

const projectFiles = await walk(inputRoot);

if (projectFiles.length === 0) {
    console.log("Nenhuma imagem encontrada em src/assets/projetos.");
}

for (const file of projectFiles) {
    const relative = path.relative(inputRoot, file);
    const parsed = path.parse(relative);
    const relativeDirectory = parsed.dir.split(path.sep).filter(Boolean);
    const outputDirectory = path.join("projetos", ...relativeDirectory);
    const publicDirectory = ["projetos", ...relativeDirectory].join("/");

    await optimizeImage({
        input: file,
        key: parsed.base,
        baseName: parsed.name,
        outputDirectory,
        publicDirectory,
        sizes: "(max-width: 640px) 89vw, (max-width: 1024px) 70vw, 560px",
        fallbackWidth: 640,
        label: relative,
    });
}

// Fetch the GitHub-hosted portrait in CI, then commit only optimized local variants.
const profileResponse = await fetch(heroProfileUrl, {
    redirect: "follow",
    headers: { "User-Agent": "KLEBER-DEV-image-optimizer" },
});

if (!profileResponse.ok) {
    throw new Error(`Falha ao baixar a foto do HeroMobile: HTTP ${profileResponse.status}`);
}

const profileContentType = profileResponse.headers.get("content-type") ?? "";

if (!profileContentType.startsWith("image/")) {
    throw new Error(`A URL da foto do HeroMobile não retornou uma imagem: ${profileContentType || "content-type ausente"}`);
}

const profileBuffer = Buffer.from(await profileResponse.arrayBuffer());

await optimizeImage({
    input: profileBuffer,
    key: "kleber-goncalves.png",
    baseName: "kleber-goncalves",
    outputDirectory: "hero",
    publicDirectory: "hero",
    sizes: "216px",
    fallbackWidth: 320,
    label: "HeroMobile profile image",
});

await mkdir(path.dirname(metadataPath), { recursive: true });
await writeFile(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`);
console.log(`Metadados escritos: ${Object.keys(metadata).length} imagens.`);

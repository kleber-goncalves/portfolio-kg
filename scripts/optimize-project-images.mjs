import { access, mkdir, readdir, writeFile } from "node:fs/promises";
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

async function fileExists(filePath) {
    try {
        await access(filePath);
        return true;
    } catch {
        return false;
    }
}

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

    if (!fallback) {
        console.warn(`Nenhuma variante gerada para: ${label}`);
        return;
    }

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
    console.log("Nenhuma imagem encontrada em src/assets/projetos; etapa ignorada.");
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

// HeroDesktop é opcional em branches que ainda não têm a imagem local.
const desktopPortraitPath = path.join(root, "public", "euNv.png");

if (await fileExists(desktopPortraitPath)) {
    await optimizeImage({
        input: desktopPortraitPath,
        key: "euNv.png",
        baseName: "euNv",
        outputDirectory: "hero",
        publicDirectory: "hero",
        sizes: "(min-width: 1280px) 970px, (min-width: 1024px) 440px, 420px",
        fallbackWidth: 640,
        label: "HeroDesktop portrait (public/euNv.png)",
    });
} else {
    console.log("Imagem pública do HeroDesktop ausente; etapa ignorada.");
}

// HeroMobile usa o retrato hospedado no GitHub. Só o baixa quando o componente existe.
const mobileHeroPath = path.join(root, "src", "components", "HeroMobile.jsx");

if (await fileExists(mobileHeroPath)) {
    const profileResponse = await fetch(heroProfileUrl, {
        redirect: "follow",
        headers: { "User-Agent": "KLEBER-DEV-image-optimizer" },
    });

    if (!profileResponse.ok) {
        throw new Error(`Falha ao baixar a foto do HeroMobile: HTTP ${profileResponse.status}`);
    }

    const profileContentType = profileResponse.headers.get("content-type") ?? "";

    if (!profileContentType.startsWith("image/")) {
        throw new Error(
            `A URL da foto do HeroMobile não retornou uma imagem: ${profileContentType || "content-type ausente"}`,
        );
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
} else {
    console.log("HeroMobile.jsx ausente; otimização do retrato remoto ignorada.");
}

// Só cria o arquivo de metadados quando há imagens ou ele já existia.
// Assim, branches ainda sem o portfólio não geram um JSON vazio desnecessário.
if (Object.keys(metadata).length > 0 || (await fileExists(metadataPath))) {
    await mkdir(path.dirname(metadataPath), { recursive: true });
    await writeFile(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`);
    console.log(`Metadados escritos: ${Object.keys(metadata).length} imagens.`);
} else {
    console.log("Nenhum metadado de imagem precisa ser gerado nesta branch.");
}

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const CONFIG_FILE = path.join(ROOT, "src", "data", "seoRoutes.json");
const SITEMAP_FILE = path.join(DIST, "sitemap.xml");

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll('"', "&quot;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
}

function escapeXml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&apos;");
}

function escapeRegex(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function setAttribute(tag, name, value) {
    const escapedValue = escapeHtml(value);
    const attributePattern = new RegExp(`\\b${name}=(["']).*?\\1`, "i");

    if (attributePattern.test(tag)) {
        return tag.replace(attributePattern, `${name}="${escapedValue}"`);
    }

    return tag.replace(/\s*\/?>$/, (ending) => ` ${name}="${escapedValue}"${ending}`);
}

function updateMeta(html, attribute, key, content) {
    const attributeValue = escapeRegex(key);
    const pattern = new RegExp(
        `<meta\\b(?=[^>]*\\b${attribute}=["']${attributeValue}["'])[^>]*>`,
        "i",
    );
    const match = html.match(pattern);

    if (!match) {
        throw new Error(`Meta tag ausente em index.html: ${attribute}="${key}"`);
    }

    return html.replace(pattern, setAttribute(match[0], "content", content));
}

function updateCanonical(html, canonicalUrl) {
    const pattern = /<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/i;
    const match = html.match(pattern);

    if (!match) {
        throw new Error("Link canonical ausente em dist/index.html.");
    }

    return html.replace(pattern, setAttribute(match[0], "href", canonicalUrl));
}

function buildPageJsonLd(page, canonicalUrl, config) {
    return JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": `${canonicalUrl}#webpage`,
        name: page.title,
        description: page.description,
        url: canonicalUrl,
        inLanguage: config.language,
        isPartOf: { "@id": config.websiteId },
        about: { "@id": config.personId },
    }).replaceAll("<", "\\u003c");
}

function updateRouteJsonLd(html, jsonLd) {
    const pattern = /<script\b(?=[^>]*\bid=["']route-seo-jsonld["'])[^>]*>[\s\S]*?<\/script>/i;
    const replacement = `<script id="route-seo-jsonld" type="application/ld+json">${jsonLd}</script>`;

    if (pattern.test(html)) return html.replace(pattern, replacement);

    return html.replace("</head>", `    ${replacement}\n    </head>`);
}

function createRouteHtml(baseHtml, route, page, config) {
    const canonicalUrl = new URL(route, config.siteUrl).href;
    const imageUrl = new URL(config.socialImagePath, config.siteUrl).href;
    const imageAlt = page.socialImageAlt || page.title;
    let html = baseHtml;

    // O preload do retrato do Hero é útil na Home, mas não deve ser baixado
    // desnecessariamente nas páginas internas.
    if (route !== "/") {
        html = html.replace(/<link\b(?=[^>]*\brel=["']preload["'])(?=[^>]*\bas=["']image["'])[^>]*>/i, "");
    }

    html = html.replace(/<title\b[^>]*>[\s\S]*?<\/title>/i, `<title>${escapeHtml(page.title)}</title>`);
    html = updateMeta(html, "name", "description", page.description);
    html = updateMeta(html, "name", "robots", "index,follow");

    const metaValues = [
        ["property", "og:type", "website"],
        ["property", "og:locale", "pt_BR"],
        ["property", "og:site_name", config.siteName],
        ["property", "og:title", page.title],
        ["property", "og:description", page.description],
        ["property", "og:url", canonicalUrl],
        ["property", "og:image", imageUrl],
        ["property", "og:image:alt", imageAlt],
        ["name", "twitter:card", "summary_large_image"],
        ["name", "twitter:image", imageUrl],
        ["name", "twitter:image:alt", imageAlt],
        ["name", "twitter:title", page.title],
        ["name", "twitter:description", page.description],
    ];

    for (const [attribute, key, value] of metaValues) {
        html = updateMeta(html, attribute, key, value);
    }

    html = updateCanonical(html, canonicalUrl);
    html = updateRouteJsonLd(html, buildPageJsonLd(page, canonicalUrl, config));

    return html;
}

function createSitemap(config) {
    const urls = Object.keys(config.routes)
        .map((route) => new URL(route, config.siteUrl).href)
        .map((url) => `    <url>\n        <loc>${escapeXml(url)}</loc>\n    </url>`)
        .join("\n");

    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

async function main() {
    const config = JSON.parse(await fs.readFile(CONFIG_FILE, "utf8"));
    const baseHtml = await fs.readFile(path.join(DIST, "index.html"), "utf8");

    for (const [route, page] of Object.entries(config.routes)) {
        const html = createRouteHtml(baseHtml, route, page, config);

        if (route === "/") {
            await fs.writeFile(path.join(DIST, "index.html"), html, "utf8");
            continue;
        }

        const routeDirectory = path.join(DIST, route.slice(1));
        await fs.mkdir(routeDirectory, { recursive: true });
        await fs.writeFile(path.join(routeDirectory, "index.html"), html, "utf8");
        console.log(`✓ HTML com SEO da rota gerado: ${route}/index.html`);
    }

    await fs.writeFile(SITEMAP_FILE, createSitemap(config), "utf8");
    console.log(`✓ Sitemap gerado com ${Object.keys(config.routes).length} URLs.`);
}

main().catch((error) => {
    console.error("✗ Falha ao gerar metadados estáticos e sitemap:", error);
    process.exitCode = 1;
});

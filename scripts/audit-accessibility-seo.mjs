import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const REPORT_DIR = path.join(ROOT, "artifacts", "accessibility-seo");
const BASE_URL = process.env.AUDIT_BASE_URL || "http://127.0.0.1:4173/";
const PUBLIC_URL = process.env.AUDIT_PUBLIC_URL || "https://kleber-dev1.vercel.app/";
const SOCIAL_IMAGE_URL = new URL("euNv.png", PUBLIC_URL).href;
const seo = { checks: [], summary: { pass: 0, warning: 0, error: 0 } };
const accessibility = { scans: [], semantics: [], interactions: [], violationGroups: 0 };

function attributes(tag) {
    const result = {};
    const pattern = /([^\s=]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
    let match;
    while ((match = pattern.exec(tag)) !== null) {
        result[match[1].toLowerCase()] = match[2] ?? match[3] ?? "";
    }
    return result;
}

function addSeo(level, id, message) {
    seo.checks.push({ level, id, message });
}

function auditSeo(html, robotsText, sitemapText) {
    const htmlTag = html.match(/<html\b[^>]*>/i)?.[0] ?? "";
    const lang = attributes(htmlTag).lang ?? "";
    const title = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? "";
    const metas = (html.match(/<meta\b[^>]*>/gi) ?? []).map((tag) => attributes(tag));
    const links = (html.match(/<link\b[^>]*>/gi) ?? []).map((tag) => attributes(tag));
    const findMeta = (key, value) =>
        metas.find((item) => (item[key] ?? "").toLowerCase() === value.toLowerCase())?.content ?? "";
    const meta = (key, value) => Boolean(findMeta(key, value));
    const description = findMeta("name", "description");
    const canonicalHref = links.find((item) =>
        (item.rel ?? "").toLowerCase().split(/\s+/).includes("canonical"))?.href ?? "";
    const rootInner = html.match(/<(main|div)\b[^>]*\bid=["']root["'][^>]*>([\s\S]*?)<\/\1>/i)?.[2] ?? "";
    const jsonLd = html.match(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i)?.[1] ?? "";
    let structuredData = null;
    try {
        structuredData = jsonLd ? JSON.parse(jsonLd) : null;
    } catch {
        structuredData = null;
    }
    const graphTypes = structuredData?.["@graph"]?.map((item) => item["@type"]) ?? [];
    const validStructuredData = Boolean(
        structuredData?.["@context"] === "https://schema.org" &&
        graphTypes.includes("Person") &&
        graphTypes.includes("WebSite") &&
        structuredData["@graph"].some((item) => item["@type"] === "WebSite" && item.url === PUBLIC_URL)
    );

    addSeo(lang === "pt-BR" ? "pass" : "error", "html-lang",
        lang ? "Idioma declarado: " + lang + "." : "O documento não declara o idioma.");
    addSeo(title ? "pass" : "error", "document-title",
        title ? "Título presente: " + title : "Título ausente.");
    addSeo(description.trim().length >= 50 ? "pass" : "error", "meta-description",
        description.trim().length >= 50
            ? "Meta description presente (" + description.trim().length + " caracteres)."
            : "Meta description ausente ou com menos de 50 caracteres.");
    addSeo(meta("name", "viewport") ? "pass" : "error", "meta-viewport",
        meta("name", "viewport") ? "Meta viewport presente." : "Meta viewport ausente.");

    for (const [key, value, label] of [
        ["property", "og:title", "Open Graph title"],
        ["property", "og:description", "Open Graph description"],
        ["property", "og:site_name", "Open Graph site name"],
        ["name", "twitter:card", "Twitter/X card"],
    ]) {
        const exists = meta(key, value);
        addSeo(exists ? "pass" : "error", value,
            exists ? label + " presente." : label + " ausente.");
    }

    addSeo(canonicalHref === PUBLIC_URL ? "pass" : "error", "canonical",
        canonicalHref === PUBLIC_URL
            ? "URL canônica coincide com o domínio de produção."
            : "A URL canônica precisa ser exatamente " + PUBLIC_URL + "; valor atual: " + (canonicalHref || "ausente") + ".");

    for (const [key, name, expected, label] of [
        ["property", "og:url", PUBLIC_URL, "Open Graph URL"],
        ["property", "og:image", SOCIAL_IMAGE_URL, "Open Graph image"],
        ["name", "twitter:image", SOCIAL_IMAGE_URL, "Twitter/X image"],
    ]) {
        const actual = findMeta(key, name);
        addSeo(actual === expected ? "pass" : "error", name,
            actual === expected
                ? label + " aponta para a URL pública esperada."
                : label + " deve apontar para " + expected + "; valor atual: " + (actual || "ausente") + ".");
    }

    for (const [key, name, label] of [
        ["property", "og:image:alt", "Texto alternativo da imagem Open Graph"],
        ["name", "twitter:image:alt", "Texto alternativo da imagem Twitter/X"],
    ]) {
        const actual = findMeta(key, name);
        addSeo(actual.trim() ? "pass" : "warning", name,
            actual.trim() ? label + " presente." : label + " ausente.");
    }

    const hasRobots = /user-agent:\s*\*/i.test(robotsText) &&
        robotsText.includes(new URL("sitemap.xml", PUBLIC_URL).href);
    const hasSitemap = /<urlset\b/i.test(sitemapText) &&
        sitemapText.includes("<loc>" + PUBLIC_URL + "</loc>");
    addSeo(hasRobots ? "pass" : "error", "robots-txt",
        hasRobots ? "robots.txt permite rastreamento e referencia o sitemap público." :
            "robots.txt está ausente ou não inclui User-agent: * e o sitemap público.");
    addSeo(hasSitemap ? "pass" : "error", "sitemap-xml",
        hasSitemap ? "sitemap.xml lista a URL de produção." :
            "sitemap.xml está ausente ou não lista " + PUBLIC_URL + ".");

    addSeo(validStructuredData ? "pass" : "error", "json-ld-structured-data",
        validStructuredData
            ? "JSON-LD válido com entidades Person e WebSite aponta para o domínio de produção."
            : "JSON-LD ausente ou inválido; é necessário definir Person e WebSite com a URL pública correta.");
    addSeo(rootInner.trim() ? "pass" : "warning", "static-html-content",
        rootInner.trim()
            ? "O HTML inicial contém conteúdo na raiz React."
            : "A raiz React é vazia no HTML inicial; o conteúdo depende de JavaScript. Considere prerender/SSR para fortalecer indexação e prévias sociais.");

    seo.summary = seo.checks.reduce((sum, check) => {
        sum[check.level] += 1;
        return sum;
    }, { pass: 0, warning: 0, error: 0 });
}

async function accessExists(filePath) {
    return fs.access(filePath).then(() => true).catch(() => false);
}

async function loadDeferredSections(page) {
    let previousHeight = -1;
    let stableAtBottom = 0;
    for (let step = 0; step < 55; step += 1) {
        const current = await page.evaluate(() => ({
            height: document.documentElement.scrollHeight,
            viewport: window.innerHeight,
            y: window.scrollY,
        }));
        const nextY = Math.min(current.y + Math.max(500, current.viewport * 0.8), current.height);
        await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), nextY);
        await page.waitForTimeout(220);
        const after = await page.evaluate(() => ({
            height: document.documentElement.scrollHeight,
            viewport: window.innerHeight,
            y: window.scrollY,
        }));
        if (after.y + after.viewport >= after.height - 4 && after.height === previousHeight) stableAtBottom += 1;
        else stableAtBottom = 0;
        if (stableAtBottom >= 3) break;
        previousHeight = after.height;
    }
    // Mantém a página no final do percurso: voltar ao topo reverte as animações GSAP
    // e faria o scanner avaliar textos durante estados transitórios de baixa opacidade.
    await page.waitForTimeout(900);
}

async function scan(page, label) {
    const result = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"])
        .analyze();
    const report = {
        label,
        viewport: page.viewportSize(),
        violationCount: result.violations.length,
        violations: result.violations.map((item) => ({
            id: item.id,
            impact: item.impact,
            help: item.help,
            helpUrl: item.helpUrl,
            nodes: item.nodes.slice(0, 8).map((node) => ({
                target: node.target,
                html: node.html,
                failureSummary: node.failureSummary,
            })),
            totalAffectedNodes: item.nodes.length,
        })),
        incomplete: result.incomplete.slice(0, 12).map((item) => ({
            id: item.id, impact: item.impact, help: item.help, nodeCount: item.nodes.length,
        })),
    };
    accessibility.scans.push(report);
    accessibility.violationGroups += result.violations.length;
    console.log("\n[axe] " + label + ": " + result.violations.length + " grupo(s) de violação, " +
        result.incomplete.length + " verificação(ões) inconclusiva(s).");
    for (const item of result.violations) {
        console.log("[axe][" + (item.impact ?? "não classificado") + "] " + item.id + ": " +
            item.help + " (" + item.nodes.length + " elemento(s))");
        for (const node of item.nodes.slice(0, 3)) {
            console.log("  - " + node.target.join(", ") + " | " +
                (node.failureSummary?.replace(/\s+/g, " ").slice(0, 260) ?? node.html.slice(0, 180)));
        }
    }
}

async function stabilizeVisualState(page) {
    await page.addStyleTag({
        content: "* { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }",
    });
    await page.evaluate(() => {
        document.querySelectorAll("*").forEach((element) => {
            const style = window.getComputedStyle(element);
            const opacity = Number(style.opacity);
            if (
                style.display !== "none" &&
                style.visibility !== "hidden" &&
                element.getClientRects().length > 0 &&
                opacity > 0 &&
                opacity < 1
            ) {
                element.style.setProperty("opacity", "1", "important");
            }
        });
    });
}

async function auditSemantics(page, label) {
    const result = await page.evaluate(() => {
        const isDisplayed = (element) => {
            const style = window.getComputedStyle(element);
            const rect = element.getBoundingClientRect();
            return style.display !== "none" && style.visibility !== "hidden" &&
                rect.width > 0 && rect.height > 0;
        };
        const displayed = (selector) => [...document.querySelectorAll(selector)].filter(isDisplayed);
        const accessibleName = (element) => Boolean(
            element.getAttribute("aria-label")?.trim() ||
            element.getAttribute("aria-labelledby")?.trim() ||
            element.innerText?.trim() ||
            [...element.querySelectorAll("img[alt]")].some((img) => img.alt.trim())
        );
        const buttons = displayed("button");
        const links = displayed("a");
        const titlelessIconButtons = buttons.filter((button) =>
            !button.innerText?.trim() && !button.getAttribute("title")?.trim()
        ).map((button) => ({
            html: button.outerHTML.slice(0, 240),
            ariaLabel: button.getAttribute("aria-label"),
        }));
        const unnamedButtons = buttons.filter((button) => !accessibleName(button))
            .map((button) => button.outerHTML.slice(0, 240));
        const unnamedLinks = links.filter((link) => !accessibleName(link))
            .map((link) => link.outerHTML.slice(0, 240));
        const unnamedNavs = displayed("nav").filter((nav) =>
            !nav.getAttribute("aria-label")?.trim() &&
            !nav.getAttribute("aria-labelledby")?.trim()
        ).map((nav) => nav.outerHTML.slice(0, 240));
        const divRoleButtons = displayed("div[role='button']")
            .map((element) => element.outerHTML.slice(0, 240));
        return {
            mainCount: displayed("main").length,
            h1Count: displayed("h1").length,
            buttonCount: buttons.length,
            linkCount: links.length,
            titlelessIconButtons,
            unnamedButtons,
            unnamedLinks,
            unnamedNavs,
            divRoleButtons,
        };
    });

    const checks = [
        { id: "single-main-landmark", failed: result.mainCount !== 1, detail: "Marcos main presentes: " + result.mainCount + " (esperado: 1)." },
        { id: "visible-h1", failed: result.h1Count !== 1, detail: "Títulos H1 presentes nas versões exibidas do layout: " + result.h1Count + " (esperado: 1)." },
        { id: "named-buttons", failed: result.unnamedButtons.length > 0, detail: result.unnamedButtons.length + " botão(ões) sem nome acessível." },
        { id: "named-links", failed: result.unnamedLinks.length > 0, detail: result.unnamedLinks.length + " link(s) sem nome acessível." },
        { id: "labelled-navigation", failed: result.unnamedNavs.length > 0, detail: result.unnamedNavs.length + " elemento(s) nav sem rótulo acessível." },
        { id: "icon-button-titles", failed: result.titlelessIconButtons.length > 0, detail: result.titlelessIconButtons.length + " botão(ões) somente com ícone sem title." },
        { id: "no-div-buttons", failed: result.divRoleButtons.length > 0, detail: result.divRoleButtons.length + " div(s) simulando botão; prefira um button real." },
    ];
    accessibility.semantics.push({ viewport: label, result, checks });
    for (const check of checks) {
        console.log("[semantics][" + (check.failed ? "ERROR" : "PASS") + "][" + label + "] " + check.id + ": " + check.detail);
    }
}

async function auditViewport(browser, setup) {
    const context = await browser.newContext({
        viewport: { width: setup.width, height: setup.height },
        deviceScaleFactor: setup.deviceScaleFactor ?? 1,
        isMobile: setup.isMobile ?? false,
        hasTouch: setup.hasTouch ?? false,
    });
    const page = await context.newPage();
    page.setDefaultTimeout(15000);
    try {
        await page.goto(BASE_URL, { waitUntil: "domcontentloaded", timeout: 45000 });
        await page.locator("h1").first().waitFor({ state: "attached", timeout: 20000 }).catch(() => {});
        await page.waitForTimeout(1100);
        await loadDeferredSections(page);
        await stabilizeVisualState(page);
        await auditSemantics(page, setup.label);
        await scan(page, setup.label + " — página inteira");

        if (setup.isMobile) {
            await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
            await page.waitForTimeout(400);
        } else {
            await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
            await page.waitForTimeout(250);
            await page.mouse.wheel(0, 1500);
            await page.waitForTimeout(1400);
        }
        const buttons = page.getByRole("button", { name: /abrir menu/i });
        let opened = false;
        for (let index = 0; index < await buttons.count(); index += 1) {
            const button = buttons.nth(index);
            if (await button.isVisible().catch(() => false)) {
                await button.click();
                opened = true;
                break;
            }
        }
        if (opened) {
            await page.waitForTimeout(900);
            await stabilizeVisualState(page);
            await scan(page, setup.label + " — menu aberto");
            await page.keyboard.press("Escape");
            await page.waitForTimeout(850);
            const openButton = page.getByRole("button", { name: /abrir menu/i }).first();
            const expanded = await openButton.getAttribute("aria-expanded").catch(() => null);
            const failed = expanded === "true";
            accessibility.interactions.push({
                viewport: setup.label,
                id: "escape-closes-menu",
                level: failed ? "error" : "pass",
                message: failed
                    ? "O botão de menu continua marcado como expandido depois de Escape."
                    : "Escape fechou o menu (aria-expanded não ficou true).",
            });
        } else {
            accessibility.interactions.push({
                viewport: setup.label,
                id: "menu-trigger",
                level: "warning",
                message: "Nenhum botão visível com nome 'Abrir menu' neste viewport.",
            });
        }
    } catch (error) {
        accessibility.interactions.push({
            viewport: setup.label, id: "audit-execution", level: "error", message: String(error?.stack ?? error),
        });
        console.error("[axe] Falha no viewport " + setup.label + ":", error);
    } finally {
        await context.close();
    }
}

async function main() {
    await fs.mkdir(REPORT_DIR, { recursive: true });
    const html = await fs.readFile(path.join(DIST, "index.html"), "utf8");
    const robotsText = await fs.readFile(path.join(DIST, "robots.txt"), "utf8").catch(() => "");
    const sitemapText = await fs.readFile(path.join(DIST, "sitemap.xml"), "utf8").catch(() => "");
    auditSeo(html, robotsText, sitemapText);
    for (const check of seo.checks) {
        console.log("[seo][" + check.level.toUpperCase() + "] " + check.id + ": " + check.message);
    }

    const browser = await chromium.launch({ headless: true });
    try {
        await auditViewport(browser, { label: "Desktop 1440×900", width: 1440, height: 900 });
        await auditViewport(browser, {
            label: "Mobile 390×844", width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 1,
        });
    } finally {
        await browser.close();
    }

    for (const item of accessibility.interactions) {
        console.log("[interaction][" + item.level.toUpperCase() + "] " + item.id + ": " + item.message);
    }
    await fs.writeFile(path.join(REPORT_DIR, "seo-report.json"), JSON.stringify(seo, null, 2));
    await fs.writeFile(path.join(REPORT_DIR, "accessibility-report.json"), JSON.stringify(accessibility, null, 2));
    const lines = [
        "# Accessibility and SEO audit",
        "",
        "- URL: " + BASE_URL,
        "- SEO: " + seo.summary.pass + " pass, " + seo.summary.warning + " warning(s), " + seo.summary.error + " error(s)",
        "- Axe violation groups (across scans): " + accessibility.violationGroups,
        "",
        "## SEO warnings and errors",
        ...seo.checks.filter((item) => item.level !== "pass").map((item) =>
            "- **" + item.level.toUpperCase() + " — " + item.id + ":** " + item.message),
        "",
        "## Runtime semantic checks",
        ...accessibility.semantics.flatMap((item) => [
            "### " + item.viewport,
            ...item.checks.map((check) => "- **" + (check.failed ? "ERROR" : "PASS") + " — " + check.id + ":** " + check.detail),
        ]),
        "",
        "## Axe findings",
        ...accessibility.scans.flatMap((item) => [
            "### " + item.label,
            ...(item.violations.length
                ? item.violations.map((violation) => "- **" + (violation.impact ?? "unspecified") + " — " +
                    violation.id + ":** " + violation.help + " (" + violation.nodes.length + " affected node(s))")
                : ["- No Axe violations detected in this state."]),
        ]),
        "",
        "## Interaction checks",
        ...accessibility.interactions.map((item) =>
            "- **" + item.level.toUpperCase() + " — " + item.id + ":** " + item.message),
        "",
        "> Automated results do not replace manual tests with keyboard-only navigation, screen readers, zoom/reflow and human review of image alternatives.",
    ];
    await fs.writeFile(path.join(REPORT_DIR, "summary.md"), lines.join("\n"), "utf8");

    const errors = accessibility.interactions.filter((item) => item.level === "error").length;
    const semanticErrors = accessibility.semantics.flatMap((item) => item.checks).filter((item) => item.failed).length;
    if (seo.summary.error > 0 || accessibility.violationGroups > 0 || errors > 0 || semanticErrors > 0) {
        console.error("\n[audit] FAILED: " + seo.summary.error + " static SEO error(s), " +
            accessibility.violationGroups + " Axe violation group(s), " + errors + " interaction error(s), " +
            semanticErrors + " semantic error(s).");
        process.exitCode = 1;
    } else {
        console.log("\n[audit] PASSED: no blocking static SEO errors or Axe violations. Review warnings in the reports.");
    }
}

main().catch(async (error) => {
    console.error("[audit] Fatal error:", error);
    await fs.mkdir(REPORT_DIR, { recursive: true }).catch(() => {});
    await fs.writeFile(path.join(REPORT_DIR, "fatal-error.txt"), String(error?.stack ?? error)).catch(() => {});
    process.exitCode = 1;
});

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const REPORT_DIR = path.join(ROOT, "artifacts", "accessibility-seo");
const BASE_URL = process.env.AUDIT_BASE_URL || "http://127.0.0.1:4173/";
const seo = { checks: [], summary: { pass: 0, warning: 0, error: 0 } };
const accessibility = { scans: [], interactions: [], violationGroups: 0 };

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

function auditSeo(html, hasRobots, hasSitemap) {
    const htmlTag = html.match(/<html\b[^>]*>/i)?.[0] ?? "";
    const lang = attributes(htmlTag).lang ?? "";
    const title = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? "";
    const metas = (html.match(/<meta\b[^>]*>/gi) ?? []).map((tag) => attributes(tag));
    const links = (html.match(/<link\b[^>]*>/gi) ?? []).map((tag) => attributes(tag));
    const meta = (key, value) => metas.some((item) => (item[key] ?? "").toLowerCase() === value.toLowerCase());
    const description = metas.find((item) => (item.name ?? "").toLowerCase() === "description")?.content ?? "";
    const canonical = links.some((item) => (item.rel ?? "").toLowerCase().split(/\s+/).includes("canonical"));
    const rootInner = html.match(/<main\b[^>]*\bid=["']root["'][^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? "";

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
        addSeo(exists ? "pass" : "warning", value, exists ? label + " presente." : label + " ausente.");
    }

    addSeo(canonical ? "pass" : "warning", "canonical",
        canonical ? "URL canônica declarada." : "URL canônica ausente; o domínio público definitivo precisa ser confirmado antes de defini-la.");
    for (const [value, label] of [
        ["og:url", "Open Graph URL"],
        ["og:image", "Open Graph image"],
        ["twitter:image", "Twitter/X image"],
    ]) {
        const exists = meta("property", value) || meta("name", value);
        addSeo(exists ? "pass" : "warning", value,
            exists ? label + " presente." : label + " ausente; as prévias de compartilhamento podem ficar incompletas.");
    }
    addSeo(hasRobots ? "pass" : "warning", "robots-txt",
        hasRobots ? "robots.txt está na saída de produção." : "robots.txt não encontrado na saída de produção.");
    addSeo(hasSitemap ? "pass" : "warning", "sitemap-xml",
        hasSitemap ? "sitemap.xml está na saída de produção." : "sitemap.xml não encontrado na saída de produção.");
    addSeo(rootInner.trim() ? "pass" : "warning", "static-html-content",
        rootInner.trim()
            ? "O HTML inicial contém conteúdo na raiz principal."
            : "O HTML inicial contém a raiz React vazia; o texto depende de JavaScript. Avaliar pré-renderização/SSR para fortalecer SEO e prévias sociais.");

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
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(650);
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
        await page.waitForTimeout(900);
        await loadDeferredSections(page);
        await scan(page, setup.label + " — página inteira");

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
            await page.waitForTimeout(450);
            await scan(page, setup.label + " — menu aberto");
            await page.keyboard.press("Escape");
            await page.waitForTimeout(350);
            const closeStillVisible = await page.getByRole("button", { name: /fechar menu/i })
                .isVisible().catch(() => false);
            accessibility.interactions.push({
                viewport: setup.label,
                id: "escape-closes-menu",
                level: closeStillVisible ? "warning" : "pass",
                message: closeStillVisible
                    ? "O botão 'Fechar menu' continua visível depois de Escape; precisa de conferência manual."
                    : "Depois de Escape, o botão 'Fechar menu' não permaneceu visível.",
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
    const hasRobots = await accessExists(path.join(DIST, "robots.txt"));
    const hasSitemap = await accessExists(path.join(DIST, "sitemap.xml"));
    auditSeo(html, hasRobots, hasSitemap);
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
    if (seo.summary.error > 0 || accessibility.violationGroups > 0 || errors > 0) {
        console.error("\n[audit] FAILED: " + seo.summary.error + " static SEO error(s), " +
            accessibility.violationGroups + " Axe violation group(s), " + errors + " audit error(s).");
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

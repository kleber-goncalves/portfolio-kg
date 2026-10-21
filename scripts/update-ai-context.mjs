import { execFileSync } from "node:child_process";
import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const DOC_PATH = path.join(ROOT, "docs", "AI_CONTEXT.md");
const START_MARKER = "<!-- BEGIN AUTO-GENERATED SECTION -->";
const END_MARKER = "<!-- END AUTO-GENERATED SECTION -->";
const CHECK_ONLY = process.argv.includes("--check");

function git(args) {
    return execFileSync("git", args, {
        cwd: ROOT,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
    }).trimEnd();
}

function markdownCell(value) {
    return String(value ?? "")
        .replaceAll("|", "\\|")
        .replace(/[\r\n]+/g, " ")
        .trim();
}

function parseCommitLine(line) {
    const [sha = "", date = "", ...subject] = line.split("\t");
    return { sha, date, subject: subject.join("\t") };
}

async function listFiles(relativeDirectory, predicate = () => true) {
    const absoluteDirectory = path.join(ROOT, relativeDirectory);
    const found = [];

    async function walk(currentAbsolute, currentRelative) {
        let entries;
        try {
            entries = await readdir(currentAbsolute, { withFileTypes: true });
        } catch {
            return;
        }

        entries.sort((a, b) => a.name.localeCompare(b.name, "en"));

        for (const entry of entries) {
            const absolute = path.join(currentAbsolute, entry.name);
            const relative = path.posix.join(currentRelative, entry.name);

            if (entry.isDirectory()) {
                await walk(absolute, relative);
            } else if (entry.isFile() && predicate(relative)) {
                found.push(relative);
            }
        }
    }

    await walk(absoluteDirectory, relativeDirectory);
    return found;
}

async function listTopLevelDirectories(relativeDirectory) {
    const absoluteDirectory = path.join(ROOT, relativeDirectory);
    try {
        const entries = await readdir(absoluteDirectory, { withFileTypes: true });
        return entries
            .filter((entry) => entry.isDirectory())
            .map((entry) => path.posix.join(relativeDirectory, entry.name) + "/")
            .sort((a, b) => a.localeCompare(b, "en"));
    } catch {
        return [];
    }
}

function sectionHeading(workflowPath) {
    const source = requireText(workflowPath);
    const name = source.match(/^name:\s*(.+)$/m)?.[1]?.trim();
    return name ? name.replace(/^["']|["']$/g, "") : workflowPath;
}

function requireText(filePath) {
    try {
        return execFileSync("git", ["show", `HEAD:${filePath}`], {
            cwd: ROOT,
            encoding: "utf8",
            stdio: ["ignore", "pipe", "ignore"],
        });
    } catch {
        return "";
    }
}

async function buildGeneratedSection() {
    const packageJson = JSON.parse(await readFile(path.join(ROOT, "package.json"), "utf8"));
    const targetSha = process.env.AI_CONTEXT_COMMIT_SHA || git(["rev-parse", "HEAD"]);
    const commitMeta = parseCommitLine(
        git(["show", "-s", "--format=%H%x09%ad%x09%s", "--date=iso-strict", targetSha]),
    );
    const history = git([
        "log",
        "-8",
        "--date=short",
        "--format=%h%x09%ad%x09%s",
        targetSha,
    ])
        .split("\n")
        .filter(Boolean)
        .map(parseCommitLine);

    const workflowFiles = await listFiles(".github/workflows", (file) => /\.ya?ml$/i.test(file));
    const scriptFiles = await listFiles("scripts", (file) => /\.(?:mjs|cjs|js)$/i.test(file));
    const sourceDirectories = await listTopLevelDirectories("src");
    const dependencyRows = Object.entries(packageJson.dependencies || {}).sort(([a], [b]) => a.localeCompare(b));
    const devDependencyRows = Object.entries(packageJson.devDependencies || {}).sort(([a], [b]) => a.localeCompare(b));
    const npmScripts = Object.entries(packageJson.scripts || {});

    const workflowList = [];
    for (const file of workflowFiles) {
        workflowList.push(`- \`${file}\` — ${markdownCell(sectionHeading(file))}`);
    }

    const lines = [
        "## Snapshot automatizado do repositório",
        "",
        "> Esta seção é gerada por \`scripts/update-ai-context.mjs\`. Não edite manualmente o conteúdo entre os marcadores.",
        "",
        `- **Commit de código analisado:** \`${commitMeta.sha}\``,
        `- **Data do commit analisado:** ${commitMeta.date}`,
        `- **Mensagem do commit:** ${markdownCell(commitMeta.subject)}`,
        `- **Branch de referência desta execução:** ${markdownCell(process.env.GITHUB_HEAD_REF || process.env.GITHUB_REF_NAME || "não informada")}`,
        `- **Versão declarada do projeto:** ${markdownCell(packageJson.name)}@${markdownCell(packageJson.version)}`,
        `- **Scripts npm declarados:** ${npmScripts.length}`,
        `- **Dependências de runtime:** ${dependencyRows.length}`,
        `- **Dependências de desenvolvimento:** ${devDependencyRows.length}`,
        `- **Workflows encontrados:** ${workflowFiles.length}`,
        `- **Scripts de automação encontrados:** ${scriptFiles.length}`,
        "",
        "### Scripts npm",
        "",
        "| Comando | Definição |",
        "|---|---|",
        ...npmScripts.map(([name, command]) => `| \`npm run ${markdownCell(name)}\` | \`${markdownCell(command)}\` |`),
        "",
        "### Dependências instaladas no projeto",
        "",
        "| Pacote | Versão declarada |",
        "|---|---|",
        ...dependencyRows.map(([name, version]) => `| \`${markdownCell(name)}\` | \`${markdownCell(version)}\` |`),
        "",
        "### Dependências de desenvolvimento",
        "",
        "| Pacote | Versão declarada |",
        "|---|---|",
        ...devDependencyRows.map(([name, version]) => `| \`${markdownCell(name)}\` | \`${markdownCell(version)}\` |`),
        "",
        "### Workflows do GitHub Actions",
        "",
        ...(workflowList.length ? workflowList : ["- Nenhum workflow encontrado."]),
        "",
        "### Scripts de automação",
        "",
        ...(scriptFiles.length ? scriptFiles.map((file) => `- \`${file}\``) : ["- Nenhum script encontrado."]),
        "",
        "### Diretórios principais de \`src/\`",
        "",
        ...(sourceDirectories.length ? sourceDirectories.map((directory) => `- \`${directory}\``) : ["- Nenhum diretório encontrado."]),
        "",
        "### Oito commits recentes até o commit analisado",
        "",
        "| Commit | Data | Mensagem |",
        "|---|---|---|",
        ...history.map((item) => `| \`${markdownCell(item.sha)}\` | ${markdownCell(item.date)} | ${markdownCell(item.subject)} |`),
    ];

    return lines.join("\n");
}

async function main() {
    const original = await readFile(DOC_PATH, "utf8");
    const startCount = original.split(START_MARKER).length - 1;
    const endCount = original.split(END_MARKER).length - 1;

    if (startCount !== 1 || endCount !== 1) {
        throw new Error(
            `O documento precisa conter exatamente um marcador de início e um de fim (${START_MARKER}, ${END_MARKER}).`,
        );
    }

    const start = original.indexOf(START_MARKER) + START_MARKER.length;
    const end = original.indexOf(END_MARKER);
    if (end < start) {
        throw new Error("Os marcadores da seção automatizada estão fora de ordem.");
    }

    const generated = await buildGeneratedSection();
    const expected = original.slice(0, start) + "\n\n" + generated + "\n\n" + original.slice(end);

    if (expected === original) {
        console.log("AI_CONTEXT.md já está sincronizado com o snapshot do repositório.");
        return;
    }

    if (CHECK_ONLY) {
        console.error("AI_CONTEXT.md está desatualizado. O workflow de sincronização deve atualizar o snapshot.");
        process.exitCode = 1;
        return;
    }

    await writeFile(DOC_PATH, expected, "utf8");
    console.log("Snapshot automatizado atualizado em docs/AI_CONTEXT.md.");
}

main().catch((error) => {
    console.error("Falha ao atualizar o contexto para IAs:", error);
    process.exitCode = 1;
});

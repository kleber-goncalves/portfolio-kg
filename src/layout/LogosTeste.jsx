import LogoLoop from "../components/logoLoop";

import { Html5, CssNew, Javascript, Gsap, React, TailwindCss, Nodejs, Figma, Nextdotjs, Vitejs, Typescript, Supabase, Postgresql, Sqlite, Vercel, Git, Github } from "@thesvg/react";

// ============================================================
// STACK
// ============================================================

const stackLogos = [
    {
        node: <Html5 className="h-10 w-10 fill-current text-ivory" />,
        title: "HTML5",
        href: "https://developer.mozilla.org/en-US/docs/Web/HTML",
    },

    {
        node: <CssNew className="h-10 w-10 fill-current text-ivory" />,
        title: "CSS3",
        href: "https://developer.mozilla.org/en-US/docs/Web/CSS",
    },

    {
        node: <Javascript className="h-10 w-10 fill-current text-ivory" />,
        title: "JavaScript",
        href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    },

    {
        node: <Typescript className="h-10 w-10 fill-current text-ivory" />,
        title: "TypeScript",
        href: "https://www.typescriptlang.org/",
    },

    {
        node: <React className="h-10 w-10 fill-current text-ivory" />,
        title: "React",
        href: "https://react.dev/",
    },

    {
        node: <Nextdotjs className="h-10 w-10 fill-current text-ivory" />,
        title: "Next.js",
        href: "https://nextjs.org/",
    },

    {
        node: <TailwindCss className="h-10 w-10 fill-current text-ivory" />,
        title: "Tailwind CSS",
        href: "https://tailwindcss.com/",
    },

    {
        node: <Gsap className="h-10 w-10 fill-current text-[#0AE448]" />,
        title: "GSAP",
        href: "https://gsap.com/",
    },

];

// ============================================================
// BACKEND / DATABASE
// ============================================================

const backendLogos = [
    {
        node: <Nodejs className="h-10 w-10 fill-current text-ivory" />,
        title: "Node.js",
        href: "https://nodejs.org/",
    },

    {
        node: <Supabase className="h-10 w-10 fill-current text-ivory" />,
        title: "Supabase",
        href: "https://supabase.com/",
    },

    {
        node: <Postgresql className="h-10 w-10 fill-current text-ivory" />,
        title: "PostgreSQL",
        href: "https://www.postgresql.org/",
    },

    {
        node: <Sqlite className="h-10 w-10 fill-current text-ivory" />,
        title: "SQLite",
        href: "https://www.sqlite.org/",
    },


];

// ============================================================
// FERRAMENTAS
// ============================================================

const toolsLogos = [
    {
        node: <Figma className="h-10 w-10 fill-current text-ivory" />,
        title: "Figma",
        href: "https://www.figma.com/",
    },

    {
        node: <Vitejs className="h-10 w-10 fill-current text-ivory" />,
        title: "Vite",
        href: "https://vite.dev/",
    },

    {
        node: <Git className="h-10 w-10 fill-current text-ivory" />,
        title: "Git",
        href: "https://git-scm.com/",
    },

    {
        node: <Github className="h-10 w-10 fill-current text-ivory" variant="dark" />,
        title: "GitHub",
        href: "https://github.com/",
    },

    {
        node: <Vercel className="h-10 w-10 fill-current text-ivory" />,
        title: "Vercel",
        href: "https://vercel.com/",
    },
];

// ============================================================
// COMPONENTE
// ============================================================

function Seclogs() {
    return (
        <section
            className="
                relative
                flex
                h-full
                w-full
                flex-col
                items-center
                gap-10
                overflow-hidden
                bg-obsidian
            "
        >
            {/* ==================================================
                CABEÇALHO
            ================================================== */}

            <div
                className="
                    flex
                    w-full
                    flex-row
                    items-center
                    gap-2
                    p-5

                    md:p-10
                "
            >
                <h2
                    className="
                        whitespace-nowrap
                        text-sm
                        uppercase
                        text-steel

                        md:text-7xl
                    "
                >
                    // TECNOLOGIAS & FERRAMENTAS
                </h2>

                <span
                    className="
                        h-0.5
                        flex-1
                        bg-gradientaa

                        md:h-1
                    "
                />
            </div>

            {/* ==================================================
                LOGOS
            ================================================== */}

            <div
                className="
                    relative
                    flex
                    w-full
                    flex-col
                    gap-2
                    overflow-hidden
                    bg-obsidian
                "
            >
                {/* ==================================================
                    LOOP 01 — STACK
                ================================================== */}
                <p className="text-xs pl-5 uppercase tracking-[0.2em] text-warm-bronze/70 font-medium">Front-end</p>
                <div
                    className="
                        relative
                        flex
                        h-20
                        w-full
                        items-center
                        overflow-hidden
                    "
                >
                    <LogoLoop logos={stackLogos} speed={80} direction="left" logoHeight={50} gap={45} hoverSpeed={0} scaleOnHover fadeOut fadeOutColor="#0b0b0b" ariaLabel="Stack de desenvolvimento" />
                </div>

                {/* ==================================================
                    LOOP 02 — BACKEND / DATABASE
                ================================================== */}
                <p className="text-xs pl-5 uppercase tracking-[0.2em] text-warm-bronze/70 font-medium">BACK-END / DADOS</p>
                <div
                    className="
                        relative
                        flex
                        h-20
                        w-full
                        items-center
                        overflow-hidden
                    "
                >
                    <LogoLoop logos={backendLogos} speed={70} direction="right" logoHeight={50} gap={45} hoverSpeed={0} scaleOnHover fadeOut fadeOutColor="#0b0b0b" ariaLabel="Backend e bancos de dados" />
                </div>

                {/* ==================================================
                    LOOP 03 — FERRAMENTAS
                ================================================== */}
                <p className="text-xs pl-5 uppercase tracking-[0.2em] text-warm-bronze/50">FERRAMENTAS</p>
                <div
                    className="
                        relative
                        flex
                        h-20
                        w-full
                        items-center
                        overflow-hidden
                    "
                >
                    <LogoLoop logos={toolsLogos} speed={85} direction="left" logoHeight={50} gap={45} hoverSpeed={0} scaleOnHover fadeOut fadeOutColor="#0b0b0b" ariaLabel="Ferramentas de desenvolvimento" />
                </div>
            </div>
        </section>
    );
}

export default Seclogs;

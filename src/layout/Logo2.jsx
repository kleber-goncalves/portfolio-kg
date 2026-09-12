import LogoLoop from "../components/logoLoop";
import FlowingMenu from "../components/FlowingMenu";

import { Html5, CssNew, Javascript, Gsap, React, TailwindCss, Nodejs, Figma, Nextdotjs, Vitejs, Typescript, Supabase, Postgresql, Sqlite, Vercel, Git, Github } from "@thesvg/react";

// ============================================================
// STACK — FRONT-END
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
// BACK-END / DADOS
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
// FLOWING MENU — DESKTOP
// ============================================================

const flowingItems = [
    {
        text: "Front-end",
        logos: stackLogos,
    },

    {
        text: "Back-end / Dados",
        logos: backendLogos,
    },

    {
        text: "Ferramentas",
        logos: toolsLogos,
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
                w-full
                flex-col
                overflow-hidden
                bg-obsidian
                md:mt-34
                mb-14
                md:shadow-t-2xl
                md:shadow-black
            "
            ref={(el) => {
                if (!el) return;

                const rect = el.getBoundingClientRect();

                console.log("====================================");
                console.log("📦 SECLOGS");
                console.log("====================================");
                console.log("height:", rect.height);
                console.log("top:", rect.top);
                console.log("bottom:", rect.bottom);

                const styles = window.getComputedStyle(el);

                console.log("position:", styles.position);
                console.log("z-index:", styles.zIndex);
                console.log("margin-top:", styles.marginTop);
                console.log("background:", styles.backgroundColor);
            }}
        >
            {/* ==================================================
                CABEÇALHO
            ================================================== */}

            <div
                className="
                    
                    flex
                    w-full
                    flex-col
                    items-start
                    gap-2
                    p-5

                    md:mb-3
                    md:pl-26
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

                {/* DESKTOP */}

                <p
                    className="
                        hidden
                        max-w-md
                        text-steel

                        md:block
                        md:text-sm
                        md:leading-6
                        md:pl-34
                    "
                >
                    Ferramenta não é diferencial. E sim decisão técnica.
                </p>
            </div>

            {/* ==================================================
                INTRODUÇÃO — MOBILE
            ================================================== */}

            <div
                className="
                    mb-16
                    flex
                    max-w-3xl
                    flex-col
                    gap-4
                    p-5

                    md:hidden
                "
            >
                <p
                    className="
                        text-base
                        leading-6
                        text-steel
                    "
                >
                    Ferramenta não é diferencial. Decisão técnica é.
                </p>
            </div>

            {/* ==================================================
                LOGOS
            ================================================== */}

            <div
                className="
                    relative
                    w-full
                    overflow-hidden
                "
            >
                {/* =================================================
                    MOBILE
                    MANTIDO COMO ESTAVA
                ================================================== */}

                <div className="flex flex-col gap-8 md:hidden">
                    {/* FRONT-END */}

                    <div className="flex flex-col gap-2">
                        <p
                            className="
                                pl-5
                                text-xs
                                font-medium
                                uppercase
                                tracking-[0.2em]
                                text-warm-bronze/70
                            "
                        >
                            Front-end
                        </p>

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
                    </div>

                    {/* BACK-END */}

                    <div className="flex flex-col gap-2">
                        <p
                            className="
                                pl-5
                                text-xs
                                font-medium
                                uppercase
                                tracking-[0.2em]
                                text-warm-bronze/70
                            "
                        >
                            Back-end / Dados
                        </p>

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
                    </div>

                    {/* FERRAMENTAS */}

                    <div className="flex flex-col gap-2">
                        <p
                            className="
                                pl-5
                                text-xs
                                uppercase
                                tracking-[0.2em]
                                text-warm-bronze/70
                            "
                        >
                            Ferramentas
                        </p>

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
                </div>

                {/* =================================================
                    DESKTOP
                ================================================== */}

                <div
                    className="
                        hidden
                        h-[360px]
                        w-full

                        md:block
                    "
                >
                    <FlowingMenu items={flowingItems} speed={20} textColor="#F2F0EC" bgColor="#0d0d0d" marqueeBgColor="#d8c2aa" marqueeTextColor="#0D0D0D" borderColor="#242424" />
                </div>
            </div>
        </section>
    );
}

export default Seclogs;

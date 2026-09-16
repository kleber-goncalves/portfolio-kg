import { useLayoutEffect, useRef } from "react";

import LogoLoop from "../components/logoLoop";
import FlowingMenu from "../components/FlowingMenu";

import { Html5, CssNew, Javascript, Gsap, React, TailwindCss, Nodejs, Figma, Nextdotjs, Vitejs, Typescript, Supabase, Postgresql, Sqlite, Vercel, Git, Github, Motion, Prisma } from "@thesvg/react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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
    {
        node: <Motion variant="light" className="h-10 w-10 fill-current text-[#ffffff]" />,
        title: "Motion",
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
        node: <Prisma variant="light" className="h-10 w-10 fill-current text-ivory" />,
        title: "Prisma",
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
        node: <Github className="h-10 w-10 fill-current text-black" variant="mono" />,
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
    const sectionRef = useRef(null);

    // ========================================================
    // DESKTOP — CABEÇALHO
    // ========================================================

    const desktopTitleRef = useRef(null);
    const desktopLineRef = useRef(null);
    const desktopDescriptionRef = useRef(null);

    // ========================================================
    // MOBILE — CABEÇALHO
    // ========================================================

    const mobileTitleRef = useRef(null);
    const mobileLineRef = useRef(null);
    const mobileIntroRef = useRef(null);

    // ========================================================
    // MOBILE — CADA LOOP INDIVIDUAL
    // ========================================================

    const frontEndRef = useRef(null);
    const backendRef = useRef(null);
    const toolsRef = useRef(null);

    // ========================================================
    // ANIMAÇÕES
    // ========================================================

    useLayoutEffect(() => {
        const section = sectionRef.current;

        if (!section) return;

        const ctx = gsap.context(() => {
            // =================================================
            // DESKTOP — SOMENTE CABEÇALHO
            // =================================================

            const desktopElements = [desktopTitleRef.current, desktopLineRef.current, desktopDescriptionRef.current].filter(Boolean);

            gsap.set(desktopElements, {
                opacity: 0,
                y: 50,
            });

            const desktopTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                    end: "top 45%",
                    scrub: 1,
                    markers: false,
                },
            });

            desktopTimeline
                .to(
                    desktopTitleRef.current,
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.7,
                        ease: "power3.out",
                    },
                    0,
                )

                .to(
                    desktopLineRef.current,
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        ease: "power3.out",
                    },
                    0.15,
                )

                .to(
                    desktopDescriptionRef.current,
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.7,
                        ease: "power3.out",
                    },
                    0.3,
                );

            // =================================================
            // MOBILE — CABEÇALHO
            // =================================================

            gsap.set([mobileTitleRef.current, mobileLineRef.current, mobileIntroRef.current], {
                opacity: 0,
                y: 45,
            });

            const mobileHeaderTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: "top 85%",
                    end: "top 60%",
                    scrub: 1,
                    markers: false,
                },
            });

            mobileHeaderTimeline
                .to(
                    mobileTitleRef.current,
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        ease: "power3.out",
                    },
                    0,
                )

                .to(
                    mobileLineRef.current,
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.5,
                        ease: "power3.out",
                    },
                    0.1,
                )

                .to(
                    mobileIntroRef.current,
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        ease: "power3.out",
                    },
                    0.2,
                );

            // =================================================
            // MOBILE — FRONT-END
            // =================================================

            gsap.set(frontEndRef.current, {
                opacity: 0,
                y: 50,
            });

            gsap.to(frontEndRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "none",

                scrollTrigger: {
                    trigger: frontEndRef.current,
                    start: "top 85%",
                    end: "top 55%",
                    scrub: 1,
                    markers: false,
                },
            });

            // =================================================
            // MOBILE — BACK-END / DADOS
            // =================================================

            gsap.set(backendRef.current, {
                opacity: 0,
                y: 50,
            });

            gsap.to(backendRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "none",

                scrollTrigger: {
                    trigger: backendRef.current,
                    start: "top 85%",
                    end: "top 55%",
                    scrub: 1,
                    markers: false,
                },
            });

            // =================================================
            // MOBILE — FERRAMENTAS
            // =================================================

            gsap.set(toolsRef.current, {
                opacity: 0,
                y: 50,
            });

            gsap.to(toolsRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "none",

                scrollTrigger: {
                    trigger: toolsRef.current,
                    start: "top 85%",
                    end: "top 55%",
                    scrub: 1,
                    markers: false,
                },
            });
        }, section);

        return () => ctx.revert();
    }, []);

    return (
        <section
            id="stack"
            ref={sectionRef}
            className="
                relative
                mb-14
                flex
                w-full
                flex-col
                overflow-hidden
                bg-obsidian

                md:mt-34
                mt-30
                md:shadow-t-2xl
                md:shadow-black
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
                    md:flex-col
                    md:items-start
                    gap-2
                    md:p-5
                    px-5
                    md:mb-3
                    md:pl-26
                "
            >
                {/* DESKTOP */}

                <h2
                    ref={desktopTitleRef}
                    className="
                        hidden
                        whitespace-nowrap
                        text-steel

                        md:block
                        md:text-7xl
                    "
                >
                    // TECNOLOGIAS & FERRAMENTAS
                </h2>

                {/* MOBILE */}

                <h2
                    ref={mobileTitleRef}
                    className="
                        whitespace-nowrap
                        text-sm
                        uppercase
                        text-steel

                        md:hidden
                    "
                >
                    // TECNOLOGIAS & FERRAMENTAS
                </h2>

                {/* LINHA — DESKTOP */}

                <span
                    ref={desktopLineRef}
                    className="
                        hidden
                        h-1
                        flex-1
                        bg-gradientaa

                        md:block
                    "
                />

                {/* LINHA — MOBILE */}

                <span
                    ref={mobileLineRef}
                    className="
                        h-0.5
                        w-full
                        bg-gradientaa

                        md:hidden
                    "
                />

                {/* DESCRIÇÃO — DESKTOP */}

                <p
                    ref={desktopDescriptionRef}
                    className="
                        hidden
                        max-w-md
                        text-steel

                        md:block
                        md:pl-34
                        md:text-sm
                        md:leading-6
                    "
                >
                    Ferramenta não é diferencial. Decisão técnica é.
                </p>
            </div>

            {/* ==================================================
                INTRODUÇÃO — MOBILE
            ================================================== */}

            <div
                ref={mobileIntroRef}
                className="
                    mb-5
                    flex
                    max-w-3xl
                    flex-col
                    gap-4
                    px-5
                    py-12
                    border-b-2
                    border-graphite
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
                ================================================= */}

                <div className="flex flex-col gap-8 md:hidden">
                    {/* =================================================
                        FRONT-END
                    ================================================= */}

                    <div ref={frontEndRef} className="flex flex-col gap-2">
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

                    {/* =================================================
                        BACK-END / DADOS
                    ================================================= */}

                    <div ref={backendRef} className="flex flex-col gap-2">
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

                    {/* =================================================
                        FERRAMENTAS
                    ================================================= */}

                    <div ref={toolsRef} className="flex flex-col gap-2">
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
                ================================================= */}

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

import { useLayoutEffect, useRef } from "react";

import LogoLoop from "../components/logoLoop";
import FlowingMenu from "../components/FlowingMenu";

import { stackLogos, backendLogos, toolsLogos } from "../data/seclogsMobile.data.jsx";
import { flowingItems } from "../data/seclogsDesktop.data.jsx";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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

                b-md:mt-34
                mt-30
                b-md:shadow-t-2xl
                b-md:shadow-black
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
                    b-md:flex-col
                    b-md:items-start
                    gap-2
                    b-md:p-5
                    px-5
                    b-md:mb-3
                    b-md:pl-26
                "
            >
                {/* DESKTOP */}

                <h2
                    ref={desktopTitleRef}
                    className="
                        hidden
                        whitespace-nowrap
                        text-steel

                        b-md:block
                        b-md:text-7xl
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

                        b-md:hidden
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

                        b-md:block
                    "
                />

                {/* LINHA — MOBILE */}

                <span
                    ref={mobileLineRef}
                    className="
                        h-0.5
                        w-full
                        bg-gradientaa

                        b-md:hidden
                    "
                />

                {/* DESCRIÇÃO — DESKTOP */}

                <p
                    ref={desktopDescriptionRef}
                    className="
                        hidden
                        max-w-md
                        text-steel

                        b-md:block
                        b-md:pl-34
                        b-md:text-sm
                        b-md:leading-6
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
                    b-md:hidden
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

                <div className="flex flex-col gap-8 b-md:hidden">
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

                        b-md:block
                    "
                >
                    <FlowingMenu items={flowingItems} speed={20} textColor="#F2F0EC" bgColor="#0d0d0d" marqueeBgColor="#d8c2aa" marqueeTextColor="#0D0D0D" borderColor="#242424" />
                </div>
            </div>
        </section>
    );
}

export default Seclogs;

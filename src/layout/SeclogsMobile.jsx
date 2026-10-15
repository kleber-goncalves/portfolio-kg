import { useEffect, useLayoutEffect, useRef } from "react";

import LogoLoop from "../components/logoLoop";
import { stackLogos, backendLogos, toolsLogos } from "../data/seclogsMobile.data.jsx";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// TESTE TEMPORÁRIO DE DESEMPENHO: mantém o LogoLoop ativo e desliga apenas
// as animações de entrada do GSAP nesta seção mobile.
const RUN_MOBILE_GSAP_SCROLL_ANIMATIONS = false;

function SeclogsMobile({ sectionRef, onReady }) {
    const mobileTitleRef = useRef(null);
    const mobileLineRef = useRef(null);
    const mobileIntroRef = useRef(null);

    const frontEndRef = useRef(null);
    const backendRef = useRef(null);
    const toolsRef = useRef(null);

    useLayoutEffect(() => {
        if (!RUN_MOBILE_GSAP_SCROLL_ANIMATIONS) return undefined;

        const section = sectionRef.current;

        if (!section) return;

        const ctx = gsap.context(() => {
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
                y: 0,
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
                y: 0,
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
                y: 0,
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
    }, [sectionRef]);

    useEffect(() => {
        onReady?.("mobile");
    }, [onReady]);

    return (
        <>
            <div
                className="
                    flex
                    w-full
                    flex-row
                    items-center
                    gap-2
                    px-5
                "
            >
                <h2
                    ref={mobileTitleRef}
                    className="
                        whitespace-nowrap
                        text-sm
                        uppercase
                        text-steel
                    "
                >
                    // TECNOLOGIAS & FERRAMENTAS
                </h2>

                <span
                    ref={mobileLineRef}
                    className="
                        h-0.5
                        w-full
                        bg-gradientaa
                    "
                />
            </div>

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

            <div
                className="
                    relative
                    w-full
                    overflow-hidden
                "
            >
                <div className="flex flex-col gap-8">
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
            </div>
        </>
    );
}

export default SeclogsMobile;

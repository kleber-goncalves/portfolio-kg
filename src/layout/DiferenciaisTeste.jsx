import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Card2 from "../components/card2";

gsap.registerPlugin(ScrollTrigger);

function Diferenciais() {
    const sectionRef = useRef(null);

    const titleRef = useRef(null);
    const lineRef = useRef(null);
    const introDeskRef = useRef(null);
    const introMobRef = useRef(null);
    const footerRef = useRef(null);

    const diferenciais = [
        {
            numero: "01",
            titulo: "Foco em Design de Software",
            texto: "Não escrevo código antes de pensar no sistema. Tomo decisões considerando arquitetura, manutenção, escalabilidade e o impacto que cada escolha pode gerar.",
        },

        {
            numero: "02",
            titulo: "Visão de Sistema",
            texto: "Procuro entender como frontend, backend, banco de dados, APIs e experiência do usuário se conectam para formar uma solução coerente.",
        },

        {
            numero: "03",
            titulo: "Aprendizado Contínuo",
            texto: "Tenho uma postura de evolução constante. Busco compreender os fundamentos por trás das ferramentas, em vez de apenas reproduzir soluções prontas.",
        },

        {
            numero: "04",
            titulo: "Pensamento Orientado a Soluções",
            texto: "Meu objetivo não é apenas fazer algo funcionar. Procuro entender o problema, avaliar alternativas e construir soluções simples, sustentáveis e úteis.",
        },
    ];

    // ============================================================
    // ANIMAÇÕES
    // ============================================================

    useLayoutEffect(() => {
        const section = sectionRef.current;

        if (!section) return;

        const ctx = gsap.context(() => {
            // ====================================================
            // CABEÇALHO
            // ====================================================

            const title = titleRef.current;
            const line = lineRef.current;
            const introDesk = introDeskRef.current;
            const introMob = introMobRef.current;
            

            gsap.set(title, {
                opacity: 0,
                x: -35,
            });

            gsap.set(line, {
                scaleX: 0,
                transformOrigin: "left center",
            });

            gsap.set(introDesk, {
                opacity: 0,
            });
            gsap.set(introMob, {
                opacity: 0,
                
            });

            const headerTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: title,
                    start: "top 90%",
                    end: "top 65%",
                    scrub: 1,
                    markers: false,
                },
            });

            // TÍTULO
            headerTimeline.to(title, {
                opacity: 1,
                x: 0,
                duration: 1,
                ease: "none",
            });

            // LINHA
            headerTimeline.to(
                line,
                {
                    scaleX: 1,
                    duration: 1,
                    ease: "none",
                },
                "<",
            );

            // TEXTO
            headerTimeline.to(
                introDesk,
                {
                    opacity: 1,
                   
                    duration: 1.8,
                    ease: "none",
                },
                
            );
            headerTimeline.to(
                introMob,
                {
                    opacity: 1,
                    duration: 0.8,
                    ease: "none",
                },
                "<-=0.35",
            );

            // ====================================================
            // CARDS
            // ====================================================

            const cards = section.querySelectorAll("[data-diferencial-card]");

            cards.forEach((card) => {
                gsap.set(card, {
                    opacity: 0,
                    y: 75,
                });

                const cardTimeline = gsap.timeline({
                    scrollTrigger: {
                        trigger: card,
                        start: "top 95%",
                        end: "top 55%",
                        scrub: 1,
                        markers: false,
                    },
                });

                cardTimeline.to(card, {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "none",
                });
            });

            /*
            ============================================================
            FOOTER
            ============================================================
            */

            const footer = footerRef.current;

            gsap.set(footer, {
                opacity: 0,
                y: 25,
            });

            const footerTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: footer,
                    start: "top 90%",
                    toggleActions: "play none none reverse",
                },
            });

            footerTimeline.to(footer, {
                opacity: 1,
                y: 0,
                duration: 0.55,
                ease: "power3.out",
            });
        }, section);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            id="diferenciais"
            className="
                relative
                w-full
                overflow-hidden
                bg-obsidian
                px-5
                mt-30
                py-20
                md:px-10
                md:py-28
                lg:py-32
                md:mt-30
            "
        >
            {/* =====================================================
                CONTAINER
            ===================================================== */}

            <div
                className="
                    mx-auto
                    flex
                    w-full
                    max-w-[1500px]
                    flex-col
                "
            >
                {/* =================================================
                    CABEÇALHO
                ================================================= */}

                <div
                    className="
                        mb-14
                        flex
                        w-full
                        flex-row
                        items-center
                        gap-2
                        md:mb-20
                    "
                >
                    <h2
                        ref={titleRef}
                        className="
                            whitespace-nowrap
                            text-sm
                            uppercase
                            tracking-wide
                            text-steel
                            md:text-7xl
                        "
                    >
                        // DIFERENCIAIS
                    </h2>

                    <span
                        ref={lineRef}
                        className="
                            h-0.5
                            flex-1
                            bg-gradientaa
                            md:h-1
                        "
                    />

                    {/* DESKTOP */}

                    <p
                        ref={introDeskRef}
                        className="
                            hidden
                            max-w-md
                            text-steel
                            md:block
                            md:text-sm
                            md:leading-6
                        "
                    >
                        Mais do que ferramentas, eu valorizo a forma como os problemas são analisados e transformados em soluções.
                    </p>
                </div>

                {/* =================================================
                    INTRODUÇÃO — MOBILE
                ================================================= */}

                <div
                    ref={introMobRef}
                    className="
                        mb-16
                        flex
                        max-w-3xl
                        flex-col
                        gap-4
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
                        Mais do que ferramentas, eu valorizo a forma como os problemas são analisados e transformados em soluções.
                    </p>
                </div>

                {/* =================================================
                    DIFERENCIAIS
                ================================================= */}

                <div
                    className="
                        grid
                        w-full
                        grid-cols-1
                        md:grid-cols-2
                        md:grid-rows-4
                    "
                >
                    {/* =================================================
                        CARD 01
                    ================================================= */}

                    <div
                        data-diferencial-card
                        className="
                            w-full
                            md:col-start-1
                            md:row-start-1
                            md:max-w-[90%]
                        "
                    >
                        <Card2 number={diferenciais[0].numero} title={diferenciais[0].titulo} text={diferenciais[0].texto} variant="default" className="w-full" />
                    </div>

                    {/* =================================================
                        CARD 02
                    ================================================= */}

                    <div
                        data-diferencial-card
                        className="
                            w-full
                            md:col-start-2
                            md:row-start-2
                            md:ml-auto
                            md:max-w-[90%]
                        "
                    >
                        <Card2 number={diferenciais[1].numero} title={diferenciais[1].titulo} text={diferenciais[1].texto} variant="default" className="w-full" />
                    </div>

                    {/* =================================================
                        CARD 03
                    ================================================= */}

                    <div
                        data-diferencial-card
                        className="
                            w-full
                            md:col-start-1
                            md:row-start-3
                            md:max-w-[90%]
                        "
                    >
                        <Card2 number={diferenciais[2].numero} title={diferenciais[2].titulo} text={diferenciais[2].texto} variant="default" className="w-full" />
                    </div>

                    {/* =================================================
                        CARD 04
                    ================================================= */}

                    <div
                        data-diferencial-card
                        className="
                            w-full
                            md:col-start-2
                            md:row-start-4
                            md:ml-auto
                            md:max-w-[90%]
                        "
                    >
                        <Card2 number={diferenciais[3].numero} title={diferenciais[3].titulo} text={diferenciais[3].texto} variant="default" className="w-full" />
                    </div>
                </div>

                {/* =================================================
                    RODAPÉ
                ================================================= */}

                <div
                    ref={footerRef}
                    className="
                        mt-12
                        flex
                        w-full
                        justify-end
                        md:mt-16
                    "
                >
                    <span
                        className="
                            text-[10px]
                            uppercase
                            tracking-[0.3em]
                            text-steel/60
                        "
                    >
                        Forma de pensar · Forma de construir
                    </span>
                </div>
            </div>
        </section>
    );
}

export default Diferenciais;

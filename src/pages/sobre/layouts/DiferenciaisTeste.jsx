import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Card2 from "../components/card2";

gsap.registerPlugin(ScrollTrigger);

function Diferenciais({ experienceMode = "full" }) {
    const sectionRef = useRef(null);

    const titleRef = useRef(null);
    const lineRef = useRef(null);
    const introDeskRef = useRef(null);
    const introMobRef = useRef(null);
    const footerRef = useRef(null);

    const diferenciais = [
        {
            numero: "01",
            titulo: "Performance orientada por medições",
            texto: "Não avalio a velocidade de uma página apenas pela aparência. Uso ferramentas como Lighthouse e análises de JavaScript para encontrar oportunidades de melhoria e verificar o impacto das mudanças.",
        },

        {
            numero: "02",
            titulo: "Qualidade verificada automaticamente",
            texto: "Configuro GitHub Actions para executar builds, auditorias de SEO e acessibilidade, análises de JavaScript e testes de comportamento. Assim, as mudanças passam por verificações repetíveis durante o desenvolvimento.",
        },

        {
            numero: "03",
            titulo: "Experiência adaptada a diferentes usuários",
            texto: "Considero o uso em celulares e computadores, a navegação por teclado e a preferência por movimento reduzido, buscando manter a interface acessível sem abrir mão da identidade visual.",
        },

        {
            numero: "04",
            titulo: "Visão da aplicação além da interface",
            texto: "Meu foco principal é o desenvolvimento web, especialmente Front-end, mas também exploro APIs, armazenamento de dados e validação para entender como as partes da aplicação se conectam.",
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

            // ====================================================
            // TÍTULO
            // ====================================================

            headerTimeline.to(title, {
                opacity: 1,
                x: 0,
                duration: 1,
                ease: "none",
            });

            // ====================================================
            // LINHA
            // ====================================================

            headerTimeline.to(
                line,
                {
                    scaleX: 1,
                    duration: 1,
                    ease: "none",
                },
                "<",
            );

            // ====================================================
            // TEXTO DESKTOP
            // ====================================================

            headerTimeline.to(introDesk, {
                opacity: 1,
                duration: 1.8,
                ease: "none",
            });

            // ====================================================
            // TEXTO MOBILE
            // ====================================================

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

            // ====================================================
            // FOOTER
            // ====================================================

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
            className="
                relative
                w-full
                overflow-hidden
                bg-obsidian
                px-5
                mt-10
                py-20
                b-md:px-10
                b-md:py-28
                c-lg:py-32
                b-md:mt-30
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
                        b-md:mb-20
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
                            b-md:text-7xl
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
                            b-md:h-1
                        "
                    />

                    {/* =================================================
                        DESKTOP
                    ================================================= */}

                    <p
                        ref={introDeskRef}
                        className="
                            hidden
                            max-w-md
                            text-steel
                            b-md:block
                            b-md:text-sm
                            b-md:leading-6
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
                        b-md:grid-cols-2
                        b-md:grid-rows-4
                    "
                >
                    {/* =================================================
                        CARD 01
                    ================================================= */}

                    <div
                        data-diferencial-card
                        className="
                            w-full
                            b-md:col-start-1
                            b-md:row-start-1
                            b-md:max-w-[90%]
                        "
                    >
                        <Card2 number={diferenciais[0].numero} title={diferenciais[0].titulo} text={diferenciais[0].texto} variant="default" experienceMode={experienceMode} className="w-full" />
                    </div>

                    {/* =================================================
                        CARD 02
                    ================================================= */}

                    <div
                        data-diferencial-card
                        className="
                            w-full
                            b-md:col-start-2
                            b-md:row-start-2
                            b-md:ml-auto
                            b-md:max-w-[90%]
                        "
                    >
                        <Card2 number={diferenciais[1].numero} title={diferenciais[1].titulo} text={diferenciais[1].texto} variant="default" experienceMode={experienceMode} className="w-full" />
                    </div>

                    {/* =================================================
                        CARD 03
                    ================================================= */}

                    <div
                        data-diferencial-card
                        className="
                            w-full
                            b-md:col-start-1
                            b-md:row-start-3
                            b-md:max-w-[90%]
                        "
                    >
                        <Card2 number={diferenciais[2].numero} title={diferenciais[2].titulo} text={diferenciais[2].texto} variant="default" experienceMode={experienceMode} className="w-full" />
                    </div>

                    {/* =================================================
                        CARD 04
                    ================================================= */}

                    <div
                        data-diferencial-card
                        className="
                            w-full
                            b-md:col-start-2
                            b-md:row-start-4
                            b-md:ml-auto
                            b-md:max-w-[90%]
                        "
                    >
                        <Card2 number={diferenciais[3].numero} title={diferenciais[3].titulo} text={diferenciais[3].texto} variant="default" experienceMode={experienceMode} className="w-full" />
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
                        b-md:mt-16
                    "
                >
                    <span
                        className="
                            text-[10px]
                            uppercase
                            tracking-[0.3em]
                            text-steel
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

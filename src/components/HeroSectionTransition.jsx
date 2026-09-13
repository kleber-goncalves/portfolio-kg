import { useLayoutEffect, useRef, useState } from "react";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Hero from "../layout/HeroTeste2";
import Seclogs from "../layout/Logo2";
import MenuDesktop from "../components/MenuDesktop";

gsap.registerPlugin(ScrollTrigger);

function HeroSectionTransition() {
    const sectionRef = useRef(null);
    const heroRef = useRef(null);
    const seclogsRef = useRef(null);

    // =========================================
    // CONTROLES
    // =========================================

    // Quantos pixels o Seclogs precisa subir
    // para o hambúrguer aparecer.
    const MENU_APPEAR_PX = 800;

    // Quantos pixels o Seclogs precisa cobrir
    // para o DotField congelar.
    const DOTFIELD_FREEZE_PX = 300;

    // =========================================
    // ESTADOS
    // =========================================

    const [showDesktopMenu, setShowDesktopMenu] = useState(false);

    const [dotFieldFrozen, setDotFieldFrozen] = useState(false);

    // Refs para evitar setState a cada frame
    const menuVisibleRef = useRef(false);

    const dotFieldFrozenRef = useRef(false);

    // =========================================
    // ITENS DO MENU
    // =========================================

    const menuItems = [
        {
            label: "Home",
            href: "#hero",
        },
        {
            label: "Stack",
            href: "#stack",
        },
        {
            label: "Competências",
            href: "#competencias",
        },
        {
            label: "Projetos",
            href: "#projetos",
        },
        {
            label: "Formação",
            href: "#formacao",
        },
        {
            label: "Trajetória",
            href: "#trajetoria",
        },
    ];

    // =========================================
    // GSAP
    // =========================================

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const section = sectionRef.current;
            const hero = heroRef.current;
            const seclogs = seclogsRef.current;

            if (!section || !hero || !seclogs) {
                return;
            }

            const mm = gsap.matchMedia();

            mm.add("(min-width: 768px)", () => {
                const heroTitle = hero.querySelector('[data-hero-element="title"]');

                const heroText = hero.querySelector('[data-hero-element="text"]');

                const heroVisual = hero.querySelector('[data-hero-element="visual"]');

                const heroDotField = hero.querySelector('[data-hero-element="dotfield"]');

                const heroArrow = hero.querySelector('[data-hero-element="arrow"]');

                const globalBlur = document.querySelector(".global-gradual-blur");

                // =========================================
                // ESTADO INICIAL
                // =========================================

                gsap.set(seclogs, {
                    yPercent: 100,
                });

                gsap.set(hero, {
                    opacity: 1,
                });

                if (heroArrow) {
                    gsap.set(heroArrow, {
                        rotation: 0,
                        transformOrigin: "center center",
                    });
                }

                if (globalBlur) {
                    gsap.set(globalBlur, {
                        opacity: 0,
                    });
                }

                // =========================================
                // TIMELINE
                // =========================================

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: section,

                        start: "top top",

                        end: "+=1800",

                        scrub: true,

                        pin: true,

                        anticipatePin: 1,

                        invalidateOnRefresh: true,

                        markers: false,

                        // =================================
                        // CONTROLE POR PIXELS
                        // =================================

                        onUpdate: () => {
                            if (!hero || !seclogs) {
                                return;
                            }

                            // ---------------------------------
                            // POSIÇÃO DO HERO
                            // ---------------------------------

                            const heroRect = hero.getBoundingClientRect();

                            // ---------------------------------
                            // POSIÇÃO DO SECLOGS
                            // ---------------------------------

                            const seclogsRect = seclogs.getBoundingClientRect();

                            /*
                             * Quando o Seclogs começa,
                             * ele está abaixo do Hero.
                             *
                             * Conforme sobe:
                             *
                             * Seclogs.top
                             * vai diminuindo.
                             *
                             * Hero.bottom
                             * representa o final do Hero.
                             *
                             * A diferença entre eles
                             * representa quanto o Seclogs
                             * já entrou sobre o Hero.
                             */

                            const coveredAmount = Math.max(0, heroRect.bottom - seclogsRect.top);

                            // =================================
                            // DEBUG
                            // =================================

                            // console.log(
                            //     "📏 Cobertura:",
                            //     Math.round(
                            //         coveredAmount
                            //     ),
                            //     "px"
                            // );

                            // =================================
                            // MENU
                            // =================================

                            const shouldShowMenu = coveredAmount >= MENU_APPEAR_PX;

                            if (menuVisibleRef.current !== shouldShowMenu) {
                                menuVisibleRef.current = shouldShowMenu;

                                setShowDesktopMenu(shouldShowMenu);

                                console.log(shouldShowMenu ? "☰ MENU APARECEU" : "☰ MENU ESCONDEU", {
                                    covered: Math.round(coveredAmount),
                                    limite: MENU_APPEAR_PX,
                                });
                            }

                            // =================================
                            // DOT FIELD
                            // =================================

                            const shouldFreezeDotField = coveredAmount >= DOTFIELD_FREEZE_PX;

                            if (dotFieldFrozenRef.current !== shouldFreezeDotField) {
                                dotFieldFrozenRef.current = shouldFreezeDotField;

                                setDotFieldFrozen(shouldFreezeDotField);

                                console.log(shouldFreezeDotField ? "❄️ DOTFIELD CONGELADO" : "🖱️ DOTFIELD DESCONGELADO", {
                                    covered: Math.round(coveredAmount),
                                    limite: DOTFIELD_FREEZE_PX,
                                });
                            }
                        },
                    },
                });

                // =========================================
                // SECTION 2
                // =========================================

                tl.to(
                    seclogs,
                    {
                        yPercent: 0,
                        ease: "none",
                        duration: 1,
                    },
                    0,
                );

                // =========================================
                // HERO
                // =========================================

                tl.to(
                    hero,
                    {
                        opacity: 0.55,
                        ease: "none",
                        duration: 1,
                    },
                    0,
                );

                // =========================================
                // DOT FIELD
                // =========================================

                if (heroDotField) {
                    gsap.set(heroDotField, {
                        opacity: 1,
                    });
                }

                // =========================================
                // FOTO
                // =========================================

                if (heroVisual) {
                    tl.to(
                        heroVisual,
                        {
                            scale: 0.88,
                            ease: "none",
                            duration: 1,
                        },
                        0,
                    );
                }

                // =========================================
                // TÍTULO
                // =========================================

                if (heroTitle) {
                    tl.to(
                        heroTitle,
                        {
                            scale: 0.84,
                            ease: "none",
                            duration: 1,
                        },
                        0,
                    );
                }

                // =========================================
                // TEXTO
                // =========================================

                if (heroText) {
                    tl.to(
                        heroText,
                        {
                            scale: 0.9,
                            ease: "none",
                            duration: 1,
                        },
                        0,
                    );
                }

                // =========================================
                // SETA
                // =========================================

                if (heroArrow) {
                    tl.to(
                        heroArrow,
                        {
                            rotation: 45,
                            ease: "none",
                            duration: 1,
                        },
                        0,
                    );
                }

                // =========================================
                // BLUR
                // =========================================

                if (globalBlur) {
                    tl.to(
                        globalBlur,
                        {
                            opacity: 1,
                            ease: "none",
                            duration: 0.25,
                        },
                        1,
                    );
                }

                // =========================================
                // HOLD
                // =========================================

                tl.to(
                    {},
                    {
                        duration: 0.9,
                    },
                );

                // =========================================
                // CLEANUP
                // =========================================

                return () => {
                    tl.kill();
                };
            });
        }, sectionRef);

        return () => {
            ctx.revert();
        };
    }, []);

    // =========================================
    // RENDER
    // =========================================

    return (
        <section
            ref={sectionRef}
            className="
                relative
                w-full
                h-auto

                md:h-screen
                md:overflow-hidden
            "
        >
            {/* =====================================
                HERO
            ====================================== */}

            <div
                ref={heroRef}
                className="
                    relative
                    z-0
                    w-full

                    md:absolute
                    md:inset-0
                    md:h-full
                "
            >
                <Hero dotFieldFrozen={dotFieldFrozen} />
            </div>

            {/* =====================================
                SECTION 2
            ====================================== */}

            <div
                ref={seclogsRef}
                className="
                    relative
                    z-20
                    w-full

                    bg-obsidian

                    md:absolute
                    md:inset-0
                    md:h-auto

                    md:shadow-[0_-25px_60px_rgba(0,0,0,0.55)]
                "
            >
                <Seclogs />
            </div>

            {/* =====================================
                MENU DESKTOP
            ====================================== */}

            <MenuDesktop items={menuItems} showMenu={showDesktopMenu} />
        </section>
    );
}

export default HeroSectionTransition;

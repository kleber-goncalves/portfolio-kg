import { useLayoutEffect, useRef, useState } from "react";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Hero from "../layout/HeroTeste2";
import Seclogs from "../layout/Logo2";
import MenuDesktop from "../components/MenuDesktop";

import { getExperienceMode } from "../utils/experienceMode";

gsap.registerPlugin(ScrollTrigger);

function HeroSectionTransition() {
    const sectionRef = useRef(null);
    const heroRef = useRef(null);
    const seclogsRef = useRef(null);

    // ============================================================
    // CONFIGURAÇÕES
    // ============================================================

    const MENU_APPEAR_PX = 800;
    const DOTFIELD_FREEZE_PX = 300;

    // ============================================================
    // ESTADOS
    // ============================================================

    const [experienceMode] = useState(() => getExperienceMode() || "full");

    /*
     * No modo FULL:
     * o menu começa escondido e aparece durante a transição.
     *
     * No modo REDUCED:
     * o menu fica disponível desde o início.
     */
    const [showDesktopMenu, setShowDesktopMenu] = useState(() => experienceMode === "reduced");

    const [dotFieldFrozen, setDotFieldFrozen] = useState(false);

    // ============================================================
    // REFS DE CONTROLE
    // ============================================================

    const menuVisibleRef = useRef(experienceMode === "reduced");

    const dotFieldFrozenRef = useRef(false);

    // ============================================================
    // ITENS DO MENU
    // ============================================================

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
            label: "Diferenciais",
            href: "#diferenciais",
        },
        {
            label: "Formação",
            href: "#formacao",
        },
    ];

    // ============================================================
    // NAVEGAÇÃO DO HERO
    // ============================================================

    const handleHeroNavigation = (href) => {
        // ========================================================
        // HOME
        // ========================================================

        if (href === "#hero") {
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });

            return;
        }

        // ========================================================
        // STACK
        // ========================================================

        if (href === "#stack") {
            // ----------------------------------------------------
            // EXPERIÊNCIA COMPLETA
            // ----------------------------------------------------

            if (experienceMode === "full") {
                const heroTransition = ScrollTrigger.getById("heroTransition");

                if (!heroTransition) {
                    console.warn("ScrollTrigger 'heroTransition' não encontrado.");

                    const section = document.querySelector("#stack");

                    if (section) {
                        section.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                        });
                    }

                    return;
                }

                window.scrollTo({
                    top: heroTransition.end,
                    behavior: "smooth",
                });

                return;
            }

            // ----------------------------------------------------
            // EXPERIÊNCIA REDUZIDA
            // ----------------------------------------------------

            const section = document.querySelector("#stack");

            if (section) {
                section.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }

            return;
        }

        // ========================================================
        // OUTRAS SEÇÕES
        // ========================================================

        const section = document.querySelector(href);

        if (!section) return;

        section.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    // ============================================================
    // ANIMAÇÃO DA TRANSIÇÃO
    // ============================================================

    useLayoutEffect(() => {
        const section = sectionRef.current;

        if (!section) return;

        // ========================================================
        // EXPERIÊNCIA REDUZIDA
        // ========================================================
        //
        // Não criamos:
        //
        // - ScrollTrigger
        // - pin
        // - parallax
        // - animação do Stack
        // - redução do Hero
        // - scale
        // - rotação
        // - blur progressivo
        //
        // Hero e Stack ficam no fluxo normal.
        //
        // O MENU CONTINUA VISÍVEL.
        // ========================================================

        if (experienceMode === "reduced") {
            setShowDesktopMenu(true);
            setDotFieldFrozen(false);

            return;
        }

        // ========================================================
        // EXPERIÊNCIA COMPLETA
        // ========================================================

        const ctx = gsap.context(() => {
            const hero = heroRef.current;
            const seclogs = seclogsRef.current;

            if (!hero || !seclogs) return;

            const mm = gsap.matchMedia();

            mm.add("(min-width: 768px)", () => {
                // =================================================
                // ELEMENTOS DO HERO
                // =================================================

                const heroTitle = hero.querySelector('[data-hero-element="title"]');

                const heroText = hero.querySelector('[data-hero-element="text"]');

                const heroVisual = hero.querySelector('[data-hero-element="visual"]');

                const heroDotField = hero.querySelector('[data-hero-element="dotfield"]');

                const heroArrow = hero.querySelector('[data-hero-element="arrow"]');

                const globalBlur = document.querySelector(".global-gradual-blur");

                // =================================================
                // ESTADOS INICIAIS
                // =================================================

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

                if (heroDotField) {
                    gsap.set(heroDotField, {
                        opacity: 1,
                    });
                }

                // =================================================
                // TIMELINE
                // =================================================

                const tl = gsap.timeline({
                    scrollTrigger: {
                        id: "heroTransition",

                        trigger: section,

                        start: "top top",

                        end: "+=1800",

                        scrub: true,

                        pin: true,

                        anticipatePin: 1,

                        invalidateOnRefresh: true,

                        markers: false,

                        // =========================================
                        // ATUALIZA MENU + DOTFIELD
                        // =========================================

                        onUpdate: () => {
                            if (!hero || !seclogs) return;

                            const heroRect = hero.getBoundingClientRect();

                            const seclogsRect = seclogs.getBoundingClientRect();

                            const coveredAmount = Math.max(0, heroRect.bottom - seclogsRect.top);

                            // =====================================
                            // MENU
                            // =====================================

                            const shouldShowMenu = coveredAmount >= MENU_APPEAR_PX;

                            if (menuVisibleRef.current !== shouldShowMenu) {
                                menuVisibleRef.current = shouldShowMenu;

                                setShowDesktopMenu(shouldShowMenu);
                            }

                            // =====================================
                            // DOT FIELD
                            // =====================================

                            const shouldFreezeDotField = coveredAmount >= DOTFIELD_FREEZE_PX;

                            if (dotFieldFrozenRef.current !== shouldFreezeDotField) {
                                dotFieldFrozenRef.current = shouldFreezeDotField;

                                setDotFieldFrozen(shouldFreezeDotField);
                            }
                        },
                    },
                });

                // =================================================
                // STACK SOBE
                // =================================================

                tl.to(
                    seclogs,
                    {
                        yPercent: 0,
                        ease: "none",
                        duration: 1,
                    },
                    0,
                );

                // =================================================
                // HERO FICA MAIS TRANSPARENTE
                // =================================================

                tl.to(
                    hero,
                    {
                        opacity: 0.55,
                        ease: "none",
                        duration: 1,
                    },
                    0,
                );

                // =================================================
                // FOTO
                // =================================================

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

                // =================================================
                // TÍTULO
                // =================================================

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

                // =================================================
                // TEXTO
                // =================================================

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

                // =================================================
                // SETA
                // =================================================

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

                // =================================================
                // BLUR
                // =================================================

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

                // =================================================
                // PEQUENA PAUSA NO FINAL
                // =================================================

                tl.to(
                    {},
                    {
                        duration: 0.9,
                    },
                );

                // =================================================
                // CLEANUP
                // =================================================

                return () => {
                    tl.kill();
                };
            });

            return () => {
                mm.revert();
            };
        }, sectionRef);

        return () => {
            ctx.revert();

            const heroTransition = ScrollTrigger.getById("heroTransition");

            if (heroTransition) {
                heroTransition.kill();
            }
        };
    }, [experienceMode]);

    // ============================================================
    // CLASSES DEPENDENTES DO MODO
    // ============================================================

    /*
     * FULL
     * ----
     * Hero e Stack ficam sobrepostos para a transição.
     *
     * REDUCED
     * -------
     * Hero e Stack ficam no fluxo normal.
     */

    const isFullExperience = experienceMode === "full";

    const heroWrapperClass = isFullExperience
        ? `
            relative
            z-0
            w-full

            md:absolute
            md:inset-0
            md:h-full
        `
        : `
            relative
            z-0
            w-full
        `;

    const stackWrapperClass = isFullExperience
        ? `
            relative
            z-20
            w-full

            bg-obsidian

            md:absolute
            md:inset-0
            md:h-auto

            md:shadow-[0_-25px_60px_rgba(0,0,0,0.55)]
        `
        : `
            relative
            z-20
            w-full

            bg-obsidian
        `;

    // ============================================================
    // JSX
    // ============================================================

    return (
        <section
            ref={sectionRef}
            className={
                isFullExperience
                    ? `
                        relative
                        w-full
                        h-auto

                        md:h-screen
                        md:overflow-hidden
                    `
                    : `
                        relative
                        w-full
                        h-auto

                        md:h-auto
                        md:overflow-visible
                    `
            }
        >
            {/* ==================================================
                HERO
            ================================================== */}

            <div ref={heroRef} className={heroWrapperClass}>
                <Hero dotFieldFrozen={dotFieldFrozen} onNavigate={handleHeroNavigation} experienceMode={experienceMode} />
            </div>

            {/* ==================================================
                STACK
            ================================================== */}

            <div ref={seclogsRef} className={stackWrapperClass}>
                <Seclogs />
            </div>

            {/* ==================================================
                MENU DESKTOP
            ================================================== */}

            <MenuDesktop items={menuItems} showMenu={showDesktopMenu} />
        </section>
    );
}

export default HeroSectionTransition;

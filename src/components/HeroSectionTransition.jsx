import { useLayoutEffect, useRef, useState } from "react";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Hero from "../layout/HeroTeste2";
import Seclogs from "../layout/Logo2";
import MenuDesktop from "../components/MenuDesktop";

gsap.registerPlugin(ScrollTrigger);

function HeroSectionTransition({ experienceMode = "full" }) {
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

    /*
     * No FULL:
     * o menu começa escondido e aparece durante a transição.
     *
     * No REDUCED:
     * o menu fica disponível desde o início.
     */
    const [showDesktopMenu, setShowDesktopMenu] = useState(false);

    const [dotFieldFrozen, setDotFieldFrozen] = useState(false);

    // ============================================================
    // REFS DE CONTROLE
    // ============================================================

    /*
     * Esses refs evitam chamar setState repetidamente
     * durante o onUpdate do ScrollTrigger.
     */
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

                /*
                 * No Full, o Stack faz parte da transição
                 * pinada do Hero.
                 *
                 * Por isso navegamos até o final
                 * do ScrollTrigger da transição.
                 */
                window.scrollTo({
                    top: heroTransition.end,
                    behavior: "smooth",
                });

                return;
            }

            // ----------------------------------------------------
            // EXPERIÊNCIA REDUZIDA
            // ----------------------------------------------------

            /*
             * No Reduced não existe a transição pinada.
             *
             * Hero e Stack estão no fluxo normal.
             */
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

        /*
         * No Reduced NÃO criamos:
         *
         * - ScrollTrigger da transição
         * - pin
         * - parallax
         * - Stack subindo
         * - redução do Hero
         * - scale
         * - rotação
         * - blur progressivo
         *
         * Hero e Stack permanecem no fluxo normal.
         */

        if (experienceMode === "reduced") {
            const hero = heroRef.current;

            if (!hero) return;

            const updateReducedMenu = () => {
                const heroRect = hero.getBoundingClientRect();

                /*
                 * Quando o final do Hero começa a sair
                 * da viewport, o menu aparece.
                 *
                 * Ajuste esse valor conforme o ponto
                 * visual desejado.
                 */
                const shouldShowMenu = heroRect.bottom <= window.innerHeight * 0.85;

                if (menuVisibleRef.current !== shouldShowMenu) {
                    menuVisibleRef.current = shouldShowMenu;

                    setShowDesktopMenu(shouldShowMenu);
                }
            };

            /*
             * Estado inicial
             */
            updateReducedMenu();

            /*
             * Atualiza enquanto o usuário rola.
             */
            window.addEventListener("scroll", updateReducedMenu, { passive: true });

            /*
             * Atualiza em resize.
             */
            window.addEventListener("resize", updateReducedMenu);

            return () => {
                window.removeEventListener("scroll", updateReducedMenu);

                window.removeEventListener("resize", updateReducedMenu);
            };
        }

        // ========================================================
        // EXPERIÊNCIA COMPLETA
        // ========================================================

        const ctx = gsap.context(() => {
            const hero = heroRef.current;
            const seclogs = seclogsRef.current;

            if (!hero || !seclogs) return;

            const mm = gsap.matchMedia();

            // ====================================================
            // DESKTOP
            // ====================================================

            mm.add("(min-width: 768px)", () => {
                // =================================================
                // ELEMENTOS DO HERO
                // =================================================

                const heroTitle = hero.querySelector('[data-hero-element="title"]');

                const heroText = hero.querySelector('[data-hero-element="text"]');

                const heroVisual = hero.querySelector('[data-hero-element="visual"]');

                const heroDotField = hero.querySelector('[data-hero-element="dotfield"]');

                const heroArrow = hero.querySelector('[data-hero-element="arrow"]');

                // =================================================
                // ESTADOS INICIAIS
                // =================================================

                /*
                 * Stack começa abaixo.
                 */
                gsap.set(seclogs, {
                    yPercent: 100,
                });

                /*
                 * Hero começa totalmente visível.
                 */
                gsap.set(hero, {
                    opacity: 1,
                });

                /*
                 * Seta começa na posição original.
                 */
                if (heroArrow) {
                    gsap.set(heroArrow, {
                        rotation: 0,
                        transformOrigin: "center center",
                    });
                }


                /*
                 * DotField começa visível.
                 */
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

                        pinType: "transform",

                        invalidateOnRefresh: true,

                        markers: false,

                        // =========================================
                        // ATUALIZA MENU + DOTFIELD
                        // =========================================

                        onUpdate: () => {
                            if (!hero || !seclogs) {
                                return;
                            }

                            const heroRect = hero.getBoundingClientRect();

                            const seclogsRect = seclogs.getBoundingClientRect();

                            /*
                             * Mede quanto o Stack já cobriu
                             * do Hero.
                             */
                            const coveredAmount = Math.max(0, heroRect.bottom - seclogsRect.top);

                            // =====================================
                            // MENU
                            // =====================================

                            const shouldShowMenu = coveredAmount >= MENU_APPEAR_PX;

                            /*
                             * Só atualiza o React quando
                             * o valor realmente mudou.
                             */
                            if (menuVisibleRef.current !== shouldShowMenu) {
                                menuVisibleRef.current = shouldShowMenu;

                                setShowDesktopMenu(shouldShowMenu);
                            }

                            // =====================================
                            // DOT FIELD
                            // =====================================

                            const shouldFreezeDotField = coveredAmount >= DOTFIELD_FREEZE_PX;

                            /*
                             * Só atualiza o React quando
                             * o valor realmente mudou.
                             */
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
                // PEQUENA PAUSA NO FINAL
                // =================================================

                tl.to(
                    {},
                    {
                        duration: 0,
                    },
                );

                // =================================================
                // CLEANUP DA TIMELINE
                // =================================================

                return () => {
                    tl.kill();
                };
            });

            // ====================================================
            // CLEANUP MATCHMEDIA
            // ====================================================

            return () => {
                mm.revert();
            };
        }, sectionRef);

        // ========================================================
        // CLEANUP GSAP CONTEXT
        // ========================================================

        return () => {
            ctx.revert();

            const heroTransition = ScrollTrigger.getById("heroTransition");

            if (heroTransition) {
                heroTransition.kill();
            }
        };
    }, [experienceMode]);

    // ============================================================
    // MODO ATUAL
    // ============================================================

    const isFullExperience = experienceMode === "full";

    // ============================================================
    // WRAPPER DO HERO
    // ============================================================

    /*
     * FULL:
     *
     * Hero fica sobreposto ao Stack.
     *
     * REDUCED:
     *
     * Hero volta para o fluxo normal.
     */

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

    // ============================================================
    // WRAPPER DO STACK
    // ============================================================

    /*
     * FULL:
     *
     * Stack fica sobreposto e é movimentado
     * pelo GSAP.
     *
     * REDUCED:
     *
     * Stack fica no fluxo normal da página.
     */

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
                {isFullExperience === false && (
                    <div
                        className="
                             pointer-events-none
            absolute
            inset-x-0
            bottom-0
            z-20
            h-40
            bg-gradient-to-b
            from-transparent
            via-obsidian/50
            to-obsidian
            "
                    />
                )}
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

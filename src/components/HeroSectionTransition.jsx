import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Hero from "../layout/HeroTeste2";
import Seclogs from "../layout/Logo2";
import useResponsive from "../hooks/useResponsive";
import { scrollToTarget } from "../utils/lenisControl";
import { playUiSound } from "../utils/uiSfx";

gsap.registerPlugin(ScrollTrigger);

function HeroSectionTransition({ experienceMode = "full", entranceKey = 0, isRouteTransitioning = false, onMenuVisibilityChange, onRouteReady }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { isMobileLayout, isCompactLandscape, isTablet } = useResponsive();
    const requiredHeroLayout = isMobileLayout ? "mobile" : "desktop";
    const requiredStackLayout = isMobileLayout ? "mobile" : "desktop";
    const [readyHeroLayout, setReadyHeroLayout] = useState(null);
    const [readyHeroContentLayout, setReadyHeroContentLayout] = useState(null);
    const [readyStackLayout, setReadyStackLayout] = useState(null);

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
    // Espelha a visibilidade real inicial: showDesktopMenu começa em false.
    // No Reduced, o primeiro cálculo precisa conseguir mudar ref e estado para true.
    const menuVisibleRef = useRef(false);

    const dotFieldFrozenRef = useRef(false);


    // O menu flutuante é renderizado uma única vez pelo shell global.
    // O Hero continua sendo a fonte da visibilidade no modo Home.
    useEffect(() => {
        onMenuVisibilityChange?.(showDesktopMenu);
    }, [showDesktopMenu, onMenuVisibilityChange]);

    useEffect(() => () => {
        onMenuVisibilityChange?.(false);
    }, [onMenuVisibilityChange]);

    // O preloader de rota só termina quando o layout do Hero e sua imagem
    // principal estão prontos. No desktop Full, o Stack também é necessário
    // para que o pin e os ScrollTriggers tenham medidas válidas.
    useEffect(() => {
        if (readyHeroLayout !== requiredHeroLayout) return;
        if (readyHeroContentLayout !== requiredHeroLayout) return;

        const waitsForPinnedStack = (
            experienceMode === "full" &&
            !isMobileLayout &&
            readyStackLayout !== requiredStackLayout
        );

        if (waitsForPinnedStack) return;

        onRouteReady?.("/");
    }, [
        onRouteReady,
        readyHeroLayout,
        readyHeroContentLayout,
        requiredHeroLayout,
        experienceMode,
        isMobileLayout,
        readyStackLayout,
        requiredStackLayout,
    ]);

    // Links de âncora vindos das páginas internas aguardam os layouts lazy e o pin.
    useEffect(() => {
        const target = location.state?.portfolioScrollTarget;

        if (location.pathname !== "/" || !target) return;
        if (readyHeroLayout !== requiredHeroLayout) return;
        if (target === "#stack" && readyStackLayout !== requiredStackLayout) return;

        let firstFrameId = 0;
        let secondFrameId = 0;

        firstFrameId = requestAnimationFrame(() => {
            secondFrameId = requestAnimationFrame(() => {
                if (target === "#hero") {
                    scrollToTarget(0, { duration: 1.4 });
                } else if (target === "#stack") {
                    const heroTransition = experienceMode === "full" && !isMobileLayout
                        ? ScrollTrigger.getById("heroTransition")
                        : null;

                    if (heroTransition) {
                        scrollToTarget(heroTransition.end, { duration: 1.4 });
                    } else {
                        const section = document.querySelector(target);
                        if (section) scrollToTarget(section, { duration: 1.4 });
                    }
                } else {
                    const section = document.querySelector(target);
                    if (section) scrollToTarget(section, { duration: 1.4 });
                }

                navigate("/", { replace: true, state: null });
            });
        });

        return () => {
            cancelAnimationFrame(firstFrameId);
            cancelAnimationFrame(secondFrameId);
        };
    }, [
        location.pathname,
        location.state,
        navigate,
        readyHeroLayout,
        readyStackLayout,
        requiredHeroLayout,
        requiredStackLayout,
        experienceMode,
        isMobileLayout,
    ]);


    // ============================================================
    // NAVEGAÇÃO DO HERO
    // ============================================================

    const handleHeroNavigation = (href) => {
        playUiSound(href === "#hero" ? "back" : "forward");

        if (!href.startsWith("#")) {
            navigate(href);
            return;
        }

        if (href === "#hero") {
            scrollToTarget(0, { duration: 1.4 });
            return;
        }

        if (href === "#stack") {
            if (experienceMode === "full") {
                const heroTransition = ScrollTrigger.getById("heroTransition");

                if (heroTransition) {
                    // O Stack pertence à transição pinada; seu destino correto é o fim do pin.
                    scrollToTarget(heroTransition.end, { duration: 1.4 });
                    return;
                }

                console.warn("ScrollTrigger 'heroTransition' não encontrado.");
            }

            const section = document.querySelector("#stack");
            if (section) scrollToTarget(section, { duration: 1.4 });
            return;
        }

        const section = document.querySelector(href);
        if (section) scrollToTarget(section, { duration: 1.4 });
    };

    // ============================================================
    // ANIMAÇÃO DA TRANSIÇÃO
    // ============================================================

    useLayoutEffect(() => {
        const section = sectionRef.current;

        if (!section) return;

        // Mantém o Stack fora da tela durante o carregamento do layout lazy.
        // Este contexto separado é revertido nos retornos antecipados e no cleanup.
        const initialContext = gsap.context(() => {
            if (experienceMode === "full" && !isMobileLayout) {
                const seclogs = seclogsRef.current;

                if (seclogs) {
                    gsap.set(seclogs, {
                        yPercent: 100,
                    });
                }
            }
        }, section);

        // A transição depende do DOM do Hero correspondente à viewport.
        // Aguarda o módulo lazy carregar antes de criar animações e ScrollTriggers.
        if (readyHeroLayout !== requiredHeroLayout) {
            return () => initialContext.revert();
        }

        // A transição pinada no desktop precisa medir o Stack real,
        // não o espaço reservado enquanto o módulo lazy carrega.
        if (experienceMode === "full" && !isMobileLayout && readyStackLayout !== requiredStackLayout) {
            return () => initialContext.revert();
        }

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

            if (!hero) return () => initialContext.revert();

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
             * Estado inicial.
             *
             * Mede novamente após dois frames para incluir o layout lazy
             * e a restauração de scroll do navegador após refresh.
             */
            updateReducedMenu();

            let firstReducedMenuFrame = 0;
            let secondReducedMenuFrame = 0;

            firstReducedMenuFrame = requestAnimationFrame(() => {
                secondReducedMenuFrame = requestAnimationFrame(updateReducedMenu);
            });

            /*
             * Mantém o estado sincronizado em rolagem, resize e pageshow.
             */
            window.addEventListener("scroll", updateReducedMenu, { passive: true });
            window.addEventListener("resize", updateReducedMenu);
            window.addEventListener("pageshow", updateReducedMenu);

            return () => {
                cancelAnimationFrame(firstReducedMenuFrame);
                cancelAnimationFrame(secondReducedMenuFrame);

                window.removeEventListener("scroll", updateReducedMenu);
                window.removeEventListener("resize", updateReducedMenu);
                window.removeEventListener("pageshow", updateReducedMenu);

                initialContext.revert();
            };
        }

        // ========================================================
        // EXPERIÊNCIA COMPLETA
        // ========================================================

        // O pin do Hero/Stack altera os offsets dos ScrollTriggers abaixo.
        // Recalcula todos depois que a geometria do pin estiver aplicada.
        let pinRefreshFrameId = null;

        const ctx = gsap.context(() => {
            const hero = heroRef.current;
            const seclogs = seclogsRef.current;

            if (!hero || !seclogs) return;

            const mm = gsap.matchMedia();

            // ====================================================
            // DESKTOP
            // ====================================================

            mm.add("(min-width: 768px) and (hover: hover) and (pointer: fine) and (orientation: portrait), (min-width: 768px) and (hover: hover) and (pointer: fine) and (orientation: landscape) and (min-height: 601px)", () => {
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

                        // O Hero é carregado sob demanda e pode criar o pin depois dos gatilhos abaixo.
                        // Prioriza sua medição para que o espaço pinado seja incluído nos starts/ends seguintes.
                        refreshPriority: 1,

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

        // O pin já está criado neste ponto; espera um frame para medir
        // as seções seguintes com os offsets definitivos do ScrollTrigger.
        if (experienceMode === "full" && !isMobileLayout) {
            pinRefreshFrameId = requestAnimationFrame(() => {
                pinRefreshFrameId = null;
                ScrollTrigger.refresh();
            });
        }

        // ========================================================
        // CLEANUP GSAP CONTEXT
        // ========================================================

        return () => {
            if (pinRefreshFrameId !== null) {
                cancelAnimationFrame(pinRefreshFrameId);
            }

            ctx.revert();
            initialContext.revert();

            const heroTransition = ScrollTrigger.getById("heroTransition");

            if (heroTransition) {
                heroTransition.kill();
            }
        };
    }, [experienceMode, readyHeroLayout, requiredHeroLayout, readyStackLayout, requiredStackLayout, isMobileLayout]);

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

                b-md:absolute
                b-md:inset-0
                b-md:h-full
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

                b-md:absolute
                b-md:inset-0
                b-md:h-auto

                b-md:shadow-[0_-25px_60px_rgba(0,0,0,0.55)]
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

                        b-md:h-screen
                        b-md:overflow-hidden
                    `
                    : `
                        relative
                        w-full
                        h-auto

                        b-md:h-auto
                        b-md:overflow-visible
                    `
            }
        >
            {/* ==================================================
                HERO
            ================================================== */}

            <div ref={heroRef} className={heroWrapperClass}>
                <Hero isMobileLayout={isMobileLayout} isCompactLandscape={isCompactLandscape} isTablet={isTablet} dotFieldFrozen={dotFieldFrozen} onNavigate={handleHeroNavigation} onReady={setReadyHeroLayout} onContentReady={setReadyHeroContentLayout} experienceMode={experienceMode} entranceKey={entranceKey} isRouteTransitioning={isRouteTransitioning} />
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
                <Seclogs onReady={setReadyStackLayout} />
            </div>

        </section>
    );
}

export default HeroSectionTransition;

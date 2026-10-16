import { lazy, Suspense, useLayoutEffect, useRef, useState } from "react";

import Hero from "../layout/HeroTeste2";
import Seclogs from "../layout/Logo2";
const MenuDesktop = lazy(() => import("../components/MenuDesktop"));
import useResponsive from "../hooks/useResponsive";


function HeroSectionTransition({ experienceMode = "full" }) {
    const { isMobileLayout } = useResponsive();
    const requiredHeroLayout = isMobileLayout ? "mobile" : "desktop";
    const requiredStackLayout = isMobileLayout ? "mobile" : "desktop";
    const [readyHeroLayout, setReadyHeroLayout] = useState(null);
    const [readyStackLayout, setReadyStackLayout] = useState(null);

    const sectionRef = useRef(null);
    const heroRef = useRef(null);
    const seclogsRef = useRef(null);
    const scrollTriggerRef = useRef(null);

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
    // Mantém o menu montado após a primeira aparição para permitir a animação de saída.
    const [hasShownDesktopMenu, setHasShownDesktopMenu] = useState(false);

    const [dotFieldFrozen, setDotFieldFrozen] = useState(false);
    const [desktopAnimationReady, setDesktopAnimationReady] = useState(false);

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

    // ============================================================
    // ITENS DO MENU
    // ============================================================

    const menuItems = [
        {
            label: "Hero",
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
        // Hero
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

            if (experienceMode === "full" && !isMobileLayout) {
                const heroTransition = scrollTriggerRef.current?.getById("heroTransition");

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

        if (!section || readyHeroLayout !== requiredHeroLayout) return;

        // O modo reduzido não precisa carregar GSAP/ScrollTrigger para o menu.
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

                    if (shouldShowMenu) {
                        setHasShownDesktopMenu(true);
                    }

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

            };
        }


        // A experiência mobile não utiliza pin nem timeline nesta transição.
        if (isMobileLayout || readyStackLayout !== requiredStackLayout) return;

        let cancelled = false;
        let pinRefreshFrameId = null;
        let ctx = null;
        let scrollTriggerModule = null;

        const initializeAnimations = async () => {
            try {
                const [gsapModule, scrollTriggerModuleResult] = await Promise.all([
                    import("gsap"),
                    import("gsap/ScrollTrigger"),
                ]);

                if (cancelled) return;

                const gsap = gsapModule.default ?? gsapModule.gsap;
                const { ScrollTrigger } = scrollTriggerModuleResult;

                gsap.registerPlugin(ScrollTrigger);
                scrollTriggerModule = ScrollTrigger;
                scrollTriggerRef.current = ScrollTrigger;

                ctx = gsap.context(() => {
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

                // O estado React remove o deslocamento CSS auxiliar somente depois
                // que o GSAP assume o mesmo transform no elemento.
                setDesktopAnimationReady(true);

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

                                if (shouldShowMenu) {
                                    setHasShownDesktopMenu(true);
                                }

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

                // O pin já existe; recalcula os offsets no próximo frame.
                pinRefreshFrameId = requestAnimationFrame(() => {
                    pinRefreshFrameId = null;
                    if (!cancelled) ScrollTrigger.refresh();
                });
            } catch (error) {
                if (!cancelled) {
                    console.error("Não foi possível carregar as animações do Hero.", error);
                }
            }
        };

        void initializeAnimations();

        return () => {
            cancelled = true;

            if (pinRefreshFrameId !== null) {
                cancelAnimationFrame(pinRefreshFrameId);
            }

            ctx?.revert();
            setDesktopAnimationReady(false);

            const heroTransition = scrollTriggerModule?.getById("heroTransition");
            heroTransition?.kill();

            if (scrollTriggerRef.current === scrollTriggerModule) {
                scrollTriggerRef.current = null;
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

                ${desktopAnimationReady ? "" : "b-md:translate-y-full"}

                b-md:absolute
                b-md:inset-0
                b-md:h-auto

                b-md:shadow-[0_-25px_60px_rgba(0,0,0,0.55)]
                b-md:translate-y-full
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
                <Hero isMobileLayout={isMobileLayout} dotFieldFrozen={dotFieldFrozen} onNavigate={handleHeroNavigation} onReady={setReadyHeroLayout} experienceMode={experienceMode} />
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

            {/* ==================================================
                MENU DESKTOP
            ================================================== */}

            {hasShownDesktopMenu && (
                <Suspense fallback={null}>
                    <MenuDesktop items={menuItems} showMenu={showDesktopMenu} />
                </Suspense>
            )}
        </section>
    );
}

export default HeroSectionTransition;

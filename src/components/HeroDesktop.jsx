import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import ExperienceDropdown from "./ExperienceDropdown";

import Socials from "../components/Socials";
import DotField from "../components/DotField";

import { ArrowDownRight } from "lucide-react";

import { setExperienceMode } from "../utils/experienceMode";

import MagneticLink from "../components/MagneticNavLink";

import "../styles/looptextHero.css";
import "../styles/heroParallax.css";

gsap.registerPlugin(ScrollTrigger);

function HeroDesktop({ items, dotFieldFrozen = false, onNavigate, experienceMode = "full" }) {
    // ============================================================
    // REFS
    // ============================================================

    const heroRef = useRef(null);

    const heroTitleRef = useRef(null);
    const heroTextRef = useRef(null);
    const heroVisualRef = useRef(null);

    const heroDotFieldRef = useRef(null);

    const logoRef = useRef(null);
    const navRef = useRef(null);
    const locationRef = useRef(null);
    const socialsRef = useRef(null);

    const [activeHref, setActiveHref] = useState(null);

    // ============================================================
    // ACTIVE NAVIGATION
    // ============================================================

    useLayoutEffect(() => {
        const updateActiveSection = () => {
            const viewportPosition = window.innerHeight * 0.35;

            let currentSection = null;

            items.forEach((item) => {
                if (!item.href?.startsWith("#")) return;

                const id = item.href.slice(1);

                const section = document.getElementById(id);

                if (!section) return;

                const rect = section.getBoundingClientRect();

                if (rect.top <= viewportPosition && rect.bottom >= viewportPosition) {
                    currentSection = item.href;
                }
            });

            setActiveHref(currentSection);
        };

        updateActiveSection();

        window.addEventListener("scroll", updateActiveSection, {
            passive: true,
        });

        window.addEventListener("resize", updateActiveSection);

        return () => {
            window.removeEventListener("scroll", updateActiveSection);

            window.removeEventListener("resize", updateActiveSection);
        };
    }, [items]);
    // ============================================================
    // MODO DE EXPERIÊNCIA
    // ============================================================

    const isReducedExperience = experienceMode === "reduced";

    // ============================================================
    // EXPERIENCE MENU
    // ============================================================

    const [experienceMenuOpen, setExperienceMenuOpen] = useState(false);

    const experienceMenuRef = useRef(null);

    const experienceMenuMotionRef = useRef(null);
    useLayoutEffect(() => {
        gsap.fromTo(
            experienceMenuMotionRef.current,
            {
                opacity: 0,
                scale: 0.92,
                y: -8,
            },
            {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.45,
                ease: "back.out(1.7)",
            },
        );
    }, [experienceMenuOpen]);

    // ============================================================
    // DEBUG
    // ============================================================

    const debugIdRef = useRef(`HERO-${Math.random().toString(36).slice(2, 7)}`);

    const debugId = debugIdRef.current;

    // ============================================================
    // EXPERIENCE — ALTERAR MODO
    // ============================================================

    const handleExperienceChange = (mode) => {
        // Se clicar no modo que já está ativo,
        // apenas fecha o menu.

        if (mode === experienceMode) {
            setExperienceMenuOpen(false);
            return;
        }

        // Fecha o menu

        setExperienceMenuOpen(false);

        // Salva o novo modo

        setExperienceMode(mode);

        // Recarrega para que todos os componentes
        // sejam inicializados no novo modo.

        window.location.reload();
    };

    // ============================================================
    // EXPERIENCE — CLIQUE FORA
    // ============================================================

    useLayoutEffect(() => {
        const handleClickOutside = (event) => {
            if (experienceMenuRef.current && !experienceMenuRef.current.contains(event.target)) {
                setExperienceMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // ============================================================
    // ANIMAÇÃO DE ENTRADA
    // ============================================================

    useLayoutEffect(() => {
        const hero = heroRef.current;

        if (!hero) {
            console.log(`%c[HERO DEBUG ${debugId}] ❌ heroRef não existe`, "color:red;font-weight:bold");

            return;
        }

        console.log(`%c[HERO DEBUG ${debugId}] 🚀 useLayoutEffect ENTRADA iniciou`, "color:#00bcd4;font-weight:bold");

        console.log(`[HERO DEBUG ${debugId}] scrollY no início:`, window.scrollY);

        console.log(`[HERO DEBUG ${debugId}] experienceMode:`, experienceMode);

        const ctx = gsap.context(() => {
            const title = heroTitleRef.current;
            const text = heroTextRef.current;
            const visual = heroVisualRef.current;

            const logo = logoRef.current;
            const nav = navRef.current;
            const location = locationRef.current;
            const socials = socialsRef.current;

            const elements = [logo, nav, visual, title, location, text, socials].filter(Boolean);

            console.log(`[HERO DEBUG ${debugId}] elementos encontrados:`, elements.length);

            if (!elements.length) {
                console.log(`%c[HERO DEBUG ${debugId}] ❌ Nenhum elemento encontrado`, "color:red;font-weight:bold");

                return;
            }

            // ========================================================
            // ESTADO VISÍVEL
            // ========================================================

            const setVisibleState = () => {
                console.log(`%c[HERO DEBUG ${debugId}] 👁️ setVisibleState()`, "color:#4caf50;font-weight:bold");

                console.log(`[HERO DEBUG ${debugId}] scrollY ao definir visível:`, window.scrollY);

                gsap.set(elements, {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    scale: 1,
                });
            };

            // ========================================================
            // INICIALIZAÇÃO DA ENTRADA
            // ========================================================

            const initializeEntry = () => {
                const currentScroll = window.scrollY;

                const heroRect = hero.getBoundingClientRect();

                const heroTop = heroRect.top;

                const heroBottom = heroRect.bottom;

                const heroIsVisible = heroBottom > 0 && heroTop < window.innerHeight;

                console.log(`%c[HERO DEBUG ${debugId}] 📍 initializeEntry()`, "color:#ff9800;font-weight:bold");

                console.log(`[HERO DEBUG ${debugId}] scrollY:`, currentScroll);

                console.log(`[HERO DEBUG ${debugId}] hero.top:`, heroTop);

                console.log(`[HERO DEBUG ${debugId}] hero.bottom:`, heroBottom);

                console.log(`[HERO DEBUG ${debugId}] hero.height:`, heroRect.height);

                console.log(`[HERO DEBUG ${debugId}] viewport.height:`, window.innerHeight);

                console.log(`[HERO DEBUG ${debugId}] heroIsVisible:`, heroIsVisible);

                // ====================================================
                // SE O SCROLL FOI RESTAURADO
                // ====================================================

                if (currentScroll > 50) {
                    console.log(`%c[HERO DEBUG ${debugId}] 🟡 NÃO executar entrada`, "color:#ffc107;font-weight:bold");

                    console.log(`[HERO DEBUG ${debugId}] Motivo: scrollY (${currentScroll}) > 50`);

                    setVisibleState();

                    return null;
                }

                // ====================================================
                // SE O HERO NÃO ESTÁ NO TOPO
                // ====================================================

                if (heroTop < -50) {
                    console.log(`%c[HERO DEBUG ${debugId}] 🟡 NÃO executar entrada`, "color:#ffc107;font-weight:bold");

                    console.log(`[HERO DEBUG ${debugId}] Motivo: hero.top (${heroTop}) < -50`);

                    setVisibleState();

                    return null;
                }

                // ====================================================
                // ENTRADA
                // ====================================================

                console.log(`%c[HERO DEBUG ${debugId}] 🟢 EXECUTANDO ANIMAÇÃO DE ENTRADA`, "color:#00e676;font-weight:bold");

                // ====================================================
                // ESTADO INICIAL
                // ====================================================

                console.log(`[HERO DEBUG ${debugId}] Aplicando estados iniciais`);

                gsap.set(logo, {
                    opacity: 0,
                    y: -18,
                });

                gsap.set(nav, {
                    opacity: 0,
                    y: -18,
                });

                gsap.set(visual, {
                    opacity: 0,
                    y: 45,
                    scale: 0.985,
                });

                gsap.set(title, {
                    opacity: 0,
                    y: 35,
                });

                gsap.set(location, {
                    opacity: 0,
                    x: -30,
                });

                gsap.set(text, {
                    opacity: 0,
                    y: 35,
                });

                gsap.set(socials, {
                    opacity: 0,
                    y: 20,
                });

                // ====================================================
                // TIMELINE DE ENTRADA
                // ====================================================

                const timeline = gsap.timeline({
                    defaults: {
                        ease: "power3.out",
                    },

                    onStart: () => {
                        console.log(`%c[HERO DEBUG ${debugId}] ▶️ TIMELINE DE ENTRADA START`, "color:#2196f3;font-weight:bold");
                    },

                    onComplete: () => {
                        console.log(`%c[HERO DEBUG ${debugId}] ✅ TIMELINE DE ENTRADA COMPLETE`, "color:#2196f3;font-weight:bold");

                        console.log(`[HERO DEBUG ${debugId}] scrollY no final da entrada:`, window.scrollY);
                    },
                });

                // ====================================================
                // LOGO
                // ====================================================

                if (logo) {
                    timeline.to(
                        logo,
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.75,
                        },
                        0.05,
                    );
                }

                // ====================================================
                // NAVBAR
                // ====================================================

                if (nav) {
                    timeline.to(
                        nav,
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.8,
                        },
                        0.12,
                    );
                }

                // ====================================================
                // FOTO
                // ====================================================

                if (visual) {
                    timeline.to(
                        visual,
                        {
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            duration: 1.2,
                            ease: "power3.out",
                        },
                        0.15,
                    );
                }

                // ====================================================
                // MARQUEE
                // ====================================================

                if (title) {
                    timeline.to(
                        title,
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.95,
                            ease: "power3.out",
                        },
                        0.35,
                    );
                }

                // ====================================================
                // LOCALIZAÇÃO
                // ====================================================

                if (location) {
                    timeline.to(
                        location,
                        {
                            opacity: 1,
                            x: 0,
                            duration: 0.85,
                            ease: "power3.out",
                        },
                        0.42,
                    );
                }

                // ====================================================
                // SOFTWARE DEVELOPER
                // ====================================================

                if (text) {
                    timeline.to(
                        text,
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.95,
                            ease: "power3.out",
                        },
                        0.5,
                    );
                }

                // ====================================================
                // SOCIALS
                // ====================================================

                if (socials) {
                    timeline.to(
                        socials,
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.75,
                        },
                        0.68,
                    );
                }

                console.log(`[HERO DEBUG ${debugId}] duração total da entrada:`, timeline.duration());

                return () => {
                    console.log(`%c[HERO DEBUG ${debugId}] 🧹 cleanup timeline ENTRADA`, "color:#9c27b0;font-weight:bold");

                    timeline.kill();
                };
            };

            // ========================================================
            // OBSERVAÇÃO DO SCROLL
            // ========================================================

            let scrollLogCount = 0;

            const handleScrollDebug = () => {
                scrollLogCount++;

                if (scrollLogCount <= 15) {
                    console.log(`[HERO DEBUG ${debugId}] 📜 scroll event #${scrollLogCount} → scrollY:`, window.scrollY);
                }
            };

            window.addEventListener("scroll", handleScrollDebug, {
                passive: true,
            });

            // ========================================================
            // RESTAURAÇÃO DO SCROLL
            // ========================================================

            console.log(`%c[HERO DEBUG ${debugId}] ⏳ aguardando restauração do scroll...`, "color:#795548;font-weight:bold");

            /*
            ============================================================
            IMPORTANTE

            Não confiamos mais em apenas 2 RAF.

            O navegador pode restaurar o scroll depois disso.

            Vamos observar alguns frames e procurar uma posição
            estável antes de decidir se a entrada deve acontecer.
            ============================================================
            */

            let frameId = null;
            let animationCleanup = null;

            let frameCount = 0;

            const MAX_FRAMES = 20;

            let previousScroll = null;
            let stableFrames = 0;

            const waitForScrollRestoration = () => {
                frameCount++;

                const currentScroll = window.scrollY;

                const heroRect = hero.getBoundingClientRect();

                console.log(`[HERO DEBUG ${debugId}] Frame ${frameCount} → scrollY:`, currentScroll, "| hero.top:", heroRect.top, "| hero.bottom:", heroRect.bottom);

                // ====================================================
                // DETECTA POSIÇÃO ESTÁVEL
                // ====================================================

                if (previousScroll !== null && Math.abs(currentScroll - previousScroll) < 1) {
                    stableFrames++;
                } else {
                    stableFrames = 0;
                }

                previousScroll = currentScroll;

                /*
                 * Precisamos de alguns frames consecutivos
                 * sem mudança significativa.
                 */

                if (stableFrames >= 3) {
                    console.log(`%c[HERO DEBUG ${debugId}] 🟢 posição do scroll estabilizou`, "color:#00e676;font-weight:bold");

                    console.log(`[HERO DEBUG ${debugId}] scroll final detectado:`, currentScroll);

                    animationCleanup = initializeEntry();

                    return;
                }

                // ====================================================
                // LIMITE DE SEGURANÇA
                // ====================================================

                if (frameCount >= MAX_FRAMES) {
                    console.log(`%c[HERO DEBUG ${debugId}] ⚠️ limite de frames atingido`, "color:#ff9800;font-weight:bold");

                    console.log(`[HERO DEBUG ${debugId}] scrollY no limite:`, currentScroll);

                    animationCleanup = initializeEntry();

                    return;
                }

                // ====================================================
                // PRÓXIMO FRAME
                // ====================================================

                frameId = requestAnimationFrame(waitForScrollRestoration);
            };

            // ========================================================
            // PRIMEIRO FRAME
            // ========================================================

            frameId = requestAnimationFrame(waitForScrollRestoration);

            // ========================================================
            // CLEANUP
            // ========================================================

            return () => {
                console.log(`%c[HERO DEBUG ${debugId}] 🧹 cleanup useLayoutEffect ENTRADA`, "color:#9c27b0;font-weight:bold");

                if (frameId !== null) {
                    cancelAnimationFrame(frameId);
                }

                window.removeEventListener("scroll", handleScrollDebug);

                if (animationCleanup) {
                    animationCleanup();
                }
            };
        }, hero);

        return () => {
            ctx.revert();
        };
    }, []);

    // ============================================================
    // ANIMAÇÃO DE SAÍDA — SOMENTE REDUCED
    // ============================================================

    useLayoutEffect(() => {
        console.log(`%c[HERO DEBUG ${debugId}] 🚀 useLayoutEffect SAÍDA iniciou`, "color:#e91e63;font-weight:bold");

        console.log(`[HERO DEBUG ${debugId}] saída — experienceMode:`, experienceMode);

        console.log(`[HERO DEBUG ${debugId}] saída — isReducedExperience:`, isReducedExperience);

        console.log(`[HERO DEBUG ${debugId}] saída — scrollY inicial:`, window.scrollY);

        // ========================================================
        // FULL
        // ========================================================

        if (!isReducedExperience) {
            console.log(`%c[HERO DEBUG ${debugId}] ⏭️ SAÍDA ignorada porque modo = FULL`, "color:#607d8b;font-weight:bold");

            return;
        }

        const hero = heroRef.current;

        if (!hero) {
            console.log(`%c[HERO DEBUG ${debugId}] ❌ SAÍDA: heroRef não existe`, "color:red;font-weight:bold");

            return;
        }

        const ctx = gsap.context(() => {
            const title = heroTitleRef.current;

            const text = heroTextRef.current;

            const visual = heroVisualRef.current;

            const logo = logoRef.current;

            const nav = navRef.current;

            const location = locationRef.current;

            const socials = socialsRef.current;

            // ========================================================
            // TIMELINE DE SAÍDA
            // ========================================================

            console.log(`%c[HERO DEBUG ${debugId}] 🔴 criando TIMELINE DE SAÍDA`, "color:#f44336;font-weight:bold");

            const exitTimeline = gsap.timeline({
                paused: true,
            });

            // ========================================================
            // LOGO
            // ========================================================

            if (logo) {
                exitTimeline.to(
                    logo,
                    {
                        opacity: 0,
                        y: -35,
                        duration: 0.55,
                        ease: "power2.inOut",
                    },
                    0,
                );
            }

            // ========================================================
            // NAVBAR
            // ========================================================

            if (nav) {
                exitTimeline.to(
                    nav,
                    {
                        opacity: 0,
                        y: -30,
                        duration: 0.6,
                        ease: "power2.inOut",
                    },
                    0.04,
                );
            }

            // ========================================================
            // LOCALIZAÇÃO
            // ========================================================

            if (location) {
                exitTimeline.to(
                    location,
                    {
                        opacity: 0,
                        x: -55,
                        y: -20,
                        duration: 0.65,
                        ease: "power2.inOut",
                    },
                    0.08,
                );
            }

            // ========================================================
            // MARQUEE
            // ========================================================

            if (title) {
                exitTimeline.to(
                    title,
                    {
                        opacity: 0,
                        y: -75,
                        duration: 0.58,
                        ease: "power2.out",
                    },
                    0.12,
                );
            }

            // ========================================================
            // SOFTWARE DEVELOPER
            // ========================================================

            if (text) {
                exitTimeline.to(
                    text,
                    {
                        opacity: 0,
                        y: -45,
                        duration: 0.72,
                        ease: "power2.inOut",
                    },
                    0.16,
                );
            }

            // ========================================================
            // FOTO CENTRAL
            // ========================================================

            if (visual) {
                exitTimeline.to(
                    visual,
                    {
                        opacity: 0,
                        y: -35,
                        scale: 0.96,
                        duration: 0.9,
                        ease: "power2.inOut",
                    },
                    0.18,
                );
            }

            // ========================================================
            // SOCIALS
            // ========================================================

            if (socials) {
                exitTimeline.to(
                    socials,
                    {
                        opacity: 0,
                        y: 30,
                        duration: 0.65,
                        ease: "power2.inOut",
                    },
                    0.28,
                );
            }

            console.log(`[HERO DEBUG ${debugId}] duração total da saída:`, exitTimeline.duration());

            // ========================================================
            // SCROLLTRIGGER
            // ========================================================

            const scrollTrigger = ScrollTrigger.create({
                trigger: hero,

                start: "bottom bottom",
                end: "bottom top",

                scrub: 1,

                invalidateOnRefresh: true,

                animation: exitTimeline,

                markers: false,

                onEnter: (self) => {
                    console.log(`%c[HERO DEBUG ${debugId}] 🔴 SAÍDA onEnter`, "color:#f44336;font-weight:bold");

                    console.log(`[HERO DEBUG ${debugId}] progress:`, self.progress);

                    console.log(`[HERO DEBUG ${debugId}] scrollY:`, window.scrollY);
                },

                onUpdate: (self) => {
                    const roundedProgress = Math.round(self.progress * 20) / 20;

                    if (scrollTrigger._lastDebugProgress !== roundedProgress) {
                        scrollTrigger._lastDebugProgress = roundedProgress;

                        console.log(`%c[HERO DEBUG ${debugId}] 🔄 SAÍDA onUpdate`, "color:#ff5722;font-weight:bold");

                        console.log(`[HERO DEBUG ${debugId}] progress:`, roundedProgress);

                        console.log(`[HERO DEBUG ${debugId}] scrollY:`, window.scrollY);

                        console.log(`[HERO DEBUG ${debugId}] start:`, self.start);

                        console.log(`[HERO DEBUG ${debugId}] end:`, self.end);
                    }
                },

                onLeave: (self) => {
                    console.log(`%c[HERO DEBUG ${debugId}] 🔴 SAÍDA onLeave`, "color:#f44336;font-weight:bold");

                    console.log(`[HERO DEBUG ${debugId}] progress:`, self.progress);

                    console.log(`[HERO DEBUG ${debugId}] scrollY:`, window.scrollY);
                },

                onEnterBack: (self) => {
                    console.log(`%c[HERO DEBUG ${debugId}] 🔵 SAÍDA onEnterBack`, "color:#2196f3;font-weight:bold");

                    console.log(`[HERO DEBUG ${debugId}] progress:`, self.progress);

                    console.log(`[HERO DEBUG ${debugId}] scrollY:`, window.scrollY);
                },

                onLeaveBack: (self) => {
                    console.log(`%c[HERO DEBUG ${debugId}] 🟢 SAÍDA onLeaveBack`, "color:#4caf50;font-weight:bold");

                    console.log(`[HERO DEBUG ${debugId}] progress:`, self.progress);

                    console.log(`[HERO DEBUG ${debugId}] scrollY:`, window.scrollY);
                },
            });

            console.log(`%c[HERO DEBUG ${debugId}] ✅ ScrollTrigger de SAÍDA criado`, "color:#8bc34a;font-weight:bold");

            console.log(`[HERO DEBUG ${debugId}] trigger:`, scrollTrigger.trigger);

            console.log(`[HERO DEBUG ${debugId}] start:`, scrollTrigger.start);

            console.log(`[HERO DEBUG ${debugId}] end:`, scrollTrigger.end);

            console.log(`[HERO DEBUG ${debugId}] progress inicial:`, scrollTrigger.progress);

            // ========================================================
            // PRIMEIRO REFRESH
            // ========================================================

            requestAnimationFrame(() => {
                console.log(`%c[HERO DEBUG ${debugId}] 🔄 ScrollTrigger.refresh()`, "color:#00bcd4;font-weight:bold");

                console.log(`[HERO DEBUG ${debugId}] scrollY antes do refresh:`, window.scrollY);

                ScrollTrigger.refresh();

                console.log(`[HERO DEBUG ${debugId}] scrollY depois do refresh:`, window.scrollY);

                console.log(`[HERO DEBUG ${debugId}] progress depois do refresh:`, scrollTrigger.progress);

                console.log(`[HERO DEBUG ${debugId}] start depois do refresh:`, scrollTrigger.start);

                console.log(`[HERO DEBUG ${debugId}] end depois do refresh:`, scrollTrigger.end);
            });

            // ========================================================
            // CLEANUP
            // ========================================================

            return () => {
                console.log(`%c[HERO DEBUG ${debugId}] 🧹 cleanup SAÍDA`, "color:#9c27b0;font-weight:bold");

                console.log(`[HERO DEBUG ${debugId}] progress no cleanup:`, scrollTrigger.progress);

                scrollTrigger.kill();

                exitTimeline.kill();
            };
        }, hero);

        return () => {
            ctx.revert();
        };
    }, [isReducedExperience]);

    // ============================================================
    // RENDER
    // ============================================================

    return (
        <section
            ref={heroRef}
            className={`
                hero-desktop
                relative
                z-0
                h-screen
                w-full
                overflow-hidden

                ${isReducedExperience ? "bg-[#0d0d0d]" : ""}
            `}
        >
            {/* =====================================================
                DOT FIELD
                SOMENTE NA EXPERIÊNCIA COMPLETA
            ====================================================== */}

            {!isReducedExperience && (
                <div
                    ref={heroDotFieldRef}
                    data-hero-element="dotfield"
                    aria-hidden="true"
                    className="
                        pointer-events-none
                        absolute
                        inset-0
                        z-0
                        overflow-hidden
                    "
                >
                    <DotField dotRadius={1} dotSpacing={18} cursorRadius={350} bulgeOnly={true} bulgeStrength={35} glowRadius={180} sparkle={false} waveAmplitude={0} gradientFrom="#b37a07" gradientTo="#cf8e0c" glowColor="#0D0B09" frozen={dotFieldFrozen} />
                </div>
            )}

            {/* =====================================================
                CONTEÚDO
            ====================================================== */}

            <div
                className="
                    relative
                    z-10
                    flex
                    h-full
                    w-full
                    items-center
                    justify-center
                    overflow-hidden
                "
            >
                {/* =================================================
                    LOGO
                ================================================== */}

                <div
                    className="
                        absolute
                        left-8
                        top-8
                        z-40

                        flex
                        items-center
                        gap-5

                        lg:left-18
                        lg:top-10
                        lg:gap-12
                    "
                >
                    <div
                        ref={logoRef}
                        className="
                    "
                    >
                        <div
                            className="
                            h-10
                            w-10

                            lg:h-11
                            lg:w-11
                        "
                        >
                            <img
                                src="/logo.svg"
                                alt="Kleber Dev"
                                className="
                                h-full
                                w-full
                            "
                            />
                        </div>
                    </div>
                    <ExperienceDropdown experienceMode={experienceMode} />
                </div>

                {/* =================================================
                    NAVBAR
                ================================================== */}

                <nav
                    ref={navRef}
                    aria-label="Navegação principal"
                    className="
        absolute
        right-8
        top-8
        z-40
        flex
        items-center
        gap-5

        lg:right-17
        lg:top-10
        lg:gap-7
    "
                >
                    {items.map((item) => {
                        const isActive = activeHref === item.href;

                        return (
                            <MagneticLink
                                key={item.href}
                                href={item.href}
                                onNavigate={onNavigate}
                                className="
                                    font-space
                                    text-[9px]
                                    uppercase
                                    tracking-[0.12em]

                                    lg:text-[10px]
                                "
                                isActive={isActive}
                            >
                                {item.label}
                            </MagneticLink>
                        );
                    })}

                    {/* =================================================
        EXPERIENCE
    ================================================== */}
                </nav>

                {/* =================================================
                    FOTO CENTRAL
                ================================================== */}

                <div
                    ref={heroVisualRef}
                    data-hero-element="visual"
                    className="
                        absolute
                        left-1/2
                        top-1/2
                        z-10

                        h-[122vh]
                        w-[420px]

                        -translate-x-1/2
                        -translate-y-1/2

                        overflow-hidden

                        lg:w-[440px]
                        xl:w-[970px]
                    "
                >
                    <img
                        src="/euNv.png"
                        alt="Kleber Dev"
                        className="
                            h-full
                            w-full
                            object-cover
                            object-top
                        "
                    />

                    <div
                        aria-hidden="true"
                        className="
                            pointer-events-none
                            absolute
                            inset-x-0
                            bottom-0
                            h-[40%]

                            bg-gradient-to-t
                            from-obsidian
                            via-obsidian/20
                            to-transparent
                        "
                    />
                </div>

                {/* =================================================
                    MARQUEE
                ================================================== */}

                <div
                    ref={heroTitleRef}
                    data-hero-element="title"
                    aria-hidden="true"
                    className="
                        pointer-events-none
                        absolute
                        left-85
                        bottom-[-4%]
                        z-20

                        w-full

                        overflow-hidden
                        select-none
                    "
                >
                    <div className="marquee-contentHero">
                        <span className="font-bebas">KLEBER DEV</span>
                    </div>
                </div>

                {/* =================================================
                    BLOCO ESQUERDO
                ================================================== */}

                <div
                    ref={locationRef}
                    className="
                        absolute
                        left-0
                        top-83
                        z-30

                        hidden

                        -translate-y-1/2

                        lg:flex
                    "
                >
                    <div
                        className="
                            flex
                            items-center

                            rounded-r-full

                            border
                            border-graphite

                            bg-carbon

                            py-3
                            pl-8
                            pr-3
                        "
                    >
                        <div
                            className="
                                flex
                                flex-col
                                gap-1
                            "
                        >
                            <span
                                className="
                                    font-bebas
                                    text-[14px]
                                    uppercase
                                    tracking-[0.22em]
                                    text-steel/50
                                "
                            >
                                Localização
                            </span>

                            <span
                                className="
                                    font-space
                                    text-xl
                                    font-medium
                                    text-ivory
                                "
                            >
                                Brasil
                            </span>
                        </div>

                        <div
                            className="
                                ml-6
                                flex
                                h-12
                                w-12
                                items-center
                                justify-center

                                rounded-full

                                border
                                border-graphite

                                bg-obsidian

                                text-bronze
                            "
                        >
                            <span className="text-lg">◉</span>
                        </div>
                    </div>
                </div>

                {/* =================================================
                    BLOCO DIREITO
                ================================================== */}

                <div
                    ref={heroTextRef}
                    data-hero-element="text"
                    className="
                        absolute
                        right-[7%]
                        top-78
                        z-30

                        hidden
                        w-[300px]

                        -translate-y-1/2

                        lg:flex
                        lg:flex-col

                        xl:right-[0%]
                        xl:w-[340px]
                    "
                >
                    <div
                        className="
                            mb-10
                            flex
                            justify-start
                        "
                    >
                        <ArrowDownRight
                            data-hero-element="arrow"
                            className="
                                h-8
                                w-8

                                stroke-[1.8px]

                                text-ivory/80
                            "
                            style={{
                                transformOrigin: "center center",
                            }}
                        />
                    </div>

                    <div
                        className="
                            flex
                            flex-col
                        "
                    >
                        <h2
                            className="
                                font-space
                                text-4xl
                                font-medium
                                leading-[0.95]
                                tracking-[-0.04em]

                                text-ivory

                                lg:text-5xl
                                xl:text-6xl
                            "
                        >
                            Software
                            <br />
                            Developer
                        </h2>

                        <p
                            className="
                                mt-5

                                max-w-[280px]

                                text-sm
                                leading-6

                                text-steel/60
                            "
                        >
                            Frontend · Backend · Fullstack
                        </p>
                    </div>
                </div>

                {/* =================================================
                    SOCIALS
                ================================================== */}

                <div
                    ref={socialsRef}
                    className="
                        absolute
                        bottom-8
                        left-8
                        z-40

                        lg:bottom-10
                        lg:left-10
                    "
                >
                    <Socials />
                </div>
            </div>
        </section>
    );
}

export default HeroDesktop;

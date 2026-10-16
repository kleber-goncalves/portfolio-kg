import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import ExperienceDropdown from "./ExperienceDropdown";

import Socials from "../components/Socials";
import DotField from "../components/DotField";

import { ArrowDownRight } from "lucide-react";

import MagneticLink from "../components/MagneticNavLink";

import "../styles/looptextHero.css";
import "../styles/heroParallax.css";
import GlobeIcon from "./GlobeIcon";
import OptimizedImage from "./OptimizedImage";

gsap.registerPlugin(ScrollTrigger);

function HeroDesktop({ items, dotFieldFrozen = false, onNavigate, onReady, experienceMode = "full" }) {
    useLayoutEffect(() => {
        onReady?.("desktop", { gsap, ScrollTrigger });
    }, [onReady]);
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
        let initialFrameId = null;
        let settledFrameId = null;

        const updateActiveSection = () => {
            // No topo real da página, o Hero é sempre a seção ativa.
            // Isso evita que a sobreposição temporária do Stack durante
            // a inicialização do GSAP marque o link errado.
            const heroItem = items.find((item) => item.href === "#hero");

            if (window.scrollY <= 1 && heroItem) {
                setActiveHref(heroItem.href);
                return;
            }

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

        // Aguarda dois frames para que os efeitos de layout do React,
        // as transformações iniciais do GSAP e o pin do ScrollTrigger
        // tenham aplicado suas posições antes da medição.
        const scheduleActiveSectionUpdate = () => {
            if (initialFrameId !== null) {
                cancelAnimationFrame(initialFrameId);
            }

            if (settledFrameId !== null) {
                cancelAnimationFrame(settledFrameId);
            }

            initialFrameId = requestAnimationFrame(() => {
                initialFrameId = null;

                settledFrameId = requestAnimationFrame(() => {
                    settledFrameId = null;
                    updateActiveSection();
                });
            });
        };

        scheduleActiveSectionUpdate();

        window.addEventListener("scroll", updateActiveSection, {
            passive: true,
        });

        window.addEventListener("resize", scheduleActiveSectionUpdate);
        window.addEventListener("pageshow", scheduleActiveSectionUpdate);

        // ScrollTrigger pode alterar o layout ao criar ou recalcular o pin.
        // Revalidamos após o refresh, sem forçar um refresh novo.
        ScrollTrigger.addEventListener("refresh", scheduleActiveSectionUpdate);

        return () => {
            if (initialFrameId !== null) {
                cancelAnimationFrame(initialFrameId);
            }

            if (settledFrameId !== null) {
                cancelAnimationFrame(settledFrameId);
            }

            window.removeEventListener("scroll", updateActiveSection);
            window.removeEventListener("resize", scheduleActiveSectionUpdate);
            window.removeEventListener("pageshow", scheduleActiveSectionUpdate);

            ScrollTrigger.removeEventListener("refresh", scheduleActiveSectionUpdate);
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

            const elements = [logo, nav, visual, title, location, text, socials].filter(Boolean);

            if (!elements.length) {
            return;
            }

            // ========================================================
            // ESTADO VISÍVEL
            // ========================================================

            const setVisibleState = () => {
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

                // ====================================================
                // SE O SCROLL FOI RESTAURADO
                // ====================================================

                if (currentScroll > 50) {
                    setVisibleState();

                    return null;
                }

                // ====================================================
                // SE O HERO NÃO ESTÁ NO TOPO
                // ====================================================

                if (heroTop < -50) {
                    setVisibleState();

                    return null;
                }

                // ====================================================
                // ENTRADA
                // ====================================================

                // ====================================================
                // ESTADO INICIAL
                // ====================================================

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

                return () => {
                    timeline.kill();
                };
            };

            // ========================================================
            // OBSERVAÇÃO DO SCROLL
            // ========================================================
// ========================================================
            // RESTAURAÇÃO DO SCROLL
            // ========================================================

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

                    animationCleanup = initializeEntry();

                    return;
                }

                // ====================================================
                // LIMITE DE SEGURANÇA
                // ====================================================

                if (frameCount >= MAX_FRAMES) {

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

                if (frameId !== null) {
                    cancelAnimationFrame(frameId);
                }
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

        // ========================================================
        // FULL
        // ========================================================

        if (!isReducedExperience) {
            return;
        }

        const hero = heroRef.current;

        if (!hero) {
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
});

            // ========================================================
            // PRIMEIRO REFRESH
            // ========================================================

            requestAnimationFrame(() => {

                ScrollTrigger.refresh();

            });

            // ========================================================
            // CLEANUP
            // ========================================================

            return () => {
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

                        c-lg:left-18
                        c-lg:top-10
                        c-lg:gap-12
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

                            c-lg:h-11
                            c-lg:w-11
                        "
                        >
                            <OptimizedImage
                                src="/logo.svg"
                                alt="Kleber Dev"
                                width={44}
                                height={44}
                                loading="eager"
                                fetchPriority="high"
                                wrapperClassName="h-full w-full"
                                className="object-contain"
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

        c-lg:right-17
        c-lg:top-10
        c-lg:gap-7
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

                                    c-lg:text-[10px]
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

                        c-lg:w-[440px]
                        d-xl:w-[970px]
                    "
                >
                    <OptimizedImage
                        src="/euNv.png"
                        alt="Retrato de Kleber Gonçalves"
                        sizes="(min-width: 1280px) 970px, (min-width: 1024px) 440px, 420px"
                        loading="eager"
                        fetchPriority="high"
                        wrapperClassName="h-full w-full"
                        className="
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

                        c-lg:flex
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
                                    text-steel
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
        h-22
        w-22
        items-center
        justify-center
        overflow-hidden
        rounded-full
        border
        border-graphite
        bg-obsidian
    "
                        >
                            <GlobeIcon />
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

                        c-lg:flex
                        c-lg:flex-col

                        d-xl:right-[0%]
                        d-xl:w-[340px]
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
                        <h1
                            className="
                                font-space
                                text-4xl
                                font-medium
                                leading-[0.95]
                                tracking-[-0.04em]

                                text-ivory

                                c-lg:text-5xl
                                d-xl:text-6xl
                            "
                        >
                            Software
                            <br />
                            Developer
                        </h1>

                        <p
                            className="
                                mt-5

                                max-w-[280px]

                                text-sm
                                leading-6

                                text-steel
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

                        c-lg:bottom-10
                        c-lg:left-10
                    "
                >
                    <Socials />
                </div>
            </div>
        </section>
    );
}

export default HeroDesktop;

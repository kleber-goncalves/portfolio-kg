import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

import Socials from "../components/Socials";
import DotField from "../components/DotField";

import { ArrowDownRight } from "lucide-react";

import "../styles/looptextHero.css";
import "../styles/heroParallax.css";

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

    // ============================================================
    // MODO DE EXPERIÊNCIA
    // ============================================================

    const isReducedExperience = experienceMode === "reduced";

    // ============================================================
    // ANIMAÇÃO DE ENTRADA
    // ============================================================

    useLayoutEffect(() => {
        const hero = heroRef.current;

        if (!hero) return;

        const ctx = gsap.context(() => {
            const title = heroTitleRef.current;
            const text = heroTextRef.current;
            const visual = heroVisualRef.current;

            const logo = logoRef.current;
            const nav = navRef.current;
            const location = locationRef.current;
            const socials = socialsRef.current;

            /*
            ========================================================
            ELEMENTOS
            ========================================================
            */

            const elements = [logo, nav, visual, title, location, text, socials].filter(Boolean);

            if (!elements.length) return;

            /*
            ========================================================
            ESTADO INICIAL
            ========================================================

            Tudo começa ligeiramente abaixo da posição final.

            O movimento é pequeno propositalmente.
            A ideia é parecer uma interface refinada entrando,
            e não uma animação chamativa.
            */

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

            /*
            ========================================================
            TIMELINE
            ========================================================

            A animação é executada apenas uma vez.

            Não usa ScrollTrigger.
            Não usa loop.
            Não usa mouse tracking.

            Portanto continua leve mesmo no modo reduzido.
            */

            const timeline = gsap.timeline({
                defaults: {
                    ease: "power3.out",
                },
            });

            /*
            ========================================================
            LOGO
            ========================================================
            */

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

            /*
            ========================================================
            NAVBAR
            ========================================================
            */

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

            /*
            ========================================================
            FOTO CENTRAL
            ========================================================
            */

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

            /*
            ========================================================
            MARQUEE
            ========================================================
            */

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

            /*
            ========================================================
            LOCALIZAÇÃO
            ========================================================
            */

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

            /*
            ========================================================
            BLOCO SOFTWARE DEVELOPER
            ========================================================
            */

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

            /*
            ========================================================
            SOCIALS
            ========================================================
            */

            if (socials) {
                timeline.to(
                    socials,
                    {
                        opacity: 1,
                        y: 0,

                        duration: 0.75,

                        ease: "power3.out",
                    },
                    0.68,
                );
            }
        }, hero);

        return () => ctx.revert();
    }, []);

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

                ${isReducedExperience ? "bg-[#0D0B09]" : ""}
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
                    ref={logoRef}
                    className="
                        absolute
                        left-8
                        top-8
                        z-40

                        lg:left-18
                        lg:top-10
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

                {/* =================================================
                    NAVBAR NORMAL
                    SOMENTE NO HERO
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
                    {items.map((item) => (
                        <a
                            key={item.href}
                            href={item.href}
                            onClick={(event) => {
                                event.preventDefault();

                                onNavigate?.(item.href);
                            }}
                            className="
                                group
                                flex
                                items-center
                                gap-2

                                font-space
                                text-[9px]
                                uppercase
                                tracking-[0.12em]

                                text-steel

                                transition-colors
                                duration-300

                                hover:text-bronze

                                lg:text-[10px]
                            "
                        >
                            <span>{item.label}</span>
                        </a>
                    ))}
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

                                stroke-[1]

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

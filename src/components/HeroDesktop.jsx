import { useRef } from "react";

import Socials from "../components/Socials";
import DotField from "../components/DotField";

import { ArrowDownRight } from "lucide-react";

import "../styles/looptextHero.css";
import "../styles/heroParallax.css";

function HeroDesktop({ items }) {
    const heroRef = useRef(null);

    const heroTitleRef = useRef(null);
    const heroTextRef = useRef(null);
    const heroVisualRef = useRef(null);

    const heroDotFieldRef = useRef(null);

    return (
        <section
            ref={heroRef}
            className="
                hero-desktop
                relative
                z-0
                w-full
                h-screen
                overflow-hidden
            "
        >
            {/* =====================================================
                DOT FIELD
            ====================================================== */}

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
                <DotField dotRadius={1} dotSpacing={18} cursorRadius={350} bulgeOnly={true} bulgeStrength={35} glowRadius={180} sparkle={false} waveAmplitude={0} gradientFrom="#0d0d0d" gradientTo="#0d0d0d" glowColor="#0D0B09" />
            </div>

            {/* =====================================================
                CONTEÚDO DO HERO
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
                        <img src="/logo.svg" alt="Kleber Dev" className="h-full w-full" />
                    </div>
                </div>

                {/* =================================================
                    NAVEGAÇÃO
                ================================================== */}

                <nav
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

                    {/* =================================================
                        GRADIENTE INFERIOR
                    ================================================== */}

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
                    MARQUEE — NOME
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
                    {/* =================================================
                        SETA
                    ================================================== */}

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

                    {/* =================================================
                        CARGO
                    ================================================== */}

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

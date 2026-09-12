import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function MinhaTrajetoria({
    titulo = "Evolução",
    subtitulo = "Minha Trajetória",
    descricao = "Aprendizado, prática e evolução contínua no desenvolvimento de software.",
    eventos = [],
}) {
    const sectionRef = useRef(null);
    const timelineRef = useRef(null);

    // ============================================================
    // CABEÇALHO
    // ============================================================

    const headerRef = useRef(null);
    const subtitleRef = useRef(null);
    const titleRef = useRef(null);
    const descriptionRef = useRef(null);

    // ============================================================
    // LINHAS
    // ============================================================

    const lineRef = useRef(null);
    const lineBaseRef = useRef(null);

    const mobileLineRef = useRef(null);
    const mobileLineBaseRef = useRef(null);

    // ============================================================
    // DESKTOP
    // ============================================================

    const desktopEventsRef = useRef([]);
    const desktopDotsRef = useRef([]);

    // ============================================================
    // MOBILE
    // ============================================================

    const mobileEventsRef = useRef([]);
    const mobileDotsRef = useRef([]);

    /*
    ============================================================
    ANIMAÇÃO DE ENTRADA — CABEÇALHO
    ============================================================
    */

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const subtitle = subtitleRef.current;
            const title = titleRef.current;
            const description = descriptionRef.current;

            if (!subtitle || !title || !description) return;

            /*
            ====================================================
            ESTADO INICIAL
            ====================================================
            */

            gsap.set(subtitle, {
                opacity: 0,
                y: 75,
            });

            gsap.set(title, {
                opacity: 0,
                y: 70,
            });

            gsap.set(description, {
                opacity: 0,
                y: 65,
            });

            /*
            ====================================================
            TIMELINE DO CABEÇALHO
            ====================================================
            */

            const headerTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: headerRef.current,

                    start: "top 90%",
                    end: "top 65%",

                    scrub: 1,

                    markers: true,
                },
            });

            /*
            ====================================================
            SUBTÍTULO
            ====================================================
            */

            headerTimeline.to(
                subtitle,
                {
                    opacity: 1,
                    y: 0,

                    duration: 1,

                    ease: "none",
                },
                0
            );

            /*
            ====================================================
            TÍTULO
            ====================================================
            */

            headerTimeline.to(
                title,
                {
                    opacity: 1,
                    y: 0,

                    duration: 1,

                    ease: "none",
                },
                0.12
            );

            /*
            ====================================================
            DESCRIÇÃO
            ====================================================
            */

            headerTimeline.to(
                description,
                {
                    opacity: 1,
                    y: 0,

                    duration: 1,

                    ease: "none",
                },
                0.24
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    /*
    ============================================================
    CALCULA O TAMANHO DA LINHA DESKTOP
    ============================================================

    A linha termina exatamente no centro da última bolinha.
    */

    const updateDesktopLineHeight = () => {
        const line = lineRef.current;
        const lineBase = lineBaseRef.current;

        const dots = desktopDotsRef.current.filter(Boolean);

        if (!line || !lineBase || !dots.length) return;

        const lastDot = dots[dots.length - 1];

        const timelineRect =
            timelineRef.current?.getBoundingClientRect();

        const dotRect = lastDot.getBoundingClientRect();

        if (!timelineRect) return;

        const height =
            dotRect.top -
            timelineRect.top +
            dotRect.height / 2;

        gsap.set([line, lineBase], {
            height,
        });
    };

    /*
    ============================================================
    CALCULA O TAMANHO DA LINHA MOBILE
    ============================================================

    A linha também termina no centro da última bolinha.
    */

    const updateMobileLineHeight = () => {
        const line = mobileLineRef.current;
        const lineBase = mobileLineBaseRef.current;

        const dots = mobileDotsRef.current.filter(Boolean);

        if (!line || !lineBase || !dots.length) return;

        const lastDot = dots[dots.length - 1];

        const mobileContainer = lastDot.closest(
            "[data-mobile-timeline]"
        );

        if (!mobileContainer) return;

        const containerRect =
            mobileContainer.getBoundingClientRect();

        const dotRect = lastDot.getBoundingClientRect();

        const height =
            dotRect.top -
            containerRect.top +
            dotRect.height / 2;

        gsap.set([line, lineBase], {
            height,
        });
    };

    /*
    ============================================================
    ATUALIZA AS DUAS LINHAS
    ============================================================
    */

    const updateLineHeights = () => {
        updateDesktopLineHeight();
        updateMobileLineHeight();
    };

    /*
    ============================================================
    GSAP / SCROLLTRIGGER — TIMELINE
    ============================================================
    */

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const line = lineRef.current;

            const desktopEvents =
                desktopEventsRef.current.filter(Boolean);

            const desktopDots =
                desktopDotsRef.current.filter(Boolean);

            const mobileEvents =
                mobileEventsRef.current.filter(Boolean);

            const mobileDots =
                mobileDotsRef.current.filter(Boolean);

            if (!timelineRef.current) return;

            /*
            ====================================================
            CALCULA TAMANHO DAS LINHAS
            ====================================================
            */

            updateLineHeights();

            /*
            ====================================================
            ESTADO INICIAL — DESKTOP
            ====================================================
            */

            gsap.set(desktopEvents, {
                opacity: 0,
                y: 30,
            });

            gsap.set(desktopDots, {
                scale: 0,
                opacity: 0,
                transformOrigin: "center center",
            });

            /*
            ====================================================
            ESTADO INICIAL — MOBILE
            ====================================================
            */

            gsap.set(mobileEvents, {
                opacity: 0,
                y: 25,
            });

            gsap.set(mobileDots, {
                scale: 0,
                opacity: 0,
                transformOrigin: "center center",
            });

            /*
            ====================================================
            LINHA DESKTOP
            ====================================================
            */

            if (line) {
                gsap.set(line, {
                    scaleY: 0,
                    transformOrigin: "top center",
                });
            }

            /*
            ====================================================
            TIMELINE DESKTOP
            ====================================================
            */

            const desktopTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: timelineRef.current,

                    start: "top 78%",
                    end: "bottom 68%",

                    scrub: 1,

                    invalidateOnRefresh: true,

                    onRefresh: () => {
                        updateLineHeights();
                    },
                },
            });

            /*
            ====================================================
            CONFIGURAÇÃO DA ANIMAÇÃO
            ====================================================
            */

            const dotDuration = 0.18;

            /*
                O conteúdo começa depois do término
                da animação da bolinha.
            */

            const contentDelay = 0.001;

            /*
            ====================================================
            LINHA
            ====================================================
            */

            if (line) {
                desktopTimeline.to(
                    line,
                    {
                        scaleY: 1,
                        duration: 1.5,
                        ease: "none",
                    },
                    0
                );
            }

            /*
            ====================================================
            EVENTOS DESKTOP
            ====================================================
            */

            eventos.forEach((evento, index) => {
                const event =
                    desktopEventsRef.current[index];

                const dot =
                    desktopDotsRef.current[index];

                if (!event || !dot) return;

                const position = index * 0.42;

                /*
                ------------------------------------------------
                BOLINHA
                ------------------------------------------------
                */

                desktopTimeline.to(
                    dot,
                    {
                        scale: 1,
                        opacity: 1,

                        duration: dotDuration,

                        ease: "back.out(2)",
                    },
                    position
                );

                /*
                ------------------------------------------------
                CONTEÚDO
                ------------------------------------------------
                */

                desktopTimeline.to(
                    event,
                    {
                        opacity: 1,
                        y: 0,

                        duration: 0.35,

                        ease: "power2.out",
                    },
                    position +
                        dotDuration +
                        contentDelay
                );
            });

            /*
            ====================================================
            TIMELINE MOBILE
            ====================================================
            */

            const mobileTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: timelineRef.current,

                    start: "top 78%",
                    end: "bottom 68%",

                    scrub: 1,

                    invalidateOnRefresh: true,

                    onRefresh: () => {
                        updateLineHeights();
                    },
                },
            });

            /*
            ====================================================
            LINHA MOBILE
            ====================================================
            */

            if (mobileLineRef.current) {
                gsap.set(mobileLineRef.current, {
                    scaleY: 0,
                    transformOrigin: "top center",
                });

                mobileTimeline.to(
                    mobileLineRef.current,
                    {
                        scaleY: 1,
                        duration: 1.5,
                        ease: "none",
                    },
                    0
                );
            }

            /*
            ====================================================
            EVENTOS MOBILE
            ====================================================
            */

            eventos.forEach((evento, index) => {
                const event =
                    mobileEventsRef.current[index];

                const dot =
                    mobileDotsRef.current[index];

                if (!event || !dot) return;

                const position = index * 0.42;

                /*
                ------------------------------------------------
                BOLINHA
                ------------------------------------------------
                */

                mobileTimeline.to(
                    dot,
                    {
                        scale: 1,
                        opacity: 1,

                        duration: dotDuration,

                        ease: "back.out(2)",
                    },
                    position
                );

                /*
                ------------------------------------------------
                CONTEÚDO
                ------------------------------------------------
                */

                mobileTimeline.to(
                    event,
                    {
                        opacity: 1,
                        y: 0,

                        duration: 0.35,

                        ease: "power2.out",
                    },
                    position +
                        dotDuration +
                        contentDelay
                );
            });

            /*
            ====================================================
            PRIMEIRO REFRESH
            ====================================================
            */

            requestAnimationFrame(() => {
                updateLineHeights();
                ScrollTrigger.refresh();
            });

            /*
            ====================================================
            RESIZE
            ====================================================
            */

            const handleResize = () => {
                updateLineHeights();
                ScrollTrigger.refresh();
            };

            window.addEventListener(
                "resize",
                handleResize
            );

            /*
            ====================================================
            CLEANUP
            ====================================================
            */

            return () => {
                window.removeEventListener(
                    "resize",
                    handleResize
                );
            };
        }, sectionRef);

        return () => ctx.revert();
    }, [eventos]);

    /*
    ============================================================
    RENDER
    ============================================================
    */

    return (
        <section
            ref={sectionRef}
            className="
                flex
                w-full
                flex-col
                gap-14
                md:gap-20
            "
        >
            {/* ==================================================
                CABEÇALHO
            ================================================== */}

            <header
                ref={headerRef}
                className="
                    flex
                    w-full
                    flex-col
                    gap-3
                "
            >
                {/* IDENTIFICADOR */}

                <div
                    ref={subtitleRef}
                    className="
                        flex
                        items-center
                        gap-3
                    "
                >
                    <span
                        className="
                            h-2
                            w-2
                            shrink-0
                            rounded-full
                            bg-champagne
                        "
                    />

                    <p
                        className="
                            font-bebas
                            text-xs
                            uppercase
                            tracking-[0.2em]
                            text-steel
                            md:text-sm
                        "
                    >
                        {subtitulo}
                    </p>
                </div>

                {/* TÍTULO */}

                <h2
                    ref={titleRef}
                    className="
                        font-bold
                        bebas-neue-regular
                        text-5xl
                        uppercase
                        leading-none
                        tracking-tight
                        text-ivory
                        md:text-7xl
                    "
                >
                    {titulo}
                </h2>

                {/* DESCRIÇÃO */}

                <p
                    ref={descriptionRef}
                    className="
                        mt-2
                        max-w-xl
                        text-sm
                        leading-6
                        text-steel
                        md:text-sm
                        md:leading-7
                    "
                >
                    {descricao}
                </p>
            </header>

            {/* ==================================================
                TIMELINE
            ================================================== */}

            <div
                ref={timelineRef}
                className="
                    relative
                    w-full
                "
            >
                {/* ==================================================
                    DESKTOP
                ================================================== */}

                <div
                    className="
                        relative
                        hidden
                        w-full
                        md:block
                    "
                >
                    {/* ==================================================
                        LINHA BASE
                    ================================================== */}

                    <div
                        ref={lineBaseRef}
                        className="
                            pointer-events-none
                            absolute
                            left-1/2
                            top-0
                            z-0
                            w-px
                            -translate-x-1/2
                            bg-graphite
                        "
                    />

                    {/* ==================================================
                        LINHA ANIMADA
                    ================================================== */}

                    <div
                        ref={lineRef}
                        className="
                            pointer-events-none
                            absolute
                            left-1/2
                            top-0
                            z-[1]
                            w-px
                            -translate-x-1/2
                            bg-gradient-to-b
                            from-champagne
                            via-bronze
                            to-warm-bronze
                        "
                    />

                    {/* ==================================================
                        EVENTOS
                    ================================================== */}

                    <div
                        className="
                            relative
                            z-10
                            flex
                            w-full
                            flex-col
                        "
                    >
                        {eventos.map((evento, index) => {
                            const ladoEsquerdo =
                                index % 2 === 0;

                            return (
                                <div
                                    key={
                                        evento.id ??
                                        index
                                    }
                                    className="
                                        relative
                                        grid
                                        min-h-[230px]
                                        w-full
                                        grid-cols-[1fr_80px_1fr]
                                    "
                                >
                                    {/* ==================================================
                                        ESQUERDA
                                    ================================================== */}

                                    <div
                                        className={`
                                            flex
                                            w-full
                                            ${
                                                ladoEsquerdo
                                                    ? "justify-end"
                                                    : "pointer-events-none"
                                            }
                                        `}
                                    >
                                        {ladoEsquerdo && (
                                            <div
                                                ref={(el) => {
                                                    desktopEventsRef.current[
                                                        index
                                                    ] = el;
                                                }}
                                                className="
                                                    w-full
                                                    max-w-xl
                                                    pr-10
                                                    text-right
                                                "
                                            >
                                                <TimelineContent
                                                    evento={evento}
                                                    align="right"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* ==================================================
                                        CENTRO
                                    ================================================== */}

                                    <div
                                        className="
                                            relative
                                            flex
                                            justify-center
                                        "
                                    >
                                        {/* PONTO */}

                                        <div
                                            ref={(el) => {
                                                desktopDotsRef.current[
                                                    index
                                                ] = el;
                                            }}
                                            className="
                                                absolute
                                                top-1
                                                z-20
                                                flex
                                                h-4
                                                w-4
                                                items-center
                                                justify-center
                                                rounded-full
                                                border
                                                border-champagne
                                                bg-obsidian
                                            "
                                        >
                                            <span
                                                className="
                                                    h-1.5
                                                    w-1.5
                                                    rounded-full
                                                    bg-bronze
                                                "
                                            />
                                        </div>

                                        {/* EVENTO ATUAL */}

                                        {evento.atual && (
                                            <>
                                                <span
                                                    className="
                                                        pointer-events-none
                                                        absolute
                                                        top-[-2px]
                                                        z-[15]
                                                        h-5
                                                        w-5
                                                        rounded-full
                                                        bg-bronze/20
                                                        blur-md
                                                    "
                                                />

                                                <span
                                                    className="
                                                        pointer-events-none
                                                        absolute
                                                        top-1
                                                        z-[14]
                                                        h-4
                                                        w-4
                                                        animate-ping
                                                        rounded-full
                                                        bg-bronze
                                                    "
                                                />
                                            </>
                                        )}
                                    </div>

                                    {/* ==================================================
                                        DIREITA
                                    ================================================== */}

                                    <div
                                        className={`
                                            flex
                                            w-full
                                            ${
                                                !ladoEsquerdo
                                                    ? "justify-start"
                                                    : "pointer-events-none"
                                            }
                                        `}
                                    >
                                        {!ladoEsquerdo && (
                                            <div
                                                ref={(el) => {
                                                    desktopEventsRef.current[
                                                        index
                                                    ] = el;
                                                }}
                                                className="
                                                    w-full
                                                    max-w-xl
                                                    pl-10
                                                    text-left
                                                "
                                            >
                                                <TimelineContent
                                                    evento={evento}
                                                    align="left"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ==================================================
                    MOBILE
                ================================================== */}

                <div
                    data-mobile-timeline
                    className="
                        relative
                        w-full
                        md:hidden
                        ml-3
                    "
                >
                    {/* ==================================================
                        LINHA BASE
                    ================================================== */}

                    <div
                        ref={mobileLineBaseRef}
                        className="
                            pointer-events-none
                            absolute
                            left-[7px]
                            top-0
                            z-0
                            w-px
                            bg-graphite
                        "
                    />

                    {/* ==================================================
                        LINHA BRONZE
                    ================================================== */}

                    <div
                        ref={mobileLineRef}
                        className="
                            pointer-events-none
                            absolute
                            left-[7px]
                            top-0
                            z-[1]
                            w-px
                            bg-gradient-to-b
                            from-champagne
                            via-bronze
                            to-warm-bronze
                            opacity-70
                        "
                    />

                    {/* ==================================================
                        EVENTOS
                    ================================================== */}

                    <div
                        className="
                            relative
                            flex
                            w-full
                            flex-col
                        "
                    >
                        {eventos.map((evento, index) => (
                            <div
                                key={
                                    evento.id ??
                                    index
                                }
                                className={`
                                    relative
                                    pl-8
                                    ${
                                        index ===
                                        eventos.length - 1
                                            ? "pb-2"
                                            : "pb-16"
                                    }
                                `}
                            >
                                {/* ==================================================
                                    GLOW / PING
                                ================================================== */}

                                {evento.atual && (
                                    <span
                                        className="
                                            pointer-events-none
                                            absolute
                                            left-[0.1px]
                                            top-[4px]
                                            h-4
                                            w-4
                                            animate-ping
                                            rounded-full
                                            bg-bronze
                                        "
                                    />
                                )}

                                {/* ==================================================
                                    PONTO
                                ================================================== */}

                                <div
                                    ref={(el) => {
                                        mobileDotsRef.current[
                                            index
                                        ] = el;
                                    }}
                                    className="
                                        absolute
                                        left-0
                                        top-1
                                        z-10
                                        flex
                                        h-4
                                        w-4
                                        items-center
                                        justify-center
                                        rounded-full
                                        border
                                        border-champagne
                                        bg-obsidian
                                    "
                                >
                                    <span
                                        className="
                                            h-1.5
                                            w-1.5
                                            rounded-full
                                            bg-bronze
                                        "
                                    />
                                </div>

                                {/* ==================================================
                                    CONTEÚDO
                                ================================================== */}

                                <div
                                    ref={(el) => {
                                        mobileEventsRef.current[
                                            index
                                        ] = el;
                                    }}
                                    className="
                                        flex
                                        flex-col
                                    "
                                >
                                    <TimelineContent
                                        evento={evento}
                                        align="left"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

/*
================================================================
CONTEÚDO DO EVENTO
================================================================
*/

function TimelineContent({
    evento,
    align = "left",
}) {
    const isRight = align === "right";

    return (
        <div
            className={`
                flex
                flex-col
                ${
                    isRight
                        ? "items-end text-right"
                        : "items-start text-left"
                }
            `}
        >
            {/* ==================================================
                ANO + STATUS
            ================================================== */}

            <div
                className={`
                    mb-3
                    flex
                    items-center
                    gap-3
                    ${
                        isRight
                            ? "justify-end"
                            : "justify-start"
                    }
                `}
            >
                <span
                    className="
                        font-bebas
                        text-xl
                        tracking-[0.15em]
                        text-bronze
                    "
                >
                    {evento.ano}
                </span>

                {evento.atual && (
                    <span
                        className="
                            rounded-full
                            border
                            border-bronze/30
                            bg-bronze/5
                            px-2.5
                            py-1
                            font-bebas
                            text-[9px]
                            uppercase
                            tracking-[0.2em]
                            text-bronze
                        "
                    >
                        Atual
                    </span>
                )}
            </div>

            {/* ==================================================
                TÍTULO
            ================================================== */}

            <h3
                className="
                    max-w-lg
                    font-space
                    text-2xl
                    font-semibold
                    leading-[1.1]
                    tracking-tight
                    text-ivory
                    lg:text-3xl
                "
            >
                {evento.titulo}
            </h3>

            {/* ==================================================
                DESCRIÇÃO
            ================================================== */}

            <p
                className="
                    mt-3
                    max-w-md
                    text-sm
                    leading-6
                    text-steel
                "
            >
                {evento.descricao}
            </p>

            {/* ==================================================
                BADGES
            ================================================== */}

            {evento.badges?.length > 0 && (
                <div
                    className={`
                        mt-4
                        flex
                        flex-wrap
                        gap-2
                        ${
                            isRight
                                ? "justify-end"
                                : "justify-start"
                        }
                    `}
                >
                    {evento.badges.map((badge) => (
                        <span
                            key={badge}
                            className="
                                rounded-full
                                border
                                border-graphite
                                px-3
                                py-1
                                font-bebas
                                text-[10px]
                                uppercase
                                tracking-[0.15em]
                                text-steel
                            "
                        >
                            {badge}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

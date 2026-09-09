import { useRef, useEffect } from "react";
import { gsap } from "gsap";

// ============================================================
// FLOWING MENU
// ============================================================

function FlowingMenu({ items = [], speed = 18, textColor = "#F2F0EC", bgColor = "#0D0D0D", marqueeBgColor = "#F2F0EC", marqueeTextColor = "#0D0D0D", borderColor = "#242424" }) {
    return (
        <div
            className="h-full w-full overflow-hidden"
            style={{
                backgroundColor: bgColor,
            }}
        >
            <nav className="m-0 flex h-full flex-col p-0">
                {items.map((item, index) => (
                    <MenuItem key={index} {...item} speed={speed} textColor={textColor} marqueeBgColor={marqueeBgColor} marqueeTextColor={marqueeTextColor} borderColor={borderColor} isFirst={index === 0} />
                ))}
            </nav>
        </div>
    );
}

// ============================================================
// MENU ITEM
// ============================================================

function MenuItem({ text, logos = [], speed, textColor, marqueeBgColor, marqueeTextColor, borderColor, isFirst }) {
    const itemRef = useRef(null);
    const marqueeRef = useRef(null);
    const marqueeInnerRef = useRef(null);

    // Guarda SOMENTE a animação horizontal
    const animationRef = useRef(null);

    // ========================================================
    // LOOP HORIZONTAL
    // ========================================================

    useEffect(() => {
        if (!marqueeInnerRef.current) return;

        const setupMarquee = () => {
            if (!marqueeInnerRef.current) return;

            const marqueeContent = marqueeInnerRef.current.querySelector(".marquee-part");

            if (!marqueeContent) return;

            const contentWidth = marqueeContent.offsetWidth;

            if (!contentWidth) return;

            // Mata somente o loop horizontal anterior
            if (animationRef.current) {
                animationRef.current.kill();
            }

            // Garante que começa no início correto
            gsap.set(marqueeInnerRef.current, {
                x: 0,
            });

            // =================================================
            // LOOP INFINITO
            // =================================================
            const pixelsPerSecond = 50;

            const duration = contentWidth / pixelsPerSecond;

            animationRef.current = gsap.to(marqueeInnerRef.current, {
                x: -contentWidth,
                duration,
                ease: "none",
                repeat: -1,
            });
        };

        // Pequeno delay para garantir que o DOM
        // já tenha calculado as larguras
        const timer = setTimeout(() => {
            setupMarquee();
        }, 100);

        window.addEventListener("resize", setupMarquee);

        return () => {
            clearTimeout(timer);
            window.removeEventListener("resize", setupMarquee);

            if (animationRef.current) {
                animationRef.current.kill();
                animationRef.current = null;
            }
        };
    }, [logos, speed]);

    // ========================================================
    // ENTRADA DO MARQUEE
    // ========================================================

    const handleMouseEnter = () => {
        if (!marqueeRef.current || !marqueeInnerRef.current) {
            return;
        }

        /*
            IMPORTANTE:

            NÃO usamos:

            gsap.killTweensOf(marqueeInnerRef.current)

            porque isso mataria o loop horizontal.

            Aqui matamos SOMENTE a animação vertical.
        */

        gsap.killTweensOf(marqueeRef.current, "y");
        gsap.killTweensOf(marqueeInnerRef.current, "y");

        gsap.timeline({
            defaults: {
                duration: 0.6,
                ease: "expo.out",
            },
        })
            // O painel entra de baixo
            .set(marqueeRef.current, {
                y: "101%",
            })

            // O conteúdo entra de cima
            .set(marqueeInnerRef.current, {
                y: "-101%",
            })

            // Os dois encontram o centro
            .to(
                marqueeRef.current,
                {
                    y: "0%",
                },
                0,
            )
            .to(
                marqueeInnerRef.current,
                {
                    y: "0%",
                },
                0,
            );
    };

    // ========================================================
    // SAÍDA DO MARQUEE
    // ========================================================

    const handleMouseLeave = () => {
        if (!marqueeRef.current || !marqueeInnerRef.current) {
            return;
        }

        /*
            Novamente:

            SOMENTE o eixo Y é afetado.

            O X continua rodando infinitamente.
        */

        gsap.killTweensOf(marqueeRef.current, "y");
        gsap.killTweensOf(marqueeInnerRef.current, "y");

        gsap.timeline({
            defaults: {
                duration: 0.55,
                ease: "expo.inOut",
            },
        })
            .to(
                marqueeRef.current,
                {
                    y: "-101%",
                },
                0,
            )
            .to(
                marqueeInnerRef.current,
                {
                    y: "101%",
                },
                0,
            );
    };

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div
            ref={itemRef}
            className="
                group
                relative
                flex-1
                overflow-hidden
                text-center
            "
            style={{
                borderTop: isFirst ? "none" : `1px solid ${borderColor}`,
            }}
        >
            {/* =================================================
                TEXTO NORMAL
            ================================================== */}

            <div
                className="
                    relative
                    flex
                    h-full
                    w-full
                    items-center
                    justify-between
                    px-5

                    md:px-26
                "
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <span
                    className="
                        font-bebas
                        text-3xl
                        uppercase
                        tracking-[0.08em]

                        transition-transform
                        duration-500
                        ease-out

                        group-hover:translate-x-2
                    "
                    style={{
                        color: textColor,
                    }}
                >
                    {text}
                </span>

                {/* =================================================
                    INDICADOR
                ================================================== */}

                <span
                    className="
                        font-space
                        text-xs
                        tracking-[0.2em]

                        text-steel/40

                        transition-all
                        duration-500

                        group-hover:translate-x-2
                        group-hover:text-bronze
                    "
                >
                    EXPLORE
                </span>
            </div>

            {/* =================================================
                MARQUEE
            ================================================== */}

            <div
                ref={marqueeRef}
                className="
                    pointer-events-none
                    absolute
                    left-0
                    top-0

                    h-full
                    w-full

                    translate-y-[101%]

                    overflow-hidden
                "
                style={{
                    backgroundColor: marqueeBgColor,
                }}
            >
                <div
                    ref={marqueeInnerRef}
                    className="
                        flex
                        h-full
                        w-max
                        items-center
                    "
                >
                    {/* =================================================
                        REPETIÇÃO 01
                    ================================================== */}

                    <div
                        className="
                            marquee-part
                            flex
                            h-full
                            shrink-0
                            items-center
                        "
                        style={{
                            color: marqueeTextColor,
                        }}
                    >
                        {logos.map((logo, index) => (
                            <LogoItem key={`logo-1-${index}`} logo={logo} />
                        ))}
                    </div>

                    {/* =================================================
                        REPETIÇÃO 02
                    ================================================== */}

                    <div
                        className="
                            marquee-part
                            flex
                            h-full
                            shrink-0
                            items-center
                        "
                        style={{
                            color: marqueeTextColor,
                        }}
                    >
                        {logos.map((logo, index) => (
                            <LogoItem key={`logo-2-${index}`} logo={logo} />
                        ))}
                    </div>

                    {/* =================================================
                        REPETIÇÃO 03
                    ================================================== */}

                    <div
                        className="
                            marquee-part
                            flex
                            h-full
                            shrink-0
                            items-center
                        "
                        style={{
                            color: marqueeTextColor,
                        }}
                    >
                        {logos.map((logo, index) => (
                            <LogoItem key={`logo-3-${index}`} logo={logo} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================================
// LOGO ITEM
// ============================================================

function LogoItem({ logo }) {
    return (
        <div
            className="
                flex
                shrink-0
                items-center
                gap-12

                px-8

                md:px-5
            "
        >
            {/* =================================================
                LOGO
            ================================================== */}

            <div className="flex items-center gap-2">
                <div
                    className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center

                    md:h-12
                    md:w-12
                "
                >
                    {logo.node}
                </div>

                {/* =================================================
                NOME
            ================================================== */}

                <span
                    className="
                    whitespace-nowrap

                    font-space
                    text-base
                    font-medium

                    md:text-lg
                "
                >
                    {logo.title}
                </span>
            </div>

            {/* =================================================
                SEPARADOR
            ================================================== */}

            <span
                className="
                    
                    h-1
                    w-1
                    shrink-0

                    rounded-full

                    bg-current
                    opacity-40
                "
            />
        </div>
    );
}

export default FlowingMenu;

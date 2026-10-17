import {
    motion,
    useMotionValue,
    useSpring,
} from "motion/react";

function MagneticExternalLinkHover({
    href = "#",
    children,

    // ============================================================
    // CORES
    // ============================================================

    accent = "#A87852",

    borderColor = "#242424",
    hoverBorderColor = "#A87852",

    textColor = "#F2F0EC",
    hoverTextColor = "#0D0D0D",

    // ============================================================
    // MAGNETISMO
    // ============================================================

    magneticStrength = 0.2,

    // ============================================================
    // ESPAÇAMENTO
    // ============================================================

    px = "px-5",
    py = "py-3",

    // ============================================================
    // CLASSES EXTRAS
    // ============================================================

    className = "",

    // ============================================================
    // LINK
    // ============================================================

    target = "_blank",
    rel = "noopener noreferrer",

    // ============================================================
    // ÍCONE
    // ============================================================

    Icon,
}) {
    // ============================================================
    // MOVIMENTO MAGNÉTICO
    // ============================================================

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springX = useSpring(x, {
        stiffness: 230,
        damping: 12,
        mass: 1.1,
    });

    const springY = useSpring(y, {
        stiffness: 630,
        damping: 12,
        mass: 0.9,
    });

    // ============================================================
    // MOVIMENTO DO MOUSE
    // ============================================================

    const handleMouseMove = (event) => {
        const rect =
            event.currentTarget.getBoundingClientRect();

        const mouseX =
            event.clientX - rect.left;

        const mouseY =
            event.clientY - rect.top;

        const centerX =
            rect.width / 2;

        const centerY =
            rect.height / 2;

        x.set(
            (mouseX - centerX) *
                magneticStrength
        );

        y.set(
            (mouseY - centerY) *
                magneticStrength
        );
    };

    // ============================================================
    // SAÍDA DO MOUSE
    // ============================================================

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    // ============================================================
    // RENDER
    // ============================================================

    return (
        <motion.a
            href={href}
            target={target}
            rel={rel}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                x: springX,
                y: springY,

                "--border-color": borderColor,
                "--hover-border-color": hoverBorderColor,

                "--text-color": textColor,
                "--hover-text-color": hoverTextColor,

                "--accent-color": accent,
            }}
            className={`
                relative
                inline-flex
                items-center
                justify-center
                gap-2
                overflow-hidden

                rounded-sm

                border
                border-[var(--border-color)]

                ${px}
                ${py}

                text-xs
                font-medium
                uppercase
                tracking-[0.12em]

                transition-colors
                duration-300

                group-hover/preview:border-[var(--hover-border-color)]

                ${className}
            `}
        >
            {/* =====================================================
                PREENCHIMENTO
            ====================================================== */}

            <span
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    inset-[-5px]
                    z-0
                    rounded-sm

                    scale-0
                    opacity-0

                    transition-all
                    duration-500
                    ease-[cubic-bezier(0.16,1,0.3,1)]

                    group-hover/preview:scale-100
                    group-hover/preview:opacity-100
                "
                style={{
                    backgroundColor: "var(--accent-color)",
                }}
            />



            {/* =====================================================
                CONTEÚDO
            ====================================================== */}

            <motion.span
                className="
                    relative
                    z-10

                    inline-flex
                    items-center
                    gap-2

                    text-[var(--text-color)]
                "
                animate={{
                    y: 0,
                    letterSpacing: "0.12em",
                }}
                whileHover={{
                    y: -0.5,
                    letterSpacing: "0.14em",
                }}
                transition={{
                    y: {
                        type: "spring",
                        stiffness: 430,
                        damping: 18,
                        mass: 0.4,
                    },
                    letterSpacing: {
                        duration: 0.24,
                        ease: [0.16, 1, 0.3, 1],
                    },
                }}
            >
                {/* =================================================
                    TEXTO
                ================================================= */}

                <span
                    className="
                        transition-colors
                        duration-300

                        group-hover/preview:text-[var(--hover-text-color)]
                    "
                >
                    {children}
                </span>

                {/* =================================================
                    ÍCONE
                ================================================= */}

                {Icon && (
                    <motion.span
                        className="
            inline-flex
            items-center
            justify-center

            text-[var(--text-color)]

            transition-colors
            duration-300

            group-hover/preview:text-[var(--hover-text-color)]
        "
                        animate={{
                            x: 0,
                            y: 0,
                            scale: 1,
                        }}
                        whileHover={{
                            x: 2,
                            y: -2,
                            scale: 1.05,
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 420,
                            damping: 17,
                            mass: 0.35,
                        }}
                    >
                        <Icon
                            className="
                h-3.5
                w-3.5
            "
                        />
                    </motion.span>
                )}
            </motion.span>
        </motion.a>
    );
}

export default MagneticExternalLinkHover;

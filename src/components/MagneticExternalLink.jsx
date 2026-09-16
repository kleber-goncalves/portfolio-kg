import { motion, useMotionValue, useSpring } from "motion/react";

import { useState } from "react";

function MagneticExternalLink({
    href = "#",
    children,

    accent = "#A87852",
    borderColor = "#242424",
    textColor = "#F2F0EC",
    hoverTextColor = "#0D0D0D",

    magneticStrength = 0.2,

    px="px-5",
    py="py-3",

    className = "",

    target = "_blank",
    rel = "noopener noreferrer",

    Icon,
}) {
    // ============================================================
    // ESTADO
    // ============================================================

    const [isHovered, setIsHovered] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    /*
    ------------------------------------------------------------
    ESTADO VISUAL
    ------------------------------------------------------------

    Hover e focus possuem o mesmo tratamento visual.
    */

    const isInteractive = isHovered || isFocused;

    // ============================================================
    // MOVIMENTO MAGNÉTICO
    // ============================================================

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // ============================================================
    // SPRING X
    // ============================================================

    const springX = useSpring(x, {
        stiffness: 280,
        damping: 12,
        mass: 1.1,
    });

    // ============================================================
    // SPRING Y
    // ============================================================

    const springY = useSpring(y, {
        stiffness: 280,
        damping: 12,
        mass: 1.1,
    });

    // ============================================================
    // ORIGEM DO PREENCHIMENTO
    // ============================================================

    const originX = useMotionValue(0.5);
    const originY = useMotionValue(0.5);

    // ============================================================
    // ENTRADA DO MOUSE
    // ============================================================

    const handleMouseEnter = (event) => {
        const rect = event.currentTarget.getBoundingClientRect();

        const relativeX = (event.clientX - rect.left) / rect.width;

        const relativeY = (event.clientY - rect.top) / rect.height;

        originX.set(Math.min(1, Math.max(0, relativeX)));

        originY.set(Math.min(1, Math.max(0, relativeY)));

        setIsHovered(true);
    };

    // ============================================================
    // MOVIMENTO DO MOUSE
    // ============================================================

    const handleMouseMove = (event) => {
        const rect = event.currentTarget.getBoundingClientRect();

        const mouseX = event.clientX - rect.left;

        const mouseY = event.clientY - rect.top;

        const centerX = rect.width / 2;

        const centerY = rect.height / 2;

        // --------------------------------------------------------
        // MAGNETISMO
        // --------------------------------------------------------

        x.set((mouseX - centerX) * magneticStrength);

        y.set((mouseY - centerY) * magneticStrength);

        // --------------------------------------------------------
        // ORIGEM DO PREENCHIMENTO
        // --------------------------------------------------------

        const relativeX = (event.clientX - rect.left) / rect.width;

        const relativeY = (event.clientY - rect.top) / rect.height;

        originX.set(Math.min(1, Math.max(0, relativeX)));

        originY.set(Math.min(1, Math.max(0, relativeY)));
    };

    // ============================================================
    // SAÍDA DO MOUSE
    // ============================================================

    const handleMouseLeave = () => {
        setIsHovered(false);

        /*
        --------------------------------------------------------
        RETORNO MAGNÉTICO
        --------------------------------------------------------

        O spring faz o retorno suavemente.
        */

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
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={{
                x: springX,
                y: springY,
                borderColor,
            }}
            className={`
                group
                relative
                inline-flex
                items-center
                justify-center
                gap-2
                overflow-hidden
                rounded-sm
                border
               
                ${px}
                ${py}

                text-xs
                font-medium
                uppercase
                tracking-[0.12em]

                ${className}
            `}
        >
            {/* =================================================
                PREENCHIMENTO
            ================================================== */}

            <motion.span
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    inset-[-5px]
                    z-0
                    rounded-sm
                "
                style={{
                    backgroundColor: accent,

                    transformOrigin: `${originX.get() * 100}% ${originY.get() * 100}%`,
                }}
                initial={{
                    scale: 0,
                    opacity: 0,
                }}
                animate={{
                    scale: isInteractive ? 1 : 0,

                    opacity: isInteractive ? 1 : 0,
                }}
                transition={{
                    scale: {
                        type: "spring",
                        stiffness: 150,
                        damping: 22,
                        mass: 0.75,
                    },

                    opacity: {
                        duration: 0.25,
                        ease: [0.16, 1, 0.3, 1],
                    },
                }}
            />

            {/* =================================================
                BORDA
            ================================================== */}

            <motion.span
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    inset-0
                    z-[1]
                    rounded-sm
                    border
                "
                style={{
                    borderColor: accent,
                }}
                animate={{
                    opacity: isInteractive ? 1 : 0,
                }}
                transition={{
                    duration: 0.2,
                    ease: [0.16, 1, 0.3, 1],
                }}
            />

            {/* =================================================
                CONTEÚDO
            ================================================== */}

            <motion.span
                className="
                    relative
                    z-10
                    inline-flex
                    items-center
                    gap-2
                    
                "
                style={{
                    color: isInteractive ? hoverTextColor : textColor,
                }}
                animate={{
                    y: isInteractive ? -0.5 : 0,

                    letterSpacing: isInteractive ? "0.14em" : "0.12em",
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
                ================================================== */}

                <span>{children}</span>

                {/* =================================================
                    ÍCONE
                ================================================== */}

                {Icon && (
                    <motion.span
                        className="
                            inline-flex
                            items-center
                            justify-center
                        "
                        animate={{
                            x: isInteractive ? 2 : 0,

                            y: isInteractive ? -2 : 0,

                            scale: isInteractive ? 1.05 : 1,
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

export default MagneticExternalLink;

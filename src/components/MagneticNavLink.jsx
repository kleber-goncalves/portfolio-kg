import { motion, useMotionValue, useSpring } from "motion/react";

import { useState } from "react";

function MagneticLink({
    href = "#",
    children,
    onClick,
    onNavigate,

    accent = "#A87852",
    textColor = "#8B8B8B",
    hoverTextColor = "#0D0D0D",

    magneticStrength = 0.22,

    className = "",
}) {
    // ============================================================
    // ESTADO
    // ============================================================

    const [isHovered, setIsHovered] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const isActive = isHovered || isFocused;

    // ============================================================
    // MOVIMENTO MAGNÉTICO
    // ============================================================

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    /*
    ------------------------------------------------------------
    SPRING X
    ------------------------------------------------------------

    O damping mais baixo permite uma pequena "passada"
    quando o elemento retorna para sua posição.
    */

    const springX = useSpring(x, {
        stiffness: 650,
        damping: 18,
        mass: 0.45,
    });

    /*
    ------------------------------------------------------------
    SPRING Y
    ------------------------------------------------------------
    */

    const springY = useSpring(y, {
        stiffness: 600,
        damping: 18,
        mass: 0.45,
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
        IMPORTANTE
        --------------------------------------------------------

        Não usamos animação manual aqui.

        Apenas mandamos o destino para 0.

        O useSpring faz todo o retorno.
        */

        x.set(0);
        y.set(0);
    };

    // ============================================================
    // CLICK
    // ============================================================

    const handleClick = (event) => {
        if (onNavigate) {
            event.preventDefault();

            onNavigate(href);
        }

        onClick?.(event);
    };

    // ============================================================
    // RENDER
    // ============================================================

    return (
        <motion.a
            href={href}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={{
                x: springX,
                y: springY,
            }}
            className={`
                group
                relative
                flex
                items-center
                py-1
                px-2
                justify-center
                overflow-hidden

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
                    scale: isActive ? 1 : 0,
                    opacity: isActive ? 1 : 0,
                }}
                transition={{
                    scale: {
                        type: "spring",
                        stiffness: 300,
                        damping: 23,
                        mass: 0.65,
                    },

                    opacity: {
                        duration: 0.16,
                        ease: "easeOut",
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
                    inset-[-5px]
                    z-[1]

                    border
                "
                style={{
                    borderColor: accent,
                }}
                animate={{
                    opacity: isActive ? 1 : 0,
                }}
                transition={{
                    duration: 0.2,
                    ease: [0.16, 1, 0.3, 1],
                }}
            />

            {/* =================================================
                BRILHO
            ================================================== */}

            <motion.span
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    inset-0
                    z-[2]

                    bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_60%)]
                "
                animate={{
                    opacity: isActive ? 1 : 0,
                }}
                transition={{
                    duration: 0.25,
                    ease: [0.16, 1, 0.3, 1],
                }}
            />

            {/* =================================================
                TEXTO
            ================================================== */}

            <motion.span
                className="
                    relative
                    z-10
                    block
                "
                style={{
                    color: isActive ? hoverTextColor : textColor,
                }}
                animate={{
                    y: isActive ? -0.5 : 0,
                    letterSpacing: isActive ? "0.14em" : "0.12em",
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
                {children}
            </motion.span>
        </motion.a>
    );
}

export default MagneticLink;

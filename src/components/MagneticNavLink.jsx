import { motion, useMotionValue, useSpring } from "motion/react";
import { Link } from "react-router-dom";
import { useState } from "react";

const MotionLink = motion.create(Link);

function MagneticLink({
    href = "#",
    children,
    onClick,
    onNavigate,

    // ============================================================
    // ACTIVE
    // ============================================================

    isActive = false,

    accent = "#A87852",
    hoverAccent = "#A87852",
    textColor = "#8B8B8B",
    hoverTextColor = "#0D0D0D",

    magneticStrength = 0.22,

    className = "",
}) {
    // ============================================================
    // ESTADO
    // ============================================================

    const [isHovered, setIsHovered] = useState(false);

    /*
    ------------------------------------------------------------
    ESTADOS VISUAIS
    ------------------------------------------------------------

    A seção ativa precisa ser reconhecida sem confusão:

    - isActive: destaque sólido da seção atual.
    - isHovered: indicação discreta de interação.
    - foco por teclado: contorno visível via focus-visible.

    Hover e foco não devem imitar o destaque da seção ativa.
    */

    // ============================================================
    // MOVIMENTO MAGNÉTICO
    // ============================================================

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // ============================================================
    // SPRING X
    // ============================================================

    const springX = useSpring(x, {
        stiffness: 650,
        damping: 18,
        mass: 0.45,
    });

    // ============================================================
    // SPRING Y
    // ============================================================

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

        Apenas alteramos o destino.

        O useSpring controla o retorno.
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
        <MotionLink
            to={href}
            aria-current={isActive ? "location" : undefined}
            onClick={handleClick}
            data-ui-sfx-hover
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                x: springX,
                y: springY,
            }}
            className={`
                group
                relative
                flex
                items-center
                justify-center
                overflow-hidden
                rounded-sm
                control-size-compact
                py-1
                px-3
                focus-visible:outline
                focus-visible:outline-2
                focus-visible:outline-offset-2
                focus-visible:outline-[#A87852]
                

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
                    backgroundColor: isActive ? accent : hoverAccent,

                    transformOrigin: `${originX.get() * 100}% ${originY.get() * 100}%`,
                }}
                initial={{
                    scale: 0,
                    opacity: 0,
                }}
                animate={{
                    scale: isActive || isHovered ? 1 : 0,
                    opacity: isActive || isHovered ? 1 : 0,
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
                    borderColor: isActive ? accent : hoverAccent,
                }}
                animate={{
                    opacity: isActive || isHovered ? 1 : 0,
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
                    opacity: isActive || isHovered ? 1 : 0,
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
                    color: isActive || isHovered ? hoverTextColor : textColor,
                }}
                animate={{
                    y: isActive || isHovered ? -0.5 : 0,

                    letterSpacing: isActive || isHovered ? "0.14em" : "0.12em",
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

            {/* =================================================
                ACTIVE — INDICADOR
            ================================================== */}

            <motion.span
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    bottom-0
                    left-0
                    h-px
                    w-full
                    
                    
                 
                "
                initial={{
                    scaleX: 0,
                    opacity: 0,
                }}
                animate={{
                    scaleX: isActive ? 1 : 0,
                    opacity: isActive ? 1 : 0,
                }}
                transition={{
                    duration: 0.35,
                    ease: [0.16, 1, 0.3, 1],
                }}
                style={{
                    transformOrigin: "left center",
                }}
            />
        </MotionLink>
    );
}

export default MagneticLink;

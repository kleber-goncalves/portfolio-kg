import {
    motion,
    useMotionTemplate,
    useMotionValue,
    useReducedMotion,
    useSpring,
} from "motion/react";
import { useState } from "react";
import { Send } from "lucide-react";

const ACCENT = "#A87852";
const BORDER = "#242424";
const TEXT = "#F2F0EC";
const HOVER_TEXT = "#0D0D0D";

function MagneticSubmitButton({
    disabled = false,
    isSubmitting = false,
    label = "Enviar mensagem",
    className = "",
}) {
    const [isHovered, setIsHovered] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [iconCenterOffset, setIconCenterOffset] = useState(0);

    const reducedMotion = useReducedMotion();

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, {
        stiffness: 280,
        damping: 12,
        mass: 1.1,
    });
    const springY = useSpring(y, {
        stiffness: 280,
        damping: 12,
        mass: 1.1,
    });

    const originX = useMotionValue(50);
    const originY = useMotionValue(50);
    const fillOrigin = useMotionTemplate`${originX}% ${originY}%`;

    const isInteractive = !disabled && (isHovered || isFocused);

    const updateFillOrigin = (event) => {
        if (reducedMotion) return;

        const rect = event.currentTarget.getBoundingClientRect();
        if (!rect.width || !rect.height) return;

        const relativeX = (event.clientX - rect.left) / rect.width;
        const relativeY = (event.clientY - rect.top) / rect.height;

        originX.set(Math.min(100, Math.max(0, relativeX * 100)));
        originY.set(Math.min(100, Math.max(0, relativeY * 100)));
    };

    const updateIconCenterOffset = (event) => {
        if (disabled) return;

        const labelElement = event.currentTarget.querySelector(
            ".contact-send-button__label",
        );
        const labelWidth = labelElement?.getBoundingClientRect().width ?? 0;

        // O conteúdo usa gap-3 (12px). Essa distância leva o ícone,
        // que começa antes do texto, até o centro geométrico do botão.
        setIconCenterOffset((labelWidth + 12) / 2);
    };

    const handleMouseEnter = (event) => {
        if (disabled) return;

        updateFillOrigin(event);
        updateIconCenterOffset(event);
        setIsHovered(true);
    };

    const handleMouseMove = (event) => {
        if (disabled || reducedMotion) return;

        const rect = event.currentTarget.getBoundingClientRect();
        if (!rect.width || !rect.height) return;

        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        // Intensidade moderada: o botão ocupa toda a largura do formulário.
        x.set((mouseX - rect.width / 2) * 0.1);
        y.set((mouseY - rect.height / 2) * 0.1);

        updateFillOrigin(event);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        x.set(0);
        y.set(0);
    };

    const handleFocus = (event) => {
        if (disabled) return;

        updateIconCenterOffset(event);
        setIsFocused(true);
    };

    return (
        <motion.button
            type="submit"
            disabled={disabled}
            aria-busy={isSubmitting}
            data-ui-sfx-hover
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onFocus={handleFocus}
            onBlur={() => setIsFocused(false)}
            style={{
                x: disabled || reducedMotion ? 0 : springX,
                y: disabled || reducedMotion ? 0 : springY,
                borderColor: BORDER,
            }}
            className={`
                contact-send-button
                group
                relative
                mt-8
                flex
                w-full
                cursor-pointer
                items-center
                justify-center
                overflow-hidden
                rounded-md
                border
                bg-transparent
                px-5
                py-4
                font-space
                text-[11px]
                font-medium
                uppercase
                tracking-[0.16em]
                transition-[border-color,color]
                duration-300
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-champagne
                focus-visible:ring-offset-2
                focus-visible:ring-offset-obsidian
                disabled:cursor-not-allowed
                disabled:border-graphite
                disabled:bg-graphite
                disabled:text-steel
                ${className}
            `}
        >
            <motion.span
                aria-hidden="true"
                className="contact-send-button__fill pointer-events-none absolute inset-[-5px] z-0 rounded-md"
                style={{
                    backgroundColor: ACCENT,
                    transformOrigin: fillOrigin,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                    scale: isInteractive ? 1 : 0,
                    opacity: isInteractive ? 1 : 0,
                }}
                transition={{
                    scale: reducedMotion
                        ? { duration: 0.01 }
                        : {
                            type: "spring",
                            stiffness: 150,
                            damping: 22,
                            mass: 0.75,
                        },
                    opacity: reducedMotion
                        ? { duration: 0.01 }
                        : {
                            duration: 0.25,
                            ease: [0.16, 1, 0.3, 1],
                        },
                }}
            />

            <motion.span
                aria-hidden="true"
                className="contact-send-button__border pointer-events-none absolute inset-0 z-[1] rounded-md border"
                style={{ borderColor: ACCENT }}
                animate={{ opacity: isInteractive ? 1 : 0 }}
                transition={{ duration: reducedMotion ? 0.01 : 0.2, ease: [0.16, 1, 0.3, 1] }}
            />

            <motion.span
                className="contact-send-button__content relative z-10 inline-flex min-w-0 items-center justify-center gap-3"
                style={{
                    color: disabled ? "#8B8B8B" : (isInteractive ? HOVER_TEXT : TEXT),
                }}
                animate={{
                    y: isInteractive ? -0.5 : 0,
                    letterSpacing: isInteractive ? "0.14em" : "0.16em",
                }}
                transition={reducedMotion ? { duration: 0.01 } : {
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
                <motion.span
                    className="contact-send-button__icon-wrapper inline-flex shrink-0 items-center justify-center"
                    animate={{
                        x: isInteractive ? iconCenterOffset : 0,
                        y: isInteractive ? -1.5 : 0,
                        scale: isInteractive ? 1.08 : 1,
                    }}
                    transition={reducedMotion ? { duration: 0.01 } : {
                        type: "spring",
                        stiffness: 420,
                        damping: 17,
                        mass: 0.35,
                    }}
                >
                    <Send aria-hidden="true" className="contact-send-button__icon h-4 w-4" />
                </motion.span>

                <motion.span
                    className="contact-send-button__label inline-block"
                    animate={{
                        x: isInteractive ? 22 : 0,
                        opacity: isInteractive ? 0 : 1,
                    }}
                    transition={reducedMotion ? { duration: 0.01 } : {
                        x: {
                            duration: 0.28,
                            ease: [0.16, 1, 0.3, 1],
                        },
                        opacity: {
                            duration: 0.18,
                            ease: "easeOut",
                        },
                    }}
                >
                    {label}
                </motion.span>
            </motion.span>
        </motion.button>
    );
}

export default MagneticSubmitButton;

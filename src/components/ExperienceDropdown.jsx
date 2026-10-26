import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";

import { useEffect, useRef, useState } from "react";

import { ChevronDown } from "lucide-react";

import { getExperienceMode, setExperienceMode } from "../utils/experienceMode";
import { playUiSound } from "../utils/uiSfx";

function ExperienceDropdown({ experienceMode = getExperienceMode() || "full", onChange }) {
    /*
    ============================================================
    ESTADOS
    ============================================================
    */

    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    /*
    ============================================================
    REFS
    ============================================================
    */

    const dropdownRef = useRef(null);
    const dropdownMotionRef = useRef(null);

    /*
    ============================================================
    MOVIMENTO MAGNÉTICO
    ============================================================
    */

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    /*
    ============================================================
    MOLA DO BOTÃO
    ============================================================
    */

    const springX = useSpring(x, {
        stiffness: 280,
        damping: 12,
        mass: 1.45,
    });

    const springY = useSpring(y, {
        stiffness: 280,
        damping: 12,
        mass: 1.45,
    });

    /*
    ============================================================
    MOUSE MOVE
    ============================================================
    */

    const handleMouseMove = (event) => {
        const rect = event.currentTarget.getBoundingClientRect();

        const mouseX = event.clientX - rect.left;

        const mouseY = event.clientY - rect.top;

        const centerX = rect.width / 2;

        const centerY = rect.height / 2;

        x.set((mouseX - centerX) * 0.22);

        y.set((mouseY - centerY) * 0.22);
    };

    /*
    ============================================================
    MOUSE LEAVE
    ============================================================
    */

    const handleMouseLeave = () => {
        setIsHovered(false);

        /*
        Ao voltar para 0,
        o useSpring cria o efeito
        de elástico.
        */

        x.set(0);
        y.set(0);
    };

    /*
    ============================================================
    ABRIR / FECHAR
    ============================================================
    */

    const toggleDropdown = () => {
        const nextIsOpen = !isOpen;
        playUiSound(nextIsOpen ? "expand" : "collapse");
        setIsOpen(nextIsOpen);
    };

    /*
    ============================================================
    ALTERAR EXPERIENCE
    ============================================================
    */

    const handleExperienceChange = async (mode) => {
        if (mode === experienceMode) {
            if (isOpen) playUiSound("collapse");
            setIsOpen(false);
            return;
        }

        // Ao escolher outro modo, o dropdown também está sendo recolhido.
        // Espera apenas o fim do som curto, quando o áudio está ativado,
        // antes de recarregar a página e aplicar a configuração.
        const collapseSound = isOpen ? playUiSound("collapse") : null;
        setIsOpen(false);

        setExperienceMode(mode);

        onChange?.(mode);

        if (collapseSound?.ended) {
            await collapseSound.ended;
        }

        window.location.reload();
    };

    /*
    ============================================================
    FECHAR AO CLICAR FORA
    ============================================================
    */

    useEffect(() => {
        if (!isOpen) return undefined;

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                playUiSound("collapse");
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    /*
    ============================================================
    RENDER
    ============================================================
    */

    return (
        <div
            ref={dropdownRef}
            className="
                relative
                flex
                items-center
            "
        >
            {/* ==================================================
                BOTÃO EXPERIENCE
            ================================================== */}

            <motion.button
                data-ui-sfx-hover
                type="button"
                aria-expanded={isOpen}
                aria-haspopup="menu"
                onClick={toggleDropdown}
                onMouseEnter={() => setIsHovered(true)}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    x: springX,
                    y: springY,
                }}
                className="
                    group
                    relative

                    flex
                    items-center
                    gap-2
                    cursor-pointer
                    overflow-hidden
                    rounded-sm
                    control-size-compact
                    px-3
                    py-1

                    font-space
                    text-[9px]
                    uppercase
                    tracking-[0.14em]

                    c-lg:text-[10px]
                "
            >
                {/* ==================================================
                    FUNDO
                ================================================== */}

                <motion.span
                    aria-hidden="true"
                    className="
                        pointer-events-none
                        absolute
                        rounded-sm
                        inset-0
                        z-0
                    "
                    style={{
                        backgroundColor: "#A87852",
                    }}
                    initial={{
                        scale: 0,
                        opacity: 0,
                    }}
                    animate={{
                        scale: isHovered || isOpen ? 1 : 0,

                        opacity: isHovered || isOpen ? 1 : 0,
                    }}
                    transition={{
                        scale: {
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                            mass: 0.55,
                        },

                        opacity: {
                            duration: 0.15,
                        },
                    }}
                />

                {/* ==================================================
                    BORDA
                ================================================== */}

                <motion.span
                    aria-hidden="true"
                    className="
                        pointer-events-none
                        absolute
                        inset-0
                        
                        z-[1]
                        border
                    "
                    style={{
                        borderColor: "#A87852",
                    }}
                    animate={{
                        opacity: isHovered || isOpen ? 1 : 0,
                    }}
                    transition={{
                        duration: 0.2,
                    }}
                />

                {/* ==================================================
                    TEXTO
                ================================================== */}

                <motion.span
                    className="
                        relative
                        z-10
                    "
                    animate={{
                        color: isHovered || isOpen ? "#0D0D0D" : "#8B8B8B",

                        y: isHovered ? -0.5 : 0,
                    }}
                    transition={{
                        y: {
                            type: "spring",
                            stiffness: 430,
                            damping: 18,
                            mass: 0.4,
                        },

                        color: {
                            duration: 0.2,
                        },
                    }}
                >
                    Experience
                </motion.span>

                {/* ==================================================
                    CHEVRON
                ================================================== */}

                <motion.span
                    className="
                        relative
                        z-10
                        flex
                    "
                    animate={{
                        color: isHovered || isOpen ? "#0D0D0D" : "#8B8B8B",

                        rotate: isOpen ? 180 : 0,
                    }}
                    transition={{
                        rotate: {
                            type: "spring",
                            stiffness: 400,
                            damping: 20,
                        },

                        color: {
                            duration: 0.2,
                        },
                    }}
                >
                    <ChevronDown
                        className="
                            h-3
                            w-3
                            stroke-[1.5]
                        "
                    />
                </motion.span>
            </motion.button>

            {/* ==================================================
                DROPDOWN
            ================================================== */}

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        ref={dropdownMotionRef}
                        role="menu"
                        initial={{
                            opacity: 0,
                            scale: 0,
                            y: -10,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0,
                            y: -10,
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 420,
                            damping: 18,
                            mass: 0.65,
                        }}
                        className="
                            absolute
                            left-23
                            top-full
                            z-50
                            rounded-sm
                            mt-5
                            w-[190px]

                            -translate-x-1/2

                            overflow-hidden

                            border
                            border-graphite/80

                            bg-carbon/95
                            backdrop-blur-xl

                            shadow-2xl
                            shadow-black
                        "
                    >
                        {/* ==================================================
                            OPÇÕES
                        ================================================== */}

                        <div className="p-1.5">
                            {/* ==================================================
                                FULL
                            ================================================== */}

                            <ExperienceOption mode="full" currentMode={experienceMode} title="Full" description="Full experience" onSelect={handleExperienceChange} />

                            {/* ==================================================
                                REDUCED
                            ================================================== */}

                            <ExperienceOption mode="reduced" currentMode={experienceMode} title="Reduced" description="Lightweight mode" onSelect={handleExperienceChange} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

/*
================================================================
OPÇÃO DO DROPDOWN
================================================================
*/

function ExperienceOption({ mode, currentMode, title, description, onSelect }) {
    const isActive = currentMode === mode;

    return (
        <button
            type="button"
            role="menuitem"
            onClick={() => onSelect(mode)}
            className={`
                group
                relative
                cursor-pointer
                flex
                w-full
                items-center
                justify-between
                rounded-sm
                px-3
                py-3

                text-left

                transition-all
                duration-300

                ${
                    isActive
                        ? `
                            bg-obsidian
                            text-ivory
                        `
                        : `
                            text-steel
                            hover:bg-obsidian/70
                            hover:text-ivory
                        `
                }

                ${mode === "reduced" ? "mt-1" : ""}
            `}
        >

            {/* ==================================================
                TEXTOS
            ================================================== */}

            <div
                className="
                    flex
                    flex-col
                    gap-1
                "
            >
                <span
                    className="
                        font-space
                        text-[10px]
                        uppercase
                        tracking-[0.14em]
                    "
                >
                    {title}
                </span>

                <span
                    className={`
                        font-space
                        text-[9px]
                        tracking-wide

                        group-hover:text-warm-bronze

                        ${isActive ? "text-warm-bronze" : "text-steel"}
                    `}
                >
                    {description}
                </span>
            </div>

            {/* ==================================================
                STATUS
            ================================================== */}

            <span
                className={`
                    flex
                    h-4
                    w-4
                    items-center
                    justify-center

                    rounded-full

                    border

                    transition-all
                    duration-300

                    ${
                        isActive
                            ? `
                                border-bronze
                                bg-bronze/10
                            `
                            : `
                                border-graphite
                                group-hover:border-steel/50
                            `
                    }
                `}
            >
                <span
                    className={`
                        h-1.5
                        w-1.5
                        rounded-full

                        transition-all
                        duration-300

                        ${isActive ? "scale-100 bg-bronze" : "scale-0 bg-bronze"}
                    `}
                />
            </span>
        </button>
    );
}

export default ExperienceDropdown;

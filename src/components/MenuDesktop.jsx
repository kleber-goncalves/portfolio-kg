import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, useMotionValue, useSpring } from "motion/react";
import { stopSmoothScroll, startSmoothScroll } from "../utils/lenisControl";

import { getExperienceMode, setExperienceMode } from "../utils/experienceMode";

function MenuDesktop({ items = [], showMenu = false }) {
    const [isOpen, setIsOpen] = useState(false);

    // =====================================
    // SEÇÃO ATUAL
    // =====================================

    const [activeHref, setActiveHref] = useState("#hero");
    const [hoveredHref, setHoveredHref] = useState(null);
    // =====================================
    // MODO DE EXPERIÊNCIA
    // =====================================

    const [experienceMode, setExperienceModeState] = useState(() => getExperienceMode() || "full");

    // =====================================
    // REFS
    // =====================================

    const menuRef = useRef(null);
    const buttonRef = useRef(null);

    const isOpenRef = useRef(false);
    const scrollTickingRef = useRef(false);

    // =====================================
    // MAGNETIC DO BOTÃO
    // =====================================

    const buttonX = useMotionValue(0);
    const buttonY = useMotionValue(0);

    const buttonSpringX = useSpring(buttonX, {
        stiffness: 580,
        damping: 11,
        mass: 1.2,
    });

    const buttonSpringY = useSpring(buttonY, {
        stiffness: 280,
        damping: 12,
        mass: 1.2,
    });

    const magneticStrength = 0.40;

    const handleButtonMouseMove = (event) => {
        const button = event.currentTarget;
        const rect = button.getBoundingClientRect();

        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        buttonX.set((mouseX - centerX) * magneticStrength);

        buttonY.set((mouseY - centerY) * magneticStrength);
    };

    const handleButtonMouseLeave = () => {
        buttonX.set(0);
        buttonY.set(0);
    };

    // =====================================
    // SINCRONIZA REF COM ESTADO
    // =====================================

    useEffect(() => {
        isOpenRef.current = isOpen;
    }, [isOpen]);

    // =====================================
    // BLOQUEIA A ROLAGEM
    // =====================================

    useEffect(() => {
        if (!isOpen) {
            startSmoothScroll();

            document.body.style.overflow = "";

            return;
        }

        // =====================================
        // PARA LENIS
        // =====================================

        stopSmoothScroll();

        // =====================================
        // BLOQUEIO NATIVO
        // =====================================

        document.body.style.overflow = "hidden";

        // =====================================
        // WHEEL
        // =====================================

        const handleWheel = (event) => {
            event.preventDefault();
        };

        // =====================================
        // TOUCH
        // =====================================

        const handleTouchMove = (event) => {
            event.preventDefault();
        };

        window.addEventListener("wheel", handleWheel, {
            passive: false,
        });

        window.addEventListener("touchmove", handleTouchMove, {
            passive: false,
        });

        // =====================================
        // CLEANUP
        // =====================================

        return () => {
            document.body.style.overflow = "";

            window.removeEventListener("wheel", handleWheel);

            window.removeEventListener("touchmove", handleTouchMove);

            startSmoothScroll();
        };
    }, [isOpen]);

    // =====================================
    // DETECTA A SEÇÃO ATUAL
    // =====================================

    useEffect(() => {
        if (!items.length) return;

        const updateActiveSection = () => {
            if (window.scrollY <= 10) {
                setActiveHref((previous) => (previous === "#hero" ? previous : "#hero"));

                scrollTickingRef.current = false;

                return;
            }

            const viewportPosition = window.innerHeight * 0.35;

            let currentSection = "#hero";

            items.forEach((item) => {
                if (!item.href || !item.href.startsWith("#")) {
                    return;
                }

                const section = document.querySelector(item.href);

                if (!section) return;

                const rect = section.getBoundingClientRect();

                if (rect.top <= viewportPosition) {
                    currentSection = item.href;
                }
            });

            setActiveHref((previous) => {
                if (previous === currentSection) {
                    return previous;
                }

                return currentSection;
            });

            scrollTickingRef.current = false;
        };

        const handleScroll = () => {
            if (scrollTickingRef.current) {
                return;
            }

            scrollTickingRef.current = true;

            requestAnimationFrame(updateActiveSection);
        };

        updateActiveSection();

        window.addEventListener("scroll", handleScroll, {
            passive: true,
        });

        window.addEventListener("resize", updateActiveSection);

        return () => {
            window.removeEventListener("scroll", handleScroll);

            window.removeEventListener("resize", updateActiveSection);
        };
    }, [items]);

    // =====================================
    // FECHAR MENU
    // =====================================

    const closeMenu = () => {
        // Esconde o conteúdo imediatamente

        setIsOpen(false);
    };

    // =====================================
    // ESC
    // =====================================

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                closeMenu();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    // =====================================
    // MOSTRAR / ESCONDER BOTÃO
    // =====================================

    useEffect(() => {
        if (!showMenu && isOpenRef.current) {
            setIsOpen(false);
        }
    }, [showMenu]);

    // =====================================
    // ALTERAR EXPERIÊNCIA
    // =====================================

    const handleExperienceChange = (mode) => {
        if (mode === experienceMode) {
            return;
        }

        console.log("⚙️ EXPERIÊNCIA ALTERADA:", mode);

        // =====================================
        // SALVA PREFERÊNCIA
        // =====================================

        setExperienceMode(mode);

        // =====================================
        // ATUALIZA ESTADO
        // =====================================

        setExperienceModeState(mode);

        // =====================================
        // FECHA MENU
        // =====================================

        closeMenu();

        // =====================================
        // RECARREGA
        // =====================================

        window.setTimeout(() => {
            window.location.reload();
        }, 500);
    };

    // =====================================
    // TOGGLE
    // =====================================

    const handleToggle = () => {
        setIsOpen((previous) => {
            const next = !previous;

            // Se estiver fechando,
            // esconde o conteúdo imediatamente.

            /*
            ====================================================
            ABERTURA

            O conteúdo NÃO é liberado aqui.

            Ele possui seu próprio delay através
            da variável contentDelay abaixo.
            ====================================================
            */

            return next;
        });
    };

    // =====================================
    // OVERLAY
    // =====================================

    const handleOverlayClick = (event) => {
        if (event.target === event.currentTarget) {
            closeMenu();
        }
    };

    // =====================================
    // NAVEGAÇÃO
    // =====================================

    const handleNavigation = (href, event) => {
        event.preventDefault();

        setActiveHref(href);

        closeMenu();

        if (href === "#hero") {
            window.setTimeout(() => {
                window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                });
            }, 450);

            return;
        }

        window.setTimeout(() => {
            const section = document.querySelector(href);

            if (!section) return;

            section.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }, 450);
    };

    // =====================================
    // MOTION
    // =====================================

    // =====================================
    // MOLA DO PAINEL
    // =====================================

    const panelSpring = {
        type: "spring",
        stiffness: 130,
        damping: 20,
        mass: 1.2,
    };

    // =====================================
    // MOLA DOS ELEMENTOS
    // =====================================

    const elementSpring = {
        type: "spring",
        stiffness: 420,
        damping: 25,
        mass: 1.5,
    };

    // =====================================
    // MOLA SUAVE
    // =====================================

    const softSpring = {
        type: "spring",
        stiffness: 220,
        damping: 13,
        mass: 1.1,
    };

    // =====================================
    // MOLA HOVER
    // =====================================

    const hoverSpring = {
        type: "spring",
        stiffness: 220,
        damping: 12,
        mass: 1.5,
    };

    // =====================================
    // MOLA DA LINHA
    // =====================================

    const lineSpring = {
        type: "spring",
        stiffness: 380,
        damping: 24,
        mass: 0.5,
    };
    const HoverlineSpring = {
        type: "spring",
        stiffness: 160,
        damping: 18,
        mass: 0.8,
    };

    // =====================================
    // MOMENTO DO CONTEÚDO
    // =====================================

    /*
    ============================================================
    CONTROLE PRINCIPAL

    O painel começa a abrir imediatamente.

    O conteúdo começa depois de 0.28s.

    Como o painel usa spring, esse valor é aproximado,
    mas visualmente coloca o conteúdo próximo dos
    80–90% da abertura.

    0.20 → mais cedo
    0.28 → aproximadamente 80–90%
    0.35 → mais tarde
    0.45 → muito próximo do final
    ============================================================
    */

    const contentDelay = 0.28;

    // =====================================
    // VARIANT DO PAINEL
    // =====================================

    const panelVariants = {
        closed: {
            x: "100%",
        },

        open: {
            x: 0,
        },
    };

    // =====================================
    // VARIANT DO OVERLAY
    // =====================================

    const overlayVariants = {
        closed: {
            opacity: 0,
        },

        open: {
            opacity: 1,
        },
    };

    // =====================================
    // VARIANT DO HEADER
    // =====================================

    const headerVariants = {
        closed: {
            opacity: 0,
            x: 65,
        },

        open: {
            opacity: 1,
            x: 0,
        },
    };

    // =====================================
    // VARIANT DOS LINKS
    // =====================================

    const linkVariants = {
        closed: {
            opacity: 0,
            x: 35,
        },

        open: {
            opacity: 1,
            x: 0,
        },

        tap: {
            scale: 0.985,
        },
    };

    // =====================================
    // VARIANT DO ÍNDICE
    // =====================================

    const indexVariants = {
        rest: {
            opacity: 0.45,
            x: 0,
        },

        hover: {
            opacity: 1,
            x: 4,
        },
    };

    // =====================================
    // VARIANT DO TÍTULO
    // =====================================

    const titleVariants = {
        rest: {
            x: 0,
        },

        hover: {
            x: 7,
        },
    };

    // =====================================
    // VARIANT DA SETA
    // =====================================

    const arrowVariants = {
        rest: {
            x: 0,
            opacity: 0.45,
            rotate: 0,
        },

        hover: {
            x: 5,
            opacity: 1,
            rotate: 3,
        },
    };

    // =====================================
    // VARIANT DA LINHA
    // =====================================

    const lineVariants = {
        rest: {
            scaleX: 0,
            opacity: 0,
        },

        hover: {
            scaleX: 1,
            opacity: 1,
        },
    };

    const hoverLineVariants = {
        rest: {
            scaleX: 0,
            opacity: 0,
        },

        hover: {
            scaleX: 1,
            opacity: 1,
        },
    };

    // =====================================
    // VARIANT DO HAMBÚRGUER
    // =====================================

    const hamburgerTopVariants = {
        closed: {
            y: -5,
            rotate: 0,
        },

        open: {
            y: 0,
            rotate: 45,
        },

        hover: {
            scaleX: 1.08,
        },
    };

    const hamburgerBottomVariants = {
        closed: {
            y: 5,
            rotate: 0,
        },

        open: {
            y: 0,
            rotate: -45,
        },

        hover: {
            scaleX: 1.08,
        },
    };

    // =====================================
    // MENU
    // =====================================

    const menuContent = (
        <div className="hidden md:block">
            {/* =================================
                OVERLAY
            ================================= */}

            <motion.div
                variants={overlayVariants}
                initial="closed"
                animate={isOpen ? "open" : "closed"}
                transition={{
                    duration: 0.3,
                    ease: "easeOut",
                }}
                className="
                    fixed
                    inset-0
                    z-[30]
                    bg-black/30
                "
                style={{
                    pointerEvents: isOpen ? "auto" : "none",
                }}
                onClick={handleOverlayClick}
            >
                {/* =================================
                    PAINEL
                ================================= */}

                <motion.nav
                    ref={menuRef}
                    variants={panelVariants}
                    initial="closed"
                    animate={isOpen ? "open" : "closed"}
                    transition={panelSpring}
                    aria-hidden={!isOpen}
                    className="
                        absolute
                        right-0
                        top-0
                        flex
                        h-full
                        w-[520px]
                        flex-col
                        overflow-hidden
                        border-l
                        border-graphite
                        bg-carbon
                        px-10
                        py-10
                        shadow-2xl
                    "
                >
                    {/* =========================
                        HEADER
                    ========================= */}

                    <motion.div
                        variants={headerVariants}
                        initial="closed"
                        animate={isOpen ? "open" : "closed"}
                        transition={{
                            ...elementSpring,
                            delay: isOpen ? contentDelay : 0,
                        }}
                        className="
                            mb-2
                           
                            pb-6
                        "
                    >
                        <p
                            className="
                                font-space
                                text-[10px]
                                uppercase
                                tracking-[0.25em]
                                text-steel
                            "
                        >
                            Navigation
                        </p>

                        <p
                            className="
                                mt-2
                                font-bebas
                                text-2xl
                                tracking-wide
                                text-ivory
                            "
                        >
                            KLEBER DEV
                        </p>
                    </motion.div>

                    {/* =========================
                        NAVEGAÇÃO
                    ========================= */}

                    <motion.div
                        className="
                            flex
                            flex-1
                            flex-col
                        "
                    >
                        {items.map((item, index) => {
                            const isActive = item.href === activeHref;

                            return (
                                <motion.button
                                    key={item.href || index}
                                    type="button"
                                    data-desktop-menu-link
                                    data-href={item.href}
                                    variants={linkVariants}
                                    initial="closed"
                                    animate={isOpen ? "open" : "closed"}
                                    whileHover="hover"
                                    whileTap="tap"
                                    transition={{
                                        ...elementSpring,
                                        delay: isOpen ? contentDelay + 0.08 + index * 0.055 : 0,
                                    }}
                                    onHoverStart={() => {
                                        if (!isActive) {
                                            setHoveredHref(item.href);
                                        }
                                    }}
                                    onHoverEnd={() => {
                                        setHoveredHref(null);
                                    }}
                                    onClick={(event) => handleNavigation(item.href, event)}
                                    className="
                                            group
                                            relative
                                            flex
                                            cursor-pointer
                                            items-center
                                            justify-between
                                            border-b
                                            border-graphite
                                            py-5
                                            text-left
                                            text-ivory
                                            transition-colors
                                            duration-300
                                            hover:text-bronze
                                        "
                                >
                                    {/* =========================
                                            ESQUERDA
                                        ========================= */}

                                    <div
                                        className="
                                                flex
                                                items-center
                                                gap-5
                                            "
                                    >
                                        {/* ÍNDICE */}

                                        <motion.span
                                            variants={indexVariants}
                                            transition={hoverSpring}
                                            className="
                                                    font-space
                                                    text-xs
                                                    text-steel
                                                    transition-colors
                                                    duration-300
                                                    group-hover:text-bronze
                                                "
                                        >
                                            {String(index + 1).padStart(2, "0")}
                                        </motion.span>

                                        {/* TÍTULO */}

                                        <motion.span
                                            variants={titleVariants}
                                            transition={hoverSpring}
                                            className={`
                                                    font-bebas
                                                    text-4xl
                                                    tracking-wide
                                                    transition-colors
                                                    duration-300

                                                    ${isActive ? "text-bronze" : "text-ivory"}

                                                    group-hover:text-bronze
                                                `}
                                        >
                                            {item.label}
                                        </motion.span>
                                    </div>

                                    {/* =========================
                                            SETA
                                        ========================= */}

                                    <motion.span
                                        variants={arrowVariants}
                                        transition={hoverSpring}
                                        className={`
                                                font-space
                                                text-xl
                                                transition-colors
                                                duration-300

                                                ${isActive ? "text-bronze" : "text-steel"}
                                            `}
                                    >
                                        ↗
                                    </motion.span>

                                    {/* =========================
                                            LINHA
                                        ========================= */}

                                    <motion.span
                                        data-menu-line
                                        data-active={isActive ? "true" : "false"}
                                        aria-hidden="true"
                                        variants={lineVariants}
                                        animate={isActive ? "hover" : "rest"}
                                        transition={lineSpring}
                                        style={{
                                            transformOrigin: "left center",
                                        }}
                                        className="
                                                pointer-events-none
                                                absolute
                                                bottom-0
                                                left-0
                                                h-[1px]
                                                w-full
                                                bg-[#C49A78]
                                                shadow-[0_0_10px_rgba(196,154,120,0.35)]
                                            "
                                    />

                                    {/* =========================
                                        LINHA HOVER
                                    ========================= */}

                                    {!isActive && (
                                        <motion.span
                                            aria-hidden="true"
                                            initial="rest"
                                            animate={hoveredHref === item.href ? "hover" : "rest"}
                                            variants={hoverLineVariants}
                                            transition={HoverlineSpring}
                                            style={{
                                                transformOrigin: "left center",
                                            }}
                                            className="
                                                pointer-events-none
                                                absolute
                                                bottom-0
                                                left-0
                                                h-[1px]
                                                w-full
                                                bg-[#C49A78]
                                            "
                                        />
                                    )}
                                </motion.button>
                            );
                        })}
                    </motion.div>

                    {/* =====================================
                        EXPERIÊNCIA
                    ===================================== */}

                    <motion.div
                        variants={headerVariants}
                        initial="closed"
                        animate={isOpen ? "open" : "closed"}
                        transition={{
                            ...elementSpring,
                            delay: isOpen ? contentDelay + 0.12 : 0,
                        }}
                        className="
                            mt-2
                            pt-6
                            
                        "
                    >
                        <p
                            className="
                                font-space
                                text-[10px]
                                uppercase
                                tracking-[0.25em]
                                text-steel
                            "
                        >
                            Experiência
                        </p>

                        <div
                            className="
                                mt-4
                                flex
                                gap-3
                            "
                        >
                            {/* =========================
                                COMPLETA
                            ========================= */}

                            <motion.button
                                type="button"
                                onClick={() => handleExperienceChange("full")}
                                whileHover={{
                                    y: -2,
                                }}
                                whileTap={{
                                    scale: 0.98,
                                }}
                                transition={softSpring}
                                className={`
                                    flex
                                    flex-1
                                    items-center
                                    justify-between
                                    border
                                    px-4
                                    py-3
                                    cursor-pointer
                                    rounded-sm
                                    transition-colors
                                    duration-300

                                    ${experienceMode === "full" ? "border-bronze bg-obsidian text-bronze" : "border-graphite bg-obsidian/40 text-steel hover:border-steel/40 hover:text-ivory"}
                                `}
                            >
                                <span
                                    className="
                                        font-space
                                        text-[10px]
                                        uppercase
                                        tracking-[0.12em]
                                    "
                                >
                                    Completa
                                </span>

                                <motion.span
                                    animate={{
                                        scale: experienceMode === "full" ? 1 : 0.8,

                                        opacity: experienceMode === "full" ? 1 : 0.3,
                                    }}
                                    transition={softSpring}
                                    className={`
                                        h-2
                                        w-2
                                        rounded-full

                                        ${experienceMode === "full" ? "bg-bronze shadow-[0_0_8px_rgba(196,154,120,0.7)]" : "bg-steel/30"}
                                    `}
                                />
                            </motion.button>

                            {/* =========================
                                ESSENCIAL
                            ========================= */}

                            <motion.button
                                type="button"
                                onClick={() => handleExperienceChange("reduced")}
                                whileHover={{
                                    y: -2,
                                }}
                                whileTap={{
                                    scale: 0.98,
                                }}
                                transition={softSpring}
                                className={`
                                    flex
                                    flex-1
                                    items-center
                                    justify-between
                                    border
                                    px-4
                                    py-3
                                    cursor-pointer
                                    rounded-sm
                                    transition-colors
                                    duration-300

                                    ${experienceMode === "reduced" ? "border-bronze bg-obsidian text-bronze" : "border-graphite bg-obsidian/40 text-steel hover:border-steel/40 hover:text-ivory"}
                                `}
                            >
                                <span
                                    className="
                                        font-space
                                        text-[10px]
                                        uppercase
                                        tracking-[0.12em]
                                    "
                                >
                                    Essencial
                                </span>

                                <motion.span
                                    animate={{
                                        scale: experienceMode === "reduced" ? 1 : 0.8,

                                        opacity: experienceMode === "reduced" ? 1 : 0.3,
                                    }}
                                    transition={softSpring}
                                    className={`
                                        h-2
                                        w-2
                                        rounded-full

                                        ${experienceMode === "reduced" ? "bg-bronze shadow-[0_0_8px_rgba(196,154,120,0.7)]" : "bg-steel/30"}
                                    `}
                                />
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* =====================================
                        FOOTER
                    ===================================== */}

                    <motion.div
                        variants={headerVariants}
                        initial="closed"
                        animate={isOpen ? "open" : "closed"}
                        transition={{
                            ...elementSpring,
                            delay: isOpen ? contentDelay + 0.18 : 0,
                        }}
                        className="
                            mt-6
                            pt-2
                        "
                    >
                        <p
                            className="
                                font-space
                                text-[10px]
                                uppercase
                                tracking-[0.25em]
                                text-steel
                            "
                        >
                            Kleber Dev · Portfolio
                        </p>
                    </motion.div>
                </motion.nav>
            </motion.div>

            {/* =====================================
                BOTÃO HAMBÚRGUER
            ===================================== */}

            <motion.button
                ref={buttonRef}
                type="button"
                aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
                aria-expanded={isOpen}
                onClick={handleToggle}
                onMouseMove={handleButtonMouseMove}
                onMouseLeave={handleButtonMouseLeave}
                initial={{
                    opacity: 0,
                    scale: 10,
                }}
                animate={{
                    opacity: showMenu ? 1 : 0,
                    scale: showMenu ? 1 : 0,
                }}
                whileHover={{
                    scale: 1.04,
                }}
                whileTap={{
                    scale: 0.94,
                }}
                transition={softSpring}
                className="
                    fixed
                    right-8
                    top-8
                    z-[31]
                    flex
                    h-14
                    w-14
                    cursor-pointer
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-graphite
                    bg-carbon
                    text-ivory
                    shadow-xl
                    transition-colors
                    duration-300
                    hover:border-bronze
                    hover:text-bronze
                    lg:right-4
                    lg:top-10
                "
                style={{
                    pointerEvents: showMenu ? "auto" : "none",
                    x: buttonSpringX,
                    y: buttonSpringY,
                }}
            >
                {/* =====================================
                    TRAÇO SUPERIOR
                ===================================== */}

                <motion.span
                    initial="closed"
                    animate={isOpen ? "open" : "closed"}
                    whileHover="hover"
                    transition={hoverSpring}
                    variants={hamburgerTopVariants}
                    className="
                        absolute
                        top-1/2
                        h-[1.5px]
                        w-7
                        bg-current
                    "
                    style={{
                        transformOrigin: "center center",
                    }}
                />

                {/* =====================================
                    TRAÇO INFERIOR
                ===================================== */}

                <motion.span
                    initial="closed"
                    animate={isOpen ? "open" : "closed"}
                    whileHover="hover"
                    transition={hoverSpring}
                    variants={hamburgerBottomVariants}
                    className="
                        absolute
                        top-1/2
                        h-[1.5px]
                        w-7
                        bg-current
                    "
                    style={{
                        transformOrigin: "center center",
                    }}
                />
            </motion.button>
        </div>
    );

    // =====================================
    // PORTAL
    // =====================================

    return createPortal(menuContent, document.body);
}

export default MenuDesktop;

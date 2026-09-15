import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";

import { stopSmoothScroll, startSmoothScroll } from "../utils/lenisControl";

import { getExperienceMode, setExperienceMode } from "../utils/experienceMode";

function MenuDesktop({ items = [], showMenu = false }) {
    const [isOpen, setIsOpen] = useState(false);

    // =====================================
    // SEÇÃO ATUAL
    // =====================================

    const [activeHref, setActiveHref] = useState("#hero");

    // =====================================
    // MODO DE EXPERIÊNCIA
    // =====================================

    const [experienceMode, setExperienceModeState] = useState(() => getExperienceMode() || "full");

    // =====================================
    // REFS
    // =====================================

    const menuRef = useRef(null);
    const buttonRef = useRef(null);

    const lineTopRef = useRef(null);
    const lineBottomRef = useRef(null);

    const isOpenRef = useRef(false);

    const scrollTickingRef = useRef(false);

    // =====================================
    // POSIÇÃO INICIAL DOS DOIS TRAÇOS
    // =====================================

    useEffect(() => {
        const top = lineTopRef.current;
        const bottom = lineBottomRef.current;

        if (!top || !bottom) return;

        gsap.set(top, {
            xPercent: -50,
            yPercent: -50,
            y: -5,
            rotation: 0,
        });

        gsap.set(bottom, {
            xPercent: -50,
            yPercent: -50,
            y: 5,
            rotation: 0,
        });
    }, []);

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
    // HAMBÚRGUER → X
    // =====================================

    const animateToClose = () => {
        const top = lineTopRef.current;
        const bottom = lineBottomRef.current;

        if (!top || !bottom) return;

        const tl = gsap.timeline();

        tl.to(
            top,
            {
                rotation: 45,
                y: 0,
                duration: 0.55,
                ease: "power3.inOut",
            },
            0,
        );

        tl.to(
            bottom,
            {
                rotation: -45,
                y: 0,
                duration: 0.55,
                ease: "power3.inOut",
            },
            0,
        );
    };

    // =====================================
    // X → HAMBÚRGUER
    // =====================================

    const animateToHamburger = () => {
        const top = lineTopRef.current;
        const bottom = lineBottomRef.current;

        if (!top || !bottom) return;

        const tl = gsap.timeline();

        tl.to(
            top,
            {
                rotation: 0,
                y: -5,
                duration: 0.45,
                ease: "power3.inOut",
            },
            0,
        );

        tl.to(
            bottom,
            {
                rotation: 0,
                y: 5,
                duration: 0.45,
                ease: "power3.inOut",
            },
            0,
        );
    };

    // =====================================
    // ABRIR MENU
    // =====================================

    const openMenu = () => {
        if (!showMenu) return;

        isOpenRef.current = true;

        setIsOpen(true);

        animateToClose();
    };

    // =====================================
    // FECHAR MENU
    // =====================================

    const closeMenu = () => {
        const menu = menuRef.current;

        if (!menu) {
            isOpenRef.current = false;

            setIsOpen(false);

            return;
        }

        const links = menu.querySelectorAll("[data-desktop-menu-link]");

        const underlineLines = menu.querySelectorAll("[data-menu-line]");

        const tl = gsap.timeline({
            onComplete: () => {
                isOpenRef.current = false;

                setIsOpen(false);
            },
        });

        underlineLines.forEach((line) => {
            const parent = line.closest("[data-desktop-menu-link]");

            const href = parent?.dataset.href;

            const isActive = href === activeHref;

            if (!isActive) {
                tl.to(
                    line,
                    {
                        scaleX: 0,
                        duration: 0.2,
                        ease: "power2.in",
                    },
                    0,
                );
            }
        });

        tl.to(
            links,
            {
                opacity: 0,
                x: 20,
                duration: 0.25,
                stagger: 0.04,
                ease: "power2.in",
            },
            0,
        );

        tl.to(
            menu,
            {
                xPercent: 100,
                duration: 0.45,
                ease: "power3.inOut",
            },
            "-=.05",
        );
    };

    // =====================================
    // ESC
    // =====================================

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                animateToHamburger();

                closeMenu();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, activeHref]);

    // =====================================
    // ABERTURA DO PAINEL
    // =====================================

    useEffect(() => {
        if (!isOpen) return;

        const menu = menuRef.current;

        if (!menu) return;

        const links = menu.querySelectorAll("[data-desktop-menu-link]");

        const underlineLines = menu.querySelectorAll("[data-menu-line]");

        gsap.set(menu, {
            xPercent: 100,
        });

        gsap.set(links, {
            opacity: 0,
            x: 20,
        });

        gsap.set(underlineLines, {
            scaleX: 0,
            transformOrigin: "left center",
        });

        gsap.to(menu, {
            xPercent: 0,
            duration: 0.65,
            ease: "power3.out",
        });

        gsap.to(links, {
            opacity: 1,
            x: 0,
            duration: 0.55,
            stagger: 0.12,
            delay: 0.18,
            ease: "power2.out",
        });

        requestAnimationFrame(() => {
            const activeLine = menu.querySelector(`[data-menu-line][data-active="true"]`);

            if (activeLine) {
                gsap.fromTo(
                    activeLine,
                    {
                        scaleX: 0,
                    },
                    {
                        scaleX: 1,
                        duration: 0.7,
                        delay: 0.35,
                        ease: "power3.out",
                    },
                );
            }
        });
    }, [isOpen]);

    // =====================================
    // ATUALIZA VISUAL DO LINK ATIVO
    // =====================================

    useEffect(() => {
        if (!isOpen || !menuRef.current) {
            return;
        }

        const menu = menuRef.current;

        const links = menu.querySelectorAll("[data-desktop-menu-link]");

        links.forEach((link) => {
            const href = link.dataset.href;

            const line = link.querySelector("[data-menu-line]");

            if (!line) return;

            const isActive = href === activeHref;

            line.dataset.active = isActive ? "true" : "false";

            gsap.killTweensOf(line);

            if (isActive) {
                gsap.to(line, {
                    scaleX: 1,
                    duration: 0.5,
                    ease: "power3.out",
                });
            } else {
                gsap.to(line, {
                    scaleX: 0,
                    duration: 0.35,
                    ease: "power2.inOut",
                });
            }
        });
    }, [activeHref, isOpen]);

    // =====================================
    // MOSTRAR / ESCONDER BOTÃO
    // =====================================

    useEffect(() => {
        const button = buttonRef.current;

        if (!button) return;

        if (showMenu) {
            gsap.to(button, {
                opacity: 1,
                scale: 1,
                duration: 0.4,
                ease: "power3.out",
                pointerEvents: "auto",
            });

            return;
        }

        gsap.to(button, {
            opacity: 0,
            scale: 0,
            duration: 0.3,
            ease: "power2.in",
            pointerEvents: "none",
        });

        if (isOpenRef.current && menuRef.current) {
            const menu = menuRef.current;

            gsap.killTweensOf(menu);

            gsap.to(menu, {
                xPercent: 100,
                duration: 0.35,
                ease: "power3.inOut",
                onComplete: () => {
                    isOpenRef.current = false;

                    setIsOpen(false);
                },
            });

            animateToHamburger();
        }
    }, [showMenu]);

    // =====================================
    // HOVER — ENTRA
    // =====================================

    const handleLinkEnter = (event) => {
        const button = event.currentTarget;

        const line = button.querySelector("[data-menu-line]");

        if (!line) return;

        gsap.killTweensOf(line);

        gsap.to(line, {
            scaleX: 1,
            duration: 0.65,
            ease: "power3.out",
        });
    };

    // =====================================
    // HOVER — SAI
    // =====================================

    const handleLinkLeave = (event) => {
        const button = event.currentTarget;

        const line = button.querySelector("[data-menu-line]");

        if (!line) return;

        const href = button.dataset.href;

        const isActive = href === activeHref;

        gsap.killTweensOf(line);

        if (isActive) {
            gsap.to(line, {
                scaleX: 1,
                duration: 0.35,
                ease: "power3.out",
            });

            return;
        }

        gsap.to(line, {
            scaleX: 0,
            duration: 0.45,
            ease: "power3.inOut",
        });
    };

    // =====================================
    // ALTERAR EXPERIÊNCIA
    // =====================================

    const handleExperienceChange = (mode) => {
        if (mode === experienceMode) {
            return;
        }

        console.log("⚙️ EXPERIÊNCIA ALTERADA:", mode);

        // Salva preferência

        setExperienceMode(mode);

        // Atualiza estado do menu

        setExperienceModeState(mode);

        // Fecha menu

        animateToHamburger();

        closeMenu();

        // Recarrega

        window.setTimeout(() => {
            window.location.reload();
        }, 500);
    };

    // =====================================
    // TOGGLE
    // =====================================

    const handleToggle = () => {
        if (isOpen) {
            animateToHamburger();

            closeMenu();
        } else {
            animateToClose();

            openMenu();
        }
    };

    // =====================================
    // OVERLAY
    // =====================================

    const handleOverlayClick = (event) => {
        if (event.target === event.currentTarget) {
            animateToHamburger();

            closeMenu();
        }
    };

    // =====================================
    // NAVEGAÇÃO
    // =====================================

    const handleNavigation = (href, event) => {
        event.preventDefault();

        setActiveHref(href);

        const button = event.currentTarget;

        const line = button.querySelector("[data-menu-line]");

        if (line) {
            gsap.killTweensOf(line);

            gsap.to(line, {
                scaleX: 1,
                duration: 0.35,
                ease: "power3.out",
            });
        }

        animateToHamburger();

        closeMenu();

        if (href === "#hero") {
            setTimeout(() => {
                window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                });
            }, 100);

            return;
        }

        setTimeout(() => {
            const section = document.querySelector(href);

            if (!section) return;

            section.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }, 450);
    };

    // =====================================
    // MENU
    // =====================================

    const menuContent = (
        <div className="hidden md:block">
            {/* =================================
                OVERLAY + PAINEL
            ================================= */}

            {isOpen && (
                <div
                    className="
                        fixed
                        inset-0
                        z-[30]
                        bg-black/30
                    "
                    onClick={handleOverlayClick}
                >
                    <nav
                        ref={menuRef}
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

                        <div
                            className="
                                mb-9
                                border-b
                                border-graphite
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
                        </div>

                        {/* =========================
                            NAVEGAÇÃO
                        ========================= */}

                        <div
                            className="
                                flex
                                flex-1
                                flex-col
                            "
                        >
                            {items.map((item, index) => {
                                const isActive = item.href === activeHref;

                                return (
                                    <button
                                        key={item.href || index}
                                        type="button"
                                        data-desktop-menu-link
                                        data-href={item.href}
                                        onMouseEnter={handleLinkEnter}
                                        onMouseLeave={handleLinkLeave}
                                        onClick={(event) => handleNavigation(item.href, event)}
                                        className="
                                                group
                                                relative
                                                flex
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
                                        <div
                                            className="
                                                    flex
                                                    items-center
                                                    gap-5
                                                "
                                        >
                                            <span
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
                                            </span>

                                            <span
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
                                            </span>
                                        </div>

                                        <span
                                            className={`
                                                    font-space
                                                    text-xl
                                                    transition-all
                                                    duration-300
                                                    group-hover:translate-x-1
                                                    group-hover:text-bronze

                                                    ${isActive ? "text-bronze" : "text-steel"}
                                                `}
                                        >
                                            ↗
                                        </span>

                                        <span
                                            data-menu-line
                                            data-active={isActive ? "true" : "false"}
                                            aria-hidden="true"
                                            className="
                                                    pointer-events-none
                                                    absolute
                                                    bottom-0
                                                    left-0
                                                    h-[1px]
                                                    w-full
                                                    origin-left
                                                    bg-[#C49A78]
                                                    shadow-[0_0_10px_rgba(196,154,120,0.35)]
                                                "
                                        />
                                    </button>
                                );
                            })}
                        </div>

                        {/* =====================================
                            EXPERIÊNCIA
                        ===================================== */}

                        <div
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

                            <div className="mt-4 flex gap-3">
                                {/* =========================
                                    COMPLETA
                                ========================= */}

                                <button
                                    type="button"
                                    onClick={() => handleExperienceChange("full")}
                                    className={`
                                        flex
                                        flex-1
                                        items-center
                                        justify-between
                                        border
                                        px-4
                                        py-3
                                        transition-all
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

                                    <span
                                        className={`
                                            h-2
                                            w-2
                                            rounded-full
                                            transition-all
                                            duration-300

                                            ${experienceMode === "full" ? "bg-bronze shadow-[0_0_8px_rgba(196,154,120,0.7)]" : "bg-steel/30"}
                                        `}
                                    />
                                </button>

                                {/* =========================
                                    ESSENCIAL
                                ========================= */}

                                <button
                                    type="button"
                                    onClick={() => handleExperienceChange("reduced")}
                                    className={`
                                        flex
                                        flex-1
                                        items-center
                                        justify-between
                                        border
                                        px-4
                                        py-3
                                        transition-all
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

                                    <span
                                        className={`
                                            h-2
                                            w-2
                                            rounded-full
                                            transition-all
                                            duration-300

                                            ${experienceMode === "reduced" ? "bg-bronze shadow-[0_0_8px_rgba(196,154,120,0.7)]" : "bg-steel/30"}
                                        `}
                                    />
                                </button>
                            </div>
                        </div>

                        {/* =====================================
                            FOOTER
                        ===================================== */}

                        <div
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
                        </div>
                    </nav>
                </div>
            )}

            {/* =====================================
                BOTÃO HAMBÚRGUER
            ===================================== */}

            <button
                ref={buttonRef}
                type="button"
                aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
                aria-expanded={isOpen}
                onClick={handleToggle}
                className="
                    fixed
                    right-8
                    top-8
                    z-[31]
                    flex
                    h-14
                    w-14
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
            >
                <span
                    ref={lineTopRef}
                    className="
                        absolute
                        left-1/2
                        top-1/2
                        h-[1.5px]
                        w-7
                        bg-current
                    "
                />

                <span
                    ref={lineBottomRef}
                    className="
                        absolute
                        left-1/2
                        top-1/2
                        h-[1.5px]
                        w-7
                        bg-current
                    "
                />
            </button>
        </div>
    );

    // =====================================
    // PORTAL
    // =====================================

    return createPortal(menuContent, document.body);
}

export default MenuDesktop;

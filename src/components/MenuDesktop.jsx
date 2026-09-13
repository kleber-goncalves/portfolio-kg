import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";

function MenuDesktop({ items = [], showMenu = false }) {
    const [isOpen, setIsOpen] = useState(false);

    const menuRef = useRef(null);
    const buttonRef = useRef(null);

    const lineTopRef = useRef(null);
    const lineBottomRef = useRef(null);

    const isOpenRef = useRef(false);

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
                duration: 0.5,
                ease: "power3.inOut",
            },
            0,
        );

        tl.to(
            bottom,
            {
                rotation: -45,
                y: 0,
                duration: 0.5,
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
    // ABRIR
    // =====================================
    const openMenu = () => {
        if (!showMenu) return;

        isOpenRef.current = true;
        setIsOpen(true);
    };

    // =====================================
    // FECHAR
    // =====================================
    const closeMenu = () => {
        const menu = menuRef.current;

        if (!menu) {
            isOpenRef.current = false;
            setIsOpen(false);
            return;
        }

        const links = menu.querySelectorAll("[data-desktop-menu-link]");

        const tl = gsap.timeline({
            onComplete: () => {
                isOpenRef.current = false;
                setIsOpen(false);
            },
        });

        // Links saem
        tl.to(links, {
            opacity: 0,
            x: 20,
            duration: 0.25,
            stagger: 0.04,
            ease: "power2.in",
        });

        // Painel sai
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
    }, [isOpen]);

    // =====================================
    // ABERTURA DO PAINEL
    // =====================================
    useEffect(() => {
        if (!isOpen) return;

        const menu = menuRef.current;

        if (!menu) return;

        const links = menu.querySelectorAll("[data-desktop-menu-link]");

        gsap.set(menu, {
            xPercent: 100,
        });

        gsap.set(links, {
            opacity: 0,
            x: 20,
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
    }, [isOpen]);

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
            scale: 0.85,
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
    const handleNavigation = (href) => {
        animateToHamburger();
        closeMenu();

        setTimeout(() => {
            const section = document.querySelector(href);

            if (section) {
                section.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }
        }, 450);
    };

    // =====================================
    // MENU
    // =====================================
    const menuContent = (
        <div className="hidden md:block">
            {/* =================================
                PAINEL — Z 30
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
                            w-[420px]
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
                        {/* HEADER */}
                        <div
                            className="
                                mb-16
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

                        {/* LINKS */}
                        <div
                            className="
                                flex
                                flex-1
                                flex-col
                            "
                        >
                            {items.map((item, index) => (
                                <button
                                    key={item.href || index}
                                    type="button"
                                    data-desktop-menu-link
                                    onClick={() => handleNavigation(item.href)}
                                    className="
                                        group
                                        flex
                                        items-center
                                        justify-between

                                        border-b
                                        border-graphite

                                        py-5

                                        text-left

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
                                            0{index + 1}
                                        </span>

                                        <span
                                            className="
                                                font-bebas
                                                text-4xl
                                                tracking-wide
                                                text-ivory
                                                transition-colors
                                                duration-300
                                                group-hover:text-bronze
                                            "
                                        >
                                            {item.label}
                                        </span>
                                    </div>

                                    <span
                                        className="
                                            font-space
                                            text-xl
                                            text-steel
                                            transition-all
                                            duration-300
                                            group-hover:translate-x-1
                                            group-hover:text-bronze
                                        "
                                    >
                                        ↗
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* FOOTER */}
                        <div
                            className="
                                mt-10
                                border-t
                                border-graphite
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
                                Kleber Dev · Portfolio
                            </p>
                        </div>
                    </nav>
                </div>
            )}

            {/* =================================
                BOTÃO — Z 31
            ================================= */}
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
                {/* =================================
                    TRAÇO SUPERIOR
                ================================= */}
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

                {/* =================================
                    TRAÇO INFERIOR
                ================================= */}
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

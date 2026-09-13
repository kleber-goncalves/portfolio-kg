import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { X } from "lucide-react";

function NavbarDesktop({ items = [] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeItem, setActiveItem] = useState(items[0]?.href || "");

    const menuRef = useRef(null);
    const panelRef = useRef(null);
    const curveRef = useRef(null);
    const linksRef = useRef([]);
    const overlayRef = useRef(null);

    const setLinkRef = (element, index) => {
        linksRef.current[index] = element;
    };

    useEffect(() => {
        const menu = menuRef.current;
        const panel = panelRef.current;
        const curve = curveRef.current;
        const overlay = overlayRef.current;

        if (!menu || !panel || !curve || !overlay) return;

        gsap.set(panel, {
            xPercent: 100,
        });

        gsap.set(curve, {
            xPercent: 100,
        });

        gsap.set(overlay, {
            opacity: 0,
            pointerEvents: "none",
        });

        gsap.set(linksRef.current, {
            x: 80,
            opacity: 0,
        });
    }, []);

    useEffect(() => {
        const panel = panelRef.current;
        const curve = curveRef.current;
        const overlay = overlayRef.current;

        if (!panel || !curve || !overlay) return;

        if (isOpen) {
            document.body.style.overflow = "hidden";

            const tl = gsap.timeline();

            tl.set(overlay, {
                pointerEvents: "auto",
            })
                .to(
                    overlay,
                    {
                        opacity: 1,
                        duration: 0.35,
                        ease: "power2.out",
                    },
                    0,
                )
                .to(
                    curve,
                    {
                        xPercent: 0,
                        duration: 0.8,
                        ease: "power4.out",
                    },
                    0,
                )
                .to(
                    panel,
                    {
                        xPercent: 0,
                        duration: 0.8,
                        ease: "power4.out",
                    },
                    0,
                )
                .to(
                    linksRef.current,
                    {
                        x: 0,
                        opacity: 1,
                        duration: 0.7,
                        stagger: 0.08,
                        ease: "power3.out",
                    },
                    0.3,
                );

            return () => {
                tl.kill();
            };
        } else {
            document.body.style.overflow = "";

            const tl = gsap.timeline();

            tl.to(
                linksRef.current,
                {
                    x: 50,
                    opacity: 0,
                    duration: 0.25,
                    stagger: 0.03,
                    ease: "power2.in",
                },
                0,
            )
                .to(
                    curve,
                    {
                        xPercent: 100,
                        duration: 0.65,
                        ease: "power4.inOut",
                    },
                    0.08,
                )
                .to(
                    panel,
                    {
                        xPercent: 100,
                        duration: 0.65,
                        ease: "power4.inOut",
                    },
                    0.08,
                )
                .to(
                    overlay,
                    {
                        opacity: 0,
                        duration: 0.3,
                        ease: "power2.in",
                        onComplete: () => {
                            if (!isOpen) {
                                overlay.style.pointerEvents = "none";
                            }
                        },
                    },
                    0.25,
                );

            return () => {
                tl.kill();
            };
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, []);

    const handleNavigation = (href) => {
        setActiveItem(href);
        setIsOpen(false);

        const target = document.querySelector(href);

        if (target) {
            setTimeout(() => {
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }, 500);
        }
    };

    return (
        <div
            ref={menuRef}
            className="
                hidden
                md:block
            "
        >
            {/* =====================================================
                BOTÃO MENU
            ====================================================== */}

            <button
                type="button"
                onClick={() => setIsOpen(true)}
                aria-label="Abrir menu"
                aria-expanded={isOpen}
                className="
                    fixed
                    right-8
                    top-8
                    z-[70]

                    flex
                    items-center
                    gap-3

                    font-space
                    text-[10px]
                    uppercase
                    tracking-[0.18em]

                    text-steel

                    transition-colors
                    duration-300

                    hover:text-bronze

                    lg:right-17
                    lg:top-10
                "
            >
                <span>Menu</span>

                <span
                    className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center

                        rounded-full

                        border
                        border-graphite

                        bg-obsidian/80

                        transition-all
                        duration-300

                        group-hover:border-bronze
                    "
                >
                    <span
                        className="
                            flex
                            flex-col
                            gap-[4px]
                        "
                    >
                        <span className="block h-px w-4 bg-steel" />
                        <span className="block h-px w-4 bg-steel" />
                    </span>
                </span>
            </button>

            {/* =====================================================
                OVERLAY
            ====================================================== */}

            <div
                ref={overlayRef}
                onClick={() => setIsOpen(false)}
                className="
                    fixed
                    inset-0
                    z-[55]

                    bg-black/55

                    backdrop-blur-[2px]
                "
            />

            {/* =====================================================
                CURVA
            ====================================================== */}

            <svg
                ref={curveRef}
                aria-hidden="true"
                viewBox="0 0 180 1000"
                preserveAspectRatio="none"
                className="
                    pointer-events-none
                    fixed
                    right-[min(42vw,560px)]
                    top-0
                    z-[59]

                    h-screen
                    w-[180px]

                    text-carbon
                "
            >
                <path
                    d="
                        M180 0
                        C70 120 30 230 30 500
                        C30 770 70 880 180 1000
                        L180 0
                        Z
                    "
                    fill="currentColor"
                />
            </svg>

            {/* =====================================================
                PAINEL
            ====================================================== */}

            <aside
                ref={panelRef}
                aria-hidden={!isOpen}
                className="
                    fixed
                    right-0
                    top-0
                    z-[60]

                    h-screen
                    w-[min(42vw,560px)]

                    overflow-hidden

                    bg-carbon

                    text-ivory

                    shadow-[-30px_0_80px_rgba(0,0,0,0.45)]
                "
            >
                <div
                    className="
                        flex
                        h-full
                        flex-col
                        justify-between

                        px-12
                        py-10

                        xl:px-16
                    "
                >
                    {/* =================================================
                        HEADER
                    ================================================== */}

                    <div>
                        <div
                            className="
                                flex
                                items-center
                                justify-between

                                border-b
                                border-graphite

                                pb-5
                            "
                        >
                            <span
                                className="
                                    font-space
                                    text-[10px]
                                    uppercase
                                    tracking-[0.2em]

                                    text-steel/60
                                "
                            >
                                Navigation
                            </span>

                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                aria-label="Fechar menu"
                                className="
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center

                                    rounded-full

                                    border
                                    border-graphite

                                    text-steel

                                    transition-all
                                    duration-300

                                    hover:border-bronze
                                    hover:text-bronze
                                "
                            >
                                <X size={17} strokeWidth={1.2} />
                            </button>
                        </div>

                        {/* =================================================
                            LINKS
                        ================================================== */}

                        <nav
                            aria-label="Navegação principal"
                            className="
                                mt-16
                                flex
                                flex-col
                                gap-2
                            "
                        >
                            {items.map((item, index) => {
                                const isActive = activeItem === item.href;

                                return (
                                    <a
                                        key={item.href}
                                        ref={(element) => setLinkRef(element, index)}
                                        href={item.href}
                                        onClick={(event) => {
                                            event.preventDefault();
                                            handleNavigation(item.href);
                                        }}
                                        onMouseEnter={() => setActiveItem(item.href)}
                                        className="
                                            group
                                            relative

                                            flex
                                            items-center
                                            gap-5

                                            py-2

                                            font-space
                                            text-5xl
                                            font-light
                                            tracking-[-0.04em]

                                            transition-colors
                                            duration-300

                                            xl:text-6xl
                                        "
                                    >
                                        {/* indicador */}

                                        <span
                                            className={`
                                                h-1.5
                                                w-1.5
                                                shrink-0
                                                rounded-full

                                                transition-all
                                                duration-300

                                                ${isActive ? "bg-bronze scale-100" : "bg-transparent scale-0"}
                                            `}
                                        />

                                        {/* texto */}

                                        <span
                                            className={`
                                                transition-all
                                                duration-300

                                                ${isActive ? "text-ivory translate-x-1" : "text-steel/45 group-hover:text-ivory group-hover:translate-x-1"}
                                            `}
                                        >
                                            {item.label}
                                        </span>
                                    </a>
                                );
                            })}
                        </nav>
                    </div>

                    {/* =================================================
                        FOOTER DO MENU
                    ================================================== */}

                    <div
                        className="
                            flex
                            items-end
                            justify-between

                            border-t
                            border-graphite

                            pt-5
                        "
                    >
                        <div className="flex flex-col gap-1">
                            <span
                                className="
                                    font-space
                                    text-[9px]
                                    uppercase
                                    tracking-[0.18em]
                                    text-steel/40
                                "
                            >
                                KLEBER DEV
                            </span>

                            <span
                                className="
                                    font-space
                                    text-[10px]
                                    text-steel/50
                                "
                            >
                                Software Developer
                            </span>
                        </div>

                        <span
                            className="
                                font-bebas
                                text-2xl
                                tracking-[0.08em]
                                text-steel/20
                            "
                        >
                            01
                        </span>
                    </div>
                </div>
            </aside>
        </div>
    );
}

export default NavbarDesktop;

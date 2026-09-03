import { useEffect, useState, useRef } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import gsap from "gsap";

function MenuMobile({ items = [] }) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);


    const openMenu = () => {
        
        setIsOpen(true);
    };

    const closeMenu = () => {
         if (!menuRef.current) return;

          const links = menuRef.current.querySelectorAll("[data-mobile-menu-link]");

          const tl = gsap.timeline({
              onComplete: () => {
                  setIsOpen(false);
              },
          });

          tl.to(links, {
              opacity: 0,
              x: -20,
              duration: 0.25,
              stagger: 0.05,
              ease: "power2.in",
          });

          tl.to(
              menuRef.current,
              {
                  xPercent: -100,
                  duration: 0.4,
                  ease: "power2.in",
              },
              "-=0.05",
          );

    };

    // =========================================
    // ESC FECHA O MENU
    // =========================================

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

    // =========================================
    // ANIMAÇÃO
    // =========================================

    useEffect(() => {
        if (!isOpen) return;

        requestAnimationFrame(() => {
            const menu = menuRef.current;
            const links = document.querySelectorAll("[data-mobile-menu-link]");

            if (!menu) return;



            gsap.fromTo(
                menu,
                {
                    xPercent: -100,
                },
                {
                    xPercent: 0,
                    duration: 0.50,
                    ease: "power2.out",
                },
            );

            gsap.fromTo(
                links,
                {
                    opacity: 0,
                    x: -20,
                },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.50,
                    stagger: 0.26,
                    delay: 0.15,
                    ease: "power1.out",
                },
            );
        });
    }, [isOpen]);

    // =========================================
    // FECHAR CLICANDO FORA
    // =========================================

    const handleOverlayClick = (event) => {
        if (event.target === event.currentTarget) {
            closeMenu();
        }
    };

    // =========================================
    // CLICAR NO LINK
    // =========================================

    const handleNavigation = (href) => {
        closeMenu();

        setTimeout(() => {
            const section = document.querySelector(href);

            if (section) {
                section.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }
        }, 400);
    };

    return (
        <div className="md:hidden">
            {/* =========================================
                BOTÃO HAMBÚRGUER
            ========================================== */}

            {!isOpen && (
                <button
                    type="button"
                    onClick={openMenu}
                    aria-label="Abrir menu"
                    aria-expanded={isOpen}
                    className="
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-xl
                        
                        text-steel
                        transition-all
                        duration-300
                        hover:border-bronze
                        hover:text-bronze
                        group
                        active:scale-95
                        active:text-bronze/20
                        
                    "
                >
                    <Menu className="h-12 w-12 group-active:text-bronze/29" />
                </button>
            )}

            {/* =========================================
                MENU
            ========================================== */}

            {isOpen && (
                <div
                    className="
                        fixed
                        inset-0
                        z-[100]
                        bg-black/30
                    "
                    onClick={handleOverlayClick}
                >
                    <nav
                        ref={menuRef}
                        data-mobile-menu
                        aria-label="Menu principal"
                        className="
                            relative
                            flex
                            h-full
                            w-[82%]
                            max-w-[360px]
                            flex-col
                            overflow-hidden
                            border-r
                            border-graphite
                            bg-carbon
                            px-6
                            py-6
                            shadow-2xl
                        "
                    >
                        {/* =========================================
                            HEADER
                        ========================================== */}

                        <div className="flex items-center justify-between border-b border-graphite pb-5">
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] uppercase tracking-[0.25em] text-bronze">Navigation</span>

                                <span className="font-space text-lg uppercase text-ivory">Kleber Dev.</span>
                            </div>

                            <button
                                type="button"
                                onClick={closeMenu}
                                aria-label="Fechar menu"
                                className="
                                    flex
                                    h-11
                                    w-11
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
                                    active:scale-95
                                    active:border-bronze
                                    active:text-bronze
                                "
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* =========================================
                            LINKS
                        ========================================== */}

                        <div className="flex flex-1 flex-col pt-8">
                            {items.map((item, index) => (
                                <button
                                    key={item.href}
                                    type="button"
                                    data-mobile-menu-link
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
                                        hover:border-bronze
                                    "
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="font-mono text-[10px] text-bronze">{String(index + 1).padStart(2, "0")}</span>

                                        <span className="font-space text-sm uppercase tracking-wider text-ivory">{item.label}</span>
                                    </div>

                                    <ArrowUpRight
                                        className="
                                            h-4
                                            w-4
                                            text-steel
                                            transition-all
                                            duration-300
                                            group-hover:-translate-y-1
                                            group-hover:translate-x-1
                                            group-hover:text-bronze
                                        "
                                    />
                                </button>
                            ))}
                        </div>

                        {/* =========================================
                            FOOTER
                        ========================================== */}

                        <div className="border-t border-graphite pt-5">
                            <span className="text-[9px] uppercase tracking-[0.2em] text-steel">Kleber Dev · Portfolio</span>
                        </div>
                    </nav>
                </div>
            )}
        </div>
    );
}

export default MenuMobile;

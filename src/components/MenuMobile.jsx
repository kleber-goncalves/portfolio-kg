import { lazy, Suspense, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";
import { Menu, X, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { startSmoothScroll, stopSmoothScroll } from "../utils/lenisControl";
import { playUiSound } from "../utils/uiSfx";
import SoundToggle from "./SoundToggle";
const SoundVolumeSliderMobile = lazy(() => import("./SoundVolumeSliderMobile"));

function MenuMobile({ items = [] }) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const pendingNavigationRef = useRef(null);


    const openMenu = () => {
        playUiSound("open");
        setIsOpen(true);
    };

    const closeMenu = (shouldPlaySound = true) => {
         if (!menuRef.current) return;
         if (shouldPlaySound && isOpen) playUiSound("close");

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
    // BLOQUEIO DA ROLAGEM DA PÁGINA
    // =========================================

    useEffect(() => {
        if (!isOpen) return undefined;

        const html = document.documentElement;
        const body = document.body;
        const scrollY = window.scrollY;

        const previousHtmlOverflow = html.style.overflow;
        const previousHtmlScrollBehavior = html.style.scrollBehavior;
        const previousBodyStyles = {
            position: body.style.position,
            top: body.style.top,
            left: body.style.left,
            right: body.style.right,
            width: body.style.width,
            overflow: body.style.overflow,
        };

        // Pausa o Lenis quando estiver inicializado e bloqueia o scroll nativo.
        stopSmoothScroll();
        html.style.overflow = "hidden";
        html.style.scrollBehavior = "auto";
        body.style.position = "fixed";
        body.style.top = "-" + scrollY + "px";
        body.style.left = "0";
        body.style.right = "0";
        body.style.width = "100%";
        body.style.overflow = "hidden";

        return () => {
            body.style.position = previousBodyStyles.position;
            body.style.top = previousBodyStyles.top;
            body.style.left = previousBodyStyles.left;
            body.style.right = previousBodyStyles.right;
            body.style.width = previousBodyStyles.width;
            body.style.overflow = previousBodyStyles.overflow;

            html.style.overflow = previousHtmlOverflow;
            window.scrollTo(0, scrollY);
            html.style.scrollBehavior = previousHtmlScrollBehavior;

            startSmoothScroll();
        };
    }, [isOpen]);

    // Só navega depois que o painel fechou e o bloqueio da página foi removido.
    useEffect(() => {
        if (isOpen || !pendingNavigationRef.current) return undefined;

        const href = pendingNavigationRef.current;
        pendingNavigationRef.current = null;

        const frameId = requestAnimationFrame(() => {
            const section = document.querySelector(href);

            section?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        });

        return () => cancelAnimationFrame(frameId);
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
        pendingNavigationRef.current = href;
        playUiSound(href === "#hero" ? "back" : "forward");
        closeMenu(false);
    };

    return (
        <div className="b-md:hidden">
            {/* =========================================
                BOTÃO HAMBÚRGUER
            ========================================== */}

            {!isOpen && (
                <button
                    type="button"
                    onClick={openMenu}
                    aria-label="Abrir menu"
                    title="Abrir menu"
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
                        active:text-bronze
                        
                    "
                >
                    <Menu className="h-12 w-12 group-active:text-bronze" />
                </button>
            )}

            {/* =========================================
                MENU
            ========================================== */}

            {isOpen && createPortal(
                <div
                    data-mobile-menu-overlay
                    data-a11y-click-surface="backdrop"
                    className="
                        fixed
                        inset-0
                        z-[9999]
                        overscroll-contain
                        bg-black/30
                        b-md:hidden
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
                            overflow-x-hidden
                            overflow-y-auto
                            overscroll-contain
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
                                title="Fechar menu"
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
                                <Link
                                    key={item.href}
                                    to={item.href}
                                    data-mobile-menu-link
                                    onClick={(event) => {
                                        event.preventDefault();
                                        handleNavigation(item.href);
                                    }}
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
                                        focus-visible:outline
                                        focus-visible:outline-2
                                        focus-visible:outline-offset-4
                                        focus-visible:outline-champagne
                                    "
                                >
                                    <span className="flex items-center gap-4">
                                        <span className="font-mono text-[10px] text-bronze">{String(index + 1).padStart(2, "0")}</span>
                                        <span className="font-space text-sm uppercase tracking-wider text-ivory">{item.label}</span>
                                    </span>

                                    <ArrowUpRight
                                        aria-hidden="true"
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
                                </Link>
                            ))}
                        </div>

                        {/* =========================================
                            FOOTER
                        ========================================== */}

                        <div className="border-t border-graphite pt-5">
                            <SoundToggle />
                            <Suspense
                                fallback={
                                    <div
                                        aria-hidden="true"
                                        className="mt-3 h-[104px] border border-graphite bg-obsidian/40"
                                    />
                                }
                            >
                                <SoundVolumeSliderMobile  />
                            </Suspense>
                            <span className="mt-4 block text-[9px] uppercase tracking-[0.2em] text-steel">Kleber Dev · Portfolio</span>
                        </div>
                    </nav>
                </div>,
                document.body,
            )}
        </div>
    );
}

export default MenuMobile;

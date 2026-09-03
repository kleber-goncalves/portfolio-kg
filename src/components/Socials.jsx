import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

import { ArrowRight, X } from "lucide-react";
import { Github, Linkedin, Instagram } from "@thesvg/react";

function Socials() {
    const [isOpen, setIsOpen] = useState(false);

    const containerRef = useRef(null);
    const buttonRef = useRef(null);
    const progressRef = useRef(null);
    const panelRef = useRef(null);
    const txtRef = useRef(null);

    const startX = useRef(0);
    const currentX = useRef(0);
    const maxDrag = useRef(0);

    const isDragging = useRef(false);

    const socials = [
        {
            name: "GitHub",
            href: "https://github.com/",
            icon: Github,
            variant: "dark",
            
        },
        {
            name: "LinkedIn",
            href: "https://www.linkedin.com/",
            icon: Linkedin,
        },
        {
            name: "Instagram",
            href: "https://instagram.com/",
            icon: Instagram,
        },
    ];

    // =========================================
    // CALCULA A DISTÂNCIA REAL
    // =========================================

    const calculateDragDistance = () => {
        if (!containerRef.current || !buttonRef.current) {
            return;
        }

        const containerWidth = containerRef.current.offsetWidth;

        const buttonWidth = buttonRef.current.offsetWidth;

        // 2 = left: 8px
        // 2 = margem direita
        const distance = containerWidth - buttonWidth - 16;

        maxDrag.current = Math.max(0, distance);
    };

    // =========================================
    // ATUALIZA AO REDIMENSIONAR
    // =========================================

    useEffect(() => {
        calculateDragDistance();

        window.addEventListener("resize", calculateDragDistance);

        return () => {
            window.removeEventListener("resize", calculateDragDistance);
        };
    }, []);

    // =========================================
    // ABRIR PAINEL
    // =========================================

    const openSocials = () => {
        if (isOpen) return;

        setIsOpen(true);

        requestAnimationFrame(() => {
            if (!panelRef.current) return;

            gsap.fromTo(
                panelRef.current,
                {
                    opacity: 0,
                    y: 25,
                    scale: 0.96,
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.45,
                    ease: "power3.out",
                },
            );
        });
    };

    // =========================================
    // FECHAR PAINEL
    // =========================================

    const closeSocials = () => {
        if (!panelRef.current) {
            setIsOpen(false);
            return;
        }

        gsap.to(panelRef.current, {
            opacity: 0,
            y: 20,
            scale: 0.96,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => {
                setIsOpen(false);
            },
        });
    };

      // =========================================
    // FECHAR AO CLICAR FORA
    // =========================================

    useEffect(() => {

        if (!isOpen) return;

        const handleClickOutside = (event) => {

            if (
                panelRef.current &&
                !panelRef.current.contains(event.target)
            ) {
                closeSocials();
            }

        };

        document.addEventListener(
            "pointerdown",
            handleClickOutside
        );

        return () => {

            document.removeEventListener(
                "pointerdown",
                handleClickOutside
            );

        };

    }, [isOpen]);


    // =========================================
    // COMEÇOU A ARRASTAR
    // =========================================

    const handlePointerDown = (event) => {
        if (isOpen) return;

        calculateDragDistance();

        isDragging.current = true;

        startX.current = event.clientX;

        currentX.current = 0;

        event.currentTarget.setPointerCapture(event.pointerId);

        gsap.to(buttonRef.current, {
            scale: 0.94,
            duration: 0.15,
            ease: "power2.out",
        });
        
    };

    // =========================================
    // ARRASTANDO
    // =========================================

    const handlePointerMove = (event) => {
        if (!isDragging.current || isOpen) {
            return;
        }

        const delta = event.clientX - startX.current;

        const distance = Math.max(0, Math.min(delta, maxDrag.current));

        currentX.current = distance;

        // =====================================
        // PROGRESSO
        // =====================================

        const progress = maxDrag.current > 0 ? distance / maxDrag.current : 0;

        // =====================================
        // TEXTO
        // =====================================
        const textOpacity = Math.max(0, 1 - progress * 1.5);
        gsap.set(txtRef.current, {
            opacity: textOpacity,
        });

        // =====================================
        // BOTÃO
        // =====================================

        gsap.set(buttonRef.current, {
            x: distance,
        });

        // =====================================
        // PROGRESSO
        // =====================================

        gsap.set(progressRef.current, {
            scaleX: progress,
        });

    };

    // =========================================
    // TERMINOU O ARRASTE
    // =========================================

    const handlePointerUp = () => {
        if (!isDragging.current) {
            return;
        }

        isDragging.current = false;

        const progress = maxDrag.current > 0 ? currentX.current / maxDrag.current : 0;

        gsap.to(buttonRef.current, {
            scale: 1,
            duration: 0.2,
            ease: "power2.out",
        });

        // =====================================
        // CHEGOU AO FINAL
        // =====================================

        if (progress >= 0.95) {
            gsap.to(buttonRef.current, {
                x: maxDrag.current,
                duration: 0.2,
                ease: "power2.out",
                onComplete: openSocials,
            });

            gsap.to(progressRef.current, {
                scaleX: 1,
                duration: 0.2,
                ease: "power2.out",
            });

            return;
        }

        // =====================================
        // NÃO CHEGOU → VOLTA
        // =====================================

        gsap.to(buttonRef.current, {
            x: 0,
            duration: 0.45,
            ease: "back.out(1.5)",
        });

        gsap.to(progressRef.current, {
            scaleX: 0,
            duration: 0.35,
            ease: "power2.out",
        });
        gsap.to(txtRef.current, {
            opacity: 1,
            duration: 0.35,
            ease: "power2.out",
        });
    };

    return (
        <div ref={containerRef} className="relative w-[78%] md:hidden">
            {/* =====================================
                BOTÃO DE ARRASTE
            ====================================== */}

            {!isOpen && (
                <div
                    className="
                        relative
                        h-16
                        w-full
                        overflow-hidden
                        rounded-2xl
                        border
                        border-graphite
                        bg-carbon
                    "
                >
                    {/* =================================
                        PROGRESSO
                    ================================== */}

                    <div
                        ref={progressRef}
                        className="
                            pointer-events-none
                            absolute
                            inset-y-0
                            left-0
                            w-full
                            origin-left
                            scale-x-0
                            rounded-2xl
                            bg-warm-bronze/15
                        "
                    />

                    {/* =================================
                        TEXTO
                    ================================== */}

                    <div
                        ref={txtRef}
                        className="
                        opacity-100
                            pointer-events-none
                            absolute
                            inset-0
                            flex
                            items-center
                            justify-center
                            gap-2
                            pl-13
                            text-[10px]
                            uppercase
                            tracking-[0.2em]
                            text-steel
                        "
                    >
                        <span>Arraste</span>

                        <span className="text-bronze">→</span>

                        <span className="text-ivory">Redes Sociais</span>
                    </div>

                    {/* =================================
                        BOTÃO ARRASTÁVEL
                    ================================== */}

                    <button
                        ref={buttonRef}
                        type="button"
                        aria-label="Arraste para abrir as redes sociais"
                        onClick={openSocials}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerCancel={handlePointerUp}
                        className="
                            absolute
                            left-2
                            top-2
                            z-20
                            flex
                            h-12
                            w-12
                            touch-none
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-bronze
                            bg-obsidian
                            text-bronze
                        
                        "
                    >
                        <ArrowRight className="h-5 w-5" />
                    </button>
                </div>
            )}

            {/* =====================================
                PAINEL SOCIAL
            ====================================== */}

            {isOpen && (
                <div
                    ref={panelRef}
                    className="
                        relative
                        w-full
                        overflow-hidden
                        rounded-2xl
                        border
                        border-graphite
                        border-t-2
                        border-t-champagne
                        bg-carbon
                        p-5
                    "
                >
                    {/* HEADER */}

                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                            <span
                                className="
                                    text-[9px]
                                    uppercase
                                    tracking-[0.25em]
                                    text-bronze
                                "
                            >
                                Connect
                            </span>

                            <h2
                                className="
                                    font-space
                                    text-lg
                                    uppercase
                                    text-ivory
                                "
                            >
                                Redes Sociais
                            </h2>
                        </div>

                        <button
                            type="button"
                            onClick={closeSocials}
                            aria-label="Fechar redes sociais"
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
                                transition-colors
                                hover:border-bronze
                                hover:text-bronze
                                active:border-bronze
                                active:text-bronze
                            "
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* REDES */}

                    <div className="flex flex-col">
                        {socials.map((social) => {
                            const Icon = social.icon;

                            return (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="
                                        group
                                        flex
                                        items-center
                                        justify-between
                                        border-t
                                        border-graphite
                                        py-4
                                        first:border-t-0
                                    "
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon
                                            className="
                                                h-5
                                                w-5
                                                text-ivory

                                                transition-colors
                                                group-hover:text-bronze
                                            "
                                            variant="dark"
                                        />

                                        <span
                                            className="
                                                text-sm
                                                uppercase
                                                tracking-wider
                                                text-ivory
                                            "
                                        >
                                            {social.name}
                                        </span>
                                    </div>

                                    <ArrowRight
                                        className="
                                            h-4
                                            w-4
                                            text-steel
                                            transition-all
                                            group-hover:translate-x-1
                                            group-hover:text-bronze
                                        "
                                    />
                                </a>
                            );
                        })}
                    </div>

                    {/* FOOTER */}

                    <div
                        className="
                            mt-4
                            border-t
                            border-graphite
                            pt-4
                        "
                    >
                        <span
                            className="
                                text-[9px]
                                uppercase
                                tracking-[0.2em]
                                text-steel
                            "
                        >
                            Encontre-me online
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Socials;

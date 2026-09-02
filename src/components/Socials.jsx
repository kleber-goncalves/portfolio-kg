import { useRef, useState } from "react";
import gsap from "gsap";

import { ArrowRight, X } from "lucide-react";
import { Github, Linkedin, Instagram } from "@thesvg/react";

function Socials() {
    const [isOpen, setIsOpen] = useState(false);

    const buttonRef = useRef(null);
    const progressRef = useRef(null);
    const panelRef = useRef(null);

    const startX = useRef(0);
    const currentX = useRef(0);
    const isDragging = useRef(false);

    const DRAG_DISTANCE = 230;

    const socials = [
        {
            name: "GitHub",
            href: "https://github.com/",
            icon: Github,
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
    // ABRIR
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
                    y: 20,
                    scale: 0.96,
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.4,
                    ease: "power3.out",
                },
            );
        });
    };

    // =========================================
    // FECHAR
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
            duration: 0.25,
            ease: "power2.in",
            onComplete: () => {
                setIsOpen(false);
            },
        });
    };

    // =========================================
    // COMEÇOU A ARRASTAR
    // =========================================

    const handlePointerDown = (event) => {
        if (isOpen) return;

        isDragging.current = true;
        startX.current = event.clientX;
        currentX.current = 0;

        event.currentTarget.setPointerCapture(event.pointerId);

        gsap.to(buttonRef.current, {
            scale: 0.95,
            duration: 0.15,
        });
    };

    // =========================================
    // ARRASTANDO
    // =========================================

    const handlePointerMove = (event) => {
        if (!isDragging.current || isOpen) return;

        const delta = event.clientX - startX.current;

        const distance = Math.max(0, Math.min(delta, DRAG_DISTANCE));

        currentX.current = distance;

        const progress = distance / DRAG_DISTANCE;

        gsap.set(buttonRef.current, {
            x: distance,
        });

        gsap.set(progressRef.current, {
            scaleX: progress,
            transformOrigin: "left center",
        });
    };

    // =========================================
    // TERMINOU O ARRASTE
    // =========================================

    const handlePointerUp = () => {
        if (!isDragging.current) return;

        isDragging.current = false;

        const progress = currentX.current / DRAG_DISTANCE;

        gsap.to(buttonRef.current, {
            scale: 1,
            duration: 0.2,
        });

        // Abre se passou de 50%
        if (progress >= 0.170) {
            gsap.to(buttonRef.current, {
                x: DRAG_DISTANCE,
                duration: 0.4,
                ease: "power2.out",
                onComplete: openSocials,
            });

            return;
        }

        // Volta para o início
        gsap.to(buttonRef.current, {
            x: 0,
            duration: 0.35,
            ease: "back.out(1.5)",
        });

        gsap.to(progressRef.current, {
            scaleX: 0,
            duration: 0.3,
            ease: "power2.out",
        });
    };

    return (
        <div className="relative w-[78%] md:hidden">
            {/* =========================================
                BOTÃO DE ARRASTE
            ========================================== */}

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
                    {/* FUNDO DE PROGRESSO */}

                    <div
                        ref={progressRef}
                        className="
                            absolute
                            inset-0
                            origin-left
                            scale-x-0
                            bg-warm-bronze/15
                        "
                    />

                    {/* TEXTO */}

                    <div
                        className="
                            pointer-events-none
                            absolute
                            inset-0
                            flex
                            items-center
                            justify-center
                            gap-2
                            pl-12
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

                    {/* BOTÃO */}

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
                            shadow-lg
                            shadow-warm-bronze/20
                        "
                    >
                        <ArrowRight className="h-5 w-5" />
                    </button>
                </div>
            )}

            {/* =========================================
                PAINEL
            ========================================== */}

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
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-full
                                border
                                border-graphite
                                text-steel
                                transition-colors
                                hover:border-bronze
                                hover:text-bronze
                            "
                        >
                            <X className="h-4 w-4" />
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
                                                text-steel
                                                transition-colors
                                                group-hover:text-bronze
                                            "
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

import { useEffect, useRef, useLayoutEffect } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

import { tecnologias } from "../data/tecnologias";

function ProjetoDesktop({ projetos, experienceMode = "full" }) {
    // ============================================================
    // MODO DE EXPERIÊNCIA
    // ============================================================

    const isReducedExperience = experienceMode === "reduced";

    // ============================================================
    // REFS
    // ============================================================

    const containerRef = useRef(null);

    const previewRef = useRef(null);
    const previewTrackRef = useRef(null);
    const previewButtonRef = useRef(null);

    const titleRef = useRef(null);
    const lineRef = useRef(null);
    const introRef = useRef(null);

    // ============================================================
    // POSIÇÃO GLOBAL DO MOUSE
    // ============================================================

    const mousePositionRef = useRef({
        x: 0,
        y: 0,
    });

    // ============================================================
    // TIMER DO BOTÃO
    // ============================================================

    const buttonIdleTimeoutRef = useRef(null);

    // ============================================================
    // GSAP — CABEÇALHO
    // ============================================================

    useLayoutEffect(() => {
        const container = containerRef.current;

        if (!container) return;

        const ctx = gsap.context(() => {
            const title = titleRef.current;
            const line = lineRef.current;
            const intro = introRef.current;

            if (!title || !line || !intro) {
                return;
            }

            // ================================================
            // ESTADO INICIAL
            // ================================================

            gsap.set(title, {
                opacity: 0,
                x: -40,
            });

            gsap.set(line, {
                scaleX: 0,
                transformOrigin: "left center",
            });

            gsap.set(intro, {
                opacity: 0,
                x: 30,
            });

            // ================================================
            // TIMELINE DO CABEÇALHO
            // ================================================

            const timeline = gsap.timeline({
                scrollTrigger: {
                    trigger: title,

                    start: "top 90%",
                    end: "top 65%",

                    scrub: 1,

                    markers: false,
                },
            });

            // ================================================
            // 1 — TÍTULO
            // ================================================

            timeline.to(title, {
                opacity: 1,
                x: 0,

                duration: 1,

                ease: "none",
            });

            // ================================================
            // 2 — LINHA
            // ================================================

            timeline.to(
                line,
                {
                    scaleX: 1,

                    duration: 1,

                    ease: "none",
                },
                "-=0.65",
            );

            // ================================================
            // 3 — TEXTO DE APOIO
            // ================================================

            timeline.to(
                intro,
                {
                    opacity: 1,
                    x: 0,

                    duration: 0.8,

                    ease: "none",
                },
                "-=0.55",
            );
        }, container);

        return () => ctx.revert();
    }, []);

    // ============================================================
    // PREVIEW — SOMENTE FULL
    // ============================================================

    useEffect(() => {
        /*
        ========================================================
        REDUCED
        ========================================================

        No Reduced não existe:

        - mousemove
        - IntersectionObserver
        - preview
        - preview track
        - preview button
        - animação seguindo o mouse
        - cálculo de posição
        */

        if (isReducedExperience) {
            return;
        }

        const container = containerRef.current;

        const preview = previewRef.current;

        const previewTrack = previewTrackRef.current;

        const previewButton = previewButtonRef.current;

        if (!container || !preview || !previewTrack || !previewButton) {
            return;
        }

        // ========================================================
        // ESTADO INICIAL DO PREVIEW
        // ========================================================

        gsap.set(preview, {
            scale: 0,

            x: mousePositionRef.current.x,
            y: mousePositionRef.current.y,

            xPercent: -50,
            yPercent: -50,
        });

        // ========================================================
        // ESTADO INICIAL DO BOTÃO
        // ========================================================

        gsap.set(previewButton, {
            x: preview.offsetWidth / 2,

            y: preview.offsetHeight / 2.2,

            scale: 0.75,

            opacity: 0,
        });

        // ========================================================
        // POSIÇÃO GLOBAL DO MOUSE
        // ========================================================

        const handleGlobalMouseMove = (event) => {
            mousePositionRef.current.x = event.clientX;

            mousePositionRef.current.y = event.clientY;
        };

        // ========================================================
        // CENTRALIZAR BOTÃO
        // ========================================================

        const centerPreviewButton = (duration = 0.6) => {
            if (!previewButton || !preview) {
                return;
            }

            gsap.to(previewButton, {
                x: preview.offsetWidth / 2,

                y: preview.offsetHeight / 2.2,

                duration,

                ease: "power3.out",

                overwrite: "auto",
            });
        };

        // ========================================================
        // ESCONDER PREVIEW
        // ========================================================

        const hidePreview = () => {
            clearTimeout(buttonIdleTimeoutRef.current);

            // ================================================
            // BOTÃO
            // ================================================

            gsap.to(previewButton, {
                x: preview.offsetWidth / 2,

                y: preview.offsetHeight / 2.2,

                scale: 0.75,

                opacity: 0,

                duration: 0.25,

                ease: "power3.in",

                overwrite: "auto",
            });

            // ================================================
            // PREVIEW
            // ================================================

            gsap.to(preview, {
                scale: 0,

                duration: 0.25,

                ease: "power3.in",

                overwrite: true,
            });
        };

        // ========================================================
        // MOVIMENTO DO MOUSE
        // ========================================================

        const handleMouseMove = (event) => {
            // ================================================
            // MOVE PREVIEW
            // ================================================

            gsap.to(preview, {
                x: event.clientX,

                y: event.clientY,

                duration: 1.45,

                ease: "power3.out",

                overwrite: "auto",
            });

            // ================================================
            // RETÂNGULO DO PREVIEW
            // ================================================

            const previewRect = preview.getBoundingClientRect();

            const buttonRect = previewButton.getBoundingClientRect();

            // ================================================
            // MOUSE RELATIVO AO PREVIEW
            // ================================================

            const relativeX = event.clientX - previewRect.left;

            const relativeY = event.clientY - previewRect.top;

            // ================================================
            // ÁREA SEGURA
            // ================================================

            const padding = 24;

            const minX = padding + buttonRect.width / 2;

            const maxX = previewRect.width - padding - buttonRect.width / 2;

            const minY = padding + buttonRect.height / 2.2;

            const maxY = previewRect.height - padding - buttonRect.height / 2.2;

            // ================================================
            // LIMITA O BOTÃO
            // ================================================

            const buttonX = Math.min(Math.max(relativeX, minX), maxX);

            const buttonY = Math.min(Math.max(relativeY, minY), maxY);

            // ================================================
            // MOVE BOTÃO
            // ================================================

            gsap.to(previewButton, {
                x: buttonX,

                y: buttonY,

                duration: 0.35,

                ease: "power3.out",

                overwrite: "auto",
            });

            // ================================================
            // DETECTA MOUSE PARADO
            // ================================================

            clearTimeout(buttonIdleTimeoutRef.current);

            buttonIdleTimeoutRef.current = setTimeout(() => {
                centerPreviewButton(0.7);
            }, 120);
        };

        // ========================================================
        // ENTRADA EM UM PROJETO
        // ========================================================

        const handleMouseEnter = (event) => {
            const index = Number(event.currentTarget.dataset.projectIndex);

            // ================================================
            // CANCELA TIMER
            // ================================================

            clearTimeout(buttonIdleTimeoutRef.current);

            // ================================================
            // POSIÇÃO ATUAL DO PREVIEW
            // ================================================

            gsap.set(preview, {
                x: mousePositionRef.current.x,

                y: mousePositionRef.current.y,
            });

            // ================================================
            // RESET DO BOTÃO
            // ================================================

            gsap.set(previewButton, {
                x: preview.offsetWidth / 2,

                y: preview.offsetHeight / 2.2,

                scale: 0.75,

                opacity: 1,
            });

            // ================================================
            // MOSTRA PREVIEW
            // ================================================

            gsap.to(preview, {
                scale: 1,

                duration: 0.5,

                ease: "power3.out",

                overwrite: "auto",
            });

            // ================================================
            // ENTRADA DO BOTÃO
            // ================================================

            gsap.to(previewButton, {
                opacity: 1,

                duration: 0.5,

                delay: 0.08,

                ease: "power3.out",

                overwrite: "auto",
            });

            // ================================================
            // TROCA IMAGEM
            // ================================================

            gsap.to(previewTrack, {
                yPercent: -(index * 100),

                duration: 0.65,

                ease: "power3.out",

                overwrite: "auto",
            });
        };

        // ========================================================
        // SAÍDA DA SEÇÃO
        // ========================================================

        const handleContainerLeave = () => {
            hidePreview();
        };

        // ========================================================
        // INTERSECTION OBSERVER
        // ========================================================

        const observer = new IntersectionObserver(
            ([entry]) => {
                // ============================================
                // SAIU DA VIEWPORT
                // ============================================

                if (!entry.isIntersecting) {
                    hidePreview();

                    return;
                }

                // ============================================
                // VOLTOU PARA VIEWPORT
                // ============================================

                gsap.set(preview, {
                    x: mousePositionRef.current.x,

                    y: mousePositionRef.current.y,
                });
            },
            {
                threshold: 0.1,
            },
        );

        observer.observe(container);

        // ========================================================
        // PROJETOS
        // ========================================================

        const projectElements = container.querySelectorAll("[data-project-index]");

        // ========================================================
        // EVENTOS
        // ========================================================

        window.addEventListener("mousemove", handleGlobalMouseMove);

        container.addEventListener("mousemove", handleMouseMove);

        container.addEventListener("mouseleave", handleContainerLeave);

        projectElements.forEach((project) => {
            project.addEventListener("mouseenter", handleMouseEnter);
        });

        // ========================================================
        // CLEANUP
        // ========================================================

        return () => {
            window.removeEventListener("mousemove", handleGlobalMouseMove);

            container.removeEventListener("mousemove", handleMouseMove);

            container.removeEventListener("mouseleave", handleContainerLeave);

            projectElements.forEach((project) => {
                project.removeEventListener("mouseenter", handleMouseEnter);
            });

            observer.disconnect();

            clearTimeout(buttonIdleTimeoutRef.current);

            gsap.killTweensOf(preview);

            gsap.killTweensOf(previewTrack);

            gsap.killTweensOf(previewButton);
        };
    }, [isReducedExperience, projetos]);

    // ============================================================
    // RENDER
    // ============================================================

    return (
        <section
            ref={containerRef}
            className="
                relative
                min-h-screen
                w-full
                overflow-visible
                bg-obsidian
                px-10
                py-24
            "
        >
            <div
                className="
                    mx-auto
                    flex
                    w-full
                    max-w-[1500px]
                    flex-col
                "
            >
                {/* ==================================================
                    CABEÇALHO
                ================================================== */}

                <div
                    className="
                        mb-14
                        flex
                        items-end
                        justify-between
                        border-graphite
                        pb-6
                    "
                >
                    <div
                        className="
                            flex
                            w-full
                            flex-row
                            items-center
                            gap-3
                        "
                    >
                        {/* TÍTULO */}

                        <h2
                            ref={titleRef}
                            className="
                                text-7xl
                                uppercase
                                tracking-wide
                                text-steel
                                lg:text-7xl
                            "
                        >
                            // Projetos
                        </h2>

                        {/* LINHA */}

                        <span
                            ref={lineRef}
                            className="
                                h-0.5
                                flex-1
                                bg-gradientaa
                                md:h-1
                            "
                        />

                        {/* DESCRIÇÃO */}

                        <p
                            ref={introRef}
                            className="
                                hidden
                                max-w-md
                                text-right
                                text-sm
                                leading-6
                                text-steel
                                lg:block
                            "
                        >
                            Uma seleção de projetos desenvolvidos durante minha evolução como desenvolvedor
                        </p>
                    </div>
                </div>

                {/* ==================================================
                    LISTA DE PROJETOS
                ================================================== */}

                <div
                    className="
                        flex
                        w-full
                        flex-col
                    "
                >
                    {projetos.map((projeto, index) => {
                        /*
                            ==================================================
                            ELEMENTO RAIZ DO PROJETO
                            ==================================================

                            FULL:

                            <a>

                            REDUCED:

                            <div>

                            Assim o projeto inteiro deixa de
                            ser um link no Reduced.
                            */

                        const ProjectContent = isReducedExperience ? "div" : "a";

                        return (
                            <article
                                key={projeto.numero}
                                data-project-index={index}
                                className="
                                        group
                                        relative
                                        flex
                                        min-h-[155px]
                                        w-full
                                        items-center
                                        justify-between
                                        border-b
                                        border-graphite
                                        transition-colors
                                        duration-500
                                        last:border-b
                                        hover:border-bronze/50
                                    "
                            >
                                {/* ==================================================
                                        CONTEÚDO PRINCIPAL
                                    ================================================== */}

                                <div
                                    className="
                                            flex
                                            w-full
                                            items-center
                                            justify-between
                                            gap-8
                                        "
                                >
                                    {/* ==================================================
                                            PROJETO
                                        ================================================== */}

                                    <ProjectContent
                                        /*
                                            ==================================================
                                            PROPRIEDADES DO <a>
                                            ==================================================

                                            Essas propriedades só
                                            são enviadas no Full.

                                            No Reduced não existe
                                            href, target ou rel.
                                            */

                                        {...(!isReducedExperience && {
                                            href: projeto.demo,

                                            target: "_blank",

                                            rel: "noopener noreferrer",
                                        })}
                                        className="
                                                group
                                                min-w-0
                                                flex-1
                                                py-8
                                                transition-colors
                                            "
                                    >
                                        <div
                                            className="
                                                    flex
                                                    min-w-0
                                                    items-center
                                                    gap-8
                                                "
                                        >
                                            {/* ==========================================
                                                    NÚMERO
                                                ========================================== */}

                                            <span
                                                className="
                                                        w-10
                                                        shrink-0
                                                        font-bebas
                                                        text-sm
                                                        tracking-[0.2em]
                                                        text-bronze
                                                        opacity-60
                                                        transition-colors
                                                        duration-500
                                                        group-hover:text-bronze
                                                        group-hover:opacity-100
                                                    "
                                            >
                                                {projeto.numero}
                                            </span>

                                            {/* ==========================================
                                                    INFORMAÇÕES
                                                ========================================== */}

                                            <div
                                                className="
                                                        flex
                                                        min-w-0
                                                        flex-col
                                                        gap-2
                                                    "
                                            >
                                                {/* TÍTULO */}

                                                <h3
                                                    className="
                                                            font-space
                                                            text-2xl
                                                            font-semibold
                                                            leading-tight
                                                            text-ivory/40
                                                            transition
                                                            duration-500
                                                            ease-out
                                                            group-hover:translate-x-2
                                                            group-hover:text-ivory
                                                            lg:text-4xl
                                                        "
                                                >
                                                    {projeto.titulo}
                                                </h3>

                                                {/* DESCRIÇÃO */}

                                                <p
                                                    className="
                                                            max-w-2xl
                                                            text-sm
                                                            leading-6
                                                            text-steel
                                                            transition-transform
                                                            duration-500
                                                            ease-out
                                                            group-hover:translate-x-4
                                                        "
                                                >
                                                    {projeto.descricao}
                                                </p>

                                                {/* ======================================
                                                        TECNOLOGIAS
                                                    ====================================== */}

                                                <div
                                                    className="
                                                            mt-1
                                                            flex
                                                            flex-wrap
                                                            gap-x-3
                                                            gap-y-1
                                                        "
                                                >
                                                    {projeto.tecnologias.map((tecnologia) => {
                                                        const tech = tecnologias[tecnologia];

                                                        if (!tech) {
                                                            return null;
                                                        }

                                                        const Icon = tech.icone;

                                                        return (
                                                            <span
                                                                key={tecnologia}
                                                                className={`
                                                                                inline-flex
                                                                                h-fit
                                                                                w-fit
                                                                                items-center
                                                                                gap-1.5
                                                                                rounded-full
                                                                                border
                                                                                border-transparent
                                                                                px-3
                                                                                py-2
                                                                                text-[11px]
                                                                                tracking-[0.15em]
                                                                                text-steel/60
                                                                                transition-all
                                                                                duration-500
                                                                                ease-out
                                                                                group-hover:translate-x-2
                                                                                ${tech.hoverBorder}
                                                                                group-hover:text-white
                                                                            `}
                                                            >
                                                                {Icon && (
                                                                    <Icon
                                                                        className={`
                                                                                            h-4.5
                                                                                            w-4.5
                                                                                            ${tech.icon}
                                                                                        `}
                                                                    />
                                                                )}

                                                                {tech.nome}
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </ProjectContent>

                                    {/* ==================================================
                                            BOTÕES — REDUCED
                                        ================================================== */}

                                    {isReducedExperience && (
                                        <div
                                            className="
                                                    flex
                                                    shrink-0
                                                    items-center
                                                    gap-3
                                                    py-8
                                                "
                                        >
                                            {/* ==========================================
                                                    DEMO
                                                ========================================== */}

                                            {projeto.demo && (
                                                <a
                                                    href={projeto.demo}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="
                                                            inline-flex
                                                            items-center
                                                            justify-center
                                                            rounded-full
                                                            border
                                                            border-graphite
                                                            px-4
                                                            py-2.5
                                                            font-bebas
                                                            text-xs
                                                            uppercase
                                                            tracking-[0.15em]
                                                            text-steel
                                                            transition-all
                                                            duration-300
                                                            hover:border-bronze
                                                            hover:bg-bronze/5
                                                            hover:text-bronze
                                                        "
                                                >
                                                    Demo ↗
                                                </a>
                                            )}

                                            {/* ==========================================
                                                    GITHUB
                                                ========================================== */}

                                            {projeto.github && (
                                                <a
                                                    href={projeto.github}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="
                                                            inline-flex
                                                            items-center
                                                            justify-center
                                                            rounded-full
                                                            border
                                                            border-graphite
                                                            px-4
                                                            py-2.5
                                                            font-bebas
                                                            text-xs
                                                            uppercase
                                                            tracking-[0.15em]
                                                            text-steel
                                                            transition-all
                                                            duration-300
                                                            hover:border-bronze
                                                            hover:bg-bronze/5
                                                            hover:text-bronze
                                                        "
                                                >
                                                    GitHub ↗
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>

            {/* ======================================================
                PREVIEW FLUTUANTE
                SOMENTE NO FULL
            ======================================================= */}

            {!isReducedExperience && (
                <div
                    ref={previewRef}
                    className="
                        pointer-events-none
                        fixed
                        left-0
                        top-0
                        z-50
                        hidden
                        h-[360px]
                        w-[560px]
                        overflow-hidden
                        border
                        border-graphite
                        bg-carbon
                        shadow-2xl
                        shadow-black
                        lg:block
                    "
                >
                    {/* ==============================================
                        TRACK DAS IMAGENS
                    ============================================== */}

                    <div
                        ref={previewTrackRef}
                        className="
                            flex
                            h-full
                            w-full
                            flex-col
                        "
                    >
                        {projetos.map((projeto) => (
                            <div
                                key={projeto.numero}
                                className="
                                        h-[360px]
                                        w-full
                                        shrink-0
                                    "
                            >
                                <img
                                    src={projeto.preview || projeto.imagens?.[0]}
                                    alt={`Preview de ${projeto.titulo}`}
                                    className="
                                            h-full
                                            w-full
                                            object-cover
                                        "
                                />
                            </div>
                        ))}
                    </div>

                    {/* ==============================================
                        OVERLAY
                    ============================================== */}

                    <div
                        className="
                            pointer-events-none
                            absolute
                            inset-0
                            bg-gradient-to-t
                            from-black/40
                            via-transparent
                            to-transparent
                        "
                    />

                    {/* ==============================================
                        BOTÃO PREVIEW
                    ============================================== */}

                    <button
                        ref={previewButtonRef}
                        className="
                            pointer-events-none
                            absolute
                            left-0
                            top-0
                            z-20
                            flex
                            -translate-x-1/2
                            -translate-y-1/2
                            items-center
                            rounded-full
                            border
                            border-white/20
                            bg-black/50
                            p-15
                            backdrop-blur-md
                        "
                    >
                        <span
                            className="
                                font-space
                                text-2xl
                                text-white
                            "
                        >
                            View
                        </span>
                    </button>
                </div>
            )}
        </section>
    );
}

export default ProjetoDesktop;

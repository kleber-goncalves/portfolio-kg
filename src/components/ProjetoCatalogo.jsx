import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "motion/react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { playUiSound } from "../utils/uiSfx";

import { CATEGORIAS_PROJETOS, projetosCatalogo } from "../data/projetosCatalogo";
import { tecnologias } from "../data/tecnologias";
import MagneticExternalLinkHover from "./MagneticExternalLinkHover";
import { scrollToTarget } from "../utils/lenisControl";
import useResponsive from "../hooks/useResponsive";

const PROJECTS_PAGE_SIZE = 10;

function CategoriaFilterButton({ categoria, quantidade, ativa, onClick, isMobileLayout }) {
    const [isHovered, setIsHovered] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const isInteractive = (!isMobileLayout && isHovered) || isFocused;
    const isHighlighted = ativa || isInteractive;

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springX = useSpring(x, {
        stiffness: 280,
        damping: 12,
        mass: 1.1,
    });

    const springY = useSpring(y, {
        stiffness: 280,
        damping: 12,
        mass: 1.1,
    });

    const originX = useMotionValue(0.5);
    const originY = useMotionValue(0.5);
    const transformOrigin = useTransform(
        [originX, originY],
        ([originXValue, originYValue]) =>
            `${originXValue * 100}% ${originYValue * 100}%`,
    );

    const updateFillOrigin = (event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const relativeX = (event.clientX - rect.left) / rect.width;
        const relativeY = (event.clientY - rect.top) / rect.height;

        originX.set(Math.min(1, Math.max(0, relativeX)));
        originY.set(Math.min(1, Math.max(0, relativeY)));
    };

    const handleMouseEnter = (event) => {
        if (isMobileLayout) return;

        updateFillOrigin(event);
        setIsHovered(true);
    };

    const handleMouseMove = (event) => {
        if (isMobileLayout) return;

        const rect = event.currentTarget.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        x.set((mouseX - rect.width / 2) * 0.2);
        y.set((mouseY - rect.height / 2) * 0.2);
        updateFillOrigin(event);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        x.set(0);
        y.set(0);
    };

    return (
        <motion.button
            type="button"
            aria-pressed={ativa}
            aria-label={`${categoria}, ${quantidade} projetos`}
            data-ui-sfx-hover
            onPointerDown={() => playUiSound("press")}
            onClick={(event) => {
                onClick();

                if (event.detail === 0) {
                    playUiSound("press");
                }
            }}
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={{
                x: isMobileLayout ? 0 : springX,
                y: isMobileLayout ? 0 : springY,
                borderColor: ativa ? "#A87852" : "#242424",
            }}
            className={`
                relative
                control-size-standard
                inline-flex
                items-center
                justify-center
                gap-2
                overflow-hidden
                rounded-sm
                cursor-pointer
                border
                px-3
                py-2
                text-xs
                font-medium
                uppercase
                tracking-[0.12em]
                focus-visible:outline
                focus-visible:outline-2
                focus-visible:outline-offset-2
                focus-visible:outline-champagne
                ${ativa ? "bg-bronze/10" : ""}
            `}
        >
            <motion.span
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    inset-[-5px]
                    z-0
                    rounded-sm
                "
                style={{
                    backgroundColor: "#A87852",
                    transformOrigin: isMobileLayout ? "50% 50%" : transformOrigin,
                }}
                initial={isMobileLayout ? false : { scale: 0, opacity: 0 }}
                animate={{
                    scale: isHighlighted ? 1 : 0,
                    opacity: isHighlighted ? 1 : 0,
                }}
                transition={
                    isMobileLayout
                        ? { duration: 0 }
                        : {
                            scale: {
                                type: "spring",
                                stiffness: 150,
                                damping: 22,
                                mass: 0.75,
                            },
                            opacity: {
                                duration: 0.25,
                                ease: [0.16, 1, 0.3, 1],
                            },
                        }
                }
            />

            <motion.span
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    inset-0
                    z-[1]
                    rounded-sm
                    border
                "
                style={{ borderColor: "#A87852" }}
                animate={{ opacity: isHighlighted ? 1 : 0 }}
                transition={
                    isMobileLayout
                        ? { duration: 0 }
                        : {
                            duration: 0.2,
                            ease: [0.16, 1, 0.3, 1],
                        }
                }
            />

            <motion.span
                className="relative z-10 inline-flex items-center gap-2"
                style={{
                    color: isHighlighted ? "#0D0D0D" : "#8B8B8B",
                }}
                animate={{
                    y: isInteractive ? -0.5 : 0,
                    letterSpacing: isHighlighted ? "0.14em" : "0.12em",
                }}
                transition={{
                    y: {
                        type: "spring",
                        stiffness: 430,
                        damping: 18,
                        mass: 0.4,
                    },
                    letterSpacing: {
                        duration: 0.24,
                        ease: [0.16, 1, 0.3, 1],
                    },
                }}
            >
                <span>{categoria}</span>
                <span
                    style={{
                        color: isHighlighted ? "#0D0D0D" : "#8B8B8B",
                    }}
                >
                    {quantidade.toString().padStart(2, "0")}
                </span>
            </motion.span>
        </motion.button>
    );
}


function ProjectViewportReveal({ projectId, animate, isMobileLayout, children }) {
    const viewportRef = useRef(null);
    const isInView = useInView(viewportRef, {
        once: true,
        amount: 0.15,
        initial: !animate,
    });
    const useScaleReveal = animate && !isMobileLayout;
    const useScrollReveal = animate && isMobileLayout;

    return (
        <div
            ref={viewportRef}
            data-project-id={projectId}
            data-project-scroll-reveal
            className="w-full"
            style={
                useScrollReveal
                    ? { opacity: 0, transform: "translateY(75px)" }
                    : undefined
            }
        >
            <motion.div
                initial={useScaleReveal ? { scale: 0 } : false}
                animate={useScaleReveal ? { scale: isInView ? 1 : 0 } : undefined}
                transition={
                    useScaleReveal
                        ? { duration: 0.65, ease: [0.22, 1, 0.36, 1] }
                        : undefined
                }
                style={useScaleReveal ? { transformOrigin: "center center" } : undefined}
                className="w-full"
            >
                {children}
            </motion.div>
        </div>
    );
}

function ProjetoCatalogo({ experienceMode = "full" }) {
    const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");
    const [currentPage, setCurrentPage] = useState(1);
    const [hoveredPaginationControl, setHoveredPaginationControl] = useState(null);
    const [projetoSobCursor, setProjetoSobCursor] = useState(null);
    const sectionRef = useRef(null);
    const projectsListRef = useRef(null);
    const pointerPositionRef = useRef({ x: null, y: null });
    const projetoSobCursorRef = useRef(null);
    const animateProjectsOnScroll = experienceMode !== "reduced";
    const { isMobileLayout } = useResponsive();

    useEffect(() => {
        const section = sectionRef.current;

        if (!section) return undefined;

        // A atualização por scroll é pensada para mouse/trackpad, sem simular
        // hover persistente em dispositivos primariamente táteis.
        const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");

        if (!mediaQuery.matches) return undefined;

        let frameId = null;

        const updateHoveredProject = () => {
            frameId = null;

            const { x, y } = pointerPositionRef.current;
            let nextProjectId = null;

            if (x !== null && y !== null) {
                const projectRows = section.querySelectorAll("[data-project-id]");

                for (const row of projectRows) {
                    const rect = row.getBoundingClientRect();

                    if (
                        rect.width > 0 &&
                        rect.height > 0 &&
                        x >= rect.left &&
                        x <= rect.right &&
                        y >= rect.top &&
                        y <= rect.bottom
                    ) {
                        nextProjectId = row.getAttribute("data-project-id");
                        break;
                    }
                }
            }

            if (projetoSobCursorRef.current !== nextProjectId) {
                projetoSobCursorRef.current = nextProjectId;
                setProjetoSobCursor(nextProjectId);
            }
        };

        const scheduleUpdate = () => {
            if (frameId !== null) return;

            frameId = window.requestAnimationFrame(updateHoveredProject);
        };

        const handlePointerMove = (event) => {
            pointerPositionRef.current = {
                x: event.clientX,
                y: event.clientY,
            };

            scheduleUpdate();
        };

        const handlePointerLeave = () => {
            pointerPositionRef.current = { x: null, y: null };
            scheduleUpdate();
        };

        window.addEventListener("pointermove", handlePointerMove, { passive: true });
        // Capture permite detectar rolagens iniciadas em contêineres aninhados.
        window.addEventListener("scroll", scheduleUpdate, { passive: true, capture: true });
        window.addEventListener("resize", scheduleUpdate, { passive: true });
        window.addEventListener("pointerleave", handlePointerLeave);

        // Recalcula quando o filtro ou a página renderizada muda.
        scheduleUpdate();

        return () => {
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("scroll", scheduleUpdate, true);
            window.removeEventListener("resize", scheduleUpdate);
            window.removeEventListener("pointerleave", handlePointerLeave);

            if (frameId !== null) {
                window.cancelAnimationFrame(frameId);
            }
        };
    }, [categoriaAtiva, currentPage]);

    // No mobile, replica a entrada dos cards de Competências com GSAP/ScrollTrigger.
    // O desktop mantém a animação de escala em ProjectViewportReveal.
    useEffect(() => {
        if (!animateProjectsOnScroll || !isMobileLayout) return undefined;

        const section = sectionRef.current;
        if (!section) return undefined;

        let cancelled = false;
        let context;
        let animatedCards = [];

        const initializeMobileReveal = async () => {
            try {
                const [gsapModule, scrollTriggerModule] = await Promise.all([
                    import("gsap"),
                    import("gsap/ScrollTrigger"),
                ]);

                if (cancelled) return;

                const gsap = gsapModule.default ?? gsapModule.gsap;
                const { ScrollTrigger } = scrollTriggerModule;

                gsap.registerPlugin(ScrollTrigger);

                animatedCards = Array.from(
                    section.querySelectorAll("[data-project-scroll-reveal]"),
                );

                context = gsap.context(() => {
                    animatedCards.forEach((card) => {
                        gsap.set(card, {
                            opacity: 0,
                            y: 75,
                        });

                        const cardTimeline = gsap.timeline({
                            scrollTrigger: {
                                trigger: card,
                                start: "top 95%",
                                end: "top 55%",
                                scrub: 1,
                                markers: false,
                            },
                        });

                        cardTimeline.to(card, {
                            opacity: 1,
                            y: 0,
                            duration: 1,
                            ease: "none",
                        });
                    });
                }, section);

                ScrollTrigger.refresh();
            } catch (error) {
                if (!cancelled) {
                    context?.revert();
                    section.querySelectorAll("[data-project-scroll-reveal]").forEach((card) => {
                        card.style.removeProperty("opacity");
                        card.style.removeProperty("transform");
                    });

                    console.error(
                        "Não foi possível inicializar a animação mobile dos projetos.",
                        error,
                    );
                }
            }
        };

        void initializeMobileReveal();

        return () => {
            cancelled = true;
            context?.revert();

            // Ao mudar de breakpoint, restaura os itens ainda montados.
            animatedCards.forEach((card) => {
                if (!card.isConnected) return;

                card.style.removeProperty("opacity");
                card.style.removeProperty("transform");
            });
        };
    }, [categoriaAtiva, currentPage, isMobileLayout, animateProjectsOnScroll]);

    const projetosFiltrados = categoriaAtiva === "Todos"
        ? projetosCatalogo
        : projetosCatalogo.filter(
            (projeto) => projeto.categoria === categoriaAtiva,
        );
    const totalPages = Math.ceil(projetosFiltrados.length / PROJECTS_PAGE_SIZE);
    const primeiroIndiceVisivel = (currentPage - 1) * PROJECTS_PAGE_SIZE;
    const projetosVisiveis = projetosFiltrados.slice(
        primeiroIndiceVisivel,
        primeiroIndiceVisivel + PROJECTS_PAGE_SIZE,
    );
    const primeiroProjetoVisivel = projetosVisiveis.length > 0
        ? primeiroIndiceVisivel + 1
        : 0;
    const ultimoProjetoVisivel = Math.min(
        currentPage * PROJECTS_PAGE_SIZE,
        projetosFiltrados.length,
    );

    const pageChangeSequenceRef = useRef(0);

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;

        setHoveredPaginationControl(null);

        const sequence = pageChangeSequenceRef.current + 1;
        pageChangeSequenceRef.current = sequence;

        const scrollStarted = scrollToTarget(0, {
            duration: 0.75,
            onComplete: () => {
                // Ignora callbacks de rolagens anteriores se outro controle foi acionado.
                if (pageChangeSequenceRef.current !== sequence) return;
                setCurrentPage(page);
            },
        });

        if (!scrollStarted) {
            setCurrentPage(page);
        }
    };

    // A troca de categoria ou página altera a altura do documento. Recalcula
    // as posições dos ScrollTriggers depois que o React atualizar a lista.
    useEffect(() => {
        let cancelled = false;
        let firstFrame = 0;
        let secondFrame = 0;

        firstFrame = window.requestAnimationFrame(() => {
            secondFrame = window.requestAnimationFrame(async () => {
                try {
                    const { ScrollTrigger } = await import("gsap/ScrollTrigger");
                    if (cancelled) return;

                    ScrollTrigger.refresh(true);
                } catch (error) {
                    if (!cancelled) {
                        console.error(
                            "Não foi possível atualizar os ScrollTriggers após mudar a página de projetos.",
                            error,
                        );
                    }
                }
            });
        });

        return () => {
            cancelled = true;
            window.cancelAnimationFrame(firstFrame);
            window.cancelAnimationFrame(secondFrame);
        };
    }, [categoriaAtiva, currentPage]);

    return (
        <section ref={sectionRef} className="mx-auto w-full b-md:max-w-[1500px] px-5 pb-16 b-md:px-10 b-md:pb-24">
            {/* FILTROS DO CATÁLOGO */}
            <div data-route-entrance="content" className="mb-8 border-b border-graphite pb-6">
                <p className="mb-4 text-xs uppercase tracking-[0.18em] text-steel">
                    {primeiroProjetoVisivel}–{ultimoProjetoVisivel} de {projetosFiltrados.length} projetos
                </p>

                <div aria-label="Filtrar projetos por categoria" className="flex flex-wrap gap-2" role="group">
                    {CATEGORIAS_PROJETOS.map((categoria) => {
                        const quantidade = categoria === "Todos" ? projetosCatalogo.length : projetosCatalogo.filter((projeto) => projeto.categoria === categoria).length;
                        const ativa = categoriaAtiva === categoria;

                        return <CategoriaFilterButton
                            key={categoria}
                            categoria={categoria}
                            quantidade={quantidade}
                            ativa={ativa}
                            isMobileLayout={isMobileLayout}
                            onClick={() => {
                                pageChangeSequenceRef.current += 1;
                                setCategoriaAtiva(categoria);
                                setCurrentPage(1);
                                setHoveredPaginationControl(null);
                            }}
                        />;
                    })}
                </div>
            </div>

            {/* LISTA — MESMA LINGUAGEM VISUAL DO PROJETODESKTOP EM REDUCED */}
            <div ref={projectsListRef} className="flex w-full flex-col scroll-mt-6" aria-live="polite">
                {projetosVisiveis.map((projeto) => {
                    const isCursorHovered = projetoSobCursor === projeto.id;

                    return (
                        <ProjectViewportReveal
                            key={`${categoriaAtiva}:${projeto.id}`}
                            projectId={projeto.id}
                            animate={animateProjectsOnScroll}
                            isMobileLayout={isMobileLayout}
                        >
                        <article
                            data-cursor-hover={isCursorHovered ? "true" : "false"}
                            data-ui-sfx-hover
                            className="
                            group
                            relative
                            w-full
                            border-b
                            border-graphite
                            py-6
                            transition-colors
                            duration-500
                            hover:border-bronze/50
                            data-[cursor-hover=true]:border-bronze/50
                            b-md:py-8
                        "
                        >
                            <div data-cursor-hover={isCursorHovered ? "true" : "false"} className="group/preview flex w-full flex-col gap-4 b-md:flex-row b-md:items-center b-md:justify-between b-md:gap-8">
                                <div className="flex min-w-0 flex-1 items-start gap-4 b-md:gap-8">
                                    <span
                                        aria-hidden="true"
                                        className="
                                        w-7
                                        shrink-0
                                        pt-1
                                        font-bebas
                                        text-sm
                                        tracking-[0.2em]
                                        text-bronze
                                        opacity-60
                                        transition-opacity
                                        duration-500
                                        group-hover:opacity-100
                                        group-data-[cursor-hover=true]:opacity-100
                                        b-md:w-10
                                    "
                                    >
                                        {projeto.numero}
                                    </span>

                                    <div className="flex min-w-0 flex-col gap-2">
                                        <h2
                                            className="
                                            font-space
                                            text-xl
                                            font-semibold
                                            leading-tight
                                            text-ivory/70
                                            transition
                                            duration-500
                                            ease-out
                                            group-hover:translate-x-1
                                            group-hover:text-ivory
                                            group-data-[cursor-hover=true]:translate-x-1
                                            group-data-[cursor-hover=true]:text-ivory
                                            b-md:text-2xl
                                            c-lg:text-4xl
                                        "
                                        >
                                            {projeto.titulo}
                                        </h2>

                                        <p
                                            className="
                                            max-w-3xl
                                            text-sm
                                            leading-6
                                            text-steel
                                            transition-transform
                                            duration-500
                                            ease-out
                                            group-hover:translate-x-1
                                            group-data-[cursor-hover=true]:translate-x-1
                                            b-md:group-hover:translate-x-2
                                            b-md:group-data-[cursor-hover=true]:translate-x-2
                                        "
                                        >
                                            {projeto.descricao}
                                        </p>

                                        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
                                            {projeto.tecnologias.map((nomeTecnologia) => {
                                                const tecnologia = tecnologias[nomeTecnologia];
                                                const Icone = tecnologia?.icone;

                                                return (
                                                    <span
                                                        key={nomeTecnologia}
                                                        className={`
                                                        inline-flex
                                                        h-fit
                                                        w-fit
                                                        items-center
                                                        gap-1.5
                                                        rounded-sm
                                                        border
                                                        border-transparent
                                                        px-2
                                                        py-1.5
                                                        text-[11px]
                                                        tracking-[0.08em]
                                                        text-steel
                                                        transition-all
                                                        duration-500
                                                        ease-out
                                                        group-hover:translate-x-1
                                                        group-data-[cursor-hover=true]:translate-x-1
                                                        group-data-[cursor-hover=true]:border-bronze/50
                                                        ${tecnologia?.hoverBorder ?? "group-hover:border-bronze/50"}
                                                        group-hover:text-white
                                                        group-data-[cursor-hover=true]:text-white
                                                        b-md:px-3
                                                    `}
                                                    >
                                                        {Icone && <Icone aria-hidden="true" className={`h-4 w-4 ${tecnologia.icon}`} />}
                                                        {tecnologia?.nome ?? nomeTecnologia}
                                                    </span>
                                                );
                                            })}
                                        </div>

                                        <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-steel">{projeto.categoria}</p>
                                    </div>
                                </div>

                                <div className="ml-11 flex shrink-0 flex-wrap items-center gap-2 b-md:ml-0 b-md:gap-3">
                                    {projeto.demo && (
                                        <MagneticExternalLinkHover href={projeto.demo} px="px-3" py="py-2" accent="#A87852" borderColor="#242424" hoverBorderColor="#A87852" textColor="#8B8B8B" hoverTextColor="#0D0D0D" Icon={ArrowUpRight} isGroupHoverActive={isCursorHovered}>
                                            Preview
                                        </MagneticExternalLinkHover>
                                    )}

                                    {projeto.github && (
                                        <MagneticExternalLinkHover href={projeto.github} px="px-3" py="py-2" accent="transparent" borderColor="#242424" hoverBorderColor="#F2F0EC" textColor="#8B8B8B" hoverTextColor="#F2F0EC" Icon={ArrowUpRight} isGroupHoverActive={isCursorHovered}>
                                            GitHub
                                        </MagneticExternalLinkHover>
                                    )}
                                </div>
                            </div>
                        </article>
                        </ProjectViewportReveal>
                    );
                })}
            </div>

            {totalPages > 1 && (
                <nav
                    aria-label="Paginação de projetos"
                    className="flex flex-wrap items-center justify-center gap-2 pt-10"
                >
                    <motion.button
                        type="button"
                        aria-label="Página anterior"
                        title="Ir para a página anterior"
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                        onPointerDown={() => playUiSound("press")}
                        onHoverStart={() => {
                            if (currentPage > 1) setHoveredPaginationControl("previous");
                        }}
                        onHoverEnd={() => setHoveredPaginationControl((current) => (
                            current === "previous" ? null : current
                        ))}
                        animate={{
                            y: hoveredPaginationControl === "previous" && currentPage > 1 ? -2 : 0,
                            borderColor: hoveredPaginationControl === "previous" && currentPage > 1
                                ? "#A87852"
                                : "#242424",
                        }}
                        whileTap={currentPage > 1 ? { scale: 0.96 } : undefined}
                        className="
                            inline-flex
                            control-size-icon
                            items-center
                            cursor-pointer
                            justify-center
                            rounded-sm
                            border
                            border-graphite
                            text-steel
                            transition-colors
                            hover:text-ivory
                            disabled:cursor-not-allowed
                            disabled:opacity-30
                            focus-visible:outline
                            focus-visible:outline-2
                            focus-visible:outline-offset-4
                            focus-visible:outline-champagne
                        "
                    >
                        <ChevronLeft aria-hidden="true" className="h-4 w-4" />
                    </motion.button>

                    {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => {
                        const isActive = page === currentPage;

                        return (
                            <motion.button
                                key={page}
                                type="button"
                                aria-label={`Página ${page}`}
                                title={`Ir para a página ${page}`}
                                aria-current={isActive ? "page" : undefined}
                                onClick={() => handlePageChange(page)}
                                onPointerDown={() => playUiSound("press")}
                                onHoverStart={() => {
                                    if (!isActive) setHoveredPaginationControl(page);
                                }}
                                onHoverEnd={() => setHoveredPaginationControl((current) => (
                                    current === page ? null : current
                                ))}
                                animate={{
                                    y: !isActive && hoveredPaginationControl === page ? -2 : 0,
                                    borderColor: isActive || hoveredPaginationControl === page
                                        ? "#A87852"
                                        : "#242424",
                                }}
                                whileTap={{ scale: 0.96 }}
                                className={`
                                    inline-flex
                                    control-size-touch
                                    min-w-11
                                    items-center
                                    justify-center
                                    rounded-sm
                                    cursor-pointer
                                    border
                                    px-3
                                    text-xs
                                    font-medium
                                    transition-colors
                                    focus-visible:outline
                                    focus-visible:outline-2
                                    focus-visible:outline-offset-4
                                    focus-visible:outline-champagne
                                    ${isActive
                                        ? "border-bronze bg-bronze text-obsidian"
                                        : "border-graphite bg-transparent text-steel hover:text-ivory"
                                    }
                                `}
                            >
                                {page}
                            </motion.button>
                        );
                    })}

                    <motion.button
                        type="button"
                        aria-label="Próxima página"
                        title="Ir para a próxima página"
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                        onPointerDown={() => playUiSound("press")}
                        onHoverStart={() => {
                            if (currentPage < totalPages) setHoveredPaginationControl("next");
                        }}
                        onHoverEnd={() => setHoveredPaginationControl((current) => (
                            current === "next" ? null : current
                        ))}
                        animate={{
                            y: hoveredPaginationControl === "next" && currentPage < totalPages ? -2 : 0,
                            borderColor: hoveredPaginationControl === "next" && currentPage < totalPages
                                ? "#A87852"
                                : "#242424",
                        }}
                        whileTap={currentPage < totalPages ? { scale: 0.96 } : undefined}
                        className="
                            inline-flex
                            control-size-icon
                            items-center
                            justify-center
                            rounded-sm
                            border
                            border-graphite
                            text-steel
                            transition-colors
                            cursor-pointer
                            hover:text-ivory
                            disabled:cursor-not-allowed
                            disabled:opacity-30
                            focus-visible:outline
                            focus-visible:outline-2
                            focus-visible:outline-offset-4
                            focus-visible:outline-champagne
                        "
                    >
                        <ChevronRight aria-hidden="true" className="h-4 w-4" />
                    </motion.button>
                </nav>
            )}
        </section>
    );
}

export default ProjetoCatalogo;

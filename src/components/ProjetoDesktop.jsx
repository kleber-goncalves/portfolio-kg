import { useEffect, useRef } from "react";

import gsap from "gsap";

import { ArrowUpRight } from "lucide-react";

function ProjetoDesktop({ projetos }) {
    // ============================================================
    // REFS
    // ============================================================

    const containerRef = useRef(null);
    const previewRef = useRef(null);
    const previewTrackRef = useRef(null);

    // ============================================================
    // GSAP
    // ============================================================

    useEffect(() => {
        const container = containerRef.current;
        const preview = previewRef.current;
        const previewTrack = previewTrackRef.current;

        if (!container || !preview || !previewTrack) {
            return;
        }

        // ========================================================
        // ESTADO INICIAL
        // ========================================================

        gsap.set(preview, {
            scale: 0,
            xPercent: -50,
            yPercent: -50,
        });

        // ========================================================
        // ESCONDER PREVIEW
        // ========================================================

        const hidePreview = () => {
            gsap.to(preview, {
                scale: 0,
                duration: 0.25,
                ease: "power3.in",
                overwrite: true,
            });

            console.log("👻 PREVIEW ESCONDIDO");
        };

        // ========================================================
        // MOVIMENTO DO MOUSE
        // ========================================================

        const handleMouseMove = (event) => {
            gsap.to(preview, {
                x: event.clientX,
                y: event.clientY,
                duration: 0.45,
                ease: "power3.out",
                overwrite: "auto",
            });

            console.log("🖱️ MOUSEMOVE:", {
                x: event.clientX,
                y: event.clientY,
            });
        };

        // ========================================================
        // ENTRADA EM UM PROJETO
        // ========================================================

        const handleMouseEnter = (event) => {
            const index = Number(event.currentTarget.dataset.projectIndex);

            console.log("🟢 ENTROU NO PROJETO:", index + 1);

            // Mostra preview
            gsap.to(preview, {
                scale: 1,
                duration: 0.5,
                ease: "power3.out",
                overwrite: "auto",
            });

            // Troca imagem
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
            console.log("🔴 SAIU DA SEÇÃO");

            hidePreview();
        };

        // ========================================================
        // INTERSECTION OBSERVER
        // ========================================================

        const observer = new IntersectionObserver(
            ([entry]) => {
                console.log("👁️ PROJETOS VISÍVEL:", entry.isIntersecting);

                if (!entry.isIntersecting) {
                    hidePreview();
                }
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

        container.addEventListener("mousemove", handleMouseMove);

        container.addEventListener("mouseleave", handleContainerLeave);

        projectElements.forEach((project) => {
            project.addEventListener("mouseenter", handleMouseEnter);
        });

        // ========================================================
        // CLEANUP
        // ========================================================

        return () => {
            container.removeEventListener("mousemove", handleMouseMove);

            container.removeEventListener("mouseleave", handleContainerLeave);

            projectElements.forEach((project) => {
                project.removeEventListener("mouseenter", handleMouseEnter);
            });

            observer.disconnect();

            gsap.killTweensOf(preview);
            gsap.killTweensOf(previewTrack);
        };
    }, [projetos]);

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
                    max-w-[1600px]
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
                        border-b
                        border-graphite
                        pb-6
                    "
                >
                    <div className="flex flex-col gap-3">
                        <p
                            className="
                                font-bebas
                                text-sm
                                uppercase
                                tracking-[0.25em]
                                text-bronze
                            "
                        >
                            04 / Projetos
                        </p>

                        <h2
                            className="
                                font-bebas
                                text-6xl
                                uppercase
                                leading-none
                                text-ivory
                                lg:text-8xl
                            "
                        >
                            Projetos
                        </h2>
                    </div>

                    <p
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
                        Uma seleção de projetos desenvolvidos durante minha evolução como desenvolvedor.
                    </p>
                </div>

                {/* ==================================================
                    LISTA DE PROJETOS
                ================================================== */}

                <div className="flex w-full flex-col">
                    {projetos.map((projeto, index) => (
                        <article
                            key={projeto.numero}
                            data-project-index={index}
                            className="
                                group
                                relative
                                flex
                                min-h-[155px]
                                w-full
                                cursor-pointer
                                items-center
                                justify-between
                                border-t
                                border-graphite
                                py-8
                                transition-colors
                                duration-500
                                last:border-b
                                hover:border-bronze/50
                            "
                        >
                            {/* ======================================
                                LINHA ANIMADA
                            ====================================== */}

                            <span
                                className="
                                    absolute
                                    left-0
                                    top-0
                                    h-px
                                    w-0
                                    bg-gradientaa
                                    transition-all
                                    duration-700
                                    ease-out
                                    group-hover:w-full
                                "
                            />

                            {/* ======================================
                                CONTEÚDO ESQUERDO
                            ====================================== */}

                            <div
                                className="
                                    flex
                                    min-w-0
                                    items-center
                                    gap-8
                                "
                            >
                                {/* NÚMERO */}

                                <span
                                    className="
                                        w-10
                                        shrink-0
                                        font-bebas
                                        text-sm
                                        tracking-[0.2em]
                                        text-steel/30
                                        transition-colors
                                        duration-500
                                        group-hover:text-bronze
                                    "
                                >
                                    {projeto.numero}
                                </span>

                                {/* INFORMAÇÕES */}

                                <div
                                    className="
                                        flex
                                        min-w-0
                                        flex-col
                                        gap-2
                                    "
                                >
                                    <h3
                                        className="
                                            font-space
                                            text-2xl
                                            font-semibold
                                            leading-tight
                                            text-ivory
                                            transition-transform
                                            duration-500
                                            ease-out
                                            group-hover:translate-x-2
                                            lg:text-4xl
                                        "
                                    >
                                        {projeto.titulo}
                                    </h3>

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

                                    {/* TECNOLOGIAS */}

                                    <div
                                        className="
                                            mt-1
                                            flex
                                            flex-wrap
                                            gap-x-3
                                            gap-y-1
                                        "
                                    >
                                        {projeto.tecnologias.map((tecnologia) => (
                                            <span
                                                key={tecnologia}
                                                className="
                                                        font-bebas
                                                        text-[11px]
                                                        uppercase
                                                        tracking-[0.15em]
                                                        text-steel/40
                                                    "
                                            >
                                                {tecnologia}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* ======================================
                                LINK
                            ====================================== */}

                            <a
                                href={projeto.demo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="
                                    group/link
                                    hidden
                                    shrink-0
                                    items-center
                                    gap-2
                                    text-sm
                                    text-steel
                                    transition-colors
                                    duration-300
                                    hover:text-bronze
                                    lg:flex
                                "
                            >
                                <span>Ver projeto</span>

                                <ArrowUpRight
                                    className="
                                        h-4
                                        w-4
                                        transition-transform
                                        duration-300
                                        group-hover/link:-translate-y-0.5
                                        group-hover/link:translate-x-0.5
                                    "
                                />
                            </a>
                        </article>
                    ))}
                </div>
            </div>

            {/* ======================================================
                PREVIEW FLUTUANTE
            ======================================================= */}

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
                    rounded-xl
                    border
                    border-graphite
                    bg-carbon
                    shadow-2xl
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
                    LABEL
                ============================================== */}

                <div
                    className="
                        absolute
                        bottom-4
                        left-4
                        rounded-full
                        border
                        border-white/10
                        bg-black/50
                        px-4
                        py-2
                        backdrop-blur-md
                    "
                >
                    <span
                        className="
                            font-bebas
                            text-xs
                            uppercase
                            tracking-[0.2em]
                            text-white/70
                        "
                    >
                        Preview
                    </span>
                </div>
            </div>
        </section>
    );
}

export default ProjetoDesktop;

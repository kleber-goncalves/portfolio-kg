import { useEffect, useRef } from "react";

import gsap from "gsap";

import { tecnologias } from "../data/tecnologias";


function ProjetoDesktop({ projetos }) {
    // ============================================================
    // REFS
    // ============================================================

    const containerRef = useRef(null);
    const previewRef = useRef(null);
    const previewTrackRef = useRef(null);
    const previewButtonRef = useRef(null);

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
    //
    // Usado para detectar quando o mouse parou.
    //
    // Enquanto o mouse continua se movimentando, o timer
    // é reiniciado.
    //
    // Quando o mouse fica parado por alguns milissegundos,
    // o botão retorna para o centro do preview.
    //
    // ============================================================

    const buttonIdleTimeoutRef = useRef(null);

    // ============================================================
    // GSAP
    // ============================================================

    useEffect(() => {
        const container = containerRef.current;
        const preview = previewRef.current;
        const previewTrack = previewTrackRef.current;
        const previewButton = previewButtonRef.current;

        if (!container || !preview || !previewTrack || !previewButton) {
            return;
        }

        // ========================================================
        // ESTADO INICIAL
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
        //
        // O botão começa invisível e ligeiramente menor.
        //
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
        //
        // Aqui nós NÃO movemos o preview.
        //
        // Apenas mantemos registrada a posição atual do mouse
        // na janela inteira.
        //
        // Isso resolve o problema de voltar para a seção sem
        // mexer o mouse.
        //
        // ========================================================

        const handleGlobalMouseMove = (event) => {
            mousePositionRef.current.x = event.clientX;
            mousePositionRef.current.y = event.clientY;
        };

        // ========================================================
        // CENTRALIZAR BOTÃO
        // ========================================================
        //
        // Função responsável por levar o botão para o centro
        // exato do preview.
        //
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
            // Cancela qualquer timer pendente do botão
            clearTimeout(buttonIdleTimeoutRef.current);


               // ====================================================
            // BOTÃO VOLTA PARA O CENTRO
            // ====================================================

            gsap.to(previewButton, {
                x: preview.offsetWidth / 2,
                y: preview.offsetHeight / 2.2,
                scale: 0.75,
                opacity: 0,
                duration: 0.25,
                ease: "power3.in",
                overwrite: "auto",
            });

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
                duration: 1.45,
                ease: "power3.out",
                overwrite: "auto",
            });

            // ====================================================
            // BOTÃO DENTRO DO PREVIEW
            // ====================================================
            //
            // O preview está em:
            //
            // left: 0
            // top: 0
            //
            // e utiliza:
            //
            // xPercent: -50
            // yPercent: -50
            //
            // Portanto precisamos descobrir onde o mouse
            // está em relação ao retângulo real do preview.
            //
            // ====================================================

            const previewRect = preview.getBoundingClientRect();

            const buttonRect = previewButton.getBoundingClientRect();

            // ====================================================
            // POSIÇÃO DO MOUSE RELATIVA AO PREVIEW
            // ====================================================

            const relativeX = event.clientX - previewRect.left;

            const relativeY = event.clientY - previewRect.top;

            // ====================================================
            // ÁREA SEGURA DO BOTÃO
            // ====================================================

            const padding = 24;

            const minX = padding + buttonRect.width / 2;

            const maxX = previewRect.width - padding - buttonRect.width / 2;

            const minY = padding + buttonRect.height / 2.2;

            const maxY = previewRect.height - padding - buttonRect.height / 2.2;

            // ====================================================
            // LIMITA O BOTÃO DENTRO DO PREVIEW
            // ====================================================

            const buttonX = Math.min(Math.max(relativeX, minX), maxX);

            const buttonY = Math.min(Math.max(relativeY, minY), maxY);

            // ====================================================
            // MOVE O BOTÃO
            // ====================================================

            gsap.to(previewButton, {
                x: buttonX,
                y: buttonY,
                duration: 0.35,
                ease: "power3.out",
                overwrite: "auto",
            });

            // ====================================================
            // DETECTA MOUSE PARADO
            // ====================================================
            //
            // Cada novo movimento cancela o timer anterior.
            //
            // Se nenhum novo movimento acontecer durante 120ms,
            // consideramos que o mouse parou.
            //
            // ====================================================

            clearTimeout(buttonIdleTimeoutRef.current);

            buttonIdleTimeoutRef.current = setTimeout(() => {
                centerPreviewButton(0.7);
            }, 120);

            console.log("🖱️ MOUSEMOVE:", {
                x: event.clientX,
                y: event.clientY,
                buttonX,
                buttonY,
            });
        };

        // ========================================================
        // ENTRADA EM UM PROJETO
        // ========================================================

        const handleMouseEnter = (event) => {
            const index = Number(event.currentTarget.dataset.projectIndex);

            console.log("🟢 ENTROU NO PROJETO:", index + 1);

            // ====================================================
            // CANCELA TIMER ANTERIOR
            // ====================================================

            clearTimeout(buttonIdleTimeoutRef.current);

            // ====================================================
            // ATUALIZA A POSIÇÃO DO PREVIEW
            // ====================================================
            //
            // Usa a posição ATUAL do mouse na janela.
            //
            // Isso é importante quando o usuário voltou para
            // a seção sem movimentar o mouse.
            //
            // ====================================================

            gsap.set(preview, {
                x: mousePositionRef.current.x,
                y: mousePositionRef.current.y,
            });

            // ====================================================
            // RESET DO BOTÃO
            // ====================================================
            //
            // Quando entramos em um novo projeto, o botão começa
            // no centro do preview.
            //
            // ====================================================

            gsap.set(previewButton, {
                x: preview.offsetWidth / 2,
                y: preview.offsetHeight / 2.2,
                scale: 0.75,
                opacity: 1,
            });

            // Mostra preview
            gsap.to(preview, {
                scale: 1,
                duration: 0.5,
                ease: "power3.out",
                overwrite: "auto",
            });

              // ====================================================
            // ENTRADA DO BOTÃO
            // ====================================================
            //
            // Pequeno atraso para o botão entrar depois do
            // preview, criando uma hierarquia visual.
            //
            // ====================================================

            gsap.to(previewButton, {
                opacity: 1,
                duration: 0.5,
                delay: 0.08,
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

                // =================================================
                // SE SAIU DA VIEWPORT
                // =================================================
                if (!entry.isIntersecting) {
                    hidePreview();
                    return;
                }

                // =================================================
                // SE VOLTOU PARA A VIEWPORT
                // =================================================
                //
                // Reposiciona o preview para a posição REAL
                // atual do mouse.
                //
                // =================================================

                gsap.set(preview, {
                    x: mousePositionRef.current.x,
                    y: mousePositionRef.current.y,
                });

                console.log("🔄 PROJETOS VOLTOU PARA A VIEWPORT:", {
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

            // Cancela timer do botão
            clearTimeout(buttonIdleTimeoutRef.current);

            gsap.killTweensOf(preview);
            gsap.killTweensOf(previewTrack);
            gsap.killTweensOf(previewButton);
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
                    <div className="flex flex-row w-full items-center gap-3">
                        <h2
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
                        <span
                            className="
                            h-0.5
                            flex-1

                            bg-gradientaa

                            md:h-1
                        "
                        />

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
                            Uma seleção de projetos desenvolvidos durante minha evolução como desenvolvedor
                        </p>
                    </div>
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
                                border-b
                                border-graphite
                                
                                transition-colors
                                duration-500
                                last:border-b
                                hover:border-bronze/50
                            "
                        >
                            <a
                                href={projeto.demo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="
                                   group
                                   w-full
                                   transition-colors
                                   py-8
                                    
                                "
                            >
                                {/* ======================================
                                LINHA ANIMADA
                            ====================================== */}

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
                                            {projeto.tecnologias.map((tecnologia) => {
                                                const tech = tecnologias[tecnologia];

                                                if (!tech) return null;

                                                const Icon = tech.icone;

                                                return (
                                                    <span
                                                        key={tecnologia}
                                                        className={`
                inline-flex
                items-center
                gap-1.5
                rounded-full
                border
                border-transparent
                w-fit
                h-fit 
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
                                                        {Icon && <Icon className={`h-4.5 w-4.5  ${tech.icon}`} />}

                                                        {tech.nome}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
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
        </section>
    );
}

export default ProjetoDesktop;

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function Formacao() {
    const sectionRef = useRef(null);

    // Card de formação
    const formationCardRef = useRef(null);

    // Timeline
    const timelineRef = useRef(null);
    const lineRef = useRef(null);

    // Eventos da timeline
    const eventsRef = useRef([]);

    // Pontos da timeline
    const dotsRef = useRef([]);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const line = lineRef.current;
            const events = eventsRef.current;
            const dots = dotsRef.current;

            // ----------------------------------------------------
            // ESTADO INICIAL
            // ----------------------------------------------------

            // Card entra suavemente
            //  gsap.set(formationCardRef.current, {
            //      opacity: 0,
            //      y: 30,
            //  });

            // Linha começa invisível
            gsap.set(line, {
                scaleY: 0,
                transformOrigin: "top center",
            });

            // Eventos começam um pouco abaixo e invisíveis
            gsap.set(events, {
                opacity: 0,
                y: 20,
            });

            // Pontos começam pequenos
            gsap.set(dots, {
                scale: 0,
                transformOrigin: "center",
            });

            // ----------------------------------------------------
            // CARD DE FORMAÇÃO
            // ----------------------------------------------------

            //  gsap.to(formationCardRef.current, {
            //      opacity: 1,
            //      y: 0,
            //      duration: 0.8,
            //      ease: "power2.out",

            //      scrollTrigger: {
            //          trigger: formationCardRef.current,
            //          start: "top 85%",
            //          toggleActions: "play none none reverse",
            //      },
            //  });

            // ----------------------------------------------------
            // TIMELINE
            // ----------------------------------------------------

            const timeline = gsap.timeline({
                scrollTrigger: {
                    trigger: timelineRef.current,

                    // Começa quando a timeline estiver entrando
                    // na parte inferior da tela
                    start: "top 80%",

                    // Termina quando praticamente toda timeline
                    // estiver visível
                    end: "bottom 65%",

                    scrub: 0.5,

                    invalidateOnRefresh: true,
                },
            });

            // ----------------------------------------------------
            // LINHA
            // ----------------------------------------------------

            timeline.to(line, {
                scaleY: 1,
                ease: "none",
                duration: 1,
            });

            // ----------------------------------------------------
            // EVENTOS
            // ----------------------------------------------------

            events.forEach((event, index) => {
                const dot = dots[index];

                if (!event || !dot) return;

                // Ponto aparece
                timeline.to(
                    dot,
                    {
                        scale: 1,
                        duration: 0.15,
                        ease: "back.out(2)",
                    },
                    index * 0.22,
                );

                // Conteúdo aparece
                timeline.to(
                    event,
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.25,
                        ease: "power2.out",
                    },
                    index * 0.22,
                );
            });
        }, sectionRef);

        // Limpa GSAP + ScrollTrigger quando o componente desmontar
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="formacao" className="bg-obsidian w-full h-full p-5 md:p-10 relative overflow-hidden flex flex-col items-center gap-10">
            <div className="flex flex-col items-center gap-10 w-full md:max-w-[1500px]">
                <div className="flex flex-row items-center gap-2 w-full">
                    <h2 className="text-sm md:text-7xl  text-steel uppercase">// Formação & Nivel Técnico</h2>
                    <span className="flex-1 h-0.5 md:h-1 bg-gradientaa"></span>
                </div>
                <div className="w-full h-full relative overflow-hidden flex flex-col items-center gap-15">
                    <div
                        ref={formationCardRef}
                        className="
        relative
        w-full

        rounded-3xl
        border-t-2
        border-champagne
        bg-carbon

        md:rounded-none
        md:border-t-0
        md:bg-transparent
    "
                    >
                        <div
                            className="
            relative
            flex
            w-full
            flex-col
            gap-10

            rounded-3xl
            border
            border-graphite
            p-5

            md:gap-16
            md:rounded-none
            md:border-0
            md:p-0
        "
                        >
                            {/* =====================================================
            BLOCO PRINCIPAL
        ===================================================== */}

                            <div
                                className="
                relative
                grid
                w-full
                grid-cols-1
                gap-10

                md:grid-cols-[1.15fr_0.85fr]
                md:gap-16
                lg:gap-24
            "
                            >
                                {/* =================================================
                COLUNA ESQUERDA — NÍVEL ATUAL
            ================================================= */}

                                <div
                                    className="
                    relative
                    flex
                    flex-col
                    justify-between
                    gap-8
                "
                                >
                                    {/* LABEL */}

                                    <div className="flex items-center gap-3">
                                        <span
                                            className="
                            h-2
                            w-2
                            shrink-0
                            rounded-full
                            bg-champagne
                        "
                                        />

                                        <p
                                            className="
                            font-bebas
                            text-xs
                            uppercase
                            tracking-[0.2em]
                            text-steel

                            md:text-sm
                        "
                                        >
                                            Nível atual
                                        </p>
                                    </div>

                                    {/* JUNIOR */}

                                    <div className="relative">
                                        <h2
                                            className="
                            relative
                            z-10
                            font-bold
                            bebas-neue-regular
                            text-7xl
                            uppercase
                            leading-[0.8]
                            tracking-tight
                            text-ivory

                            md:text-[10rem]
                            lg:text-[12rem]
                        "
                                        >
                                            Junior
                                        </h2>

                                        {/* GLOW */}

                                        <div
                                            className="
                            pointer-events-none
                            absolute
                            bottom-[-20px]
                            left-[15%]
                            z-0
                            h-24
                            w-40
                            rounded-full
                            bg-[#A87852]/20
                            blur-[70px]

                            md:bottom-[-30px]
                            md:left-[20%]
                            md:h-40
                            md:w-64
                            md:bg-[#A87852]/15
                            md:blur-[90px]
                        "
                                        />
                                    </div>

                                    {/* ESPECIALIDADES */}

                                    <div
                                        className="
                        flex
                        flex-wrap
                        gap-x-4
                        gap-y-1

                        text-sm
                        text-steel

                        md:text-base
                    "
                                    >
                                        <span>Frontend</span>
                                        <span className="text-bronze">·</span>
                                        <span>Backend</span>
                                        <span className="text-bronze">·</span>
                                        <span>Full Stack</span>
                                    </div>
                                </div>

                                {/* =================================================
                COLUNA DIREITA — FORMAÇÃO
            ================================================= */}

                                <div
                                    className="
                    flex
                    flex-col
                    justify-end
                    gap-6

                    md:border-l
                    md:border-graphite
                    md:pl-10
                    lg:pl-14
                "
                                >
                                    {/* LABEL */}

                                    <div className="flex items-center gap-3">
                                        <span
                                            className="
                            h-2
                            w-2
                            shrink-0
                            rounded-full
                            bg-champagne
                        "
                                        />

                                        <h3
                                            className="
                            font-bebas
                            text-xs
                            uppercase
                            tracking-[0.2em]
                            text-steel

                            md:text-sm
                        "
                                        >
                                            Formação
                                        </h3>
                                    </div>

                                    {/* CURSO */}

                                    <div className="flex flex-col gap-2">
                                        <p
                                            className="
                            font-space
                            text-2xl
                            font-semibold
                            leading-tight
                            text-ivory

                            md:text-4xl
                        "
                                        >
                                            Análise e Desenvolvimento
                                            <br className="hidden md:block" />
                                            de Sistemas
                                        </p>

                                        <p
                                            className="
                            text-sm
                            text-champagne

                            md:text-base
                        "
                                        >
                                            ADS · Uniube — Uberaba
                                        </p>
                                    </div>

                                    {/* PROGRESSO */}

                                    <div className="flex flex-col gap-3">
                                        <div
                                            className="
                            flex
                            items-end
                            justify-between
                        "
                                        >
                                            <span
                                                className="
                                text-xs
                                uppercase
                                tracking-[0.15em]
                                text-steel/60
                            "
                                            >
                                                Progresso
                                            </span>

                                            <span
                                                className="
                                font-bebas
                                text-3xl
                                leading-none
                                text-bronze

                                md:text-4xl
                            "
                                            >
                                                87%
                                            </span>
                                        </div>

                                        <div
                                            className="
                            h-1.5
                            w-full
                            overflow-hidden
                            rounded-full
                            bg-graphite
                        "
                                        >
                                            <div
                                                className="
                                h-full
                                w-[87%]
                                rounded-full
                                bg-bronze
                            "
                                            />
                                        </div>

                                        <div
                                            className="
                            flex
                            justify-between
                            text-xs
                            text-steel/70

                            md:text-sm
                        "
                                        >
                                            <span>2,5 anos</span>

                                            <span>Em conclusão</span>
                                        </div>
                                    </div>
                                </div>

                                {/* =================================================
                GLOW DECORATIVO
            ================================================= */}

                                <div
                                    className="
                    pointer-events-none
                    absolute
                    right-[-80px]
                    top-[-60px]
                    h-40
                    w-40
                    rounded-full
                    bg-[#A87852]/10
                    blur-[100px]

                    md:h-56
                    md:w-56
                "
                                />
                            </div>

                            {/* =====================================================
            DESCRIÇÃO DAS FORMAÇÕES
        ===================================================== */}

                            <div
                                className="
                grid
                w-full
                grid-cols-1
                gap-6

                border-t
                border-graphite
                pt-8

                md:grid-cols-2
                md:gap-16
                md:pt-10
            "
                            >
                                {/* DNC */}

                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-3">
                                        <span
                                            className="
                            h-1.5
                            w-1.5
                            rounded-full
                            bg-champagne
                        "
                                        />

                                        <p
                                            className="
                            font-bebas
                            text-xs
                            uppercase
                            tracking-[0.2em]
                            text-steel
                        "
                                        >
                                            Formação complementar
                                        </p>
                                    </div>

                                    <p
                                        className="
                        text-sm
                        leading-6
                        text-steel

                        md:text-base
                        md:leading-7
                    "
                                    >
                                        Formado nos cursos de
                                        <span className="font-bold text-bronze"> Front-end</span> e<span className="font-bold text-bronze"> Back-end</span> da
                                        <span className="font-bold text-champagne"> DNC</span>, com formação prática que simula o mercado real e voltada ao desenvolvimento de aplicações web, construção de interfaces, APIs, integração com bancos de dados e desenvolvimento
                                        <span className="font-bold text-bronze"> Full-Stack</span>.
                                    </p>
                                </div>

                                {/* ADS */}

                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-3">
                                     <span
                                            className="
                            h-1.5
                            w-1.5
                            rounded-full
                            bg-champagne
                        "
                                        />

                                        <p
                                            className="
                            font-bebas
                            text-xs
                            uppercase
                            tracking-[0.2em]
                            text-steel
                        "
                                        >
                                            Formação acadêmica
                                        </p>
                                    </div>

                                    <p
                                        className="
                        text-sm
                        leading-6
                        text-steel

                        md:text-base
                        md:leading-7
                    "
                                    >
                                        Atualmente, estou concluindo
                                        <span className="font-bold text-bronze"> Análise e Desenvolvimento de Sistemas</span> pela
                                        <span className="font-bold text-champagne"> Uniube — Uberaba</span>, com aproximadamente
                                        <span className="font-bold text-bronze"> 87% da graduação concluída.</span> A formação envolve Scrum, sprints e projetos em equipe.
                                    </p>

                                    <p
                                        className="
                        text-xs
                        italic
                        leading-5
                        text-steel/60

                        md:text-sm
                        md:leading-6
                    "
                                    >
                                        O nível reflete o que a formação entregou, não tempo de mercado.
                                    </p>
                                </div>
                            </div>

                            {/* =====================================================
            FORMAÇÕES COMPLEMENTARES
        ===================================================== */}

                            <div
                                className="
                flex
                w-full
                flex-col
                gap-5

                border-t
                border-graphite
                pt-8

                md:flex-row
                md:items-center
                md:justify-between
                md:pt-7
            "
                            >
                                <div className="flex items-center gap-3">
                                    <span
                                        className="
                        h-2
                        w-2
                        shrink-0
                        rounded-full
                        bg-champagne
                    "
                                    />

                                    <h3
                                        className="
                        font-bebas
                        text-xs
                        uppercase
                        tracking-[0.2em]
                        text-steel

                        md:text-sm
                    "
                                    >
                                        Formações complementares
                                    </h3>
                                </div>

                                <div
                                    className="
                    flex
                    flex-wrap
                    gap-x-8
                    gap-y-2
                "
                                >
                                    <span
                                        className="
                        text-sm
                        text-steel

                        md:text-base
                    "
                                    >
                                        Front-end
                                        <span className="ml-2 text-bronze">concluído</span>
                                    </span>

                                    <span
                                        className="
                        text-sm
                        text-steel

                        md:text-base
                    "
                                    >
                                        Back-end
                                        <span className="ml-2 text-bronze">concluído</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        className="flex flex-col w-full items-start rounded-3xl  gap-12

                        "
                    >
                        {/* ==============================================
                            CABEÇALHO
                        ============================================== */}

                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-champagne"></span>

                                <p className="text-xs md:text-3xl text-steel uppercase">Minha Trajetoria</p>
                            </div>

                            <h2
                                className=" text-5xl md:text-7xl font-bold bebas-neue-regular  text-ivory
                                "
                            >
                                Evolução
                            </h2>

                            <p className=" mt-2 max-w-xl text-sm leading-6 text-steel md:text-sm md:leading-7 "> Uma trajetória construída através de aprendizado, prática e evolução contínua no desenvolvimento de software.</p>
                        </div>

                        {/* ==============================================
                            TIMELINE
                        ============================================== */}

                        <div
                            ref={timelineRef}
                            className="
                                relative
                                
                            "
                        >
                            {/* ==========================================
                                LINHA BASE
                            ========================================== */}

                            <div
                                className="absolute left-3 top-4 bottom-0 w-px h-123 md:h-full  bg-graphite
                                "
                            ></div>

                            {/* ==========================================
                                LINHA ANIMADA
                            ========================================== */}

                            <div
                                ref={lineRef}
                                className="absolute left-3 top-4 w-px h-123 md:h-full bg-warm-bronze
                                "
                            ></div>

                            {/* ==========================================
                                EVENTO 2023
                            ========================================== */}

                            <div
                                ref={(el) => {
                                    eventsRef.current[0] = el;
                                }}
                                className="
                                    relative
                                    pl-8
                                    pb-17
                                "
                            >
                                <div
                                    ref={(el) => {
                                        dotsRef.current[0] = el;
                                    }}
                                    className="absolute left-1.75 top-1 w-3 h-3 rounded-full bg-bronze"
                                ></div>

                                <p className="mb-2 font-bebas text-bronze text-sm tracking-[0.15em] md:text-lg">2023</p>

                                <h3 className=" max-w-3xl text-ivory font-space text-lg font-semibold md:text-4xl leading-tight">Primeiro contato com programação</h3>

                                <p className=" mt-3 max-w-2xl text-steel text-sm md:text-base md:leading-7">Início da minha jornada no desenvolvimento e primeiro contato com a programação.</p>
                            </div>

                            {/* ==========================================
                                EVENTO 2024
                            ========================================== */}

                            <div
                                ref={(el) => {
                                    eventsRef.current[1] = el;
                                }}
                                className="
                                    relative
                                    pl-8
                                    pb-17
                                "
                            >
                                <div
                                    ref={(el) => {
                                        dotsRef.current[1] = el;
                                    }}
                                    className="
                                        absolute
                                        left-1.75
                                        top-1
                                        w-3
                                        h-3
                                        rounded-full
                                        bg-bronze
                                    "
                                ></div>

                                <p className="mb-2 font-bebas text-bronze text-sm tracking-[0.15em] md:text-lg">2024</p>

                                <h3 className=" max-w-3xl text-ivory font-space text-lg font-semibold md:text-4xl leading-tight">Formação Front-end</h3>

                                <p className=" mt-3 max-w-2xl text-steel text-sm md:text-base md:leading-7">HTML, CSS, JavaScript e construção de interfaces para aplicações web.</p>
                            </div>

                            {/* ==========================================
                                EVENTO 2025
                            ========================================== */}

                            <div
                                ref={(el) => {
                                    eventsRef.current[2] = el;
                                }}
                                className="relative pl-8 pb-17
                                "
                            >
                                <div
                                    ref={(el) => {
                                        dotsRef.current[2] = el;
                                    }}
                                    className="absolute left-1.75 top-1 w-3 h-3 rounded-full bg-bronze
                                    "
                                ></div>

                                <p className=" mb-2 font-bebas text-bronze text-sm tracking-[0.15em] md:text-lg">2025</p>

                                <h3 className=" max-w-3xl text-ivory font-space text-lg font-semibold md:text-4xl leading-tight">Formação Back-end</h3>

                                <p className=" mt-3 max-w-2xl text-steel text-sm md:text-base md:leading-7">APIs, bancos de dados, Node.js e desenvolvimento de aplicações.</p>
                            </div>

                            {/* ==========================================
                                EVENTO 2026
                            ========================================== */}

                            <div
                                ref={(el) => {
                                    eventsRef.current[3] = el;
                                }}
                                className="relative pl-8 pb-2
                                "
                            >
                                <div
                                    ref={(el) => {
                                        dotsRef.current[3] = el;
                                    }}
                                    className="absolute left-1.25 top-1 w-4 h-4 rounded-full bg-bronze shadow-[0_0_15px_rgba(168,120,82,0.45)]
                                    "
                                ></div>
                                <div
                                    ref={(el) => {
                                        dotsRef.current[3] = el;
                                    }}
                                    className="
                                        absolute
                                        left-[5px]
                                        top-1
                                        w-4
                                        h-4
                                        rounded-full
                                        animate-ping
                                        bg-bronze
                                        shadow-[0_0_15px_rgba(168,120,82,0.45)]
                                    "
                                ></div>
                                <div className="mb-2 flex items-center gap-3">
                                    <p className="font-bebas text-bronze text-sm tracking-[0.15em] md:text-lg">2026</p>
                                    <span
                                        className="
                        rounded-full
                        border
                        border-bronze/30
                        bg-bronze/5
                        px-2
                        py-0.5

                        text-[8px]
                        uppercase
                        tracking-[0.2em]
                        text-bronze

                        md:text-[9px]
                    "
                                    >
                                        Atual
                                    </span>
                                </div>

                                <h3
                                    className="
                                       max-w-3xl
                                        text-ivory
                                        font-space
                                        text-lg
                                        font-[600]
                                        md:text-4xl
                                        leading-tight
                                    "
                                >
                                    Full Stack + ADS
                                </h3>

                                <p
                                    className="
                                                                                mt-3
                                        max-w-2xl
                                        text-steel
                                        text-sm
                                        md:text-base
                                        md:leading-7
                                    "
                                >
                                    Formação Full Stack pela DNC e graduação em Análise e Desenvolvimento de Sistemas pela Uniube.
                                </p>
                                <div
                                    className="
                    mt-6
                    flex
                    flex-wrap
                    gap-2
                "
                                >
                                    <span
                                        className="
                        rounded-full
                        border
                        border-graphite
                        bg-carbon
                        px-3
                        py-1.5

                        text-[9px]
                        uppercase
                        tracking-[0.15em]
                        text-steel

                        md:text-[10px]
                    "
                                    >
                                        DNC · Full Stack
                                    </span>

                                    <span
                                        className="
                        rounded-full
                        border
                        border-graphite
                        bg-carbon
                        px-3
                        py-1.5

                        text-[9px]
                        uppercase
                        tracking-[0.15em]
                        text-steel

                        md:text-[10px]
                    "
                                    >
                                        Uniube · ADS
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Formacao;

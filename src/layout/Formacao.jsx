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
        <section
            ref={sectionRef}
            className="bg-obsidian w-full h-full p-5 md:p-10 relative overflow-hidden flex flex-col items-center gap-10"
        >
            <div className="flex flex-col items-center gap-10 w-full">
                <div className="flex flex-row items-center gap-2 w-full">
                    <h2 className="text-sm md:text-7xl  text-steel uppercase">
                        // Formação & Nivel Técnico
                    </h2>
                    <span className="flex-1 h-0.5 md:h-1 bg-gradientaa"></span>
                </div>
                <div className="w-full h-full relative overflow-hidden flex flex-col items-center gap-3">
                    <div
                        ref={formationCardRef}
                        className="flex flex-col w-full rounded-3xl border-t-2 border-champagne"
                    >
                        <div className="flex flex-col items-start gap-5 w-full rounded-3xl p-5 md:p-10 bg-carbon  border border-graphite">
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-3">
                                    <span className="w-2 h-2 rounded-full bg-champagne"></span>

                                    <p className="text-xs md:text-3xl text-steel uppercase">
                                        Nível auto-avaliado
                                    </p>
                                </div>
                                <h2 className="text-5xl md:text-7xl font-bold bebas-neue-regular text-ivory">
                                    Junior<br></br>
                                </h2>
                                <div className="absolute z-2 -right-10 top-10 w-30 h-30 rounded-full bg-[#A87852]/22 blur-[80px]"></div>
                            </div>

                            <div className="flex flex-col mt-3 gap-5 text-sm md:text-3xl text-steel">
                                <p>
                                    Formado nos cursos de
                                    <span className="font-bold text-bronze">
                                        {" "}
                                        Front-end
                                    </span>{" "}
                                    e
                                    <span className="font-bold text-bronze">
                                        {" "}
                                        Back-end
                                    </span>{" "}
                                    da{" "}
                                    <span className="text-champagne font-bold">
                                        DNC
                                    </span>
                                    , com formação prática que simula o mercado
                                    real e voltada ao desenvolvimento de
                                    aplicações web, construção de interfaces,
                                    APIs, integração com bancos de dados e
                                    desenvolvimento{" "}
                                    <span className="font-bold text-bronze">
                                        Full-Stack
                                    </span>
                                    .
                                </p>

                                <p>
                                    Atualmente, estou concluindo{" "}
                                    <span className="font-bold text-bronze">
                                        Análise e Desenvolvimento de Sistemas
                                    </span>{" "}
                                    pela{" "}
                                    <span className="font-bold text-champagne">
                                        Uniube — Uberaba
                                    </span>
                                    , com aproximadamente{" "}
                                    <span className="font-bold text-bronze">
                                        87% da graduação concluída.
                                    </span>{" "}
                                    A formação envolve Scrum, sprints e projetos
                                    em equipe.{" "}
                                    <span className="text-sm md:text-xl text-steel/70 italic">
                                        O nível reflete o que a formação
                                        entregou, não tempo de mercado.
                                    </span>
                                </p>
                            </div>
                            <div className="flex flex-col gap-3 mt-4">
                                <div className="flex items-center gap-3">
                                    <span className="w-2 h-2 rounded-full bg-champagne"></span>

                                    <h3 className="font-bold text-sm md:text-3xl text-steel">
                                        FORMAÇÃO
                                    </h3>
                                </div>

                                <div className="w-full max-w-xl h-2 rounded-full bg-graphite overflow-hidden">
                                    <div className="h-full w-[87%] bg-bronze rounded-full" />
                                </div>

                                <div className="flex justify-between text-sm md:text-xl text-steel">
                                    <span>ADS · Uniube</span>
                                    <span className="text-bronze font-bold">
                                        87%
                                    </span>
                                </div>

                                <p className="text-sm md:text-xl text-steel">
                                    2,5 anos · em conclusão
                                </p>
                            </div>
                            <div className="flex flex-col mt-4 gap-2 text-sm md:text-3xl text-steel">
                                <div className="flex items-center gap-3">
                                    <span className="w-2 h-2 rounded-full bg-champagne"></span>

                                    <h3 className="font-bold ">
                                        FORMAÇÕES COMPLEMENTARES
                                    </h3>
                                </div>
                                <p>✓ Front-end — concluído</p>
                                <p>✓ Back-end — concluído</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col w-full rounded-3xl border-t-2 border-warm-bronze">
                        <div
                            className="flex flex-col w-full items-start rounded-3xl p-5 md:p-10
                            gap-12
                            border
                            border-graphite
                            bg-carbon
                        "
                        >
                            {/* ==============================================
                            CABEÇALHO
                        ============================================== */}

                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-3">
                                    <span className="w-2 h-2 rounded-full bg-champagne"></span>

                                    <p className="text-xs md:text-3xl text-steel uppercase">
                                        Minha Trajetoria
                                    </p>
                                </div>

                                <h2
                                    className="
                                    text-5xl
                                    md:text-7xl
                                    font-bold
                                    bebas-neue-regular
                                    text-ivory
                                "
                                >
                                    Evolução
                                </h2>
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
                                    className="
                                    absolute
                                    left-0
                                    top-4
                                    bottom-0
                                    w-px
                                    h-104
                                    md:h-full
                                    bg-graphite
                                "
                                ></div>

                                {/* ==========================================
                                LINHA ANIMADA
                            ========================================== */}

                                <div
                                    ref={lineRef}
                                    className="
                                    absolute
                                    left-0
                                    top-4
                                    w-px
                                    h-104
                                    md:h-full
                                    bg-warm-bronze
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
                                    pb-10
                                "
                                >
                                    <div
                                        ref={(el) => {
                                            dotsRef.current[0] = el;
                                        }}
                                        className="
                                        absolute
                                        -left-[5px]
                                        top-0
                                        w-3
                                        h-3
                                        rounded-full
                                        bg-bronze
                                    "
                                    ></div>

                                    <p
                                        className="
                                        text-champagne
                                        font-bold
                                        text-sm
                                        md:text-xl
                                    "
                                    >
                                        2023
                                    </p>

                                    <h3
                                        className="
                                        text-ivory
                                        text-lg
                                        md:text-3xl
                                        font-bold
                                    "
                                    >
                                        Primeiro contato com programação
                                    </h3>

                                    <p
                                        className="
                                        text-steel
                                        text-sm
                                        md:text-xl
                                    "
                                    >
                                        Início da minha jornada no
                                        desenvolvimento.
                                    </p>
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
                                    pb-10
                                "
                                >
                                    <div
                                        ref={(el) => {
                                            dotsRef.current[1] = el;
                                        }}
                                        className="
                                        absolute
                                        -left-[5px]
                                        top-1
                                        w-3
                                        h-3
                                        rounded-full
                                        bg-bronze
                                    "
                                    ></div>

                                    <p
                                        className="
                                        text-champagne
                                        font-bold
                                        text-sm
                                        md:text-xl
                                    "
                                    >
                                        2024
                                    </p>

                                    <h3
                                        className="
                                        text-ivory
                                        text-lg
                                        md:text-3xl
                                        font-bold
                                    "
                                    >
                                        Formação Front-end
                                    </h3>

                                    <p
                                        className="
                                        text-steel
                                        text-sm
                                        md:text-xl
                                    "
                                    >
                                        HTML, CSS, JavaScript e construção de
                                        interfaces.
                                    </p>
                                </div>

                                {/* ==========================================
                                EVENTO 2025
                            ========================================== */}

                                <div
                                    ref={(el) => {
                                        eventsRef.current[2] = el;
                                    }}
                                    className="
                                    relative
                                    pl-8
                                    pb-10
                                "
                                >
                                    <div
                                        ref={(el) => {
                                            dotsRef.current[2] = el;
                                        }}
                                        className="
                                        absolute
                                        -left-[5px]
                                        top-1
                                        w-3
                                        h-3
                                        rounded-full
                                        bg-bronze
                                    "
                                    ></div>

                                    <p
                                        className="
                                        text-champagne
                                        font-bold
                                        text-sm
                                        md:text-xl
                                    "
                                    >
                                        2025
                                    </p>

                                    <h3
                                        className="
                                        text-ivory
                                        text-lg
                                        md:text-3xl
                                        font-bold
                                    "
                                    >
                                        Formação Back-end
                                    </h3>

                                    <p
                                        className="
                                        text-steel
                                        text-sm
                                        md:text-xl
                                    "
                                    >
                                        APIs, bancos de dados, Node.js e
                                        desenvolvimento de aplicações.
                                    </p>
                                </div>

                                {/* ==========================================
                                EVENTO 2026
                            ========================================== */}

                                <div
                                    ref={(el) => {
                                        eventsRef.current[3] = el;
                                    }}
                                    className="
                                    relative
                                    pl-8
                                    pb-2
                                "
                                >
                                    <div
                                        ref={(el) => {
                                            dotsRef.current[3] = el;
                                        }}
                                        className="
                                        absolute
                                        -left-[6px]
                                        top-1
                                        w-4
                                        h-4
                                        rounded-full
                                        bg-bronze
                                        shadow-[0_0_15px_rgba(168,120,82,0.45)]
                                    "
                                    ></div>
                                    <div
                                        ref={(el) => {
                                            dotsRef.current[3] = el;
                                        }}
                                        className="
                                        absolute
                                        -left-[6px]
                                        top-1
                                        w-4
                                        h-4
                                        rounded-full
                                        animate-ping
                                        bg-bronze
                                        shadow-[0_0_15px_rgba(168,120,82,0.45)]
                                    "
                                    ></div>

                                    <p
                                        className="
                                        text-champagne
                                        font-bold
                                        text-sm
                                        md:text-xl
                                    "
                                    >
                                        2026
                                    </p>

                                    <h3
                                        className="
                                        text-ivory
                                        text-lg
                                        md:text-3xl
                                        font-bold
                                    "
                                    >
                                        Full Stack + ADS
                                    </h3>

                                    <p
                                        className="
                                        text-steel
                                        text-sm
                                        md:text-xl
                                    "
                                    >
                                        Formação Full Stack pela DNC e graduação
                                        em Análise e Desenvolvimento de Sistemas
                                        pela Uniube.
                                    </p>
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

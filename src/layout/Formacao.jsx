import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MinhaTrajetoria from "../components/MinhaTrajetoria";
import { eventosTrajetoria } from "../data/eventosTrajetoria";
gsap.registerPlugin(ScrollTrigger);

function Formacao() {

    const sectionRef = useRef(null);
    const formationCardRef = useRef(null);

    /*
    ============================================================
    ANIMAÇÕES EXCLUSIVAS DA FORMAÇÃO
    ============================================================
    */

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // suas animações do CARD DE FORMAÇÃO
            // permanecem aqui
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="formacao" className="bg-obsidian w-full h-full p-5 md:p-10 relative overflow-hidden flex flex-col items-center gap-10">
            <div className="flex flex-col items-center gap-10 md:gap-20 w-full md:max-w-[1500px]">
                <div className="flex flex-row items-center gap-2 w-full">
                    <h2 className="text-sm md:text-7xl  text-steel uppercase">// Formação & Nivel Técnico</h2>
                    <span className="flex-1 h-0.5 md:h-1 bg-gradientaa"></span>
                </div>
                <div className="w-full h-full relative overflow-hidden flex flex-col items-center gap-15 md:gap-20">
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

                md:grid-cols-[1.1fr_1.85fr]
                md:gap-
                lg:gap-
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
                    gap-8
                    pt-2
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
                            text-6xl
                            uppercase
                            
                            tracking-tight
                            text-ivory

                            md:text-[10rem]
                            lg:text-7xl
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

                        </div>
                    </div>



                    <MinhaTrajetoria subtitulo="Minha Trajetória" titulo="Evolução" descricao="Aprendizado, prática e evolução contínua no desenvolvimento de software." eventos={eventosTrajetoria} />
                </div>
            </div>
        </section>
    );
}

export default Formacao;

import Card2 from "../components/Card.2-teste";

function Diferenciais() {
    const diferenciais = [
        {
            numero: "01",
            titulo: "Foco em Design de Software",
            texto: "Não escrevo código antes de pensar no sistema. Tomo decisões considerando arquitetura, manutenção, escalabilidade e o impacto que cada escolha pode gerar.",
        },

        {
            numero: "02",
            titulo: "Visão de Sistema",
            texto: "Procuro entender como frontend, backend, banco de dados, APIs e experiência do usuário se conectam para formar uma solução coerente.",
        },

        {
            numero: "03",
            titulo: "Aprendizado Contínuo",
            texto: "Tenho uma postura de evolução constante. Busco compreender os fundamentos por trás das ferramentas, em vez de apenas reproduzir soluções prontas.",
        },

        {
            numero: "04",
            titulo: "Pensamento Orientado a Soluções",
            texto: "Meu objetivo não é apenas fazer algo funcionar. Procuro entender o problema, avaliar alternativas e construir soluções simples, sustentáveis e úteis.",
        },
    ];

    return (
        <section
            id="diferenciais"
            className="
                relative
                w-full
                overflow-hidden

                bg-obsidian

                px-5
                py-20

                md:px-10
                md:py-28

                lg:py-32
            "
        >
            {/* =====================================================
                CONTAINER
            ===================================================== */}

            <div
                className="
                    mx-auto
                    flex
                    w-full
                    max-w-[1500px]
                    flex-col
                "
            >
                {/* =================================================
                    CABEÇALHO
                ================================================= */}

                <div
                    className="
                        mb-14
                        flex
                        w-full
                        flex-row
                        items-center
                        gap-2

                        md:mb-20
                    "
                >
                    <h2
                        className="
                            whitespace-nowrap

                            text-sm
                            uppercase
                            tracking-wide
                            text-steel

                            md:text-7xl
                        "
                    >
                        // DIFERENCIAIS
                    </h2>

                    <span
                        className="
                            h-0.5
                            flex-1

                            bg-gradientaa

                            md:h-1
                        "
                    />

                    {/* DESKTOP */}

                    <p
                        className="
                            hidden
                            max-w-md

                            text-steel

                            md:block
                            md:text-sm
                            md:leading-6
                        "
                    >
                        Mais do que ferramentas, eu valorizo a forma como os problemas são analisados e transformados em soluções.
                    </p>
                </div>

                {/* =================================================
                    INTRODUÇÃO — MOBILE
                ================================================= */}

                <div
                    className="
                        mb-16
                        flex
                        max-w-3xl
                        flex-col
                        gap-4

                        md:hidden
                    "
                >
                    <p
                        className="
                            text-sm
                            leading-6
                            text-steel
                        "
                    >
                        Mais do que ferramentas, eu valorizo a forma como os problemas são analisados e transformados em soluções.
                    </p>
                </div>

                {/* =================================================
                    DIFERENCIAIS
                ================================================= */}

                <div
                    className="
                        grid
                        w-full

                        grid-cols-1

                        md:grid-cols-2
                        md:grid-rows-4
                    "
                >
                    {/* =================================================
                        CARD 01
                    ================================================= */}

                    <Card2
                        number={diferenciais[0].numero}
                        title={diferenciais[0].titulo}
                        text={diferenciais[0].texto}
                        variant="default"
                        className="
                            w-full
                            md:col-start-1
                            md:row-start-1
                            md:max-w-[90%]
                        "
                    />

                    {/* =================================================
                        CARD 02
                    ================================================= */}

                    <Card2
                        number={diferenciais[1].numero}
                        title={diferenciais[1].titulo}
                        text={diferenciais[1].texto}
                        variant="default"
                        className="
                            w-full
                            md:col-start-2
                            md:row-start-2
                            md:ml-auto
                            md:max-w-[90%]
                        "
                    />

                    {/* =================================================
                        CARD 03
                    ================================================= */}

                    <Card2
                        number={diferenciais[2].numero}
                        title={diferenciais[2].titulo}
                        text={diferenciais[2].texto}
                        variant="default"
                        className="
                            w-full
                            md:col-start-1
                            md:row-start-3
                            md:max-w-[90%]
                        "
                    />

                    {/* =================================================
                        CARD 04
                    ================================================= */}

                    <Card2
                        number={diferenciais[3].numero}
                        title={diferenciais[3].titulo}
                        text={diferenciais[3].texto}
                        variant="default"
                        className="
                            w-full
                            md:col-start-2
                            md:row-start-4
                            md:ml-auto
                            md:max-w-[90%]
                        "
                    />
                </div>

                {/* =================================================
                    RODAPÉ
                ================================================= */}

                <div
                    className="
                        mt-12
                        flex
                        w-full
                        justify-end

                        md:mt-16
                    "
                >
                    <span
                        className="
                            text-[10px]
                            uppercase
                            tracking-[0.3em]
                            text-steel/60
                        "
                    >
                        Forma de pensar · Forma de construir
                    </span>
                </div>
            </div>
        </section>
    );
}

export default Diferenciais;

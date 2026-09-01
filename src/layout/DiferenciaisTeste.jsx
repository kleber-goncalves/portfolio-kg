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
            className="
                relative
                w-full
                overflow-hidden

                bg-obsidian

                p-5
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
                    max-w-[1600px]
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
                </div>

                {/* =================================================
                    INTRODUÇÃO
                ================================================= */}

                <div
                    className="
                        mb-14
                        flex
                        max-w-3xl
                        flex-col
                        gap-4

                        md:mb-20
                    "
                >
                    <p
                        className="
                            text-steel

                            md:text-2xl
                            md:leading-9
                        "
                    >
                        Mais do que ferramentas, eu valorizo a forma como os
                        problemas são analisados e transformados em soluções.
                    </p>
                </div>

                {/* =================================================
                    LISTA DE DIFERENCIAIS
                ================================================= */}

                <div
                    className="
                        flex
                        w-full
                        flex-col
                    "
                >
                    {diferenciais.map((diferencial) => (
                        <Card2
                            key={diferencial.numero}
                            number={diferencial.numero}
                            title={diferencial.titulo}
                            text={diferencial.texto}
                            variant="default"
                        />
                    ))}
                </div>

                {/* =================================================
                    RODAPÉ DA SEÇÃO
                ================================================= */}

                <div
                    className="
                        mt-10
                        flex
                        w-full
                        justify-end

                        md:mt-14
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

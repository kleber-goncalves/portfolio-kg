import Card1 from "../components/Card1-teste";

function Competencia() {
    const competencias = [
        {
            numero: "01",
            text: "FRONT.",
            title: "React / Frontend",
            description:
                "Desenvolvimento de interfaces modernas, componentizadas e responsivas, com foco em experiência do usuário, organização e reutilização de código.",
        },

        {
            numero: "02",
            text: "BACK.",
            title: "Backend / APIs",
            description:
                "Construção de APIs e sistemas backend utilizando Node.js, integração entre serviços, autenticação e organização das regras de negócio.",
        },

        {
            numero: "03",
            text: "DATA.",
            title: "Banco de Dados",
            description:
                "Modelagem e desenvolvimento de estruturas de dados utilizando PostgreSQL, relacionamentos, consultas e organização das informações.",
        },

        {
            numero: "04",
            text: "ARCH.",
            title: "Arquitetura de Software",
            description:
                "Pensamento orientado à organização do sistema, separação de responsabilidades, manutenção do código e decisões baseadas em trade-offs.",
        },

        {
            numero: "05",
            text: "SEC.",
            title: "Segurança",
            description:
                "Aplicação de boas práticas de segurança em aplicações, autenticação, autorização, proteção de APIs e cuidados com dados.",
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
                        mb-12
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
                            text-steel

                            md:text-7xl
                        "
                    >
                        // COMPETÊNCIAS
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
                        mb-10
                        flex
                        w-full
                        flex-col
                        gap-3

                        md:mb-16
                        md:max-w-3xl
                    "
                >
                    <p
                        className="
        text-base
        leading-relaxed
        text-steel

        md:text-lg
        md:leading-7
    "
                    >
                        Eu posso te ajudar com...
                    </p>
                </div>

                {/* =================================================
                    LISTA
                ================================================= */}

                <div className="w-full">
                    {competencias.map((competencia) => (
                        <Card1 key={competencia.numero} numero={competencia.numero} variant="default" text={competencia.text} title={competencia.title} text_2={competencia.description} />
                    ))}

                    {/* =================================================
                        ÚLTIMA LINHA
                    ================================================= */}

                    <div
                        className="
                        mt-10
                        flex
                        items-center
                        justify-between

                        text-[10px]
                        uppercase
                        tracking-[0.25em]
                        text-steel/60

                        md:mt-10
                        md:text-[10px]
                    "
                    >
                        <span></span>

                        <span>Desenvolvimento contínuo</span>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Competencia;

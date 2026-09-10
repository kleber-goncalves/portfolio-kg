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
            id="competencias"
            className="
                relative
                w-full
                overflow-hidden
                bg-obsidian

                
                p-5
                md:p-10
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
                    md:max-w-[1500px]
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
                        // COMPETENCIAS
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
                        Eu posso te ajudar com...
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
                            text-base
                            leading-6
                            text-steel
                        "
                    >
                        Eu posso te ajudar com...
                    </p>
                </div>

                {/* =================================================
                    LISTA
                ================================================= */}

                <div
                    className=" grid
    w-full
    grid-cols-1
    md:grid-cols-2  "
                >
                    {competencias.map((competencia) => (
                        <Card1 key={competencia.numero} numero={competencia.numero} variant="default" text={competencia.text} title={competencia.title} text_2={competencia.description} />
                    ))}

                    {/* =================================================
                        ÚLTIMA LINHA
                    ================================================= */}
                </div>
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
        </section>
    );
}

export default Competencia;

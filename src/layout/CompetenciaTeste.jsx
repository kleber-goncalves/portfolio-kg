import MagicCard from "../components/MagicCard";

const Competencia = () => {
    return (
        <section
            className="
                w-full
                bg-obsidian
                px-6
                md:px-10
                lg:px-16
            "
        >
            <div
                className="
                    mx-auto
                    w-full
                    max-w-[1600px]
                "
            >
                {/* GRID */}

                <div
                    className="
                        grid
                        grid-cols-1
                        gap-4
                        md:grid-cols-2
                        md:gap-y-5
                        
                    "
                >
                    <MagicCard  categoria="FRONT-END" titulo="Interfaces" descricao="Desenvolvimento de interfaces modernas, responsivas e focadas na experiência do usuário." />

                    <MagicCard  categoria="BACK-END" titulo="Arquitetura" descricao="Construção de aplicações e APIs com organização, integração de dados e regras de negócio." />

                    <MagicCard categoria="FULL STACK" titulo="Desenvolvimento" descricao="Integração entre front-end, back-end e banco de dados para criar aplicações completas." />

                    <MagicCard categoria="ENGENHARIA" titulo="Soluções" descricao="Pensamento estruturado para transformar problemas em soluções funcionais e escaláveis." />

                    <MagicCard categoria="EVOLUÇÃO" titulo="Desenvolvimento contínuo" descricao="Aprendizado constante de novas tecnologias, ferramentas e práticas de desenvolvimento." />
                </div>
            </div>
        </section>
    );
};

export default Competencia;

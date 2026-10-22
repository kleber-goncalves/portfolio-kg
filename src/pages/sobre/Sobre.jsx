import InteriorPageLayout from "../../layouts/InteriorPageLayout";

const PLANNED_SECTIONS = [
    {
        number: "01",
        title: "Trajetória",
        description: "Experiências, evolução técnica e decisões que marcaram o caminho.",
    },
    {
        number: "02",
        title: "Formação",
        description: "Estudos, cursos e conhecimentos desenvolvidos ao longo do tempo.",
    },
    {
        number: "03",
        title: "Competências",
        description: "Tecnologias, práticas e áreas em que venho trabalhando.",
    },
    {
        number: "04",
        title: "Diferenciais",
        description: "Como penso, estruturo soluções e colaboro durante o desenvolvimento.",
    },
];

function Sobre() {
    return (
        <InteriorPageLayout
            eyebrow="// PERFIL PROFISSIONAL"
            title="Sobre"
            description="Uma visão organizada da minha trajetória, formação, competências e da maneira como abordo problemas de desenvolvimento."
        >
            <section className="mx-auto w-full max-w-7xl px-5 pb-10 b-md:px-10 b-md:pb-16">
                <div className="grid gap-4 sm:grid-cols-2">
                    {PLANNED_SECTIONS.map(({ number, title, description }) => (
                        <article
                            key={number}
                            className="border border-graphite bg-carbon/40 p-5 b-md:p-7"
                        >
                            <span className="text-xs tracking-[0.18em] text-bronze">
                                {number}
                            </span>
                            <h2 className="mt-5 font-space text-xl font-medium text-ivory b-md:text-2xl">
                                {title}
                            </h2>
                            <p className="mt-3 text-sm leading-6 text-steel">
                                {description}
                            </p>
                        </article>
                    ))}
                </div>

                <p className="mt-8 max-w-3xl border-l border-bronze pl-4 text-sm leading-6 text-steel">
                    Esta é a estrutura inicial da rota. O conteúdo atual de competências,
                    diferenciais e formação continua na Home até ser migrado e validado
                    nesta página; a seção de trajetória também precisa ser separada do
                    Hero com cuidado para preservar as animações existentes.
                </p>
            </section>
        </InteriorPageLayout>
    );
}

export default Sobre;

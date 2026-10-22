import InteriorPageLayout from "../../layouts/InteriorPageLayout";

function Projetos() {
    return (
        <InteriorPageLayout
            eyebrow="// PORTFÓLIO"
            title="Projetos"
            description="Uma página dedicada aos projetos, com informações sobre objetivos, tecnologias, decisões técnicas e resultados."
        >
            <section className="mx-auto w-full max-w-7xl px-5 pb-16 b-md:px-10 b-md:pb-24">
                <div className="border border-graphite bg-carbon/40 p-5 b-md:p-8">
                    <p className="text-xs uppercase tracking-[0.18em] text-bronze">
                        Em desenvolvimento
                    </p>
                    <h2 className="mt-4 font-space text-xl font-medium text-ivory b-md:text-2xl">
                        O catálogo completo será construído nesta página.
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-steel">
                        Enquanto isso, os projetos em destaque continuam disponíveis na Home.
                        Esta rota não reutiliza a seção de destaque para evitar duplicar a
                        apresentação antes de definirmos o catálogo completo.
                    </p>
                </div>
            </section>
        </InteriorPageLayout>
    );
}

export default Projetos;

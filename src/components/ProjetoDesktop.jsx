import { ArrowUpRight, ExternalLink } from "lucide-react";

export default function ProjetoDesktop({ numero, titulo, descricao, tecnologias = [], iframe, demo, github }) {
    return (
        <article className="group flex h-[78vh] w-[82vw] max-w-[1250px] shrink-0 flex-col justify-center">
            {/* =============================================================== */}
            {/* HEADER */}
            {/* =============================================================== */}

            <div className="mb-5 flex items-end justify-between border-t border-graphite pt-4">
                <div className="flex items-center gap-4">
                    <span className="font-bebas text-sm tracking-[0.2em] text-bronze">{numero}</span>

                    <span className="h-px w-8 bg-graphite" />

                    <span className="font-bebas text-xs uppercase tracking-[0.2em] text-steel">Projeto</span>
                </div>

                <ArrowUpRight className="h-5 w-5 text-steel/40 transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-bronze" strokeWidth={1.5} />
            </div>

            {/* =============================================================== */}
            {/* IFRAME */}
            {/* =============================================================== */}

            <div className="relative h-[50vh] w-full overflow-hidden border border-graphite bg-carbon">
                {/* BARRA DO PREVIEW */}

                <div className="pointer-events-none absolute left-0 top-0 z-20 flex h-9 w-full items-center border-b border-graphite bg-obsidian/90 px-3 backdrop-blur-sm">
                    <div className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-graphite" />
                        <span className="h-1.5 w-1.5 rounded-full bg-graphite" />
                        <span className="h-1.5 w-1.5 rounded-full bg-graphite" />
                    </div>

                    <span className="ml-auto font-bebas text-[9px] uppercase tracking-[0.2em] text-steel/50">Live Preview</span>
                </div>

                {/* IFRAME */}

                <iframe src={iframe} title={`Preview do projeto ${titulo}`} loading="lazy" className="h-full w-full border-0 pt-9" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />

                {/* BORDA HOVER */}

                <div className="pointer-events-none absolute inset-0 border border-transparent transition-colors duration-500 group-hover:border-bronze/30" />
            </div>

            {/* =============================================================== */}
            {/* INFORMAÇÕES */}
            {/* =============================================================== */}

            <div className="mt-6">
                {/* TÍTULO */}

                <h3 className="font-space text-4xl font-semibold uppercase leading-[0.95] text-ivory lg:text-5xl">{titulo}</h3>

                {/* TECNOLOGIAS */}

                <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1">
                    {tecnologias.map((tecnologia) => (
                        <span key={tecnologia} className="font-bebas text-[10px] uppercase tracking-[0.18em] text-bronze">
                            {tecnologia}
                        </span>
                    ))}
                </div>

                {/* DESCRIÇÃO */}

                <p className="mt-4 max-w-2xl text-[15px] leading-6 text-steel">{descricao}</p>

                {/* LINKS */}

                <div className="mt-5 flex items-center gap-3">
                    {demo && (
                        <a href={demo} target="_blank" rel="noopener noreferrer" className="group/link inline-flex items-center gap-2 rounded-full border border-ivory bg-ivory px-5 py-2.5 font-bebas text-xs uppercase tracking-[0.15em] text-obsidian transition-all duration-300 hover:border-bronze hover:bg-bronze">
                            Ver projeto
                            <ExternalLink className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" strokeWidth={1.8} />
                        </a>
                    )}

                    {github && (
                        <a href={github} target="_blank" rel="noopener noreferrer" className="group/link inline-flex items-center gap-2 rounded-full border border-graphite px-5 py-2.5 font-bebas text-xs uppercase tracking-[0.15em] text-steel transition-all duration-300 hover:border-bronze hover:text-bronze">
                            GitHub
                            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" strokeWidth={1.8} />
                        </a>
                    )}
                </div>
            </div>
        </article>
    );
}

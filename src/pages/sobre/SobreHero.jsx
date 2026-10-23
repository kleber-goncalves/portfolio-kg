import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { scrollToTarget } from "../../utils/lenisControl";

function handleSectionNavigation(event, sectionId) {
    event.preventDefault();

    const section = document.getElementById(sectionId);
    if (section) {
        scrollToTarget(section, { duration: 1.2, offset: -16 });
    }
}

function SobreHero() {
    return (
        <section
            aria-labelledby="sobre-hero-title"
            className="relative isolate overflow-hidden border-b border-graphite/80"
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 right-0 hidden w-[38%] border-l border-graphite/40 b-md:block"
            />

            <div
                className="
                    relative
                    mx-auto
                    grid
                    w-full
                    max-w-7xl
                    grid-cols-1
                    items-center
                    gap-12
                    px-5
                    py-12

                    b-md:grid-cols-[minmax(0,1.08fr)_minmax(280px,0.92fr)]
                    b-md:gap-12
                    b-md:px-10
                    b-md:py-16

                    c-lg:gap-16
                    c-lg:py-20
                "
            >
                <div className="relative z-10 max-w-2xl">
                    <div className="flex items-center gap-3">
                        <span aria-hidden="true" className="h-px w-8 shrink-0 bg-bronze" />
                        <p className="font-space text-[10px] uppercase tracking-[0.22em] text-bronze">
                            // PERFIL PROFISSIONAL
                        </p>
                    </div>

                    <h1
                        id="sobre-hero-title"
                        className="
                            mt-6
                            max-w-[11ch]
                            font-space
                            text-5xl
                            font-medium
                            leading-[0.94]
                            tracking-[-0.06em]
                            text-ivory

                            b-md:text-6xl
                            c-lg:text-7xl
                            d-xl:text-8xl
                        "
                    >
                        Da interface
                        <br />
                        ao <span className="text-bronze">sistema.</span>
                    </h1>

                    <p className="mt-6 max-w-xl text-sm leading-7 text-steel b-md:text-base b-md:leading-8">
                        Desenvolvo aplicações web pensando não só na interface, mas também em
                        como APIs, dados, desempenho e organização do código se conectam.
                    </p>

                    <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
                        <a
                            href="#competencias"
                            onClick={(event) => handleSectionNavigation(event, "competencias")}
                            className="
                                group
                                inline-flex
                                min-h-11
                                items-center
                                gap-3
                                border
                                border-bronze
                                bg-bronze
                                px-4
                                py-3
                                font-space
                                text-[10px]
                                font-medium
                                uppercase
                                tracking-[0.12em]
                                text-obsidian
                                transition-colors
                                duration-200
                                hover:border-warm-bronze
                                hover:bg-warm-bronze
                                focus-visible:outline
                                focus-visible:outline-2
                                focus-visible:outline-offset-4
                                focus-visible:outline-champagne
                            "
                        >
                            Explorar competências
                            <ArrowDownRight
                                aria-hidden="true"
                                size={15}
                                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:translate-y-0.5"
                            />
                        </a>

                        <a
                            href="#formacao"
                            onClick={(event) => handleSectionNavigation(event, "formacao")}
                            className="
                                group
                                inline-flex
                                min-h-11
                                items-center
                                gap-2
                                py-3
                                font-space
                                text-[10px]
                                uppercase
                                tracking-[0.12em]
                                text-steel
                                transition-colors
                                duration-200
                                hover:text-champagne
                                focus-visible:outline
                                focus-visible:outline-2
                                focus-visible:outline-offset-4
                                focus-visible:outline-champagne
                            "
                        >
                            Ver formação
                            <ArrowUpRight
                                aria-hidden="true"
                                size={15}
                                className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                            />
                        </a>
                    </div>

                    <div className="mt-9 flex items-center gap-4 border-t border-graphite pt-5 b-md:mt-11">
                        <span className="font-bebas text-3xl leading-none text-graphite">01</span>
                        <div className="flex flex-col gap-1">
                            <span className="font-space text-[9px] uppercase tracking-[0.18em] text-steel">
                                Minha abordagem
                            </span>
                            <span className="text-xs text-ivory">
                                Interface <span className="text-bronze">/</span> API{" "}
                                <span className="text-bronze">/</span> Dados
                            </span>
                        </div>
                    </div>
                </div>

                <div className="relative mx-auto w-full max-w-[350px] pb-5 b-md:max-w-[420px] b-md:justify-self-end">
                    <div
                        aria-hidden="true"
                        className="absolute bottom-0 left-5 right-[-8px] top-5 border border-bronze/70"
                    />

                    <div className="relative aspect-[4/5] w-full overflow-hidden border border-graphite bg-carbon">
                        <img
                            src="/euNvEnvt.png"
                            alt="Retrato de Kleber Gonçalves"
                            loading="eager"
                            fetchPriority="high"
                            decoding="async"
                            className="absolute inset-0 h-full w-full object-cover object-top"
                        />

                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-x-0 bottom-0 h-[24%] bg-gradient-to-t from-obsidian/70 to-transparent"
                        />

                        <div className="absolute left-4 top-4 flex items-center gap-2 border border-graphite/90 bg-obsidian/85 px-3 py-2">
                            <span aria-hidden="true" className="h-1.5 w-1.5 bg-bronze" />
                            <span className="font-space text-[9px] uppercase tracking-[0.16em] text-ivory">
                                Profile / 01
                            </span>
                        </div>

                        <div className="absolute bottom-4 left-4 right-4">
                            <p className="font-space text-[10px] uppercase tracking-[0.18em] text-champagne">
                                Kleber Gonçalves
                            </p>
                            <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-ivory/75">
                                Desenvolvedor web
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3 pl-1">
                        <span className="font-space text-[9px] uppercase tracking-[0.16em] text-steel">
                            Interface
                        </span>
                        <span aria-hidden="true" className="h-px flex-1 bg-graphite" />
                        <span className="font-space text-[9px] uppercase tracking-[0.16em] text-steel">
                            API
                        </span>
                        <span aria-hidden="true" className="h-px flex-1 bg-graphite" />
                        <span className="font-space text-[9px] uppercase tracking-[0.16em] text-steel">
                            Dados
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default SobreHero;

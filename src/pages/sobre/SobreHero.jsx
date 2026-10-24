
function SobreHero() {
    return (
        <section aria-labelledby="sobre-hero-title" className="relative isolate overflow-x-clip border-b border-graphite/80">
            <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 hidden w-[38%] b-md:block" />

            <div
                className="
                    relative
                    mx-auto
                    grid
                    w-full
                    b-md:max-w-[1500px]
                    grid-cols-1
                    
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
                <div className="relative z-10 max-w-2xl b-md:sticky b-md:top-24 b-md:self-start">
                    <h1
                        id="sobre-hero-title"
                        className="
                            
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

                    <p className="mt-6 max-w-xl text-sm leading-7 text-steel b-md:text-base b-md:leading-8">Desenvolvo aplicações web pensando não só na interface, mas também em como APIs, dados, desempenho e organização do código se conectam.</p>
                </div>

                <div className="relative mx-auto w-full max-w-[350px] pb-5 b-md:max-w-[720px] b-md:pb-0 b-md:justify-self-end">
                    <div className="relative aspect-[4/5] w-full overflow-hidden border border-graphite bg-carbon">
                        <img src="/euNvEnvt.png" alt="Retrato de Kleber Gonçalves" loading="eager" fetchPriority="high" decoding="async" className="absolute inset-0 h-full w-full object-cover object-top" />

                        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[24%] bg-gradient-to-t from-obsidian/70 to-transparent" />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default SobreHero;

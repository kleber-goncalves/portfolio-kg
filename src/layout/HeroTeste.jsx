
import Socials from "../components/Socials";

function Hero() {
    return (
        <section className="relative w-full overflow-hidden bg-obsidian p-5 md:p-10">
            <div className="relative aspect-[390/790] w-full">
                {/* =========================
                SVG MOBILE
            ========================== */}
                <img src="/hero-vetor-1.svg" alt="" aria-hidden="true" className="absolute left-0 top-0 w-full h-full md:hidden" />

                {/* =========================
                CONTEÚDO
            ========================== */}
                <div className="relative z-10 flex flex-col h-full">
                    {/* K */}
                    <div className="absolute left-5 top-5">
                        <span className="font-bebas text-6xl text-bronze">K</span>
                    </div>

                    {/* FOTO */}
                    <div className="mt-26 flex flex-col gap-6">
                        <div className="relative flex h-54 w-54 items-center justify-center rounded-xl border border-bronze shadow-sm shadow-warm-bronze">
                            <img
                                src="https://github.com/kleber-goncalves.png"
                                alt="Kleber Dev"
                                className="w-full h-full rounded-xl"
                            />

                            <div className="absolute -right-10 top-10 h-80 w-80 rounded-full bg-[#A87852]/22 blur-[80px]" />
                        </div>

                        {/* NOME */}
                        <div className="flex flex-col gap-2">
                            <h1 className="font-bebas text-6xl leading-none text-ivory">
                                Kleber
                                <br />
                                Dev.
                            </h1>

                            <p className="text-xs text-steel">
                                Frontend · Backend · Fullstack · <strong className="text-bronze">Analista de Sistemas</strong>
                            </p>
                        </div>

                        {/* DESCRIÇÃO */}
                        <div className="flex flex-col gap-5 text-sm text-steel">
                            <p>Meu nome é Kleber e sou formado em Análise e Desenvolvimento de Sistemas.</p>

                            <p>Trabalho com desenvolvimento e busco construir sistemas pensando primeiro na estrutura e nas decisões técnicas.</p>
                        </div>
                    </div>

                    {/* REDES */}
                    <div className="absolute bottom-[2%] left-0 right-5 z-30">
                        <Socials />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Hero;

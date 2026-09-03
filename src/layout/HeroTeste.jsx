import Socials from "../components/Socials";
import MenuMobile from "../components/MenuMobile";

function Hero() {
    const menuItems = [
        {
            label: "Sobre",
            href: "#sobre",
        },
        {
            label: "Competências",
            href: "#competencias",
        },
        {
            label: "Projetos",
            href: "#projetos",
        },
        {
            label: "Diferenciais",
            href: "#diferenciais",
        },
        {
            label: "Formação",
            href: "#formacao",
        },
    ];
    return (
        <section className="relative w-full overflow-hidden bg-obsidian p-4 md:p-10">
            <div className="relative aspect-[390/790] w-full">
                {/* =========================
                SVG MOBILE
            ========================== */}
                <img src="/hero-vetor-5.svg" alt="" aria-hidden="true" className="absolute left-0 top-0 w-full h-full md:hidden" />

                {/* =========================
                CONTEÚDO
            ========================== */}
                <div className="relative z-10 flex flex-col h-full">
                    {/* K */}
                    <div className="absolute left-4 top-4 h-15 w-15">
                        <img src="/logo.svg" alt="" srcset="" />
                    </div>

                    <div
                        className="
                            absolute
                            right-4
                            top-6
                            z-31

                        "
                    >
                        <MenuMobile items={menuItems} />
                    </div>

                    {/* FOTO */}
                    <div className="mt-25 flex flex-col gap-6 pl-3 pr-3">
                        <div className="relative flex h-54 w-54 items-center justify-center rounded-xl border border-bronze shadow-sm shadow-warm-bronze">
                            <img src="https://github.com/kleber-goncalves.png" alt="Kleber Dev" className="w-full h-full rounded-xl" />

                            <div className="absolute -right-50 top-12 h-70 w-40 rounded-full bg-[#A87852]/22 blur-[90px]" />
                        </div>

                        {/* NOME */}
                        <div className="flex flex-col gap-2">
                            <h1 className="font-bebas font-bold text-6xl text-ivory">
                                Kleber
                                <br />
                                Dev.
                            </h1>

                            <p className="text-xs text-steel">
                                Frontend · Backend · Fullstack · <strong className="text-bronze">Analista de Sistemas</strong>
                            </p>
                        </div>

                        {/* DESCRIÇÃO */}
                        <div className="flex flex-col gap-4 pt-3 text-sm text-steel">
                            <p>Meu nome é Kleber, tenho 21 anos e Sou formado em Análise e Desenvolvimento de Sistemas pela universidade Uniube e possuo formação em Fullstack pela DNC com simulação profissional real.</p>

                            <p>Prefiro chegar com uma hipótese formada antes de buscar ajuda de uso IA pra acelerar implementação, não como substituto de raciocínio.</p>
                        </div>
                    </div>

                    {/* REDES */}
                    <div className="absolute bottom-[2%] left-0 right-4 z-30">
                        <Socials />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Hero;

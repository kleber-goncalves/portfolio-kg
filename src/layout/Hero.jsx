import { Github, Linkedin, Instagram } from "@thesvg/react";

function Hero() {
    return (
        <section className="bg-obsidian w-full h-screen relative flex flex-row ">
            <div id="eft1">
                <h1 className="text-5xl md:text-7xl text-amber-700 font-bold text-center">
                    K
                </h1>
                <img src="" alt="" />
            </div>
            <div id="content">
                <div
                    id="cx-span"
                    className="flex flex-col gap-2 items-end justify-center w-full"
                >
                    <span></span>
                    <span></span>
                </div>
                <div id="cx3" className="flex  flex-col gap-6">
                    <div className="flex border  border-bronze w-54 h-54 items-center justify-center rounded-xl shadow-sm  shadow-warm-bronze ">
                        <img
                            src="https://github.com/kleber-goncalves.png"
                            alt="Kleber Dev"
                            className="w-full h-full rounded-xl z-1"
                        />
                        <div
                            class="absolute
                                 -right-10
               top-10
               w-80 h-80
               rounded-full
               bg-[#A87852]/22
               blur-[80px]"
                        ></div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h1 className="text-6xl md:text-7xl font-bold bebas-neue-regular text-ivory">
                            Kleber<br></br> Dev.
                        </h1>
                        <p className="text-xs md:text-3xl text-steel">
                            Frontend · Backend · Fullstack ·{" "}
                            <strong className="text-bronze">
                                Analista de Sistemas
                            </strong>
                        </p>
                    </div>
                    <div className="flex flex-col mt-3 gap-5 text-sm md:text-3xl text-steel">
                        <p>
                            Meu nome é Kleber, tenho 21 anos e Sou formado em
                            Análise e Desenvolvimento de Sistemas pela
                            universidade Uniube e possuo formação em Fullstack
                            pela DNC com simulação profissional real com Scrum,
                            sprints, revisão de código, metodologias ágeis.
                        </p>

                        <p>
                            Trabalho como anilista de projetos, acumulando
                            responsabilidades de desenvolvimento e revisão de
                            PRs sob supervisão sênior. Prefiro chegar com uma
                            hipótese formada antes de buscar ajuda de uso IA pra
                            acelerar implementação, não como substituto de
                            raciocínio.
                        </p>
                    </div>
                </div>
                <span id="cx"></span>

                <div
                    id="cx4"
                    className="flex flex-row gap-6 items-center justify-center"
                >
                    <div className="flex  w-14 h-14 rounded-full">
                        <Github className="w-full h-full" variant="dark" />
                    </div>
                    <div className=" flex  w-13 h-13 rounded-full">
                        <Linkedin className="w-full h-full" />
                    </div>
                    <div className=" flex   w-13 h-13 rounded-full">
                        <Instagram className="w-full h-full" />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Hero;

function Formacao() {
    return (
        <section className="bg-obsidian w-full h-full p-5 md:p-10 relative overflow-hidden flex flex-col items-center gap-10">
            <div className="flex flex-col items-center gap-10 w-full">
                <div className="flex flex-row items-center gap-2 w-full">
                    <h2 className="text-sm md:text-7xl  text-steel uppercase">
                        // Formação & Nivel Técnico
                    </h2>
                    <span className="flex-1 h-0.5 md:h-1 bg-gradientaa"></span>
                </div>
                <div className="w-full h-full relative overflow-hidden flex flex-col items-center gap-3">
                    <div className="flex flex-col items-start gap-5 w-full rounded-3xl p-5 md:p-10 border border-graphite">
                        <div className="flex flex-col gap-2">
                            <p className="text-xs md:text-3xl text-steel uppercase">
                                Nivel auto avaliado
                            </p>
                            <h2 className="text-5xl md:text-7xl font-bold bebas-neue-regular text-ivory">
                                Junior<br></br>
                            </h2>
                        </div>
                        <div className="flex flex-col mt-3 gap-5 text-sm md:text-3xl text-steel">
                            <p>
                                Formado nos cursos de
                                <b className="font-bold">
                                    <span className="text-bronze">
                                        {" "}
                                        Front-end
                                    </span>{" "}
                                    e
                                    <span className="text-bronze">
                                        {" "}
                                        Back-end
                                    </span>
                                </b>{" "}
                                da DNC, com formação prática que simula o
                                mercado real e voltada ao desenvolvimento de
                                aplicações web, construção de interfaces, APIs,
                                integração com bancos de dados e desenvolvimento
                                Full Stack.
                            </p>

                            <p>
                                Atualmente, estou concluindo{" "}
                                <b className="font-bold">
                                    <span className="text-bronze">
                                        Análise e Desenvolvimento de Sistemas
                                    </span>{" "}
                                    <span className="text-bronze">
                                        pela Uniube — Uberaba
                                    </span>
                                </b>
                                , com aproximadamente{" "}
                                <b className="font-bold text-bronze">
                                    87% da graduação concluída
                                </b>{" "}
                                em uma formação de ~2 anos e meio, com o foco em
                                Scrum, sprints e projetos em equipe. O nível
                                reflete o que a formação entregou, não tempo de
                                mercado.
                            </p>
                        </div>
                        <div className="flex flex-col mt-3 gap-2 text-sm md:text-3xl text-steel">
                            <p className="font-bold">FORMAÇÃO</p>
                            <p>[██████████░░░] 87% ADS · Uniube</p>
                            <p>UNIUBE · ADS</p>
                            <p>2,5 anos · em conclusão</p>
                        </div>
                        <div className="flex flex-col mt-3 gap-2 text-sm md:text-3xl text-steel">
                            <p className="font-bold">FORMAÇÃO COMPLEMENTAR</p>
                            <p>✓ Front-end — concluído</p>
                            <p>✓ Back-end — concluído</p>
                        </div>
                    </div>
                    <div></div>
                </div>
            </div>
        </section>
    );
}

export default Formacao;

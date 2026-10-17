import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import OptimizedImage from "./OptimizedImage";

function ProjetoCard({
    numero,
    titulo,
    descricao,
    tecnologias = [],
    tecnologiasConfig = {},
    imagens = [],
    demo,
    github,
}) {
    const cardRef = useRef(null);
    const imageRef = useRef(null);
    const intervalRef = useRef(null);

    const [imagemAtual, setImagemAtual] = useState(0);
    const [imagensComErro, setImagensComErro] = useState([]);
    const [pausado, setPausado] = useState(false);
    const [ativo, setAtivo] = useState(false);

    // Considera somente caminhos de imagem válidos e ignora os que falharam ao carregar.
    const imagensInformadas = Array.isArray(imagens)
        ? imagens.filter((imagem) => typeof imagem === "string" && imagem.trim() !== "")
        : [];

    const imagensDisponiveis = imagensInformadas.filter(
        (imagem) => !imagensComErro.includes(imagem),
    );

    const quantidadeImagens = imagensDisponiveis.length;
    const indiceImagemAtual =
        quantidadeImagens > 0 ? imagemAtual % quantidadeImagens : 0;
    const imagemSelecionada = imagensDisponiveis[indiceImagemAtual] ?? null;

    useEffect(() => {
        const card = cardRef.current;

        if (!card) return undefined;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setAtivo(entry.isIntersecting);
            },
            {
                threshold: 0.3,
            },
        );

        observer.observe(card);

        return () => {
            observer.disconnect();
        };
    }, []);

    // Só alterna imagens quando há duas ou mais imagens disponíveis.
    useEffect(() => {
        if (quantidadeImagens <= 1 || !ativo || pausado) {
            return undefined;
        }

        intervalRef.current = setInterval(() => {
            setImagemAtual((anterior) => (anterior + 1) % quantidadeImagens);
        }, 3500);

        return () => {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        };
    }, [quantidadeImagens, ativo, pausado]);

    useEffect(() => {
        if (!imageRef.current || !imagemSelecionada) return;

        gsap.fromTo(
            imageRef.current,
            {
                opacity: 0,
                scale: 1.03,
            },
            {
                opacity: 1,
                scale: 1,
                duration: 0.6,
                ease: "power2.out",
            },
        );
    }, [imagemSelecionada]);

    useEffect(() => {
        return () => {
            if (imageRef.current) {
                gsap.killTweensOf(imageRef.current);
            }
        };
    }, []);

    const mudarImagem = (index) => {
        setImagemAtual(index);
    };

    const alternarPausa = () => {
        setPausado((anterior) => !anterior);
    };

    const registrarErroImagem = (imagemComErro) => {
        if (!imagemComErro) return;

        setImagensComErro((anteriores) =>
            anteriores.includes(imagemComErro)
                ? anteriores
                : [...anteriores, imagemComErro],
        );
        setImagemAtual(0);
    };

    return (
        <article
            ref={cardRef}
            className="flex h-auto w-[89vw] shrink-0 flex-col self-start overflow-hidden rounded-3xl bg-neutral-900"
        >
            {/* PREVIEW */}
            <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-neutral-950">
                {imagemSelecionada ? (
                    <OptimizedImage
                        key={imagemSelecionada}
                        imageRef={imageRef}
                        src={imagemSelecionada}
                        alt={"Captura de tela do projeto " + titulo}
                        width={1600}
                        height={900}
                        loading="lazy"
                        fetchPriority="low"
                        onError={() => registrarErroImagem(imagemSelecionada)}
                        wrapperClassName="absolute inset-0"
                        className="object-cover"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
                        <p role="status" className="text-sm font-medium text-white/70">
                            Não tenho imagens
                        </p>
                    </div>
                )}

                {quantidadeImagens > 0 && (
                    <>
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                        <div className="absolute inset-0 bg-black/10" />
                    </>
                )}

                {/* NÚMERO DO PROJETO */}
                <div className="absolute left-5 top-5 z-10">
                    <span className="text-sm font-medium text-white">{numero}</span>
                </div>

                {/* QUANTIDADE E CONTROLES — SÓ QUANDO HÁ IMAGENS */}
                {quantidadeImagens > 0 && (
                    <div className="absolute right-5 top-5 z-10 flex items-center gap-2">
                        <span
                            aria-live="polite"
                            className="rounded-full bg-black/70 px-3 py-1 text-xs text-white backdrop-blur-md"
                        >
                            {quantidadeImagens}{" "}
                            {quantidadeImagens === 1 ? "imagem" : "imagens"}
                        </span>

                        {quantidadeImagens > 1 && (
                            <button
                                type="button"
                                onClick={alternarPausa}
                                aria-pressed={pausado}
                                title={
                                    pausado
                                        ? "Retomar alternância das imagens"
                                        : "Pausar alternância das imagens"
                                }
                                className="rounded-full bg-black/70 px-3 py-1 text-xs text-white backdrop-blur-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                            >
                                {pausado ? "▶ Continuar" : "Ⅱ Pausar"}
                            </button>
                        )}
                    </div>
                )}

                {/* INDICADORES — UM POR IMAGEM DISPONÍVEL */}
                {quantidadeImagens > 1 && (
                    <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
                        {imagensDisponiveis.map((imagem, index) => (
                            <button
                                key={imagem}
                                type="button"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    mudarImagem(index);
                                }}
                                className={[
                                    "flex h-6 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
                                    index === indiceImagemAtual ? "w-8" : "w-6",
                                ].join(" ")}
                                aria-label={"Mostrar imagem " + (index + 1)}
                                title={"Mostrar imagem " + (index + 1)}
                            >
                                <span
                                    aria-hidden="true"
                                    className={[
                                        "h-1.5 rounded-full transition-all duration-300",
                                        index === indiceImagemAtual
                                            ? "w-8 bg-white"
                                            : "w-2 bg-white/40",
                                    ].join(" ")}
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* INFORMAÇÕES */}
            <div className="flex h-auto flex-col p-5">
                <div>
                    <h2 className="mt-2 text-3xl font-bold uppercase text-white">
                        {titulo}
                    </h2>

                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-white">
                        {descricao}
                    </p>
                </div>

                {/* TECNOLOGIAS */}
                <div className="mt-5 flex flex-wrap gap-2">
                    {tecnologias.map((tecnologia) => {
                        const tech = tecnologiasConfig[tecnologia];

                        if (!tech) return null;

                        const Icon = tech.icone;

                        return (
                            <span
                                key={tecnologia}
                                className={[
                                    "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-white",
                                    tech.border,
                                ].join(" ")}
                            >
                                {Icon && (
                                    <Icon className={"h-3.5 w-3.5 shrink-0 " + tech.icon} />
                                )}

                                <span className="text-xs font-medium">{tech.nome}</span>
                            </span>
                        );
                    })}
                </div>

                {/* LINKS */}
                <div className="flex shrink-0 gap-3 pt-4">
                    {demo && (
                        <a
                            href={demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(event) => event.stopPropagation()}
                            className="rounded-full bg-white px-4 py-3 text-sm font-medium text-black transition-transform duration-300 hover:scale-105"
                        >
                            Demo ↗
                        </a>
                    )}

                    {github && (
                        <a
                            href={github}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(event) => event.stopPropagation()}
                            className="rounded-full border border-white/20 px-6 py-2.5 text-sm font-medium text-white transition-colors duration-300 hover:bg-white/10"
                        >
                            GitHub ↗
                        </a>
                    )}
                </div>
            </div>
        </article>
    );
}

export default ProjetoCard;

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

function ProjetoCard({
    numero,
    titulo,
    descricao,
    tecnologias = [],
    imagens = [],
    demo,
    github,
}) {
    const cardRef = useRef(null);
    const imageRef = useRef(null);
    const intervalRef = useRef(null);

    const [imagemAtual, setImagemAtual] = useState(0);
    const [pausado, setPausado] = useState(false);
    const [ativo, setAtivo] = useState(false);

    /*
    ============================================================
    DETECTAR SE O CARD ESTÁ VISÍVEL
    ============================================================
    */

    useEffect(() => {
        const card = cardRef.current;

        if (!card) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                /*
                Só consideramos o card ativo quando uma
                parte significativa dele está visível.
                */

                setAtivo(entry.isIntersecting);
            },
            {
                /*
                Como seus cards são grandes, 30% é um
                bom ponto para considerar o projeto ativo.
                */

                threshold: 0.3,
            },
        );

        observer.observe(card);

        return () => {
            observer.disconnect();
        };
    }, []);

    /*
    ============================================================
    TROCA AUTOMÁTICA DAS IMAGENS
    ============================================================
    */

    useEffect(() => {
        /*
        Se:

        - não existem imagens suficientes;
        - o card não está ativo;
        - o usuário pausou;

        NÃO criamos nenhum timer.
        */

        if (imagens.length <= 1 || !ativo || pausado) {
            return;
        }

        intervalRef.current = setInterval(() => {
            setImagemAtual((prev) => {
                return (prev + 1) % imagens.length;
            });
        }, 3500);

        /*
        LIMPEZA

        Quando:

        - card sai da tela;
        - usuário pausa;
        - componente desmonta;

        o timer é destruído.
        */

        return () => {
            clearInterval(intervalRef.current);

            intervalRef.current = null;
        };
    }, [imagens.length, ativo, pausado]);

    /*
    ============================================================
    ANIMAÇÃO DA IMAGEM
    ============================================================
    */

    useEffect(() => {
        if (!imageRef.current) return;

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
    }, [imagemAtual]);

    /*
    ============================================================
    LIMPAR ANIMAÇÃO GSAP
    ============================================================
    */

    useEffect(() => {
        return () => {
            if (imageRef.current) {
                gsap.killTweensOf(imageRef.current);
            }
        };
    }, []);

    /*
    ============================================================
    CLIQUE NOS INDICADORES
    ============================================================
    */

    const mudarImagem = (index) => {
        setImagemAtual(index);
    };

    /*
    ============================================================
    PAUSAR / CONTINUAR
    ============================================================
    */

    const alternarPausa = () => {
        setPausado((prev) => !prev);
    };

    return (
        <article
            ref={cardRef}
            className="h-[70vh] w-[80vw] shrink-0 overflow-hidden rounded-3xl bg-neutral-900"
        >
            {/* ==================================================
                PREVIEW
            ================================================== */}

            <div
                className="relative h-[40%] w-full shrink-0 overflow-hidden bg-neutral-950"
                onClick={alternarPausa}
            >
                {imagens.length > 0 && (
                    <img
                        ref={imageRef}
                        src={imagens[imagemAtual]}
                        alt={`Preview do projeto ${titulo}`}
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                )}

                {/* OVERLAY */}

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                <div className="absolute inset-0 bg-black/10" />

                {/* NUMERO */}

                <div className="absolute left-5 top-5 z-10">
                    <span className="text-sm font-medium text-white/60">
                        {numero}
                    </span>
                </div>

                {/* STATUS */}

                <div className="absolute right-5 top-5 z-10">
                    <span className="rounded-full bg-black/50 px-3 py-1 text-xs text-white backdrop-blur-md">
                        {pausado ? "▶ Continuar" : "Ⅱ Pausar"}
                    </span>
                </div>

                {/* INDICADORES */}

                {imagens.length > 1 && (
                    <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
                        {imagens.map((_, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={(event) => {
                                    event.stopPropagation();

                                    mudarImagem(index);
                                }}
                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                    index === imagemAtual
                                        ? "w-8 bg-white"
                                        : "w-2 bg-white/40"
                                }`}
                                aria-label={`Mostrar imagem ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* ==================================================
                INFORMAÇÕES
            ================================================== */}

            <div className="flex h-[52%] flex-col justify-between p-5">
                {/* CABEÇALHO */}

                <div>
                    <span className="text-sm text-white/40">{numero}</span>

                    <h2 className="mt-2 text-3xl font-bold uppercase text-white">
                        {titulo}
                    </h2>

                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/60">
                        {descricao}
                    </p>
                </div>

                {/* TECNOLOGIAS */}

                <div className="mt-5 flex flex-wrap gap-2">
                    {tecnologias.map((tecnologia) => (
                        <span
                            key={tecnologia}
                            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60"
                        >
                            {tecnologia}
                        </span>
                    ))}
                </div>

                {/* LINKS */}

                <div className="mt-auto flex shrink-0 gap-3 pt-4">
                    {demo && (
                        <a
                            href={demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(event) => event.stopPropagation()}
                            className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition-transform duration-300 hover:scale-105"
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
                            className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium text-white transition-colors duration-300 hover:bg-white/10"
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

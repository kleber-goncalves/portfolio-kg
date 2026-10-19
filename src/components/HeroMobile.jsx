import { useLayoutEffect } from "react";

import Socials from "../components/Socials";
import MenuMobile from "../components/MenuMobile";
import OptimizedImage from "./OptimizedImage";

function HeroMobile({ items, onReady }) {
    useLayoutEffect(() => {
        onReady?.("mobile");
    }, [onReady]);

    return (
        <div className="relative w-full">
            {/* SVG DE FUNDO: acompanha a altura real do Hero */}
            <img
                src="/hero-vetor-7.svg"
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 h-full w-full"
            />

            {/* O conteúdo em fluxo determina a altura do Hero */}
            <div className="relative z-10 flex flex-col">
                {/* LOGO */}
                <div className="absolute left-5 top-4 h-13 w-13">
                    <img
                        src="/logo.svg"
                        alt="Kleber Dev"
                        className="h-full w-full"
                    />
                </div>

                {/* MENU MOBILE */}
                <div className="absolute right-4 top-6 z-30">
                    <MenuMobile items={items} />
                </div>

                {/* FOTO + CONTEÚDO */}
                <div className="mt-25 flex flex-col gap-6 px-3">
                    {/* FOTO */}
                    <div className="relative flex h-54 w-54 shrink-0 items-center justify-center rounded-xl border border-bronze shadow-sm shadow-warm-bronze">
                        <OptimizedImage
                            src="https://github.com/kleber-goncalves.png"
                            alt="Retrato de Kleber Gonçalves"
                            width={460}
                            height={460}
                            sizes="216px"
                            loading="eager"
                            fetchPriority="high"
                            wrapperClassName="h-full w-full rounded-xl"
                            className="rounded-xl object-cover"
                        />

                        {/* Glow */}
                        <div
                            aria-hidden="true"
                            className="absolute -right-50 top-12 h-70 w-40 rounded-full bg-[#A87852]/22 blur-[90px]"
                        />
                    </div>

                    {/* NOME + ESPECIALIDADES */}
                    <div className="flex flex-col gap-2">
                        <h1 className="font-bebas text-6xl font-bold text-ivory">
                            Kleber
                            <br />
                            Dev.
                        </h1>

                        <p className="text-xs text-steel">
                            Frontend · Backend · Fullstack ·{" "}
                            <strong className="text-bronze">
                                Analista de Sistemas
                            </strong>
                        </p>
                    </div>

                    {/* DESCRIÇÃO */}
                    <div className="flex flex-col gap-4 pt-3 text-sm text-steel">
                        <p>
                            Atualmente, estou concluindo Análise e
                            Desenvolvimento de Sistemas pela Uniube. Também
                            concluí as formações de Front-end e Back-end da DNC,
                            com prática voltada ao desenvolvimento de aplicações web.
                        </p>

                        <p>
                            Prefiro chegar com uma hipótese formada antes de
                            buscar ajuda, usando IA para acelerar a
                            implementação, não como substituto do raciocínio.
                        </p>
                    </div>
                </div>

                {/* REDES SOCIAIS: ficam no fluxo para não sobrepor o texto */}
                <div className="relative z-30 mt-10 pb-1 pr-4">
                    <Socials />
                </div>
            </div>
        </div>
    );
}

export default HeroMobile;

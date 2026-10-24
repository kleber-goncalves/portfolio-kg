import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

import { CATEGORIAS_PROJETOS, projetosCatalogo } from "../data/projetosCatalogo";
import { tecnologias } from "../data/tecnologias";
import MagneticExternalLinkHover from "./MagneticExternalLinkHover";

function ProjetoCatalogo() {
    const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");

    const projetosFiltrados = categoriaAtiva === "Todos"
        ? projetosCatalogo
        : projetosCatalogo.filter(
            (projeto) => projeto.categoria === categoriaAtiva,
        );

    return (
        <section className="mx-auto w-full max-w-7xl px-5 pb-16 b-md:px-10 b-md:pb-24">
            {/* FILTROS DO CATÁLOGO */}
            <div className="mb-8 border-b border-graphite pb-6">
                <p className="mb-4 text-xs uppercase tracking-[0.18em] text-steel">
                    {projetosFiltrados.length} de {projetosCatalogo.length} projetos
                </p>

                <div
                    aria-label="Filtrar projetos por categoria"
                    className="flex flex-wrap gap-2"
                    role="group"
                >
                    {CATEGORIAS_PROJETOS.map((categoria) => {
                        const quantidade = categoria === "Todos"
                            ? projetosCatalogo.length
                            : projetosCatalogo.filter(
                                (projeto) => projeto.categoria === categoria,
                            ).length;
                        const ativa = categoriaAtiva === categoria;

                        return (
                            <button
                                key={categoria}
                                type="button"
                                aria-pressed={ativa}
                                data-ui-sfx-hover
                                onClick={() => setCategoriaAtiva(categoria)}
                                className={`
                                    inline-flex
                                    items-center
                                    gap-2
                                    border
                                    px-3
                                    py-2
                                    text-xs
                                    tracking-wide
                                    transition-colors
                                    duration-300
                                    focus-visible:outline
                                    focus-visible:outline-2
                                    focus-visible:outline-offset-2
                                    focus-visible:outline-champagne
                                    ${ativa
                                        ? "border-bronze bg-bronze/10 text-champagne"
                                        : "border-graphite text-steel hover:border-bronze/60 hover:text-ivory"}
                                `}
                            >
                                <span>{categoria}</span>
                                <span className={ativa ? "text-champagne/70" : "text-steel/60"}>
                                    {quantidade.toString().padStart(2, "0")}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* LISTA — MESMA LINGUAGEM VISUAL DO PROJETODESKTOP EM REDUCED */}
            <div className="flex w-full flex-col" aria-live="polite">
                {projetosFiltrados.map((projeto) => (
                    <article
                        key={projeto.id}
                        data-ui-sfx-hover
                        className="
                            group
                            relative
                            w-full
                            border-b
                            border-graphite
                            py-6
                            transition-colors
                            duration-500
                            hover:border-bronze/50
                            b-md:py-8
                        "
                    >
                        <div className="flex w-full flex-col gap-4 b-md:flex-row b-md:items-center b-md:justify-between b-md:gap-8">
                            <div className="flex min-w-0 flex-1 items-start gap-4 b-md:gap-8">
                                <span
                                    aria-hidden="true"
                                    className="
                                        w-7
                                        shrink-0
                                        pt-1
                                        font-bebas
                                        text-sm
                                        tracking-[0.2em]
                                        text-bronze
                                        opacity-60
                                        transition-opacity
                                        duration-500
                                        group-hover:opacity-100
                                        b-md:w-10
                                    "
                                >
                                    {projeto.numero}
                                </span>

                                <div className="flex min-w-0 flex-col gap-2">
                                    <h2
                                        className="
                                            font-space
                                            text-xl
                                            font-semibold
                                            leading-tight
                                            text-ivory/70
                                            transition
                                            duration-500
                                            ease-out
                                            group-hover:translate-x-1
                                            group-hover:text-ivory
                                            b-md:text-2xl
                                            c-lg:text-4xl
                                        "
                                    >
                                        {projeto.titulo}
                                    </h2>

                                    <p
                                        className="
                                            max-w-3xl
                                            text-sm
                                            leading-6
                                            text-steel
                                            transition-transform
                                            duration-500
                                            ease-out
                                            group-hover:translate-x-1
                                            b-md:group-hover:translate-x-2
                                        "
                                    >
                                        {projeto.descricao}
                                    </p>

                                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
                                        {projeto.tecnologias.map((nomeTecnologia) => {
                                            const tecnologia = tecnologias[nomeTecnologia];
                                            const Icone = tecnologia?.icone;

                                            return (
                                                <span
                                                    key={nomeTecnologia}
                                                    className={`
                                                        inline-flex
                                                        h-fit
                                                        w-fit
                                                        items-center
                                                        gap-1.5
                                                        rounded-sm
                                                        border
                                                        border-transparent
                                                        px-2
                                                        py-1.5
                                                        text-[11px]
                                                        tracking-[0.08em]
                                                        text-steel
                                                        transition-all
                                                        duration-500
                                                        ease-out
                                                        group-hover:translate-x-1
                                                        ${tecnologia?.hoverBorder ?? "group-hover:border-bronze/50"}
                                                        group-hover:text-white
                                                        b-md:px-3
                                                    `}
                                                >
                                                    {Icone && (
                                                        <Icone
                                                            aria-hidden="true"
                                                            className={`h-4 w-4 ${tecnologia.icon}`}
                                                        />
                                                    )}
                                                    {tecnologia?.nome ?? nomeTecnologia}
                                                </span>
                                            );
                                        })}
                                    </div>

                                    <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-steel/50">
                                        {projeto.categoria}
                                    </p>
                                </div>
                            </div>

                            <div className="ml-11 flex shrink-0 flex-wrap items-center gap-2 b-md:ml-0 b-md:gap-3">
                                {projeto.demo && (
                                    <MagneticExternalLinkHover
                                        href={projeto.demo}
                                        px="px-3"
                                        py="py-2"
                                        accent="#A87852"
                                        borderColor="#242424"
                                        hoverBorderColor="#A87852"
                                        textColor="#8B8B8B"
                                        hoverTextColor="#0D0D0D"
                                        Icon={ArrowUpRight}
                                    >
                                        Preview
                                    </MagneticExternalLinkHover>
                                )}

                                {projeto.github && (
                                    <MagneticExternalLinkHover
                                        href={projeto.github}
                                        px="px-3"
                                        py="py-2"
                                        accent="transparent"
                                        borderColor="#242424"
                                        hoverBorderColor="#F2F0EC"
                                        textColor="#8B8B8B"
                                        hoverTextColor="#F2F0EC"
                                        Icon={ArrowUpRight}
                                    >
                                        GitHub
                                    </MagneticExternalLinkHover>
                                )}
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}

export default ProjetoCatalogo;

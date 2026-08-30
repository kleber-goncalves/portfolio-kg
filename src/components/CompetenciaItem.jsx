export default function CompetenciaItem({
    numero,
    categoria,
    tecnologias = [],
    descricao,
}) {
    return (
        <article
            className="
                group
                relative
                w-full
                border-t
                border-graphite
                py-10
                md:py-14
            "
        >
            {/* ==================================================
                GRID PRINCIPAL
            ================================================== */}

            <div
                className="
                    grid
                    grid-cols-1
                    gap-8
                    md:grid-cols-[120px_1fr_0.8fr]
                    md:gap-16
                "
            >
                {/* ==================================================
                    NÚMERO
                ================================================== */}

                <div className="relative">
                    <span
                        className="
                            block
                            font-bebas
                            text-5xl
                            leading-none
                            tracking-tight
                            text-graphite
                            transition-all
                            duration-500
                            ease-out
                            group-hover:text-bronze
                            md:text-7xl
                        "
                    >
                        {numero}
                    </span>

                    {/* pequeno indicador */}

                    <span
                        className="
                            absolute
                            left-0
                            top-16
                            h-px
                            w-0
                            bg-bronze
                            transition-all
                            duration-500
                            ease-out
                            group-hover:w-8
                            md:top-24
                        "
                    />
                </div>

                {/* ==================================================
                    CONTEÚDO PRINCIPAL
                ================================================== */}

                <div className="flex flex-col gap-7">
                    {/* CATEGORIA */}

                    <div className="flex items-center gap-3">


                        <h3
                            className="
                                font-space
                                text-2xl
                                font-semibold
                                uppercase
                                tracking-[-0.03em]
                                text-ivory
                                transition-transform
                                duration-500
                                ease-out
                                group-hover:translate-x-1
                                md:text-4xl
                            "
                        >
                            {categoria}
                        </h3>
                    </div>

                    {/* TECNOLOGIAS */}

                    <div
                        className="
                            flex
                            max-w-2xl
                            flex-wrap
                            gap-2
                        "
                    >
                        {tecnologias.map((tecnologia) => (
                            <span
                                key={tecnologia}
                                className="
                                    border
                                    border-graphite
                                    px-3
                                    py-1.5
                                    text-[10px]
                                    uppercase
                                    tracking-[0.12em]
                                    text-steel
                                    transition-all
                                    duration-300
                                    ease-out
                                    group-hover:border-bronze/40
                                    group-hover:text-ivory
                                    md:px-4
                                    md:py-2
                                    md:text-xs
                                "
                            >
                                {tecnologia}
                            </span>
                        ))}
                    </div>
                </div>

                {/* ==================================================
                    DESCRIÇÃO
                ================================================== */}

                <div
                    className="
                        flex
                        flex-col
                        justify-between
                        gap-8
                        md:min-h-full
                    "
                >
                    <p
                        className="
                            max-w-md
                            text-xs
                            leading-[1.8]
                            text-steel
                            md:text-sm
                        "
                    >
                        {descricao}
                    </p>

                    {/* INDICADOR */}

                    <div
                        className="
                            hidden
                            items-center
                            justify-end
                            gap-3
                            md:flex
                        "
                    >
                        <span
                            className="
                                text-[9px]
                                uppercase
                                tracking-[0.25em]
                                text-steel/40
                            "
                        >
                            Expertise
                        </span>

                        <span
                            className="
                                h-px
                                w-8
                                bg-graphite
                                transition-all
                                duration-500
                                group-hover:w-14
                                group-hover:bg-bronze
                            "
                        />
                    </div>
                </div>
            </div>

            {/* ==================================================
                LINHA DE PROGRESSO
            ================================================== */}

            <div
                className="
                    absolute
                    bottom-0
                    left-0
                    h-px
                    w-0
                    bg-bronze
                    transition-all
                    duration-700
                    ease-out
                    group-hover:w-full
                "
            />
        </article>
    );
}

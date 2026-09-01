export default function Card2({
    title,
    number,
    text,
    variant = "default",
    className = "",
    classNameNumber = "",
    classNameTitle = "",
    classNameText = "",
    ...props
}) {
    const variants = {
        default: {
            number: "text-bronze",
            title: "text-ivory",
            description: "text-steel",
        },

        v1: {
            number: "text-white",
            title: "text-white",
            description: "text-white/60",
        },

        v2: {
            number: "text-white",
            title: "text-white",
            description: "text-white/60",
        },
    };

    const styles = variants[variant] || variants.default;

    return (
        <article
            className={`
                group
                relative
                w-full

                border-t
                border-graphite

                py-7
                md:py-9

                transition-all
                duration-500
                ease-out

                hover:border-graphite/80

                ${className}
            `}
            {...props}
        >
            {/* =====================================================
                LINHA DE DESTAQUE
            ===================================================== */}

            <span
                className="
                    absolute
                    left-0
                    top-[-1px]

                    h-[2px]
                    w-0

                    bg-gradientaa

                    transition-all
                    duration-700
                    ease-out

                    group-hover:w-full
                    group-active:w-full
                "
            />

            {/* =====================================================
                CONTEÚDO
            ===================================================== */}

            <div
                className="
                    grid

                    grid-cols-[42px_1fr]
                    gap-5

                    md:grid-cols-[70px_1fr]
                    md:gap-10

                    items-start
                "
            >
                {/* =================================================
                    NÚMERO
                ================================================= */}

                <div className="pt-1">
                    <span
                        className={`
                            font-bebas
                            text-xs
                            tracking-[0.2em]

                            md:text-sm

                            opacity-60

                            transition-all
                            duration-500
                            ease-out

                            group-hover:opacity-100
                            group-hover:translate-x-1

                            ${styles.number}
                            ${classNameNumber}
                        `}
                    >
                        {number}
                    </span>
                </div>

                {/* =================================================
                    CONTEÚDO PRINCIPAL
                ================================================= */}

                <div
                    className="
                        flex
                        max-w-4xl
                        flex-col
                        gap-3

                        transition-transform
                        duration-500
                        ease-out

                        group-hover:translate-x-1
                        group-active:translate-x-1
                    "
                >
                    {/* =================================================
                        TÍTULO
                    ================================================= */}

                    <div
                        className="
                            flex
                            items-start
                            justify-between
                            gap-5
                        "
                    >
                        <h3
                            className={`
                                font-space
                                text-lg
                                font-[600]
                                leading-tight

                                md:text-3xl

                                ${styles.title}
                                ${classNameTitle}
                            `}
                        >
                            {title}
                        </h3>

                        {/* =================================================
                            ÍCONE
                        ================================================= */}

                        <span
                            className="
                                mt-1
                                hidden
                                shrink-0

                                text-lg
                                text-steel/30

                                transition-all
                                duration-500
                                ease-out

                                group-hover:-translate-y-1
                                group-hover:translate-x-1
                                group-hover:text-bronze

                                md:block
                            "
                        >
                            ↗
                        </span>
                    </div>

                    {/* =================================================
                        DESCRIÇÃO
                    ================================================= */}

                    <p
                        className={`
                            max-w-3xl

                            text-sm
                            leading-6

                            md:text-sm
                            md:leading-7

                            transition-colors
                            duration-500
                            ease-out

                            group-hover:text-ivory/70
                            group-active:text-ivory/70

                            ${styles.description}
                            ${classNameText}
                        `}
                    >
                        {text}
                    </p>
                </div>
            </div>

            {/* =====================================================
                MICRO INDICADOR
            ===================================================== */}

            <span
                className="
                    absolute
                    bottom-0
                    left-0

                    h-px
                    w-0

                    bg-bronze/40

                    transition-all
                    duration-500
                    ease-out

                    group-hover:w-20
                    group-active:w-20
                "
            />
        </article>
    );
}

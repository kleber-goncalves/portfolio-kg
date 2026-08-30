export default function Card1({
    title,
    text,
    text_2,
    variant = "default",
    className = "",
    classNameText = "",
    classNameTitle = "",
    classNametext2 = "",
    ...props
}) {
    const variants = {
        default: {
            text: "text-bronze",
            title: "text-ivory",
            description: "text-steel",
        },

        v1: {
            text: "text-white",
            title: "text-white",
            description: "text-white/60",
        },

        v2: {
            text: "text-white",
            title: "text-white",
            description: "text-white/60",
        },
    };

    const styles = variants[variant];

    return (
        <article
            className={`
                group
                relative
                w-full

                border-t
                border-graphite

                py-7
                md:py-10

                transition-colors
                duration-500
                ease-out

                hover:border-bronze/50
                active:border-bronze/50

                ${className}
            `}
            {...props}
        >
            {/* =====================================================
                LINHA DE INTERAÇÃO
            ===================================================== */}

            <span
                className="
                    absolute
                    left-0
                    top-0

                    h-px
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
                    flex
                    w-full
                    flex-col
                    items-start
                    gap-3

                    md:gap-4
                "
            >
                {/* =================================================
                    CATEGORIA
                ================================================= */}

                <p
                    className={`
                        font-bebas
                        text-xs
                        uppercase
                        tracking-[0.2em]

                        md:text-sm
                        md:tracking-[0.25em]

                        transition-colors
                        duration-500
                        ease-out

                        group-hover:text-accent-hover
                        group-active:text-accent-hover

                        ${styles.text}
                        ${classNameText}
                    `}
                >
                    {text}
                </p>

                {/* =================================================
                    TÍTULO + ÍCONE
                ================================================= */}

                <div
                    className="
                        flex
                        w-full
                        items-center
                        justify-between
                        gap-4
                    "
                >
                    <h3
                        className={`
                            font-space
                            text-xl
                            font-[600]
                            leading-tight

                            md:text-4xl

                            transition-transform
                            duration-500
                            ease-out

                            group-hover:translate-x-1
                            group-active:translate-x-1

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
                            shrink-0

                            text-lg
                            text-steel/30

                            transition-all
                            duration-500
                            ease-out

                            group-hover:-translate-y-1
                            group-hover:translate-x-1
                            group-hover:text-bronze

                            group-active:-translate-y-1
                            group-active:translate-x-1
                            group-active:text-bronze

                            md:text-xl
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

                        text-xs
                        leading-relaxed

                        md:text-sm
                        md:leading-6

                        transition-colors
                        duration-500
                        ease-out

                        group-hover:text-ivory/70
                        group-active:text-ivory/70

                        ${styles.description}
                        ${classNametext2}
                    `}
                >
                    {text_2}
                </p>
            </div>

            {/* =====================================================
                MICRO LINHA
            ===================================================== */}

            <span
                className="
                    mt-6
                    block

                    h-px
                    w-0

                    bg-bronze/40

                    transition-all
                    duration-700
                    ease-out

                    group-hover:w-20
                    group-active:w-20
                "
            />
        </article>
    );
}

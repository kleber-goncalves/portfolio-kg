import { Github, Linkedin, Instagram } from "@thesvg/react";

function Hero() {
    return (
        <section
            id="hero"
            className="
                relative
                min-h-[100svh]
                w-full
                overflow-hidden
                bg-obsidian
                p-5

                md:p-10
            "
        >
            {/* =====================================================
                CONTAINER PRINCIPAL
            ====================================================== */}

            <div
                className="
                    relative
                    mx-auto
                    flex
                    min-h-[calc(100svh-2.5rem)]
                    w-full
                    max-w-[1800px]
                    flex-col

                    md:min-h-[calc(100svh-5rem)]
                "
            >
                {/* =================================================
                    HEADER
                ================================================== */}

                <header
                    className="
                        relative
                        z-30
                        flex
                        w-full
                        items-center
                        justify-between
                    "
                >
                    {/* LOGO */}

                    <div
                        className="
                            flex
                            h-20
                            w-20
                            items-center
                            justify-center

                            md:h-24
                            md:w-24
                        "
                    >
                        <span
                            className="
                                font-bebas
                                text-6xl
                                leading-none
                                text-bronze

                                md:text-8xl
                            "
                        >
                            K
                        </span>
                    </div>

                    {/* MENU */}

                    <button
                        type="button"
                        aria-label="Abrir menu"
                        className="
                            flex
                            h-20
                            w-20
                            items-center
                            justify-center
                            rounded-tl-[2rem]
                            rounded-tr-[2rem]
                            rounded-bl-[2rem]
                            rounded-br-none
                            bg-carbon
                            transition
                            duration-300

                            hover:bg-graphite

                            md:h-24
                            md:w-24
                        "
                    >
                        <span
                            className="
                                flex
                                flex-col
                                gap-2
                            "
                        >
                            <span
                                className="
                                    block
                                    h-[6px]
                                    w-10
                                    bg-ivory
                                "
                            />

                            <span
                                className="
                                    block
                                    h-[6px]
                                    w-10
                                    bg-ivory
                                "
                            />
                        </span>
                    </button>
                </header>

                {/* =================================================
                    ÁREA PRINCIPAL
                ================================================== */}

                <main
                    className="
                        relative
                        flex
                        flex-1
                        items-start
                        pt-8

                        md:items-center
                        md:pt-0
                    "
                >
                    {/* =================================================
                        PAINEL PRINCIPAL
                    ================================================== */}

                    <div
                        className="
                            relative
                            w-full
                            overflow-hidden
                            rounded-[2rem]
                            border
                            border-graphite
                            bg-carbon

                            md:min-h-[78vh]
                            md:rounded-[2.5rem]
                        "
                    >
                        {/* =================================================
                            GLOW DECORATIVO
                        ================================================== */}

                        <div
                            aria-hidden="true"
                            className="
                                pointer-events-none
                                absolute
                                right-[-10rem]
                                top-[20%]
                                h-[28rem]
                                w-[28rem]
                                rounded-full
                                bg-[#A87852]/10
                                blur-[100px]

                                md:right-[-8rem]
                                md:top-[15%]
                                md:h-[40rem]
                                md:w-[40rem]
                            "
                        />

                        {/* =================================================
                            CONTEÚDO
                        ================================================== */}

                        <div
                            className="
                                relative
                                z-10
                                flex
                                w-full
                                flex-col
                                gap-10
                                p-5
                                pt-8

                                md:grid
                                md:grid-cols-[minmax(240px,320px)_minmax(0,1fr)]
                                md:gap-14
                                md:p-12
                                lg:grid-cols-[360px_minmax(0,1fr)]
                                lg:gap-20
                                lg:p-16
                        "
                        >
                            {/* =================================================
                                COLUNA ESQUERDA
                            ================================================== */}

                            <div
                                className="
                                    flex
                                    flex-col
                                    gap-8

                                    md:justify-center
                                "
                            >
                                {/* FOTO */}

                                <div
                                    className="
                                        relative
                                        w-full
                                        max-w-[360px]
                                    "
                                >
                                    {/* GLOW DA FOTO */}

                                    <div
                                        aria-hidden="true"
                                        className="
                                            pointer-events-none
                                            absolute
                                            -right-10
                                            top-10
                                            h-52
                                            w-52
                                            rounded-full
                                            bg-[#A87852]/20
                                            blur-[70px]

                                            md:h-72
                                            md:w-72
                                        "
                                    />

                                    {/* MOLDURA */}

                                    <div
                                        className="
                                            relative
                                            aspect-square
                                            w-full
                                            overflow-hidden
                                            rounded-[1.5rem]
                                            border
                                            border-bronze
                                            shadow-lg
                                            shadow-warm-bronze/30

                                            md:rounded-[1.75rem]
                                        "
                                    >
                                        <img
                                            src="https://github.com/kleber-goncalves.png"
                                            alt="Foto de Kleber"
                                            className="
                                                relative
                                                z-10
                                                h-full
                                                w-full
                                                object-cover
                                            "
                                        />
                                    </div>
                                </div>

                                {/* IDENTIFICAÇÃO */}

                                <div
                                    className="
                                        hidden
                                        flex-col
                                        gap-2

                                        md:flex
                                    "
                                >
                                    <span
                                        className="
                                            text-xs
                                            uppercase
                                            tracking-[0.25em]
                                            text-bronze/70
                                        "
                                    >
                                        Desenvolvedor
                                    </span>

                                    <span
                                        className="
                                            text-sm
                                            text-steel
                                        "
                                    >
                                        Web · Software · Fullstack
                                    </span>
                                </div>
                            </div>

                            {/* =================================================
                                COLUNA DIREITA
                            ================================================== */}

                            <div
                                className="
                                    flex
                                    min-w-0
                                    flex-col
                                    justify-center
                                "
                            >
                                {/* NOME */}

                                <div
                                    className="
                                        flex
                                        flex-col
                                        gap-4
                                    "
                                >
                                    <h1
                                        className="
                                            font-bebas
                                            text-[4.5rem]
                                            font-bold
                                            uppercase
                                            leading-[0.8]
                                            tracking-tight
                                            text-ivory

                                            sm:text-[5.5rem]

                                            md:text-[6rem]

                                            lg:text-[8rem]

                                            xl:text-[9rem]
                                        "
                                    >
                                        Kleber
                                        <br />
                                        Dev.
                                    </h1>

                                    {/* ESPECIALIDADES */}

                                    <p
                                        className="
                                            max-w-3xl
                                            text-sm
                                            leading-relaxed
                                            text-steel

                                            sm:text-base

                                            md:text-xl

                                            lg:text-2xl
                                        "
                                    >
                                        Frontend
                                        <span className="mx-2 text-bronze/50">·</span>
                                        Backend
                                        <span className="mx-2 text-bronze/50">·</span>
                                        Fullstack
                                        <span className="mx-2 text-bronze/50">·</span>
                                        <strong className="text-bronze">Analista de Sistemas</strong>
                                    </p>
                                </div>

                                {/* =================================================
                                    DIVISOR
                                ================================================== */}

                                <div
                                    className="
                                        my-8
                                        h-px
                                        w-full
                                        bg-gradientaa

                                        md:my-10
                                    "
                                />

                                {/* =================================================
                                    APRESENTAÇÃO
                                ================================================== */}

                                <div
                                    className="
                                        flex
                                        max-w-3xl
                                        flex-col
                                        gap-5
                                    "
                                >
                                    <p
                                        className="
                                            text-base
                                            leading-relaxed
                                            text-steel

                                            md:text-lg
                                            md:leading-8

                                            lg:text-xl
                                        "
                                    >
                                        Sou formado em <strong className="text-ivory">Análise e Desenvolvimento de Sistemas</strong> pela Uniube e possuo formação em Fullstack pela DNC, com experiência em práticas como Scrum, sprints, revisão de código e metodologias ágeis.
                                    </p>

                                    <p
                                        className="
                                            text-base
                                            leading-relaxed
                                            text-steel

                                            md:text-lg
                                            md:leading-8

                                            lg:text-xl
                                        "
                                    >
                                        Trabalho como analista de projetos, acumulando responsabilidades de desenvolvimento e revisão de PRs sob supervisão sênior. Utilizo IA para acelerar a implementação, mantendo o raciocínio e a análise como base para minhas decisões.
                                    </p>
                                </div>

                                {/* =================================================
                                    REDES SOCIAIS
                                ================================================== */}

                                <div
                                    className="
                                        mt-8
                                        flex
                                        items-center
                                        gap-5

                                        md:mt-10
                                        md:gap-6
                                    "
                                >
                                    {/* GITHUB */}

                                    <a
                                        href="https://github.com/kleber-goncalves"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="GitHub de Kleber"
                                        className="
                                            flex
                                            h-12
                                            w-12
                                            items-center
                                            justify-center
                                            rounded-full
                                            transition
                                            duration-300
                                            hover:scale-110

                                            md:h-14
                                            md:w-14
                                        "
                                    >
                                        <Github className="h-full w-full" variant="dark" />
                                    </a>

                                    {/* LINKEDIN */}

                                    <a
                                        href="#"
                                        aria-label="LinkedIn de Kleber"
                                        className="
                                            flex
                                            h-12
                                            w-12
                                            items-center
                                            justify-center
                                            rounded-full
                                            transition
                                            duration-300
                                            hover:scale-110

                                            md:h-14
                                            md:w-14
                                        "
                                    >
                                        <Linkedin className="h-full w-full" />
                                    </a>

                                    {/* INSTAGRAM */}

                                    <a
                                        href="#"
                                        aria-label="Instagram de Kleber"
                                        className="
                                            flex
                                            h-12
                                            w-12
                                            items-center
                                            justify-center
                                            rounded-full
                                            transition
                                            duration-300
                                            hover:scale-110

                                            md:h-14
                                            md:w-14
                                        "
                                    >
                                        <Instagram className="h-full w-full" />
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* =================================================
                            MARCA DECORATIVA INFERIOR
                        ================================================== */}

                        <div
                            aria-hidden="true"
                            className="
                                absolute
                                bottom-0
                                left-0
                                h-16
                                w-1/3
                                rounded-tr-[2rem]
                                bg-obsidian

                                md:h-20
                                md:w-1/4
                            "
                        />
                    </div>
                </main>
            </div>
        </section>
    );
}

export default Hero;

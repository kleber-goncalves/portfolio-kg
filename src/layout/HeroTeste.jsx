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

                md:p-8
                lg:p-10
            "
        >
            {/* =========================================================
                PAINEL PRINCIPAL
            ========================================================== */}

            <div
                className="
                    hero-panel
                    relative
                    mx-auto
                    min-h-[calc(100svh-2.5rem)]
                    w-full
                    max-w-[1800px]
                    overflow-hidden
                    rounded-[2rem]
                    bg-carbon

                    md:min-h-[calc(100svh-4rem)]
                    md:rounded-[2.75rem]

                    lg:min-h-[calc(100svh-5rem)]
                "
            >
                {/* =====================================================
                    DECORAÇÃO — CURVA / GLOW
                ====================================================== */}

                <div
                    aria-hidden="true"
                    className="
                        pointer-events-none
                        absolute
                        -right-32
                        top-1/4
                        h-[26rem]
                        w-[26rem]
                        rounded-full
                        bg-[#A87852]/10
                        blur-[100px]

                        md:-right-40
                        md:h-[38rem]
                        md:w-[38rem]
                    "
                />

                {/* =====================================================
                    RECORTE SUPERIOR ESQUERDO

                    Cria a sensação de que o painel "abraça"
                    o logo K.
                ====================================================== */}

                <div
                    aria-hidden="true"
                    className="
                        hero-cut
                        hero-cut-top-left
                    "
                />

                {/* =====================================================
                    RECORTE INFERIOR ESQUERDO
                ====================================================== */}

                <div
                    aria-hidden="true"
                    className="
                        hero-cut
                        hero-cut-bottom-left
                    "
                />

                {/* =====================================================
                    RECORTE INFERIOR DIREITO
                ====================================================== */}

                <div
                    aria-hidden="true"
                    className="
                        hero-cut
                        hero-cut-bottom-right
                    "
                />

                {/* =====================================================
                    HEADER
                ====================================================== */}

                <header
                    className="
                        relative
                        z-30
                        flex
                        w-full
                        items-start
                        justify-between
                    "
                >
                    {/* =================================================
                        LOGO

                        Fica parcialmente fora da estrutura.
                    ================================================== */}

                    <div
                        className="
                            hero-logo
                            relative
                            flex
                            h-24
                            w-24
                            items-center
                            justify-center

                            md:h-28
                            md:w-28
                        "
                    >
                        <span
                            className="
                                font-bebas
                                text-[4.5rem]
                                leading-none
                                text-bronze

                                md:text-[5.5rem]
                            "
                        >
                            K
                        </span>
                    </div>

                    {/* =================================================
                        MENU
                    ================================================== */}

                    <button
                        type="button"
                        aria-label="Abrir menu"
                        className="
                            hero-menu
                            flex
                            h-20
                            w-20
                            items-center
                            justify-center
                            bg-obsidian
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
                                    h-[5px]
                                    w-10
                                    rounded-full
                                    bg-ivory
                                "
                            />

                            <span
                                className="
                                    block
                                    h-[5px]
                                    w-10
                                    rounded-full
                                    bg-ivory
                                "
                            />
                        </span>
                    </button>
                </header>

                {/* =====================================================
                    CONTEÚDO PRINCIPAL
                ====================================================== */}

                <main
                    className="
                        relative
                        z-10
                        flex
                        w-full
                        flex-col
                        gap-10
                        px-5
                        pb-28
                        pt-8

                        md:grid
                        md:grid-cols-[minmax(250px,34%)_1fr]
                        md:gap-10
                        md:px-10
                        md:pb-32
                        md:pt-8

                        lg:grid-cols-[minmax(300px,38%)_1fr]
                        lg:gap-16
                        lg:px-14
                        lg:pb-36

                        xl:grid-cols-[400px_1fr]
                        xl:px-20
                    "
                >
                    {/* =================================================
                        COLUNA DA FOTO
                    ================================================== */}

                    <div
                        className="
                            flex
                            flex-col
                            items-start
                            justify-center
                        "
                    >
                        {/* FOTO */}

                        <div
                            className="
                                relative
                                w-full
                                max-w-[330px]

                                md:max-w-[300px]

                                lg:max-w-[340px]

                                xl:max-w-[380px]
                            "
                        >
                            {/* GLOW */}

                            <div
                                aria-hidden="true"
                                className="
                                    absolute
                                    -right-8
                                    top-10
                                    h-48
                                    w-48
                                    rounded-full
                                    bg-[#A87852]/20
                                    blur-[70px]

                                    md:h-60
                                    md:w-60

                                    lg:h-72
                                    lg:w-72
                                "
                            />

                            {/* MOLDURA */}

                            <div
                                className="
                                    relative
                                    aspect-square
                                    w-full
                                    overflow-hidden
                                    rounded-[1.75rem]
                                    border
                                    border-bronze
                                    bg-obsidian
                                    shadow-lg
                                    shadow-warm-bronze/20

                                    md:rounded-[2rem]
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
                                mt-6
                                hidden
                                flex-col
                                gap-1

                                md:flex
                            "
                        >
                            <span
                                className="
                                    text-xs
                                    uppercase
                                    tracking-[0.25em]
                                    text-bronze
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
                        COLUNA DE INFORMAÇÕES
                    ================================================== */}

                    <div
                        className="
                            flex
                            min-w-0
                            flex-col
                            justify-center
                        "
                    >
                        {/* =================================================
                            NOME
                        ================================================== */}

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
                                    text-[4.8rem]
                                    font-bold
                                    uppercase
                                    leading-[0.78]
                                    tracking-tight
                                    text-ivory

                                    sm:text-[5.5rem]

                                    md:text-[6rem]

                                    lg:text-[7rem]

                                    xl:text-[8.5rem]
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

                                    md:text-lg

                                    lg:text-xl

                                    xl:text-2xl
                                "
                            >
                                Frontend
                                <span className="mx-2 text-bronze/40">·</span>
                                Backend
                                <span className="mx-2 text-bronze/40">·</span>
                                Fullstack
                                <span className="mx-2 text-bronze/40">·</span>
                                <strong className="text-bronze">Analista de Sistemas</strong>
                            </p>
                        </div>

                        {/* =================================================
                            DIVISOR
                        ================================================== */}

                        <div
                            className="
                                my-7
                                h-px
                                w-full
                                max-w-3xl
                                bg-gradientaa

                                md:my-8
                            "
                        />

                        {/* =================================================
                            TEXTO
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
                                    leading-7
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
                                    leading-7
                                    text-steel

                                    md:text-lg
                                    md:leading-8

                                    lg:text-xl
                                "
                            >
                                Trabalho como analista de projetos, acumulando responsabilidades de desenvolvimento e revisão de PRs sob supervisão sênior. Utilizo IA para acelerar implementações, mantendo o raciocínio e a análise como base para minhas decisões.
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
                </main>

                {/* =====================================================
                    PEQUENA MARCA INFERIOR
                ====================================================== */}

                <div
                    aria-hidden="true"
                    className="
                        absolute
                        bottom-0
                        left-0
                        z-20
                        h-16
                        w-32
                        rounded-tr-[2rem]
                        bg-obsidian

                        md:h-20
                        md:w-40
                    "
                />
            </div>
        </section>
    );
}

export default Hero;

import Socials from "../components/Socials";
import MenuMobile from "../components/MenuMobile";

function Hero() {
    const menuItems = [
        {
            label: "Hero",
            href: "#hero",
        },
        {
            label: "Competências",
            href: "#competencias",
        },
        {
            label: "Projetos",
            href: "#projetos",
        },
        {
            label: "Diferenciais",
            href: "#diferenciais",
        },
        {
            label: "Formação",
            href: "#formacao",
        },
        {
            label: "Rodapé",
            href: "#footer",
        },
    ];

    return (
        <section
            id="hero"
            className="
                relative
                w-full
                overflow-hidden
                bg-obsidian
                p-4

                md:min-h-screen
                md:pl-10
                md:pr-10
            "
        >
            {/* =========================================================
                CONTAINER PRINCIPAL
            ========================================================= */}

            <div
                className="
                    relative
                    aspect-[390/790]
                    w-full

                    md:aspect-auto
                    md:min-h-[calc(100vh-5rem)]
                "
            >
                {/* =====================================================
                    SVG — SOMENTE MOBILE
                ====================================================== */}

                <img
                    src="/hero-vetor-7.svg"
                    alt=""
                    aria-hidden="true"
                    className="
                        absolute
                        left-0
                        top-0
                        h-full
                        w-full

                        md:hidden
                    "
                />

                {/* =====================================================
                    CONTEÚDO PRINCIPAL
                ====================================================== */}

                <div
                    className="
                        relative
                        z-10
                        flex
                        h-full
                        flex-col

                        md:min-h-[calc(100vh-5rem)]
                        md:items-center
                        md:justify-center
                    "
                >
                    {/* =================================================
                        LOGO
                    ================================================== */}

                    <div
                        className="
                            absolute
                            left-5
                            top-6
                            h-10
                            w-10

                            md:left-8
                            md:top-8

                            lg:left-18
                            lg:top-10
                            lg:h-11
                            lg:w-11
                        "
                    >
                        <img src="/logo.svg" alt="Kleber Dev" className="h-full w-full" />
                    </div>

                    {/* =================================================
                        MENU MOBILE

                        NÃO ALTERADO
                    ================================================== */}

                    <div
                        className="
                            absolute
                            right-4
                            top-6
                            z-30

                            md:hidden
                        "
                    >
                        <MenuMobile items={menuItems} />
                    </div>

                    {/* =================================================
                        MENU DESKTOP
                    ================================================== */}

                    <nav
                        aria-label="Navegação principal"
                        className="
                            absolute
                            right-8
                            top-8
                            z-30
                            hidden
                            items-center
                            gap-5

                            md:flex

                            lg:right-17
                            lg:top-10
                            lg:gap-7
                        "
                    >
                        {menuItems.map((item, index) => (
                            <a
                                key={item.href}
                                href={item.href}
                                className="
                                    group
                                    flex
                                    items-center
                                    gap-2
                                    font-space
                                    text-[9px]
                                    uppercase
                                    tracking-[0.12em]
                                    text-steel
                                    transition-colors
                                    duration-300
                                    hover:text-bronze

                                    lg:text-[10px]
                                "
                            >
                                <span
                                    className="
                                        font-mono
                                        text-[8px]
                                        text-bronze/70
                                        transition-colors
                                        duration-300
                                        group-hover:text-bronze
                                    "
                                >
                                    {String(index + 1).padStart(2, "0")}
                                </span>

                                <span>{item.label}</span>
                            </a>
                        ))}
                    </nav>

                    {/* =====================================================
                        FOTO + CONTEÚDO

                        MOBILE:
                        Foto
                        ↓
                        Nome
                        ↓
                        Especialidades
                        ↓
                        Descrição

                        DESKTOP:
                        Foto        Nome
                                    Especialidades
                                    Descrição
                    ====================================================== */}

                    <div
                        className="
                            mt-25
                            flex
                            flex-col
                            gap-6
                            pl-3
                            pr-3

                            md:mt-34
                            md:flex-1
                            md:max-w-[1500px]
                            md:grid
                            md:grid-cols-[auto_1fr]
                            md:items-center
                            md:gap-x-16
                            md:gap-y-0
                            md:pl-0
                            md:pr-0

                            lg:grid-cols-[1fr_1fr]
                            lg:gap-x-20

                            xl:flex
                            xl:flex-row
                            xl:justify-between
                            xl:w-full
                            
                        "
                    >
                        {/* =================================================
                            FOTO
                        ================================================== */}

                        <div
                            className="
                                relative
                                flex
                                h-54
                                w-54
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                border
                                border-bronze
                                shadow-sm
                                shadow-warm-bronze

                                md:h-64
                                md:w-64

                                lg:h-72
                                lg:w-72
                                xl:h-92
                                xl:w-92
                            "
                        >
                            <img
                                src="https://github.com/kleber-goncalves.png"
                                alt="Kleber Dev"
                                className="
                                    h-full
                                    w-full
                                    rounded-xl
                                    object-cover
                                "
                            />

                            {/* Glow */}

                            <div
                                aria-hidden="true"
                                className="
                                    absolute
                                    -right-50
                                    top-12
                                    h-70
                                    w-40
                                    rounded-full
                                    bg-[#A87852]/22
                                    blur-[90px]

                                    md:-right-56
                                    md:top-14
                                    md:h-80
                                    md:w-44

                                    lg:-right-64
                                    lg:top-16
                                    lg:h-96
                                    lg:w-52
                                "
                            />
                        </div>

                        {/* =================================================
                            CONTEÚDO DIREITO NO DESKTOP

                            No mobile continua sendo apenas uma sequência
                            normal depois da foto.
                        ================================================== */}

                        <div
                            className="
                                flex
                                flex-col
                                gap-6
                            "
                        >
                            {/* =================================================
                                NOME + ESPECIALIDADES
                            ================================================== */}

                            <div
                                className="
                                    flex
                                    flex-col
                                    gap-2
                                    
                                    md:items-end
                                    md:text-right
                                "
                            >
                                <h1
                                    className="
                                        font-bebas
                                        font-bold
                                        text-6xl
                                        text-ivory

                                        md:text-7xl
                                        lg:text-8xl
                                        xl:text-9xl
                                    "
                                >
                                    Kleber
                                    <br />
                                    Dev.
                                </h1>

                                <p
                                    className="
                                        text-xs
                                        text-steel

                                        md:text-sm
                                        lg:text-base
                                    "
                                >
                                    Frontend · Backend · Fullstack · <strong className="text-bronze">Analista de Sistemas</strong>
                                </p>
                            </div>

                            {/* =================================================
                                DESCRIÇÃO
                            ================================================== */}

                            <div
                                className="
                                    flex
                                    flex-col
                                    gap-4
                                    pt-3
                                    text-sm
                                    text-steel

                                    md:text-end
                                    md:max-w-[800px]
                                    lg:text-[15px]
                                    lg:leading-7
                                "
                            >
                                {/* MOBILE */}

                                <p className="block md:hidden">Meu nome é Kleber e sou formado em Análise e Desenvolvimento de Sistemas pela Universidade Uniube e possuo formação em Fullstack pela DNC com simulação profissional real.</p>

                                {/* DESKTOP */}

                                <p className="hidden md:block">Meu nome é Kleber e sou formado em Análise e Desenvolvimento de Sistemas pela Universidade Uniube e possuo formação em Fullstack pela DNC com simulação profissional real com Scrum, sprints, revisão de código e metodologias ágeis.</p>

                                <p className="hidden md:block">Trabalho como analista de projetos, acumulando responsabilidades de desenvolvimento e revisão de PRs sob supervisão sênior. Prefiro chegar com uma hipótese formada antes de buscar ajuda, usando IA para acelerar a implementação, não como substituto do raciocínio.</p>

                                {/* MOBILE */}

                                <p className="block md:hidden">Prefiro chegar com uma hipótese formada antes de buscar ajuda, usando IA para acelerar a implementação, não como substituto do raciocínio.</p>
                            </div>
                        </div>
                    </div>

                    {/* =====================================================
                        REDES SOCIAIS
                    ====================================================== */}

                    <div
                        className="
                            absolute
                            bottom-[2%]
                            left-0
                            right-4
                            z-30

                            md:bottom-8
                            md:left-8
                            md:right-auto

                            lg:bottom-10
                            lg:left-10
                        "
                    >
                        <Socials />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Hero;

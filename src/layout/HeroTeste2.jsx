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

                MOBILE:
                aspect-[390/790] permanece exatamente como antes.

                DESKTOP:
                deixamos o Hero ocupar a altura disponível da tela.
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

                    Nada muda aqui.
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

                    md:justify-center
                    md:items-center
                        md:min-h-[calc(100vh-5rem)]
                    "
                >
                    {/* =================================================
                        LOGO
                        
                        MOBILE: exatamente igual.
                        DESKTOP: apenas muda posição/tamanho se necessário.
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
                            lg:left-10
                            lg:top-10
                            lg:h-11
                            lg:w-11
                        "
                    >
                        <img src="/logo.svg" alt="Kleber Dev" className="h-full w-full" />
                    </div>

                    {/* =================================================
                        MENU MOBILE

                        NÃO ALTERADO.
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

                        Aparece somente a partir do md.

                        Não interfere em nada no mobile.
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
                            lg:right-10
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
                        FOTO + NOME + DESCRIÇÃO

                        MOBILE:
                        O código original permanece com os mesmos valores.

                        DESKTOP:
                        Apenas adicionamos md/lg/xl para centralizar
                        e escalar proporcionalmente.
                    ====================================================== */}

                    {/* =====================================================
    CONTEÚDO PRINCIPAL
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
        md:items-center
        md:justify-center
        md:pl-0
        md:pr-0
        md:max-w-2xl
    "
                    >
                        {/* =================================================
        FOTO + NOME
    ================================================== */}

                        <div
                            className="
            flex
            flex-col
            gap-6

            md:flex-row
            md:items-center
            md:justify-center
            md:gap-10

            lg:gap-14
            xl:gap-20
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
            NOME + ESPECIALIDADES
        ================================================== */}

                            <div
                                className="
                flex
                flex-col
                gap-2

                md:items-start
                md:text-left
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


            md:text-start

            lg:text-[15px]
            lg:leading-7
        "
                        >
                            <p className="md:hidden block">Meu nome é Kleber, tenho 21 anos e Sou formado em Análise e Desenvolvimento de Sistemas pela universidade Uniube e possuo formação em Fullstack pela DNC com simulação profissional real.</p>
                            <p className="hidden md:block">Meu nome é Kleber, tenho 21 anos e Sou formado em Análise e Desenvolvimento de Sistemas pela universidade Uniube e possuo formação em Fullstack pela DNC com simulação profissional real com Scrum, sprints, revisão de código, metodologias ágeis.</p>
                            <p className="hidden md:block">Trabalho como anilista de projetos, acumulando responsabilidades de desenvolvimento e revisão de PRs sob supervisão sênior. Prefiro chegar com uma hipótese formada antes de buscar ajuda de uso IA pra acelerar implementação, não como substituto de raciocínio.</p>

                            <p className="md:hidden block">Prefiro chegar com uma hipótese formada antes de buscar ajuda de uso IA pra acelerar implementação, não como substituto de raciocínio.</p>
                        </div>
                    </div>

                    {/* =====================================================
                        REDES SOCIAIS

                        MOBILE:
                        exatamente igual.

                        DESKTOP:
                        apenas reposicionamos.
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

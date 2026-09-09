import Socials from "../components/Socials";
import MenuMobile from "../components/MenuMobile";

function HeroMobile({ items }) {
    return (
        <div
            className="
                relative
                aspect-[390/790]
                w-full
            "
        >
            {/* =====================================================
                SVG — MOBILE
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
                "
            />

            {/* =====================================================
                CONTEÚDO
            ====================================================== */}

            <div
                className="
                    relative
                    z-10
                    flex
                    h-full
                    flex-col
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
                    "
                >
                    <img src="/logo.svg" alt="Kleber Dev" className="h-full w-full" />
                </div>

                {/* =================================================
                    MENU MOBILE
                ================================================== */}

                <div
                    className="
                        absolute
                        right-4
                        top-6
                        z-30
                    "
                >
                    <MenuMobile items={items} />
                </div>

                {/* =================================================
                    FOTO + CONTEÚDO
                ================================================== */}

                <div
                    className="
                        mt-25
                        flex
                        flex-col
                        gap-6
                        pl-3
                        pr-3
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
                        "
                    >
                        <h1
                            className="
                                font-bebas
                                font-bold
                                text-6xl
                                text-ivory
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
                        "
                    >
                        <p>Meu nome é Kleber e sou formado em Análise e Desenvolvimento de Sistemas pela Universidade Uniube e possuo formação em Fullstack pela DNC com simulação profissional real.</p>

                        <p>Prefiro chegar com uma hipótese formada antes de buscar ajuda, usando IA para acelerar a implementação, não como substituto do raciocínio.</p>
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
                    "
                >
                    <Socials />
                </div>
            </div>
        </div>
    );
}

export default HeroMobile;

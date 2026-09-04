import { useState } from "react";

// Lucide Icons
import { MoveLeft, MoveRight } from "lucide-react";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-coverflow";

import ProjetoCard from "../components/ProjetoCard";
import ProjetoDesktop from "../components/ProjetoDesktop";

// ============================================================
// IMAGENS
// ============================================================

import projeto01_01 from "../assets/projetos/projeto01/jason-1.webp";
import projeto01_02 from "../assets/projetos/projeto01/jason-2.webp";
import projeto01_03 from "../assets/projetos/projeto01/jason-3.webp";
import projeto01_04 from "../assets/projetos/projeto01/lucia-1.webp";

// ============================================================
// PROJETOS
// ============================================================

function Projetos() {
    // ============================================================
    // ESTADO DO SLIDE ATUAL
    // ============================================================

    const [slideAtual, setSlideAtual] = useState(0);

    // ============================================================
    // PROJETOS
    // ============================================================

    const projetos = [
        {
            numero: "01",

            titulo: "Projeto E-commerce",

            descricao: "Plataforma de e-commerce desenvolvida com autenticação, catálogo de produtos, carrinho e gerenciamento de pedidos.",

            tecnologias: ["React", "Node.js", "PostgreSQL", "JWT"],

            preview: projeto01_01,

            imagens: [projeto01_01, projeto01_02, projeto01_03, projeto01_04],

            demo: "https://dennissnellenberg.com/",

            github: "https://github.com/seu-usuario/seu-projeto",
        },

        {
            numero: "02",

            titulo: "Projeto E-commerce",

            descricao: "Plataforma de e-commerce desenvolvida com autenticação, catálogo de produtos, carrinho e gerenciamento de pedidos.",

            tecnologias: ["React", "Node.js", "PostgreSQL", "JWT"],

            imagens: [projeto01_01, projeto01_02, projeto01_03, projeto01_04],

            demo: "https://joao-hollanda.github.io/LandingPage/",

            github: "https://github.com/seu-usuario/seu-projeto",
        },

        {
            numero: "03",

            titulo: "Projeto E-commerce",

            descricao: "Plataforma de e-commerce desenvolvida com autenticação, catálogo de produtos, carrinho e gerenciamento de pedidos.",

            tecnologias: ["React", "Node.js", "PostgreSQL", "JWT"],

            imagens: [projeto01_01, projeto01_02, projeto01_03, projeto01_04],

            demo: "https://seu-projeto.com",

            github: "https://github.com/seu-usuario/seu-projeto",
        },

        {
            numero: "04",

            titulo: "Projeto E-commerce",

            descricao: "Plataforma de e-commerce desenvolvida com autenticação, catálogo de produtos, carrinho e gerenciamento de pedidos.",

            tecnologias: ["React", "Node.js", "PostgreSQL", "JWT"],

            imagens: [projeto01_01, projeto01_02, projeto01_03, projeto01_04],

            demo: "https://seu-projeto.com",

            github: "https://github.com/seu-usuario/seu-projeto",
        },

        {
            numero: "05",

            titulo: "Projeto E-commerce",

            descricao: "Plataforma de e-commerce desenvolvida com autenticação, catálogo de produtos, carrinho e gerenciamento de pedidos.",

            tecnologias: ["React", "Node.js", "PostgreSQL", "JWT"],

            imagens: [projeto01_01, projeto01_02, projeto01_03, projeto01_04],

            demo: "https://seu-projeto.com",

            github: "https://github.com/seu-usuario/seu-projeto",
        },

        {
            numero: "06",

            titulo: "Projeto E-commerce",

            descricao: "Plataforma de e-commerce desenvolvida com autenticação, catálogo de produtos, carrinho e gerenciamento de pedidos.",

            tecnologias: ["React", "Node.js", "PostgreSQL", "JWT"],

            imagens: [projeto01_01, projeto01_02, projeto01_03, projeto01_04],

            demo: "https://seu-projeto.com",

            github: "https://github.com/seu-usuario/seu-projeto",
        },
    ];

    // ============================================================
    // RENDER
    // ============================================================

    return (
        <section className="w-full bg-obsidian">
            {/* ==================================================
                DESKTOP
            ================================================== */}

            <div className="hidden md:block">
                <ProjetoDesktop projetos={projetos} />
            </div>

            {/* ==================================================
                MOBILE
            ================================================== */}

            <div
                className="
                    relative
                    flex
                    min-h-screen
                    w-full
                    items-center
                    overflow-hidden
                    px-0
                    pb-12
                    pt-24
                    md:hidden
                "
            >
                {/* ==================================================
                    TÍTULO
                ================================================== */}

                <div
                    className="
                        absolute
                        left-0
                        top-0
                        z-20
                        flex
                        w-full
                        flex-row
                        items-center
                        gap-2
                        p-5
                        pt-12
                    "
                >
                    <h2
                        id="projetos"
                        className="
                            whitespace-nowrap
                            text-sm
                            uppercase
                            text-steel
                        "
                    >
                        // Projetos
                    </h2>

                    <span
                        className="
                            h-0.5
                            flex-1
                            bg-gradientaa
                        "
                    />

                    {/* ==================================================
                        CONTADOR MOBILE
                    ================================================== */}

                    <div
                        className="
                            flex
                            items-center
                            gap-1
                        "
                    >
                        <span
                            className="
                                text-sm
                                font-medium
                                text-champagne
                            "
                        >
                            {String(slideAtual + 1).padStart(2, "0")}
                        </span>

                        <span
                            className="
                                text-[10px]
                                text-white/20
                            "
                        >
                            /
                        </span>

                        <span
                            className="
                                text-sm
                                text-champagne/30
                            "
                        >
                            {String(projetos.length).padStart(2, "0")}
                        </span>
                    </div>
                </div>

                {/* ==================================================
                    SWIPER MOBILE
                ================================================== */}

                <Swiper
                    modules={[EffectCoverflow]}
                    effect="coverflow"
                    slidesPerView="auto"
                    centeredSlides={true}
                    spaceBetween={16}
                    grabCursor={true}
                    speed={500}
                    onSlideChange={(swiper) => {
                        setSlideAtual(swiper.activeIndex);
                    }}
                    coverflowEffect={{
                        rotate: 0,
                        stretch: 0,
                        depth: 40,
                        modifier: 1,
                        scale: 0.94,
                        slideShadows: false,
                    }}
                    className="!w-full"
                >
                    {projetos.map((projeto) => (
                        <SwiperSlide key={projeto.numero} className="!w-[89vw]">
                            <ProjetoCard numero={projeto.numero} titulo={projeto.titulo} descricao={projeto.descricao} tecnologias={projeto.tecnologias} imagens={projeto.imagens} demo={projeto.demo} github={projeto.github} />
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* ==================================================
                    INDICAÇÃO MOBILE
                ================================================== */}

                <div
                    className="
                        pointer-events-none
                        absolute
                        bottom-9
                        left-1/2
                        z-30
                        flex
                        -translate-x-1/2
                        flex-col
                        items-center
                        gap-2
                    "
                >
                    {/* INSTRUÇÃO */}

                    <span
                        className="
                            whitespace-nowrap
                            text-[10px]
                            uppercase
                            tracking-[0.3em]
                            text-white/40
                        "
                    >
                        Arraste para o lado
                    </span>

                    <div
                        className="
                            flex
                            items-center
                            gap-4
                            text-sm
                            text-white/50
                        "
                    >
                        <MoveLeft size={24} strokeWidth={1.5} className="indicator-arrow-left" />

                        <span
                            className="
                                h-3
                                w-8
                                rounded-full
                                bg-white/50
                            "
                        />

                        <MoveRight size={24} strokeWidth={1.5} className="indicator-arrow-right" />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Projetos;

import { useRef, useState } from "react";

// Lucide Icons
import { MoveLeft, MoveRight } from "lucide-react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-coverflow";

import ProjetoCard from "../components/ProjetoCard";

// ============================================================
// IMAGENS
// ============================================================

import projeto01_01 from "../assets/projetos/projeto01/jason-1.webp";
import projeto01_02 from "../assets/projetos/projeto01/jason-2.webp";
import projeto01_03 from "../assets/projetos/projeto01/jason-3.webp";
import projeto01_04 from "../assets/projetos/projeto01/lucia-1.webp";

gsap.registerPlugin(ScrollTrigger);

function Projetos() {
    // ============================================================
    // REFS
    // ============================================================

    const sectionRef = useRef(null);
    const trackRef = useRef(null);
    const scrollHintRef = useRef(null);
    const contentRef = useRef(null);

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

            descricao:
                "Plataforma de e-commerce desenvolvida com autenticação, catálogo de produtos, carrinho e gerenciamento de pedidos.",

            tecnologias: ["React", "Node.js", "PostgreSQL", "JWT"],

            imagens: [projeto01_01, projeto01_02, projeto01_03, projeto01_04],

            demo: "https://seu-projeto.com",

            github: "https://github.com/seu-usuario/seu-projeto",
        },

        {
            numero: "02",

            titulo: "Projeto E-commerce",

            descricao:
                "Plataforma de e-commerce desenvolvida com autenticação, catálogo de produtos, carrinho e gerenciamento de pedidos.",

            tecnologias: ["React", "Node.js", "PostgreSQL", "JWT"],

            imagens: [projeto01_01, projeto01_02, projeto01_03, projeto01_04],

            demo: "https://seu-projeto.com",

            github: "https://github.com/seu-usuario/seu-projeto",
        },

        {
            numero: "03",

            titulo: "Projeto E-commerce",

            descricao:
                "Plataforma de e-commerce desenvolvida com autenticação, catálogo de produtos, carrinho e gerenciamento de pedidos.",

            tecnologias: ["React", "Node.js", "PostgreSQL", "JWT"],

            imagens: [projeto01_01, projeto01_02, projeto01_03, projeto01_04],

            demo: "https://seu-projeto.com",

            github: "https://github.com/seu-usuario/seu-projeto",
        },

        {
            numero: "04",

            titulo: "Projeto E-commerce",

            descricao:
                "Plataforma de e-commerce desenvolvida com autenticação, catálogo de produtos, carrinho e gerenciamento de pedidos.",

            tecnologias: ["React", "Node.js", "PostgreSQL", "JWT"],

            imagens: [projeto01_01, projeto01_02, projeto01_03, projeto01_04],

            demo: "https://seu-projeto.com",

            github: "https://github.com/seu-usuario/seu-projeto",
        },
        {
            numero: "05",

            titulo: "Projeto E-commerce",

            descricao:
                "Plataforma de e-commerce desenvolvida com autenticação, catálogo de produtos, carrinho e gerenciamento de pedidos.",

            tecnologias: ["React", "Node.js", "PostgreSQL", "JWT"],

            imagens: [projeto01_01, projeto01_02, projeto01_03, projeto01_04],

            demo: "https://seu-projeto.com",

            github: "https://github.com/seu-usuario/seu-projeto",
        },
        {
            numero: "06",

            titulo: "Projeto E-commerce",

            descricao:
                "Plataforma de e-commerce desenvolvida com autenticação, catálogo de produtos, carrinho e gerenciamento de pedidos.",

            tecnologias: ["React", "Node.js", "PostgreSQL", "JWT"],

            imagens: [projeto01_01, projeto01_02, projeto01_03, projeto01_04],

            demo: "https://seu-projeto.com",

            github: "https://github.com/seu-usuario/seu-projeto",
        },
    ];

    // ============================================================
    // NÚMERO DO SLIDE
    // ============================================================


    // ============================================================
    // GSAP — DESKTOP
    // ============================================================

    useGSAP(
        () => {
            const section = sectionRef.current;
            const track = trackRef.current;
            const scrollHint = scrollHintRef.current;
            const content = contentRef.current;

            if (!section || !track || !scrollHint || !content) {
                return;
            }

            // ========================================================
            // MEDIA QUERY
            // ========================================================

            const mm = gsap.matchMedia();

            mm.add("(min-width: 768px)", () => {
                // ====================================================
                // DISTÂNCIA HORIZONTAL
                // ====================================================

                const getScrollAmount = () => {
                    return track.scrollWidth - window.innerWidth;
                };

                // ====================================================
                // TIMELINE
                // ====================================================

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: section,

                        start: "top top",

                        end: () => `+=${window.innerHeight * 6}`,

                        pin: true,

                        anticipatePin: 2,

                        scrub: 0.5,

                        invalidateOnRefresh: true,

                        markers: false,
                    },
                });

                // ====================================================
                // ENTRADA
                // ====================================================

                tl.fromTo(
                    content,

                    {
                        y: 20,
                        opacity: 0.95,
                    },

                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.2,
                        ease: "none",
                    },
                );

                // ====================================================
                // MOVIMENTO HORIZONTAL
                // ====================================================

                tl.to(track, {
                    x: () => -getScrollAmount(),

                    duration: 1,

                    ease: "none",
                });

                // ====================================================
                // TEXTO DESAPARECE
                // ====================================================

                tl.to(scrollHint, {
                    opacity: 0,

                    y: -20,

                    duration: 0.5,

                    ease: "power2.out",
                });

                // ====================================================
                // CLEANUP
                // ====================================================

                return () => {
                    tl.kill();
                };
            });

            // ========================================================
            // CLEANUP MEDIA QUERY
            // ========================================================

            return () => {
                mm.revert();
            };
        },

        {
            scope: sectionRef,
        },
    );

    // ============================================================
    // RENDER
    // ============================================================

    return (
        <section className="w-full bg-obsidian">
            <div
                ref={sectionRef}
                className="
                    relative
                    w-full
                    overflow-hidden
                    md:h-screen
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
                        md:p-10
                    "
                >
                    <h2
                        className="
                            whitespace-nowrap
                            text-sm
                            uppercase
                            text-steel
                            md:text-7xl
                        "
                    >
                        // Projetos
                    </h2>

                    <span
                        className="
                            h-0.5
                            flex-1
                            bg-gradientaa
                            md:h-1
                        "
                    />

                    {/* ==================================================
                        CONTADOR MOBILE — TOPO
                    ================================================== */}

                    <div
                        className="
                            flex
                            items-center
                            gap-1
                            md:hidden
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
                    DESKTOP — GSAP
                ================================================== */}

                <div
                    ref={contentRef}
                    className="
                        relative
                        hidden
                        h-screen
                        w-full
                        items-center
                        md:flex
                    "
                >
                    <div
                        ref={trackRef}
                        className="
                            flex
                            w-max
                            items-center
                            gap-6
                        "
                        style={{
                            paddingLeft: "6vw",
                            paddingRight: "6vw",
                        }}
                    >
                        {projetos.map((projeto) => (
                            <ProjetoCard
                                key={projeto.numero}
                                numero={projeto.numero}
                                titulo={projeto.titulo}
                                descricao={projeto.descricao}
                                tecnologias={projeto.tecnologias}
                                imagens={projeto.imagens}
                                demo={projeto.demo}
                                github={projeto.github}
                            />
                        ))}
                    </div>
                </div>

                {/* ==================================================
                    MOBILE — SWIPER
                ================================================== */}

                <div
                    className="
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
                    <Swiper
                        modules={[EffectCoverflow]}
                        effect="coverflow"
                        // ==================================================
                        // CONFIGURAÇÃO
                        // ==================================================

                        slidesPerView="auto"
                        centeredSlides={true}
                        spaceBetween={16}
                        grabCursor={true}
                        speed={500}
                        // ==================================================
                        // SLIDE ATUAL
                        // ==================================================

                        onSlideChange={(swiper) => {
                            setSlideAtual(swiper.activeIndex);
                        }}
                        // ==================================================
                        // COVERFLOW
                        // ==================================================

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
                            <SwiperSlide
                                key={projeto.numero}
                                className="!w-[89vw]"
                            >
                                <ProjetoCard
                                    numero={projeto.numero}
                                    titulo={projeto.titulo}
                                    descricao={projeto.descricao}
                                    tecnologias={projeto.tecnologias}
                                    imagens={projeto.imagens}
                                    demo={projeto.demo}
                                    github={projeto.github}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* ==================================================
                    INDICAÇÃO DESKTOP
                ================================================== */}

                <div
                    ref={scrollHintRef}
                    className="
                        pointer-events-none
                        absolute
                        bottom-6
                        left-1/2
                        z-30
                        hidden
                        -translate-x-1/2
                        flex-col
                        items-center
                        gap-2
                        md:flex
                    "
                >
                    <span
                        className="
                            whitespace-nowrap
                            text-[10px]
                            uppercase
                            tracking-[0.3em]
                            text-white/40
                        "
                    >
                        Continue rolando
                    </span>

                    <span
                        className="
                            animate-bounce
                            text-sm
                            text-white/60
                        "
                    >
                        ↓
                    </span>
                </div>

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
                        md:hidden
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
                        <MoveLeft
                            size={24}
                            strokeWidth={1.5}
                            className="indicator-arrow-left"
                        />

                        <span
                            className="
                                    h-3
                                    w-8
                                    rounded-full
                                    bg-white/50
                                "
                        />

                        <MoveRight
                            size={24}
                            strokeWidth={1.5}
                            className="indicator-arrow-right"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Projetos;

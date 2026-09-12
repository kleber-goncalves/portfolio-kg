import { useState, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Lucide Icons
import { MoveLeft, MoveRight } from "lucide-react";


import { tecnologias } from "../data/tecnologias";


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


function Projetos() {
    const sectionRef = useRef(null);
    const titleRef = useRef(null);
    const lineRef = useRef(null);
    const contadorRef = useRef(null);
    const swiperRef = useRef(null);


    const [slideAtual, setSlideAtual] = useState(0);


    const projetos = [
        {
            numero: "01",

            titulo: "Autono",

            descricao: "O Autono é um projeto fictício desenvolvido para fins de estudo e demonstração de boas práticas em desenvolvimento web moderno.",

            tecnologias: ["React", "Node.js", "Tailwind", "GSAP", "Supabase"],

            preview: projeto01_01,

            imagens: [projeto01_01, projeto01_02, projeto01_03, projeto01_04],

            demo: "https://autono-kg.vercel.app/",

            github: "https://github.com/kleber-goncalves/autono",
        },

        {
            numero: "02",

            titulo: "GTA VI",

            descricao: "Uma landing page moderna e cinematográfica inspirada na estética visual do site promocional de Grand Theft Auto VI - Rockstar Games, desenvolvida como estudo pessoal de front-end, interação, storytelling visual, motion design com o GSAP.",

            tecnologias: ["HTML", "CSS", "Node.js", "GSAP"],

            imagens: [projeto01_01, projeto01_02, projeto01_03, projeto01_04],

            demo: "https://gtavi-kg.vercel.app/",

            github: "https://github.com/kleber-goncalves/GTA-VI",
        },

        {
            numero: "03",

            titulo: "Clone do site do iPhone 17 Pro",

            descricao: "Este é um projeto inspirada no design e na estrutura do site oficial do iPhone 17 Pro da Apple.",

            tecnologias: ["React", "Node.js", "Tailwind"],

            imagens: [projeto01_01, projeto01_02, projeto01_03, projeto01_04],

            demo: "https://iphone-17-pro-kg.vercel.app/",

            github: "https://github.com/kleber-goncalves/iphone-17-PRO-MAX",
        },

        {
            numero: "04",

            titulo: "Portifólio de Arquitetura (DNC)",

            descricao: "Este projeto é um site de arquitetura da DNC focado em React e APIs.",

            tecnologias: ["React", "Node.js", "API"],

            imagens: [projeto01_01, projeto01_02, projeto01_03, projeto01_04],

            demo: "https://dnc-arq-kleber.vercel.app/",

            github: "https://github.com/kleber-goncalves/dnc-arq-kleber",
        },

        {
            numero: "05",

            titulo: "Dashboard de Vendas (DNC)",

            descricao: "Dashboard de Vendas desenvolvido como projeto didático para a escola DNC. A aplicação demonstra conceitos de visualização de métricas, organização de componentes React em TypeScript e fluxo básico de pages e testes.",

            tecnologias: ["React", "Node.js", "TypeScript"],

            imagens: [projeto01_01, projeto01_02, projeto01_03, projeto01_04],

            demo: "https://dashboard-de-vendas-psi.vercel.app/",

            github: "https://dashboard-de-vendas-psi.vercel.app/",
        },

        {
            numero: "06",

            titulo: "CAFENA - Café da Região (DNC)",

            descricao: "Este é um Minimum Viable Product (MVP) desenvolvido para a CAFENA, uma cafeteria fictícia focada em promover o café da região.",

            tecnologias: ["HTML", "CSS"],

            imagens: [projeto01_01, projeto01_02, projeto01_03, projeto01_04],

            demo: "https://coffe-page-kl.vercel.app/",

            github: "https://github.com/kleber-goncalves/coffe-page",
        },
    ];

    useLayoutEffect(() => {
        const section = sectionRef.current;

        if (!section) return;

        const ctx = gsap.context(() => {
            gsap.set(titleRef.current, {
                opacity: 0,
                x: -35,
            });

            gsap.set(lineRef.current, {
                scaleX: 0,
                transformOrigin: "left center",
            });

            gsap.set(contadorRef.current, {
                opacity: 0,
            });

            gsap.set(swiperRef.current, {
                y: 75,
                opacity: 0,
            });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: titleRef.current,
                    start: "top 90%",
                    end: "top 65%",
                    scrub: 1,
                },
            });

            tl.to(titleRef.current, {
                opacity: 1,
                x: 0,
                duration: 1,
                ease: "none",
            });

            tl.to(
                lineRef.current,
                {
                    scaleX: 1,
                    duration: 1,
                    ease: "none",
                },
                "+=0.5",
            );
            tl.to(
                contadorRef.current,
                {
                    opacity: 1,
                    duration: 1.5,
                    ease: "none",
                },
                "+=0.5",
            );
            tl.to(
                swiperRef.current,
                {
                    y: 0,
                    duration: 1.5,
                    ease: "none",
                    opacity: 3,
                },
                "+=0.5",
            );
        }, section);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="w-full md:mt-30 mt-30 bg-obsidian">
            {/* ==================================================
                DESKTOP
            ================================================== */}

            <div className="hidden md:block  ">
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
                        ref={titleRef}
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
                        ref={lineRef}
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
                        ref={contadorRef}
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
                    ref={swiperRef}
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
                            <ProjetoCard numero={projeto.numero} titulo={projeto.titulo} descricao={projeto.descricao} tecnologias={projeto.tecnologias} tecnologiasConfig={tecnologias} imagens={projeto.imagens} demo={projeto.demo} github={projeto.github} />
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

import { useRef, useState } from "react";

import { MoveLeft, MoveRight } from "lucide-react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-coverflow";

import ProjetoDesktop from "../components/ProjetoDesktop";
import ProjetoCard from "../components/ProjetoCard";

gsap.registerPlugin(ScrollTrigger);

export default function Projetos() {
    const sectionRef = useRef(null);
    const trackRef = useRef(null);
    const scrollHintRef = useRef(null);

    const [slideAtual, setSlideAtual] = useState(0);

    const projetos = [
        {
            numero: "01",
            titulo: "Projeto E-commerce",

            descricao: "Plataforma de e-commerce desenvolvida com autenticação, catálogo de produtos, carrinho e gerenciamento de pedidos.",

            tecnologias: ["React", "Node.js", "PostgreSQL", "JWT"],

            iframe: "https://dennissnellenberg.com/",

            demo: "https://seu-projeto-ecommerce.com",

            github: "https://github.com/seu-usuario/seu-projeto-ecommerce",

            imagens: ["/projetos/projeto01/01.png", "/projetos/projeto01/02.png", "/projetos/projeto01/03.png", "/projetos/projeto01/04.png"],
        },

        {
            numero: "02",
            titulo: "Sistema de Gestão",

            descricao: "Sistema web desenvolvido para gerenciamento de informações, usuários e processos internos.",

            tecnologias: ["React", "Node.js", "Express", "PostgreSQL"],

            iframe: "https://seu-projeto-gestao.com",

            demo: "https://seu-projeto-gestao.com",

            github: "https://github.com/seu-usuario/seu-projeto-gestao",

            imagens: ["/projetos/projeto02/01.png", "/projetos/projeto02/02.png", "/projetos/projeto02/03.png"],
        },

        {
            numero: "03",
            titulo: "API REST",

            descricao: "API REST desenvolvida para gerenciamento de recursos, autenticação e comunicação entre aplicações.",

            tecnologias: ["Node.js", "Express", "PostgreSQL", "JWT"],

            iframe: "https://seu-projeto-api.com",

            demo: "https://seu-projeto-api.com",

            github: "https://github.com/seu-usuario/seu-projeto-api",

            imagens: ["/projetos/projeto03/01.png", "/projetos/projeto03/02.png", "/projetos/projeto03/03.png"],
        },

        {
            numero: "04",
            titulo: "Aplicação Fullstack",

            descricao: "Aplicação fullstack integrando interface, regras de negócio, persistência de dados e autenticação.",

            tecnologias: ["React", "Node.js", "Prisma", "PostgreSQL"],

            iframe: "https://seu-projeto-fullstack.com",

            demo: "https://seu-projeto-fullstack.com",

            github: "https://github.com/seu-usuario/seu-projeto-fullstack",

            imagens: ["/projetos/projeto04/01.png", "/projetos/projeto04/02.png", "/projetos/projeto04/03.png"],
        },
    ];

    /*
    |--------------------------------------------------------------------------
    | DESKTOP — SCROLL HORIZONTAL
    |--------------------------------------------------------------------------
    */

    useGSAP(
        () => {
            const mm = gsap.matchMedia();

            mm.add("(min-width: 768px)", () => {
                const section = sectionRef.current;
                const track = trackRef.current;
                const hint = scrollHintRef.current;

                if (!section || !track) return;

                const getScrollAmount = () => {
                    return Math.max(
                        0,
                        track.scrollWidth - window.innerWidth
                    );
                };

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: section,

                        start: "top top",

                        end: () =>
                            `+=${window.innerHeight * 6}`,

                        pin: true,

                        scrub: 0.5,

                        anticipatePin: 2,

                        invalidateOnRefresh: true,
                    },
                });

                /*
                |--------------------------------------------------------------------------
                | PROJETOS → HORIZONTAL
                |--------------------------------------------------------------------------
                */

                tl.to(
                    track,
                    {
                        x: () => -getScrollAmount(),

                        duration: 1,

                        ease: "none",
                    }
                );

                /*
                |--------------------------------------------------------------------------
                | HINT
                |--------------------------------------------------------------------------
                */

                if (hint) {
                    tl.to(
                        hint,
                        {
                            opacity: 0,
                            y: -20,

                            duration: 0.2,

                            ease: "power2.out",
                        },
                        0.1
                    );
                }

                return () => {
                    tl.kill();
                };
            });

            return () => {
                mm.revert();
            };
        },
        {
            scope: sectionRef,
        }
    );

    /*
    |--------------------------------------------------------------------------
    | MOBILE
    |--------------------------------------------------------------------------
    */

    const handleSlideChange = (swiper) => {
        setSlideAtual(swiper.activeIndex);
    };

    return (
        <section
            id="projetos"
            className="w-full bg-obsidian"
        >
            {/* ================================================================= */}
            {/* DESKTOP */}
            {/* ================================================================= */}

            <div
                ref={sectionRef}
                className="relative hidden h-screen w-full overflow-hidden md:block"
            >
                {/* ------------------------------------------------------------- */}
                {/* HEADER */}
                {/* ------------------------------------------------------------- */}

                <div className="pointer-events-none absolute left-0 top-0 z-30 flex w-full items-start justify-between px-[6vw] pt-10">
                    <div>
                        <p className="font-bebas text-xs uppercase tracking-[0.25em] text-bronze">
                            // Projetos
                        </p>

                        <h2 className="mt-2 font-space text-5xl font-semibold uppercase leading-none text-ivory lg:text-6xl">
                            Projetos
                        </h2>
                    </div>

                    <div className="font-bebas text-sm tracking-[0.2em] text-steel">
                        <span className="text-ivory">
                            {String(slideAtual + 1).padStart(
                                2,
                                "0"
                            )}
                        </span>

                        <span className="mx-2 text-graphite">
                            /
                        </span>

                        {String(projetos.length).padStart(
                            2,
                            "0"
                        )}
                    </div>
                </div>

                {/* ------------------------------------------------------------- */}
                {/* TRACK */}
                {/* ------------------------------------------------------------- */}

                <div
                    ref={trackRef}
                    className="flex h-full w-max items-center gap-[8vw] pl-[6vw] pr-[12vw]"
                >
                    {projetos.map((projeto, index) => (
                        <ProjetoDesktop
                            key={projeto.numero}
                            {...projeto}
                            index={index}
                        />
                    ))}
                </div>

                {/* ------------------------------------------------------------- */}
                {/* HINT */}
                {/* ------------------------------------------------------------- */}

                <div
                    ref={scrollHintRef}
                    className="absolute bottom-8 left-[6vw] z-30 flex items-center gap-3 font-bebas text-xs uppercase tracking-[0.2em] text-steel"
                >
                    <span>
                        Continue rolando
                    </span>

                    <MoveRight
                        className="h-4 w-4"
                        strokeWidth={1.5}
                    />
                </div>
            </div>

            {/* ================================================================= */}
            {/* MOBILE */}
            {/* ================================================================= */}

            <div className="relative min-h-screen w-full md:hidden">
                {/* ------------------------------------------------------------- */}
                {/* HEADER */}
                {/* ------------------------------------------------------------- */}

                <div className="absolute left-0 top-0 z-30 flex w-full items-start justify-between px-5 pt-8">
                    <div>
                        <p className="font-bebas text-xs uppercase tracking-[0.25em] text-bronze">
                            // Projetos
                        </p>

                        <h2 className="mt-2 font-space text-4xl font-semibold uppercase leading-none text-ivory">
                            Projetos
                        </h2>
                    </div>

                    <div className="pt-1 font-bebas text-sm tracking-[0.2em] text-steel">
                        <span className="text-ivory">
                            {String(slideAtual + 1).padStart(
                                2,
                                "0"
                            )}
                        </span>

                        <span className="mx-2 text-graphite">
                            /
                        </span>

                        {String(projetos.length).padStart(
                            2,
                            "0"
                        )}
                    </div>
                </div>

                {/* ------------------------------------------------------------- */}
                {/* SLIDER DE PROJETOS */}
                {/* ------------------------------------------------------------- */}

                <Swiper
                    modules={[EffectCoverflow]}
                    effect="coverflow"
                    centeredSlides
                    slidesPerView="auto"
                    spaceBetween={16}
                    grabCursor
                    speed={500}
                    coverflowEffect={{
                        rotate: 0,
                        stretch: 0,
                        depth: 40,
                        modifier: 1,
                        scale: 0.94,
                        slideShadows: false,
                    }}
                    className="min-h-screen w-full !px-0 !pb-12 !pt-24"
                    onSlideChange={handleSlideChange}
                >
                    {projetos.map((projeto) => (
                        <SwiperSlide
                            key={projeto.numero}
                            className="!h-auto !w-[89vw]"
                        >
                            <ProjetoCard
                                {...projeto}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* ------------------------------------------------------------- */}
                {/* NAVEGAÇÃO */}
                {/* ------------------------------------------------------------- */}

                <div className="absolute bottom-5 left-0 z-30 flex w-full flex-col items-center gap-4">
                    <div className="flex items-center gap-4">
                        <MoveLeft
                            className="h-4 w-4 text-steel"
                            strokeWidth={1.5}
                        />

                        <div className="flex items-center gap-1.5">
                            {projetos.map((_, index) => (
                                <span
                                    key={index}
                                    className={`h-1 rounded-full transition-all duration-300 ${
                                        index === slideAtual
                                            ? "w-6 bg-bronze"
                                            : "w-1 bg-graphite"
                                    }`}
                                />
                            ))}
                        </div>

                        <MoveRight
                            className="h-4 w-4 text-steel"
                            strokeWidth={1.5}
                        />
                    </div>

                    <p className="font-bebas text-[10px] uppercase tracking-[0.25em] text-steel">
                        Arraste para o lado
                    </p>
                </div>
            </div>
        </section>
    );
}
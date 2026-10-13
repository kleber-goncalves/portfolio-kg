import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MoveLeft, MoveRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-coverflow";

import ProjetoCard from "./ProjetoCard";

gsap.registerPlugin(ScrollTrigger);

function ProjetoCarouselMobile({
    projects = [],
    tecnologiasConfig = {},
    onReady,
}) {
    const sectionRef = useRef(null);
    const titleRef = useRef(null);
    const lineRef = useRef(null);
    const contadorRef = useRef(null);
    const carouselRef = useRef(null);

    const [slideAtual, setSlideAtual] = useState(0);

    useLayoutEffect(() => {
        const section = sectionRef.current;
        if (!section) return undefined;

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

            gsap.set(carouselRef.current, {
                y: 75,
                opacity: 0,
            });

            const timeline = gsap.timeline({
                scrollTrigger: {
                    trigger: titleRef.current,
                    start: "top 90%",
                    end: "top 65%",
                    scrub: 1,
                },
            });

            timeline.to(titleRef.current, {
                opacity: 1,
                x: 0,
                duration: 1,
                ease: "none",
            });

            timeline.to(
                lineRef.current,
                {
                    scaleX: 1,
                    duration: 1,
                    ease: "none",
                },
                "+=0.5",
            );

            timeline.to(
                contadorRef.current,
                {
                    opacity: 1,
                    duration: 1.5,
                    ease: "none",
                },
                "+=0.5",
            );

            timeline.to(
                carouselRef.current,
                {
                    y: 0,
                    duration: 1.5,
                    ease: "none",
                    opacity: 1,
                },
                "+=0.5",
            );
        }, sectionRef);

        // O chunk mobile chega depois do chunk da seção; atualize as medidas
        // após React montar o carrossel e seus ScrollTriggers.
        let firstFrame = 0;
        let secondFrame = 0;

        firstFrame = window.requestAnimationFrame(() => {
            secondFrame = window.requestAnimationFrame(() => {
                ScrollTrigger.refresh(true);
                onReady?.();
            });
        });

        return () => {
            window.cancelAnimationFrame(firstFrame);
            window.cancelAnimationFrame(secondFrame);
            ctx.revert();
        };
    }, [onReady]);

    return (
        <div
            ref={sectionRef}
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
            "
        >
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
                    className="h-0.5 flex-1 bg-gradientaa"
                />

                <div
                    ref={contadorRef}
                    className="flex items-center gap-1"
                >
                    <span className="text-sm font-medium text-champagne">
                        {String(slideAtual + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] text-white/20">/</span>
                    <span className="text-sm text-champagne/30">
                        {String(projects.length).padStart(2, "0")}
                    </span>
                </div>
            </div>

            <div ref={carouselRef} className="w-full">
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
                    {projects.map((projeto) => (
                        <SwiperSlide
                            key={projeto.numero}
                            className="!w-[89vw]"
                        >
                            <ProjetoCard
                                numero={projeto.numero}
                                titulo={projeto.titulo}
                                descricao={projeto.descricao}
                                tecnologias={projeto.tecnologias}
                                tecnologiasConfig={tecnologiasConfig}
                                imagens={projeto.imagens}
                                demo={projeto.demo}
                                github={projeto.github}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

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

                <div className="flex items-center gap-4 text-sm text-white/50">
                    <MoveLeft
                        size={24}
                        strokeWidth={1.5}
                        className="indicator-arrow-left"
                    />
                    <span className="h-3 w-8 rounded-full bg-white/50" />
                    <MoveRight
                        size={24}
                        strokeWidth={1.5}
                        className="indicator-arrow-right"
                    />
                </div>
            </div>
        </div>
    );
}

export default ProjetoCarouselMobile;

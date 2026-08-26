import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import ProjetoCard from "../components/ProjetoCard";

import projeto01_01 from "../assets/projetos/projeto01/jason-1.webp";
import projeto01_02 from "../assets/projetos/projeto01/jason-2.webp";
import projeto01_03 from "../assets/projetos/projeto01/jason-3.webp";
import projeto01_04 from "../assets/projetos/projeto01/lucia-1.webp";

gsap.registerPlugin(ScrollTrigger);

function Projetos() {
    const sectionRef = useRef(null);
    const trackRef = useRef(null);

    useGSAP(
        () => {
            const section = sectionRef.current;
            const track = trackRef.current;

            if (!section || !track) return;

            const getScrollAmount = () => {
                return track.scrollWidth - window.innerWidth;
            };

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,

                    start: "top top",

                    end: () => `+=${getScrollAmount() * 4}`,

                    pin: true,

                    scrub: 1,

                    invalidateOnRefresh: true,

                    markers: false,
                },
            });

            // PAUSA INICIAL
            tl.to(
                {},
                {
                    duration: 10,
                },
            );

            // MOVIMENTO HORIZONTAL
            tl.to(track, {
                x: () => -getScrollAmount(),
                duration: 90,
                ease: "none",
            });
        },
        {
            scope: sectionRef,
        },
    );

    return (
        <section className="bg-obsidian w-full">
            <div
                ref={sectionRef}
                className="relative w-full h-screen overflow-hidden"
            >
                {/* TÍTULO */}

                <div className="absolute top-0 left-0 z-20 flex flex-row items-center gap-2 w-full pt-12 p-5 md:p-10">
                    <h2 className="text-sm md:text-7xl text-steel uppercase whitespace-nowrap">
                        // Projetos
                    </h2>

                    <span className="flex-1 h-0.5 md:h-1 bg-gradientaa"></span>
                </div>

                {/* TRACK */}

                <div className="relative w-full h-full flex items-center">
                    <div
                        ref={trackRef}
                        className="flex w-max items-center gap-6"
                        style={{
                            paddingLeft: "6vw",
                            paddingRight: "6vw",
                        }}
                    >
                        {/* PROJETO 01 */}

                        <ProjetoCard
                            numero="01"
                            titulo="Projeto E-commerce"
                            descricao="Plataforma de e-commerce desenvolvida com autenticação, catálogo de produtos, carrinho e gerenciamento de pedidos."
                            tecnologias={[
                                "React",
                                "Node.js",
                                "PostgreSQL",
                                "JWT",
                            ]}
                            imagens={[
                                projeto01_01,
                                projeto01_02,
                                projeto01_03,
                                projeto01_04,
                            ]}
                            demo="https://seu-projeto.com"
                            github="https://github.com/seu-usuario/seu-projeto"
                        />

                        {/* PROJETO 02 */}

                        <ProjetoCard
                            numero="02"
                            titulo="Projeto E-commerce"
                            descricao="Plataforma de e-commerce desenvolvida com autenticação, catálogo de produtos, carrinho e gerenciamento de pedidos."
                            tecnologias={[
                                "React",
                                "Node.js",
                                "PostgreSQL",
                                "JWT",
                            ]}
                            imagens={[
                                projeto01_01,
                                projeto01_02,
                                projeto01_03,
                                projeto01_04,
                            ]}
                            demo="https://seu-projeto.com"
                            github="https://github.com/seu-usuario/seu-projeto"
                        />

                        {/* PROJETO 03 */}

                        <ProjetoCard
                            numero="03"
                            titulo="Projeto E-commerce"
                            descricao="Plataforma de e-commerce desenvolvida com autenticação, catálogo de produtos, carrinho e gerenciamento de pedidos."
                            tecnologias={[
                                "React",
                                "Node.js",
                                "PostgreSQL",
                                "JWT",
                            ]}
                            imagens={[
                                projeto01_01,
                                projeto01_02,
                                projeto01_03,
                                projeto01_04,
                            ]}
                            demo="https://seu-projeto.com"
                            github="https://github.com/seu-usuario/seu-projeto"
                        />

                        {/* PROJETO 04 */}

                        <ProjetoCard
                            numero="04"
                            titulo="Projeto E-commerce"
                            descricao="Plataforma de e-commerce desenvolvida com autenticação, catálogo de produtos, carrinho e gerenciamento de pedidos."
                            tecnologias={[
                                "React",
                                "Node.js",
                                "PostgreSQL",
                                "JWT",
                            ]}
                            imagens={[
                                projeto01_01,
                                projeto01_02,
                                projeto01_03,
                                projeto01_04,
                            ]}
                            demo="https://seu-projeto.com"
                            github="https://github.com/seu-usuario/seu-projeto"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Projetos;

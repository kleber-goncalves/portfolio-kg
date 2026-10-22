import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Card1 from "../components/Card1-teste";

gsap.registerPlugin(ScrollTrigger);

function Competencia({ experienceMode = "full" }) {
    const sectionRef = useRef(null);

    const competencias = [
        {
            numero: "01",
            text: "FRONT.",
            title: "Front-end e Interfaces Web",
            description: "Criação de interfaces com React e JavaScript, adaptadas a celulares e computadores, com componentes reutilizáveis e interações pensadas para facilitar o uso.",
        },
        {
            numero: "02",
            text: "PERF.",
            title: "Performance e SEO Técnico",
            description: "Trabalho para que as páginas carreguem com eficiência e sejam compreendidas pelos buscadores, usando otimização de imagens, carregamento sob demanda, metadados e auditorias.",
        },
        {
            numero: "03",
            text: "BACK.",
            title: "Back-end e APIs",
            description: "Desenvolvimento de serviços com Node.js e Express para receber solicitações, validar dados, aplicar regras da aplicação e conectar sistemas por APIs.",
        },
        {
            numero: "04",
            text: "DATA.",
            title: "Banco de Dados e Persistência",
            description: "Organização e armazenamento das informações das aplicações, com prática em PostgreSQL, TypeORM e SQLite.",
        },
        {
            numero: "05",
            text: "ARCH.",
            title: "Organização e Arquitetura de Software",
            description: "Organização de componentes, dados e utilitários, com foco em reutilização, manutenção do código, carregamento eficiente e decisões técnicas adequadas a cada aplicação.",
        },
        {
            numero: "06",
            text: "SEC.",
            title: "Segurança e Validação",
            description: "Aplicações seguras para proteger aplicações, como validar dados recebidos, controlar solicitações, autenticar usuários, tratamento de erros e cuidados com credenciais em integrações web.",
        },
    ];

    useLayoutEffect(() => {
        const section = sectionRef.current;

        if (!section) return;

        const ctx = gsap.context(() => {
            const header = section.querySelector("[data-competencia-header]");

            const title = section.querySelector("[data-competencia-title]");

            const line = section.querySelector("[data-competencia-line]");

            const introDesktop = section.querySelector("[data-competencia-intro-desktop]");

            const introMobile = section.querySelector("[data-competencia-intro-mobile]");

            const cards = section.querySelectorAll("[data-competencia-card]");

            const footer = section.querySelector("[data-competencia-footer]");

            /*
            ============================================================
            HEADER
            ============================================================
            */

            gsap.set(header, {
                opacity: 0,
                y: 45,
            });

            gsap.set(title, {
                opacity: 0,
                x: -35,
            });

            gsap.set(line, {
                scaleX: 0,
                transformOrigin: "left center",
            });

            gsap.set(introDesktop, {
                opacity: 0,
                x: 25,
            });

            gsap.set(introMobile, {
                opacity: 0,
                y: 25,
            });

            /*
            ============================================================
            HEADER TIMELINE
            ============================================================
            */

            const headerTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: header,
                    start: "top 85%",
                    toggleActions: "play none none reverse",
                },
            });

            headerTimeline
                .to(header, {
                    opacity: 1,
                    y: 0,
                    duration: 0.65,
                    ease: "power3.out",
                })
                .to(
                    title,
                    {
                        opacity: 1,
                        x: 0,
                        duration: 0.7,
                        ease: "power3.out",
                    },
                    "-=0.4",
                )
                .to(
                    line,
                    {
                        scaleX: 1,
                        duration: 0.8,
                        ease: "power3.inOut",
                    },
                    "-=0.55",
                )
                .to(
                    introDesktop,
                    {
                        opacity: 1,
                        x: 0,
                        duration: 0.55,
                        ease: "power3.out",
                    },
                    "-=0.55",
                )
                .to(
                    introMobile,
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.55,
                        ease: "power3.out",
                    },
                    "-=0.55",
                );

            /*
            ============================================================
            CADA CARD TEM SUA PRÓPRIA TIMELINE
            ============================================================
            */

            cards.forEach((card) => {
                gsap.set(card, {
                    opacity: 0,
                    y: 75,
                });

                const cardTimeline = gsap.timeline({
                    scrollTrigger: {
                        trigger: card,
                        start: "top 95%",
                        end: "top 55%",
                        scrub: 1,
                        markers: false,
                    },
                });

                cardTimeline.to(card, {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "none",
                });
            });

            /*
            ============================================================
            FOOTER
            ============================================================
            */

            gsap.set(footer, {
                opacity: 0,
                y: 25,
            });

            const footerTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: footer,
                    start: "top 90%",
                    toggleActions: "play none none reverse",
                },
            });

            footerTimeline.to(footer, {
                opacity: 1,
                y: 0,
                duration: 0.55,
                ease: "power3.out",
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="
                relative
                mt-30
                w-full
                overflow-hidden
                bg-obsidian
                p-5
                b-md:p-10
            "
        >
            <div
                className="
                    mx-auto
                    flex
                    w-full
                    flex-col
                    b-md:max-w-[1500px]
                "
            >
                {/* ==================================================
                    HEADER
                ================================================== */}

                <div
                    data-competencia-header
                    className="
                        mb-14
                        flex
                        w-full
                        flex-row
                        items-center
                        gap-2
                        b-md:mb-20
                    "
                >
                    <h2
                        data-competencia-title
                        className="
                            whitespace-nowrap
                            text-sm
                            uppercase
                            tracking-wide
                            text-steel
                            b-md:text-7xl
                        "
                    >
                        // COMPETENCIAS
                    </h2>

                    <span
                        data-competencia-line
                        className="
                            h-0.5
                            flex-1
                            bg-gradientaa
                            b-md:h-1
                        "
                    />

                    <p
                        data-competencia-intro-desktop
                        className="
                            hidden
                            max-w-md
                            text-steel
                            b-md:block
                            b-md:text-sm
                            b-md:leading-6
                        "
                    >
                        Eu posso te ajudar com...
                    </p>
                </div>

                {/* ==================================================
                    INTRO MOBILE
                ================================================== */}

                <div
                    className="
                        mb-16
                        flex
                        max-w-3xl
                        flex-col
                        gap-4
                        b-md:hidden
                    "
                >
                    <p
                        data-competencia-intro-mobile
                        className="
                            text-base
                            leading-6
                            text-steel
                        "
                    >
                        Eu posso te ajudar com...
                    </p>
                </div>

                {/* ==================================================
                    CARDS
                ================================================== */}

                <div
                    className="
                        grid
                        w-full
                        grid-cols-1
                        gap-4
                        b-md:grid-cols-2
                        b-md:gap-y-5
                    "
                >
                    {competencias.map((competencia) => (
                        <div key={competencia.numero} data-competencia-card className="w-full">
                            <Card1 numero={competencia.numero} variant="default" text={competencia.text} title={competencia.title} text_2={competencia.description} experienceMode={experienceMode} />
                        </div>
                    ))}
                </div>

                {/* ==================================================
                    FOOTER
                ================================================== */}

                <div
                    data-competencia-footer
                    className="
                        mt-10
                        flex
                        items-center
                        justify-between
                        text-[10px]
                        uppercase
                        tracking-[0.25em]
                        text-steel
                        b-md:mt-10
                        b-md:text-[10px]
                    "
                >
                    <span></span>

                    <span>Desenvolvimento contínuo</span>
                </div>
            </div>
        </section>
    );
}

export default Competencia;

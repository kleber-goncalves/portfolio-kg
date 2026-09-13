import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "../styles/loopText.css";

gsap.registerPlugin(ScrollTrigger);

function Footer() {
    const [dateTime, setDateTime] = useState(new Date());

    const footerRef = useRef(null);

    const headerRef = useRef(null);

    const labelRef = useRef(null);
    const titleRef = useRef(null);
    const descriptionRef = useRef(null);
    const linksRef = useRef(null);

    const infoRef = useRef(null);
    const infoItemsRef = useRef([]);

    const copyrightRef = useRef(null);

    const marqueeSectionRef = useRef(null);

    /*
    ============================================================
    DATA / HORA
    ============================================================
    */

    useEffect(() => {
        const interval = setInterval(() => {
            setDateTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const data = dateTime.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

    const hora = dateTime.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

    /*
    ============================================================
    ANIMAÇÃO DO FOOTER
    ============================================================
    */

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const header = headerRef.current;

            const label = labelRef.current;
            const title = titleRef.current;
            const description = descriptionRef.current;
            const links = linksRef.current;

            const info = infoRef.current;
            const infoItems = infoItemsRef.current.filter(Boolean);

            const copyright = copyrightRef.current;

            const marqueeSection = marqueeSectionRef.current;

            /*
            ====================================================
            ESTADO INICIAL
            ====================================================
            */

            gsap.set(header, {
                opacity: 0,
                y: 50,
            });

            gsap.set(label, {
                opacity: 0,
                y: 45,
            });

            gsap.set(title, {
                opacity: 0,
                y: 70,
            });

            gsap.set(description, {
                opacity: 0,
                y: 50,
            });

            gsap.set(links, {
                opacity: 0,
                y: 45,
            });

            gsap.set(info, {
                opacity: 0,
                y: 45,
            });

            gsap.set(infoItems, {
                opacity: 0,
                y: 30,
            });

            gsap.set(copyright, {
                opacity: 0,
                y: 35,
            });

            /*
            ====================================================
            MARQUEE
            ====================================================
            */

            gsap.set(marqueeSection, {
                opacity: 0,
                y: 80,
            });


            /*
            ====================================================
            TIMELINE
            ====================================================
            */

            const timeline = gsap.timeline({
                scrollTrigger: {
                    trigger: footerRef.current,

                    start: "top 90%",
                    end: "bottom 45%",

                    scrub: 1,

                    markers: false,
                },
            });

            /*
            ====================================================
            HEADER
            ====================================================
            */

            timeline.to(
                header,
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.7,
                    ease: "none",
                },
                0
            );

            /*
            ====================================================
            LABEL
            ====================================================
            */

            timeline.to(
                label,
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.7,
                    ease: "none",
                },
                0.15
            );

            /*
            ====================================================
            TÍTULO
            ====================================================
            */

            timeline.to(
                title,
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.9,
                    ease: "none",
                },
                0.3
            );

            /*
            ====================================================
            DESCRIÇÃO
            ====================================================
            */

            timeline.to(
                description,
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.7,
                    ease: "none",
                },
                0.55
            );

            /*
            ====================================================
            LINKS
            ====================================================
            */

            timeline.to(
                links,
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.7,
                    ease: "none",
                },
                0.7
            );

            /*
            ====================================================
            INFORMAÇÕES
            ====================================================
            */

            timeline.to(
                info,
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.7,
                    ease: "none",
                },
                0.95
            );

            /*
            ====================================================
            ITENS DAS INFORMAÇÕES
            ====================================================
            */

            infoItems.forEach((item, index) => {
                timeline.to(
                    item,
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.55,
                        ease: "none",
                    },
                    1.05 + index * 0.08
                );
            });

            /*
            ====================================================
            COPYRIGHT
            ====================================================
            */

            timeline.to(
                copyright,
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.7,
                    ease: "none",
                },
                1.45
            );

            /*
            ====================================================
            MARQUEE
            ====================================================
            */

            timeline.to(
                marqueeSection,
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.4,
                    ease: "none",
                },
                1.7
            );

            /*
            ====================================================
            REFRESH
            ====================================================
            */

            requestAnimationFrame(() => {
                ScrollTrigger.refresh();
            });
        }, footerRef);

        return () => {
            ctx.revert();
        };
    }, []);

    return (
        <footer
            ref={footerRef}
            id="footer"
            className="
                relative
                flex
                min-h-screen
                w-full
                overflow-hidden
                bg-obsidian
               
                py-5

                md:min-h-[120vh]

                md:py-1
                mt-30
            "
        >
            {/* =====================================================
                CONTAINER PRINCIPAL
            ===================================================== */}

            <div
                className="
                    relative
                    z-10
                    mx-auto
                    flex
                    min-h-[calc(100vh-2.5rem)]
                    w-full
                    max-w-[1500px]
                    flex-col

                    md:min-h-[calc(120vh-5rem)]
                "
            >
                {/* =================================================
                    TOPO
                ================================================= */}

                <header
                    ref={headerRef}
                    className="
                        flex
                        items-start
                        justify-between
                        border-t
                        border-graphite
                        pt-6
                                         px-5
                md:px-0
                        md:pt-8
                    "
                >
                    {/* LOGO */}

                    <a
                        href="#hero"
                        aria-label="Voltar ao início"
                        className="
                            block
                            h-8
                            w-8
                            transition-transform
                            duration-300
                            hover:scale-105

                            md:h-16
                            md:w-16
                        "
                    >
                        <img
                            src="/logo.svg"
                            alt="Kleber Dev"
                            className="
                                h-full
                                w-full
                                object-contain
                            "
                        />
                    </a>

                    {/* IDENTIFICAÇÃO */}

                    <div className="flex flex-col items-end gap-1">
                        <span
                            className="
                                font-bebas
                                text-xs
                                tracking-[0.2em]
                                text-steel

                                md:text-sm
                            "
                        >
                            PORTFOLIO
                        </span>

                        <span
                            className="
                                text-[10px]
                                uppercase
                                tracking-[0.15em]
                                text-steel/50
                            "
                        >
                            2026
                        </span>
                    </div>
                </header>

                {/* =================================================
                    ÁREA PRINCIPAL
                ================================================= */}

                <div
                    className="
                        flex
                       
                        flex-col
                       

                        py-20
                        pb-[8vh]
                                         px-5
                md:px-0
                        md:py-24
                        md:pb-30
                    "
                >
                    {/* LABEL */}

                    <span
                        ref={labelRef}
                        className="
                            font-space
                            text-xs
                            uppercase
                            tracking-[0.25em]
                            text-bronze

                            md:text-sm
                        "
                    >
                        Disponível para novos projetos
                    </span>

                    {/* CTA */}

                    <h2
                        ref={titleRef}
                        className="
                            mt-5
                            max-w-5xl
                            font-space
                            text-5xl
                            font-semibold
                            leading-[0.9]
                            tracking-tight
                            text-ivory

                            md:mt-7
                            md:text-7xl
                            lg:text-8xl
                        "
                    >
                        Vamos construir
                        <br />
                        algo relevante.
                    </h2>

                    {/* DESCRIÇÃO */}

                    <p
                        ref={descriptionRef}
                        className="
                            mt-7
                            max-w-xl
                            text-sm
                            leading-6
                            text-steel

                            md:mt-8
                            md:text-base
                            md:leading-7
                        "
                    >
                        Desenvolvimento de aplicações web com foco em experiência, arquitetura e soluções que fazem sentido para o produto.
                    </p>

                    {/* =================================================
                        LINKS
                    ================================================= */}

                    <div
                        ref={linksRef}
                        className="
                            mt-9
                            flex
                            flex-wrap
                            gap-3

                            md:mt-10
                        "
                    >
                        {/* GITHUB */}

                        <a
                            href="https://github.com/kleber-goncalves"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="
                                group
                                inline-flex
                                items-center
                                gap-2
                                rounded-full
                                border
                                border-graphite
                                px-5
                                py-3
                                text-xs
                                font-medium
                                uppercase
                                tracking-[0.12em]
                                text-ivory
                                transition-all
                                duration-300
                                hover:border-bronze
                                hover:text-bronze
                            "
                        >
                            GitHub
                            <ArrowUpRight
                                className="
                                    h-3.5
                                    w-3.5
                                    transition-transform
                                    duration-300
                                    group-hover:-translate-y-0.5
                                    group-hover:translate-x-0.5
                                "
                            />
                        </a>

                        {/* LINKEDIN */}

                        <a
                            href="https://www.linkedin.com/in/kleber-goncalve-s/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="
                                group
                                inline-flex
                                items-center
                                gap-2
                                rounded-full
                                border
                                border-graphite
                                px-5
                                py-3
                                text-xs
                                font-medium
                                uppercase
                                tracking-[0.12em]
                                text-ivory
                                transition-all
                                duration-300
                                hover:border-bronze
                                hover:text-bronze
                            "
                        >
                            LinkedIn
                            <ArrowUpRight
                                className="
                                    h-3.5
                                    w-3.5
                                    transition-transform
                                    duration-300
                                    group-hover:-translate-y-0.5
                                    group-hover:translate-x-0.5
                                "
                            />
                        </a>

                        {/* CONTATO */}

                        <a
                            href="mailto:seuemail@email.com"
                            className="
                                group
                                inline-flex
                                items-center
                                gap-2
                                pointer-events-none
                                rounded-full
                                bg-ivory
                                px-5
                                py-3
                                text-xs
                                font-medium
                                uppercase
                                tracking-[0.12em]
                                text-obsidian
                                transition-all
                                duration-300
                                hover:bg-champagne
                            "
                        >
                            Entrar em contato
                            <ArrowUpRight
                                className="
                                    h-3.5
                                    w-3.5
                                    transition-transform
                                    duration-300
                                    group-hover:-translate-y-0.5
                                    group-hover:translate-x-0.5
                                "
                            />
                        </a>
                    </div>
                </div>

                {/* =================================================
                    INFORMAÇÕES
                ================================================= */}

                <div
                    ref={infoRef}
                    className="
                        grid
                        grid-cols-2
                        gap-y-4
                        border-t
                        border-graphite
                        py-6
                                         px-5
                md:px-0
                        md:grid-cols-4
                        md:gap-6
                        md:py-7
                    "
                >
                    {/* LOCAL */}

                    <div
                        ref={(el) => {
                            infoItemsRef.current[0] = el;
                        }}
                        className="flex flex-col gap-1"
                    >
                        <span
                            className="
                                font-bebas
                                text-[10px]
                                uppercase
                                tracking-[0.2em]
                                text-steel
                            "
                        >
                            Local
                        </span>

                        <span
                            className="
                                text-xs
                                text-ivory

                                md:text-sm
                            "
                        >
                            Brasil
                        </span>
                    </div>

                    {/* DATA */}

                    <div
                        ref={(el) => {
                            infoItemsRef.current[1] = el;
                        }}
                        className="flex flex-col gap-1"
                    >
                        <span
                            className="
                                font-bebas
                                text-[10px]
                                uppercase
                                tracking-[0.2em]
                                text-steel
                            "
                        >
                            Data
                        </span>

                        <span
                            className="
                                text-xs
                                uppercase
                                text-ivory

                                md:text-sm
                            "
                        >
                            {data}
                        </span>
                    </div>

                    {/* HORA */}

                    <div
                        ref={(el) => {
                            infoItemsRef.current[2] = el;
                        }}
                        className="flex flex-col gap-1"
                    >
                        <span
                            className="
                                font-bebas
                                text-[10px]
                                uppercase
                                tracking-[0.2em]
                                text-steel
                            "
                        >
                            Hora local
                        </span>

                        <span
                            className="
                                font-bebas
                                text-lg
                                leading-none
                                text-bronze

                                md:text-xl
                            "
                        >
                            {hora}
                        </span>
                    </div>

                    {/* STATUS */}

                    <div
                        ref={(el) => {
                            infoItemsRef.current[3] = el;
                        }}
                        className="flex flex-col gap-1"
                    >
                        <span
                            className="
                                font-bebas
                                text-[10px]
                                uppercase
                                tracking-[0.2em]
                                text-steel
                            "
                        >
                            Status
                        </span>

                        <span
                            className="
                                flex
                                items-center
                                gap-2
                                text-xs
                                text-ivory

                                md:text-sm
                            "
                        >
                            <span className="relative flex h-2 w-2">
                                <span
                                    className="
                                        absolute
                                        inline-flex
                                        h-full
                                        w-full
                                        animate-ping
                                        rounded-full
                                        bg-green-400
                                        opacity-60
                                    "
                                />

                                <span
                                    className="
                                        relative
                                        inline-flex
                                        h-2
                                        w-2
                                        rounded-full
                                        bg-green-400
                                    "
                                />
                            </span>
                            Disponível
                        </span>
                    </div>
                </div>

                {/* =================================================
                    COPYRIGHT
                ================================================= */}

                <div
                    ref={copyrightRef}
                    className="
                        flex
                        flex-col
                        gap-2
                        border-t
                        border-graphite
                        py-5
                        pb-0
                        text-[9px]
                        uppercase
                        tracking-[0.12em]
                        text-steel
                                         px-5
                md:px-0
                        md:flex-row
                        md:items-center
                        md:justify-between
                        md:text-[10px]
                        md:pb-12
                    "
                >
                    <span>© 2026 Kleber Dev</span>

                    <span>Desenvolvido com React · Tailwind · GSAP</span>
                </div>

                {/* =================================================
                    MARQUEE — AGORA FAZ PARTE DO LAYOUT
                ================================================= */}

                <div
                    ref={marqueeSectionRef}
                    className="
        relative
        left-1/2
        md:left-192
        w-screen
        -translate-x-1/2
        overflow-hidden
        pb-23
        md:pb-0
    "
                >
                    <div  className="marquee-track">
                        <div className="marquee-content">
                            KLEBER DEV
                            <span className="marquee-star">✦</span>
                        </div>

                        <div className="marquee-content">
                            KLEBER DEV
                            <span className="marquee-star">✦</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";

import "../styles/loopText.css";

function Footer() {
    const [dateTime, setDateTime] = useState(new Date());

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

    return (
        <footer
            id="footer"
            className="
                relative
                flex
                min-h-screen
                w-full
                overflow-hidden
                bg-obsidian
                px-5
                py-5

                md:px-10
                md:py-10
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

                    md:min-h-[calc(100vh-5rem)]
                "
            >
                {/* =================================================
                    TOPO
                ================================================= */}

                <header
                    className="
                        flex
                        items-start
                        justify-between
                        border-t
                        border-graphite
                        pt-6

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
                        flex-1
                        flex-col
                        justify-center
                        py-20

                        md:py-24
                    "
                >
                    {/* LABEL */}

                    <span
                        className="
                            font-bebas
                            text-xs
                            uppercase
                            tracking-[0.25em]
                            text-bronze

                            md:text-sm
                        "
                    >
                        Disponível para novos projetos
                    </span>

                    {/* =================================================
                        CTA
                    ================================================= */}

                    <h2
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
                            md:text-8xl
                            lg:text-[8.5rem]
                        "
                    >
                        Vamos construir
                        <br />
                        algo relevante.
                    </h2>

                    {/* DESCRIÇÃO */}

                    <p
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
                            href="#"
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
                    className="
                        grid
                        grid-cols-2
                        gap-y-8
                        border-t
                        border-graphite
                        py-6

                        md:grid-cols-4
                        md:gap-6
                        md:py-7
                    "
                >
                    {/* LOCAL */}

                    <div className="flex flex-col gap-1">
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

                    <div className="flex flex-col gap-1">
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

                    <div className="flex flex-col gap-1">
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

                    <div className="flex flex-col gap-1">
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
                    className="
                        flex
                        flex-col
                        gap-2
                        border-t
                        border-graphite
                        py-5
                        text-[9px]
                        uppercase
                        tracking-[0.12em]
                        text-steel

                        md:flex-row
                        md:items-center
                        md:justify-between
                        md:text-[10px]
                    "
                >
                    <span>© 2026 Kleber Dev</span>

                    <span>Desenvolvido com React · Tailwind · GSAP</span>
                </div>
            </div>

            {/* =====================================================
                MARQUEE
            ===================================================== */}

            <div
                className="
                    pointer-events-none
                    absolute
                    bottom-5
                    left-0
                    z-0
                    w-full
                    overflow-hidden
                    opacity-100

                    md:bottom-8
                "
            >
                <div className="marquee-track">
                    {/* PRIMEIRA CÓPIA */}

                    <div className="marquee-content">
                        <span className="font-bebas">KLEBER DEV</span>

                        <span className="marquee-star">✦</span>
                    </div>

                    {/* SEGUNDA CÓPIA */}

                    <div className="marquee-content">
                        <span className="font-bebas">KLEBER DEV</span>

                        <span className="marquee-star">✦</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;

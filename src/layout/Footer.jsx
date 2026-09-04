import { useEffect, useState } from "react";
import "../styles/loopText.css";

function Footer() {
    const [dateTime, setDateTime] = useState(new Date());

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
        <section className="bg-obsidian w-full h-full p-5 md:p-10 relative overflow-hidden flex flex-col items-center ">
            {/* =====================================================
                CONTEÚDO PRINCIPAL
            ===================================================== */}

            <div
                className="relative z-10 flex min-h-screen                         border-t
                        border-graphite flex-col gap-20 "
            >
                {/* =================================================
                    TOPO
                ================================================= */}

                <div id="footer" className="flex items-start mt-10 justify-between">
                    {/* LOGO */}

                    <div className="h-7 w-7 md:h-20 md:w-20">
                        <img src="/logo.svg" alt="Kleber Dev" className="h-full w-full object-contain" />
                    </div>

                    {/* IDENTIFICAÇÃO */}

                    <div>
                        <span className=" text-xs tracking-[0.2em] text-steel">PORTFOLIO · 2026</span>
                    </div>
                </div>

                {/* =================================================
                    CTA
                ================================================= */}

                <div className="w-full h-full ">
                    <span className="font-bebas text-sm tracking-[0.25em] text-bronze">DISPONÍVEL PARA NOVOS PROJETOS</span>

                    <h2 className="mt-4 max-w-4xl font-space text-5xl font-semibold leading-[0.9] tracking-tight text-ivory md:text-8xl">
                        Vamos construir
                        <br />
                        algo relevante.
                    </h2>

                    <p className="mt-6 max-w-xl text-sm leading-relaxed text-steel md:text-base">Desenvolvimento de aplicações web com foco em experiência, arquitetura e soluções que fazem sentido para o produto.</p>

                    {/* =================================================
                        LINKS
                    ================================================= */}

                    <div className="mt-8 flex flex-wrap gap-3">
                        <a
                            href="#"
                            className="
                                rounded-full
                                border
                                border-graphite
                                px-5
                                py-3
                                text-xs
                                font-medium
                                uppercase
                                tracking-wider
                                text-ivory
                                transition-all
                                duration-300
                                hover:border-bronze
                                hover:text-bronze
                            "
                        >
                            GitHub ↗
                        </a>

                        <a
                            href="#"
                            className="
                                rounded-full
                                border
                                border-graphite
                                px-5
                                py-3
                                text-xs
                                font-medium
                                uppercase
                                tracking-wider
                                text-ivory
                                transition-all
                                duration-300
                                hover:border-bronze
                                hover:text-bronze
                            "
                        >
                            LinkedIn ↗
                        </a>

                        <a
                            href="mailto:seuemail@email.com"
                            className="
                                rounded-full
                                bg-ivory
                                px-5
                                py-3
                                text-xs
                                font-medium
                                uppercase
                                tracking-wider
                                text-obsidian
                                transition-transform
                                duration-300
                                hover:scale-105
                            "
                        >
                            Entrar em contato ↗
                        </a>
                    </div>
                </div>
                <div>
                    {/* =================================================
                    INFORMAÇÕES
                ================================================= */}

                    <div
                        className="
                        relative
                        z-20
                        grid
                        grid-cols-2
                        gap-6
                        border-t
                        border-graphite
                        pt-5
                        md:grid-cols-4
                    "
                    >
                        {/* LOCAL */}

                        <div>
                            <span className="block font-space text-[10px] tracking-[0.2em] text-steel">LOCAL</span>

                            <span className="mt-1 block text-xs text-ivory md:text-sm">Brasil</span>
                        </div>

                        {/* DATA */}

                        <div>
                            <span className="block font-space text-[10px] tracking-[0.2em] text-steel">DATA</span>

                            <span className="mt-1 block text-xs uppercase text-ivory md:text-sm">{data}</span>
                        </div>

                        {/* HORA */}

                        <div>
                            <span className="block font-space text-[10px] tracking-[0.2em] text-steel">HORA LOCAL</span>

                            <span className="mt-1 block font-bebas text-lg text-bronze md:text-xl">{hora}</span>
                        </div>

                        {/* STATUS */}

                        <div>
                            <span className="block font-space text-[10px] tracking-[0.2em] text-steel">STATUS</span>

                            <span className="mt-1 flex items-center gap-2 text-xs text-ivory md:text-sm">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-400 " />
                                <span className="absolute h-1.5 w-1.5 rounded-full bg-green-400 animate-ping " />
                                Disponível
                            </span>
                        </div>
                    </div>

                    {/* =================================================
                    COPYRIGHT
                ================================================= */}

                    <div
                        className="
                        relative
                        z-20
                        flex
                        flex-col
                        gap-2
                        border-t
                        border-graphite
                        py-5
                        text-[10px]
                        uppercase
                        tracking-wider
                        text-steel
                        md:flex-row
                        md:items-center
                        md:justify-between
                    "
                    >
                        <span>© 2026 Kleber Dev</span>

                        <span>Desenvolvido com React · Tailwind · GSAP</span>
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center w-full">
                <div className="absolute bottom-10 left-0 w-full overflow-hidden">
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
            </div>
        </section>
    );
}

export default Footer;

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MinhaTrajetoria from "../components/MinhaTrajetoria";
import { eventosTrajetoria } from "../data/eventosTrajetoria";
import "../styles/formationCard.css";

gsap.registerPlugin(ScrollTrigger);

function Formacao() {
    const sectionRef = useRef(null);
    const formationCardRef = useRef(null);

    /*
    ============================================================
    ANIMAÇÕES EXCLUSIVAS DA FORMAÇÃO
    ============================================================
    */

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const formationCard = formationCardRef.current;

            if (!formationCard) return;

            /*
            ====================================================
            ELEMENTOS QUE RECEBEM O EFEITO
            ====================================================
            */

            const interactiveCards = formationCard.querySelectorAll("[data-formation-card]");

            /*
            ====================================================
            VERIFICA SE O DISPOSITIVO POSSUI MOUSE
            ====================================================
            */

            const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");

            if (!mediaQuery.matches) return;

            /*
            ====================================================
            APLICA O EFEITO EM CADA CARD
            ====================================================
            */

            const cleanups = [];

            interactiveCards.forEach((card) => {
                /*
                =================================================
                MOUSE ENTER
                =================================================
                */

                const handleMouseEnter = () => {
                    card.style.setProperty("--spotlight-opacity", "1");

                    card.style.setProperty("--border-glow-opacity", "1");

                    gsap.to(card, {
                        y: -3,
                        duration: 0.35,
                        ease: "power2.out",
                        overwrite: true,
                    });
                };

                /*
                =================================================
                MOUSE MOVE
                =================================================
                */

                const handleMouseMove = (event) => {
                    const rect = card.getBoundingClientRect();

                    const x = event.clientX - rect.left;
                    const y = event.clientY - rect.top;

                    /*
                    =============================================
                    POSIÇÃO DO SPOTLIGHT
                    =============================================
                    */

                    const percentX = (x / rect.width) * 100;
                    const percentY = (y / rect.height) * 100;

                    card.style.setProperty("--mouse-x", `${percentX}%`);

                    card.style.setProperty("--mouse-y", `${percentY}%`);

                    /*
                    =============================================
                    TILT 3D
                    =============================================
                    */

                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;

                    const mouseX = x - centerX;
                    const mouseY = y - centerY;

                    /*
                     * Tilt extremamente sutil,
                     * igual aos outros cards.
                     */

                    const rotateX = (mouseY / centerY) * -1.5;

                    const rotateY = (mouseX / centerX) * 1.5;

                    gsap.to(card, {
                        rotateX,
                        rotateY,
                        duration: 0.18,
                        ease: "power2.out",
                        transformPerspective: 500,
                        overwrite: true,
                    });
                };

                /*
                =================================================
                MOUSE LEAVE
                =================================================
                */

                const handleMouseLeave = () => {
                    card.style.setProperty("--spotlight-opacity", "0");

                    card.style.setProperty("--border-glow-opacity", "0");

                    gsap.to(card, {
                        y: 0,
                        rotateX: 0,
                        rotateY: 0,
                        duration: 0.5,
                        ease: "power3.out",
                        overwrite: true,
                    });
                };

                /*
                =================================================
                EVENT LISTENERS
                =================================================
                */

                card.addEventListener("mouseenter", handleMouseEnter);

                card.addEventListener("mousemove", handleMouseMove);

                card.addEventListener("mouseleave", handleMouseLeave);

                /*
                =================================================
                CLEANUP INDIVIDUAL
                =================================================
                */

                cleanups.push(() => {
                    card.removeEventListener("mouseenter", handleMouseEnter);

                    card.removeEventListener("mousemove", handleMouseMove);

                    card.removeEventListener("mouseleave", handleMouseLeave);

                    gsap.killTweensOf(card);
                });
            });

            /*
            ====================================================
            CLEANUP
            ====================================================
            */

            return () => {
                cleanups.forEach((cleanup) => cleanup());
            };
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            id="formacao"
            className="
                bg-obsidian
                w-full
                h-full
                p-5
                md:p-10
                relative
                overflow-hidden
                flex
                flex-col
                items-center
                gap-10
            "
        >
            <div
                className="
                    flex
                    flex-col
                    items-center
                    gap-10
                    md:gap-20
                    w-full
                    md:max-w-[1500px]
                "
            >
                {/* =====================================================
                    TÍTULO
                ===================================================== */}

                <div
                    className="
                        flex
                        flex-row
                        items-center
                        gap-2
                        w-full
                    "
                >
                    <h2
                        className="
                            text-sm
                            md:text-7xl
                            text-steel
                            uppercase
                        "
                    >
                        // Formação & Nivel Técnico
                    </h2>

                    <span
                        className="
                            flex-1
                            h-0.5
                            md:h-1
                            bg-gradientaa
                        "
                    />
                </div>

                <div
                    className="
                        w-full
                        h-full
                        relative
                        overflow-hidden
                        flex
                        flex-col
                        items-center
                        gap-15
                        md:gap-20
                    "
                >
                    {/* =====================================================
                        FORMATION CARD
                    ===================================================== */}

                    <div
                        ref={formationCardRef}
                        className="
                            relative
                            w-full

                            rounded-3xl
                            border-t-2
                            border-champagne
                            bg-carbon

                            md:rounded-none
                            md:border-t-0
                            md:bg-transparent
                        "
                    >
                        <div
                            className="
                                relative
                                flex
                                w-full
                                flex-col
                                gap-10

                                rounded-3xl
                                border
                                border-graphite
                                p-5

                                md:gap-4
                                md:rounded-none
                                md:border-0
                                md:p-0
                            "
                        >
                            {/* =====================================================
                                BLOCO PRINCIPAL
                            ===================================================== */}

                            <div
                                className="
                                    relative
                                    grid
                                    w-full
                                    grid-cols-1
                                    gap-10

                                    md:grid-cols-[1.1fr_1.85fr]
                                    md:gap-0
                                "
                            >
                                {/* =================================================
                                    CARD 1 — NÍVEL ATUAL
                                ================================================= */}

                                <div
                                    data-formation-card
                                    className="
                                        formation-inner-card
                                        relative
                                        flex
                                        flex-col
                                        gap-8
                                        pt-2
                                        md:pt-6
                                        md:pl-6
                                    "
                                >
                                    {/* SPOTLIGHT */}

                                    <span
                                        className="
                                            formation-inner-card__spotlight
                                            absolute
                                            inset-0
                                            pointer-events-none
                                        "
                                    />

                                    {/* GLOW */}

                                    <span
                                        className="
                                            formation-inner-card__glow
                                            absolute
                                            inset-0
                                            pointer-events-none
                                        "
                                    />

                                    {/* LABEL */}

                                    <div
                                        className="
                                            relative
                                            z-[2]
                                            flex
                                            items-center
                                            gap-3
                                        "
                                    >
                                        <span
                                            className="
                                                h-2
                                                w-2
                                                shrink-0
                                                rounded-full
                                                bg-champagne
                                            "
                                        />

                                        <p
                                            className="
                                                font-bebas
                                                text-xs
                                                uppercase
                                                tracking-[0.2em]
                                                text-steel

                                                md:text-sm
                                            "
                                        >
                                            Nível atual
                                        </p>
                                    </div>

                                    {/* JUNIOR */}

                                    <div
                                        className="
                                            relative
                                            z-[2]
                                        "
                                    >
                                        <h2
                                            className="
                                                relative
                                                z-10
                                                font-bold
                                                bebas-neue-regular
                                                text-6xl
                                                uppercase
                                                tracking-tight
                                                text-ivory

                                                md:text-[10rem]
                                                lg:text-7xl
                                            "
                                        >
                                            Junior
                                        </h2>
                                    </div>

                                    {/* ESPECIALIDADES */}

                                    <div
                                        className="
                                            relative
                                            z-[2]
                                            flex
                                            flex-wrap
                                            gap-x-4
                                            gap-y-1

                                            text-sm
                                            text-steel

                                            md:text-base
                                        "
                                    >
                                        <span>Frontend</span>

                                        <span className="text-bronze">·</span>

                                        <span>Backend</span>

                                        <span className="text-bronze">·</span>

                                        <span>Full Stack</span>
                                    </div>
                                </div>

                                {/* =================================================
                                    CARD 2 — FORMAÇÃO ACADÊMICA PRINCIPAL
                                ================================================= */}

                                <div
                                    data-formation-card
                                    className="
                                        formation-inner-card
                                        flex
                                        flex-col
                                        justify-end
                                        gap-6

                                        md:border-l
                                        md:border-graphite
                                        md:pl-10
                                        md:pt-6
                                        lg:pl-10
                                        lg:pr-10
                                        lg:pb-6
                                    "
                                >
                                    {/* SPOTLIGHT */}

                                    <span
                                        className="
                                            formation-inner-card__spotlight
                                            absolute
                                            inset-0
                                            pointer-events-none
                                        "
                                    />

                                    {/* GLOW */}

                                    <span
                                        className="
                                            formation-inner-card__glow
                                            absolute
                                            inset-0
                                            pointer-events-none
                                        "
                                    />

                                    {/* LABEL */}

                                    <div
                                        className="
                                            relative
                                            z-[2]
                                            flex
                                            items-center
                                            gap-3
                                        "
                                    >
                                        <span
                                            className="
                                                h-2
                                                w-2
                                                shrink-0
                                                rounded-full
                                                bg-champagne
                                            "
                                        />

                                        <h3
                                            className="
                                                font-bebas
                                                text-xs
                                                uppercase
                                                tracking-[0.2em]
                                                text-steel

                                                md:text-sm
                                            "
                                        >
                                            Formação
                                        </h3>
                                    </div>

                                    {/* CURSO */}

                                    <div
                                        className="
                                            relative
                                            z-[2]
                                            flex
                                            flex-col
                                            gap-2
                                        "
                                    >
                                        <p
                                            className="
                                                font-space
                                                text-2xl
                                                font-semibold
                                                leading-tight
                                                text-ivory

                                                md:text-4xl
                                            "
                                        >
                                            Análise e Desenvolvimento
                                            <br className="hidden md:block" />
                                            de Sistemas
                                        </p>

                                        <p
                                            className="
                                                text-sm
                                                text-champagne

                                                md:text-base
                                            "
                                        >
                                            ADS · Uniube — Uberaba
                                        </p>
                                    </div>

                                    {/* PROGRESSO */}

                                    <div
                                        className="
                                            relative
                                            z-[2]
                                            flex
                                            flex-col
                                            gap-3
                                        "
                                    >
                                        <div
                                            className="
                                                flex
                                                items-end
                                                justify-between
                                            "
                                        >
                                            <span
                                                className="
                                                    text-xs
                                                    uppercase
                                                    tracking-[0.15em]
                                                    text-steel/60
                                                "
                                            >
                                                Progresso
                                            </span>

                                            <span
                                                className="
                                                    font-bebas
                                                    text-3xl
                                                    leading-none
                                                    text-bronze

                                                    md:text-4xl
                                                "
                                            >
                                                87%
                                            </span>
                                        </div>

                                        <div
                                            className="
                                                h-1.5
                                                w-full
                                                overflow-hidden
                                                rounded-full
                                                bg-graphite
                                            "
                                        >
                                            <div
                                                className="
                                                    h-full
                                                    w-[87%]
                                                    rounded-full
                                                    bg-bronze
                                                "
                                            />
                                        </div>

                                        <div
                                            className="
                                                flex
                                                justify-between
                                                text-xs
                                                text-steel/70

                                                md:text-sm
                                            "
                                        >
                                            <span>2,5 anos</span>

                                            <span>Em conclusão</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* =====================================================
                                FORMAÇÕES COMPLEMENTAR + ACADÊMICA
                            ===================================================== */}

                            <div
                                className="
                                    grid
                                    w-full
                                    grid-cols-1
                                    gap-6

                                    md:grid-cols-2
                                    md:gap-5
                                "
                            >
                                {/* =================================================
                                    CARD 3 — FORMAÇÃO COMPLEMENTAR
                                ================================================= */}

                                <div
                                    data-formation-card
                                    className="
                                        formation-inner-card
                                        relative
                                        flex
                                        flex-col
                                        gap-3

                                        border-y
                                        border-graphite
                                        pt-8

                                        md:pt-10
                                        md:pl-6
                                    "
                                >
                                    {/* SPOTLIGHT */}

                                    <span
                                        className="
                                            formation-inner-card__spotlight
                                            absolute
                                            inset-0
                                            pointer-events-none
                                        "
                                    />

                                    {/* GLOW */}

                                    <span
                                        className="
                                            formation-inner-card__glow
                                            absolute
                                            inset-0
                                            pointer-events-none
                                        "
                                    />

                                    {/* LABEL */}

                                    <div
                                        className="
                                            relative
                                            z-[2]
                                            flex
                                            items-center
                                            gap-3
                                        "
                                    >
                                        <span
                                            className="
                                                h-1.5
                                                w-1.5
                                                rounded-full
                                                bg-champagne
                                            "
                                        />

                                        <p
                                            className="
                                                font-bebas
                                                text-xs
                                                uppercase
                                                tracking-[0.2em]
                                                text-steel
                                            "
                                        >
                                            Formação complementar
                                        </p>
                                    </div>

                                    {/* DESCRIÇÃO */}

                                    <p
                                        className="
                                            relative
                                            z-[2]
                                            text-sm
                                            leading-6
                                            text-steel

                                            md:text-base
                                            md:leading-7
                                        "
                                    >
                                        Formado nos cursos de
                                        <span className="font-bold text-bronze"> Front-end</span> e<span className="font-bold text-bronze"> Back-end</span> da
                                        <span className="font-bold text-champagne"> DNC</span>, com formação prática que simula o mercado real e voltada ao desenvolvimento de aplicações web, construção de interfaces, APIs, integração com bancos de dados e desenvolvimento
                                        <span className="font-bold text-bronze"> Full-Stack</span>.
                                    </p>
                                </div>

                                {/* =================================================
                                    CARD 4 — FORMAÇÃO ACADÊMICA
                                ================================================= */}

                                <div
                                    data-formation-card
                                    className="
                                        formation-inner-card
                                        relative
                                        flex
                                        flex-col
                                        gap-3

                                        border-y
                                        border-graphite
                                        pt-8

                                        md:pt-10
                                        md:pl-6
                                    "
                                >
                                    {/* SPOTLIGHT */}

                                    <span
                                        className="
                                            formation-inner-card__spotlight
                                            absolute
                                            inset-0
                                            pointer-events-none
                                        "
                                    />

                                    {/* GLOW */}

                                    <span
                                        className="
                                            formation-inner-card__glow
                                            absolute
                                            inset-0
                                            pointer-events-none
                                        "
                                    />

                                    {/* LABEL */}

                                    <div
                                        className="
                                            relative
                                            z-[2]
                                            flex
                                            items-center
                                            gap-3
                                        "
                                    >
                                        <span
                                            className="
                                                h-1.5
                                                w-1.5
                                                rounded-full
                                                bg-champagne
                                            "
                                        />

                                        <p
                                            className="
                                                font-bebas
                                                text-xs
                                                uppercase
                                                tracking-[0.2em]
                                                text-steel
                                            "
                                        >
                                            Formação acadêmica
                                        </p>
                                    </div>

                                    {/* DESCRIÇÃO */}

                                    <p
                                        className="
                                            relative
                                            z-[2]
                                            text-sm
                                            leading-6
                                            text-steel

                                            md:text-base
                                            md:leading-7
                                        "
                                    >
                                        Atualmente, estou concluindo
                                        <span className="font-bold text-bronze"> Análise e Desenvolvimento de Sistemas</span> pela
                                        <span className="font-bold text-champagne"> Uniube — Uberaba</span>, com aproximadamente
                                        <span className="font-bold text-bronze"> 87% da graduação concluída.</span> A formação envolve Scrum, sprints e projetos em equipe.
                                    </p>

                                    <p
                                        className="
                                            relative
                                            z-[2]
                                            text-xs
                                            italic
                                            leading-5
                                            text-steel/60

                                            md:text-sm
                                            md:leading-6
                                        "
                                    >
                                        O nível reflete o que a formação entregou, não tempo de mercado.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* =====================================================
                        MINHA TRAJETÓRIA — NÃO ALTERADO
                    ===================================================== */}

                    <MinhaTrajetoria subtitulo="Minha Trajetória" titulo="Evolução" descricao="Aprendizado, prática e evolução contínua no desenvolvimento de software." eventos={eventosTrajetoria} />
                </div>
            </div>
        </section>
    );
}

export default Formacao;

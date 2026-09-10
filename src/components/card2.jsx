import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "gsap";
import "../styles/editorialCard2.css";

export default function Card2({ title, number, text, variant = "default", className = "", classNameNumber = "", classNameTitle = "", classNameText = "", ...props }) {
    const cardRef = useRef(null);

    /*
    =========================================================
    ANIMAÇÕES / EFEITOS
    =========================================================
    */

    useEffect(() => {
        const card = cardRef.current;

        if (!card) return;

        /*
         * Só ativa o efeito em dispositivos que realmente
         * possuem mouse/hover.
         */

        const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");

        if (!mediaQuery.matches) return;

        /*
         * ================================================
         * ENTRADA DO MOUSE
         * ================================================
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
         * ================================================
         * MOVIMENTO DO MOUSE
         * ================================================
         */

        const handleMouseMove = (event) => {
            const rect = card.getBoundingClientRect();

            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            /*
             * ============================================
             * POSIÇÃO DO SPOTLIGHT
             * ============================================
             */

            const percentX = (x / rect.width) * 100;

            const percentY = (y / rect.height) * 100;

            card.style.setProperty("--mouse-x", `${percentX}%`);

            card.style.setProperty("--mouse-y", `${percentY}%`);

            /*
             * ============================================
             * TILT 3D
             * ============================================
             */

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const mouseX = x - centerX;
            const mouseY = y - centerY;

            /*
             * Intensidade do Tilt.
             *
             * Mantemos baixo para continuar com
             * aparência editorial/premium.
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
         * ================================================
         * SAÍDA DO MOUSE
         * ================================================
         */

        const handleMouseLeave = () => {
            card.style.setProperty("--spotlight-opacity", "0");

            card.style.setProperty("--border-glow-opacity", "0");

            /*
             * Retorna suavemente para a posição original.
             */

            gsap.to(card, {
                y: 0,
                rotateX: 0,
                rotateY: 0,

                duration: 0.5,

                ease: "power3.out",

                overwrite: true,
            });
        };

        card.addEventListener("mouseenter", handleMouseEnter);

        card.addEventListener("mousemove", handleMouseMove);

        card.addEventListener("mouseleave", handleMouseLeave);

        /*
         * ================================================
         * CLEANUP
         * ================================================
         */

        return () => {
            card.removeEventListener("mouseenter", handleMouseEnter);

            card.removeEventListener("mousemove", handleMouseMove);

            card.removeEventListener("mouseleave", handleMouseLeave);

            gsap.killTweensOf(card);
        };
    }, []);

    /*
    =========================================================
    VARIANTS
    =========================================================
    */

    const variants = {
        default: {
            number: "text-bronze",
            title: "text-ivory",
            description: "text-steel",
        },

        v1: {
            number: "text-white",
            title: "text-white",
            description: "text-white/60",
        },

        v2: {
            number: "text-white",
            title: "text-white",
            description: "text-white/60",
        },
    };

    const styles = variants[variant] || variants.default;

    /*
    =========================================================
    JSX
    =========================================================
    */

    return (
        <article
            ref={cardRef}
            className={`
                group
                editorial-card-2
                relative
                w-full

                border-t
                md:border-b
                md:border-t-0

                border-gray-700

                py-7

                md:py-9
                lg:py-13

                transition-colors
                duration-500
                ease-out

                
                

                ${className}
            `}
            {...props}
        >
            {/* =====================================================
                SPOTLIGHT
            ===================================================== */}

            <span
                className="
                    editorial-card-2__spotlight
                    absolute
                    inset-0
                    pointer-events-none
                "
            />

            {/* =====================================================
                GLOW DA BORDA
            ===================================================== */}

            <span
                className="
                    editorial-card-2__glow
                    absolute
                    inset-0
                    pointer-events-none
                "
            />

            {/* =====================================================
                LINHA DE DESTAQUE
            ===================================================== */}

            <span
                className="
                    absolute
                    left-0
                    top-[-1px]

                    h-[2px]
                    w-0

                    bg-gradientaa

                    transition-all
                    duration-700
                    ease-out

                    group-hover:w-full
                    group-active:w-full
                "
            />

            {/* =====================================================
                CONTEÚDO
            ===================================================== */}

            <div
                className="
                    relative
                    z-[2]

                    grid

                    grid-cols-[42px_1fr]
                    gap-5

                    md:grid-cols-[80px_1fr]
                    md:gap-10

                    lg:grid-cols-[50px_1fr]
                    lg:gap-6

                    items-start
                    md:pr-6
                    md:pl-6

                    
                "
            >
                {/* =================================================
                    NÚMERO
                ================================================= */}

                <div className="pt-1">
                    <span
                        className={`
                            font-bebas
                            text-xs
                            tracking-[0.2em]

                            md:text-sm

                            opacity-60

                            transition-all
                            duration-500
                            ease-out

                            group-hover:translate-x-1
                            group-hover:opacity-100

                            ${styles.number}
                            ${classNameNumber}
                        `}
                    >
                        {number}
                    </span>
                </div>

                {/* =================================================
                    CONTEÚDO PRINCIPAL
                ================================================= */}

                <div
                    className="
                        flex
                        max-w-3xl
                        flex-col
                        gap-3

                        lg:max-w-4xl

                        transition-transform
                        duration-500
                        ease-out

                        

                        group-hover:translate-x-1
                        group-active:translate-x-1
                    "
                >
                    {/* =============================================
                        TÍTULO
                    ============================================= */}

                    <div
                        className="
                            flex
                            items-start
                            justify-between
                            gap-5
                        "
                    >
                        <h3
                            className={`
                                font-space
                                text-lg
                                font-[600]
                                leading-tight

                                md:text-3xl
                                lg:text-4xl

                                ${styles.title}
                                ${classNameTitle}
                            `}
                        >
                            {title}
                        </h3>

                        {/* =========================================
                            ÍCONE
                        ========================================= */}

                        <ArrowUpRight
                            className="
                                mt-1
                                hidden
                                h-5
                                w-5
                                shrink-0

                                text-steel/30

                                transition-all
                                duration-500
                                ease-out

                                group-hover:-translate-y-1
                                group-hover:translate-x-1
                                group-hover:text-bronze

                                md:hidden
                            "
                        />
                    </div>

                    {/* =============================================
                        DESCRIÇÃO
                    ============================================= */}

                    <p
                        className={`
                            max-w-3xl

                            text-sm
                            leading-6

                            md:text-sm
                            md:leading-7

                            lg:text-[15px]

                            transition-colors
                            duration-500
                            ease-out

                            text-ivory/70
                            group-active:text-ivory/70

                            ${styles.description}
                            ${classNameText}
                        `}
                    >
                        {text}
                    </p>
                </div>
            </div>

            {/* =====================================================
                MICRO INDICADOR
            ===================================================== */}
        </article>
    );
}

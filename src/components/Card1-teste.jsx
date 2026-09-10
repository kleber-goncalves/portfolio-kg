import { useEffect, useRef } from "react";
import "../styles/editorialCard.css";

export default function Card1({ title, text, text_2, variant = "default", className = "", classNameText = "", classNameTitle = "", classNametext2 = "", ...props }) {
    const cardRef = useRef(null);

    useEffect(() => {
        const card = cardRef.current;

        if (!card) return;

        const handleMouseMove = (e) => {
            const rect = card.getBoundingClientRect();

            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const percentX = (x / rect.width) * 100;
            const percentY = (y / rect.height) * 100;

            card.style.setProperty("--mouse-x", `${percentX}%`);
            card.style.setProperty("--mouse-y", `${percentY}%`);
        };

        const handleMouseEnter = () => {
            card.style.setProperty("--spotlight-opacity", "1");
        };

        const handleMouseLeave = () => {
            card.style.setProperty("--spotlight-opacity", "0");
        };

        card.addEventListener("mousemove", handleMouseMove);
        card.addEventListener("mouseenter", handleMouseEnter);
        card.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            card.removeEventListener("mousemove", handleMouseMove);
            card.removeEventListener("mouseenter", handleMouseEnter);
            card.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, []);

    const variants = {
        default: {
            text: "text-bronze",
            title: "text-ivory",
            description: "text-steel",
        },

        v1: {
            text: "text-white",
            title: "text-white",
            description: "text-white/60",
        },

        v2: {
            text: "text-white",
            title: "text-white",
            description: "text-white/60",
        },
    };

    const styles = variants[variant] || variants.default;

    return (
        <article
            ref={cardRef}
            className={`
                group
                editorial-card
                relative
                w-full
                border-t
                md:border-t-0
                md:border-b
                border-graphite
                py-7
                md:py-10
                
                ${className}
            `}
            {...props}
        >
            {/* =========================================
                SPOTLIGHT
            ========================================= */}
            <span
                className="
                    editorial-card__spotlight
                    absolute
                    inset-0
                    pointer-events-none
                "
            />

            {/* =========================================
                BORDA ILUMINADA
            ========================================= */}
            <span
                className="
                    editorial-card__glow
                    absolute
                    inset-0
                    pointer-events-none
                "
            />

            {/* =========================================
                CONTEÚDO
            ========================================= */}
            <div
                className="
                    relative
                    z-[2]
                    flex
                    w-full
                    md:min-h-[260px]
                    flex-col
                    items-start
                    gap-3
                    md:py-6
                    md:pl-6
                "
            >
                {/* CATEGORIA */}
                <p
                    className={`
                        font-bebas
                        text-xs
                        uppercase
                        tracking-[0.2em]
                        md:text-sm
                        md:tracking-[0.25em]
                        transition-colors
                        duration-500
                        ease-out
                        group-hover:text-accent-hover
                        ${styles.text}
                        ${classNameText}
                    `}
                >
                    {text}
                </p>

                {/* TÍTULO */}
                <div
                    className="
                        flex
                        w-full
                        items-center
                        justify-between
                        gap-4
                    "
                >
                    <h3
                        className={`
                            font-space
                            text-xl
                            font-[600]
                            leading-tight
                            md:text-4xl
                            transition-transform
                            duration-500
                            ease-out
                            group-hover:translate-x-1
                            ${styles.title}
                            ${classNameTitle}
                        `}
                    >
                        {title}
                    </h3>
                </div>

                {/* DESCRIÇÃO */}
                <p
                    className={`
                        max-w-3xl
                        text-sm
                        leading-relaxed
                        md:text-sm
                        md:leading-6
                        transition-colors
                        duration-500
                        ease-out
                        group-hover:text-ivory/70
                        ${styles.description}
                        ${classNametext2}
                    `}
                >
                    {text_2}
                </p>
            </div>
        </article>
    );
}

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./../styles/magicCard.css";

const MagicCard = ({ numero, categoria, titulo, descricao }) => {
    const cardRef = useRef(null);
    const glowRef = useRef(null);

    useEffect(() => {
        const card = cardRef.current;
        const glow = glowRef.current;

        if (!card || !glow) return;

        // Desativa no mobile / touch
        const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");

        if (!mediaQuery.matches) return;

        const handleMouseEnter = () => {
            gsap.to(card, {
                y: -3,
                duration: 0.35,
                ease: "power2.out",
            });

            gsap.to(glow, {
                opacity: 1,
                duration: 0.3,
                ease: "power2.out",
            });
        };

        const handleMouseMove = (e) => {
            const rect = card.getBoundingClientRect();

            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // --------------------------------
            // POSIÇÃO DO SPOTLIGHT
            // --------------------------------

            const glowX = (x / rect.width) * 100;
            const glowY = (y / rect.height) * 100;

            card.style.setProperty("--glow-x", `${glowX}%`);

            card.style.setProperty("--glow-y", `${glowY}%`);

            // --------------------------------
            // TILT MUITO SUTIL
            // --------------------------------

            const rotateX = ((y - centerY) / centerY) * -2;

            const rotateY = ((x - centerX) / centerX) * 2;

            gsap.to(card, {
                rotateX,
                rotateY,
                duration: 0.15,
                ease: "power2.out",
                transformPerspective: 500,
            });
        };

        const handleMouseLeave = () => {
            gsap.to(card, {
                y: 0,
                rotateX: 0,
                rotateY: 0,
                duration: 0.45,
                ease: "power2.out",
            });

            gsap.to(glow, {
                opacity: 0,
                duration: 0.4,
                ease: "power2.out",
            });
        };

        card.addEventListener("mouseenter", handleMouseEnter);

        card.addEventListener("mousemove", handleMouseMove);

        card.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            card.removeEventListener("mouseenter", handleMouseEnter);

            card.removeEventListener("mousemove", handleMouseMove);

            card.removeEventListener("mouseleave", handleMouseLeave);

            gsap.killTweensOf(card);
            gsap.killTweensOf(glow);
        };
    }, []);

    return (
        <article ref={cardRef} className="magic-card">
            {/* Spotlight interno */}
            <div ref={glowRef} className="magic-card__spotlight" aria-hidden="true" />

            {/* Glow da borda */}
            <div className="magic-card__border-glow" aria-hidden="true" />

            {/* Conteúdo */}
            <div className="magic-card__content">
                {/* Número */}
                <span className="magic-card__number">{numero}</span>

                <div className="magic-card__body">
                    {/* Categoria */}
                    <span className="magic-card__category">{categoria}</span>

                    {/* Título */}
                    <h3 className="magic-card__title">{titulo}</h3>

                    {/* Descrição */}
                    <p className="magic-card__description">{descricao}</p>
                </div>
            </div>
        </article>
    );
};

export default MagicCard;

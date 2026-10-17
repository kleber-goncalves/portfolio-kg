import { useRef, useEffect } from "react";

const EditorialCard = ({ children, className = "" }) => {
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

            card.style.setProperty("--spotlight-opacity", "1");
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

    return (
        <article ref={cardRef} className={`editorial-card ${className}`}>
            {children}
        </article>
    );
};

export default EditorialCard;

import { useEffect, useRef } from "react";
import "../styles/CursorTrail.css";

const CursorTrail = ({ dotSize = 6, borderSize = 28, speed = 0.18 }) => {
    const dotRef = useRef(null);
    const borderRef = useRef(null);

    const mouse = useRef({
        x: 0,
        y: 0,
    });

    const dot = useRef({
        x: 0,
        y: 0,
    });

    const border = useRef({
        x: 0,
        y: 0,
    });

    const initialized = useRef(false);

    useEffect(() => {
        const dotElement = dotRef.current;
        const borderElement = borderRef.current;

        if (!dotElement || !borderElement) return;

        const handleMouseMove = (event) => {
            mouse.current.x = event.clientX;
            mouse.current.y = event.clientY;

            // Evita o trail nascer no canto da tela
            if (!initialized.current) {
                dot.current.x = event.clientX;
                dot.current.y = event.clientY;

                border.current.x = event.clientX;
                border.current.y = event.clientY;

                initialized.current = true;

                dotElement.style.opacity = "1";
                borderElement.style.opacity = "1";
            }
        };

        const handleMouseLeave = () => {
            dotElement.style.opacity = "0";
            borderElement.style.opacity = "0";
        };

        const handleMouseEnter = () => {
            if (initialized.current) {
                dotElement.style.opacity = "1";
                borderElement.style.opacity = "1";
            }
        };

        const animate = () => {
            // Bolinha acompanha mais rapidamente
            dot.current.x += (mouse.current.x - dot.current.x) * (speed * 1.5);

            dot.current.y += (mouse.current.y - dot.current.y) * (speed * 1.5);

            // Círculo externo acompanha mais lentamente
            border.current.x += (mouse.current.x - border.current.x) * speed;

            border.current.y += (mouse.current.y - border.current.y) * speed;

            dotElement.style.transform = `
                translate3d(
                    ${dot.current.x}px,
                    ${dot.current.y}px,
                    0
                )
                translate(-50%, -50%)
            `;

            borderElement.style.transform = `
                translate3d(
                    ${border.current.x}px,
                    ${border.current.y}px,
                    0
                )
                translate(-50%, -50%)
            `;

            requestAnimationFrame(animate);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseleave", handleMouseLeave);
        document.addEventListener("mouseenter", handleMouseEnter);

        const animationFrame = requestAnimationFrame(animate);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseleave", handleMouseLeave);
            document.removeEventListener("mouseenter", handleMouseEnter);

            cancelAnimationFrame(animationFrame);
        };
    }, [speed]);

    return (
        <>
            <div
                ref={borderRef}
                className="cursor-trail-border"
                style={{
                    width: `${borderSize}px`,
                    height: `${borderSize}px`,
                }}
            />

            <div
                ref={dotRef}
                className="cursor-trail-dot"
                style={{
                    width: `${dotSize}px`,
                    height: `${dotSize}px`,
                }}
            />
        </>
    );
};

export default CursorTrail;

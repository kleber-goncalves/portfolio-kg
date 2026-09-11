import { useEffect, useRef } from "react";
import "../styles/DotField.css";

export default function DotField({ dotRadius = 1, dotSpacing = 18, cursorRadius = 350, bulgeOnly = true, bulgeStrength = 35, glowRadius = 180, sparkle = false, waveAmplitude = 0, gradientFrom = "rgba(168, 120, 82, 0.12)", gradientTo = "rgba(216, 194, 170, 0.06)", glowColor = "#0D0B09" }) {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        const canvas = canvasRef.current;

        if (!container || !canvas) return;

        const ctx = canvas.getContext("2d");

        if (!ctx) return;

        let animationFrame;
        let dots = [];

        let width = 0;
        let height = 0;

        let mouseX = -9999;
        let mouseY = -9999;

        let targetMouseX = -9999;
        let targetMouseY = -9999;

        let time = 0;

        const isTouchDevice = window.matchMedia("(hover: none)").matches || window.matchMedia("(pointer: coarse)").matches;

        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        /*
        |--------------------------------------------------------------------------
        | Resize
        |--------------------------------------------------------------------------
        */

        const resize = () => {
            const rect = container.getBoundingClientRect();

            width = rect.width;
            height = rect.height;

            const dpr = Math.min(window.devicePixelRatio || 1, 2);

            canvas.width = width * dpr;
            canvas.height = height * dpr;

            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            createDots();
        };

        /*
        |--------------------------------------------------------------------------
        | Create dots
        |--------------------------------------------------------------------------
        */

        const createDots = () => {
            dots = [];

            const columns = Math.ceil(width / dotSpacing) + 1;
            const rows = Math.ceil(height / dotSpacing) + 1;

            for (let row = 0; row < rows; row++) {
                for (let column = 0; column < columns; column++) {
                    const x = column * dotSpacing;
                    const y = row * dotSpacing;

                    dots.push({
                        x,
                        y,
                        baseX: x,
                        baseY: y,
                        radius: dotRadius,
                        opacity: 0.45,
                        random: Math.random(),
                    });
                }
            }
        };

        /*
        |--------------------------------------------------------------------------
        | Mouse
        |--------------------------------------------------------------------------
        */

        const handleMouseMove = (event) => {
            const rect = container.getBoundingClientRect();

            targetMouseX = event.clientX - rect.left;
            targetMouseY = event.clientY - rect.top;
        };

        const handleMouseLeave = () => {
            targetMouseX = -9999;
            targetMouseY = -9999;
        };

        /*
        |--------------------------------------------------------------------------
        | Gradient
        |--------------------------------------------------------------------------
        */

        const getGradient = () => {
            const gradient = ctx.createRadialGradient(width * 0.5, height * 0.25, 0, width * 0.5, height * 0.25, Math.max(width, height));

            gradient.addColorStop(0, gradientFrom);
            gradient.addColorStop(1, gradientTo);

            return gradient;
        };

        /*
        |--------------------------------------------------------------------------
        | Draw
        |--------------------------------------------------------------------------
        */

        const draw = () => {
            time += 0.008;

            ctx.clearRect(0, 0, width, height);

            /*
             * Smooth mouse movement.
             */
            if (!reducedMotion && !isTouchDevice) {
                mouseX += (targetMouseX - mouseX) * 0.08;
                mouseY += (targetMouseY - mouseY) * 0.08;
            }

            /*
             * Background gradient.
             */
            ctx.fillStyle = getGradient();
            ctx.fillRect(0, 0, width, height);

            /*
             * Draw dots.
             */
            for (const dot of dots) {
                let x = dot.baseX;
                let y = dot.baseY;

                let radius = dot.radius;
                let opacity = dot.opacity;

                /*
                |--------------------------------------------------------------------------
                | Cursor interaction
                |--------------------------------------------------------------------------
                */

                if (!isTouchDevice && !reducedMotion) {
                    const dx = mouseX - dot.baseX;
                    const dy = mouseY - dot.baseY;

                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < cursorRadius) {
                        const normalized = 1 - distance / cursorRadius;

                        const influence = Math.pow(normalized, 2);

                        /*
                         * Small movement toward the cursor.
                         */
                        if (bulgeOnly || bulgeStrength > 0) {
                            const directionX = distance === 0 ? 0 : dx / distance;

                            const directionY = distance === 0 ? 0 : dy / distance;

                            x += directionX * influence * bulgeStrength;

                            y += directionY * influence * bulgeStrength;
                        }

                        /*
                         * Slightly increase dot size.
                         */
                        radius += influence * 0.8;

                        /*
                         * Increase brightness.
                         */
                        opacity += influence * 0.45;
                    }
                }

                /*
                |--------------------------------------------------------------------------
                | Optional wave
                |--------------------------------------------------------------------------
                */

                if (waveAmplitude > 0 && !reducedMotion) {
                    y += Math.sin(dot.baseX * 0.015 + time) * waveAmplitude;
                }

                /*
                |--------------------------------------------------------------------------
                | Optional sparkle
                |--------------------------------------------------------------------------
                */

                if (sparkle && !reducedMotion) {
                    const sparkleValue = Math.sin(time * 2 + dot.random * Math.PI * 2);

                    opacity += Math.max(0, sparkleValue) * 0.15;
                }

                /*
                |--------------------------------------------------------------------------
                | Dot gradient
                |--------------------------------------------------------------------------
                */

                const gradient = ctx.createRadialGradient(x, y, 0, x, y, Math.max(radius * 5, 8));

                gradient.addColorStop(0, `rgba(216, 194, 170, ${opacity})`);

                gradient.addColorStop(0.5, `rgba(168, 120, 82, ${opacity * 0.65})`);

                gradient.addColorStop(1, "rgba(168, 120, 82, 0)");

                ctx.fillStyle = gradient;

                ctx.beginPath();

                ctx.arc(x, y, radius, 0, Math.PI * 2);

                ctx.fill();
            }

            /*
            |--------------------------------------------------------------------------
            | Cursor glow
            |--------------------------------------------------------------------------
            */

            if (!isTouchDevice && !reducedMotion && mouseX > -1000 && mouseY > -1000) {
                const glow = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, glowRadius);

                glow.addColorStop(0, "rgba(168, 120, 82, 0.035)");

                glow.addColorStop(0.45, "rgba(168, 120, 82, 0.018)");

                glow.addColorStop(1, "rgba(168, 120, 82, 0)");

                ctx.fillStyle = glow;

                ctx.beginPath();

                ctx.arc(mouseX, mouseY, glowRadius, 0, Math.PI * 2);

                ctx.fill();
            }

            animationFrame = requestAnimationFrame(draw);
        };

        /*
        |--------------------------------------------------------------------------
        | Events
        |--------------------------------------------------------------------------
        */

        window.addEventListener("resize", resize, { passive: true });

        window.addEventListener("mousemove", handleMouseMove, { passive: true });

        window.addEventListener("mouseleave", handleMouseLeave, { passive: true });

        resize();

        /*
         * On mobile, we don't need the animation.
         */
        if (!isTouchDevice && !reducedMotion) {
            draw();
        } else {
            ctx.clearRect(0, 0, width, height);

            ctx.fillStyle = getGradient();

            ctx.fillRect(0, 0, width, height);

            for (const dot of dots) {
                ctx.beginPath();

                ctx.fillStyle = "rgba(168, 120, 82, 0.18)";

                ctx.arc(dot.baseX, dot.baseY, dot.radius, 0, Math.PI * 2);

                ctx.fill();
            }
        }

        /*
        |--------------------------------------------------------------------------
        | Cleanup
        |--------------------------------------------------------------------------
        */

        return () => {
            cancelAnimationFrame(animationFrame);

            window.removeEventListener("resize", resize);

            window.removeEventListener("mousemove", handleMouseMove);

            window.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [dotRadius, dotSpacing, cursorRadius, bulgeOnly, bulgeStrength, glowRadius, sparkle, waveAmplitude, gradientFrom, gradientTo, glowColor]);

    return (
        <div ref={containerRef} className="dot-field" aria-hidden="true">
            <canvas ref={canvasRef} className="dot-field__canvas" />
        </div>
    );
}

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

        /* =====================================================
            ESTADO
        ====================================================== */

        let animationFrame = null;

        let dots = [];

        let width = 0;
        let height = 0;

        let mouseX = -9999;
        let mouseY = -9999;

        let targetMouseX = -9999;
        let targetMouseY = -9999;

        let time = 0;

        let isVisible = true;
        let isAnimating = false;

        /*
         * IMPORTANTE:
         * Controla se o mouse está realmente dentro da janela.
         *
         * Quando false:
         * - as moléculas não sofrem influência do mouse
         * - o efeito de "empurrar" as bolinhas desaparece
         * - o cursor glow também desaparece
         */
        let mouseActive = false;

        /* =====================================================
            DISPOSITIVO / MOTION
        ====================================================== */

        const isTouchDevice = window.matchMedia("(hover: none)").matches || window.matchMedia("(pointer: coarse)").matches;

        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        /* =====================================================
            RESET DAS MOLÉCULAS / CURSOR
        ====================================================== */

        const resetCursor = () => {
            /*
             * Desativa completamente a interação.
             */
            mouseActive = false;

            /*
             * Coloca o mouse fora do canvas.
             */
            mouseX = -9999;
            mouseY = -9999;

            targetMouseX = -9999;
            targetMouseY = -9999;
        };

        /* =====================================================
            RESIZE
        ====================================================== */

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

        /* =====================================================
            CREATE DOTS
        ====================================================== */

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

        /* =====================================================
            MOUSE MOVE
        ====================================================== */

        const handleMouseMove = (event) => {
            if (!isVisible) return;

            /*
             * O mouse voltou para dentro da janela.
             */
            mouseActive = true;

            const rect = container.getBoundingClientRect();

            targetMouseX = event.clientX - rect.left;

            targetMouseY = event.clientY - rect.top;
        };

        /* =====================================================
            MOUSE SAI DA JANELA
        ====================================================== */

        const handleWindowMouseLeave = () => {
            /*
             * Aqui acontece o principal reset.
             *
             * As moléculas deixam de receber
             * influência da última posição do mouse.
             */
            resetCursor();
        };

        /* =====================================================
            MOUSE SAI DO DOCUMENT
        ====================================================== */

        const handleDocumentMouseOut = (event) => {
            /*
             * relatedTarget === null significa que o mouse
             * saiu completamente da janela/documento.
             */
            if (event.relatedTarget === null) {
                resetCursor();
            }
        };

        /* =====================================================
            ABA / JANELA PERDE VISIBILIDADE
        ====================================================== */

        const handleVisibilityChange = () => {
            if (document.visibilityState !== "visible") {
                resetCursor();
            }
        };

        /* =====================================================
            GRADIENT
        ====================================================== */

        const getGradient = () => {
            const gradient = ctx.createRadialGradient(width * 0.5, height * 0.25, 0, width * 0.5, height * 0.25, Math.max(width, height));

            gradient.addColorStop(0, gradientFrom);

            gradient.addColorStop(1, gradientTo);

            return gradient;
        };

        /* =====================================================
            DRAW
        ====================================================== */

        const draw = () => {
            /*
             * Hero saiu da viewport.
             */
            if (!isVisible) {
                isAnimating = false;
                animationFrame = null;
                return;
            }

            time += 0.008;

            ctx.clearRect(0, 0, width, height);

            /* =================================================
                SMOOTH MOUSE
            ================================================== */

            if (mouseActive && !reducedMotion && !isTouchDevice) {
                mouseX += (targetMouseX - mouseX) * 0.08;

                mouseY += (targetMouseY - mouseY) * 0.08;
            }

            /* =================================================
                BACKGROUND
            ================================================== */

            ctx.fillStyle = getGradient();

            ctx.fillRect(0, 0, width, height);

            /* =================================================
                DOTS / MOLÉCULAS
            ================================================== */

            for (const dot of dots) {
                /*
                 * Por padrão, a molécula começa exatamente
                 * na posição original.
                 */
                let x = dot.baseX;
                let y = dot.baseY;

                let radius = dot.radius;

                let opacity = dot.opacity;

                /* =============================================
                    INFLUÊNCIA DO MOUSE
                ============================================== */

                /*
                 * ATENÇÃO:
                 *
                 * mouseActive é obrigatório aqui.
                 *
                 * Se o mouse saiu da janela:
                 *
                 * mouseActive = false
                 *
                 * Então este bloco inteiro é ignorado.
                 *
                 * Resultado:
                 * x = baseX
                 * y = baseY
                 *
                 * As bolinhas voltam ao estado normal.
                 */
                if (mouseActive && !isTouchDevice && !reducedMotion) {
                    const dx = mouseX - dot.baseX;

                    const dy = mouseY - dot.baseY;

                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < cursorRadius) {
                        const normalized = 1 - distance / cursorRadius;

                        const influence = Math.pow(normalized, 2);

                        if (bulgeOnly || bulgeStrength > 0) {
                            const directionX = distance === 0 ? 0 : dx / distance;

                            const directionY = distance === 0 ? 0 : dy / distance;

                            x += directionX * influence * bulgeStrength;

                            y += directionY * influence * bulgeStrength;
                        }

                        radius += influence * 0.8;

                        opacity += influence * 0.45;
                    }
                }

                /* =============================================
                    WAVE
                ============================================== */

                if (waveAmplitude > 0 && !reducedMotion) {
                    y += Math.sin(dot.baseX * 0.015 + time) * waveAmplitude;
                }

                /* =============================================
                    SPARKLE
                ============================================== */

                if (sparkle && !reducedMotion) {
                    const sparkleValue = Math.sin(time * 2 + dot.random * Math.PI * 2);

                    opacity += Math.max(0, sparkleValue) * 0.15;
                }

                /* =============================================
                    DOT GRADIENT
                ============================================== */

                const gradient = ctx.createRadialGradient(x, y, 0, x, y, Math.max(radius * 5, 8));

                gradient.addColorStop(0, `rgba(216, 194, 170, ${opacity})`);

                gradient.addColorStop(0.5, `rgba(168, 120, 82, ${opacity * 0.65})`);

                gradient.addColorStop(1, "rgba(168, 120, 82, 0)");

                ctx.fillStyle = gradient;

                ctx.beginPath();

                ctx.arc(x, y, radius, 0, Math.PI * 2);

                ctx.fill();
            }

            /* =================================================
                CURSOR GLOW
            ================================================== */

            /*
             * O glow também depende de mouseActive.
             *
             * Portanto, quando o mouse sai da janela,
             * ele desaparece junto com a influência
             * das moléculas.
             */
            if (mouseActive && !isTouchDevice && !reducedMotion && mouseX > -1000 && mouseY > -1000) {
                const glow = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, glowRadius);

                glow.addColorStop(0, "rgba(168, 120, 82, 0.035)");

                glow.addColorStop(0.45, "rgba(168, 120, 82, 0.018)");

                glow.addColorStop(1, "rgba(168, 120, 82, 0)");

                ctx.fillStyle = glow;

                ctx.beginPath();

                ctx.arc(mouseX, mouseY, glowRadius, 0, Math.PI * 2);

                ctx.fill();
            }

            /* =================================================
                PRÓXIMO FRAME
            ================================================== */

            animationFrame = requestAnimationFrame(draw);
        };

        /* =====================================================
            START
        ====================================================== */

        const startAnimation = () => {
            if (isAnimating || isTouchDevice || reducedMotion || !isVisible) {
                return;
            }

            isAnimating = true;

            animationFrame = requestAnimationFrame(draw);
        };

        /* =====================================================
            STOP
        ====================================================== */

        const stopAnimation = () => {
            isAnimating = false;

            if (animationFrame !== null) {
                cancelAnimationFrame(animationFrame);

                animationFrame = null;
            }
        };

        /* =====================================================
            INTERSECTION OBSERVER
        ====================================================== */

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];

                isVisible = entry.isIntersecting;

                if (isVisible) {
                    startAnimation();
                } else {
                    /*
                     * Hero saiu da tela.
                     *
                     * Resetamos também as moléculas.
                     */
                    resetCursor();

                    stopAnimation();
                }
            },
            {
                threshold: 0,
            },
        );

        /* =====================================================
            EVENTS
        ====================================================== */

        window.addEventListener("resize", resize, { passive: true });

        window.addEventListener("mousemove", handleMouseMove, { passive: true });

        window.addEventListener("mouseleave", handleWindowMouseLeave, { passive: true });

        /*
         * Evento adicional para garantir que o navegador
         * realmente detectou a saída do documento.
         */
        document.addEventListener("mouseout", handleDocumentMouseOut, { passive: true });

        document.addEventListener("visibilitychange", handleVisibilityChange);

        /* =====================================================
            INITIALIZE
        ====================================================== */

        resize();

        observer.observe(container);

        /* =====================================================
            MOBILE / REDUCED MOTION
        ====================================================== */

        if (isTouchDevice || reducedMotion) {
            ctx.clearRect(0, 0, width, height);

            ctx.fillStyle = getGradient();

            ctx.fillRect(0, 0, width, height);

            for (const dot of dots) {
                ctx.beginPath();

                ctx.fillStyle = "rgba(168, 120, 82, 0.18)";

                ctx.arc(dot.baseX, dot.baseY, dot.radius, 0, Math.PI * 2);

                ctx.fill();
            }
        } else {
            startAnimation();
        }

        /* =====================================================
            CLEANUP
        ====================================================== */

        return () => {
            stopAnimation();

            observer.disconnect();

            window.removeEventListener("resize", resize);

            window.removeEventListener("mousemove", handleMouseMove);

            window.removeEventListener("mouseleave", handleWindowMouseLeave);

            document.removeEventListener("mouseout", handleDocumentMouseOut);

            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [dotRadius, dotSpacing, cursorRadius, bulgeOnly, bulgeStrength, glowRadius, sparkle, waveAmplitude, gradientFrom, gradientTo, glowColor]);

    return (
        <div ref={containerRef} className="dot-field" aria-hidden="true">
            <canvas ref={canvasRef} className="dot-field__canvas" />
        </div>
    );
}

import { useEffect, useRef } from "react";

export default function DotField({ dotRadius = 1, dotSpacing = 18, cursorRadius = 350, bulgeOnly = true, bulgeStrength = 35, glowRadius = 180, sparkle = false, waveAmplitude = 0, gradientFrom = "#F2F0EC", gradientTo = "#8B8B8B", glowColor = "#0D0B09", frozen = false }) {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);

    /*
    |--------------------------------------------------------------------------
    | Estado do freeze
    |--------------------------------------------------------------------------
    */

    const frozenRef = useRef(frozen);

    useEffect(() => {
        frozenRef.current = frozen;

        console.log("❄️ DOTFIELD FROZEN MUDOU:", frozen);
    }, [frozen]);

    /*
    |--------------------------------------------------------------------------
    | Canvas
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;

        if (!canvas || !container) return;

        const ctx = canvas.getContext("2d");

        if (!ctx) return;

        /*
        |--------------------------------------------------------------------------
        | Dimensões
        |--------------------------------------------------------------------------
        */

        let width = 0;
        let height = 0;

        /*
        |--------------------------------------------------------------------------
        | Animação
        |--------------------------------------------------------------------------
        */

        let animationFrame = null;

        /*
        |--------------------------------------------------------------------------
        | Mouse
        |--------------------------------------------------------------------------
        */

        let mouseX = -9999;
        let mouseY = -9999;

        let targetMouseX = -9999;
        let targetMouseY = -9999;

        let mouseActive = false;

        /*
        |--------------------------------------------------------------------------
        | Freeze
        |--------------------------------------------------------------------------
        */

        let previousFrozen = frozenRef.current;

        /*
        |--------------------------------------------------------------------------
        | Visibility
        |--------------------------------------------------------------------------
        */

        let isVisible = true;

        /*
        |--------------------------------------------------------------------------
        | Device
        |--------------------------------------------------------------------------
        */

        const isTouchDevice = window.matchMedia("(hover: none)").matches || window.matchMedia("(pointer: coarse)").matches;

        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        /*
        |--------------------------------------------------------------------------
        | Resize
        |--------------------------------------------------------------------------
        */

        const resizeCanvas = () => {
            const rect = container.getBoundingClientRect();

            width = rect.width;
            height = rect.height;

            const dpr = Math.min(window.devicePixelRatio || 1, 2);

            canvas.width = width * dpr;
            canvas.height = height * dpr;

            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            console.log("📐 DOTFIELD RESIZE:", {
                width: Math.round(width),
                height: Math.round(height),
            });
        };

        resizeCanvas();

        window.addEventListener("resize", resizeCanvas);

        /*
        |--------------------------------------------------------------------------
        | Mouse Move
        |--------------------------------------------------------------------------
        */

        const handleMouseMove = (event) => {
            if (!isVisible) return;

            const rect = container.getBoundingClientRect();

            const nextX = event.clientX - rect.left;

            const nextY = event.clientY - rect.top;

            console.log("🖱️ DOTFIELD MOUSEMOVE:", {
                mouseX: Math.round(nextX),
                mouseY: Math.round(nextY),
                frozen: frozenRef.current,
                mouseActive,
            });

            /*
            |--------------------------------------------------------------------------
            | Se congelado, ignora o mouse
            |--------------------------------------------------------------------------
            */

            if (frozenRef.current) {
                return;
            }

            mouseActive = true;

            targetMouseX = nextX;
            targetMouseY = nextY;
        };

        /*
        |--------------------------------------------------------------------------
        | Reset do cursor
        |--------------------------------------------------------------------------
        */

        const resetCursor = () => {
            if (frozenRef.current) {
                return;
            }

            mouseActive = false;

            targetMouseX = -9999;
            targetMouseY = -9999;
        };

        /*
        |--------------------------------------------------------------------------
        | Mouse saiu da janela
        |--------------------------------------------------------------------------
        */

        const handleWindowMouseLeave = () => {
            if (frozenRef.current) {
                return;
            }

            resetCursor();
        };

        /*
        |--------------------------------------------------------------------------
        | Mouse saiu do documento
        |--------------------------------------------------------------------------
        */

        const handleDocumentMouseOut = (event) => {
            if (frozenRef.current) {
                return;
            }

            if (!event.relatedTarget) {
                resetCursor();
            }
        };

        /*
        |--------------------------------------------------------------------------
        | Visibility
        |--------------------------------------------------------------------------
        */

        const handleVisibilityChange = () => {
            if (document.hidden) {
                isVisible = false;

                mouseActive = false;

                targetMouseX = -9999;
                targetMouseY = -9999;
            } else {
                isVisible = true;
            }
        };

        /*
        |--------------------------------------------------------------------------
        | Eventos
        |--------------------------------------------------------------------------
        */

        if (!isTouchDevice) {
            window.addEventListener("mousemove", handleMouseMove);

            window.addEventListener("mouseleave", handleWindowMouseLeave);

            document.addEventListener("mouseout", handleDocumentMouseOut);
        }

        document.addEventListener("visibilitychange", handleVisibilityChange);

        /*
        |--------------------------------------------------------------------------
        | Intersection Observer
        |--------------------------------------------------------------------------
        */

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];

                isVisible = entry.isIntersecting;

                console.log("👁️ DOTFIELD VISIBLE:", isVisible);
            },
            {
                threshold: 0,
            },
        );

        observer.observe(container);

        /*
        |--------------------------------------------------------------------------
        | Gradiente dos pontos
        |--------------------------------------------------------------------------
        */

        let gradient;

        const createGradient = () => {
            gradient = ctx.createLinearGradient(0, 0, width, height);

            gradient.addColorStop(0, gradientFrom);

            gradient.addColorStop(1, gradientTo);
        };

        createGradient();

        /*
        |--------------------------------------------------------------------------
        | DRAW
        |--------------------------------------------------------------------------
        */

        const draw = (time = 0) => {
            const currentlyFrozen = frozenRef.current;

            /*
            |--------------------------------------------------------------------------
            | Entrou no freeze
            |--------------------------------------------------------------------------
            */

            if (currentlyFrozen && !previousFrozen) {
                console.log("🔄 DOTFIELD: ENTROU NO FREEZE");

                /*
                |--------------------------------------------------------------------------
                | Remove a posição do mouse.
                |
                | NÃO colocamos mouseX diretamente em -9999.
                |
                | O target vai para fora e mouseX acompanha
                | suavemente.
                |--------------------------------------------------------------------------
                */

                targetMouseX = -9999;
                targetMouseY = -9999;

                /*
                | Mantemos mouseActive durante o retorno
                | para que o efeito desapareça suavemente.
                */

                mouseActive = true;

                console.log("🎯 RESET DO TARGET:", {
                    targetMouseX,
                    targetMouseY,
                });
            }

            /*
            |--------------------------------------------------------------------------
            | Saiu do freeze
            |--------------------------------------------------------------------------
            */

            if (!currentlyFrozen && previousFrozen) {
                console.log("▶️ DOTFIELD: SAIU DO FREEZE");

                /*
                | O próximo mousemove assume o controle.
                */

                mouseActive = false;

                mouseX = -9999;
                mouseY = -9999;

                targetMouseX = -9999;
                targetMouseY = -9999;
            }

            previousFrozen = currentlyFrozen;

            /*
            |--------------------------------------------------------------------------
            | Limpa canvas
            |--------------------------------------------------------------------------
            */

            ctx.clearRect(0, 0, width, height);

            /*
            |--------------------------------------------------------------------------
            | Cria gradiente
            |--------------------------------------------------------------------------
            */

            createGradient();

            /*
            |--------------------------------------------------------------------------
            | Movimento do mouse
            |--------------------------------------------------------------------------
            */

            if (!reducedMotion && !isTouchDevice) {
                mouseX += (targetMouseX - mouseX) * 0.08;

                mouseY += (targetMouseY - mouseY) * 0.08;
            }

            /*
            |--------------------------------------------------------------------------
            | Pontos
            |--------------------------------------------------------------------------
            */

            const columns = Math.ceil(width / dotSpacing) + 1;

            const rows = Math.ceil(height / dotSpacing) + 1;

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < columns; col++) {
                    /*
                    |--------------------------------------------------------------------------
                    | Posição base
                    |--------------------------------------------------------------------------
                    */

                    const baseX = col * dotSpacing;

                    const baseY = row * dotSpacing;

                    let x = baseX;
                    let y = baseY;

                    /*
                    |--------------------------------------------------------------------------
                    | Distância do mouse
                    |--------------------------------------------------------------------------
                    */

                    const dx = baseX - mouseX;

                    const dy = baseY - mouseY;

                    const distance = Math.sqrt(dx * dx + dy * dy);

                    /*
                    |--------------------------------------------------------------------------
                    | Influência
                    |--------------------------------------------------------------------------
                    */

                    let influence = 0;

                    if (mouseActive && distance < cursorRadius && !isTouchDevice) {
                        influence = 1 - distance / cursorRadius;

                        influence = influence * influence;
                    }

                    /*
                    |--------------------------------------------------------------------------
                    | Bulge
                    |--------------------------------------------------------------------------
                    */

                    if (influence > 0) {
                        const angle = Math.atan2(dy, dx);

                        if (bulgeOnly) {
                            x += Math.cos(angle) * influence * bulgeStrength;

                            y += Math.sin(angle) * influence * bulgeStrength;
                        } else {
                            x += (dx / (distance || 1)) * influence * bulgeStrength;

                            y += (dy / (distance || 1)) * influence * bulgeStrength;
                        }
                    }

                    /*
                    |--------------------------------------------------------------------------
                    | Wave
                    |--------------------------------------------------------------------------
                    */

                    if (waveAmplitude !== 0 && !reducedMotion && !currentlyFrozen) {
                        y += Math.sin(time * 0.001 + col * 0.3 + row * 0.2) * waveAmplitude;
                    }

                    /*
                    |--------------------------------------------------------------------------
                    | Radius
                    |--------------------------------------------------------------------------
                    */

                    let radius = dotRadius;

                    radius += influence * 0.8;

                    /*
                    |--------------------------------------------------------------------------
                    | Glow
                    |--------------------------------------------------------------------------
                    */

                    if (glowRadius > 0 && influence > 0) {
                        const glowInfluence = Math.max(0, 1 - distance / glowRadius);

                        radius += glowInfluence * 0.5;
                    }

                    /*
                    |--------------------------------------------------------------------------
                    | Opacidade
                    |--------------------------------------------------------------------------
                    */

                    let alpha = 0.55;

                    alpha += influence * 0.35;

                    /*
                    |--------------------------------------------------------------------------
                    | Sparkle
                    |--------------------------------------------------------------------------
                    */

                    if (sparkle && !currentlyFrozen) {
                        const sparkleValue = Math.sin(time * 0.002 + col * 1.7 + row * 2.1);

                        alpha += Math.max(0, sparkleValue) * 0.2;
                    }

                    /*
                    |--------------------------------------------------------------------------
                    | Cor dos pontos
                    |--------------------------------------------------------------------------
                    */

                    ctx.fillStyle = gradient;

                    /*
                    |--------------------------------------------------------------------------
                    | Glow
                    |--------------------------------------------------------------------------
                    */

                    if (influence > 0) {
                        ctx.shadowBlur = influence * 8;

                        ctx.shadowColor = glowColor;
                    } else {
                        ctx.shadowBlur = 0;
                    }

                    /*
                    |--------------------------------------------------------------------------
                    | Opacidade
                    |--------------------------------------------------------------------------
                    */

                    ctx.globalAlpha = Math.min(1, alpha);

                    /*
                    |--------------------------------------------------------------------------
                    | Desenha
                    |--------------------------------------------------------------------------
                    */

                    ctx.beginPath();

                    ctx.arc(x, y, radius, 0, Math.PI * 2);

                    ctx.fill();

                    ctx.shadowBlur = 0;
                }
            }

            ctx.globalAlpha = 1;

            /*
            |--------------------------------------------------------------------------
            | Debug
            |--------------------------------------------------------------------------
            */

            if (currentlyFrozen) {
                const now = performance.now();

                if (!draw.lastFreezeLog || now - draw.lastFreezeLog > 700) {
                    console.log("🧊 DOTFIELD CONGELADO:", {
                        mouseX: Math.round(mouseX),

                        mouseY: Math.round(mouseY),

                        targetMouseX: Math.round(targetMouseX),

                        targetMouseY: Math.round(targetMouseY),

                        mouseActive,
                    });

                    draw.lastFreezeLog = now;
                }
            }

            /*
            |--------------------------------------------------------------------------
            | Próximo frame
            |--------------------------------------------------------------------------
            */

            animationFrame = requestAnimationFrame(draw);
        };

        /*
        |--------------------------------------------------------------------------
        | Inicia
        |--------------------------------------------------------------------------
        */

        draw();

        /*
        |--------------------------------------------------------------------------
        | Cleanup
        |--------------------------------------------------------------------------
        */

        return () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }

            window.removeEventListener("resize", resizeCanvas);

            if (!isTouchDevice) {
                window.removeEventListener("mousemove", handleMouseMove);

                window.removeEventListener("mouseleave", handleWindowMouseLeave);

                document.removeEventListener("mouseout", handleDocumentMouseOut);
            }

            document.removeEventListener("visibilitychange", handleVisibilityChange);

            observer.disconnect();
        };
    }, [dotRadius, dotSpacing, cursorRadius, bulgeOnly, bulgeStrength, glowRadius, sparkle, waveAmplitude, gradientFrom, gradientTo, glowColor]);

    /*
    |--------------------------------------------------------------------------
    | JSX
    |--------------------------------------------------------------------------
    */

    return (
        <div ref={containerRef} className="absolute inset-0 pointer-events-none">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        </div>
    );
}

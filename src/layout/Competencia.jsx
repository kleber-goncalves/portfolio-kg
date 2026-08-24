import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function Competencia() {
    const sectionRef = useRef(null);
    const pathRef = useRef(null);
    const dotRef = useRef(null);

    useLayoutEffect(() => {
        const section = sectionRef.current;
        const path = pathRef.current;
        const dot = dotRef.current;

        if (!section || !path || !dot) return;

        const ctx = gsap.context(() => {
            // =========================================================
            // TAMANHO TOTAL DA CURVA
            // =========================================================

            const pathLength = path.getTotalLength();

            // =========================================================
            // ESTADO INICIAL
            // =========================================================

            gsap.set(path, {
                strokeDasharray: pathLength,
                strokeDashoffset: pathLength,
            });

            // Bolinha começa exatamente no início da curva
            const startPoint = path.getPointAtLength(0);

            gsap.set(dot, {
                attr: {
                    cx: startPoint.x,
                    cy: startPoint.y,
                },
            });

            // =========================================================
            // OBJETO DE PROGRESSO
            // =========================================================

            const progress = {
                value: 0,
            };

            // =========================================================
            // ANIMAÇÃO COM SCROLL
            // =========================================================

            gsap.to(progress, {
                value: 1,

                ease: "none",

                scrollTrigger: {
                    trigger: section,

                    start: "top 700px",
                    end: "bottom bottom",

                    scrub: 1,

                    invalidateOnRefresh: true,
                },

                onUpdate: () => {
                    const currentProgress = progress.value;

                    // =====================================================
                    // DESENHA A LINHA
                    // =====================================================

                    gsap.set(path, {
                        strokeDashoffset:
                            pathLength - pathLength * currentProgress,
                    });

                    // =====================================================
                    // MOVE A BOLINHA PELA CURVA
                    // =====================================================

                    const point = path.getPointAtLength(
                        pathLength * currentProgress,
                    );

                    gsap.set(dot, {
                        attr: {
                            cx: point.x,
                            cy: point.y,
                        },
                    });
                },
            });
        }, section);

        return () => {
            ctx.revert();
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative w-full min-h-[250vh] bg-obsidian"
        >
            {/* =========================================================
                ÁREA FIXA DURANTE O SCROLL
            ========================================================= */}

            <div className="sticky top-0 h-screen w-full overflow-hidden">
                <div className="relative mx-auto h-full w-full max-w-[1400px]">
                    {/* =====================================================
                        TÍTULO
                    ===================================================== */}

                    <div className="absolute left-6 top-8 z-20 flex w-[calc(100%-3rem)] items-center gap-3 md:left-12 md:top-12 md:w-[calc(100%-6rem)]">
                        <h2 className="text-sm uppercase text-steel md:text-7xl">
                            // Competências
                        </h2>

                        <span className="h-0.5 flex-1 bg-gradientaa md:h-1" />
                    </div>

                    {/* =====================================================
                        SVG
                    ===================================================== */}

                    <div className="absolute inset-0 flex items-center justify-center">
                        <svg
                            viewBox="0 0 382 876"
                            className="h-[92vh] w-auto max-w-[90vw] overflow-visible"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            preserveAspectRatio="xMidYMid meet"
                        >
                            {/* =================================================
                                CAMINHO DA LINHA
                            ================================================= */}

                            <path
                                ref={pathRef}
                                d="
                                    M 373.00,7.50
                                    359.50,33.50
                                    349.50,40.50
                                    336.50,44.50
                                    186.50,42.50
                                    137.00,52.00
                                    113.50,63.00
                                    94.00,77.00
                                    70.50,104.50
                                    61.50,126.00
                                    60.00,143.50
                                    64.00,164.00
                                    71.00,177.50
                                    85.00,190.50
                                    105.00,199.00
                                    266.00,240.00
                                    306.50,261.00
                                    316.50,272.00
                                    320.50,283.00
                                    319.50,303.50
                                    313.00,319.00
                                    301.00,333.50
                                    288.50,341.00
                                    230.00,352.00
                                    119.00,353.00
                                    67.00,359.50
                                    46.50,367.50
                                    34.50,376.00
                                    18.50,393.50
                                    8.50,415.50
                                    8.00,437.00
                                    12.50,453.50
                                    23.50,472.50
                                    44.00,490.50
                                    83.00,506.50
                                    155.00,518.50
                                    202.00,532.50
                                    241.50,557.00
                                    261.50,581.50
                                    267.50,603.50
                                    264.50,635.00
                                    254.00,657.50
                                    235.00,676.50
                                    204.00,688.00
                                    125.50,694.50
                                    79.50,705.50
                                    46.00,723.50
                                    34.00,737.50
                                    28.00,752.50
                                    27.00,779.00
                                    32.00,797.50
                                    47.50,821.00
                                    70.00,840.00
                                    108.50,854.50
                                    203.50,867.50
                                "
                                fill="none"
                                stroke="#C49A78"
                                strokeWidth="16"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />

                            {/* =================================================
                                BOLINHA
                            ================================================= */}

                            <circle ref={dotRef} r="9" fill="#C49A78" />
                        </svg>
                    </div>

                    {/* =====================================================
                        CONTEÚDO
                    ===================================================== */}

                    <div className="absolute inset-0 z-10 flex items-center justify-center">
                        <div className="w-full max-w-md px-8">
                            <div className="rounded-2xl border border-white/10 bg-obsidian/80 p-6 backdrop-blur-sm">
                                <span className="text-sm text-bronze">ARQ</span>

                                <h2 className="mt-2 text-2xl font-semibold text-steel md:text-4xl">
                                    Arquitetura de Software
                                </h2>

                                <p className="mt-4 text-sm leading-6 text-steel/70">
                                    Clean Architecture no .NET — separação de
                                    responsabilidades, injeção de dependência e
                                    tomada de decisão com raciocínio de
                                    trade-off real.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Competencia;

import { useEffect, useRef } from "react";

function SobreHero() {
    const sectionRef = useRef(null);
    const gridRef = useRef(null);
    const textRef = useRef(null);
    const portraitRef = useRef(null);

    useEffect(() => {
        // Ative o diagnóstico adicionando ?debugSticky=1 à URL da página.
        if (new URLSearchParams(window.location.search).get("debugSticky") !== "1") {
            return undefined;
        }

        const section = sectionRef.current;
        const grid = gridRef.current;
        const text = textRef.current;
        const portrait = portraitRef.current;

        if (!section || !grid || !text || !portrait) {
            console.warn("[SobreHero sticky] Elementos não encontrados.", {
                sectionFound: Boolean(section),
                gridFound: Boolean(grid),
                textFound: Boolean(text),
                portraitFound: Boolean(portrait),
            });
            return undefined;
        }

        const desktopBreakpoint = window.matchMedia(
            "(width >= 48rem) and (height > 600px) and (hover: hover) and (pointer: fine)",
        );

        const rectOf = (element) => {
            const rect = element.getBoundingClientRect();

            return {
                top: Math.round(rect.top),
                bottom: Math.round(rect.bottom),
                height: Math.round(rect.height),
                left: Math.round(rect.left),
                right: Math.round(rect.right),
                width: Math.round(rect.width),
            };
        };

        const elementName = (element) => {
            const id = element.id ? `#${element.id}` : "";
            const className = typeof element.className === "string"
                ? element.className.trim().replace(/\s+/g, " ").slice(0, 100)
                : "";

            return `${element.tagName.toLowerCase()}${id}${className ? `.${className.replace(/ /g, ".")}` : ""}`;
        };

        const getAncestorStyles = () => {
            const ancestors = [];

            for (let element = text; element; element = element.parentElement) {
                const styles = window.getComputedStyle(element);

                ancestors.push({
                    element: elementName(element),
                    overflowX: styles.overflowX,
                    overflowY: styles.overflowY,
                    position: styles.position,
                    transform: styles.transform,
                    contain: styles.contain,
                    height: styles.height,
                    clientHeight: element.clientHeight,
                    scrollHeight: element.scrollHeight,
                });
            }

            return ancestors;
        };

        const getMetrics = () => {
            const textStyles = window.getComputedStyle(text);
            const gridStyles = window.getComputedStyle(grid);
            const sectionStyles = window.getComputedStyle(section);
            const textRect = rectOf(text);
            const portraitRect = rectOf(portrait);
            const stickyTop = Number.parseFloat(textStyles.top);
            const gapToStickyTop = Number.isFinite(stickyTop)
                ? textRect.top - stickyTop
                : null;
            const gapToPortraitBottom = portraitRect.bottom - textRect.bottom;

            let state = "antes-do-topo-sticky";

            if (!desktopBreakpoint.matches) {
                state = "breakpoint-b-md-inativo";
            } else if (textStyles.position !== "sticky") {
                state = "position-sticky-nao-aplicado";
            } else if (gapToPortraitBottom <= 2) {
                state = "limite-inferior-do-retrato";
            } else if (Number.isFinite(gapToStickyTop) && Math.abs(gapToStickyTop) <= 3) {
                state = "texto-preso-no-topo";
            } else if (Number.isFinite(gapToStickyTop) && gapToStickyTop > 3) {
                state = "texto-ainda-antes-do-topo";
            } else {
                state = "texto-passou-do-topo-sem-ficar-preso";
            }

            return {
                state,
                scrollY: Math.round(window.scrollY),
                viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight,
                    desktopBreakpointMatches: desktopBreakpoint.matches,
                },
                styles: {
                    textPosition: textStyles.position,
                    textTop: textStyles.top,
                    textAlignSelf: textStyles.alignSelf,
                    gridDisplay: gridStyles.display,
                    gridTemplateColumns: gridStyles.gridTemplateColumns,
                    gridAlignItems: gridStyles.alignItems,
                    sectionOverflowX: sectionStyles.overflowX,
                    sectionOverflowY: sectionStyles.overflowY,
                },
                geometry: {
                    section: rectOf(section),
                    grid: rectOf(grid),
                    text: textRect,
                    portrait: portraitRect,
                    gapToStickyTop: Number.isFinite(gapToStickyTop)
                        ? Math.round(gapToStickyTop)
                        : null,
                    gapToPortraitBottom: Math.round(gapToPortraitBottom),
                },
            };
        };

        const ancestors = getAncestorStyles();
        const scrollContainerCandidates = ancestors.filter(({ overflowX, overflowY }) => {
            const canCreateScrollContainer = (value) => !["visible", "clip"].includes(value);

            return canCreateScrollContainer(overflowX) || canCreateScrollContainer(overflowY);
        });

        const formatMetrics = (metrics) => {
            const { geometry, styles } = metrics;

            return [
                `y=${metrics.scrollY}`,
                `state=${metrics.state}`,
                `textTop=${geometry.text.top}`,
                `stickyTop=${styles.textTop}`,
                `gapToStickyTop=${geometry.gapToStickyTop}`,
                `portraitBottom=${geometry.portrait.bottom}`,
                `textBottom=${geometry.text.bottom}`,
                `gapToPortraitBottom=${geometry.gapToPortraitBottom}`,
            ].join(" | ");
        };

        console.info("[SobreHero sticky] Diagnóstico ativo:", {
            pathname: window.location.pathname,
            search: window.location.search,
            readyState: document.readyState,
        });
        console.log("[SobreHero sticky] Inicial:", formatMetrics(getMetrics()), getMetrics());
        console.table(ancestors);
        console.log(
            "[SobreHero sticky] Ancestrais que podem criar contêiner de rolagem:",
            scrollContainerCandidates,
        );

        let animationFrame = 0;
        let lastLoggedMetrics = getMetrics();

        const logMetrics = (label, metrics) => {
            console.log(`[SobreHero sticky] ${label}: ${formatMetrics(metrics)}`, metrics);
        };

        const handleScroll = () => {
            if (animationFrame) return;

            animationFrame = window.requestAnimationFrame(() => {
                animationFrame = 0;

                const metrics = getMetrics();
                const stateChanged = metrics.state !== lastLoggedMetrics.state;
                const scrollDistance = Math.abs(metrics.scrollY - lastLoggedMetrics.scrollY);

                // Uma amostra a cada 80 px, além de toda mudança de estado.
                if (stateChanged || scrollDistance >= 80) {
                    logMetrics("Rolagem", metrics);
                    lastLoggedMetrics = metrics;
                }
            });
        };

        const handleResize = () => {
            const metrics = getMetrics();
            logMetrics("Redimensionamento", metrics);
            lastLoggedMetrics = metrics;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", handleResize);
        desktopBreakpoint.addEventListener("change", handleResize);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleResize);
            desktopBreakpoint.removeEventListener("change", handleResize);

            if (animationFrame) {
                window.cancelAnimationFrame(animationFrame);
            }
        };
    }, []);

    return (
        <section ref={sectionRef} aria-labelledby="sobre-hero-title" className="relative isolate overflow-x-clip border-b border-graphite/80">
            <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 hidden w-[38%] b-md:block" />

            <div
                ref={gridRef}
                className="
                    relative
                    mx-auto
                    grid
                    w-full
                    b-md:max-w-[1500px]
                    grid-cols-1

                    gap-12
                    px-5
                    py-12

                    b-md:grid-cols-[minmax(0,1.08fr)_minmax(280px,0.92fr)]
                    b-md:gap-12
                    b-md:px-10
                    b-md:py-16

                    c-lg:gap-16
                    c-lg:py-20
                "
            >
                <div ref={textRef} className="relative z-10 max-w-2xl b-md:sticky b-md:top-24 b-md:self-start">
                    <h1
                        id="sobre-hero-title"
                        className="
                            max-w-[11ch]
                            font-space
                            text-5xl
                            font-medium
                            leading-[0.94]
                            tracking-[-0.06em]
                            text-ivory

                            b-md:text-6xl
                            c-lg:text-7xl
                            d-xl:text-8xl
                        "
                    >
                        Da interface
                        <br />
                        ao <span className="text-bronze">sistema.</span>
                    </h1>

                    <p className="mt-6 max-w-xl text-sm leading-7 text-steel b-md:text-base b-md:leading-8">Desenvolvo aplicações web pensando não só na interface, mas também em como APIs, dados, desempenho e organização do código se conectam.</p>
                </div>

                <div ref={portraitRef} className="relative mx-auto w-full max-w-[350px] pb-5 b-md:max-w-[720px] b-md:pb-0 b-md:justify-self-end">
                    <div className="relative aspect-[4/5] w-full overflow-hidden border border-graphite bg-carbon">
                        <img src="/euNvEnvt.png" alt="Retrato de Kleber Gonçalves" loading="eager" fetchPriority="high" decoding="async" className="absolute inset-0 h-full w-full object-cover object-top" />

                        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[24%] bg-gradient-to-t from-obsidian/70 to-transparent" />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default SobreHero;

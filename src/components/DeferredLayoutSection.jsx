import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const PREFETCH_MARGIN = "1200px 0px";

const SECTION_CONFIG = {
    competencia: {
        id: "competencias",
        title: "// COMPETÊNCIAS",
        minHeight: "min-h-[1300px] b-md:min-h-[1000px]",
        Component: lazy(() => import("../layout/Competencia")),
    },
    diferenciais: {
        id: "diferenciais",
        title: "// DIFERENCIAIS",
        minHeight: "min-h-[1000px] b-md:min-h-[850px]",
        Component: lazy(() => import("../layout/DiferenciaisTeste")),
    },
    formacao: {
        id: "formacao",
        title: "// FORMAÇÃO",
        minHeight: "min-h-[1800px] b-md:min-h-[1500px]",
        Component: lazy(() => import("../layout/Formacao")),
    },
    footer: {
        id: "footer",
        title: "// FIM",
        minHeight: "min-h-[520px] b-md:min-h-[560px]",
        Component: lazy(() => import("../layout/Footer")),
    },
};

function SectionPlaceholder({ title }) {
    return (
        <div aria-hidden="true" className="w-full">
            <div className="flex w-full flex-row items-center gap-2 p-5 pt-12 b-md:p-10">
                <h2 className="whitespace-nowrap text-sm uppercase text-steel b-md:text-7xl">
                    {title}
                </h2>
                <span className="h-0.5 flex-1 bg-gradientaa b-md:h-1" />
            </div>

            <div className="px-5 pt-10 b-md:px-10 b-md:pt-8">
                <div className="h-32 w-full animate-pulse rounded-2xl bg-neutral-900/50 b-md:h-48" />
            </div>
        </div>
    );
}

// Este componente só confirma prontidão depois que a seção lazy realmente montou.
function LoadedSection({ Component, onReady, ...props }) {
    useLayoutEffect(() => {
        let firstFrame = 0;
        let secondFrame = 0;

        firstFrame = window.requestAnimationFrame(() => {
            secondFrame = window.requestAnimationFrame(() => {
                // Recalcula ScrollTriggers depois que a seção alterou a altura do documento.
                ScrollTrigger.refresh(true);
                onReady?.();
            });
        });

        return () => {
            window.cancelAnimationFrame(firstFrame);
            window.cancelAnimationFrame(secondFrame);
        };
    }, [onReady]);

    return <Component {...props} />;
}

function DeferredLayoutSection({ section, experienceMode = "full" }) {
    const containerRef = useRef(null);
    const config = SECTION_CONFIG[section];
    const [shouldLoad, setShouldLoad] = useState(
        () => typeof window === "undefined" || !("IntersectionObserver" in window),
    );
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const container = containerRef.current;
        if (!container || shouldLoad) return undefined;

        const observer = new IntersectionObserver(
            (entries) => {
                if (!entries.some((entry) => entry.isIntersecting)) return;
                observer.disconnect();
                setShouldLoad(true);
            },
            {
                rootMargin: PREFETCH_MARGIN,
                threshold: 0,
            },
        );

        observer.observe(container);
        return () => observer.disconnect();
    }, [shouldLoad]);

    const handleReady = useCallback(() => {
        setIsReady(true);
    }, []);

    if (!config) {
        throw new Error(`Seção adiada desconhecida: ${section}`);
    }

    const { Component, id, title, minHeight } = config;

    return (
        <div
            id={id}
            ref={containerRef}
            data-deferred-section={section}
            aria-busy={!isReady}
            className={`flow-root w-full bg-obsidian ${minHeight}`}
        >
            {shouldLoad ? (
                <Suspense fallback={<SectionPlaceholder title={title} />}>
                    <LoadedSection
                        Component={Component}
                        onReady={handleReady}
                        experienceMode={experienceMode}
                    />
                </Suspense>
            ) : (
                <SectionPlaceholder title={title} />
            )}
        </div>
    );
}

export default DeferredLayoutSection;

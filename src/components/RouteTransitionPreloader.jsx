import { useEffect, useRef, useState } from "react";
import { startSmoothScroll, stopSmoothScroll } from "../utils/lenisControl";

const MIN_VISIBLE_TIME = 420;
const EXIT_DURATION = 320;

const PAGE_COPY = {
    "/": {
        title: "Início",
        status: "Preparando a página inicial",
        section: "KLEBER DEV / NAVEGAÇÃO",
    },
    "/projetos": {
        title: "Projetos",
        status: "Preparando o catálogo",
        section: "KLEBER DEV / NAVEGAÇÃO",
    },
    "/sobre": {
        title: "Sobre",
        status: "Preparando minha trajetória",
        section: "KLEBER DEV / NAVEGAÇÃO",
    },
    "/contato": {
        title: "Contato",
        status: "Preparando os canais de contato",
        section: "KLEBER DEV / NAVEGAÇÃO",
    },
};

function prefersReducedMotion() {
    return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

function RouteTransitionPreloader({ transition, onComplete }) {
    const [phase, setPhase] = useState("visible");
    const startedAtRef = useRef(0);
    const transitionId = transition?.id;
    const transitionPathname = transition?.pathname;
    const transitionReady = transition?.ready;

    useEffect(() => {
        if (!transitionId) return undefined;

        startedAtRef.current = performance.now();
        const html = document.documentElement;
        const body = document.body;
        const previousHtmlOverflow = html.style.overflow;
        const previousBodyOverflow = body.style.overflow;

        stopSmoothScroll();
        html.style.overflow = "hidden";
        body.style.overflow = "hidden";

        return () => {
            html.style.overflow = previousHtmlOverflow;
            body.style.overflow = previousBodyOverflow;
            startSmoothScroll();
        };
    }, [transitionId]);

    useEffect(() => {
        if (!transitionReady) return undefined;

        const minimumTime = prefersReducedMotion() ? 80 : MIN_VISIBLE_TIME;
        const elapsed = performance.now() - startedAtRef.current;
        const timeoutId = window.setTimeout(() => {
            setPhase("leaving");
        }, Math.max(0, minimumTime - elapsed));

        return () => window.clearTimeout(timeoutId);
    }, [transitionId, transitionReady]);

    useEffect(() => {
        if (!transitionId || phase !== "leaving") return undefined;

        const timeoutId = window.setTimeout(
            () => onComplete(transitionId),
            prefersReducedMotion() ? 0 : EXIT_DURATION,
        );

        return () => window.clearTimeout(timeoutId);
    }, [transitionId, phase, onComplete]);

    if (!transition) return null;

    const page = PAGE_COPY[transitionPathname] ?? PAGE_COPY["/"];

    return (
        <div
            key={transitionId}
            role="status"
            aria-live="polite"
            aria-busy={!transitionReady}
            aria-label={`Carregando página: ${page.title}`}
            className={`
                fixed
                inset-0
                z-[10001]
                flex
                min-h-screen
                items-center
                justify-center
                bg-obsidian
                px-6
                route-preloader
                motion-reduce:transition-none
                ${phase === "leaving" ? "route-preloader--leaving" : ""}
            `}
        >
            <div
                className={`
                    flex
                    w-full
                    max-w-md
                    flex-col
                    items-center
                    text-center
                    route-preloader__content
                    motion-reduce:transition-none
                    ${phase === "leaving" ? "route-preloader__content--leaving" : ""}
                `}
            >
                <p className="mb-8 self-start text-[9px] uppercase tracking-[0.24em] text-steel sm:text-[10px]">
                    {page.section}
                </p>

                <p className="font-space text-[11px] uppercase tracking-[0.32em] text-bronze">
                    Carregando página
                </p>

                <h2 className="mt-4 font-bebas text-6xl tracking-[0.06em] text-ivory sm:text-7xl md:text-8xl">
                    {page.title}
                </h2>

                <p className="mt-4 text-xs leading-6 text-steel sm:text-sm">
                    {transitionReady ? "Finalizando a transição" : page.status}
                </p>

                <div
                    role="progressbar"
                    aria-label={`Carregamento do conteúdo de ${page.title}`}
                    className="mt-10 h-px w-full max-w-[260px] overflow-hidden bg-graphite"
                >
                    <div
                        aria-hidden="true"
                        className={`route-preloader__indicator h-full w-1/3 bg-gradient-to-r from-bronze via-warm-bronze to-champagne ${transitionReady ? "route-preloader__indicator--ready" : ""}`}
                    />
                </div>

                <p className="mt-5 text-[9px] uppercase tracking-[0.22em] text-steel">
                    Kleber Gonçalves · Desenvolvedor Full Stack
                </p>
            </div>
        </div>
    );
}

export default RouteTransitionPreloader;

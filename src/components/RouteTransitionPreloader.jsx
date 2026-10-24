import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
    const [phase, setPhase] = useState("entering");
    const startedAtRef = useRef(0);

    useLayoutEffect(() => {
        if (!transition) return undefined;

        startedAtRef.current = performance.now();
        setPhase("entering");

        const frameId = window.requestAnimationFrame(() => {
            setPhase("visible");
        });

        return () => window.cancelAnimationFrame(frameId);
    }, [transition?.id]);

    useEffect(() => {
        if (!transition) return undefined;

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
    }, [transition?.id]);

    useEffect(() => {
        if (!transition?.ready) return undefined;

        const minimumTime = prefersReducedMotion() ? 80 : MIN_VISIBLE_TIME;
        const elapsed = performance.now() - startedAtRef.current;
        const timeoutId = window.setTimeout(() => {
            setPhase("leaving");
        }, Math.max(0, minimumTime - elapsed));

        return () => window.clearTimeout(timeoutId);
    }, [transition?.id, transition?.ready]);

    useEffect(() => {
        if (!transition || phase !== "leaving") return undefined;

        const timeoutId = window.setTimeout(
            () => onComplete(transition.id),
            prefersReducedMotion() ? 0 : EXIT_DURATION,
        );

        return () => window.clearTimeout(timeoutId);
    }, [transition?.id, phase, onComplete]);

    if (!transition) return null;

    const page = PAGE_COPY[transition.pathname] ?? PAGE_COPY["/"];
    const isVisible = phase === "visible";
    const reducedMotion = prefersReducedMotion();

    return (
        <div
            role="status"
            aria-live="polite"
            aria-busy={!transition.ready}
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
                transition-opacity
                duration-300
                ease-out
                motion-reduce:transition-none
                ${isVisible ? "opacity-100" : "opacity-0"}
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
                    transition-transform
                    duration-500
                    ease-[cubic-bezier(0.16,1,0.3,1)]
                    motion-reduce:transition-none
                    ${isVisible ? "translate-y-0" : "translate-y-3"}
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
                    {transition.ready ? "Finalizando a transição" : page.status}
                </p>

                <div
                    role="progressbar"
                    aria-label={`Carregamento do conteúdo de ${page.title}`}
                    className="mt-10 h-px w-full max-w-[260px] overflow-hidden bg-graphite"
                >
                    <div
                        aria-hidden="true"
                        className="h-full w-1/3 bg-gradient-to-r from-bronze via-warm-bronze to-champagne"
                        style={{
                            transform: transition.ready ? "translateX(200%)" : "translateX(0)",
                            transition: reducedMotion ? "none" : "transform 300ms ease-out",
                        }}
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

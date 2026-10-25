import { useEffect, useRef, useState } from "react";
import { startSmoothScroll, stopSmoothScroll } from "../utils/lenisControl";

// Um pouco mais de tempo para perceber a transição sem impor uma espera longa.
const MIN_VISIBLE_TIME = 600;
const EXIT_DURATION = 320;

const PAGE_COPY = {
    "/": {
        title: "Início",
        status: "Preparando a página inicial",
    },
    "/projetos": {
        title: "Projetos",
        status: "Preparando o catálogo",
    },
    "/sobre": {
        title: "Sobre",
        status: "Preparando minha trajetória",
    },
    "/contato": {
        title: "Contato",
        status: "Preparando os canais de contato",
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


                <h2 className="mt-4 font-bebas text-6xl tracking-[0.06em] text-ivory sm:text-7xl md:text-8xl">
                    {page.title}
                </h2>


            </div>
        </div>
    );
}

export default RouteTransitionPreloader;

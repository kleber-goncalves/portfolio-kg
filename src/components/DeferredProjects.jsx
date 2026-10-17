import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";

const Projetos = lazy(() => import("../layout/ProjetosTeste2"));

const PREFETCH_MARGIN = "1000px 0px";

function ProjetosPlaceholder() {
    return (
        <section
            aria-labelledby="projetos-placeholder-title"
            className="relative min-h-screen w-full bg-obsidian b-md:min-h-[130vh]"
        >
            <div
                className="
                    flex
                    w-full
                    flex-row
                    items-center
                    gap-2
                    p-5
                    pt-12
                    b-md:p-10
                "
            >
                <h2
                    id="projetos-placeholder-title"
                    className="
                        whitespace-nowrap
                        text-sm
                        uppercase
                        text-steel
                        b-md:text-7xl
                    "
                >
                    // Projetos
                </h2>
                <span className="h-0.5 flex-1 bg-gradientaa b-md:h-1" />
            </div>

            <div className="px-5 pt-10 b-md:px-10 b-md:pt-8" aria-hidden="true">
                <div className="h-32 w-full animate-pulse rounded-2xl bg-neutral-900/60 b-md:h-48" />
            </div>
        </section>
    );
}

function deveCarregarImediatamente() {
    if (typeof window === "undefined") return true;

    return (
        window.location.hash === "#projetos" ||
        typeof window.IntersectionObserver === "undefined"
    );
}

function DeferredProjects({ experienceMode = "full" }) {
    const sectionRef = useRef(null);
    const [deveCarregar, setDeveCarregar] = useState(deveCarregarImediatamente);
    const [pronto, setPronto] = useState(false);

    useEffect(() => {
        const section = sectionRef.current;

        if (!section || deveCarregar) return undefined;

        const observer = new IntersectionObserver(
            (entries) => {
                if (!entries.some((entry) => entry.isIntersecting)) return;

                // Desconecta antes de solicitar o bloco para evitar disparos repetidos.
                observer.disconnect();
                setDeveCarregar(true);
            },
            {
                rootMargin: PREFETCH_MARGIN,
                threshold: 0,
            },
        );

        observer.observe(section);

        return () => observer.disconnect();
    }, [deveCarregar]);

    const handleReady = useCallback(() => {
        setPronto(true);
    }, []);

    return (
        <div
            id="projetos"
            ref={sectionRef}
            className="mt-30 w-full bg-obsidian b-md:mt-30"
            aria-busy={!pronto}
        >
            {deveCarregar ? (
                <Suspense fallback={<ProjetosPlaceholder />}>
                    <Projetos
                        experienceMode={experienceMode}
                        onReady={handleReady}
                    />
                </Suspense>
            ) : (
                <ProjetosPlaceholder />
            )}
        </div>
    );
}

export default DeferredProjects;

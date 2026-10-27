import { useEffect, useState } from "react";
import imageMetadata from "../generated/imageMetadata.json";

const TOTAL_STEPS = 4;
const MIN_DISPLAY_TIME = 800;
const EXIT_DURATION = 760;

function loadImage(src, srcSet, sizes) {
    return new Promise((resolve) => {
        const image = new Image();

        image.onload = () => resolve(true);
        image.onerror = () => resolve(false);

        if (srcSet) {
            image.srcset = srcSet;
            image.sizes = sizes || "100vw";
        }

        image.fetchPriority = "high";
        image.src = src;

        if (image.complete) {
            resolve(image.naturalWidth > 0);
        }
    });
}

function prefersReducedMotion() {
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

function Preloader() {
    const [progress, setProgress] = useState(0);
    const [currentLabel, setCurrentLabel] = useState("Iniciando carregamento");
    const [phase, setPhase] = useState("visible");
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        let cancelled = false;
        const startedAt = performance.now();

        const completeStep = () => {
            if (cancelled) return;
            setProgress((value) => Math.min(value + 1, TOTAL_STEPS));
        };

        const wait = (duration) =>
            new Promise((resolve) => window.setTimeout(resolve, duration));

        const prepareSite = async () => {
            setCurrentLabel("Carregando sua identidade visual");
            await loadImage("/logo.svg");
            completeStep();

            if (cancelled) return;

            setCurrentLabel("Carregando seu retrato");
            const portraitMetadata = imageMetadata["kleber-goncalves.png"];
            await loadImage(
                portraitMetadata?.src ?? "https://github.com/kleber-goncalves.png",
                portraitMetadata?.srcSet,
                portraitMetadata?.sizes,
            );
            completeStep();

            if (cancelled) return;

            setCurrentLabel("Preparando a tipografia");
            try {
                await document.fonts.ready;
                completeStep();
            } catch {
                completeStep();
            }

            if (cancelled) return;

            setCurrentLabel("Finalizando a interface");
            await new Promise((resolve) => {
                requestAnimationFrame(() => {
                    requestAnimationFrame(resolve);
                });
            });
            completeStep();

            if (cancelled) return;

            setCurrentLabel("Tudo pronto para começar");

            // Respeita a preferência por movimento reduzido e evita uma espera
            // visual adicional nessa configuração.
            const reducedMotion = prefersReducedMotion();
            const minimumTime = reducedMotion ? 0 : MIN_DISPLAY_TIME;
            const elapsed = performance.now() - startedAt;
            const remainingTime = Math.max(0, minimumTime - elapsed);

            if (remainingTime > 0) {
                await wait(remainingTime);
            }

            if (cancelled) return;

            if (!reducedMotion) {
                // A camada continua montada enquanto a cortina revela o Hero.
                setPhase("leaving");
                await wait(EXIT_DURATION);
            }

            if (!cancelled) {
                document.body.style.overflow = previousOverflow;
                setVisible(false);
            }
        };

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        prepareSite();

        return () => {
            cancelled = true;
            document.body.style.overflow = previousOverflow;
        };
    }, []);

    if (!visible) return null;

    const percentage = Math.round((progress / TOTAL_STEPS) * 100);

    return (
        <div
            role="status"
            aria-live="polite"
            aria-busy={percentage < 100}
            aria-label={"Carregamento do site: " + percentage + "%"}
            className={
                "site-preloader fixed inset-0 z-[9999] flex min-h-screen items-center justify-center overflow-hidden bg-obsidian px-6 " +
                (phase === "leaving" ? "site-preloader--leaving" : "")
            }
        >
            <div className="site-preloader__content flex w-full max-w-xs flex-col items-center text-center">
                <img
                    src="/logo.svg"
                    alt="Logo Kleber Dev"
                    width="112"
                    height="112"
                    fetchPriority="high"
                    className="site-preloader__logo mb-6 h-24 w-24 object-contain sm:h-28 sm:w-28"
                />

                <p className="site-preloader__name font-bebas text-2xl tracking-[0.18em] text-ivory sm:text-3xl">
                    KLEBER GONÇALVES
                </p>

                <p className="site-preloader__role mt-2 text-[10px] uppercase tracking-[0.28em] text-steel">
                    Desenvolvedor Full Stack
                </p>

                <div className="site-preloader__progress mt-12 w-full">
                    <div className="mb-3 flex items-center justify-between gap-4">
                        <span
                            key={currentLabel}
                            className="site-preloader__status min-w-0 text-left text-[11px] text-steel"
                        >
                            {currentLabel}
                        </span>
                        <span className="shrink-0 font-bebas text-sm tracking-wider text-champagne">
                            {percentage}%
                        </span>
                    </div>

                    <div
                        className="site-preloader__track h-[3px] w-full overflow-hidden bg-graphite"
                        role="progressbar"
                        aria-label="Progresso do carregamento"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={percentage}
                    >
                        <div
                            className="site-preloader__bar h-full bg-gradient-to-r from-bronze to-champagne"
                            style={{ width: percentage + "%" }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Preloader;

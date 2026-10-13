import { useEffect, useState } from "react";

const TOTAL_STEPS = 4;
const MIN_DISPLAY_TIME = 3000;

function loadImage(src) {
    return new Promise((resolve) => {
        const image = new Image();

        image.onload = () => resolve(true);
        image.onerror = () => resolve(false);
        image.src = src;

        if (image.complete) {
            resolve(image.naturalWidth > 0);
        }
    });
}

function Preloader() {
    const [progress, setProgress] = useState(0);
    const [currentLabel, setCurrentLabel] = useState("Iniciando carregamento");
    const [completedItems, setCompletedItems] = useState([]);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        let cancelled = false;
        const startedAt = performance.now();

        const completeStep = (label, success = true) => {
            if (cancelled) return;

            setCompletedItems((items) => [
                ...items,
                { label, success },
            ]);
            setProgress((value) => Math.min(value + 1, TOTAL_STEPS));
        };

        const wait = (duration) =>
            new Promise((resolve) => window.setTimeout(resolve, duration));

        const prepareSite = async () => {
            setCurrentLabel("Carregando sua identidade visual");
            const logoLoaded = await loadImage("/logo.svg");
            completeStep(
                logoLoaded ? "Logo carregada" : "Logo indisponível",
                logoLoaded,
            );

            if (cancelled) return;

            setCurrentLabel("Carregando seu retrato");
            const portraitLoaded = await loadImage(
                "https://github.com/kleber-goncalves.png",
            );
            completeStep(
                portraitLoaded ? "Retrato carregado" : "Retrato indisponível",
                portraitLoaded,
            );

            if (cancelled) return;

            setCurrentLabel("Preparando a tipografia");
            try {
                await document.fonts.ready;
                completeStep("Tipografia preparada");
            } catch {
                completeStep("Tipografia indisponível", false);
            }

            if (cancelled) return;

            setCurrentLabel("Finalizando a interface");
            await new Promise((resolve) => {
                requestAnimationFrame(() => {
                    requestAnimationFrame(resolve);
                });
            });
            completeStep("Interface pronta");

            if (cancelled) return;

            // Mantém o preloader visível por pelo menos 3 segundos,
            // mesmo se os recursos terminarem de carregar muito rápido.
            const elapsed = performance.now() - startedAt;
            const remainingTime = Math.max(0, MIN_DISPLAY_TIME - elapsed);

            if (remainingTime > 0) {
                setCurrentLabel("Preparando sua experiência");
                await wait(remainingTime);
            }

            if (cancelled) return;

            setCurrentLabel("Tudo pronto para começar");
            await wait(500);

            if (!cancelled) setVisible(false);
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
            aria-label={`Carregamento do site: ${percentage}%`}
            className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center bg-obsidian px-6 transition-opacity duration-500"
        >
            <div className="flex w-full max-w-xs flex-col items-center text-center">
                <img
                    src="/logo.svg"
                    alt="Logo Kleber Dev"
                    width="112"
                    height="112"
                    fetchPriority="high"
                    className="mb-6 h-24 w-24 object-contain sm:h-28 sm:w-28"
                />

                <p className="font-bebas text-2xl tracking-[0.18em] text-ivory sm:text-3xl">
                    KLEBER GONÇALVES
                </p>

                <p className="mt-2 text-[10px] uppercase tracking-[0.28em] text-steel">
                    Desenvolvedor Full Stack
                </p>

                <div className="mt-12 w-full">
                    <div className="mb-3 flex items-center justify-between gap-4">
                        <span className="text-left text-[11px] text-steel">
                            {currentLabel}
                        </span>
                        <span className="shrink-0 font-bebas text-sm tracking-wider text-champagne">
                            {percentage}%
                        </span>
                    </div>

                    <div
                        className="h-[3px] w-full overflow-hidden bg-graphite"
                        role="progressbar"
                        aria-label="Progresso do carregamento"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={percentage}
                    >
                        <div
                            className="h-full bg-gradient-to-r from-bronze to-champagne transition-[width] duration-300 ease-out"
                            style={{ width: `${percentage}%` }}
                        />
                    </div>

                    <ul className="mt-5 flex flex-col gap-2 text-left">
                        {completedItems.map((item, index) => (
                            <li
                                key={`${item.label}-${index}`}
                                className="flex items-center gap-2 text-[10px] tracking-wide text-steel"
                            >
                                <span
                                    aria-hidden="true"
                                    className={item.success ? "text-champagne" : "text-steel"}
                                >
                                    {item.success ? "✓" : "–"}
                                </span>
                                {item.label}
                            </li>
                        ))}
                    </ul>

                    <p className="mt-5 text-[9px] uppercase tracking-[0.18em] text-steel/60">
                        {progress} de {TOTAL_STEPS} etapas concluídas
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Preloader;

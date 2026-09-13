import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { Sparkles, Zap, Check } from "lucide-react";

import { getExperienceMode, setExperienceMode } from "../utils/experienceMode";

function ExperienceSelector() {
    // =====================================
    // ESTADO INICIAL
    // =====================================
    //
    // Aqui já verificamos o localStorage durante
    // a criação do componente.
    //
    // Se não existir preferência:
    // visible = true
    //
    // Se já existir:
    // visible = false
    //

    const [selectedMode, setSelectedMode] = useState(() => getExperienceMode() || "full");

    const [visible, setVisible] = useState(() => !getExperienceMode());

    // =====================================
    // BLOQUEIA A ROLAGEM
    // =====================================

    useEffect(() => {
        if (!visible) {
            return;
        }

        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "";
        };
    }, [visible]);

    // =====================================
    // ANIMAÇÃO DO SELECTOR
    // =====================================

    useEffect(() => {
        if (!visible) {
            return;
        }

        const ctx = gsap.context(() => {
            // Overlay

            gsap.fromTo(
                ".experience-overlay",
                {
                    opacity: 0,
                },
                {
                    opacity: 1,
                    duration: 0.5,
                    ease: "power2.out",
                },
            );

            // Card

            gsap.fromTo(
                ".experience-card",
                {
                    opacity: 0,
                    y: 30,
                    scale: 0.97,
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.7,
                    delay: 0.1,
                    ease: "power3.out",
                },
            );
        });

        return () => {
            ctx.revert();
        };
    }, [visible]);

    // =====================================
    // CONFIRMAR EXPERIÊNCIA
    // =====================================

    function handleConfirm() {
        // Salva a preferência

        setExperienceMode(selectedMode);

        // Libera a rolagem

        document.body.style.overflow = "";

        // Fecha visualmente

        setVisible(false);

        // Pequeno tempo para a animação
        // de fechamento acontecer antes do reload

        window.setTimeout(() => {
            window.location.reload();
        }, 250);
    }

    // =====================================
    // SE NÃO ESTIVER VISÍVEL
    // =====================================

    if (!visible) {
        return null;
    }

    // =====================================
    // RENDER
    // =====================================

    return (
        <div
            className="
                experience-overlay
                fixed
                inset-0
                z-[9999]
                flex
                items-center
                justify-center
                bg-black/80
                px-5
                backdrop-blur-md
            "
        >
            <div
                className="
                    experience-card
                    w-full
                    max-w-[620px]
                    border
                    border-graphite
                    bg-carbon
                    p-6
                    md:p-10
                "
            >
                {/* =====================================
                    HEADER
                ===================================== */}

                <div className="mb-8">
                    <div className="mb-4 flex items-center gap-3">
                        <div
                            className="
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                border
                                border-graphite
                                bg-obsidian
                            "
                        >
                            <Sparkles className="h-4 w-4 text-bronze" />
                        </div>

                        <span
                            className="
                                font-space
                                text-[10px]
                                uppercase
                                tracking-[0.2em]
                                text-steel/60
                            "
                        >
                            Experiência
                        </span>
                    </div>

                    <h2
                        className="
                            font-space
                            text-3xl
                            font-medium
                            tracking-[-0.04em]
                            text-ivory
                            md:text-4xl
                        "
                    >
                        COMO VOCÊ QUER
                        <br />
                        EXPLORAR O SITE?
                    </h2>

                    <p
                        className="
                            mt-4
                            max-w-[480px]
                            text-sm
                            leading-6
                            text-steel/60
                        "
                    >
                        Escolha como deseja experimentar meu portfólio.
                    </p>
                </div>

                {/* =====================================
                    OPÇÕES
                ===================================== */}

                <div className="flex flex-col gap-3">
                    {/* =================================
                        EXPERIÊNCIA COMPLETA
                    ================================= */}

                    <button
                        type="button"
                        onClick={() => setSelectedMode("full")}
                        className={`
                            group
                            relative
                            w-full
                            border
                            p-5
                            text-left
                            transition-all
                            duration-300

                            ${selectedMode === "full" ? "border-bronze bg-obsidian" : "border-graphite bg-obsidian/40 hover:border-steel/30"}
                        `}
                    >
                        <div className="flex items-start gap-4">
                            <div
                                className={`
                                    mt-0.5
                                    flex
                                    h-10
                                    w-10
                                    shrink-0
                                    items-center
                                    justify-center
                                    border

                                    ${selectedMode === "full" ? "border-bronze text-bronze" : "border-graphite text-steel/50"}
                                `}
                            >
                                <Zap className="h-4 w-4" />
                            </div>

                            <div className="min-w-0 flex-1">
                                <div
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                        gap-4
                                    "
                                >
                                    <h3
                                        className="
                                            font-space
                                            text-base
                                            font-medium
                                            text-ivory
                                        "
                                    >
                                        EXPERIÊNCIA COMPLETA
                                    </h3>

                                    {selectedMode === "full" && (
                                        <Check
                                            className="
                                                h-4
                                                w-4
                                                shrink-0
                                                text-bronze
                                            "
                                        />
                                    )}
                                </div>

                                <p
                                    className="
                                        mt-2
                                        text-xs
                                        leading-5
                                        text-steel/60
                                    "
                                >
                                    Animações, transições, efeitos visuais e interações.
                                </p>
                            </div>
                        </div>
                    </button>

                    {/* =================================
                        EXPERIÊNCIA REDUZIDA
                    ================================= */}

                    <button
                        type="button"
                        onClick={() => setSelectedMode("reduced")}
                        className={`
                            group
                            relative
                            w-full
                            border
                            p-5
                            text-left
                            transition-all
                            duration-300

                            ${selectedMode === "reduced" ? "border-bronze bg-obsidian" : "border-graphite bg-obsidian/40 hover:border-steel/30"}
                        `}
                    >
                        <div className="flex items-start gap-4">
                            <div
                                className={`
                                    mt-0.5
                                    flex
                                    h-10
                                    w-10
                                    shrink-0
                                    items-center
                                    justify-center
                                    border

                                    ${selectedMode === "reduced" ? "border-bronze text-bronze" : "border-graphite text-steel/50"}
                                `}
                            >
                                <Sparkles className="h-4 w-4" />
                            </div>

                            <div className="min-w-0 flex-1">
                                <div
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                        gap-4
                                    "
                                >
                                    <h3
                                        className="
                                            font-space
                                            text-base
                                            font-medium
                                            text-ivory
                                        "
                                    >
                                        EXPERIÊNCIA REDUZIDA
                                    </h3>

                                    {selectedMode === "reduced" && (
                                        <Check
                                            className="
                                                h-4
                                                w-4
                                                shrink-0
                                                text-bronze
                                            "
                                        />
                                    )}
                                </div>

                                <p
                                    className="
                                        mt-2
                                        text-xs
                                        leading-5
                                        text-steel/60
                                    "
                                >
                                    Menos movimento e efeitos para uma navegação mais direta.
                                </p>
                            </div>
                        </div>
                    </button>
                </div>

                {/* =====================================
                    CONFIRMAR
                ===================================== */}

                <button
                    type="button"
                    onClick={handleConfirm}
                    className="
                        mt-6
                        flex
                        w-full
                        items-center
                        justify-center
                        border
                        border-bronze
                        bg-bronze
                        px-6
                        py-4
                        font-space
                        text-[11px]
                        font-medium
                        uppercase
                        tracking-[0.18em]
                        text-obsidian
                        transition-all
                        duration-300
                        hover:bg-transparent
                        hover:text-bronze
                    "
                >
                    CONFIRMAR EXPERIÊNCIA
                </button>

                {/* =====================================
                    OBSERVAÇÃO
                ===================================== */}

                <p
                    className="
                        mt-4
                        text-center
                        font-space
                        text-[9px]
                        uppercase
                        tracking-[0.14em]
                        text-steel/30
                    "
                >
                    Você poderá alterar essa preferência depois.
                </p>
            </div>
        </div>
    );
}

export default ExperienceSelector;

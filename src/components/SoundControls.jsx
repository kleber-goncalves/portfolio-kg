import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, SlidersHorizontal, Volume2, VolumeX } from "lucide-react";
import Slider05 from "./ui/Slider05";
import {
    getUiSoundsEnabled,
    getUiSoundVolume,
    playUiSound,
    setUiSoundVolume,
    subscribeUiSounds,
    subscribeUiSoundVolume,
    toggleUiSounds,
} from "../utils/uiSfx";

function SoundControls({ className = "" }) {
    const [enabled, setEnabled] = useState(() => getUiSoundsEnabled());
    const [volume, setVolume] = useState(() => getUiSoundVolume());
    const [isVolumeOpen, setIsVolumeOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const rootRef = useRef(null);
    const volumeLabelId = useId();
    const volumePanelId = useId();

    useEffect(() => subscribeUiSounds(setEnabled), []);
    useEffect(() => subscribeUiSoundVolume(setVolume), []);

    useEffect(() => {
        if (!isVolumeOpen) return undefined;

        const handlePointerDown = (event) => {
            if (rootRef.current?.contains(event.target)) return;

            setIsVolumeOpen(false);
            playUiSound("close");
        };

        const handleKeyDown = (event) => {
            if (event.key !== "Escape") return;

            setIsVolumeOpen(false);
            playUiSound("close");
        };

        document.addEventListener("pointerdown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isVolumeOpen]);

    const handleToggle = async () => {
        if (isUpdating) return;

        setIsUpdating(true);
        try {
            const nextEnabled = await toggleUiSounds();
            setEnabled(nextEnabled);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleVolumeButton = () => {
        const nextOpen = !isVolumeOpen;
        playUiSound(nextOpen ? "open" : "close");
        setIsVolumeOpen(nextOpen);
    };

    const handleVolumeChange = (nextValue) => {
        const nextVolume = setUiSoundVolume(nextValue);
        setVolume(nextVolume);
    };

    const handleVolumePreview = () => {
        playUiSound("volume-change");
    };

    const buttonClassName = `
        inline-flex h-9 items-center justify-center gap-2
        border border-graphite/90 bg-obsidian/75 px-3
        font-space text-[9px] uppercase tracking-[0.14em] text-steel
        transition-colors duration-200
        hover:border-bronze hover:text-ivory
        focus-visible:outline focus-visible:outline-2
        focus-visible:outline-offset-2 focus-visible:outline-champagne
        disabled:cursor-wait disabled:opacity-60
    `;

    return (
        <div ref={rootRef} className={`relative flex shrink-0 items-center gap-1.5 ${className}`}>
            <button
                type="button"
                data-ui-sfx-hover
                onClick={handleToggle}
                disabled={isUpdating}
                aria-pressed={enabled}
                aria-label={enabled ? "Desativar efeitos sonoros" : "Ativar efeitos sonoros"}
                title={enabled ? "Desativar efeitos sonoros" : "Ativar efeitos sonoros"}
                className={buttonClassName}
            >
                {enabled ? (
                    <Volume2 aria-hidden="true" className="h-3.5 w-3.5 text-bronze" />
                ) : (
                    <VolumeX aria-hidden="true" className="h-3.5 w-3.5" />
                )}
                <span>{enabled ? "Som on" : "Som off"}</span>
            </button>

            <button
                type="button"
                data-ui-sfx-hover
                onClick={handleVolumeButton}
                aria-expanded={isVolumeOpen}
                aria-haspopup="dialog"
                aria-controls={volumePanelId}
                aria-label={`Configurar volume: ${volume}%`}
                title="Configurar volume"
                className={buttonClassName}
            >
                <SlidersHorizontal aria-hidden="true" className="h-3.5 w-3.5 text-bronze" />
                <span>{volume}%</span>
                <motion.span
                    aria-hidden="true"
                    animate={{ rotate: isVolumeOpen ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 360, damping: 22 }}
                    className="inline-flex"
                >
                    <ChevronDown className="h-3 w-3" />
                </motion.span>
            </button>

            <AnimatePresence>
                {isVolumeOpen && (
                    <motion.div
                        key="sound-volume-panel"
                        id={volumePanelId}
                        role="dialog"
                        aria-label="Controle de volume dos efeitos sonoros"
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.97 }}
                        transition={{
                            type: "spring",
                            stiffness: 340,
                            damping: 26,
                            mass: 0.7,
                        }}
                        style={{ transformOrigin: "top right" }}
                        className="
                            absolute right-0 top-full z-[80] mt-3 w-56
                            border border-graphite bg-obsidian p-4
                            shadow-[0_18px_50px_rgba(0,0,0,0.42)]
                        "
                    >
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <label
                                id={volumeLabelId}
                                htmlFor={volumePanelId + "-range"}
                                className="font-space text-[10px] uppercase tracking-[0.16em] text-steel"
                            >
                                Volume dos sons
                            </label>
                            <span className="font-space text-xs tabular-nums text-bronze">
                                {volume}%
                            </span>
                        </div>

                        <Slider05
                            min={0}
                            max={800}
                            step={5}
                            value={volume}
                            onChange={handleVolumeChange}
                            onPreview={handleVolumePreview}
                            labelId={volumeLabelId}
                        />

                        <div className="mt-2 flex items-center justify-between font-space text-[9px] uppercase tracking-[0.12em] text-steel/80">
                            <span>Silêncio</span>
                            <span>Escala 8×</span>
                        </div>

                        <p className="mt-4 border-t border-graphite pt-3 text-[10px] leading-4 text-steel">
                            100% é o volume de referência de cada efeito. A escala vai até 800%, respeitando o limite máximo de ganho de cada efeito. A escolha fica salva neste navegador.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default SoundControls;

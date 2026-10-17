import { useEffect, useId, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Volume2, VolumeX } from "lucide-react";
import {
    getUiSoundVolume,
    playUiSound,
    setUiSoundVolume,
    subscribeUiSoundVolume,
} from "../utils/uiSfx";

const MAX_VOLUME = 800;
const RANGE_KEYS = new Set([
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown",
    "PageDown",
    "PageUp",
    "Home",
    "End",
]);

function SoundVolumeSliderMobile() {
    const [volume, setVolume] = useState(() => getUiSoundVolume());
    const [isInteracting, setIsInteracting] = useState(false);
    const sliderId = useId();
    const reducedMotion = useReducedMotion();
    const interactionRef = useRef({
        source: null,
        changed: false,
        value: getUiSoundVolume(),
    });

    useEffect(() => subscribeUiSoundVolume((nextVolume) => {
        setVolume(nextVolume);
        if (!interactionRef.current.source) {
            interactionRef.current.value = nextVolume;
        }
    }), []);

    const handleChange = (event) => {
        const nextValue = Number(event.currentTarget.value);
        if (!Number.isFinite(nextValue) || nextValue === volume) return;

        // Durante o arraste, atualiza apenas o valor visual. Gravar no localStorage
        // e disparar um CustomEvent em cada touchmove pode bloquear arrastes rápidos.
        interactionRef.current.value = nextValue;
        setVolume(nextValue);

        if (interactionRef.current.source) {
            interactionRef.current.changed = true;
            return;
        }

        const committedVolume = setUiSoundVolume(nextValue);
        interactionRef.current.value = committedVolume;
        setVolume(committedVolume);
    };

    const beginPointerInteraction = () => {
        interactionRef.current = {
            source: "pointer",
            changed: false,
            value: volume,
        };
        setIsInteracting(true);
    };

    const beginKeyboardInteraction = (event) => {
        if (!RANGE_KEYS.has(event.key)) return;

        if (interactionRef.current.source !== "keyboard") {
            interactionRef.current = {
                source: "keyboard",
                changed: false,
                value: volume,
            };
        }
        setIsInteracting(true);
    };

    const finishInteraction = () => {
        const { changed, value } = interactionRef.current;
        interactionRef.current = {
            source: null,
            changed: false,
            value,
        };
        setIsInteracting(false);

        if (!changed) return;

        const committedVolume = setUiSoundVolume(value);
        interactionRef.current.value = committedVolume;
        setVolume(committedVolume);
        playUiSound("volume-change");
    };

    const transition = reducedMotion
        ? { duration: 0 }
        : { type: "spring", stiffness: 380, damping: 34, mass: 0.55 };

    return (
        <motion.section
            data-mobile-sound-volume
            initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transition}
            className="mt-3 border border-graphite bg-obsidian/40 px-4 py-4"
        >
            <div className="flex items-center justify-between gap-3">
                <label
                    htmlFor={sliderId}
                    className="flex items-center gap-2 font-space text-[10px] uppercase tracking-[0.16em] text-steel"
                >
                    {volume === 0 ? (
                        <VolumeX aria-hidden="true" className="h-4 w-4 shrink-0" />
                    ) : (
                        <Volume2 aria-hidden="true" className="h-4 w-4 shrink-0 text-bronze" />
                    )}
                    Volume dos sons
                </label>

                <span
                    aria-live="off"
                    className="font-space text-sm tabular-nums text-bronze"
                >
                    {volume}%
                </span>
            </div>

            <div className="relative mt-3 flex h-8 items-center">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute left-2 right-2 h-1.5 overflow-hidden rounded-full bg-steel/20"
                >
                    <div
                        data-volume-fill
                        className={isInteracting
                            ? "h-full rounded-full bg-bronze transition-none"
                            : "h-full rounded-full bg-bronze transition-[width] duration-150 ease-out"}
                        style={{ width: ((volume / MAX_VOLUME) * 100) + "%" }}
                    />
                </div>

                <input
                    id={sliderId}
                    type="range"
                    min={0}
                    max={MAX_VOLUME}
                    step={5}
                    value={volume}
                    aria-label="Volume dos sons"
                    aria-valuetext={volume + "% do volume de referência"}
                    onChange={handleChange}
                    onPointerDown={beginPointerInteraction}
                    onPointerUp={finishInteraction}
                    onPointerCancel={finishInteraction}
                    onKeyDown={beginKeyboardInteraction}
                    onKeyUp={(event) => {
                        if (RANGE_KEYS.has(event.key)) finishInteraction();
                    }}
                    onBlur={finishInteraction}
                    style={{ touchAction: "pan-y" }}
                    className="
                        relative z-10 h-8 w-full cursor-pointer appearance-none
                        bg-transparent outline-none
                        focus-visible:rounded-full focus-visible:ring-2
                        focus-visible:ring-bronze/70 focus-visible:ring-offset-4
                        focus-visible:ring-offset-carbon
                        [&::-webkit-slider-runnable-track]:h-1.5
                        [&::-webkit-slider-runnable-track]:rounded-full
                        [&::-webkit-slider-runnable-track]:bg-transparent
                        [&::-webkit-slider-thumb]:mt-[-5px]
                        [&::-webkit-slider-thumb]:h-4
                        [&::-webkit-slider-thumb]:w-4
                        [&::-webkit-slider-thumb]:appearance-none
                        [&::-webkit-slider-thumb]:rounded-full
                        [&::-webkit-slider-thumb]:border-2
                        [&::-webkit-slider-thumb]:border-carbon
                        [&::-webkit-slider-thumb]:bg-bronze
                        [&::-webkit-slider-thumb]:shadow-[0_0_0_3px_rgba(196,154,120,0.15)]
                        [&::-moz-range-track]:h-1.5
                        [&::-moz-range-track]:rounded-full
                        [&::-moz-range-track]:bg-transparent
                        [&::-moz-range-thumb]:h-4
                        [&::-moz-range-thumb]:w-4
                        [&::-moz-range-thumb]:rounded-full
                        [&::-moz-range-thumb]:border-2
                        [&::-moz-range-thumb]:border-carbon
                        [&::-moz-range-thumb]:bg-bronze
                    "
                />
            </div>

            <div className="flex items-center justify-between font-space text-[9px] uppercase tracking-[0.12em] text-steel/80">
                <span>0%</span>
                <span>800%</span>
            </div>

            <p className="mt-3 border-t border-graphite pt-3 text-[10px] leading-4 text-steel">
                100% é o volume de referência. O ajuste fica salvo neste navegador.
            </p>
        </motion.section>
    );
}

export default SoundVolumeSliderMobile;

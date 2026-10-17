import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import {
    getUiSoundsEnabled,
    subscribeUiSounds,
    toggleUiSounds,
} from "../utils/uiSfx";

function SoundToggle() {
    const [enabled, setEnabled] = useState(() => getUiSoundsEnabled());
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => subscribeUiSounds(setEnabled), []);

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

    return (
        <button
            type="button"
            onClick={handleToggle}
            disabled={isUpdating}
            aria-pressed={enabled}
            aria-label={enabled ? "Desativar efeitos sonoros" : "Ativar efeitos sonoros"}
            title={enabled ? "Desativar efeitos sonoros" : "Ativar efeitos sonoros"}
            className="
                flex w-full items-center justify-between gap-3
                border border-graphite bg-obsidian/40 px-4 py-3
                text-left text-steel transition-colors duration-300
                hover:border-bronze hover:text-ivory
                focus-visible:outline focus-visible:outline-2
                focus-visible:outline-offset-2 focus-visible:outline-champagne
                disabled:cursor-wait disabled:opacity-60
            "
        >
            <span className="flex items-center gap-3">
                {enabled ? (
                    <Volume2 aria-hidden="true" className="h-4 w-4 text-bronze" />
                ) : (
                    <VolumeX aria-hidden="true" className="h-4 w-4" />
                )}
                <span className="font-space text-[10px] uppercase tracking-[0.16em]">
                    Efeitos sonoros
                </span>
            </span>
            <span className="font-space text-[9px] uppercase tracking-[0.16em] text-bronze">
                {enabled ? "Ativados" : "Desativados"}
            </span>
        </button>
    );
}

export default SoundToggle;

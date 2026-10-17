import { createUISFX } from "uisfx";

const ENABLED_STORAGE_KEY = "kleber-dev:ui-sounds-enabled";
const PLAYER_PREFERENCES_KEY = "kleber-dev:ui-sfx";
const CHANGE_EVENT = "kleber-dev:ui-sfx-change";
const DEFAULT_VOLUME = 0.24;

let player = null;
let isUnlocked = false;
let unlockPromise = null;

export function getUiSoundsEnabled() {
    if (typeof window === "undefined") return false;

    try {
        return window.localStorage.getItem(ENABLED_STORAGE_KEY) === "true";
    } catch {
        return false;
    }
}

function persistEnabled(enabled) {
    try {
        window.localStorage.setItem(ENABLED_STORAGE_KEY, String(enabled));
    } catch {
        // O som continua funcionando durante a sessão mesmo se o storage estiver indisponível.
    }

    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, {
        detail: { enabled },
    }));
}

function getPlayer() {
    if (typeof window === "undefined") return null;
    if (player) return player;

    const enabled = getUiSoundsEnabled();

    player = createUISFX({
        pack: "zen",
        volume: DEFAULT_VOLUME,
        enabled,
        preferences: { key: PLAYER_PREFERENCES_KEY },
    });

    // Mantém a identidade sonora do portfólio e aplica a preferência explícita do site.
    player.setPack("zen");
    player.setVolume(DEFAULT_VOLUME);
    player.setEnabled(enabled);

    return player;
}

export function subscribeUiSounds(callback) {
    if (typeof window === "undefined") return () => {};

    const handleChange = (event) => {
        callback(Boolean(event?.detail?.enabled ?? getUiSoundsEnabled()));
    };

    window.addEventListener(CHANGE_EVENT, handleChange);
    window.addEventListener("storage", handleChange);

    return () => {
        window.removeEventListener(CHANGE_EVENT, handleChange);
        window.removeEventListener("storage", handleChange);
    };
}

export function playUiSound(cue) {
    const soundPlayer = getPlayer();

    if (!soundPlayer || !getUiSoundsEnabled()) return null;

    if (isUnlocked) {
        return soundPlayer.play(cue) ?? null;
    }

    // unlock() é invocado dentro da interação real do usuário. Não há autoplay
    // nem fila de sons disparados por atualizações assíncronas sem gesto.
    if (!unlockPromise) {
        unlockPromise = Promise.resolve(soundPlayer.unlock())
            .then(() => {
                isUnlocked = true;
            })
            .catch(() => {
                isUnlocked = false;
            })
            .finally(() => {
                unlockPromise = null;
            });
    }

    const pendingUnlock = unlockPromise;
    void pendingUnlock.then(() => {
        if (isUnlocked && getUiSoundsEnabled()) {
            soundPlayer.play(cue);
        }
    });

    return null;
}

export async function toggleUiSounds() {
    const soundPlayer = getPlayer();
    if (!soundPlayer) return false;

    const nextEnabled = !getUiSoundsEnabled();

    if (!nextEnabled) {
        soundPlayer.stopAll();
        soundPlayer.setEnabled(false);
        persistEnabled(false);
        return false;
    }

    // A chamada começa diretamente no clique/toque do botão, respeitando
    // a política de reprodução do navegador.
    try {
        unlockPromise = Promise.resolve(soundPlayer.unlock())
            .then(() => {
                isUnlocked = true;
            })
            .catch(() => {
                isUnlocked = false;
            })
            .finally(() => {
                unlockPromise = null;
            });

        await unlockPromise;
    } catch {
        isUnlocked = false;
    }

    if (!isUnlocked) {
        persistEnabled(false);
        soundPlayer.setEnabled(false);
        return false;
    }

    soundPlayer.setPack("zen");
    soundPlayer.setVolume(DEFAULT_VOLUME);
    soundPlayer.setEnabled(true);
    persistEnabled(true);
    soundPlayer.play("toggle-on");

    return true;
}


const HOVERABLE_SELECTOR = "button, a[href], [role='button'], [role='link'], [data-ui-sfx-hover]";
const hoverTargetCache = new WeakMap();

function hasVisualHoverState(element) {
    if (!element) return false;

    const cached = hoverTargetCache.get(element);
    if (cached !== undefined) return cached;

    const hasOwnHoverClass = Array.from(element.classList).some((name) =>
        /(^|:)(hover|focus-within|group-hover|peer-hover):/.test(name)
    );

    if (hasOwnHoverClass || element.hasAttribute("data-ui-sfx-hover")) {
        hoverTargetCache.set(element, true);
        return true;
    }

    // Cartões/links às vezes animam apenas os filhos ao passar o mouse
    // (por exemplo, ícone ou texto com group-hover). Inspecionamos filhos
    // somente quando o controle usa a classe "group".
    if (element.classList.contains("group")) {
        const descendants = element.querySelectorAll("*");
        for (const descendant of descendants) {
            const hasGroupHover = Array.from(descendant.classList).some((name) =>
                /(^|:)(group-hover|peer-hover):/.test(name)
            );
            if (hasGroupHover) {
                hoverTargetCache.set(element, true);
                return true;
            }
        }
    }

    hoverTargetCache.set(element, false);
    return false;
}

/**
 * Dispara o cue "hover" do pacote Zen apenas para controles interativos
 * que já declaram classes de hover/foco no visual. O evento é delegado,
 * não adiciona handlers React a dezenas de componentes nem toca em touch.
 */
export function attachUiSfxHoverListeners() {
    if (typeof document === "undefined") return () => {};

    const handlePointerOver = (event) => {
        if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
        if (!(event.target instanceof Element)) return;

        const element = event.target.closest(HOVERABLE_SELECTOR);
        if (!element) return;
        if (element.contains(event.relatedTarget)) return;
        if (element.matches(":disabled, [aria-disabled='true']")) return;
        if (!hasVisualHoverState(element)) return;

        playUiSound("hover");
    };

    document.addEventListener("pointerover", handlePointerOver, { passive: true });
    return () => document.removeEventListener("pointerover", handlePointerOver);
}

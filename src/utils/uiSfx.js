import { createRecipe, createUISFX } from "uisfx";

const ENABLED_STORAGE_KEY = "kleber-dev:ui-sounds-enabled";
const PLAYER_PREFERENCES_KEY = "kleber-dev:ui-sfx";
const CHANGE_EVENT = "kleber-dev:ui-sfx-change";
const DEFAULT_VOLUME_PERCENT = 200;
const MAX_VOLUME_PERCENT = 800;
const VOLUME_STORAGE_KEY = "kleber-dev:ui-sounds-volume";
const VOLUME_MIGRATION_KEY = "kleber-dev:ui-sounds-volume-v2-migrated";

let player = null;
let isUnlocked = false;
let unlockPromise = null;
let unlockPromiseGeneration = null;
let unlockGeneration = 0;

export function getUiSoundsEnabled() {
    if (typeof window === "undefined") return false;

    try {
        const storedPreference = window.localStorage.getItem(ENABLED_STORAGE_KEY);
        return storedPreference === null ? true : storedPreference === "true";
    } catch {
        // Sem acesso ao armazenamento, aplica o padrão sem bloquear a interface.
        return true;
    }
}

export function getUiSoundVolume() {
    if (typeof window === "undefined") return DEFAULT_VOLUME_PERCENT;

    try {
        const isMigrated = window.localStorage.getItem(VOLUME_MIGRATION_KEY) === "true";
        const storedVolume = window.localStorage.getItem(VOLUME_STORAGE_KEY);

        // Versões anteriores limitavam o controle a 100%. Migra o nível salvo
        // para a nova escala sem diminuir o volume percebido pelo visitante.
        if (!isMigrated) {
            const previousVolume = storedVolume === null
                ? DEFAULT_VOLUME_PERCENT / 2
                : Number(storedVolume);
            const migratedVolume = Number.isFinite(previousVolume)
                ? Math.max(0, Math.min(MAX_VOLUME_PERCENT, Math.round(previousVolume * 2)))
                : DEFAULT_VOLUME_PERCENT;

            window.localStorage.setItem(VOLUME_STORAGE_KEY, String(migratedVolume));
            window.localStorage.setItem(VOLUME_MIGRATION_KEY, "true");
            return migratedVolume;
        }

        if (storedVolume === null) return DEFAULT_VOLUME_PERCENT;

        const volume = Number(storedVolume);
        if (!Number.isFinite(volume)) return DEFAULT_VOLUME_PERCENT;

        return Math.max(0, Math.min(MAX_VOLUME_PERCENT, Math.round(volume)));
    } catch {
        return DEFAULT_VOLUME_PERCENT;
    }
}

function persistVolume(volume) {
    try {
        window.localStorage.setItem(VOLUME_STORAGE_KEY, String(volume));
    } catch {
        // O volume continua aplicado durante a sessão se o storage estiver indisponível.
    }

    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, {
        detail: { volume },
    }));
}

export function setUiSoundVolume(nextVolume) {
    const numericVolume = Number(nextVolume);
    if (!Number.isFinite(numericVolume)) return getUiSoundVolume();

    const volume = Math.max(0, Math.min(MAX_VOLUME_PERCENT, Math.round(numericVolume)));
    const soundPlayer = getPlayer();

    // O volume geral fica em 1; a amplificação adicional é aplicada ao efeito
    // individual, pois a biblioteca limita seu ganho mestre a 0–1.
    soundPlayer?.setVolume(1);
    persistVolume(volume);

    return volume;
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

const cueDefaultVolumeCache = new Map();

function getEffectiveCueVolume(cue) {
    let defaultVolume = cueDefaultVolumeCache.get(cue);

    if (defaultVolume === undefined) {
        defaultVolume = createRecipe("zen", cue).defaultVolume;
        cueDefaultVolumeCache.set(cue, defaultVolume);
    }

    const amplification = getUiSoundVolume() / 100;
    return Math.max(0, Math.min(1, defaultVolume * amplification));
}

function playWithConfiguredVolume(soundPlayer, cue) {
    return soundPlayer.play(cue, {
        volume: getEffectiveCueVolume(cue),
    }) ?? null;
}

function getPlayer() {
    if (typeof window === "undefined") return null;
    if (player) return player;

    const enabled = getUiSoundsEnabled();

    // Mantém o ganho mestre em 1; cada cue recebe seu volume calculado para
    // suportar amplificação acima de 100% sem ultrapassar o ganho da fonte.
    player = createUISFX({
        pack: "zen",
        volume: 1,
        enabled,
        preferences: { key: PLAYER_PREFERENCES_KEY },
    });

    player.setPack("zen");
    player.setVolume(1);
    player.setEnabled(enabled);

    return player;
}

/**
 * Tenta desbloquear o contexto de áudio. A Promise só é considerada bem-sucedida
 * quando a biblioteca confirma que o AudioContext está em execução.
 *
 * A função deve ser chamada a partir de uma interação real do usuário ou do
 * manipulador explícito do botão de ativação.
 */
function requestAudioUnlock(soundPlayer = getPlayer()) {
    if (!soundPlayer) return Promise.resolve(false);

    // Uma tentativa antiga invalidada por desativação não deve bloquear uma nova.
    if (unlockPromise && unlockPromiseGeneration === unlockGeneration) {
        return unlockPromise;
    }

    const attemptGeneration = ++unlockGeneration;
    let unlockResult;

    try {
        // Chamada síncrona: mantém o resume() dentro do gesto real do usuário.
        unlockResult = soundPlayer.unlock();
    } catch {
        isUnlocked = false;
        return Promise.resolve(false);
    }

    // Enquanto o resume está pendente, não alegamos que o áudio está pronto.
    isUnlocked = false;

    let attempt;
    attempt = Promise.resolve(unlockResult)
        .then((unlocked) => {
            const succeeded = unlocked === true && attemptGeneration === unlockGeneration;
            if (attemptGeneration === unlockGeneration) {
                isUnlocked = succeeded;
            }
            return succeeded;
        })
        .catch(() => {
            if (attemptGeneration === unlockGeneration) {
                isUnlocked = false;
            }
            return false;
        })
        .finally(() => {
            // Uma tentativa antiga nunca pode limpar a referência da mais nova.
            if (unlockPromise === attempt) {
                unlockPromise = null;
                unlockPromiseGeneration = null;
            }
        });

    unlockPromise = attempt;
    unlockPromiseGeneration = attemptGeneration;
    return attempt;
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

export function subscribeUiSoundVolume(callback) {
    if (typeof window === "undefined") return () => {};

    const handleChange = (event) => {
        callback(Number(event?.detail?.volume ?? getUiSoundVolume()));
    };

    window.addEventListener(CHANGE_EVENT, handleChange);
    window.addEventListener("storage", handleChange);

    return () => {
        window.removeEventListener(CHANGE_EVENT, handleChange);
        window.removeEventListener("storage", handleChange);
    };
}

export function playUiSound(cue) {
    if (!getUiSoundsEnabled()) return null;

    // Hover, renderização ou outra execução sem gesto não iniciam o desbloqueio.
    // O áudio só é tocado após uma tentativa iniciada por interação confiável.
    if (!isUnlocked && !unlockPromise) return null;

    const soundPlayer = getPlayer();
    if (!soundPlayer) return null;

    if (isUnlocked) {
        return playWithConfiguredVolume(soundPlayer, cue);
    }

    const pendingUnlock = unlockPromise;
    void pendingUnlock.then((unlocked) => {
        if (unlocked && isUnlocked && getUiSoundsEnabled()) {
            playWithConfiguredVolume(soundPlayer, cue);
        }
    });

    return null;
}

export async function toggleUiSounds() {
    const soundPlayer = getPlayer();
    if (!soundPlayer) return false;

    const nextEnabled = !getUiSoundsEnabled();

    if (!nextEnabled) {
        // Invalida qualquer desbloqueio pendente antes de desligar o motor.
        unlockGeneration += 1;
        isUnlocked = false;
        soundPlayer.stopAll();
        soundPlayer.setEnabled(false);
        persistEnabled(false);
        return false;
    }

    const unlocked = await requestAudioUnlock(soundPlayer);

    if (!unlocked) {
        soundPlayer.stopAll();
        soundPlayer.setEnabled(false);
        persistEnabled(false);
        return false;
    }

    soundPlayer.setPack("zen");
    soundPlayer.setVolume(1);
    soundPlayer.setEnabled(true);
    persistEnabled(true);
    playWithConfiguredVolume(soundPlayer, "toggle-on");

    return true;
}


const HOVERABLE_SELECTOR = "button, a[href], [role='button'], [role='link'], [data-ui-sfx-hover]";

function hasVisualHoverState(element) {
    if (!element) return false;

    const hasOwnHoverClass = Array.from(element.classList).some((name) =>
        /(^|:)(hover|focus-within|group-hover(?:\/[^:]+)?|peer-hover(?:\/[^:]+)?):/.test(name)
    );

    if (hasOwnHoverClass || element.hasAttribute("data-ui-sfx-hover")) {
        return true;
    }

    // Cartões/links às vezes animam apenas os filhos ao passar o mouse
    // (por exemplo, ícone ou texto com group-hover). Inspecionamos filhos
    // somente quando o controle usa a classe "group".
    if (element.classList.contains("group") || Array.from(element.classList).some((name) => name.startsWith("group/"))) {
        const descendants = element.querySelectorAll("*");
        for (const descendant of descendants) {
            const hasGroupHover = Array.from(descendant.classList).some((name) =>
                /(^|:)(group-hover(?:\/[^:]+)?|peer-hover(?:\/[^:]+)?):/.test(name)
            );
            if (hasGroupHover) {
                return true;
            }
        }
    }

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

    const handleTrustedPointerDown = (event) => {
        if (!event.isTrusted || !getUiSoundsEnabled()) return;

        // A primeira interação real prepara o áudio; o carregamento e o hover não.
        void requestAudioUnlock();
    };

    const unlockKeys = new Set([
        "Enter", " ", "Spacebar",
        "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown",
        "PageDown", "PageUp", "Home", "End",
    ]);

    const handleTrustedKeyDown = (event) => {
        if (!event.isTrusted || !unlockKeys.has(event.key) || !getUiSoundsEnabled()) return;
        void requestAudioUnlock();
    };

    document.addEventListener("pointerover", handlePointerOver, { passive: true });
    document.addEventListener("pointerdown", handleTrustedPointerDown, { passive: true });
    document.addEventListener("keydown", handleTrustedKeyDown);

    return () => {
        document.removeEventListener("pointerover", handlePointerOver);
        document.removeEventListener("pointerdown", handleTrustedPointerDown);
        document.removeEventListener("keydown", handleTrustedKeyDown);
    };
}

const EXPERIENCE_MODE_KEY = "experienceMode";

function readStoredMode() {
    try {
        return window.localStorage.getItem(EXPERIENCE_MODE_KEY);
    } catch {
        // O modo padrão continua disponível mesmo se o navegador bloquear armazenamento.
        return null;
    }
}

export function getExperienceMode() {
    const mode = readStoredMode();

    if (mode === "reduced" || mode === "full") {
        return mode;
    }

    if (
        typeof window !== "undefined" &&
        typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
        return "reduced";
    }

    return null;
}

export function setExperienceMode(mode) {
    if (mode !== "full" && mode !== "reduced") {
        return;
    }

    try {
        window.localStorage.setItem(EXPERIENCE_MODE_KEY, mode);
    } catch {
        // A preferência do sistema ainda é respeitada quando o armazenamento não está disponível.
    }
}

export function isReducedMotion() {
    return getExperienceMode() === "reduced";
}

export function clearExperienceMode() {
    try {
        window.localStorage.removeItem(EXPERIENCE_MODE_KEY);
    } catch {
        // Não bloquear a navegação por falha no armazenamento local.
    }
}

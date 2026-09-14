const EXPERIENCE_MODE_KEY = "experienceMode";

export function getExperienceMode() {
    const mode = localStorage.getItem(EXPERIENCE_MODE_KEY);

    if (mode === "reduced") {
        return "reduced";
    }

    if (mode === "full") {
        return "full";
    }

    return null;
}

export function setExperienceMode(mode) {
    if (mode !== "full" && mode !== "reduced") {
        return;
    }

    localStorage.setItem(EXPERIENCE_MODE_KEY, mode);
}

export function isReducedMotion() {
    return getExperienceMode() === "reduced";
}

export function clearExperienceMode() {
    localStorage.removeItem(EXPERIENCE_MODE_KEY);
}

let lenisInstance = null;

export function setLenisInstance(instance) {
    lenisInstance = instance;
}

export function stopSmoothScroll() {
    lenisInstance?.stop();
}

export function startSmoothScroll() {
    lenisInstance?.start();
}

export function clearLenisInstance(instance) {
    if (lenisInstance === instance) {
        lenisInstance = null;
    }
}

/**
 * Navega usando o motor de rolagem ativo.
 *
 * Quando Lenis existe, a navegação programática também passa por ele.
 * Sem Lenis (por exemplo, na experiência reduzida), usa a rolagem nativa.
 */
export function scrollToTarget(
    target,
    {
        duration = 1.05,
        offset = 0,
        immediate = false,
        lock = false,
        force = false,
        behavior = "smooth",
        block = "start",
    } = {},
) {
    if (lenisInstance && typeof lenisInstance.scrollTo === "function") {
        // O menu para o Lenis enquanto está aberto; retomamos antes de navegar.
        lenisInstance.start();
        lenisInstance.scrollTo(target, {
            duration,
            offset,
            immediate,
            lock,
            force,
        });
        return true;
    }

    if (typeof target === "number") {
        window.scrollTo({
            top: target,
            behavior: immediate ? "auto" : behavior,
        });
        return true;
    }

    const element = typeof target === "string"
        ? document.querySelector(target)
        : target;

    if (!element || typeof element.scrollIntoView !== "function") {
        return false;
    }

    element.scrollIntoView({
        behavior: immediate ? "auto" : behavior,
        block,
    });
    return true;
}

let lenisInstance = null;

/**
 * Observa o fim de uma rolagem nativa do viewport.
 * O timeout serve como fallback para navegadores sem suporte a scrollend.
 */
function waitForNativeScrollEnd(onComplete, fallbackDelay) {
    let completed = false;
    let fallbackTimeoutId = null;

    const finish = () => {
        if (completed) return;

        completed = true;
        window.removeEventListener("scrollend", finish);
        document.removeEventListener("scrollend", finish);

        if (fallbackTimeoutId !== null) {
            window.clearTimeout(fallbackTimeoutId);
        }

        onComplete();
    };

    window.addEventListener("scrollend", finish);
    document.addEventListener("scrollend", finish);
    fallbackTimeoutId = window.setTimeout(finish, fallbackDelay);

    return finish;
}

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
        duration = 1.4,
        offset = 0,
        immediate = false,
        lock = false,
        force = false,
        behavior = "smooth",
        block = "start",
        onComplete,
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
            ...(typeof onComplete === "function" ? { onComplete } : {}),
        });
        return true;
    }

    if (typeof target === "number") {
        const scrollBehavior = immediate ? "auto" : behavior;
        const currentScrollY = window.scrollY
            ?? document.documentElement.scrollTop
            ?? 0;
        const isAlreadyAtTarget = Math.abs(currentScrollY - target) < 1;
        const completeImmediately = immediate
            || scrollBehavior === "auto"
            || isAlreadyAtTarget;

        if (typeof onComplete === "function" && !completeImmediately) {
            // Registra o observador antes de iniciar a animação de rolagem.
            waitForNativeScrollEnd(
                onComplete,
                Math.max(1800, duration * 1000 + 1200),
            );
        }

        window.scrollTo({
            top: target,
            behavior: scrollBehavior,
        });

        if (typeof onComplete === "function" && completeImmediately) {
            onComplete();
        }

        return true;
    }

    const element = typeof target === "string"
        ? document.querySelector(target)
        : target;

    if (!element || typeof element.scrollIntoView !== "function") {
        return false;
    }

    const scrollBehavior = immediate ? "auto" : behavior;

    if (typeof onComplete === "function" && !immediate && scrollBehavior !== "auto") {
        waitForNativeScrollEnd(
            onComplete,
            Math.max(1800, duration * 1000 + 1200),
        );
    }

    element.scrollIntoView({
        behavior: scrollBehavior,
        block,
    });

    if (typeof onComplete === "function" && (immediate || scrollBehavior === "auto")) {
        onComplete();
    }

    return true;
}

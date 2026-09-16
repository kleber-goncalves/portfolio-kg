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

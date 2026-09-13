let lenisInstance = null;

export function setLenisInstance(instance) {
    lenisInstance = instance;
}

export function clearLenisInstance(instance) {
    if (lenisInstance === instance) {
        lenisInstance = null;
    }
}

export function stopSmoothScroll() {
    if (!lenisInstance) return;

    lenisInstance.stop();

    console.log("🛑 LENIS — STOP");
}

export function startSmoothScroll() {
    if (!lenisInstance) return;

    lenisInstance.start();

    console.log("▶️ LENIS — START");
}

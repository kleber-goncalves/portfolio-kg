import { useEffect } from "react";

import { setLenisInstance, clearLenisInstance } from "../utils/lenisControl";

import { isReducedMotion } from "../utils/experienceMode";


function SmoothScroll({ children }) {
    useEffect(() => {
        // Respeita a experiência reduzida sem baixar o motor de animação.
        if (isReducedMotion()) return;

        let cancelled = false;
        let lenis = null;
        let gsap = null;
        let scrollTrigger = null;
        let update = null;
        let handleScroll = null;

        const initializeSmoothScroll = async () => {
            try {
                const [lenisModule, gsapModule, scrollTriggerModule] = await Promise.all([
                    import("lenis"),
                    import("gsap"),
                    import("gsap/ScrollTrigger"),
                ]);

                if (cancelled) return;

                const Lenis = lenisModule.default;
                gsap = gsapModule.default ?? gsapModule.gsap;
                scrollTrigger = scrollTriggerModule.ScrollTrigger;

                gsap.registerPlugin(scrollTrigger);

                lenis = new Lenis({
                    duration: 1,
                    smoothWheel: true,
                    wheelMultiplier: 1,
                    touchMultiplier: 1,
                    syncTouch: false,
                });

                setLenisInstance(lenis);

                handleScroll = () => scrollTrigger.update();
                lenis.on("scroll", handleScroll);

                update = (time) => {
                    lenis.raf(time * 1000);
                };

                gsap.ticker.add(update);
                gsap.ticker.lagSmoothing(0);
            } catch (error) {
                if (!cancelled) {
                    console.error("Não foi possível inicializar a rolagem suave.", error);
                }
            }
        };

        void initializeSmoothScroll();

        return () => {
            cancelled = true;

            if (lenis && gsap && update) {
                gsap.ticker.remove(update);
                if (handleScroll) lenis.off("scroll", handleScroll);
                lenis.destroy();
                clearLenisInstance(lenis);
            }
        };
    }, []);

    return <>{children}</>;
}

export default SmoothScroll;

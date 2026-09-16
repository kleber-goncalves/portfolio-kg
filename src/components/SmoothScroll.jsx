import { useEffect } from "react";

import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { setLenisInstance, clearLenisInstance } from "../utils/lenisControl";

import { isReducedMotion } from "../utils/experienceMode";

gsap.registerPlugin(ScrollTrigger);

function SmoothScroll({ children }) {
    useEffect(() => {
        const reducedMotion = isReducedMotion();

        // Modo reduzido:
        // não inicializa o Lenis.
        if (reducedMotion) {
            return;
        }

        const lenis = new Lenis({
            duration: 1,
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 1,
            syncTouch: false,
        });

        setLenisInstance(lenis);

        lenis.on("scroll", ScrollTrigger.update);

        const update = (time) => {
            lenis.raf(time * 1000);
        };

        gsap.ticker.add(update);

        gsap.ticker.lagSmoothing(0);

        return () => {
            gsap.ticker.remove(update);

            lenis.off("scroll", ScrollTrigger.update);

            lenis.destroy();

            clearLenisInstance(lenis);
        };
    }, []);

    return <>{children}</>;
}

export default SmoothScroll;

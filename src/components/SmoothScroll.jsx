import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function SmoothScroll({ children }) {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 0.8,

            smoothWheel: true,

            wheelMultiplier: 1,

            touchMultiplier: 1,

            syncTouch: false,
        });

        // =====================================================
        // LENIS → SCROLLTRIGGER
        // =====================================================

        lenis.on("scroll", ScrollTrigger.update);

        // =====================================================
        // LENIS → GSAP TICKER
        // =====================================================

        const update = (time) => {
            lenis.raf(time * 1000);
        };

        gsap.ticker.add(update);

        // Evita atraso adicional causado pelo lag smoothing
        gsap.ticker.lagSmoothing(0);

        // =====================================================
        // CLEANUP
        // =====================================================

        return () => {
            gsap.ticker.remove(update);

            lenis.off("scroll", ScrollTrigger.update);

            lenis.destroy();
        };
    }, []);

    return <>{children}</>;
}

export default SmoothScroll;

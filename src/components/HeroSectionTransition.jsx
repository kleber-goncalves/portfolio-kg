import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

import Hero from "../layout/HeroTeste2";
import Seclogs from "../layout/Logo2";

function HeroSectionTransition() {
    const sectionRef = useRef(null);
    const heroRef = useRef(null);
    const seclogsRef = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const section = sectionRef.current;
            const hero = heroRef.current;
            const seclogs = seclogsRef.current;

            if (!section || !hero || !seclogs) return;

            console.log("====================================");
            console.log("🎬 HERO → SECLOGS TRANSITION");
            console.log("====================================");

            // =========================================
            // SECLOGS COMEÇA ABAIXO DA TELA
            // =========================================

            gsap.set(seclogs, {
                yPercent: 100,
            });

            // =========================================
            // TIMELINE PRINCIPAL
            // =========================================

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: "top top",

                    // Distância total da transição
                    end: "+=1800",

                    scrub: 1,
                    pin: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,

                    markers: false,

                    onUpdate: (self) => {
                        console.log("🔄 TRANSIÇÃO:", self.progress.toFixed(3));
                    },
                },
            });

            // =========================================
            // 1. SECLOGS SOBE
            // =========================================

            tl.to(
                seclogs,
                {
                    yPercent: 0,
                    ease: "none",
                    duration: 1,
                },
                0,
            );

            // =========================================
            // 2. HERO PERDE OPACIDADE
            // =========================================

            tl.to(
                hero,
                {   
                    opacity: 0.55,
                    ease: "none",
                    duration: 1,
                },
                0,
            );

            // =========================================
            // 3. HOLD
            // =========================================
            //
            // Depois que a Seclogs chega no topo,
            // ela permanece parada durante este trecho.
            //
            // Como estamos usando scrub, isso representa
            // uma distância adicional de scroll.
            //
            // 1.2 = hold perceptível
            //

            tl.to(
                {},
                {
                    duration: 1.2,
                },
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="
                relative
                w-full
                h-screen
                overflow-hidden
            "
        >
            {/* =========================================
                HERO
            ========================================= */}

            <div
                ref={heroRef}
                className="
                    absolute
                    inset-0
                    z-0
                    w-full
                    h-full
                "
            >
                <Hero />
            </div>

            {/* =========================================
                SECLOGS
            ========================================= */}

            <div
                ref={seclogsRef}
                className="
                    absolute
                    inset-0
                    z-20
                    w-full
                    h-auto
                    bg-obsidian

                "
            >
                <Seclogs />
            </div>
        </section>
    );
}

export default HeroSectionTransition;

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

            /* =====================================================
                ELEMENTOS DO HERO
            ====================================================== */

            const heroTitle = hero.querySelector('[data-hero-element="title"]');

            const heroText = hero.querySelector('[data-hero-element="text"]');

            const heroVisual = hero.querySelector('[data-hero-element="visual"]');

            const heroDotField = hero.querySelector('[data-hero-element="dotfield"]');

            const heroArrow = hero.querySelector('[data-hero-element="arrow"]');

            /* =====================================================
                ESTADO INICIAL
            ====================================================== */

            gsap.set(seclogs, {
                yPercent: 100,
            });

            gsap.set(hero, {
                opacity: 1,
            });

            gsap.set(heroArrow, {
                rotation: 0,
                transformOrigin: "center center",
            });

            /* =====================================================
                TIMELINE PRINCIPAL
            ====================================================== */

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,

                    start: "top top",

                    end: "+=1800",

                    scrub: true,

                    pin: true,

                    anticipatePin: 1,

                    invalidateOnRefresh: true,

                    markers: false,

                    onUpdate: (self) => {
                        console.log("🔄 TRANSIÇÃO:", self.progress.toFixed(3));
                    },
                },
            });

            /* =====================================================
                SECLOGS
            ====================================================== */

            tl.to(
                seclogs,
                {
                    yPercent: 0,
                    ease: "none",
                    duration: 1,
                },
                0,
            );

            /* =====================================================
                OPACIDADE DO HERO
            ====================================================== */

            tl.to(
                hero,
                {
                    opacity: 0.55,
                    ease: "none",
                    duration: 1,
                },
                0,
            );

            /* =====================================================
                DOT FIELD
            ====================================================== */

            /*
                O DotField está dentro do Hero.
                Por isso ele já acompanha automaticamente
                a opacidade do Hero.
            */

            if (heroDotField) {
                gsap.set(heroDotField, {
                    opacity: 1,
                });
            }

            /* =====================================================
                FOTO
            ====================================================== */

            if (heroVisual) {
                tl.to(
                    heroVisual,
                    {
                        scale: 0.88,
                        ease: "none",
                        duration: 1,
                    },
                    0,
                );
            }

            /* =====================================================
                TÍTULO
            ====================================================== */

            if (heroTitle) {
                tl.to(
                    heroTitle,
                    {
                        scale: 0.84,
                        ease: "none",
                        duration: 1,
                    },
                    0,
                );
            }

            /* =====================================================
                TEXTO
            ====================================================== */

            if (heroText) {
                tl.to(
                    heroText,
                    {
                        scale: 0.9,
                        ease: "none",
                        duration: 1,
                    },
                    0,
                );
            }

            /* =====================================================
                SETA
                ↘  →  ↓
            ====================================================== */

            if (heroArrow) {
                tl.to(
                    heroArrow,
                    {
                        rotation: 45,
                        ease: "none",
                        duration: 1,
                    },
                    0,
                );
            }

            /* =====================================================
                HOLD
            ====================================================== */

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
            {/* =====================================================
                HERO
            ====================================================== */}

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

            {/* =====================================================
                SECLOGS
            ====================================================== */}

            <div
                ref={seclogsRef}
                className="
                    absolute
                    inset-0
                    z-20
                    w-full
                    h-auto
                    bg-obsidian
                    shadow-[0_-25px_60px_rgba(0,0,0,0.55)]
                "
            >
                <Seclogs />
            </div>
        </section>
    );
}

export default HeroSectionTransition;

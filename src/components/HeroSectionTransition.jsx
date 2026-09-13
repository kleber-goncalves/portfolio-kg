import { useLayoutEffect, useRef, useState } from "react";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

import Hero from "../layout/HeroTeste2";
import Seclogs from "../layout/Logo2";

function HeroSectionTransition() {
    const sectionRef = useRef(null);
    const heroRef = useRef(null);
    const seclogsRef = useRef(null);

    const [dotFieldFrozen, setDotFieldFrozen] = useState(false);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const section = sectionRef.current;

            const hero = heroRef.current;

            const seclogs = seclogsRef.current;

            if (!section || !hero || !seclogs) {
                return;
            }

            const mm = gsap.matchMedia();

            mm.add("(min-width: 768px)", () => {
                /* =================================================
                        ELEMENTOS
                    ================================================== */

                const heroTitle = hero.querySelector('[data-hero-element="title"]');

                const heroText = hero.querySelector('[data-hero-element="text"]');

                const heroVisual = hero.querySelector('[data-hero-element="visual"]');

                const heroDotField = hero.querySelector('[data-hero-element="dotfield"]');

                const heroArrow = hero.querySelector('[data-hero-element="arrow"]');

                const globalBlur = document.querySelector(".global-gradual-blur");

                /* =================================================
                        ESTADO INICIAL
                    ================================================== */

                gsap.set(seclogs, {
                    yPercent: 100,
                });

                gsap.set(hero, {
                    opacity: 1,
                });

                if (heroArrow) {
                    gsap.set(heroArrow, {
                        rotation: 0,
                        transformOrigin: "center center",
                    });
                }

                if (globalBlur) {
                    gsap.set(globalBlur, {
                        opacity: 0,
                    });
                }

                /* =================================================
                        TIMELINE
                    ================================================== */

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
                            /*
                                    ========================================
                                    QUANTO DA SEÇÃO 2 JÁ COBRIU DO HERO?
                                    ========================================
                                    */

                            const seclogsRect = seclogs.getBoundingClientRect();

                            const heroRect = hero.getBoundingClientRect();

                            const coveredAmount = Math.max(0, heroRect.bottom - seclogsRect.top);

                            /*
                                    ========================================
                                    REGRA
                                    ========================================

                                    0 → 299px
                                    DotField acompanha mouse.

                                    300px+
                                    DotField congela.
                                    ========================================
                                    */

                            const shouldFreeze = coveredAmount >= 300;

                            console.log("📊 SCROLLTRIGGER", {
                                progress: Number(self.progress.toFixed(3)),

                                coveredAmount: Math.round(coveredAmount),

                                shouldFreeze,
                            });

                            setDotFieldFrozen((previous) => {
                                if (previous !== shouldFreeze) {
                                    console.log(`❄️ ALTERANDO DOTFIELD: ${previous} → ${shouldFreeze}`);

                                    return shouldFreeze;
                                }

                                return previous;
                            });
                        },

                        /*
                                ========================================
                                QUANDO CHEGA AO FINAL
                                ========================================
                                */

                        onLeave: () => {
                            console.log("❄️ DOTFIELD: onLeave → TRUE");

                            setDotFieldFrozen(true);
                        },

                        /*
                                ========================================
                                VOLTANDO PARA CIMA
                                ========================================
                                */

                        onEnterBack: () => {
                            const seclogsRect = seclogs.getBoundingClientRect();

                            const heroRect = hero.getBoundingClientRect();

                            const coveredAmount = Math.max(0, heroRect.bottom - seclogsRect.top);

                            const shouldFreeze = coveredAmount >= 300;

                            console.log("🔙 VOLTANDO", {
                                coveredAmount: Math.round(coveredAmount),

                                shouldFreeze,
                            });

                            setDotFieldFrozen(shouldFreeze);
                        },
                    },
                });

                /* =================================================
                        SECLOGS
                    ================================================== */

                tl.to(
                    seclogs,
                    {
                        yPercent: 0,
                        ease: "none",
                        duration: 1,
                    },
                    0,
                );

                /* =================================================
                        OPACIDADE HERO
                    ================================================== */

                tl.to(
                    hero,
                    {
                        opacity: 0.55,
                        ease: "none",
                        duration: 1,
                    },
                    0,
                );

                /* =================================================
                        DOT FIELD
                    ================================================== */

                if (heroDotField) {
                    gsap.set(heroDotField, {
                        opacity: 1,
                    });
                }

                /* =================================================
                        FOTO
                    ================================================== */

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

                /* =================================================
                        TÍTULO
                    ================================================== */

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

                /* =================================================
                        TEXTO
                    ================================================== */

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

                /* =================================================
                        SETA
                    ================================================== */

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

                /* =================================================
                        BLUR
                    ================================================== */

                if (globalBlur) {
                    tl.to(
                        globalBlur,
                        {
                            opacity: 1,
                            ease: "none",
                            duration: 0.25,
                        },
                        1,
                    );
                }

                /* =================================================
                        HOLD
                    ================================================== */

                tl.to(
                    {},
                    {
                        duration: 0.9,
                    },
                );

                return () => {
                    tl.kill();
                };
            });
        }, sectionRef);

        return () => {
            ctx.revert();
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            className="
                relative
                w-full

                h-auto

                md:h-screen
                md:overflow-hidden
            "
        >
            {/* =====================================================
                HERO
            ====================================================== */}

            <div
                ref={heroRef}
                className="
                    relative
                    z-0
                    w-full

                    md:absolute
                    md:inset-0
                    md:h-full
                "
            >
                <Hero dotFieldFrozen={dotFieldFrozen} />
            </div>

            {/* =====================================================
                SECLOGS
            ====================================================== */}

            <div
                ref={seclogsRef}
                className="
                    relative
                    z-20
                    w-full
                    bg-obsidian
                    md:shadow-[0_-25px_60px_rgba(0,0,0,0.55)]

                    md:absolute
                    md:inset-0
                    md:h-auto
                "
            >
                <Seclogs />
            </div>
        </section>
    );
}

export default HeroSectionTransition;

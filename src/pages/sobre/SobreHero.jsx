import { useEffect, useRef } from "react";
import { gsap } from "gsap";

import GlobeIcon from "../../components/GlobeIcon";
import "../../styles/sobreHeroPortrait.css";

function SobreHero({ experienceMode = "full" }) {
    const portraitRef = useRef(null);
    const isReducedExperience = experienceMode === "reduced";

    useEffect(() => {
        const portrait = portraitRef.current;

        if (!portrait || isReducedExperience) return undefined;

        // Mantém os efeitos restritos a mouse/trackpad reais.
        const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");

        if (!mediaQuery.matches) return undefined;

        const handleMouseEnter = () => {
            portrait.style.setProperty("--spotlight-opacity", "1");
            portrait.style.setProperty("--border-glow-opacity", "1");

            gsap.to(portrait, {
                y: -3,
                duration: 0.35,
                ease: "power2.out",
                overwrite: true,
            });
        };

        const handleMouseMove = (event) => {
            const rect = portrait.getBoundingClientRect();

            if (!rect.width || !rect.height) return;

            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            portrait.style.setProperty("--mouse-x", `${(x / rect.width) * 100}%`);
            portrait.style.setProperty("--mouse-y", `${(y / rect.height) * 100}%`);

            // Inclinação 3D sutil, igual à intensidade editorial do Card1.
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -1.5;
            const rotateY = ((x - centerX) / centerX) * 1.5;

            gsap.to(portrait, {
                rotateX,
                rotateY,
                duration: 0.18,
                ease: "power2.out",
                transformPerspective: 500,
                overwrite: true,
            });
        };

        const handleMouseLeave = () => {
            portrait.style.setProperty("--spotlight-opacity", "0");
            portrait.style.setProperty("--border-glow-opacity", "0");

            gsap.to(portrait, {
                y: 0,
                rotateX: 0,
                rotateY: 0,
                duration: 0.5,
                ease: "power3.out",
                overwrite: true,
            });
        };

        portrait.addEventListener("mouseenter", handleMouseEnter);
        portrait.addEventListener("mousemove", handleMouseMove);
        portrait.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            portrait.removeEventListener("mouseenter", handleMouseEnter);
            portrait.removeEventListener("mousemove", handleMouseMove);
            portrait.removeEventListener("mouseleave", handleMouseLeave);

            gsap.killTweensOf(portrait);
            gsap.set(portrait, {
                y: 0,
                rotateX: 0,
                rotateY: 0,
                clearProps: "transform",
            });

            portrait.style.setProperty("--spotlight-opacity", "0");
            portrait.style.setProperty("--border-glow-opacity", "0");
        };
    }, [isReducedExperience]);

    return (
        <section aria-labelledby="sobre-hero-title" className="relative isolate overflow-x-clip border-b border-graphite/80">
            <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 hidden w-[38%] b-md:block" />

            <div
                className="
                    relative
                    mx-auto
                    grid
                    w-full
                    b-md:max-w-[1500px]
                    grid-cols-1

                    gap-12
                    px-5
                    py-12

                    b-md:grid-cols-[minmax(0,1.08fr)_minmax(280px,0.92fr)]
                    b-md:gap-12
                    b-md:px-10
                    b-md:py-16

                    c-lg:gap-16
                    c-lg:py-20
                "
            >
                <div className="relative z-10 max-w-2xl b-md:sticky b-md:top-24 b-md:self-start">
                    <h1
                        id="sobre-hero-title"
                        className="
                            max-w-[11ch]
                            font-space
                            text-5xl
                            font-medium
                            leading-[0.94]
                            tracking-[-0.06em]
                            text-ivory

                            b-md:text-6xl
                            c-lg:text-7xl
                            d-xl:text-8xl
                        "
                    >
                        Da interface
                        <br />
                        ao <span className="text-bronze">sistema.</span>
                    </h1>

                    <p className="mt-6 max-w-xl text-sm leading-7 text-steel b-md:text-base b-md:leading-8">Desenvolvo aplicações web pensando não só na interface, mas também em como APIs, dados, desempenho e organização do código se conectam.</p>
                </div>

                <div className="relative mx-auto w-full max-w-[350px] pb-5 b-md:max-w-[720px] b-md:pb-0 b-md:justify-self-end">
                    <div className="relative aspect-[4/5] w-full">
                        <div
                            ref={portraitRef}
                            className="sobre-hero-portrait absolute inset-0 overflow-hidden border border-graphite bg-carbon"
                        >
                            <img src="/euNvEnvt.png" alt="Retrato de Kleber Gonçalves" loading="eager" fetchPriority="high" decoding="async" className="absolute inset-0 h-full w-full object-cover object-top" />

                            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[24%] bg-gradient-to-t from-obsidian/70 to-transparent" />

                            {!isReducedExperience && (
                                <>
                                    <span
                                        aria-hidden="true"
                                        className="sobre-hero-portrait__spotlight pointer-events-none absolute inset-0"
                                    />
                                    <span
                                        aria-hidden="true"
                                        className="sobre-hero-portrait__glow pointer-events-none absolute inset-0"
                                    />
                                </>
                            )}
                        </div>
                    </div>

                    <div
                        aria-hidden="true"
                        className="
                            absolute
                            left-1/2
                            -bottom-[5.75rem]
                            b-md:-bottom-[6.75rem]
                            c-lg:-bottom-[7.75rem]
                            z-20
                            flex
                            h-22
                            w-22
                            -translate-x-1/2
                            items-center
                            justify-center
                            overflow-hidden
                            rounded-full
                            border
                            border-graphite
                            bg-obsidian
                        "
                    >
                        <GlobeIcon />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default SobreHero;

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

import Socials from "../components/Socials";
import { ArrowDownRight } from "lucide-react";
import "../styles/looptextHero.css";
import "../styles/heroParallax.css";

function HeroDesktop({ items }) {
      const heroRef = useRef(null);

      useLayoutEffect(() => {
          console.log("====================================");
          console.log("🚀 HERO DESKTOP MONTADO");
          console.log("====================================");

          const hero = heroRef.current;

          console.log("heroRef:", hero);
          console.log("hero element:", hero?.tagName);
          console.log("hero class:", hero?.className);

          if (!hero) {
              console.error("❌ heroRef.current NÃO EXISTE");
              return;
          }

          const rect = hero.getBoundingClientRect();

          console.log("📐 HERO DIMENSÕES");
          console.log("width:", rect.width);
          console.log("height:", rect.height);
          console.log("top:", rect.top);
          console.log("bottom:", rect.bottom);

          console.log("📏 WINDOW");
          console.log("innerWidth:", window.innerWidth);
          console.log("innerHeight:", window.innerHeight);

          console.log("📌 COMPUTED STYLE");

          const styles = window.getComputedStyle(hero);

          console.log("position:", styles.position);
          console.log("top:", styles.top);
          console.log("z-index:", styles.zIndex);
          console.log("height:", styles.height);
          console.log("min-height:", styles.minHeight);
          console.log("overflow:", styles.overflow);

          console.log("====================================");

          const ctx = gsap.context(() => {
              const animation = gsap.to(hero, {
                  opacity: 0.55,

                  scrollTrigger: {
                      trigger: hero,

                      start: "top top",

                      end: "bottom top",

                      scrub: true,

                      markers: false,

                      invalidateOnRefresh: true,

                      onEnter: () => {
                          console.log("🟢 ScrollTrigger → onEnter");
                      },

                      onUpdate: (self) => {
                          console.log("🔄 ScrollTrigger progress:", self.progress.toFixed(3));
                      },

                      onLeave: () => {
                          console.log("🔴 ScrollTrigger → onLeave");
                      },

                      onEnterBack: () => {
                          console.log("🔵 ScrollTrigger → onEnterBack");
                      },

                      onLeaveBack: () => {
                          console.log("⚪ ScrollTrigger → onLeaveBack");
                      },
                  },
              });

              console.log("🎬 ANIMAÇÃO CRIADA:", animation);

              console.log("🎯 ScrollTrigger:", animation.scrollTrigger);
          }, heroRef);

          return () => {
              console.log("🧹 HERO DESKTOP DESMONTADO");
              ctx.revert();
          };
      }, []);
    
    return (
        <section
            ref={heroRef}
            className="
    hero-desktop
    relative
    z-0
    w-full
    h-screen
    overflow-hidden
"
        >
            {/* =====================================================
                HERO STICKY
            ====================================================== */}

            {/* =================================================
                    CONTEÚDO DO HERO
                ================================================== */}

            <div
                className="
                        relative
                        flex
                        h-full
                        w-full
                        items-center
                        justify-center
                        overflow-hidden
                    "
            >
                {/* =================================================
                        LOGO
                    ================================================== */}

                <div
                    className="
                            absolute
                            left-8
                            top-8
                            z-40

                            lg:left-18
                            lg:top-10
                        "
                >
                    <div
                        className="
                                h-10
                                w-10

                                lg:h-11
                                lg:w-11
                            "
                    >
                        <img src="/logo.svg" alt="Kleber Dev" className="h-full w-full" />
                    </div>
                </div>

                {/* =================================================
                        NAVEGAÇÃO
                    ================================================== */}

                <nav
                    aria-label="Navegação principal"
                    className="
                            absolute
                            right-8
                            top-8
                            z-40

                            flex
                            items-center
                            gap-5

                            lg:right-17
                            lg:top-10
                            lg:gap-7
                        "
                >
                    {items.map((item) => (
                        <a
                            key={item.href}
                            href={item.href}
                            className="
                                    group
                                    flex
                                    items-center
                                    gap-2

                                    font-space
                                    text-[9px]
                                    uppercase
                                    tracking-[0.12em]

                                    text-steel

                                    transition-colors
                                    duration-300

                                    hover:text-bronze

                                    lg:text-[10px]
                                "
                        >
                            <span>{item.label}</span>
                        </a>
                    ))}
                </nav>

                {/* =================================================
                        FOTO CENTRAL
                    ================================================== */}

                <div
                    className="
                            absolute
                            left-1/2
                            top-1/2
                            z-10

                            h-[122vh]
                            w-[420px]

                            -translate-x-1/2
                            -translate-y-1/2

                            overflow-hidden

                            lg:w-[440px]
                            xl:w-[970px]
                        "
                >
                    <img
                        src="/euNv.png"
                        alt="Kleber Dev"
                        className="
                                h-full
                                w-full
                                object-cover
                                object-top
                            "
                    />

                    {/* =================================================
                            GRADIENTE INFERIOR
                        ================================================== */}

                    <div
                        aria-hidden="true"
                        className="
                                pointer-events-none
                                absolute
                                inset-x-0
                                bottom-0
                                h-[40%]

                                bg-gradient-to-t
                                from-obsidian
                                via-obsidian/20
                                to-transparent
                            "
                    />
                </div>

                {/* =================================================
                        MARQUEE — NOME
                    ================================================== */}

                <div
                    aria-hidden="true"
                    className="
                            pointer-events-none
                            absolute
                            left-85
                            bottom-[-4%]
                            z-20

                            w-full

                            overflow-hidden
                            select-none
                        "
                >
                    <div className="marquee-contentHero">
                        <span className="font-bebas">KLEBER DEV</span>
                    </div>
                </div>

                {/* =================================================
                        BLOCO ESQUERDO
                    ================================================== */}

                <div
                    className="
                            absolute
                            left-0
                            top-83
                            z-30

                            hidden

                            -translate-y-1/2

                            lg:flex
                        "
                >
                    <div
                        className="
                                flex
                                items-center

                                rounded-r-full

                                border
                                border-graphite

                                bg-carbon

                                py-3
                                pl-8
                                pr-3
                            "
                    >
                        <div
                            className="
                                    flex
                                    flex-col
                                    gap-1
                                "
                        >
                            <span
                                className="
                                        font-bebas
                                        text-[14px]
                                        uppercase
                                        tracking-[0.22em]
                                        text-steel/50
                                    "
                            >
                                Localização
                            </span>

                            <span
                                className="
                                        font-space
                                        text-xl
                                        font-medium
                                        text-ivory
                                    "
                            >
                                Brasil
                            </span>
                        </div>

                        <div
                            className="
                                    ml-6
                                    flex
                                    h-12
                                    w-12
                                    items-center
                                    justify-center

                                    rounded-full

                                    border
                                    border-graphite

                                    bg-obsidian

                                    text-bronze
                                "
                        >
                            <span className="text-lg">◉</span>
                        </div>
                    </div>
                </div>

                {/* =================================================
                        BLOCO DIREITO
                    ================================================== */}

                <div
                    className="
                            absolute
                            right-[7%]
                            top-78
                            z-30

                            hidden
                            w-[300px]

                            -translate-y-1/2

                            lg:flex
                            lg:flex-col

                            xl:right-[0%]
                            xl:w-[340px]
                        "
                >
                    {/* SETA */}

                    <div
                        className="
                                mb-10
                                flex
                                justify-start
                            "
                    >
                        <ArrowDownRight
                            className="
                                    h-8
                                    w-8

                                    stroke-[1]

                                    text-ivory/80
                                "
                        />
                    </div>

                    {/* CARGO */}

                    <div
                        className="
                                flex
                                flex-col
                            "
                    >
                        <h2
                            className="
                                    font-space
                                    text-4xl
                                    font-medium
                                    leading-[0.95]
                                    tracking-[-0.04em]

                                    text-ivory

                                    lg:text-5xl
                                    xl:text-6xl
                                "
                        >
                            Software
                            <br />
                            Developer
                        </h2>

                        <p
                            className="
                                    mt-5

                                    max-w-[280px]

                                    text-sm
                                    leading-6

                                    text-steel/60
                                "
                        >
                            Frontend · Backend · Fullstack
                        </p>
                    </div>
                </div>

                {/* =================================================
                        SOCIALS
                    ================================================== */}

                <div
                    className="
                            absolute
                            bottom-8
                            left-8
                            z-40

                            lg:bottom-10
                            lg:left-10
                        "
                >
                    <Socials />
                </div>
            </div>
        </section>
    );
}

export default HeroDesktop;

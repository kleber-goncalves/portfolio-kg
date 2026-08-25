import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

function Projetos() {
    const sectionRef = useRef(null);
    const trackRef = useRef(null);

    useGSAP(
        () => {
            const section = sectionRef.current;
            const track = trackRef.current;

            if (!section || !track) return;

            const getScrollAmount = () => {
                return track.scrollWidth - window.innerWidth;
            };

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,

                    start: "top top",

                    end: () => `+=${getScrollAmount() * 4}`,

                    pin: true,

                    scrub: 1,

                    invalidateOnRefresh: true,

                    markers: false,
                },
            });

            // PAUSA INICIAL
            tl.to({}, {
                duration: 10,
            });

            // MOVIMENTO HORIZONTAL
            tl.to(track, {
                x: () => -getScrollAmount(),
                duration: 90,
                ease: "none",
            });
        },
        {
            scope: sectionRef,
        },
    );

    return (
        <section className="bg-obsidian w-full">
            <div
                ref={sectionRef}
                className="relative w-full h-screen overflow-hidden"
            >
                {/* TÍTULO */}

                <div className="absolute top-0 left-0 z-20 flex flex-row items-center gap-2 w-full pt-12 p-5 md:p-10">
                    <h2 className="text-sm md:text-7xl text-steel uppercase whitespace-nowrap">
                        // Projetos
                    </h2>

                    <span className="flex-1 h-0.5 md:h-1 bg-gradientaa"></span>
                </div>

                {/* TRACK */}

                <div className="relative w-full h-full flex items-center">
                    <div
                        ref={trackRef}
                        className="flex w-max items-center gap-6"
                        style={{
                            paddingLeft: "6vw",
                            paddingRight: "6vw",
                        }}
                    >
                        {/* PROJETO 01 */}

                        <article className="h-[70vh] w-[80vw] shrink-0 rounded-3xl bg-neutral-900">
                            <div className="flex h-full flex-col justify-end p-6">
                                <span className="text-white/50">01</span>

                                <h2 className="text-4xl font-bold text-white">
                                    Projeto 01
                                </h2>
                            </div>
                        </article>

                        {/* PROJETO 02 */}

                        <article className="h-[70vh] w-[80vw] shrink-0 rounded-3xl bg-neutral-800">
                            <div className="flex h-full flex-col justify-end p-6">
                                <span className="text-white/50">02</span>

                                <h2 className="text-4xl font-bold text-white">
                                    Projeto 02
                                </h2>
                            </div>
                        </article>

                        {/* PROJETO 03 */}

                        <article className="h-[70vh] w-[80vw] shrink-0 rounded-3xl bg-neutral-700">
                            <div className="flex h-full flex-col justify-end p-6">
                                <span className="text-white/50">03</span>

                                <h2 className="text-4xl font-bold text-white">
                                    Projeto 03
                                </h2>
                            </div>
                        </article>

                        {/* PROJETO 04 */}

                        <article className="h-[70vh] w-[80vw] shrink-0 rounded-3xl bg-neutral-600">
                            <div className="flex h-full flex-col justify-end p-6">
                                <span className="text-white/50">04</span>

                                <h2 className="text-4xl font-bold text-white">
                                    Projeto 04
                                </h2>
                            </div>
                        </article>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Projetos;

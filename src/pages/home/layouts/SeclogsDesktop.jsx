import { useEffect, useLayoutEffect, useRef } from "react";

import FlowingMenu from "../components/FlowingMenu";
import { flowingItems } from "../data/seclogsDesktop.data.jsx";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function SeclogsDesktop({ sectionRef, onReady }) {
    const desktopTitleRef = useRef(null);
    const desktopLineRef = useRef(null);
    const desktopDescriptionRef = useRef(null);

    useLayoutEffect(() => {
        const section = sectionRef.current;

        if (!section) return;

        const ctx = gsap.context(() => {
// DESKTOP — SOMENTE CABEÇALHO
            // =================================================

            const desktopElements = [desktopTitleRef.current, desktopLineRef.current, desktopDescriptionRef.current].filter(Boolean);

            gsap.set(desktopElements, {
                opacity: 0,
                y: 50,
            });

            const desktopTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                    end: "top 45%",
                    scrub: 1,
                    markers: false,
                },
            });

            desktopTimeline
                .to(
                    desktopTitleRef.current,
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.7,
                        ease: "power3.out",
                    },
                    0,
                )

                .to(
                    desktopLineRef.current,
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        ease: "power3.out",
                    },
                    0.15,
                )

                .to(
                    desktopDescriptionRef.current,
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.7,
                        ease: "power3.out",
                    },
                    0.3,
                );

            // =================================================
        }, section);

        return () => ctx.revert();
    }, [sectionRef]);

    useEffect(() => {
        onReady?.("desktop");
    }, [onReady]);

    return (
        <>
            <div
                className="
                    flex
                    w-full
                    flex-col
                    items-start
                    gap-2
                    p-5
                    mb-3
                    pl-26
                "
            >
                <h2
                    ref={desktopTitleRef}
                    className="
                        whitespace-nowrap
                        text-steel
                        text-7xl
                    "
                >
                    // TECNOLOGIAS & FERRAMENTAS
                </h2>

                <span
                    ref={desktopLineRef}
                    className="
                        h-1
                        flex-1
                        bg-gradientaa
                    "
                />

                <p
                    ref={desktopDescriptionRef}
                    className="
                        max-w-md
                        text-steel
                        pl-34
                        text-sm
                        leading-6
                    "
                >
                    Ferramenta não é diferencial. Decisão técnica é.
                </p>
            </div>

            <div className="relative w-full overflow-hidden">
                <div className="h-[360px] w-full">
                    <FlowingMenu items={flowingItems} speed={20} textColor="#F2F0EC" bgColor="#0d0d0d" marqueeBgColor="#d8c2aa" marqueeTextColor="#0D0D0D" borderColor="#242424" />
                </div>
            </div>
        </>
    );
}

export default SeclogsDesktop;

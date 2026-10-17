import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";

import useResponsive from "../hooks/useResponsive";

const SeclogsMobile = lazy(() => import("./SeclogsMobile"));
const SeclogsDesktop = lazy(() => import("./SeclogsDesktop"));

function Seclogs({ onReady }) {
    const { isMobileLayout } = useResponsive();
    const sectionRef = useRef(null);
    const [shouldLoadMobile, setShouldLoadMobile] = useState(false);

    useEffect(() => {
        if (!isMobileLayout || shouldLoadMobile) return undefined;

        const section = sectionRef.current;
        if (!section) return undefined;

        if (!("IntersectionObserver" in window)) {
            setShouldLoadMobile(true);
            return undefined;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (!entries.some((entry) => entry.isIntersecting)) return;

                observer.disconnect();
                setShouldLoadMobile(true);
            },
            {
                rootMargin: "0px",
                threshold: 0,
            },
        );

        observer.observe(section);
        return () => observer.disconnect();
    }, [isMobileLayout, shouldLoadMobile]);

    const handleMobileReady = useCallback(() => {
        onReady?.("mobile");
    }, [onReady]);

    const handleDesktopReady = useCallback(() => {
        onReady?.("desktop");
    }, [onReady]);

    const stackPlaceholder = (
        <div
            aria-hidden="true"
            className={
                isMobileLayout
                    ? "min-h-[560px] w-full"
                    : "min-h-[470px] w-full"
            }
        />
    );

    return (
        <section
            id="stack"
            ref={sectionRef}
            className="
                relative
                mb-14
                flex
                w-full
                flex-col
                overflow-hidden
                bg-obsidian
                min-h-[560px]

                b-md:mt-34
                mt-30
                b-md:shadow-t-2xl
                b-md:shadow-black
            "
        >
            <Suspense fallback={stackPlaceholder}>
                {isMobileLayout ? (
                    shouldLoadMobile ? (
                        <SeclogsMobile
                            sectionRef={sectionRef}
                            onReady={handleMobileReady}
                        />
                    ) : (
                        stackPlaceholder
                    )
                ) : (
                    <SeclogsDesktop
                        sectionRef={sectionRef}
                        onReady={handleDesktopReady}
                    />
                )}
            </Suspense>
        </section>
    );
}

export default Seclogs;

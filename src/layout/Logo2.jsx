import { lazy, Suspense, useCallback, useRef } from "react";

import useResponsive from "../hooks/useResponsive";

const SeclogsMobile = lazy(() => import("./SeclogsMobile"));
const SeclogsDesktop = lazy(() => import("./SeclogsDesktop"));

function Seclogs({ onReady }) {
    const { isMobileLayout } = useResponsive();
    const sectionRef = useRef(null);

    const handleMobileReady = useCallback(() => {
        onReady?.("mobile");
    }, [onReady]);

    const handleDesktopReady = useCallback(() => {
        onReady?.("desktop");
    }, [onReady]);

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

                b-md:mt-34
                mt-30
                b-md:shadow-t-2xl
                b-md:shadow-black
            "
        >
            <Suspense
                fallback={
                    <div
                        aria-hidden="true"
                        className={
                            isMobileLayout
                                ? "min-h-[560px] w-full"
                                : "min-h-[470px] w-full"
                        }
                    />
                }
            >
                {isMobileLayout ? (
                    <SeclogsMobile
                        sectionRef={sectionRef}
                        onReady={handleMobileReady}
                    />
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

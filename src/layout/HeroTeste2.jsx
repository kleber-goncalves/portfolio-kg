import { lazy, Suspense } from "react";
import { NAVIGATION_ITEMS } from "../data/navigation";

const HeroMobile = lazy(() => import("../components/HeroMobile"));
const HeroDesktop = lazy(() => import("../components/HeroDesktop"));

function Hero({ isMobileLayout, isCompactLandscape = false, isTablet = false, dotFieldFrozen = false, onNavigate, onReady, experienceMode = "full" }) {

    return (
        <section id="hero" className="relative">
            {isMobileLayout ? (
                <div className="p-5">
                    <Suspense fallback={<div aria-hidden="true" className="min-h-[calc(100svh-2.5rem)]" />}>
                        <HeroMobile items={NAVIGATION_ITEMS} onReady={onReady} isCompactLandscape={isCompactLandscape} isTablet={isTablet} />
                    </Suspense>
                </div>
            ) : (
                <Suspense fallback={<div aria-hidden="true" className="h-screen w-full" />}>
                    <HeroDesktop items={NAVIGATION_ITEMS} dotFieldFrozen={dotFieldFrozen} onNavigate={onNavigate} onReady={onReady} experienceMode={experienceMode} />
                </Suspense>
            )}
        </section>
    );
}

export default Hero;

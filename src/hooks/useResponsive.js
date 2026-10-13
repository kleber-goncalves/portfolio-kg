import { useEffect, useState } from "react";

const COMPACT_LANDSCAPE_QUERY =
    "(orientation: landscape) and (max-height: 600px)";
const TOUCH_QUERY = "(hover: none) and (pointer: coarse)";

function readResponsiveState() {
    if (typeof window === "undefined") {
        return {
            width: 0,
            height: 0,
            isCompactLandscape: false,
            isTouch: false,
        };
    }

    return {
        width: window.innerWidth,
        height: window.innerHeight,
        isCompactLandscape: window.matchMedia(COMPACT_LANDSCAPE_QUERY).matches,
        isTouch: window.matchMedia(TOUCH_QUERY).matches,
    };
}

/**
 * Centraliza a leitura do viewport para decisões de layout e comportamento.
 * As classes Tailwind responsivas usam variantes definidas em App.css.
 */
export default function useResponsive() {
    const [viewport, setViewport] = useState(readResponsiveState);

    useEffect(() => {
        const updateViewport = () => {
            const next = readResponsiveState();

            setViewport((current) => {
                if (
                    current.width === next.width &&
                    current.height === next.height &&
                    current.isCompactLandscape === next.isCompactLandscape &&
                    current.isTouch === next.isTouch
                ) {
                    return current;
                }

                return next;
            });
        };

        window.addEventListener("resize", updateViewport, { passive: true });
        window.addEventListener("orientationchange", updateViewport);

        const compactLandscape = window.matchMedia(COMPACT_LANDSCAPE_QUERY);
        const touch = window.matchMedia(TOUCH_QUERY);

        compactLandscape.addEventListener("change", updateViewport);
        touch.addEventListener("change", updateViewport);

        return () => {
            window.removeEventListener("resize", updateViewport);
            window.removeEventListener("orientationchange", updateViewport);
            compactLandscape.removeEventListener("change", updateViewport);
            touch.removeEventListener("change", updateViewport);
        };
    }, []);

    const isMobileLayout = viewport.width < 768 || viewport.isCompactLandscape;
    const isTablet = !isMobileLayout && viewport.width >= 768 && viewport.width < 1024;
    const isDesktop = !isMobileLayout && viewport.width >= 1024;

    return {
        width: viewport.width,
        height: viewport.height,
        isCompactLandscape: viewport.isCompactLandscape,
        isMobileLayout,
        isTablet,
        isDesktop,
        isTouch: viewport.isTouch,
    };
}

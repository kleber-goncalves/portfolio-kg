import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

const ENTRANCE_SELECTORS = {
    header: '[data-route-entrance="header"]',
    title: '[data-route-entrance="title"]',
    description: '[data-route-entrance="description"]',
    visual: '[data-route-entrance="visual"]',
    content: '[data-route-entrance="content"]',
    item: '[data-route-entrance="item"]',
};

function useRouteEntrance(containerRef, entranceKey = 0) {
    const previousEntranceKeyRef = useRef(entranceKey);

    useLayoutEffect(() => {
        const container = containerRef.current;

        if (!container || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
            previousEntranceKeyRef.current = entranceKey;
            return undefined;
        }

        const isAfterRouteTransition = previousEntranceKeyRef.current !== entranceKey;
        previousEntranceKeyRef.current = entranceKey;

        const targets = Object.fromEntries(
            Object.entries(ENTRANCE_SELECTORS).map(([name, selector]) => [
                name,
                Array.from(container.querySelectorAll(selector)),
            ]),
        );
        const allTargets = Object.values(targets).flat();

        if (!allTargets.length) return undefined;

        let frameId = null;
        let context = null;
        let timeline = null;
        let cancelled = false;

        context = gsap.context(() => {
            gsap.set(targets.header, { opacity: 0, y: -18 });
            gsap.set(targets.title, { opacity: 0, y: 35 });
            gsap.set(targets.description, { opacity: 0, y: 35 });
            gsap.set(targets.visual, { opacity: 0, y: 45, scale: 0.985 });
            gsap.set(targets.content, { opacity: 0, y: 24 });
            gsap.set(targets.item, { opacity: 0, y: 18 });

            timeline = gsap.timeline({
                paused: true,
                defaults: { ease: "power3.out" },
            });

            if (targets.header.length) {
                timeline.to(targets.header, {
                    opacity: 1,
                    y: 0,
                    duration: 0.75,
                    stagger: 0.07,
                }, 0.05);
            }

            if (targets.visual.length) {
                timeline.to(targets.visual, {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 1.2,
                }, 0.15);
            }

            if (targets.title.length) {
                timeline.to(targets.title, {
                    opacity: 1,
                    y: 0,
                    duration: 0.95,
                }, 0.35);
            }

            if (targets.description.length) {
                timeline.to(targets.description, {
                    opacity: 1,
                    y: 0,
                    duration: 0.85,
                }, 0.48);
            }

            if (targets.content.length) {
                timeline.to(targets.content, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.1,
                }, 0.55);
            }

            if (targets.item.length) {
                timeline.to(targets.item, {
                    opacity: 1,
                    y: 0,
                    duration: 0.75,
                    stagger: 0.1,
                }, 0.72);
            }
        }, container);

        const playEntrance = () => {
            if (!cancelled) timeline?.play(0);
        };

        if (isAfterRouteTransition) {
            playEntrance();
        } else {
            let frameCount = 0;
            let stableFrames = 0;
            let previousScroll = null;
            const maxFrames = 20;

            const waitForScrollRestoration = () => {
                if (cancelled) return;

                frameCount += 1;
                const currentScroll = window.scrollY;

                if (previousScroll !== null && Math.abs(currentScroll - previousScroll) < 1) {
                    stableFrames += 1;
                } else {
                    stableFrames = 0;
                }

                previousScroll = currentScroll;

                if (stableFrames >= 3 || frameCount >= maxFrames) {
                    if (window.scrollY > 50) {
                        context?.revert();
                        context = null;
                        timeline = null;
                        return;
                    }

                    playEntrance();
                    return;
                }

                frameId = window.requestAnimationFrame(waitForScrollRestoration);
            };

            frameId = window.requestAnimationFrame(waitForScrollRestoration);
        }

        return () => {
            cancelled = true;

            if (frameId !== null) {
                window.cancelAnimationFrame(frameId);
            }

            context?.revert();
        };
    }, [containerRef, entranceKey]);
}

export default useRouteEntrance;

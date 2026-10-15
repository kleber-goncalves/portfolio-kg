import { useCallback, useEffect, useMemo, useRef, useState, memo } from "react";
import "../styles/LogoLoop.css";

const ANIMATION_CONFIG = { SMOOTH_TAU: 0.25, MIN_COPIES: 2, COPY_HEADROOM: 2 };

const toCssLength = (value) =>
    typeof value === "number" ? `${value}px` : (value ?? undefined);

const useResizeObserver = (callback, containerRef, sequenceRef) => {
    useEffect(() => {
        if (!window.ResizeObserver) {
            const handleResize = () => callback();
            window.addEventListener("resize", handleResize, { passive: true });
            callback();

            return () => window.removeEventListener("resize", handleResize);
        }

        const observers = [containerRef, sequenceRef].map((ref) => {
            if (!ref.current) return null;

            const observer = new ResizeObserver(callback);
            observer.observe(ref.current);
            return observer;
        });

        callback();

        return () => {
            observers.forEach((observer) => observer?.disconnect());
        };
    }, [callback, containerRef, sequenceRef]);
};

const useImageLoader = (seqRef, onLoad, logos) => {
    useEffect(() => {
        const images = seqRef.current?.querySelectorAll("img") ?? [];

        if (images.length === 0) {
            onLoad();
            return undefined;
        }

        let remainingImages = images.length;
        const handleImageLoad = () => {
            remainingImages -= 1;
            if (remainingImages === 0) onLoad();
        };

        images.forEach((img) => {
            if (img.complete) {
                handleImageLoad();
            } else {
                img.addEventListener("load", handleImageLoad, { once: true });
                img.addEventListener("error", handleImageLoad, { once: true });
            }
        });

        return () => {
            images.forEach((img) => {
                img.removeEventListener("load", handleImageLoad);
                img.removeEventListener("error", handleImageLoad);
            });
        };
    }, [onLoad, seqRef, logos]);
};

const useAnimationLoop = (
    trackRef,
    targetVelocity,
    seqWidth,
    seqHeight,
    isHovered,
    hoverSpeed,
    isVertical,
    isAnimationEnabled,
) => {
    const rafRef = useRef(null);
    const lastTimestampRef = useRef(null);
    const offsetRef = useRef(0);
    const velocityRef = useRef(0);

    useEffect(() => {
        const track = trackRef.current;
        if (!track || !isAnimationEnabled) return undefined;

        const seqSize = isVertical ? seqHeight : seqWidth;

        offsetRef.current =
            ((offsetRef.current % seqSize) + seqSize) % seqSize;

        const initialTransform = isVertical
            ? `translate3d(0, ${-offsetRef.current}px, 0)`
            : `translate3d(${-offsetRef.current}px, 0, 0)`;
        track.style.transform = initialTransform;

        const animate = (timestamp) => {
            if (lastTimestampRef.current === null) {
                lastTimestampRef.current = timestamp;
            }

            const deltaTime =
                Math.max(0, timestamp - lastTimestampRef.current) / 1000;
            lastTimestampRef.current = timestamp;

            const target =
                isHovered && hoverSpeed !== undefined
                    ? hoverSpeed
                    : targetVelocity;

            const easingFactor =
                1 - Math.exp(-deltaTime / ANIMATION_CONFIG.SMOOTH_TAU);
            velocityRef.current +=
                (target - velocityRef.current) * easingFactor;

            let nextOffset =
                offsetRef.current + velocityRef.current * deltaTime;
            nextOffset = ((nextOffset % seqSize) + seqSize) % seqSize;
            offsetRef.current = nextOffset;

            const transformValue = isVertical
                ? `translate3d(0, ${-offsetRef.current}px, 0)`
                : `translate3d(${-offsetRef.current}px, 0, 0)`;
            track.style.transform = transformValue;

            rafRef.current = requestAnimationFrame(animate);
        };

        rafRef.current = requestAnimationFrame(animate);

        return () => {
            if (rafRef.current !== null) {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
            }

            // Evita saltos grandes de posição ao retomar a animação.
            lastTimestampRef.current = null;
        };
    }, [
        targetVelocity,
        seqWidth,
        seqHeight,
        isHovered,
        hoverSpeed,
        isVertical,
        isAnimationEnabled,
        trackRef,
    ]);
};

export const LogoLoop = memo(
    ({
        logos,
        disableAnimation = false,
        speed = 120,
        direction = "left",
        width = "100%",
        logoHeight = 28,
        gap = 32,
        pauseOnHover,
        hoverSpeed,
        fadeOut = false,
        fadeOutColor,
        scaleOnHover = false,
        renderItem,
        ariaLabel = "Partner logos",
        className,
        style,
    }) => {
        const containerRef = useRef(null);
        const trackRef = useRef(null);
        const seqRef = useRef(null);
        const isVertical = direction === "up" || direction === "down";

        const [seqWidth, setSeqWidth] = useState(0);
        const [seqHeight, setSeqHeight] = useState(0);
        const [copyCount, setCopyCount] = useState(ANIMATION_CONFIG.MIN_COPIES);
        const [isHovered, setIsHovered] = useState(false);

        // Só mantém o loop ativo quando a faixa está perto/na viewport,
        // a página está visível e o usuário não pediu movimento reduzido.
        const [isInViewport, setIsInViewport] = useState(
            () => typeof window !== "undefined" && !("IntersectionObserver" in window),
        );
        const [isDocumentVisible, setIsDocumentVisible] = useState(
            () => typeof document === "undefined" || document.visibilityState === "visible",
        );
        const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
            if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
                return false;
            }

            return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        });

        useEffect(() => {
            const container = containerRef.current;
            if (!container || !("IntersectionObserver" in window)) return undefined;

            const observer = new IntersectionObserver(
                ([entry]) => {
                    setIsInViewport(Boolean(entry?.isIntersecting));
                },
                {
                    rootMargin: "64px 0px",
                    threshold: 0,
                },
            );

            observer.observe(container);
            return () => observer.disconnect();
        }, []);

        useEffect(() => {
            const updateVisibility = () => {
                setIsDocumentVisible(document.visibilityState === "visible");
            };

            document.addEventListener("visibilitychange", updateVisibility);
            return () => {
                document.removeEventListener("visibilitychange", updateVisibility);
            };
        }, []);

        useEffect(() => {
            if (typeof window.matchMedia !== "function") return undefined;

            const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
            const handleMotionPreference = (event) => {
                setPrefersReducedMotion(event.matches);
            };

            if (typeof motionQuery.addEventListener === "function") {
                motionQuery.addEventListener("change", handleMotionPreference);
                return () => {
                    motionQuery.removeEventListener("change", handleMotionPreference);
                };
            }

            motionQuery.addListener(handleMotionPreference);
            return () => motionQuery.removeListener(handleMotionPreference);
        }, []);

        const sequenceSize = isVertical ? seqHeight : seqWidth;
        const isAnimationEnabled =
            !disableAnimation &&
            isInViewport &&
            isDocumentVisible &&
            !prefersReducedMotion &&
            sequenceSize > 0;

        const animationPauseReason = disableAnimation
            ? "manual-pause"
            : prefersReducedMotion
              ? "reduced-motion"
            : !isDocumentVisible
              ? "page-hidden"
              : !isInViewport
                ? "outside-viewport"
                : sequenceSize <= 0
                  ? "measuring"
                  : undefined;

        const effectiveHoverSpeed = useMemo(() => {
            if (hoverSpeed !== undefined) return hoverSpeed;
            if (pauseOnHover === true) return 0;
            if (pauseOnHover === false) return undefined;
            return 0;
        }, [hoverSpeed, pauseOnHover]);

        const targetVelocity = useMemo(() => {
            const magnitude = Math.abs(speed);
            let directionMultiplier;
            if (isVertical) {
                directionMultiplier = direction === "up" ? 1 : -1;
            } else {
                directionMultiplier = direction === "left" ? 1 : -1;
            }
            const speedMultiplier = speed < 0 ? -1 : 1;
            return magnitude * directionMultiplier * speedMultiplier;
        }, [speed, direction, isVertical]);

        const updateDimensions = useCallback(() => {
            const containerWidth = containerRef.current?.clientWidth ?? 0;
            const sequenceRect = seqRef.current?.getBoundingClientRect?.();
            const sequenceWidth = sequenceRect?.width ?? 0;
            const sequenceHeight = sequenceRect?.height ?? 0;
            if (isVertical) {
                const parentHeight =
                    containerRef.current?.parentElement?.clientHeight ?? 0;
                if (containerRef.current && parentHeight > 0) {
                    const targetHeight = Math.ceil(parentHeight);
                    if (
                        containerRef.current.style.height !==
                        `${targetHeight}px`
                    )
                        containerRef.current.style.height = `${targetHeight}px`;
                }
                if (sequenceHeight > 0) {
                    setSeqHeight(Math.ceil(sequenceHeight));
                    const viewport =
                        containerRef.current?.clientHeight ??
                        parentHeight ??
                        sequenceHeight;
                    const copiesNeeded =
                        Math.ceil(viewport / sequenceHeight) +
                        ANIMATION_CONFIG.COPY_HEADROOM;
                    setCopyCount(
                        Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded),
                    );
                }
            } else if (sequenceWidth > 0) {
                setSeqWidth(Math.ceil(sequenceWidth));
                const copiesNeeded =
                    Math.ceil(containerWidth / sequenceWidth) +
                    ANIMATION_CONFIG.COPY_HEADROOM;
                setCopyCount(
                    Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded),
                );
            }
        }, [isVertical]);

        useResizeObserver(updateDimensions, containerRef, seqRef);

        useImageLoader(seqRef, updateDimensions, logos);

        useAnimationLoop(
            trackRef,
            targetVelocity,
            seqWidth,
            seqHeight,
            isHovered,
            effectiveHoverSpeed,
            isVertical,
            isAnimationEnabled,
        );

        const cssVariables = useMemo(
            () => ({
                "--logoloop-gap": `${gap}px`,
                "--logoloop-logoHeight": `${logoHeight}px`,
                ...(fadeOutColor && { "--logoloop-fadeColor": fadeOutColor }),
            }),
            [gap, logoHeight, fadeOutColor],
        );

        const rootClassName = useMemo(
            () =>
                [
                    "logoloop",
                    isVertical ? "logoloop--vertical" : "logoloop--horizontal",
                    fadeOut && "logoloop--fade",
                    scaleOnHover && "logoloop--scale-hover",
                    className,
                ]
                    .filter(Boolean)
                    .join(" "),
            [isVertical, fadeOut, scaleOnHover, className],
        );

        const handleMouseEnter = useCallback(() => {
            if (effectiveHoverSpeed !== undefined) setIsHovered(true);
        }, [effectiveHoverSpeed]);
        const handleMouseLeave = useCallback(() => {
            if (effectiveHoverSpeed !== undefined) setIsHovered(false);
        }, [effectiveHoverSpeed]);

        const renderLogoItem = useCallback(
            (item, key) => {
                if (renderItem) {
                    return (
                        <li
                            className="logoloop__item"
                            key={key}
                            role="listitem"
                        >
                            {renderItem(item, key)}
                        </li>
                    );
                }
                const isNodeItem = "node" in item;
                const content = isNodeItem ? (
                    <span
                        className="logoloop__node"
                        aria-hidden={!!item.href && !item.ariaLabel}
                    >
                        {item.node}
                    </span>
                ) : (
                    <img
                        src={item.src}
                        srcSet={item.srcSet}
                        sizes={item.sizes}
                        width={item.width}
                        height={item.height}
                        alt={item.alt ?? ""}
                        title={item.title}
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                    />
                );
                const itemAriaLabel = isNodeItem
                    ? (item.ariaLabel ?? item.title)
                    : (item.alt ?? item.title);
                const itemContent = item.href ? (
                    <a
                        className="logoloop__link"
                        href={item.href}
                        aria-label={itemAriaLabel || "logo link"}
                        target="_blank"
                        rel="noreferrer noopener"
                    >
                        {content}
                    </a>
                ) : (
                    content
                );
                return (
                    <li className="logoloop__item" key={key} role="listitem">
                        {itemContent}
                    </li>
                );
            },
            [renderItem],
        );

        const logoLists = useMemo(
            () =>
                Array.from({ length: copyCount }, (_, copyIndex) => (
                    <ul
                        className="logoloop__list"
                        key={`copy-${copyIndex}`}
                        role="list"
                        aria-hidden={copyIndex > 0}
                        ref={copyIndex === 0 ? seqRef : undefined}
                    >
                        {logos.map((item, itemIndex) =>
                            renderLogoItem(item, `${copyIndex}-${itemIndex}`),
                        )}
                    </ul>
                )),
            [copyCount, logos, renderLogoItem],
        );

        const containerStyle = useMemo(
            () => ({
                width: isVertical
                    ? toCssLength(width) === "100%"
                        ? undefined
                        : toCssLength(width)
                    : (toCssLength(width) ?? "100%"),
                ...cssVariables,
                ...style,
            }),
            [width, cssVariables, style, isVertical],
        );

        return (
            <div
                ref={containerRef}
                className={rootClassName}
                style={containerStyle}
                role="region"
                aria-label={ariaLabel}
            >
                <div
                    className="logoloop__track"
                    ref={trackRef}
                    data-animation-state={isAnimationEnabled ? "running" : "paused"}
                    data-animation-pause-reason={animationPauseReason}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    {logoLists}
                </div>
            </div>
        );
    },
);

LogoLoop.displayName = "LogoLoop";

export default LogoLoop;

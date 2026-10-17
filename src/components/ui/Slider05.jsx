import { useEffect, useRef, useState } from "react";
import {
    AnimatePresence,
    motion,
    useMotionValue,
    useSpring,
    useTransform,
} from "motion/react";

const BAR_COUNT = 44;
const PADDING = 12;

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function SliderBar({
    index,
    mouseX,
    progress,
    isActive,
    containerWidth,
}) {
    const barProgress = index / (BAR_COUNT - 1);
    const isFilled = progress > 0 && barProgress <= progress;

    const height = useTransform(mouseX, (currentX) => {
        const normalHeight = 8;
        if (!isActive) return normalHeight;

        const hoverHeight = 46;
        const dipHeight = 20;
        const innerWidth = Math.max(1, containerWidth - PADDING * 2);
        const barX = PADDING + barProgress * innerWidth;
        const distance = Math.abs(currentX - barX);
        const maxDistance = 88;

        let targetHeight = hoverHeight;

        if (distance < maxDistance) {
            const relativeDistance = distance / maxDistance;
            const dip = (Math.cos(relativeDistance * Math.PI) + 1) / 2;
            targetHeight = hoverHeight - dip * (hoverHeight - dipHeight);
        }

        if (isFilled) {
            const activeProgress = barProgress / Math.max(progress, 0.01);
            targetHeight += Math.sin(activeProgress * Math.PI) * 5;
        }

        return targetHeight;
    });

    const smoothHeight = useSpring(height, {
        damping: 35,
        stiffness: 300,
    });

    return (
        <motion.span
            aria-hidden="true"
            style={{ height: smoothHeight }}
            className={`
                z-10 flex-1 rounded-full
                transition-colors duration-300
                ${isFilled ? "bg-bronze" : "bg-steel/20"}
            `}
        />
    );
}

function Slider05({
    min = 0,
    max = 100,
    step = 1,
    value = 50,
    onChange,
    onPreview,
    labelId,
    className = "",
}) {
    const containerRef = useRef(null);
    const [containerWidth, setContainerWidth] = useState(220);
    const [hoverValue, setHoverValue] = useState(null);
    const [isHovering, setIsHovering] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const mouseX = useMotionValue(PADDING);
    const smoothMouseX = useSpring(mouseX, {
        damping: 20,
        stiffness: 300,
    });

    const safeRange = Math.max(1, max - min);
    const progress = clamp((value - min) / safeRange, 0, 1);
    const isActive = isHovering || isDragging || isFocused;
    const tooltipLeft = useTransform(
        smoothMouseX,
        [0, Math.max(1, containerWidth)],
        ["0%", "100%"],
    );
    const displayedValue = hoverValue ?? value;

    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.offsetWidth);
            }
        };

        updateWidth();
        window.addEventListener("resize", updateWidth);
        return () => window.removeEventListener("resize", updateWidth);
    }, []);

    const calculateValue = (clientX) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return value;

        const x = clamp(clientX - rect.left, 0, rect.width);
        const innerWidth = Math.max(1, rect.width - PADDING * 2);
        const percentage = clamp((x - PADDING) / innerWidth, 0, 1);
        const rawValue = min + percentage * safeRange;
        const steppedValue = min + Math.round((rawValue - min) / step) * step;
        return clamp(Math.round(steppedValue), min, max);
    };

    const positionForValue = (nextValue) => {
        const percentage = clamp((nextValue - min) / safeRange, 0, 1);
        mouseX.set(PADDING + percentage * Math.max(1, containerWidth - PADDING * 2));
    };

    const updateFromPointer = (event, forceUpdate = false) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = clamp(event.clientX - rect.left, 0, rect.width);
        mouseX.set(x);

        const nextValue = calculateValue(event.clientX);
        setHoverValue(nextValue);

        if ((forceUpdate || isDragging) && nextValue !== value) {
            onChange?.(nextValue);
        }
    };

    const handlePointerDown = (event) => {
        if (event.button !== undefined && event.button !== 0) return;

        event.preventDefault();
        setIsDragging(true);
        setIsHovering(true);

        try {
            event.currentTarget.setPointerCapture(event.pointerId);
        } catch {
            // Alguns ambientes podem não oferecer captura de ponteiro.
        }

        updateFromPointer(event, true);
    };

    const handlePointerMove = (event) => {
        setIsHovering(true);
        updateFromPointer(event);
    };

    const handlePointerUp = () => {
        if (!isDragging) return;

        setIsDragging(false);
        onPreview?.();
    };

    const handlePointerCancel = () => {
        setIsDragging(false);
    };

    const handlePointerLeave = () => {
        if (isDragging) return;

        setIsHovering(false);
        setHoverValue(null);
    };

    const handleFocus = () => {
        setIsFocused(true);
        positionForValue(value);
    };

    const handleKeyDown = (event) => {
        let nextValue;

        switch (event.key) {
            case "ArrowLeft":
            case "ArrowDown":
                nextValue = value - step;
                break;
            case "ArrowRight":
            case "ArrowUp":
                nextValue = value + step;
                break;
            case "PageDown":
                nextValue = value - step * 10;
                break;
            case "PageUp":
                nextValue = value + step * 10;
                break;
            case "Home":
                nextValue = min;
                break;
            case "End":
                nextValue = max;
                break;
            default:
                return;
        }

        event.preventDefault();
        nextValue = clamp(Math.round(nextValue / step) * step, min, max);
        positionForValue(nextValue);
        setHoverValue(nextValue);

        if (nextValue !== value) {
            onChange?.(nextValue);
        }
    };

    const handleKeyUp = (event) => {
        if ([
            "ArrowLeft", "ArrowDown", "ArrowRight", "ArrowUp",
            "PageDown", "PageUp", "Home", "End",
        ].includes(event.key)) {
            onPreview?.();
        }
    };

    return (
        <div className={`group relative w-full select-none pt-8 ${className}`}>
            <AnimatePresence>
                {isActive && (
                    <motion.div
                        key="slider-value-tooltip"
                        initial={{ opacity: 0, y: 8, scale: 0.82 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 7, scale: 0.85 }}
                        transition={{
                            type: "spring",
                            damping: 15,
                            stiffness: 400,
                        }}
                        style={{
                            left: tooltipLeft,
                            translateX: "-50%",
                        }}
                        className="
                            pointer-events-none absolute top-0 z-20
                            flex w-fit items-center justify-center
                            rounded-xl border border-graphite
                            bg-carbon px-3 py-1
                            font-space text-sm tabular-nums text-ivory
                            shadow-[0_8px_24px_rgba(0,0,0,0.3)]
                        "
                    >
                        <span>{displayedValue}%</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                ref={containerRef}
                role="slider"
                tabIndex={0}
                aria-labelledby={labelId}
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuenow={value}
                aria-valuetext={`${value}% do volume original`}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerCancel}
                onPointerLeave={handlePointerLeave}
                onFocus={handleFocus}
                onBlur={() => {
                    setIsFocused(false);
                    if (!isDragging) setHoverValue(null);
                }}
                onKeyDown={handleKeyDown}
                onKeyUp={handleKeyUp}
                animate={{ height: isActive ? 76 : 40 }}
                transition={{
                    type: "spring",
                    damping: 22,
                    stiffness: 320,
                }}
                style={{ touchAction: "none" }}
                className="
                    relative mt-2 flex w-full cursor-pointer items-end
                    gap-[2px] overflow-hidden rounded-xl
                    border border-graphite bg-obsidian
                    px-3 pb-2 pt-2 outline-none
                    focus-visible:border-bronze
                    focus-visible:ring-1 focus-visible:ring-bronze/50
                "
            >
                {Array.from({ length: BAR_COUNT }, (_, index) => (
                    <SliderBar
                        key={index}
                        index={index}
                        mouseX={smoothMouseX}
                        progress={progress}
                        isActive={isActive}
                        containerWidth={containerWidth}
                    />
                ))}
            </motion.div>
        </div>
    );
}

export default Slider05;

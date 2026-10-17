import React, { useEffect, useMemo, useRef, useState } from "react";

import "../styles/GradualBlur.css";

/* =========================================================
   CONFIGURAÇÃO PADRÃO
========================================================= */

const DEFAULT_CONFIG = {
    position: "bottom",

    strength: 2,

    height: "6rem",

    width: undefined,

    divCount: 5,

    exponential: false,

    zIndex: 1000,

    animated: false,

    duration: "0.3s",

    easing: "ease-out",

    opacity: 1,

    curve: "linear",

    responsive: false,

    target: "parent",

    hoverIntensity: undefined,

    className: "",

    style: {},
};

/* =========================================================
   PRESETS
========================================================= */

const PRESETS = {
    top: {
        position: "top",
        height: "6rem",
    },

    bottom: {
        position: "bottom",
        height: "6rem",
    },

    left: {
        position: "left",
        height: "6rem",
    },

    right: {
        position: "right",
        height: "6rem",
    },

    subtle: {
        height: "4rem",
        strength: 1,
        opacity: 0.8,
        divCount: 3,
    },

    intense: {
        height: "10rem",
        strength: 4,
        divCount: 8,
        exponential: true,
    },

    smooth: {
        height: "8rem",
        curve: "bezier",
        divCount: 10,
    },

    sharp: {
        height: "5rem",
        curve: "linear",
        divCount: 4,
    },

    header: {
        position: "top",
        height: "8rem",
        curve: "ease-out",
    },

    footer: {
        position: "bottom",
        height: "8rem",
        curve: "ease-out",
    },

    sidebar: {
        position: "left",
        height: "6rem",
        strength: 2.5,
    },

    "page-header": {
        position: "top",
        height: "10rem",
        target: "page",
        strength: 3,
    },

    "page-footer": {
        position: "bottom",
        height: "10rem",
        target: "page",
        strength: 3,
    },
};

/* =========================================================
   CURVAS
========================================================= */

const CURVE_FUNCTIONS = {
    linear: (p) => p,

    bezier: (p) => p * p * (3 - 2 * p),

    "ease-in": (p) => p * p,

    "ease-out": (p) => 1 - Math.pow(1 - p, 2),

    "ease-in-out": (p) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2),
};

/* =========================================================
   UTILITÁRIOS
========================================================= */

const mergeConfigs = (...configs) =>
    configs.reduce(
        (acc, config) => ({
            ...acc,
            ...config,
        }),
        {},
    );

const getGradientDirection = (position) => {
    const directions = {
        top: "to top",
        bottom: "to bottom",
        left: "to left",
        right: "to right",
    };

    return directions[position] || "to bottom";
};

const debounce = (fn, wait) => {
    let timeout;

    return (...args) => {
        clearTimeout(timeout);

        timeout = setTimeout(() => {
            fn(...args);
        }, wait);
    };
};

/* =========================================================
   DIMENSÃO RESPONSIVA
========================================================= */

const useResponsiveDimension = (responsive, config, key) => {
    const [value, setValue] = useState(config[key]);

    useEffect(() => {
        if (!responsive) return;

        const calculate = () => {
            const screenWidth = window.innerWidth;

            let newValue = config[key];

            const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);

            const mobileKey = `mobile${capitalizedKey}`;

            const tabletKey = `tablet${capitalizedKey}`;

            const desktopKey = `desktop${capitalizedKey}`;

            if (screenWidth <= 480 && config[mobileKey]) {
                newValue = config[mobileKey];
            } else if (screenWidth <= 768 && config[tabletKey]) {
                newValue = config[tabletKey];
            } else if (screenWidth <= 1024 && config[desktopKey]) {
                newValue = config[desktopKey];
            }

            setValue(newValue);
        };

        const debouncedCalculate = debounce(calculate, 100);

        calculate();

        window.addEventListener("resize", debouncedCalculate);

        return () => {
            window.removeEventListener("resize", debouncedCalculate);
        };
    }, [responsive, config, key]);

    return responsive ? value : config[key];
};

/* =========================================================
   INTERSECTION OBSERVER
========================================================= */

const useIntersectionObserver = (ref, shouldObserve) => {
    const [isVisible, setIsVisible] = useState(!shouldObserve);

    useEffect(() => {
        if (!shouldObserve || !ref.current) {
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            {
                threshold: 0.1,
            },
        );

        observer.observe(ref.current);

        return () => {
            observer.disconnect();
        };
    }, [ref, shouldObserve]);

    return isVisible;
};

/* =========================================================
   COMPONENTE
========================================================= */

function GradualBlur(props) {
    const containerRef = useRef(null);

    const [isHovered, setIsHovered] = useState(false);

    /* -----------------------------------------------------
       CONFIGURAÇÃO FINAL
    ----------------------------------------------------- */

    const config = useMemo(() => {
        const presetConfig = props.preset && PRESETS[props.preset] ? PRESETS[props.preset] : {};

        return mergeConfigs(DEFAULT_CONFIG, presetConfig, props);
    }, [props]);

    /* -----------------------------------------------------
       DIMENSÕES RESPONSIVAS
    ----------------------------------------------------- */

    const responsiveHeight = useResponsiveDimension(config.responsive, config, "height");

    const responsiveWidth = useResponsiveDimension(config.responsive, config, "width");

    /* -----------------------------------------------------
       VISIBILIDADE
    ----------------------------------------------------- */

    const isVisible = useIntersectionObserver(containerRef, config.animated === "scroll");

    /* -----------------------------------------------------
       CAMADAS DO BLUR
    ----------------------------------------------------- */

    const blurDivs = useMemo(() => {
        const divs = [];

        const increment = 100 / config.divCount;

        const currentStrength = isHovered && config.hoverIntensity ? config.strength * config.hoverIntensity : config.strength;

        const curveFunction = CURVE_FUNCTIONS[config.curve] || CURVE_FUNCTIONS.linear;

        for (let i = 1; i <= config.divCount; i++) {
            let progress = i / config.divCount;

            progress = curveFunction(progress);

            /* ---------------------------------------------
               INTENSIDADE DO BLUR
            --------------------------------------------- */

            let blurValue;

            if (config.exponential) {
                blurValue = Math.pow(2, progress * 4) * 0.0625 * currentStrength;
            } else {
                blurValue = 0.0625 * (progress * config.divCount + 1) * currentStrength;
            }

            /* ---------------------------------------------
               POSIÇÕES DO GRADIENTE
            --------------------------------------------- */

            const p1 = Math.round((increment * i - increment) * 10) / 10;

            const p2 = Math.round(increment * i * 10) / 10;

            const p3 = Math.round((increment * i + increment) * 10) / 10;

            const p4 = Math.round((increment * i + increment * 2) * 10) / 10;

            /* ---------------------------------------------
               GRADIENTE
            --------------------------------------------- */

            let gradient = `transparent ${p1}%, black ${p2}%`;

            if (p3 <= 100) {
                gradient += `, black ${p3}%`;
            }

            if (p4 <= 100) {
                gradient += `, transparent ${p4}%`;
            }

            const direction = getGradientDirection(config.position);

            /* ---------------------------------------------
               ESTILO DA CAMADA
            --------------------------------------------- */

            const divStyle = {
                position: "absolute",

                inset: 0,

                maskImage: `linear-gradient(${direction}, ${gradient})`,

                WebkitMaskImage: `linear-gradient(${direction}, ${gradient})`,

                backdropFilter: `blur(${blurValue.toFixed(3)}rem)`,

                WebkitBackdropFilter: `blur(${blurValue.toFixed(3)}rem)`,

                opacity: config.opacity,

                transition: config.animated && config.animated !== "scroll" ? `backdrop-filter ${config.duration} ${config.easing}` : undefined,
            };

            divs.push(<div key={i} style={divStyle} />);
        }

        return divs;
    }, [config, isHovered]);

    /* -----------------------------------------------------
       CONTAINER
    ----------------------------------------------------- */

    const containerStyle = useMemo(() => {
        const isVertical = ["top", "bottom"].includes(config.position);

        const isHorizontal = ["left", "right"].includes(config.position);

        const isPageTarget = config.target === "page";

        const baseStyle = {
            position: isPageTarget ? "fixed" : "absolute",

            pointerEvents: config.hoverIntensity ? "auto" : "none",

            opacity: isVisible ? 1 : 0,

            transition: config.animated ? `opacity ${config.duration} ${config.easing}` : undefined,

            zIndex: isPageTarget ? config.zIndex + 100 : config.zIndex,

            ...config.style,
        };

        /* ---------------------------------------------
               VERTICAL
            --------------------------------------------- */

        if (isVertical) {
            baseStyle.height = responsiveHeight;

            baseStyle.width = responsiveWidth || "100%";

            baseStyle[config.position] = 0;

            baseStyle.left = 0;
            baseStyle.right = 0;
        } else if (isHorizontal) {

        /* ---------------------------------------------
               HORIZONTAL
            --------------------------------------------- */
            baseStyle.width = responsiveWidth || responsiveHeight;

            baseStyle.height = "100%";

            baseStyle[config.position] = 0;

            baseStyle.top = 0;
            baseStyle.bottom = 0;
        }

        return baseStyle;
    }, [config, responsiveHeight, responsiveWidth, isVisible]);

    /* -----------------------------------------------------
       ANIMAÇÃO DE VISIBILIDADE
    ----------------------------------------------------- */

    const { hoverIntensity, animated, onAnimationComplete, duration } = config;

    useEffect(() => {
        if (isVisible && animated === "scroll" && onAnimationComplete) {
            const milliseconds = parseFloat(duration) * 1000;

            const timeout = setTimeout(() => {
                onAnimationComplete();
            }, milliseconds);

            return () => {
                clearTimeout(timeout);
            };
        }
    }, [isVisible, animated, onAnimationComplete, duration]);

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <div
            ref={containerRef}
            className={`
                gradual-blur
                ${config.target === "page" ? "gradual-blur-page" : "gradual-blur-parent"}
                ${config.className}
            `}
            style={containerStyle}
            onMouseEnter={hoverIntensity ? () => setIsHovered(true) : undefined}
            onMouseLeave={hoverIntensity ? () => setIsHovered(false) : undefined}
        >
            <div className="gradual-blur-inner">{blurDivs}</div>
        </div>
    );
}

/* =========================================================
   MEMO
========================================================= */

const GradualBlurMemo = React.memo(GradualBlur);

GradualBlurMemo.displayName = "GradualBlur";

/* =========================================================
   EXPORTS
========================================================= */

GradualBlurMemo.PRESETS = PRESETS;

GradualBlurMemo.CURVE_FUNCTIONS = CURVE_FUNCTIONS;

export default GradualBlurMemo;

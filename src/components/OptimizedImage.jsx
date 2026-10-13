import { useState } from "react";

/**
 * Imagem reutilizável com dimensões reservadas, carregamento configurável,
 * suporte a srcSet e placeholder opcional.
 *
 * SEO: forneça um alt descritivo para imagens informativas.
 * Acessibilidade: use alt="" para imagens puramente decorativas.
 */
export function OptimizedImage({
    src,
    alt = "",
    width,
    height,
    aspectRatio,
    sizes = "100vw",
    srcSet,
    loading = "lazy",
    fetchPriority = "auto",
    decoding = "async",
    placeholderSrc,
    wrapperClassName = "",
    className = "",
    imageRef,
    onLoad,
    onError,
    ...props
}) {
    const [loadedSrc, setLoadedSrc] = useState(null);
    const loaded = loadedSrc === src;

    const resolvedAspectRatio =
        aspectRatio ?? (width && height ? `${width} / ${height}` : undefined);

    const handleLoad = (event) => {
        setLoadedSrc(src);
        onLoad?.(event);
    };

    return (
        <div
            className={["relative overflow-hidden", wrapperClassName].filter(Boolean).join(" ")}
            style={resolvedAspectRatio ? { aspectRatio: resolvedAspectRatio } : undefined}
        >
            {placeholderSrc && (
                <img
                    src={placeholderSrc}
                    alt=""
                    aria-hidden="true"
                    width={width}
                    height={height}
                    decoding="async"
                    draggable="false"
                    className={[
                        "pointer-events-none absolute inset-0 h-full w-full object-cover blur-sm transition-opacity duration-300 motion-reduce:transition-none",
                        loaded ? "opacity-0" : "opacity-100",
                    ].join(" ")}
                />
            )}

            <img
                ref={imageRef}
                src={src}
                srcSet={srcSet}
                sizes={srcSet ? sizes : undefined}
                alt={alt}
                width={width}
                height={height}
                loading={loading}
                fetchPriority={fetchPriority}
                decoding={decoding}
                draggable="false"
                onLoad={handleLoad}
                onError={onError}
                className={[
                    "block h-full w-full",
                    placeholderSrc ? "transition-opacity duration-300 motion-reduce:transition-none" : "",
                    placeholderSrc && !loaded ? "opacity-0" : "opacity-100",
                    className,
                ].filter(Boolean).join(" ")}
                {...props}
            />
        </div>
    );
}

export default OptimizedImage;

import { useState } from "react";
import imageMetadata from "../generated/imageMetadata.json";

/**
 * Imagem reutilizável com dimensões reservadas, carregamento configurável,
 * srcSet responsivo e placeholder opcional.
 *
 * SEO: forneça um alt descritivo para imagens informativas.
 * Acessibilidade: use alt="" para imagens puramente decorativas.
 */
function resolveImageMetadata(src) {
    if (typeof src !== "string") return null;

    try {
        const pathname = new URL(src, window.location.origin).pathname;
        const filename = pathname.split("/").pop() ?? "";
        const originalFilename = filename.replace(
            /-[A-Za-z0-9_-]{8}(?=\.[^.]+$)/,
            "",
        );

        return imageMetadata[originalFilename] ?? null;
    } catch {
        const filename = src.split(/[?#]/, 1)[0].split("/").pop() ?? "";
        const originalFilename = filename.replace(
            /-[A-Za-z0-9_-]{8}(?=\.[^.]+$)/,
            "",
        );

        return imageMetadata[originalFilename] ?? null;
    }
}

export function OptimizedImage({
    src,
    alt,
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
    const metadata = resolveImageMetadata(src);
    const resolvedSrc = srcSet ? src : metadata?.src ?? src;
    const resolvedSrcSet = srcSet ?? metadata?.srcSet;
    const resolvedSizes = metadata?.sizes ?? sizes;
    const resolvedWidth = width ?? metadata?.width;
    const resolvedHeight = height ?? metadata?.height;

    const [loadedSrc, setLoadedSrc] = useState(null);
    const loaded = loadedSrc === resolvedSrc;

    const resolvedAspectRatio =
        aspectRatio ??
        (resolvedWidth && resolvedHeight
            ? `${resolvedWidth} / ${resolvedHeight}`
            : undefined);

    const handleLoad = (event) => {
        setLoadedSrc(resolvedSrc);
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
                    alt={alt}
                    aria-hidden="true"
                    width={resolvedWidth}
                    height={resolvedHeight}
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
                src={resolvedSrc}
                srcSet={resolvedSrcSet}
                sizes={resolvedSrcSet ? resolvedSizes : undefined}
                alt={alt}
                width={resolvedWidth}
                height={resolvedHeight}
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

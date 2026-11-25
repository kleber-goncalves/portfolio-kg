import { useEffect } from "react";
import SEO_CONFIG from "../data/seoRoutes.json";

function normalizePath(pathname) {
    if (!pathname || pathname === "/") return "/";
    return pathname.replace(/\/+$/, "") || "/";
}

function upsertMeta(attribute, key, value) {
    const elements = [...document.head.querySelectorAll(`meta[${attribute}]`)];
    let meta = elements.find((element) => element.getAttribute(attribute) === key);

    if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attribute, key);
        document.head.appendChild(meta);
    }

    meta.setAttribute("content", value ?? "");
}

function upsertCanonical(url) {
    let canonical = document.head.querySelector('link[rel="canonical"]');

    if (!canonical) {
        canonical = document.createElement("link");
        canonical.setAttribute("rel", "canonical");
        document.head.appendChild(canonical);
    }

    canonical.setAttribute("href", url);
}

function upsertRouteJsonLd(page, canonicalUrl) {
    const elementId = "route-seo-jsonld";
    let script = document.getElementById(elementId);

    if (!script) {
        script = document.createElement("script");
        script.id = elementId;
        script.type = "application/ld+json";
        document.head.appendChild(script);
    }

    script.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": `${canonicalUrl}#webpage`,
        name: page.title,
        description: page.description,
        url: canonicalUrl,
        inLanguage: SEO_CONFIG.language,
        isPartOf: { "@id": SEO_CONFIG.websiteId },
        about: { "@id": SEO_CONFIG.personId },
    });
}

/**
 * Mantém os metadados da rota sincronizados durante navegações SPA.
 * Os mesmos dados alimentam scripts de geração do HTML estático e sitemap.
 */
export default function useRouteSeo(pathname) {
    useEffect(() => {
        const normalizedPath = normalizePath(pathname);
        const route = SEO_CONFIG.routes[normalizedPath] ? normalizedPath : "/";
        const page = SEO_CONFIG.routes[route];
        const canonicalUrl = new URL(route, SEO_CONFIG.siteUrl).href;
        const socialImageUrl = new URL(SEO_CONFIG.socialImagePath, SEO_CONFIG.siteUrl).href;
        const imageAlt = page.socialImageAlt || page.title;

        document.documentElement.lang = SEO_CONFIG.language;
        document.title = page.title;

        upsertMeta("name", "description", page.description);
        upsertMeta("name", "robots", "index,follow");

        upsertMeta("property", "og:type", "website");
        upsertMeta("property", "og:locale", "pt_BR");
        upsertMeta("property", "og:site_name", SEO_CONFIG.siteName);
        upsertMeta("property", "og:title", page.title);
        upsertMeta("property", "og:description", page.description);
        upsertMeta("property", "og:url", canonicalUrl);
        upsertMeta("property", "og:image", socialImageUrl);
        upsertMeta("property", "og:image:alt", imageAlt);

        upsertMeta("name", "twitter:card", "summary_large_image");
        upsertMeta("name", "twitter:title", page.title);
        upsertMeta("name", "twitter:description", page.description);
        upsertMeta("name", "twitter:image", socialImageUrl);
        upsertMeta("name", "twitter:image:alt", imageAlt);

        upsertCanonical(canonicalUrl);
        upsertRouteJsonLd(page, canonicalUrl);
    }, [pathname]);
}

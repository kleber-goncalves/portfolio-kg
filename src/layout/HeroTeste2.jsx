import { useEffect, useState } from "react";
import HeroMobile from "../components/HeroMobile";
import HeroDesktop from "../components/HeroDesktop";

const MOBILE_LAYOUT_QUERY =
    "(max-width: 767px), (orientation: landscape) and (max-height: 600px)";

function Hero({ dotFieldFrozen = false, onNavigate, experienceMode = "full" }) {
    const [useMobileLayout, setUseMobileLayout] = useState(() => {
        if (typeof window === "undefined") return false;

        return window.matchMedia(MOBILE_LAYOUT_QUERY).matches;
    });

    useEffect(() => {
        const mediaQuery = window.matchMedia(MOBILE_LAYOUT_QUERY);

        const updateLayout = () => {
            setUseMobileLayout(mediaQuery.matches);
        };

        // Mantém o layout sincronizado ao girar o aparelho ou redimensionar a janela.
        updateLayout();
        mediaQuery.addEventListener("change", updateLayout);

        return () => {
            mediaQuery.removeEventListener("change", updateLayout);
        };
    }, []);

    // ============================================================
    // ITENS DO MENU
    // ============================================================

    const menuItems = [
        {
            label: "Home",
            href: "#hero",
        },
        {
            label: "Stack",
            href: "#stack",
        },
        {
            label: "Competências",
            href: "#competencias",
        },
        {
            label: "Projetos",
            href: "#projetos",
        },
        {
            label: "Diferenciais",
            href: "#diferenciais",
        },
        {
            label: "Formação",
            href: "#formacao",
        },
    ];

    return (
        <section id="hero" className="relative">
            {useMobileLayout ? (
                <div className="p-5">
                    <HeroMobile items={menuItems} />
                </div>
            ) : (
                <HeroDesktop
                    items={menuItems}
                    dotFieldFrozen={dotFieldFrozen}
                    onNavigate={onNavigate}
                    experienceMode={experienceMode}
                />
            )}
        </section>
    );
}

export default Hero;

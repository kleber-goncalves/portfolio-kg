import HeroMobile from "../components/HeroMobile";
import HeroDesktop from "../components/HeroDesktop";
import useResponsive from "../hooks/useResponsive";

function Hero({ dotFieldFrozen = false, onNavigate, experienceMode = "full" }) {
    const { isMobileLayout } = useResponsive();

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
            {isMobileLayout ? (
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

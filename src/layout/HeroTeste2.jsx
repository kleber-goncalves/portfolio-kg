import HeroMobile from "../components/HeroMobile";
import HeroDesktop from "../components/HeroDesktop";

function Hero({ dotFieldFrozen = false, onNavigate }) {
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
            {/* ==================================================
                MOBILE
            ================================================== */}

            <div className="block md:hidden">
                <HeroMobile items={menuItems} />
            </div>

            {/* ==================================================
                DESKTOP
            ================================================== */}

            <div className="hidden md:block">
                <HeroDesktop items={menuItems} dotFieldFrozen={dotFieldFrozen} onNavigate={onNavigate} />
            </div>
        </section>
    );
}

export default Hero;

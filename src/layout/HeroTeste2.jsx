import HeroMobile from "../components/HeroMobile";
import HeroDesktop from "../components/HeroDesktop";

function Hero({ dotFieldFrozen = false }) {
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
            label: "Formação",
            href: "#formacao",
        },
        {
            label: "Trajetória",
            href: "#trajetoria",
        },
    ];

    return (
        <section id="hero" className="relative">
            {/* =====================================================
                MOBILE
            ====================================================== */}

            <div className="block md:hidden">
                <HeroMobile items={menuItems} />
            </div>

            {/* =====================================================
                DESKTOP
            ====================================================== */}

            <div className="hidden md:block">
                <HeroDesktop items={menuItems} dotFieldFrozen={dotFieldFrozen} />
            </div>
        </section>
    );
}

export default Hero;

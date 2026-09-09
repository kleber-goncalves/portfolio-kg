import HeroMobile from "../components/HeroMobile";
import HeroDesktop from "../components/HeroDesktop";

function Hero() {
    const menuItems = [
        {
            label: "Hero",
            href: "#hero",
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
        {
            label: "Rodapé",
            href: "#footer",
        },
    ];

    return (
        <section
            id="hero"
            className="
                relative
                w-full
                overflow-hidden
                bg-obsidian
                
            "
        >
            {/* =====================================================
                MOBILE
            ====================================================== */}

            <div className="block md:hidden p-4">
                <HeroMobile items={menuItems} />
            </div>

            {/* =====================================================
                DESKTOP
            ====================================================== */}

            <div className="hidden md:block ">
                <HeroDesktop items={menuItems} />
            </div>
        </section>
    );
}

export default Hero;

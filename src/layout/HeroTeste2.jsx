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
                overflow-visible
           
                
            "
            ref={(el) => {
                if (!el) return;

                const rect = el.getBoundingClientRect();

                console.log("====================================");
                console.log("🧱 HERO PAI");
                console.log("====================================");
                console.log("element:", el);
                console.log("height:", rect.height);
                console.log("top:", rect.top);
                console.log("bottom:", rect.bottom);

                const styles = window.getComputedStyle(el);

                console.log("position:", styles.position);
                console.log("overflow:", styles.overflow);
            }}
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

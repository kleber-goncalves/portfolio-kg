import MagneticLink from "./MagneticNavLink";

function PortfolioNavigation({
    items = [],
    activeHref = null,
    onNavigate,
    navRef,
    className = "",
}) {
    return (
        <nav
            ref={navRef}
            aria-label="Navegação principal"
            className={className}
        >
            {items.map((item) => (
                <MagneticLink
                    key={item.href}
                    href={item.href}
                    onNavigate={onNavigate}
                    className="font-space text-[9px] uppercase tracking-[0.12em] c-lg:text-[10px]"
                    isActive={activeHref === item.href}
                >
                    {item.label}
                </MagneticLink>
            ))}
        </nav>
    );
}

export default PortfolioNavigation;

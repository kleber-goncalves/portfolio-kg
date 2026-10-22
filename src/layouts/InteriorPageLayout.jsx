import { useEffect } from "react";
import { Link, NavLink } from "react-router-dom";

const NAVIGATION_ITEMS = [
    { to: "/", label: "Home", end: true },
    { to: "/projetos", label: "Projetos" },
    { to: "/sobre", label: "Sobre" },
    { to: "/contato", label: "Contato" },
];

function InteriorPageLayout({ title, eyebrow, description, children, footerContent = null, showFallbackFooter = true }) {
    useEffect(() => {
        const previousTitle = document.title;
        const descriptionMeta = document.querySelector('meta[name="description"]');
        const previousDescription = descriptionMeta?.getAttribute("content") ?? null;

        document.title = `${title} | KLEBER DEV`;
        descriptionMeta?.setAttribute("content", description);

        return () => {
            document.title = previousTitle;

            if (descriptionMeta && previousDescription !== null) {
                descriptionMeta.setAttribute("content", previousDescription);
            }
        };
    }, [title, description]);

    return (
        <div className="min-h-screen w-full bg-obsidian text-ivory">
            <header className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-5 py-6 b-md:flex-row b-md:items-center b-md:justify-between b-md:px-10">
                <Link
                    to="/"
                    aria-label="KLEBER DEV — voltar para Home"
                    className="flex w-fit items-center gap-3"
                >
                    <img src="/logo.svg" alt="" className="h-9 w-9 object-contain" />
                    <span className="font-space text-sm font-semibold tracking-[0.16em]">
                        KLEBER <span className="text-bronze">DEV</span>
                    </span>
                </Link>

                <nav
                    aria-label="Navegação principal"
                    className="flex flex-wrap items-center gap-x-5 gap-y-3"
                >
                    {NAVIGATION_ITEMS.map(({ to, label, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            className={({ isActive }) =>
                                `border-b pb-1 text-xs transition-colors duration-200 focus-visible:outline-offset-4 b-md:text-sm ${
                                    isActive
                                        ? "border-bronze text-champagne"
                                        : "border-transparent text-steel hover:border-graphite hover:text-ivory"
                                }`
                            }
                        >
                            {label}
                        </NavLink>
                    ))}
                </nav>
            </header>

            <main id="main-content" tabIndex={-1} className="w-full outline-none">
                <header className="mx-auto w-full max-w-7xl px-5 pb-10 pt-12 b-md:px-10 b-md:pb-16 b-md:pt-20">
                    <p className="text-xs uppercase tracking-[0.22em] text-bronze">
                        {eyebrow}
                    </p>
                    <h1 className="mt-4 max-w-5xl font-space text-4xl font-semibold leading-[0.98] tracking-tight text-ivory b-md:mt-6 b-md:text-7xl">
                        {title}
                    </h1>
                    <p className="mt-5 max-w-2xl text-sm leading-6 text-steel b-md:mt-7 b-md:text-base b-md:leading-7">
                        {description}
                    </p>
                </header>

                {children}
            </main>

            {footerContent}

            {showFallbackFooter && (
                <footer className="mx-auto mt-20 flex w-full max-w-7xl flex-col gap-3 border-t border-graphite px-5 py-6 text-xs text-steel b-md:flex-row b-md:items-center b-md:justify-between b-md:px-10">
                    <span>© {new Date().getFullYear()} KLEBER DEV</span>
                    <Link
                        to="/"
                        className="w-fit transition-colors hover:text-champagne"
                    >
                        Voltar para a Home
                    </Link>
                </footer>
            )}
        </div>
    );
}

export default InteriorPageLayout;

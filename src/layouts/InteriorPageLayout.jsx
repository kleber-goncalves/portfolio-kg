import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import MenuMobile from "../components/MenuMobile";
import PortfolioDesktopHeader from "../components/PortfolioDesktopHeader";
import { NAVIGATION_ITEMS } from "../data/navigation";
import usePortfolioNavigation from "../hooks/usePortfolioNavigation";

function InteriorPageLayout({ title, eyebrow, description, heroContent = null, children, footerContent = null, showFallbackFooter = true }) {
    const { pathname } = useLocation();
    const navigatePortfolio = usePortfolioNavigation();

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
            <header data-route-navigation className="w-full">
                <div className="hidden b-md:block">
                    <PortfolioDesktopHeader
                        placement="interior"
                        items={NAVIGATION_ITEMS}
                        activeHref={pathname}
                        onNavigate={navigatePortfolio}
                        logoHref="/"
                    />
                </div>

                <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-6 b-md:hidden">
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

                    <MenuMobile items={NAVIGATION_ITEMS} />
                </div>
            </header>

            <main id="main-content" tabIndex={-1} className="w-full outline-none">
                {heroContent ?? (
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
                )}

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

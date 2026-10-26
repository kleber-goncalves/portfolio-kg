import { useRef } from "react";
import { Link, useLocation } from "react-router-dom";

import MenuMobile from "../components/MenuMobile";
import PortfolioDesktopHeader from "../components/PortfolioDesktopHeader";
import DeferredLayoutSection from "../components/DeferredLayoutSection";
import { NAVIGATION_ITEMS } from "../data/navigation";
import usePortfolioNavigation from "../hooks/usePortfolioNavigation";
import useRouteEntrance from "../hooks/useRouteEntrance";

function InteriorPageLayout({ title, description, heroContent = null, children, entranceKey = 0, isRouteTransitioning = false }) {
    const { pathname } = useLocation();
    const navigatePortfolio = usePortfolioNavigation();
    const pageRef = useRef(null);
    useRouteEntrance(pageRef, entranceKey, isRouteTransitioning);


    return (
        <div ref={pageRef} className="min-h-screen w-full bg-obsidian text-ivory">
            <header data-route-navigation className="w-full">
                <div className="hidden b-md:block">
                    <PortfolioDesktopHeader placement="interior" items={NAVIGATION_ITEMS} activeHref={pathname} onNavigate={navigatePortfolio} logoHref="/" />
                </div>

                <div data-route-entrance="header" className="mx-auto flex w-full b-md:max-w-[1500px] items-center justify-between px-5 py-6 b-md:hidden">
                    <Link to="/" aria-label="KLEBER DEV — voltar para Home" className="flex w-fit items-center gap-3">
                        <img src="/logo.svg" alt="" className="h-9 w-9 object-contain" />
                    </Link>

                    <MenuMobile items={NAVIGATION_ITEMS} />
                </div>
            </header>

            <main id="main-content" tabIndex={-1} className="w-full outline-none">
                {heroContent ?? (
                    <header className="mx-auto w-full b-md:max-w-[1500px] px-5 pb-10 pt-6 b-md:px-10 b-md:pb-20 b-md:pt-0">

                        <h1 data-route-entrance="title" className="mt-4 max-w-5xl font-space text-4xl font-semibold leading-[0.98] tracking-tight text-ivory b-md:mt-6 b-md:text-7xl">{title}</h1>
                        <p data-route-entrance="description" className="mt-5 max-w-2xl text-sm leading-6 text-steel b-md:mt-7 b-md:text-base b-md:leading-7">{description}</p>
                    </header>
                )}

                {children}
            </main>

            <DeferredLayoutSection section="footer" />
        </div>
    );
}

export default InteriorPageLayout;

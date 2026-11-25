import { Link } from "react-router-dom";

import ExperienceDropdown from "./ExperienceDropdown";
import OptimizedImage from "./OptimizedImage";
import PortfolioNavigation from "./PortfolioNavigation";
import SoundControls from "./SoundControls";
import { getExperienceMode } from "../utils/experienceMode";

function PortfolioDesktopHeader({
    placement = "hero",
    items = [],
    activeHref = null,
    onNavigate,
    navRef,
    logoRef,
    experienceMode = getExperienceMode() || "full",
    logoHref = null,
}) {
    const isInterior = placement === "interior";

    const logoImage = (
        <div
            className="
                h-10
                w-10

                c-lg:h-11
                c-lg:w-11
            "
        >
            <OptimizedImage
                src="/logo.svg"
                alt="Kleber Dev"
                width={44}
                height={44}
                loading="eager"
                fetchPriority="high"
                wrapperClassName="h-full w-full"
                className="object-contain"
            />
        </div>
    );

    const logo = (
        <div ref={logoRef} className={isInterior ? "shrink-0" : ""}>
            {logoHref ? (
                <Link to={logoHref} aria-label="KLEBER DEV — voltar para Home" className="block">
                    {logoImage}
                </Link>
            ) : (
                logoImage
            )}
        </div>
    );

    const controls = (
        <div className="flex shrink-0 items-center gap-2 c-lg:gap-3">
            <ExperienceDropdown experienceMode={experienceMode} />
            <SoundControls />
        </div>
    );

    const navigation = (
        <PortfolioNavigation
            navRef={navRef}
            items={items}
            activeHref={activeHref}
            onNavigate={onNavigate}
            className={
                isInterior
                    ? "flex shrink-0 items-center gap-5 whitespace-nowrap c-lg:gap-7"
                    : "absolute right-8 top-8 z-40 flex items-center gap-5 c-lg:right-17 c-lg:top-10 c-lg:gap-7"
            }
        />
    );

    if (isInterior) {
        return (
            <div className="mx-auto flex w-full items-center justify-between gap-3 px-5 py-10 b-md:px-22">
                <div data-route-entrance={isInterior ? "header" : undefined} className="flex min-w-0 items-center gap-3 b-md:gap-5 c-lg:gap-12">
                    {logo}
                    {controls}
                </div>
                {navigation}
            </div>
        );
    }

    return (
        <>
            <div
                className="
                    absolute
                    left-8
                    top-8
                    z-40

                    flex
                    items-center
                    gap-5

                    c-lg:left-18
                    c-lg:top-10
                    c-lg:gap-12
                "
            >
                {logo}
                {controls}
            </div>

            {navigation}
        </>
    );
}

export default PortfolioDesktopHeader;

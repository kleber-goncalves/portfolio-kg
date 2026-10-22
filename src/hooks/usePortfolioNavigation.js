import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { getExperienceMode } from "../utils/experienceMode";
import { scrollToTarget } from "../utils/lenisControl";

function usePortfolioNavigation() {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    return useCallback((href) => {
        if (!href) return;

        if (!href.startsWith("#")) {
            navigate(href);
            return;
        }

        // Âncoras pertencem à Home. Em uma rota interna, volte primeiro
        // para a Home e deixe o Hero aguardar o carregamento da seção.
        if (pathname !== "/") {
            navigate("/", {
                state: { portfolioScrollTarget: href },
            });
            return;
        }

        if (href === "#hero") {
            scrollToTarget(0, { duration: 1.4 });
            return;
        }

        if (href === "#stack" && (getExperienceMode() || "full") === "full") {
            const heroTransition = ScrollTrigger.getById("heroTransition");

            if (heroTransition) {
                scrollToTarget(heroTransition.end, { duration: 1.4 });
                return;
            }
        }

        const section = document.querySelector(href);
        if (section) scrollToTarget(section, { duration: 1.4 });
    }, [navigate, pathname]);
}
export default usePortfolioNavigation;

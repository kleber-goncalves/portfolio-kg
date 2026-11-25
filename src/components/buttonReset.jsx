import { useEffect, useRef, useState } from "react";
import { ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";

import { playUiSound } from "../utils/uiSfx";
import { scrollToTarget } from "../utils/lenisControl";

export default function ButtonReset() {
    const [isVisible, setIsVisible] = useState(
        () => typeof window !== "undefined" && window.scrollY > 400,
    );
    const [isScrolling, setIsScrolling] = useState(false);
    const scrollTimeoutRef = useRef(null);

    useEffect(() => {
        const syncInitialVisibility = () => {
            setIsVisible(window.scrollY > 400);
        };

        const handleScroll = () => {
            setIsVisible(window.scrollY > 400);
            setIsScrolling(true);

            window.clearTimeout(scrollTimeoutRef.current);
            scrollTimeoutRef.current = window.setTimeout(() => {
                setIsScrolling(false);
            }, 150);
        };

        // Sincroniza caso o navegador restaure a página em uma posição rolada.
        syncInitialVisibility();

        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.clearTimeout(scrollTimeoutRef.current);
        };
    }, []);

    const handleBackToTop = (event) => {
        event.preventDefault();
        playUiSound("back");

        scrollToTarget(0, {
            duration: 0.75,
        });
    };

    return (
        <nav
            aria-label="Atalho para voltar ao topo"
            className={`
                fixed
                bottom-1
                right-5
                z-50
                b-md:bottom-6
                b-md:right-8
                transition-[opacity,transform]
                duration-300
                ease-out
                motion-reduce:transition-none
                ${!isVisible
                    ? "pointer-events-none translate-y-5 opacity-0"
                    : isScrolling
                      ? "translate-y-0 opacity-[0.65]"
                      : "translate-y-0 opacity-100"}
            `}
        >
            <Link
                to="#hero"
                onClick={handleBackToTop}
                aria-label="Retornar ao topo"
                title="Retornar ao topo"
                className="
                    group
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-graphite
                    bg-carbon/90
                    text-steel
                    shadow-lg
                    backdrop-blur-sm
                    transition-all
                    duration-300
                    hover:border-bronze
                    hover:text-bronze
                    active:scale-95
                    active:text-bronze
                "
            >
                <ChevronUp
                    className="
                        h-6
                        w-6
                        transition-transform
                        duration-300
                        group-hover:-translate-y-0.5
                    "
                />
            </Link>
        </nav>
    );
}

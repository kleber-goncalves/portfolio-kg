import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";

// Camada global da aplicação
import SmoothScroll from "./components/SmoothScroll";
import ButtonReset from "./components/buttonReset";
import CursorTrail from "./components/CursorTrail";
import Preloader from "./components/Preloader";
import RouteTransitionPreloader from "./components/RouteTransitionPreloader";
import { getExperienceMode } from "./utils/experienceMode";
import useRouteSeo from "./hooks/useRouteSeo";
import { scrollToTarget } from "./utils/lenisControl";
import { attachUiSfxHoverListeners } from "./utils/uiSfx";
import { NAVIGATION_ITEMS } from "./data/navigation";

const MenuDesktop = lazy(() => import("./components/MenuDesktop"));

// As páginas são carregadas sob demanda para não enviar todo o conteúdo
// de rotas secundárias no primeiro carregamento da Home.
const Home = lazy(() => import("./pages/home/Home"));
const Projetos = lazy(() => import("./pages/projetos/Projetos"));
const Sobre = lazy(() => import("./pages/sobre/Sobre"));
const Contato = lazy(() => import("./pages/contato/Contato"));

function RouteScrollReset() {
    const { pathname } = useLocation();
    const previousPathname = useRef(pathname);

    useEffect(() => {
        // Não interfere no scroll/restauração inicial do navegador.
        if (previousPathname.current === pathname) return;

        previousPathname.current = pathname;
        scrollToTarget(0, { immediate: true });
    }, [pathname]);

    return null;
}

function RouteFallback() {
    return (
        <div
            role="status"
            aria-label="Carregando página"
            className="min-h-[50vh] bg-obsidian px-5 py-24 text-sm text-steel"
        >
            
        </div>
    );
}

function App() {
    const location = useLocation();
    const { pathname } = location;
    useRouteSeo(pathname);
    const [routeTransition, setRouteTransition] = useState(null);
    const previousRoutePathname = useRef(pathname);
    const routeTransitionSequence = useRef(0);

    useLayoutEffect(() => {
        if (previousRoutePathname.current === pathname) return;

        previousRoutePathname.current = pathname;
        routeTransitionSequence.current += 1;

        setRouteTransition({
            id: routeTransitionSequence.current,
            pathname,
            ready: false,
        });
    }, [pathname]);

    const handleRouteReady = useCallback((pathname) => {
        setRouteTransition((current) => {
            if (!current || current.pathname !== pathname || current.ready) {
                return current;
            }

            return { ...current, ready: true };
        });
    }, []);

    const handleRouteTransitionComplete = useCallback((id) => {
        setRouteTransition((current) => (
            current?.id === id ? null : current
        ));
    }, []);

    const [experienceMode] = useState(() => getExperienceMode() || "full");
    const [homeMenuVisible, setHomeMenuVisible] = useState(false);
    const [routeNavigationStatus, setRouteNavigationStatus] = useState(() => ({
        pathname: location.pathname,
        visible: true,
    }));
    const [menuHasBeenShown, setMenuHasBeenShown] = useState(false);
    const isHomePath = location.pathname === "/";
    const routeNavigationVisible = routeNavigationStatus.pathname === location.pathname
        ? routeNavigationStatus.visible
        : true;
    const showDesktopMenu = isHomePath ? homeMenuVisible : !routeNavigationVisible;

    const handleHomeMenuVisibilityChange = useCallback((visible) => {
        setHomeMenuVisible(visible);
        if (visible) setMenuHasBeenShown(true);
    }, []);

    useEffect(() => attachUiSfxHoverListeners(), []);

    useEffect(() => {
        if (isHomePath) return undefined;

        const header = document.querySelector("[data-route-navigation]");
        if (!header) return undefined;

        const pathname = location.pathname;
        const observer = new IntersectionObserver(([entry]) => {
            if (!entry) return;

            setRouteNavigationStatus({
                pathname,
                visible: entry.isIntersecting,
            });

            if (!entry.isIntersecting) setMenuHasBeenShown(true);
        }, { threshold: 0.01 });

        observer.observe(header);
        return () => observer.disconnect();
    }, [isHomePath, location.pathname]);

    return (
        <>
            <Preloader />
            <RouteTransitionPreloader
                key={routeTransition?.id ?? "idle"}
                transition={routeTransition}
                onComplete={handleRouteTransitionComplete}
            />
            <CursorTrail />

            <SmoothScroll>
                <div className="relative z-[1] w-full">
                    <Link
                        to="#main-content"
                        onClick={(event) => {
                            event.preventDefault();
                            const target = document.getElementById("main-content");
                            target?.scrollIntoView({ behavior: "auto", block: "start" });
                            target?.focus();
                        }}
                        className="sr-only fixed left-4 top-4 z-[10000] bg-champagne px-4 py-3 font-space text-sm font-semibold text-obsidian focus:not-sr-only focus:outline focus:outline-2 focus:outline-offset-4 focus:outline-champagne"
                    >
                        Pular para o conteúdo principal
                    </Link>

                    <ButtonReset />
                    <RouteScrollReset />

                    <Suspense fallback={<RouteFallback />}>
                        <Routes>
                            <Route
                                path="/"
                                element={<Home experienceMode={experienceMode} onMenuVisibilityChange={handleHomeMenuVisibilityChange} onRouteReady={handleRouteReady} />}
                            />
                            <Route path="/projetos" element={<Projetos experienceMode={experienceMode} onRouteReady={handleRouteReady} />} />
                            <Route path="/sobre" element={<Sobre experienceMode={experienceMode} onRouteReady={handleRouteReady} />} />
                            <Route path="/contato" element={<Contato onRouteReady={handleRouteReady} />} />
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </Suspense>

                    {menuHasBeenShown && (
                        <Suspense fallback={null}>
                            <MenuDesktop items={NAVIGATION_ITEMS} showMenu={showDesktopMenu} />
                        </Suspense>
                    )}
                </div>
            </SmoothScroll>
        </>
    );
}

export default App;

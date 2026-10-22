import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";

// Camada global da aplicação
import SmoothScroll from "./components/SmoothScroll";
import ButtonReset from "./components/buttonReset";
import CursorTrail from "./components/CursorTrail";
import Preloader from "./components/Preloader";
import { getExperienceMode } from "./utils/experienceMode";
import { scrollToTarget } from "./utils/lenisControl";
import { attachUiSfxHoverListeners } from "./utils/uiSfx";

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
            Carregando página...
        </div>
    );
}

function App() {
    const [experienceMode] = useState(() => getExperienceMode() || "full");

    useEffect(() => attachUiSfxHoverListeners(), []);

    return (
        <>
            <Preloader />
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
                                element={<Home experienceMode={experienceMode} />}
                            />
                            <Route path="/projetos" element={<Projetos />} />
                            <Route path="/sobre" element={<Sobre experienceMode={experienceMode} />} />
                            <Route path="/contato" element={<Contato />} />
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </Suspense>
                </div>
            </SmoothScroll>
        </>
    );
}

export default App;

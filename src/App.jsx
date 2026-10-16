// ScrollSmooth - Lenis
import SmoothScroll from "./components/SmoothScroll";

// React
import { useState } from "react";
import { Link } from "react-router-dom";

// Layouts carregados conforme se aproximam da viewport
import DeferredLayoutSection from "./components/DeferredLayoutSection";
import DeferredProjects from "./components/DeferredProjects";

// Styles
import "./App.css";

// Components
import HeroSectionTransition from "./components/HeroSectionTransition";
import ButtonReset from "./components/buttonReset";
import CursorTrail from "./components/CursorTrail";
import Preloader from "./components/Preloader";

// Experience Mode
import { getExperienceMode } from "./utils/experienceMode";

function App() {
    const [experienceMode] = useState(() => getExperienceMode() || "full");

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

                    <main id="main-content" tabIndex={-1} className="w-full outline-none">
                        <HeroSectionTransition experienceMode={experienceMode} />

                        <DeferredLayoutSection section="competencia" experienceMode={experienceMode} />

                        <DeferredProjects experienceMode={experienceMode} />

                        <DeferredLayoutSection section="diferenciais" experienceMode={experienceMode} />

                        <DeferredLayoutSection section="formacao" experienceMode={experienceMode} />
                    </main>

                    <DeferredLayoutSection section="footer" />
                </div>
            </SmoothScroll>
        </>
    );
}

export default App;

// ScrollSmooth - Lenis
import SmoothScroll from "./components/SmoothScroll";

// React
import { useState } from "react";

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
                    <ButtonReset />

                    <HeroSectionTransition experienceMode={experienceMode} />

                    <DeferredLayoutSection section="competencia" experienceMode={experienceMode} />

                    <DeferredProjects experienceMode={experienceMode} />

                    <DeferredLayoutSection section="diferenciais" experienceMode={experienceMode} />

                    <DeferredLayoutSection section="formacao" experienceMode={experienceMode} />

                    <DeferredLayoutSection section="footer" />
                </div>
            </SmoothScroll>
        </>
    );
}

export default App;

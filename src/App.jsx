// ScrollSmooth - Lenis
import SmoothScroll from "./components/SmoothScroll";

// React
import { useState } from "react";

// Layout
import Competencia from "./layout/Competencia";
import ProjetoT from "./layout/ProjetosTeste2";
import Diferenciais from "./layout/DiferenciaisTeste";
import Formacao from "./layout/Formacao";
import Footer from "./layout/Footer";

// Styles
import "./App.css";

// Components
import HeroSectionTransition from "./components/HeroSectionTransition";
import ButtonReset from "./components/buttonReset";
import CursorTrail from "./components/CursorTrail";

// Reduzir animações
import ExperienceSelector from "./components/ExperienceSelector";

// Experience Mode
import { getExperienceMode } from "./utils/experienceMode";

function App() {
    const [experienceMode] = useState(() => getExperienceMode() || "full");

    return (
        <>
            <CursorTrail />

            <SmoothScroll>
                <ExperienceSelector />

                <div className="relative z-[1] w-full">
                    <ButtonReset />

                    <HeroSectionTransition experienceMode={experienceMode} />

                    <Competencia experienceMode={experienceMode} />

                    <ProjetoT />

                    <Diferenciais />

                    <Formacao />

                    <Footer />
                </div>
            </SmoothScroll>
        </>
    );
}

export default App;

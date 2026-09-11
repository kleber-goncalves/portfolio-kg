// ScrollSmooth - Lenis
import SmoothScroll from "./components/SmoothScroll";

// Background
import DotField from "./components/DotField";

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

function App() {
    return (
        <>
            <CursorTrail />
            <SmoothScroll>
                <div
                    className="
                        fixed
                        inset-0
                        z-0
                        pointer-events-none
                        overflow-hidden
                    "
                    aria-hidden="true"
                >
                    <DotField dotRadius={1} dotSpacing={18} cursorRadius={350} bulgeOnly={true} bulgeStrength={35} glowRadius={180} sparkle={false} waveAmplitude={0} gradientFrom="#0d0d0d" gradientTo="#0d0d0d" glowColor="#0D0B09" />
                </div>

                <div className="relative z-[1] w-full">
                    <ButtonReset />

                    <HeroSectionTransition />

                    <Competencia />
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

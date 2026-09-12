// ScrollSmooth - Lenis
import SmoothScroll from "./components/SmoothScroll";

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

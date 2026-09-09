// ScrollSmooth - Lenis
import SmoothScroll from "./components/SmoothScroll";

// Layout
import Competencia from "./layout/CompetenciaTeste";
import Formacao from "./layout/Formacao";
import Footer from "./layout/Footer";

// Styles
import "./App.css";
import ProjetoT from "./layout/ProjetosTeste2";
import Diferenciais from "./layout/DiferenciaisTeste";
import ButtonReset from "./components/buttonReset";
import Hero from "./layout/HeroTeste2";
import Seclogs from "./layout/Logo2";

function App() {
    return (
        <SmoothScroll>
            <ButtonReset />
            <Hero />
            <Seclogs />
            <Competencia />
            <ProjetoT />
            <Diferenciais />
            <Formacao />
            <Footer />
        </SmoothScroll>
    );
}

export default App;

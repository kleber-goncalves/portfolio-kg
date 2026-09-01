// ScrollSmooth - Lenis
import SmoothScroll from "./components/SmoothScroll";

// Layout
import Hero from "./layout/Hero";
import Seclogs from "./layout/logos";
import Competencia from "./layout/CompetenciaTeste";
import Formacao from "./layout/Formacao";
import Footer from "./layout/Footer";

// Styles
import "./App.css";
import ProjetoT from "./layout/ProjetosTeste";
import Diferenciais from "./layout/DiferenciaisTeste";

function App() {
    return (
        <SmoothScroll>
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

// ScrollSmooth - Lenis
import SmoothScroll from "./components/SmoothScroll";

// Layout
import Hero from "./layout/Hero";
import Seclogs from "./layout/logos";
import Competencia from "./layout/Competencia";
import Diferenciais from "./layout/Diferenciais";
import Formacao from "./layout/Formacao";
import Footer from "./layout/Footer";

// Styles
import "./App.css";
import ProjetoT from "./layout/ProjetosTeste";

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

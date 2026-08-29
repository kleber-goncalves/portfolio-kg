// ScrollSmooth - Lenis
import SmoothScroll from "./components/SmoothScroll";

// Layout
import Hero from "./layout/Hero";
import Seclogs from "./layout/logos";
import Competencia from "./layout/Competencia";
import Projetos from "./layout/Projetos";
import Diferenciais from "./layout/Diferenciais";
import Formacao from "./layout/Formacao";
import Footer from "./layout/Footer";

// Styles
import "./App.css";

function App() {
    return (
        <SmoothScroll>
            <Hero />
            <Seclogs />
            <Competencia />
            <Projetos />
            <Diferenciais />
            <Formacao />
            <Footer />
        </SmoothScroll>
    );
}

export default App;

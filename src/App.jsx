// ScrollSmooth - Lenis
import SmoothScroll from "./components/SmoothScroll";

// Layout
import Competencia from "./layout/CompetenciaTeste";
import Formacao from "./layout/Formacao";
import Footer from "./layout/Footer";

// Styles
import "./App.css";
import ProjetoT from "./layout/ProjetosTeste";
import Diferenciais from "./layout/DiferenciaisTeste";
import Seclogs from "./layout/LogosTeste";
import Hero from "./layout/HeroTeste";

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

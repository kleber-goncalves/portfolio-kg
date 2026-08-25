// Layout
import Hero from "./layout/Hero";

// Styles
import "./App.css";
import Seclogs from "./layout/logos";
import Competencia from "./layout/Competencia";
import Projetos from "./layout/Projetos";

function App() {
    return (
        <>
            <Hero />
            <Seclogs />
            <Competencia />
            <Projetos />
            <Seclogs />
            <Competencia />
        </>
    );
}

export default App;

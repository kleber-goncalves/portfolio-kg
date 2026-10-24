import { useEffect } from "react";
import InteriorPageLayout from "../../layouts/InteriorPageLayout";
import ProjetoCatalogo from "../../components/ProjetoCatalogo";

function Projetos({ onRouteReady }) {
    useEffect(() => {
        onRouteReady?.("/projetos");
    }, [onRouteReady]);

    return (
        <InteriorPageLayout
            title="Projetos"
            description="Explore projetos web, aplicações, APIs e estudos organizados por área. Cada item reúne uma descrição, tecnologias e os links disponíveis para demonstração ou código."
            
        >
            <ProjetoCatalogo />
        </InteriorPageLayout>
    );
}

export default Projetos;

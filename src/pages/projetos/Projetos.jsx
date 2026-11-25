import { useEffect } from "react";
import InteriorPageLayout from "../../layouts/InteriorPageLayout";
import ProjetoCatalogo from "./layouts/ProjetoCatalogo";

function Projetos({ experienceMode = "full", entranceKey = 0, isRouteTransitioning = false, onRouteReady, onRouteNavigationElementChange }) {
    useEffect(() => {
        onRouteReady?.("/projetos");
    }, [onRouteReady]);

    return (
        <InteriorPageLayout
            title="Projetos"
            description="Explore projetos web, aplicações, APIs e estudos organizados por área. Cada item reúne uma descrição, tecnologias e os links disponíveis para demonstração ou código."
            entranceKey={entranceKey}
            isRouteTransitioning={isRouteTransitioning}
            onRouteNavigationElementChange={onRouteNavigationElementChange}
        >
            <ProjetoCatalogo experienceMode={experienceMode} />
        </InteriorPageLayout>
    );
}

export default Projetos;

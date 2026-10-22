import DeferredProjects from "../../components/DeferredProjects";
import InteriorPageLayout from "../../layouts/InteriorPageLayout";

function Projetos({ experienceMode = "full" }) {
    return (
        <InteriorPageLayout
            eyebrow="// PORTFÓLIO"
            title="Projetos"
            description="Uma seleção de trabalhos, estudos e aplicações desenvolvidas para explorar interfaces, arquitetura, integração e experiência de uso."
        >
            <DeferredProjects experienceMode={experienceMode} />
        </InteriorPageLayout>
    );
}

export default Projetos;

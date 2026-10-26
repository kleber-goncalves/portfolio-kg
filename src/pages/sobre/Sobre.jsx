import DeferredLayoutSection from "../../components/DeferredLayoutSection";
import InteriorPageLayout from "../../layouts/InteriorPageLayout";
import SobreHero from "./SobreHero";

function Sobre({ experienceMode = "full", entranceKey = 0, onRouteReady }) {
    return (
        <InteriorPageLayout
            title="Sobre"
            description="Conheça minha formação, competências e diferenciais na construção de aplicações web."
            entranceKey={entranceKey}
            heroContent={<SobreHero experienceMode={experienceMode} onRouteReady={onRouteReady} />}
        >
            <DeferredLayoutSection
                section="competencia"
                experienceMode={experienceMode}
            />
            <DeferredLayoutSection
                section="diferenciais"
                experienceMode={experienceMode}
            />
            <DeferredLayoutSection
                section="formacao"
                experienceMode={experienceMode}
            />
        </InteriorPageLayout>
    );
}

export default Sobre;

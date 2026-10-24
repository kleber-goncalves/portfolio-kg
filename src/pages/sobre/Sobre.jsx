import DeferredLayoutSection from "../../components/DeferredLayoutSection";
import InteriorPageLayout from "../../layouts/InteriorPageLayout";
import SobreHero from "./SobreHero";

function Sobre({ experienceMode = "full" }) {
    return (
        <InteriorPageLayout
            title="Sobre"
            description="Conheça minha formação, competências e diferenciais na construção de aplicações web."
            heroContent={<SobreHero experienceMode={experienceMode} />}
            showFallbackFooter={false}
            footerContent={<DeferredLayoutSection section="footer" />}
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

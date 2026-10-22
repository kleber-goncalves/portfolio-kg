import DeferredLayoutSection from "../../components/DeferredLayoutSection";
import DeferredProjects from "../../components/DeferredProjects";
import HeroSectionTransition from "../../components/HeroSectionTransition";

function Home({ experienceMode = "full" }) {
    return (
        <>
            <main id="main-content" tabIndex={-1} className="w-full outline-none">
                <HeroSectionTransition experienceMode={experienceMode} />

                <DeferredLayoutSection
                    section="competencia"
                    experienceMode={experienceMode}
                />

                <DeferredProjects experienceMode={experienceMode} />

                <DeferredLayoutSection
                    section="diferenciais"
                    experienceMode={experienceMode}
                />

                <DeferredLayoutSection
                    section="formacao"
                    experienceMode={experienceMode}
                />
            </main>

            <DeferredLayoutSection section="footer" />
        </>
    );
}

export default Home;

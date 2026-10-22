import DeferredProjects from "../../components/DeferredProjects";
import DeferredLayoutSection from "../../components/DeferredLayoutSection";
import HeroSectionTransition from "../../components/HeroSectionTransition";

function Home({ experienceMode = "full" }) {
    return (
        <>
            <main id="main-content" tabIndex={-1} className="w-full outline-none">
                <HeroSectionTransition experienceMode={experienceMode} />
                <DeferredProjects experienceMode={experienceMode} />
            </main>

            <DeferredLayoutSection section="footer" />
        </>
    );
}

export default Home;

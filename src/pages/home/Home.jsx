import DeferredProjects from "../../components/DeferredProjects";
import DeferredLayoutSection from "../../components/DeferredLayoutSection";
import HeroSectionTransition from "../../components/HeroSectionTransition";

function Home({ experienceMode = "full", entranceKey = 0, onMenuVisibilityChange, onRouteReady }) {
    return (
        <>
            <main id="main-content" tabIndex={-1} className="w-full outline-none">
                <HeroSectionTransition
                    experienceMode={experienceMode}
                    entranceKey={entranceKey}
                    onMenuVisibilityChange={onMenuVisibilityChange}
                    onRouteReady={onRouteReady}
                />
                <DeferredProjects experienceMode={experienceMode} />
            </main>

            <DeferredLayoutSection section="footer" />
        </>
    );
}

export default Home;

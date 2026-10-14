import { lazy, Suspense } from "react";

const HeroMobile = lazy(() => import("../components/HeroMobile"));
const HeroDesktop = lazy(() => import("../components/HeroDesktop"));

function Hero({ isMobileLayout, dotFieldFrozen = false, onNavigate, onReady, experienceMode = "full" }) {
    // ============================================================
    // ITENS DO MENU
    // ============================================================

    const menuItems = [
        {
            label: "Hero",
            href: "#hero",
        },
        {
            label: "Stack",
            href: "#stack",
        },
        {
            label: "Competências",
            href: "#competencias",
        },
        {
            label: "Projetos",
            href: "#projetos",
        },
        {
            label: "Diferenciais",
            href: "#diferenciais",
        },
        {
            label: "Formação",
            href: "#formacao",
        },
    ];

    return (
        <section id="hero" className="relative">
            {isMobileLayout ? (
                <div className="p-5">
                    <Suspense fallback={<div aria-hidden="true" className="min-h-[calc(100svh-2.5rem)]" />}>
                        <HeroMobile items={menuItems} onReady={onReady} />
                    </Suspense>
                </div>
            ) : (
                <Suspense fallback={<div aria-hidden="true" className="h-screen w-full" />}>
                    <HeroDesktop items={menuItems} dotFieldFrozen={dotFieldFrozen} onNavigate={onNavigate} onReady={onReady} experienceMode={experienceMode} />
                </Suspense>
            )}
        </section>
    );
}

export default Hero;

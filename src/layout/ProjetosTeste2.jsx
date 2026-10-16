import { lazy, Suspense } from "react";

import useResponsive from "../hooks/useResponsive";

// ============================================================
// IMAGENS
// ============================================================

import projeto01_01 from "../assets/projetos/projeto01/jason-1.webp";
import projeto01_02 from "../assets/projetos/projeto01/jason-2.webp";
import projeto01_03 from "../assets/projetos/projeto01/jason-3.webp";
import projeto01_04 from "../assets/projetos/projeto01/lucia-1.webp";


const ProjetoDesktop = lazy(() => import("../components/ProjetoDesktop"));
const ProjetoCarouselMobile = lazy(() => import("../components/ProjetoCarouselMobile"));

function MobileCarouselPlaceholder({ projectCount }) {
    return (
        <div className="relative flex min-h-screen w-full items-center overflow-hidden px-0 pb-12 pt-24">
            <div className="absolute left-0 top-0 z-20 flex w-full flex-row items-center gap-2 p-5 pt-12">
                <h2 className="whitespace-nowrap text-sm uppercase text-steel">
                    // Projetos
                </h2>
                <span className="h-0.5 flex-1 bg-gradientaa" />
                <span className="flex items-center gap-1 text-sm text-champagne">
                    01 <span className="text-white/20">/</span>
                    <span className="text-champagne/50">
                        {String(projectCount).padStart(2, "0")}
                    </span>
                </span>
            </div>
            <div className="w-full px-5" aria-hidden="true">
                <div className="mx-auto h-[52vh] w-[89vw] animate-pulse rounded-3xl bg-neutral-900/60" />
            </div>
        </div>
    );
}

function Projetos({ experienceMode = "full", onReady }) {
    const { isMobileLayout } = useResponsive();

    const projetos = [
        {
            numero: "01",

            titulo: "Autono",

            descricao: "O Autono é um projeto fictício desenvolvido para fins de estudo e demonstração de boas práticas em desenvolvimento web moderno.",

            tecnologias: ["React", "Node.js", "Tailwind", "GSAP", "Supabase"],

            preview: projeto01_01,

            imagens: [projeto01_01, projeto01_02, projeto01_03, projeto01_04],

            demo: "https://autono-kg.vercel.app/",

            github: "https://github.com/kleber-goncalves/autono",
        },

        {
            numero: "02",

            titulo: "GTA VI",

            descricao: "Uma landing page moderna e cinematográfica inspirada na estética visual do site promocional de Grand Theft Auto VI - Rockstar Games, desenvolvida como estudo pessoal de front-end, interação, storytelling visual, motion design com o GSAP.",

            tecnologias: ["HTML", "CSS", "Node.js", "GSAP"],

            imagens: [projeto01_01, projeto01_02, projeto01_03, projeto01_04],

            demo: "https://gtavi-kg.vercel.app/",

            github: "https://github.com/kleber-goncalves/GTA-VI",
        },

        {
            numero: "03",

            titulo: "Clone do site do iPhone 17 Pro",

            descricao: "Este é um projeto inspirada no design e na estrutura do site oficial do iPhone 17 Pro da Apple.",

            tecnologias: ["React", "Node.js", "Tailwind"],

            imagens: [projeto01_01, projeto01_02, projeto01_03, projeto01_04],

            demo: "https://iphone-17-pro-kg.vercel.app/",

            github: "https://github.com/kleber-goncalves/iphone-17-PRO-MAX",
        },

        {
            numero: "04",

            titulo: "Portifólio de Arquitetura (DNC)",

            descricao: "Este projeto é um site de arquitetura da DNC focado em React e APIs.",

            tecnologias: ["React", "Node.js", "API"],

            imagens: [projeto01_01, projeto01_02, projeto01_03, projeto01_04],

            demo: "https://dnc-arq-kleber.vercel.app/",

            github: "https://github.com/kleber-goncalves/dnc-arq-kleber",
        },

        {
            numero: "05",

            titulo: "Dashboard de Vendas (DNC)",

            descricao: "Dashboard de Vendas desenvolvido como projeto didático para a escola DNC. A aplicação demonstra conceitos de visualização de métricas, organização de componentes React em TypeScript e fluxo básico de pages e testes.",

            tecnologias: ["React", "Node.js", "TypeScript"],

            imagens: [projeto01_01, projeto01_02, projeto01_03, projeto01_04],

            demo: "https://dashboard-de-vendas-psi.vercel.app/",

            github: "https://dashboard-de-vendas-psi.vercel.app/",
        },

        {
            numero: "06",

            titulo: "CAFENA - Café da Região (DNC)",

            descricao: "Este é um Minimum Viable Product (MVP) desenvolvido para a CAFENA, uma cafeteria fictícia focada em promover o café da região.",

            tecnologias: ["HTML", "CSS"],

            imagens: [projeto01_01, projeto01_02, projeto01_03, projeto01_04],

            demo: "https://coffe-page-kl.vercel.app/",

            github: "https://github.com/kleber-goncalves/coffe-page",
        },
    ];


    return (
        <section className="w-full bg-obsidian">
            {!isMobileLayout && (
                <Suspense
                    fallback={
                        <div
                            aria-hidden="true"
                            className="min-h-screen w-full bg-obsidian"
                        />
                    }
                >
                    <ProjetoDesktop
                        projetos={projetos}
                        experienceMode={experienceMode}
                        onReady={onReady}
                    />
                </Suspense>
            )}

            {isMobileLayout && (
                <Suspense
                    fallback={
                        <MobileCarouselPlaceholder
                            projectCount={projetos.length}
                        />
                    }
                >
                    <ProjetoCarouselMobile
                        projects={projetos}
                        tecnologiasConfig={tecnologias}
                        onReady={onReady}
                    />
                </Suspense>
            )}
        </section>
    );
}

export default Projetos;

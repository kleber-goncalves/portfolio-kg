import { useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import InteriorPageLayout from "../../layouts/InteriorPageLayout";

const CONTACT_LINKS = [
    {
        label: "GitHub",
        description: "Repositórios e projetos",
        href: "https://github.com/kleber-goncalves",
        mark: "GH",
    },
    {
        label: "LinkedIn",
        description: "Perfil profissional",
        href: "https://www.linkedin.com/in/kleber-goncalve-s/",
        mark: "in",
    },
];

function Contato({ entranceKey = 0, isRouteTransitioning = false, onRouteReady }) {
    useEffect(() => {
        onRouteReady?.("/contato");
    }, [onRouteReady]);

    return (
        <InteriorPageLayout
            title="Vamos conversar."
            description="Um espaço para conversar sobre projetos, oportunidades e desenvolvimento de soluções web."
            entranceKey={entranceKey}
            isRouteTransitioning={isRouteTransitioning}
        >
            <section className="mx-auto w-full max-w-7xl px-5 pb-10 b-md:px-10 b-md:pb-16">
                <div className="max-w-3xl border border-graphite bg-carbon/40 p-5 b-md:p-8">
                    <h2 data-route-entrance="content" className="font-space text-xl font-medium text-ivory b-md:text-2xl">
                        Canais de contato
                    </h2>
                    <p data-route-entrance="content" className="mt-3 text-sm leading-6 text-steel">
                        O formulário será implementado quando definirmos um destino real
                        para o envio e as proteções necessárias. Por enquanto, não existe
                        envio de formulário nesta página, evitando simular uma confirmação
                        que não corresponderia a uma mensagem enviada.
                    </p>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        {CONTACT_LINKS.map(({ label, description, href, mark }) => (
                            <a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noreferrer"
                                data-route-entrance="item"
                                className="group flex items-center justify-between gap-4 border border-graphite p-4 transition-colors hover:border-bronze"
                            >
                                <span className="flex items-center gap-3">
                                    <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center border border-graphite font-space text-xs font-semibold text-bronze">{mark}</span>
                                    <span>
                                        <span className="block text-sm text-ivory">
                                            {label}
                                        </span>
                                        <span className="mt-1 block text-xs text-steel">
                                            {description}
                                        </span>
                                    </span>
                                </span>
                                <ArrowUpRight
                                    aria-hidden="true"
                                    size={17}
                                    className="shrink-0 text-steel transition-colors group-hover:text-champagne"
                                />
                            </a>
                        ))}
                    </div>
                </div>
            </section>
        </InteriorPageLayout>
    );
}

export default Contato;

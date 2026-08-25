
import LogoLoop from '../components/logoLoop'

import {
    Html5,
    CssNew,
    Javascript,
    Gsap,
    React,
    TailwindCss,
    Nodejs,
    Figma,
    Nextdotjs,
    Vitejs,
    Typescript,
    Supabase,
    Postgresql,
    Sqlite,
    Vercel,
    Git,
    Github,
} from "@thesvg/react";


const techLogos = [
    {
        node: <Html5 className="w-12 h-12 fill-current text-ivory" />,
        title: "React",
        href: "https://react.dev",
    },
    {
        node: <CssNew className="w-12 h-12 fill-current text-ivory" />,
        title: "Tailwind CSS",
        href: "https://tailwindcss.com",
    },
    {
        node: <Javascript className="w-12 h-12 fill-current text-ivory" />,
        title: "Next.js",
        href: "https://nextjs.org",
    },
    {
        node: (
            <Gsap
                className="w-12 h-12 fill-current text-[#0AE448]"
            />
        ),
        title: "TypeScript",
        href: "https://typescriptlang.org",
    },
    {
        node: <React className="w-12 h-12 fill-current text-ivory" />,
        title: "Tailwind CSS",
        href: "https://tailwindcss.com",
    },
    {
        node: <TailwindCss className="w-12 h-12 fill-current text-ivory" />,
        title: "Tailwind CSS",
        href: "https://tailwindcss.com",
    },
    {
        node: <Nodejs className="w-12 h-12 fill-current text-ivory" />,
        title: "Tailwind CSS",
        href: "https://tailwindcss.com",
    },
    {
        node: <Nextdotjs className="w-12 h-12 fill-current text-ivory" />,
        title: "Tailwind CSS",
        href: "https://tailwindcss.com",
    },
    {
        node: <Vitejs className="w-12 h-12 fill-current text-ivory" />,
        title: "Tailwind CSS",
        href: "https://tailwindcss.com",
    },
    {
        node: <Typescript className="w-12 h-12 fill-current text-ivory" />,
        title: "Tailwind CSS",
        href: "https://tailwindcss.com",
    },
    {
        node: <Supabase className="w-12 h-12 fill-current text-ivory" />,
        title: "Tailwind CSS",
        href: "https://tailwindcss.com",
    },
    {
        node: <Postgresql className="w-12 h-12 fill-current text-ivory" />,
        title: "Tailwind CSS",
        href: "https://tailwindcss.com",
    },
    {
        node: <Sqlite className="w-12 h-12 fill-current text-ivory" />,
        title: "Tailwind CSS",
        href: "https://tailwindcss.com",
    },
    {
        node: <Vercel className="w-12 h-12 fill-current text-ivory" />,
        title: "Tailwind CSS",
        href: "https://tailwindcss.com",
    },
    {
        node: <Git className="w-12 h-12 fill-current text-ivory" />,
        title: "Tailwind CSS",
        href: "https://tailwindcss.com",
    },
    {
        node: (
            <Github
                className="w-12 h-12 fill-current text-ivory"
                variant="dark"
            />
        ),
        title: "Tailwind CSS",
        href: "https://tailwindcss.com",
    },
    {
        node: <Figma className="w-12 h-12 fill-current text-ivory" />,
        title: "Tailwind CSS",
        href: "https://tailwindcss.com",
    },
];



function Seclogs() {
    return (
        <section className="bg-obsidian w-full  h-full relative overflow-hidden flex flex-col items-center gap-10">
            <div className="flex flex-row items-center gap-2 w-full p-5 md:p-10">
                <h2 className="text-sm md:text-7xl text-steel uppercase">
                    // Stack & Ferramentas
                </h2>
                <span className="flex-1 h-0.5 md:h-1 bg-gradientaa"></span>
            </div>
            <div className="bg-obsidian w-full h-full relative overflow-hidden flex flex-col items-center gap-2">
                <div className="bg-obsidian w-full h-20 relative overflow-hidden flex flex-row items-center">
                    <LogoLoop
                        logos={techLogos}
                        speed={110}
                        direction="left"
                        logoHeight={60}
                        gap={60}
                        hoverSpeed={0}
                        scaleOnHover
                        fadeOut
                        fadeOutColor="#0b0b0b"
                        ariaLabel="Technology partners"
                    />
                </div>
                <div className="bg-obsidian w-full h-20 relative overflow-hidden flex flex-row items-center">
                    <LogoLoop
                        logos={techLogos}
                        speed={100}
                        direction="right"
                        logoHeight={60}
                        gap={60}
                        hoverSpeed={0}
                        scaleOnHover
                        fadeOut
                        fadeOutColor="#0b0b0b"
                        ariaLabel="Technology partners"
                    />
                </div>
                <div className="bg-obsidian w-full h-20 relative overflow-hidden flex flex-row items-center">
                    <LogoLoop
                        logos={techLogos}
                        speed={150}
                        direction="left"
                        logoHeight={60}
                        gap={60}
                        hoverSpeed={0}
                        scaleOnHover
                        fadeOut
                        fadeOutColor="#0b0b0b"
                        ariaLabel="Technology partners"
                    />
                </div>
            </div>
        </section>
    );
}

export default Seclogs;

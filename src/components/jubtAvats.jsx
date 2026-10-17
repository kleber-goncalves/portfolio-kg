import { Github, Linkedin, Instagram } from "@thesvg/react";

export default function StackedIconGroup() {
    // 1. Coloque os seus ícones nesta lista na ordem em que devem aparecer (de cima para baixo)
    const iconList = [Github, Linkedin, Instagram];

    return (
        <div className="flex flex-col space-y-[-14px] ">
            {iconList.map((IconComponent, index) => (
                <div
                    key={index}
                    className="w-12 h-12 rounded-full flex items-center justify-center shadow-sm transition-all hover:translate-y-1 hover:z-20 cursor-pointer"
                    style={{ zIndex: iconList.length - index }}
                >
                    <IconComponent className="w-5 h-5" />
                </div>
            ))}
        </div>
    );
}


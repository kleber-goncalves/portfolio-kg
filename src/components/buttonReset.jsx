import { useEffect, useRef, useState } from "react";
import { ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";
import { playUiSound } from "../utils/uiSfx";

export default function ButtonReset() {
    const [isVisible, setIsVisible] = useState(false);
     const [isScrolling, setIsScrolling] = useState(false);

     const scrollTimeoutRef = useRef(null);

     // =========================================
     // CONTROLA VISIBILIDADE E ESTADO DO SCROLL
     // =========================================

     useEffect(() => {
         const handleScroll = () => {
             // Mostra o botão depois de 400px
             setIsVisible(window.scrollY > 400);

             // Usuário está rolando
             setIsScrolling(true);

             // Limpa o timer anterior
             clearTimeout(scrollTimeoutRef.current);

             // Considera que parou depois de 150ms
             scrollTimeoutRef.current = setTimeout(() => {
                 setIsScrolling(false);
             }, 150);
         };

         window.addEventListener("scroll", handleScroll, {
             passive: true,
         });

         return () => {
             window.removeEventListener("scroll", handleScroll);
             clearTimeout(scrollTimeoutRef.current);
         };
     }, []);


    // =========================================
    // VOLTAR AO TOPO
    // =========================================

    const handleBackToTop = (event) => {
        event.preventDefault();
        playUiSound("back");

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <div
            className={`
                fixed
                bottom-1
                right-5
                z-50
                b-md:hidden
                transition-[opacity,transform]
                duration-300
                ease-out
                motion-reduce:transition-none
                ${!isVisible
                    ? "pointer-events-none translate-y-5 opacity-0"
                    : isScrolling
                      ? "translate-y-0 opacity-[0.65]"
                      : "translate-y-0 opacity-100"}
            `}
        >
            <Link
                to="#hero"
                onClick={handleBackToTop}
                aria-label="Retornar ao topo"
                title="Retornar ao topo"
                className="
                    group
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-graphite
                    bg-carbon/90
                    text-steel
                    shadow-lg
                    backdrop-blur-sm
                    transition-all
                    duration-300
                    hover:border-bronze
                    hover:text-bronze
                    active:scale-95
                    active:text-bronze
                "
            >
                <ChevronUp
                    className="
                        h-6
                        w-6
                        transition-transform
                        duration-300
                        group-hover:-translate-y-0.5
                    "
                />
            </Link>
        </div>
    );
}

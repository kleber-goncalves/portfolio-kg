import { useEffect, useRef, useState } from "react";
import { ChevronUp } from "lucide-react";
import gsap from "gsap";

export default function ButtonReset() {
    const [isVisible, setIsVisible] = useState(false);
     const [isScrolling, setIsScrolling] = useState(false);

     const buttonRef = useRef(null);
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
    // ANIMAÇÃO DE ENTRADA / SAÍDA
    // =========================================

    useEffect(() => {
        if (!buttonRef.current) return;

        if (isVisible) {
            gsap.to(buttonRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.4,
                ease: "power2.out",
            });
        } else {
            gsap.to(buttonRef.current, {
                opacity: 0,
                y: 20,
                duration: 0.3,
                ease: "power2.in",
            });
        }
    }, [isVisible]);
    // =========================================
    // EFEITO DE VIDRO DURANTE O SCROLL
    // =========================================

    useEffect(() => {
        if (!buttonRef.current || !isVisible) return;

        if (isScrolling) {
            gsap.to(buttonRef.current, {
                opacity: 0.65,
                duration: 0.25,
                ease: "power2.out",
            });
        } else {
            gsap.to(buttonRef.current, {
                opacity: 1,
                duration: 0.35,
                ease: "power2.out",
            });
        }
    }, [isScrolling, isVisible]);

    // =========================================
    // VOLTAR AO TOPO
    // =========================================

    const handleBackToTop = (event) => {
        event.preventDefault();

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <div
            ref={buttonRef}
            className="
                fixed
                bottom-1
                right-5
                z-50
                md:hidden
                opacity-0
            "
        >
            <a
                href="#hero"
                onClick={handleBackToTop}
                aria-label="Retornar ao topo"
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
            </a>
        </div>
    );
}

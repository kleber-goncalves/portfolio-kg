import { motion, useMotionValue, useSpring, useTransform, animate } from "motion/react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useEffect } from "react";

export default function GlobeIcon() {
    /*
    ============================================================
    ROTAÇÃO AUTOMÁTICA
    ============================================================
    */

    const automaticRotation = useMotionValue(0);

    /*
    ============================================================
    ROTAÇÃO DO MOUSE
    ============================================================
    */

    const mouseRotation = useMotionValue(0);

    /*
    ============================================================
    ROTAÇÃO DO SCROLL
    ============================================================

    Esse valor NÃO possui animação própria.

    Ele representa diretamente a posição do scroll.
    */

    const scrollRotation = useMotionValue(0);

    /*
    ============================================================
    SPRING — ROTAÇÃO AUTOMÁTICA
    ============================================================
    */

    const smoothAutomaticRotation = useSpring(automaticRotation, {
        stiffness: 280,
        damping: 12,
        mass: 1,
    });

    /*
    ============================================================
    SPRING — MOUSE
    ============================================================
    */

    const smoothMouseRotation = useSpring(mouseRotation, {
        stiffness: 180,
        damping: 18,
        mass: 0.8,
    });

    /*
    ============================================================
    SPRING — SCROLL
    ============================================================

    O spring apenas suaviza a mudança.

    Ele NÃO faz a rotação voltar sozinho.
    */

    const smoothScrollRotation = useSpring(scrollRotation, {
        stiffness: 120,
        damping: 20,
        mass: 1,
    });

    /*
    ============================================================
    ROTAÇÃO FINAL
    ============================================================

    Junta:

    1. balanço automático
    2. mouse
    3. scroll
    */

    const finalRotation = useTransform([smoothAutomaticRotation, smoothMouseRotation, smoothScrollRotation], ([automatic, mouse, scroll]) => automatic + mouse + scroll);

    /*
    ============================================================
    BALANÇO AUTOMÁTICO
    ============================================================
    */

    useEffect(() => {
        const controls = animate(automaticRotation, [-24, 24, -24], {
            duration: 9,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "loop",
        });

        return () => controls.stop();
    }, [automaticRotation]);

    /*
    ============================================================
    SCROLL
    ============================================================
    */

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;

            /*
            ----------------------------------------------------
            CONFIGURAÇÃO
            ----------------------------------------------------
            */

            // Quantos pixels de scroll são necessários
            // para chegar à inclinação máxima.

            const maxScroll = 1000;

            // Inclinação máxima para a direita.

            const maxRotation = 35;

            /*
            ----------------------------------------------------
            PROGRESSO
            ----------------------------------------------------
            */

            const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);

            /*
            ----------------------------------------------------
            ROTAÇÃO
            ----------------------------------------------------

            Scroll 0px
                ↓
                0°

            Scroll 500px
                ↓
                +17.5°

            Scroll 1000px
                ↓
                +35°

            Depois disso permanece em +35°.
            */

            scrollRotation.set(progress * maxRotation);
        };

        window.addEventListener("scroll", handleScroll, {
            passive: true,
        });

        /*
        Atualiza imediatamente.
        */

        handleScroll();

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [scrollRotation]);

    /*
    ============================================================
    MOUSE
    ============================================================
    */

    const handleMouseMove = (event) => {
        const element = event.currentTarget;

        const rect = element.getBoundingClientRect();

        const mouseX = event.clientX - rect.left;

        const centerX = rect.width / 2;

        const normalizedX = (mouseX - centerX) / centerX;

        /*
        Apenas uma pequena influência.
        */

        mouseRotation.set(normalizedX * 4);
    };

    /*
    ============================================================
    MOUSE LEAVE
    ============================================================
    */

    const handleMouseLeave = () => {
        mouseRotation.set(0);
    };

    /*
    ============================================================
    RENDER
    ============================================================
    */

    return (
        <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotate: finalRotation,
            }}
            className="
            flex
            h-full
            w-full
            items-center
            justify-center
        "
        >
          
                <DotLottieReact src="/Scene.lottie" autoplay loop className="h-full w-full" />
            
        </motion.div>
    );
}

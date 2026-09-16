import {
    motion,
    useMotionValue,
    useSpring,
    animate,
} from "motion/react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useEffect } from "react";

export default function GlobeIcon() {
    /*
    ============================================================
    ROTAÇÃO BASE
    ============================================================
    
    Esse valor controla a rotação automática do globo.
    */

    const automaticRotation = useMotionValue(0);

    /*
    ============================================================
    ROTAÇÃO DO MOUSE
    ============================================================

    O mouse pode dar uma pequena influência no movimento,
    mas não controla a animação principal.
    */

    const mouseRotation = useMotionValue(0);

    /*
    ============================================================
    SPRINGS
    ============================================================
    */

    const smoothAutomaticRotation = useSpring(
        automaticRotation,
        {
            stiffness: 280,
            damping: 12,
            mass: 1,
        }
    );



    /*
    ============================================================
    ANIMAÇÃO AUTOMÁTICA
    ============================================================

    O globo fica constantemente fazendo:

        esquerda
             ↓
        centro
             ↓
        direita
             ↓
        centro
             ↓
        esquerda

    */

    useEffect(() => {
        const controls = animate(
            automaticRotation,
            [-34, 34, -34],
            {
                duration: 9,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "loop",
            }
        );

        return () => controls.stop();
    }, [automaticRotation]);

    /*
    ============================================================
    MOUSE
    ============================================================
    */

    const handleMouseMove = (event) => {
        const element = event.currentTarget;

        const rect =
            element.getBoundingClientRect();

        const mouseX =
            event.clientX - rect.left;

        const centerX =
            rect.width / 2;

        /*
        --------------------------------------------------------
        NORMALIZAÇÃO
        --------------------------------------------------------

        -1 = esquerda
         0 = centro
         1 = direita
        */

        const normalizedX =
            (mouseX - centerX) / centerX;

        /*
        --------------------------------------------------------
        INFLUÊNCIA DO MOUSE
        --------------------------------------------------------

        O mouse só acrescenta até ±4 graus.
        */

        mouseRotation.set(
            normalizedX * 4
        );
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
                rotate: smoothAutomaticRotation,
            }}
            className="
                flex
                h-12
                w-12
                items-center
                justify-center
            "
        >
            <DotLottieReact
                src="/Scene.lottie"
                autoplay
                loop
                className="h-10 w-10"
            />
        </motion.div>
    );
}

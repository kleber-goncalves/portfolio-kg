export default function Card1({
    title,
    text,
    text_2,
    variant = "default",
    className = "",
    classNameText = "",
    classNameTitle = "",
    classNametext2 = "",
    ...props
}) {
    const cardClass =
        "w-full h-full relative overflow-hidden flex flex-col md:grid md:grid-cols-3 md:grid-rows-2 items-start gap-5 p-5 md:p-11 bg-carbon rounded-xl border border-graphite";

    // Contents
    const contetText = "flex flex-col items-start text-bronze";
    const contetCetral = "flex flex-col items-start gap-3";

    // Typography
    const Text = "text-xs md:text-sm";
    const Title = "font-space text-sm md:text-2xl text-ivory";
    const TextII = "text-xs md:text-sm text-steel";

    const variants = {
        default: {
            title: "text-ivory",
            text: "text-bronze",
            text_2: "text-steel",
        },
        v1: {
            title: "text-white",
            text: "text-white",
            text_2: "text-white",
            text_3: "text-white",
            baseClass: "text-white ",
            baseClassII: "text-white ",
            barra: "border-white",
            barraII: "border-white",
            barraIII: "border-white",
        },
        v2: {
            title: "text-white",
            text: "text-white",
            text_2: "text-white",
            text_3: "text-white",
            baseClass: "text-white ",
            baseClassII: "text-white ",
            barra: "border-white",
            barraII: "border-white",
            barraIII: "border-white",
        },
    };

    const styles = variants[variant];
    return (
        <>
            <div
                className={`${cardClass} ${styles.text} ${className}`}
                {...props}
            >
                <div className={`${contetText} ${styles.text} ${className}`}>
                    <p className={`${Text} ${styles.text} ${classNameText}`}>
                        {text}
                    </p>
                </div>
                <div className={`${contetCetral} ${className}`}>
                    <h2
                        className={`${Title} ${styles.title} ${classNameTitle}`}
                    >
                        {title}
                    </h2>
                    <p
                        className={`${TextII} ${styles.text_2} ${classNametext2}`}
                    >
                        {text_2}
                    </p>
                </div>
            </div>
        </>
    );
}

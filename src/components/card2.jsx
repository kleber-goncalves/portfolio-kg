
export default function Card2({
    title,
    number,
    text,
    variant = "default",
    className = "",
    classNameNumber = "",
    classNameTitle = "",
    classNameText = "",
    selected = false,
    onSelect,
    ...props
}) {

    const cardClass =
        "w-full h-full relative overflow-hidden flex flex-row md:grid md:grid-cols-3 md:grid-rows-2 items-stretch gap-5 bg-carbon rounded-xl border border-graphite pl-0";

    // Contents
    const contetNumber =
        "flex pt-5 pb-5 pl-7 pr-4 flex-col items-start text-bronze relative";
    const contetCetral =
        "flex flex-col pt-5 pb-5 pr-5 items-start gap-3 h-full";


    // Typography
    const Number = "text-3xl md:text-sm font-bebas ";
    const Title = "font-space text-sm md:text-2xl text-ivory font-[600]";
    const Text = "text-xs md:text-sm text-steel";

    const variants = {
        default: {
            Number: "text-ivory",
            title: "text-ivory",
            text: "text-bronze",
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
                id="card2"
                className={`${cardClass} ${
                    selected
                        ? "inset-shadow-sm  inset-shadow-zinc-700  shadow-bronze"
                        : ""
                } ${styles.text} ${className}`}
                onClick={onSelect}
                {...props}
            >
                <div
                    id="contetNumber"
                    className={`${contetNumber} ${
                        selected ? "is-selected" : ""
                    } ${styles.Number} ${className}`}
                >
                    <p
                        id="number"
                        className={`${Number} ${
                            selected ? "text-bronze" : styles.number
                        }  ${styles.number} ${classNameNumber}`}
                    >
                        {number}
                    </p>
                </div>
                <div className={`${contetCetral} ${className}`}>
                    <h2
                        className={`${Title} ${styles.title} ${classNameTitle}`}
                    >
                        {title}
                    </h2>
                    <p className={`${Text} ${styles.text} ${classNameText}`}>
                        {text}
                    </p>
                </div>
            </div>
        </>
    );
}

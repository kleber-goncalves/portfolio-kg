import Card1 from "../components/card";

function Competencia() {
    return (
        <section className="bg-obsidian w-full h-full relative overflow-hidden flex flex-col items-center gap-10">
            <div className="flex flex-col items-center gap-10 w-full">
                <div className="flex flex-row items-center gap-2 w-full">
                    <h2 className="text-sm md:text-7xl text-steel uppercase">
                        // COMPETÊNCIAS
                    </h2>
                    <span className="flex-1 h-0.5 md:h-1 bg-gradientaa"></span>
                </div>
                <div className="w-full h-full relative overflow-hidden flex flex-col items-center gap-3">
                    <Card1
                        variant="default"
                        text="Front."
                        title="React / Front"
                        text_2="Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Minus eveniet quis eaque, laborum voluptas repellendus
                        labore esse fugiat molestiae non explicabo, expedita
                        deleniti commodi adipisci aliquam ex temporibus ipsam
                        iure!"
                    />
                    <Card1
                        variant="default"
                        text="Front."
                        title="React / Front"
                        text_2="Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Minus eveniet quis eaque, laborum voluptas repellendus
                        labore esse fugiat molestiae non explicabo, expedita
                        deleniti commodi adipisci aliquam ex temporibus ipsam
                        iure!"
                    />
                    <Card1
                        variant="default"
                        text="Front."
                        title="React / Front"
                        text_2="Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Minus eveniet quis eaque, laborum voluptas repellendus
                        labore esse fugiat molestiae non explicabo, expedita
                        deleniti commodi adipisci aliquam ex temporibus ipsam
                        iure!"
                    />
                    <Card1
                        variant="default"
                        text="Front."
                        title="React / Front"
                        text_2="Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Minus eveniet quis eaque, laborum voluptas repellendus
                        labore esse fugiat molestiae non explicabo, expedita
                        deleniti commodi adipisci aliquam ex temporibus ipsam
                        iure!"
                    />
                </div>
            </div>
        </section>
    );

}

export default Competencia;

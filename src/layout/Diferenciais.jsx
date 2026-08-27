import { useState } from "react";
import Card2 from "../components/card2";

function Diferenciais() {
      const [selectedCard, setSelectedCard] = useState(null);

    return (
        <section className="bg-obsidian w-full h-full p-5 md:p-10 relative overflow-hidden flex flex-col items-center gap-10">
            <div className="flex flex-col items-center gap-10 w-full">
                <div className="flex flex-row items-center gap-2 w-full">
                    <h2 className="text-sm md:text-7xl  text-steel uppercase">
                        // DIFERENCIAIS
                    </h2>
                    <span className="flex-1 h-0.5 md:h-1 bg-gradientaa"></span>
                </div>
                <div className="w-full h-full relative overflow-hidden flex flex-col items-center gap-3">
                    <Card2
                        variant="default"
                        number="01"
                        title="React / Front"
                        text="Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Minus eveniet quis eaque, laborum voluptas repellendus
                        labore esse fugiat molestiae non explicabo, expedita
                        deleniti commodi adipisci aliquam ex temporibus ipsam
                        iure!"
                        selected={selectedCard === 1}
                        onSelect={() => setSelectedCard(1)}
                    />
                    <Card2
                        variant="default"
                        number="02"
                        title="Foco em Design de Software"
                        text="Não escrevo código antes de pensar no sistema. Tomo decisões com raciocínio de trade-off. Clean Architecture é a base, mas o foco é sempre no impacto de produto e negócio, não na arquitetura por si só."
                        selected={selectedCard === 2}
                        onSelect={() => setSelectedCard(2)}
                    />
                    <Card2
                        variant="default"
                        number="03"
                        title="React / Front"
                        text="Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Minus eveniet quis eaque, laborum voluptas repellendus
                        labore esse fugiat molestiae non explicabo, expedita
                        deleniti commodi adipisci aliquam ex temporibus ipsam
                        iure!"
                        selected={selectedCard === 3}
                        onSelect={() => setSelectedCard(3)}
                    />
                    <Card2
                        variant="default"
                        number="04"
                        title="React / Front"
                        text="Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Minus eveniet quis eaque, laborum voluptas repellendus
                        labore esse fugiat molestiae non explicabo, expedita
                        deleniti commodi adipisci aliquam ex temporibus ipsam
                        iure!"
                        selected={selectedCard === 4}
                        onSelect={() => setSelectedCard(4)}
                    />
                </div>
            </div>
        </section>
    );
}

export default Diferenciais;

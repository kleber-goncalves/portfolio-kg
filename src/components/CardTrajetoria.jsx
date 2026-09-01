export default function CardTrajetoria() {
    return (
        <div className="flex flex-col w-full rounded-3xl border-t-2 border-warm-bronze">
            <div
                className="flex flex-col w-full items-start rounded-3xl p-5 md:p-10
                            gap-12
                            border
                            border-graphite
                            bg-carbon
                        "
            >
                {/* ==============================================
                            CABEÇALHO
                        ============================================== */}

                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-champagne"></span>

                        <p className="text-xs md:text-3xl text-steel uppercase">Minha Trajetoria</p>
                    </div>

                    <h2
                        className="
                                    text-5xl
                                    md:text-7xl
                                    font-bold
                                    bebas-neue-regular
                                    text-ivory
                                "
                    >
                        Evolução
                    </h2>
                </div>

                {/* ==============================================
                            TIMELINE
                        ============================================== */}

                <div
                    ref={timelineRef}
                    className="
                                relative
                            "
                >
                    {/* ==========================================
                                LINHA BASE
                            ========================================== */}

                    <div
                        className="
                                    absolute
                                    left-0
                                    top-4
                                    bottom-0
                                    w-px
                                    h-104
                                    md:h-full
                                    bg-graphite
                                "
                    ></div>

                    {/* ==========================================
                                LINHA ANIMADA
                            ========================================== */}

                    <div
                        ref={lineRef}
                        className="
                                    absolute
                                    left-0
                                    top-4
                                    w-px
                                    h-104
                                    md:h-full
                                    bg-warm-bronze
                                "
                    ></div>

                    {/* ==========================================
                                EVENTO 2023
                            ========================================== */}

                    <div
                        ref={(el) => {
                            eventsRef.current[0] = el;
                        }}
                        className="
                                    relative
                                    pl-8
                                    pb-10
                                "
                    >
                        <div
                            ref={(el) => {
                                dotsRef.current[0] = el;
                            }}
                            className="
                                        absolute
                                        -left-[5px]
                                        top-0
                                        w-3
                                        h-3
                                        rounded-full
                                        bg-bronze
                                    "
                        ></div>

                        <p
                            className="
                                        text-champagne
                                        font-bold
                                        text-sm
                                        md:text-xl
                                    "
                        >
                            2023
                        </p>

                        <h3
                            className="
                                        text-ivory
                                        text-lg
                                        md:text-3xl
                                        font-bold
                                    "
                        >
                            Primeiro contato com programação
                        </h3>

                        <p
                            className="
                                        text-steel
                                        text-sm
                                        md:text-xl
                                    "
                        >
                            Início da minha jornada no desenvolvimento.
                        </p>
                    </div>

                    {/* ==========================================
                                EVENTO 2024
                            ========================================== */}

                    <div
                        ref={(el) => {
                            eventsRef.current[1] = el;
                        }}
                        className="
                                    relative
                                    pl-8
                                    pb-10
                                "
                    >
                        <div
                            ref={(el) => {
                                dotsRef.current[1] = el;
                            }}
                            className="
                                        absolute
                                        -left-[5px]
                                        top-1
                                        w-3
                                        h-3
                                        rounded-full
                                        bg-bronze
                                    "
                        ></div>

                        <p
                            className="
                                        text-champagne
                                        font-bold
                                        text-sm
                                        md:text-xl
                                    "
                        >
                            2024
                        </p>

                        <h3
                            className="
                                        text-ivory
                                        text-lg
                                        md:text-3xl
                                        font-bold
                                    "
                        >
                            Formação Front-end
                        </h3>

                        <p
                            className="
                                        text-steel
                                        text-sm
                                        md:text-xl
                                    "
                        >
                            HTML, CSS, JavaScript e construção de interfaces.
                        </p>
                    </div>

                    {/* ==========================================
                                EVENTO 2025
                            ========================================== */}

                    <div
                        ref={(el) => {
                            eventsRef.current[2] = el;
                        }}
                        className="
                                    relative
                                    pl-8
                                    pb-10
                                "
                    >
                        <div
                            ref={(el) => {
                                dotsRef.current[2] = el;
                            }}
                            className="
                                        absolute
                                        -left-[5px]
                                        top-1
                                        w-3
                                        h-3
                                        rounded-full
                                        bg-bronze
                                    "
                        ></div>

                        <p
                            className="
                                        text-champagne
                                        font-bold
                                        text-sm
                                        md:text-xl
                                    "
                        >
                            2025
                        </p>

                        <h3
                            className="
                                        text-ivory
                                        text-lg
                                        md:text-3xl
                                        font-bold
                                    "
                        >
                            Formação Back-end
                        </h3>

                        <p
                            className="
                                        text-steel
                                        text-sm
                                        md:text-xl
                                    "
                        >
                            APIs, bancos de dados, Node.js e desenvolvimento de aplicações.
                        </p>
                    </div>

                    {/* ==========================================
                                EVENTO 2026
                            ========================================== */}

                    <div
                        ref={(el) => {
                            eventsRef.current[3] = el;
                        }}
                        className="
                                    relative
                                    pl-8
                                    pb-2
                                "
                    >
                        <div
                            ref={(el) => {
                                dotsRef.current[3] = el;
                            }}
                            className="
                                        absolute
                                        -left-[6px]
                                        top-1
                                        w-4
                                        h-4
                                        rounded-full
                                        bg-bronze
                                        shadow-[0_0_15px_rgba(168,120,82,0.45)]
                                    "
                        ></div>
                        <div
                            ref={(el) => {
                                dotsRef.current[3] = el;
                            }}
                            className="
                                        absolute
                                        -left-[6px]
                                        top-1
                                        w-4
                                        h-4
                                        rounded-full
                                        animate-ping
                                        bg-bronze
                                        shadow-[0_0_15px_rgba(168,120,82,0.45)]
                                    "
                        ></div>

                        <p
                            className="
                                        text-champagne
                                        font-bold
                                        text-sm
                                        md:text-xl
                                    "
                        >
                            2026
                        </p>

                        <h3
                            className="
                                        text-ivory
                                        text-lg
                                        md:text-3xl
                                        font-bold
                                    "
                        >
                            Full Stack + ADS
                        </h3>

                        <p
                            className="
                                        text-steel
                                        text-sm
                                        md:text-xl
                                    "
                        >
                            Formação Full Stack pela DNC e graduação em Análise e Desenvolvimento de Sistemas pela Uniube.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { React, useRef, useEffect } from 'react'

function SectionNeuralBackground() {
    const ref = useRef(null);

    useEffect(() => {
        const move = (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 30;
            const y = (e.clientY / window.innerHeight - 0.5) * 30;

            if (ref.current) {
                ref.current.style.transform = `translate(${x}px, ${y}px)`;
            }
        };

        window.addEventListener("mousemove", move);
        return () => window.removeEventListener("mousemove", move);
    }, []);

    const lines = Array.from({ length: 60 });

    return (
        <svg
            width="100%"
            height="100%"
            style={{
                position: "absolute",
                inset: 0,
                opacity: 0.35,
                pointerEvents: "none",
            }}
        >
            <g
                ref={ref}
                style={{
                    animation: "neuralFloat 30s ease-in-out infinite",
                }}
            >
                {lines.map((_, i) => {
                    const x1 = Math.random() * 100;
                    const y1 = Math.random() * 100;
                    const x2 = Math.random() * 100;
                    const y2 = Math.random() * 100;

                    return (
                        <line
                            key={i}
                            x1={`${x1}%`}
                            y1={`${y1}%`}
                            x2={`${x2}%`}
                            y2={`${y2}%`}
                            stroke="rgba(59,130,246,0.25)"
                            strokeWidth="1"
                        />
                    );
                })}
            </g>
        </svg>
    );
}

export default SectionNeuralBackground
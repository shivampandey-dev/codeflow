import { useEffect, useRef, useMemo, useState } from "react";

export default function SectionNeuralBackground() {
    const ref = useRef(null);

    const [isMobile, setIsMobile] = useState(
        () => typeof window !== "undefined" && window.innerWidth < 768
    );

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", check, { passive: true });
        return () => window.removeEventListener("resize", check);
    }, []);

    /* Stable line positions — generated ONCE per isMobile change */
    const lines = useMemo(
        () =>
            Array.from({ length: isMobile ? 0 : 60 }, () => ({
                x1: Math.random() * 100,
                y1: Math.random() * 100,
                x2: Math.random() * 100,
                y2: Math.random() * 100,
                dur: `${6 + Math.random() * 6}s`,
            })),
        [isMobile]
    );

    /* Parallax on mousemove — desktop only, passive so it never blocks scroll */
    useEffect(() => {
        if (isMobile) return;
        let rafId;
        const move = (e) => {
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                if (!ref.current) return;
                const x = (e.clientX / window.innerWidth - 0.5) * 30;
                const y = (e.clientY / window.innerHeight - 0.5) * 30;
                ref.current.style.transform = `translate(${x}px, ${y}px)`;
            });
        };
        window.addEventListener("mousemove", move, { passive: true });
        return () => {
            window.removeEventListener("mousemove", move);
            cancelAnimationFrame(rafId);
        };
    }, [isMobile]);

    /* Skip rendering entirely on mobile — saves GPU & main thread */
    if (isMobile) return null;

    return (
        <svg
            width="100%"
            height="100%"
            style={{
                position: "absolute",
                inset: 0,
                opacity: 0.28,
                pointerEvents: "none",
            }}
        >
            <g
                ref={ref}
                style={{ animation: "neuralFloat 30s ease-in-out infinite" }}
            >
                {lines.map((l, i) => (
                    <line
                        key={i}
                        x1={`${l.x1}%`}
                        y1={`${l.y1}%`}
                        x2={`${l.x2}%`}
                        y2={`${l.y2}%`}
                        stroke="rgba(59,130,246,0.22)"
                        strokeWidth="1"
                    >
                        <animate
                            attributeName="opacity"
                            values="0.15;0.65;0.15"
                            dur={l.dur}
                            repeatCount="indefinite"
                        />
                    </line>
                ))}
            </g>
        </svg>
    );
}
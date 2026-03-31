import { useEffect, useRef, useMemo } from "react";

/**
 * SectionNeuralBackground
 * Bug fix: lines were generated inside render with Math.random(),
 * causing them to re-randomize on every re-render and thrash the DOM.
 * Now memoised so positions are stable for the life of the component.
 */
export default function SectionNeuralBackground() {
    const ref = useRef(null);

    /* ── Stable line positions — generated ONCE ── */
    const lines = useMemo(
        () =>
            Array.from({ length: 60 }, () => ({
                x1: Math.random() * 100,
                y1: Math.random() * 100,
                x2: Math.random() * 100,
                y2: Math.random() * 100,
                dur: `${6 + Math.random() * 6}s`,
            })),
        [] // empty deps = computed once, never again
    );

    /* ── Parallax on mousemove (passive — never blocks scroll) ── */
    useEffect(() => {
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
    }, []);

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
                        {/* Subtle opacity pulse — gives the mesh a living feel */}
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
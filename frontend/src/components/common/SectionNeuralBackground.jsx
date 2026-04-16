import { useMemo, useEffect, useRef, useState } from "react";

/* ─── Seeded pseudo-random ───────────────────────────────────────
   Same seed → same particles on every render (no hydration diff) */
function seededRandom(seed) {
    let s = seed;
    return () => {
        s = (s * 1664525 + 1013904223) & 0xffffffff;
        return (s >>> 0) / 0xffffffff;
    };
}

/* ─── Premium 5-color palette ────────────────────────────────────
   Cold, refined: ice-white, sky, cyan, soft-indigo, rare pink   */
const PALETTE = [
    { color: "#e6a009", weight: 32 },
    { color: "#7dd3fc", weight: 26 },
    { color: "#22d3ee", weight: 22 },
    { color: "#0f2fd1", weight: 14 },
    { color: "#e879f9", weight: 4 },
    { color: "#ffffff", weight: 2 },
];
function weightedPick(rand) {
    const total = PALETTE.reduce((a, c) => a + c.weight, 0);
    let r = rand() * total;
    for (const { color, weight } of PALETTE) {
        r -= weight;
        if (r <= 0) return color;
    }
    return PALETTE[0].color;
}

/* ─── Particle factory ───────────────────────────────────────────
   4 types:
     dot     — glowing orb (52 %)
     sparkle — 4-point star (24 %)
     ring    — pulsing halo (14 %)
     streak  — short diagonal line (10 %)                        */
function buildParticles(count, rand) {
    return Array.from({ length: count }, () => {
        const roll = rand();
        const type =
            roll < 0.52 ? "dot"
                : roll < 0.76 ? "sparkle"
                    : roll < 0.90 ? "ring"
                        : "streak";

        const color = weightedPick(rand);
        const dur = `${12 + rand() * 22}s`;
        const delay = `${rand() * 8}s`;

        if (type === "dot") return {
            type, color, dur, delay,
            x: rand() * 100,
            y: rand() * 100,
            size: rand() * 4 + 1.5,
            opacity: rand() * 0.35 + 0.14,
            dx: (rand() - 0.5) * 18,
            dy: (rand() - 0.5) * 18,
        };
        if (type === "sparkle") return {
            type, color, dur, delay,
            x: rand() * 100,
            y: rand() * 100,
            arm: rand() * 5 + 3.5,
            opacity: rand() * 0.45 + 0.18,
            dx: (rand() - 0.5) * 14,
            dy: (rand() - 0.5) * 14,
            rotate: rand() * 45,
        };
        if (type === "ring") return {
            type, color, delay,
            x: rand() * 100,
            y: rand() * 100,
            r: rand() * 12 + 5,
            opacity: rand() * 0.16 + 0.05,
            dur: `${18 + rand() * 20}s`,
        };
        // streak
        return {
            type, color, dur, delay,
            x: rand() * 100,
            y: rand() * 100,
            len: rand() * 28 + 10,
            angle: rand() * 60 - 30,
            opacity: rand() * 0.22 + 0.07,
        };
    });
}

/* ─── 4-arm sparkle SVG shape ────────────────────────────────── */
function Sparkle({ p, vw, vh }) {
    const px = (p.x / 100) * vw;
    const py = (p.y / 100) * vh;
    const t = p.arm;
    const n = t * 0.16;
    const d = [
        `M ${px}     ${py - t}`,
        `L ${px + n} ${py - n}`,
        `L ${px + t} ${py}`,
        `L ${px + n} ${py + n}`,
        `L ${px}     ${py + t}`,
        `L ${px - n} ${py + n}`,
        `L ${px - t} ${py}`,
        `L ${px - n} ${py - n}`,
        "Z",
    ].join(" ");
    return (
        <g opacity={p.opacity} filter="url(#glow-soft)">
            <path
                d={d}
                fill={p.color}
                transform={`rotate(${p.rotate}, ${px}, ${py})`}
            >
                <animateTransform
                    attributeName="transform"
                    type="translate"
                    values={`0 0;${p.dx * 0.5} ${p.dy * 0.5};${p.dx} ${p.dy};${p.dx * 0.5} ${p.dy * 0.5};0 0`}
                    dur={p.dur}
                    begin={p.delay}
                    repeatCount="indefinite"
                    additive="sum"
                />
                <animateTransform
                    attributeName="transform"
                    type="rotate"
                    values={`${p.rotate} ${px} ${py};${p.rotate + 45} ${px} ${py};${p.rotate} ${px} ${py}`}
                    dur={p.dur}
                    begin={p.delay}
                    repeatCount="indefinite"
                    additive="sum"
                />
                <animate
                    attributeName="opacity"
                    values={`${p.opacity * 0.4};${p.opacity};${p.opacity * 0.7};${p.opacity};${p.opacity * 0.4}`}
                    dur={p.dur}
                    begin={p.delay}
                    repeatCount="indefinite"
                />
            </path>
            {/* bright centre */}
            <circle cx={px} cy={py} r={t * 0.12} fill="#fff" opacity={0.55}>
                <animate attributeName="opacity" values="0.25;0.75;0.25" dur={p.dur} begin={p.delay} repeatCount="indefinite" />
            </circle>
        </g>
    );
}

export default function FloatingParticles() {
    const svgRef = useRef(null);
    const groupRef = useRef(null);
    const [vw, setVw] = useState(() => (typeof window !== "undefined" ? window.innerWidth : 1440));
    const [vh, setVh] = useState(() => (typeof window !== "undefined" ? window.innerHeight : 900));
    const [isMobile, setIsMobile] = useState(() => (typeof window !== "undefined" ? window.innerWidth < 768 : false));

    useEffect(() => {
        const update = () => {
            setVw(window.innerWidth);
            setVh(window.innerHeight);
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);

    const particles = useMemo(() => {
        const rand = seededRandom(42);
        const count = isMobile ? 55 : 130;
        return buildParticles(count, rand);
    }, [isMobile]);

    /* cursor parallax */
    useEffect(() => {
        if (isMobile) return;
        let raf;
        const move = (e) => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                if (!groupRef.current) return;
                const x = (e.clientX / window.innerWidth - 0.5) * 14;
                const y = (e.clientY / window.innerHeight - 0.5) * 14;
                groupRef.current.style.transform = `translate(${x}px, ${y}px)`;
            });
        };
        window.addEventListener("mousemove", move);
        return () => { window.removeEventListener("mousemove", move); cancelAnimationFrame(raf); };
    }, [isMobile]);

    return (
        <svg
            ref={svgRef}
            width="100%"
            height="100%"
            style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: isMobile ? 0.75 : 0.85 }}
        >
            <defs>
                <filter id="glow-hard" x="-100%" y="-100%" width="300%" height="300%">
                    <feGaussianBlur stdDeviation="3.5" result="b1" />
                    <feGaussianBlur stdDeviation="1.2" result="b2" in="SourceGraphic" />
                    <feMerge><feMergeNode in="b1" /><feMergeNode in="b2" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="glow-soft" x="-150%" y="-150%" width="400%" height="400%">
                    <feGaussianBlur stdDeviation="5" result="b1" />
                    <feGaussianBlur stdDeviation="2" result="b2" in="SourceGraphic" />
                    <feMerge><feMergeNode in="b1" /><feMergeNode in="b2" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="glow-bloom" x="-200%" y="-200%" width="500%" height="500%">
                    <feGaussianBlur stdDeviation="8" result="b" />
                    <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
            </defs>

            <g ref={groupRef} style={{ transition: "transform 0.12s ease-out" }}>
                {particles.map((p, i) => {

                    /* ── DOT ── */
                    if (p.type === "dot") {
                        const lo = p.opacity * 0.3;
                        const hi = p.opacity;
                        return (
                            <g key={i} filter="url(#glow-hard)">
                                {/* expanding halo on larger dots */}
                                {p.size > 2.2 && (
                                    <circle cx={`${p.x}%`} cy={`${p.y}%`} r={p.size * 3} fill="none"
                                        stroke={p.color} strokeWidth={0.35} opacity={p.opacity * 0.2}>
                                        <animate attributeName="r"
                                            values={`${p.size * 2};${p.size * 5};${p.size * 2}`}
                                            dur={p.dur} begin={p.delay} repeatCount="indefinite" />
                                        <animate attributeName="opacity"
                                            values={`${p.opacity * 0.25};0;${p.opacity * 0.25}`}
                                            dur={p.dur} begin={p.delay} repeatCount="indefinite" />
                                    </circle>
                                )}
                                <circle cx={`${p.x}%`} cy={`${p.y}%`} r={p.size} fill={p.color} opacity={p.opacity}>
                                    <animateTransform attributeName="transform" type="translate"
                                        values={`0 0;${p.dx * 0.5} ${p.dy * 0.5};${p.dx} ${p.dy};${p.dx * 0.5} ${p.dy * 0.5};0 0`}
                                        dur={p.dur} begin={p.delay} repeatCount="indefinite" />
                                    <animate attributeName="opacity"
                                        values={`${lo};${hi};${lo * 1.5};${hi};${lo}`}
                                        dur={p.dur} begin={p.delay} repeatCount="indefinite" />
                                    <animate attributeName="r"
                                        values={`${p.size};${p.size * 1.4};${p.size}`}
                                        dur={p.dur} begin={p.delay} repeatCount="indefinite" />
                                </circle>
                            </g>
                        );
                    }

                    /* ── SPARKLE ── */
                    if (p.type === "sparkle") {
                        return <Sparkle key={i} p={p} vw={vw} vh={vh} />;
                    }

                    /* ── RING ── */
                    if (p.type === "ring") {
                        return (
                            <g key={i} filter="url(#glow-bloom)">
                                <circle cx={`${p.x}%`} cy={`${p.y}%`} r={p.r}
                                    fill="none" stroke={p.color} strokeWidth={0.55} opacity={p.opacity}>
                                    <animate attributeName="r"
                                        values={`${p.r};${p.r * 2.4};${p.r}`}
                                        dur={p.dur} begin={p.delay} repeatCount="indefinite" />
                                    <animate attributeName="opacity"
                                        values={`${p.opacity};0;${p.opacity}`}
                                        dur={p.dur} begin={p.delay} repeatCount="indefinite" />
                                </circle>
                            </g>
                        );
                    }

                    /* ── STREAK ── */
                    if (p.type === "streak") {
                        const rad = (p.angle * Math.PI) / 180;
                        const ex = p.x + (p.len * Math.cos(rad)) / vw * 100;
                        const ey = p.y + (p.len * Math.sin(rad)) / vh * 100;
                        return (
                            <line key={i}
                                x1={`${p.x}%`} y1={`${p.y}%`}
                                x2={`${ex}%`} y2={`${ey}%`}
                                stroke={p.color} strokeWidth={0.7} strokeLinecap="round"
                                opacity={p.opacity} filter="url(#glow-hard)">
                                <animate attributeName="opacity"
                                    values={`0;${p.opacity};${p.opacity * 0.6};0`}
                                    dur={p.dur} begin={p.delay} repeatCount="indefinite" />
                                <animate attributeName="strokeWidth"
                                    values="0.3;0.9;0.3"
                                    dur={p.dur} begin={p.delay} repeatCount="indefinite" />
                            </line>
                        );
                    }

                    return null;
                })}
            </g>
        </svg>
    );
}
import { Box } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import image from "../../Assets/logo.png";
import {
    Rocket,
    Zap,
    Sparkles,
    Code,
    Cpu,
    Boxes,
    Flame,
    Atom,
    Brain,
    Shield,
    Cloud,
    Database,
    Workflow,
    Gauge,
    Orbit,
} from "lucide-react";
import CodePreview from "./CodePreview";


export default function BackgroundLanding() {
    const containerRef = useRef(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    /* ================= PARALLAX ================= */

    useEffect(() => {
        if (isMobile) return;

        const el = containerRef.current;

        const handleMove = (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;

            el?.style.setProperty("--parallax-x", `${x}px`);
            el?.style.setProperty("--parallax-y", `${y}px`);
        };

        window.addEventListener("mousemove", handleMove);
        return () => window.removeEventListener("mousemove", handleMove);
    }, [isMobile]);

    const outerSize = isMobile ? "140vw" : "820px";
    const middleSize = isMobile ? "105vw" : "600px";
    const innerSize = isMobile ? "75vw" : "420px";

    return (
        <Box
            ref={containerRef}
            style={{
                position: "absolute",
                inset: 0,
                overflow: "hidden",
                background: "#010205",
                zIndex: -1,
            }}
        >
            {/* ================= NEURAL BACKGROUND ================= */}


            <NeuralBackground />

            {/* ================= FLOATING PARTICLES ================= */}

            {[...Array(isMobile ? 10 : 20)].map((_, i) => {
                const size = Math.random() * 4 + 2;

                return (
                    <Box
                        key={i}
                        style={{
                            position: "absolute",
                            width: size,
                            height: size,
                            borderRadius: "50%",
                            background: "rgba(255,255,255,0.9)",
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            opacity: Math.random() * 0.4 + 0.3,
                            animation: `float ${6 + Math.random() * 6}s ease-in-out infinite`,
                            filter: "blur(0.6px)",
                            boxShadow: `
                    0 0 6px rgba(255,255,255,0.8),
                    0 0 12px rgba(59,130,246,0.4)
                `,
                            pointerEvents: "none",
                        }}
                    />
                );
            })}

            {/* ================= RINGS ================= */}
            <Box
                style={{
                    position: "absolute",
                    left: "50%",
                    top: isMobile ? "42%" : "50%",   // ✅ responsive vertical shift
                    transform: "translate(-50%, -50%)",
                    width: 0,
                    height: 0,
                }}
            >
                <Ring
                    size={outerSize}
                    speed="90s"
                    headings={[
                        { text: "JAVASCRIPT", angle: 20 },
                        { text: "ECOSYSTEM", angle: 200 },
                    ]}
                    glow="rgba(59,130,246,0.15)"
                    color="#60a5fa"
                />

                <Ring
                    size={middleSize}
                    speed="60s"
                    reverse
                    headings={[
                        { text: "ZERO SETUP", angle: 120 },
                        { text: "INSTANT", angle: 300 },
                    ]}
                    glow="rgba(52,211,153,0.15)"
                    color="#34d399"
                />

                <Ring
                    size={innerSize}
                    speed="40s"
                    headings={[]}   // ✅ removed SANDBOX text
                    glow="rgba(167,139,250,0.15)"
                    color="#a78bfa"
                    isInner
                />

                {/* ✅ LOGO ON TOP OF INNER RING */}
                <Box
                    style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                        pointerEvents: "none",
                        zIndex: 10,
                    }}
                >
                    <Box
                        style={{
                            transform: isMobile
                                ? `translateY(calc(-75vw / 2))`   // inner ring radius
                                : `translateY(-210px)`
                        }}
                    >
                        <img
                            src={image}
                            alt="Codeflow"
                            style={{
                                height: isMobile ? 94 : 156,
                                width: "auto",

                                filter: "drop-shadow(0 0 18px rgba(99,102,241,0.45))",

                                animation: "logoPulse 4s ease-in-out infinite",

                                userSelect: "none",
                            }}
                        />
                    </Box>
                </Box>

            </Box>
            <CodePreview />
            <CenterCore />
        </Box>
    );
}

/* ================= NEURAL NETWORK ================= */

function NeuralBackground() {
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

    const lines = Array.from({ length: 70 });

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
                        >
                            <animate
                                attributeName="opacity"
                                values="0.1;0.7;0.1"
                                dur={`${6 + Math.random() * 6}s`}
                                repeatCount="indefinite"
                            />
                        </line>
                    );
                })}
            </g>
        </svg>
    );
}

/* ================= RING ================= */

function Ring({ size, speed, reverse, glow, headings, color }) {
    return (
        <Box
            style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
            }}
        >
            <Box
                style={{
                    width: size,
                    height: size,
                    borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: `0 0 30px ${glow}`,
                    position: "relative",
                    animation: `rotateOrbit ${speed} linear infinite ${reverse ? "reverse" : ""
                        }`,
                }}
            >
                {headings.map((h, i) => (
                    <Box
                        key={i}
                        style={{
                            position: "absolute",
                            inset: 0,
                            transform: `rotate(${h.angle}deg)`,
                        }}
                    >
                        {/* EXACT SAME METHOD AS YOUR WORKING VERSION */}
                        <Box
                            style={{
                                position: "absolute",
                                top: -12,
                                left: "50%",
                                transform: "translateX(-50%)",

                                color,
                                fontSize: 12,
                                letterSpacing: 1,
                                whiteSpace: "nowrap",
                                textShadow: `0 0 8px ${color}`,
                                opacity: 0.9,
                            }}
                        >
                            {h.text}
                        </Box>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
/* ================= CENTER CORE ================= */

/* ================= CENTER CORE ================= */

function CenterCore() {

    const iconSet = [
        Rocket,
        Zap,
        Sparkles,
        Code,
        Cpu,
        Boxes,
        Flame,
        Atom,
        Brain,
        Shield,
        Cloud,
        Database,
        Workflow,
        Gauge,
        Orbit,
    ];

    const total = 14;

    return (
        <Box
            style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",
            }}
        >
            {Array.from({ length: total }).map((_, i) => {

                const Icon = iconSet[i % iconSet.length];

                // random position around center
                const x = (Math.random() - 0.5) * 120;
                const y = (Math.random() - 0.5) * 120;

                // random color using index
                const hue = (i * 360) / total;
                const color = `hsl(${hue}, 85%, 65%)`;

                return (
                    <Bubble
                        key={i}
                        x={x}
                        y={y}
                        delay={i * 0.3}
                        color={color}
                    >
                        <Icon size={16} />
                    </Bubble>
                );
            })}
        </Box>
    );
}


/* ================= BUBBLE ================= */

function Bubble({ children, x, y, delay = 0, color }) {

    const ref = useRef(null);
    const [drag, setDrag] = useState(false);
    const [pos, setPos] = useState({ x: 0, y: 0 });

    const start = useRef({ x: 0, y: 0 });

    const onPointerDown = (e) => {
        setDrag(true);
        start.current = {
            x: e.clientX - pos.x,
            y: e.clientY - pos.y,
        };
        ref.current.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e) => {
        if (!drag) return;

        const nx = e.clientX - start.current.x;
        const ny = e.clientY - start.current.y;

        setPos({ x: nx, y: ny });
    };

    const onPointerUp = (e) => {
        setDrag(false);
        ref.current.releasePointerCapture(e.pointerId);

        // return to original smoothly
        setPos({ x: 0, y: 0 });
    };

    return (
        <Box
            ref={ref}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                "--bx": `${x}px`,
                "--by": `${y}px`,

                animation: drag ? "none" :
                    `bubbleMove 7s cubic-bezier(.4,0,.2,1) ${delay}s infinite`,

                transform: drag
                    ? `translate(calc(-50% + ${x + pos.x}px), calc(-50% + ${y + pos.y}px))`
                    : undefined,

                pointerEvents: "auto",
                cursor: drag ? "grabbing" : "grab",
            }}
        >
            <Box
                style={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    backdropFilter: "blur(10px)",

                    color: color,
                    boxShadow: `0 0 6px ${color}40`,
                    transition: "transform 0.3s ease",
                }}
            >
                {children}
            </Box>
        </Box>
    );
}
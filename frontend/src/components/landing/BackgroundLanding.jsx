import { Box } from "@mantine/core";
import { useEffect, useRef, useState, useMemo } from "react";
import image from "../../Assets/logo.png";
import HeroText from "../common/HeroText";
import CodePreview from "./CodePreview";

/* ── Mobile hook ── */
function useIsMobile() {
    const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
    useEffect(() => {
        let rafId;
        const check = () => {
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => setIsMobile(window.innerWidth < 768));
        };
        window.addEventListener("resize", check, { passive: true });
        return () => {
            window.removeEventListener("resize", check);
            cancelAnimationFrame(rafId);
        };
    }, []);
    return isMobile;
}

/* ═══════════════════════════════════════
   MAIN
═══════════════════════════════════════ */
export default function BackgroundLanding() {
    const isMobile = useIsMobile();

    const outerSize = isMobile ? "min(100vw, 380px)" : "640px"; // ↓ from 820
    const middleSize = isMobile ? "min(75vw, 300px)" : "500px"; // ↓ from 600
    const innerSize = isMobile ? "min(50vw, 200px)" : "350px"; // ↓ from 420
    const particles = useMemo(() => {
        const count = isMobile ? 5 : 20;
        return Array.from({ length: count }, () => ({
            size: Math.random() * 4 + 2,
            top: Math.random() * 100,
            left: Math.random() * 100,
            opacity: Math.random() * 0.4 + 0.3,
            duration: 6 + Math.random() * 6,
        }));
    }, [isMobile]);

    return (
        <Box
            style={{
                position: "absolute", inset: 0, overflow: "hidden",
                background: "#010205", zIndex: -1,
                transform: "translateZ(0)", willChange: "transform",
                touchAction: "none", pointerEvents: "none",
            }}
        >
            <NeuralBackground isMobile={isMobile} />

            {/* Star particles */}
            {particles.map((p, i) => (
                <Box
                    key={i}
                    style={{
                        position: "absolute",
                        width: p.size, height: p.size,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.9)",
                        top: `${p.top}%`, left: `${p.left}%`,
                        opacity: p.opacity,
                        animation: `float ${p.duration}s ease-in-out infinite`,
                        boxShadow: "0 0 6px rgba(255,255,255,0.8)",
                        pointerEvents: "none", willChange: "transform",
                    }}
                />
            ))}

            {/* Hero text */}
            <Box style={{ pointerEvents: "auto" }}>
                <HeroText />
            </Box>

            {/* ── RINGS WRAPPER ── */}
            <Box
                style={{
                    position: "absolute",
                    left: "50%",
                    top: isMobile ? "40%" : "50%",
                    transform: "translate(-50%, -50%)",
                    width: 0, height: 0,
                    pointerEvents: "none",
                }}
            >
                {/* Outer ring */}
                <Ring
                    size={outerSize} speed="90s" orbitCount={5}
                    badges={[
                        { text: "⚡ Fast", angle: 60, color: "#34d399" },
                        { text: "🔒 Secure", angle: 200, color: "#c084fc" },
                    ]}
                    glow="rgba(59,130,246,0.15)" color="#60a5fa"
                    isMobile={isMobile}
                />

                {/* Middle ring */}
                <Ring
                    size={middleSize} speed="60s" reverse orbitCount={4}
                    badges={[
                        { text: "✦ Zero Setup", angle: 70, color: "#38bdf8" },
                        { text: "✦ Instant", angle: 220, color: "#a78bfa" },
                    ]}
                    glow="rgba(52,211,153,0.15)" color="#34d399"
                    isMobile={isMobile}
                />

                {/* Inner ring — no badges */}
                <Ring
                    size={innerSize} speed="40s" orbitCount={3} badges={[]}
                    glow="rgba(167,139,250,0.15)" color="#a78bfa"
                    isMobile={isMobile}
                />

                {/* Center glow blob */}
                <Box
                    style={{
                        position: "absolute", left: "50%", top: "50%",
                        transform: "translate(-50%, -50%)",
                        width: isMobile ? "min(56vw, 210px)" : "320px",
                        height: isMobile ? "min(56vw, 210px)" : "320px",
                        borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(99,102,241,0.35) 0%, rgba(99,102,241,0.08) 45%, transparent 70%)",
                        filter: "blur(40px)", pointerEvents: "none",
                    }}
                />

                {/* Logo */}
                <Box
                    style={{
                        position: "absolute",
                        left: "50%", top: "50%",
                        transform: "translate(-50%, -40%)",
                        pointerEvents: "none",
                        zIndex: 10,
                    }}
                >
                    <img
                        src={image}
                        alt="Codeflow"
                        style={{
                            height: isMobile ? "clamp(90px, 18vw, 174px)" : "256px",
                            width: "auto",
                            filter: "drop-shadow(0 0 18px rgba(99,102,241,0.45))",
                            animation: "logoPulse 4s ease-in-out infinite",
                            userSelect: "none",
                            willChange: "transform",
                        }}
                    />
                </Box>
            </Box>

            {/* Code preview card — desktop only */}
            <Box style={{ pointerEvents: "auto" }}>
                <CodePreview />
            </Box>
        </Box>
    );
}

/* ═══════════════════════════════════════
   NEURAL BACKGROUND
═══════════════════════════════════════ */
function NeuralBackground({ isMobile }) {
    const groupRef = useRef(null);

    const lines = useMemo(
        () =>
            Array.from({ length: isMobile ? 35 : 70 }, () => ({
                x1: Math.random() * 100,
                y1: Math.random() * 100,
                x2: Math.random() * 100,
                y2: Math.random() * 100,
                dur: `${6 + Math.random() * 6}s`,
            })),
        [isMobile]
    );

    useEffect(() => {
        if (isMobile) return;
        let rafId;
        const move = (e) => {
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                if (!groupRef.current) return;
                const x = (e.clientX / window.innerWidth - 0.5) * 30;
                const y = (e.clientY / window.innerHeight - 0.5) * 30;
                groupRef.current.style.transform = `translate(${x}px, ${y}px)`;
            });
        };
        window.addEventListener("mousemove", move, { passive: true });
        return () => {
            window.removeEventListener("mousemove", move);
            cancelAnimationFrame(rafId);
        };
    }, [isMobile]);

    return (
        <svg
            width="100%" height="100%"
            style={{ position: "absolute", inset: 0, opacity: 0.35, pointerEvents: "none" }}
        >
            <g ref={groupRef} style={{ animation: "neuralFloat 30s ease-in-out infinite" }}>
                {lines.map((l, i) => (
                    <line
                        key={i}
                        x1={`${l.x1}%`} y1={`${l.y1}%`}
                        x2={`${l.x2}%`} y2={`${l.y2}%`}
                        stroke="rgba(59,130,246,0.25)" strokeWidth="1"
                    >
                        <animate
                            attributeName="opacity"
                            values="0.1;0.7;0.1"
                            dur={l.dur}
                            repeatCount="indefinite"
                        />
                    </line>
                ))}
            </g>
        </svg>
    );
}

/* ═══════════════════════════════════════
   RING
   Badge pills counter-rotate so text is always upright & readable.
═══════════════════════════════════════ */
function Ring({ size, speed, reverse, glow, badges = [], color, orbitCount = 4, isMobile }) {
    const counterAnim = reverse
        ? `rotateOrbit ${speed} linear infinite`
        : `rotateOrbit ${speed} linear infinite reverse`;

    return (
        <Box
            style={{
                position: "absolute", left: "50%", top: "50%",
                transform: "translate(-50%, -50%)",
            }}
        >
            <Box
                style={{
                    width: size, height: size,
                    borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,0.07)",
                    boxShadow: `0 0 30px ${glow}`,
                    position: "relative",
                    animation: `rotateOrbit ${speed} linear infinite ${reverse ? "reverse" : ""}`,
                    willChange: "transform",
                }}
            >
                {/* Orbit nodes */}
                {Array.from({ length: orbitCount }).map((_, i) => (
                    <Box
                        key={i}
                        style={{
                            position: "absolute", inset: 0,
                            transform: `rotate(${(360 / orbitCount) * i}deg)`,
                        }}
                    >
                        <Box
                            style={{
                                position: "absolute", top: -4, left: "50%",
                                transform: "translateX(-50%)",
                                width: 6, height: 6, borderRadius: "50%",
                                background: color,
                                boxShadow: `0 0 8px ${color}, 0 0 16px ${color}80`,
                            }}
                        />
                    </Box>
                ))}

                {/* Badge pills — counter-rotated & scaled for mobile */}
                {badges.map((b, i) => {
                    const c = b.color || color;
                    return (
                        <Box
                            key={i}
                            style={{
                                position: "absolute", inset: 0,
                                transform: `rotate(${b.angle}deg)`,
                            }}
                        >
                            <Box
                                style={{
                                    position: "absolute",
                                    top: isMobile ? -11 : -16,
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    animation: counterAnim,
                                    willChange: "transform",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                <Box
                                    style={{
                                        padding: isMobile ? "1px 6px" : "1px 10px",
                                        borderRadius: 16,    
                                        fontSize: isMobile ? 5 : 9, 
                                        letterSpacing: 0.4,
                                        fontWeight: 700,
                                        color: "#e2e8f0",
                                        background: `linear-gradient(135deg, ${c}40, ${c}18)`,
                                        border: `1px solid ${c}50`,
                                        backdropFilter: "blur(8px)",
                                        boxShadow: `0 0 10px ${c}38, inset 0 0 8px ${c}18`,
                                        textShadow: `0 0 8px ${c}`,
                                        animation: "badgePulse 4s ease-in-out infinite",
                                    }}
                                >
                                    {b.text}
                                </Box>
                            </Box>
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
}
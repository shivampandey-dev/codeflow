import { Box } from "@mantine/core";
import { useEffect, useRef, useState } from "react";

export default function BackgroundLanding() {
    const containerRef = useRef(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    // ===== Mouse Parallax (disable on mobile) =====
    useEffect(() => {
        if (isMobile) return;

        const el = containerRef.current;

        const handleMove = (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;

            el.style.setProperty("--parallax-x", `${x}px`);
            el.style.setProperty("--parallax-y", `${y}px`);
        };

        window.addEventListener("mousemove", handleMove);
        return () => window.removeEventListener("mousemove", handleMove);
    }, [isMobile]);

    // ===== Responsive sizes =====
    const outerSize = isMobile ? "140vw" : "820px";
    const middleSize = isMobile ? "105vw" : "600px";
    const innerSize = isMobile ? "75vw" : "420px";

    const glowSize = isMobile ? "120vw" : "900px";
    const haloSize = isMobile ? "150vw" : "1100px";

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
            {/* ================= GRID ================= */}
            <Box
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `
            radial-gradient(rgba(255,255,255,0.5) 1.2px, transparent 1.2px),
            radial-gradient(rgba(255,255,255,0.4) 2.6px, transparent 2.6px)
          `,
                    backgroundSize: "28px 28px, 112px 112px",
                    opacity: 0.22,
                    WebkitMaskImage:
                        "radial-gradient(circle at center, black 55%, transparent 100%)",
                    maskImage:
                        "radial-gradient(circle at center, black 55%, transparent 100%)",
                }}
            />

            {/* ================= CENTER GLOW ================= */}
            <Box
                style={{
                    position: "absolute",
                    width: glowSize,
                    height: glowSize,
                    borderRadius: "50%",
                    left: "50%",
                    top: "50%",
                    transform:
                        "translate(calc(-50% + var(--parallax-x,0px)), calc(-50% + var(--parallax-y,0px)))",
                    background:
                        "radial-gradient(circle, rgba(37,100,235,0.28), rgba(37,100,235,0.12), transparent 70%)",
                    filter: "blur(80px)",
                    animation: "breathe 10s ease-in-out infinite",
                }}
            />

            {/* ================= HALO ================= */}
            <Box
                style={{
                    position: "absolute",
                    width: haloSize,
                    height: haloSize,
                    borderRadius: "50%",
                    left: "50%",
                    top: "50%",
                    transform:
                        "translate(calc(-50% + var(--parallax-x,0px)), calc(-50% + var(--parallax-y,0px)))",
                    background:
                        "radial-gradient(circle, rgba(59,130,246,0.2), transparent 70%)",
                    filter: "blur(120px)",
                }}
            />

            {/* ================= RINGS ================= */}
            <Ring
                size={outerSize}
                speed="90s"
                glow="rgba(59,130,246,0.15)"
                label="JS-FIRST"
                color="#60a5fa"
                isMobile={isMobile}
            />

            <Ring
                size={middleSize}
                speed="60s"
                reverse
                glow="rgba(52,211,153,0.15)"
                label="ZERO SETUP"
                color="#34d399"
                isMobile={isMobile}
            />

            <Ring
                size={innerSize}
                speed="40s"
                glow="rgba(167,139,250,0.15)"
                label="SANDBOX"
                color="#a78bfa"
                isMobile={isMobile}
            />

            {/* ================= PARTICLES ================= */}
            {[...Array(isMobile ? 8 : 14)].map((_, i) => {
                const size = Math.random() * 6 + 2;

                return (
                    <Box
                        key={i}
                        style={{
                            position: "absolute",
                            width: size,
                            height: size,
                            borderRadius: "50%",
                            background: "rgba(255,255,255,0.8)",
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            opacity: Math.random() * 0.4 + 0.2,
                            animation: `float ${6 + Math.random() * 6}s ease-in-out infinite`,
                            filter: "blur(0.5px)",
                        }}
                    />
                );
            })}
        </Box>
    );
}

/* ================= RING ================= */

function Ring({ size, speed, reverse, glow, label, color, isMobile }) {
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
                <Box
                    style={{
                        position: "absolute",
                        top: -12,
                        left: "50%",
                        transform: "translateX(-50%)",
                        color,
                        fontSize: isMobile ? 10 : 12,
                        letterSpacing: 1,
                        textShadow: `0 0 8px ${color}`,
                        opacity: isMobile ? 0.8 : 1,
                    }}
                >
                    {label}
                </Box>
            </Box>
        </Box>
    );
}
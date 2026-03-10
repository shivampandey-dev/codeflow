import { Box, Text } from "@mantine/core";
import { useEffect, useState, useRef, useLayoutEffect } from "react";
import {
    Globe,
    Code2,
    FlaskConical,
    Box as Cube,
    Download,
} from "lucide-react";

const steps = [
    { label: "Browser", icon: Globe, color: "#3b82f6" },
    { label: "Type", icon: Code2, color: "#22c55e" },
    { label: "Test", icon: FlaskConical, color: "#a855f7" },
    { label: "Output", icon: Cube, color: "#f59e0b" },
    { label: "Download", icon: Download, color: "#ec4899" },
];

const messages = [
    "Booting environment...",
    "Loading dependencies...",
    "Compiling project...",
    "Running tests...",
    "Packaging output...",
    "Ready ✓",
];

export default function ProcessFlow({ isLoader = false }) {
    const [active, setActive] = useState(0);
    const [text, setText] = useState("");
    const [msgIndex, setMsgIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    const pathRef = useRef(null);
    const [points, setPoints] = useState([]);

    /* MOBILE DETECT */
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    /* STEP LOOP */
    useEffect(() => {
        const timer = setInterval(() => {
            setActive((p) => (p + 1) % steps.length);
            setMsgIndex((p) => (p + 1) % messages.length);
        }, 2200);
        return () => clearInterval(timer);
    }, []);

    /* TYPEWRITER */
    useEffect(() => {
        let i = 0;
        const msg = messages[msgIndex];
        setText("");

        const typing = setInterval(() => {
            setText(msg.slice(0, i));
            i++;
            if (i > msg.length) clearInterval(typing);
        }, 35);

        return () => clearInterval(typing);
    }, [msgIndex]);

    const progressPercent = (active / (steps.length - 1)) * 100;

    /* DESKTOP PATH POINTS */
    useLayoutEffect(() => {
        if (!pathRef.current) return;

        const path = pathRef.current;
        const length = path.getTotalLength();

        const pts = steps.map((_, i) => {
            const p = path.getPointAtLength(
                (length * i) / (steps.length - 1)
            );
            return { x: p.x, y: p.y };
        });

        setPoints(pts);
    }, []);

    /* MOBILE VALUES */
    const stepGap = 140;      // logical distance (line math)
    const visualGap = 60;     // how close cards look

    const gapDiff = stepGap - visualGap;

    const startOffset = 40;
    const cardSize = 90;
    const cardHalf = cardSize / 2;

    const progressPx =
        startOffset + active * stepGap + cardHalf;

    const totalHeight =
        stepGap * (steps.length - 1) + cardHalf;

    return (
        <Box
            style={{
                width: "100%",
                padding: isLoader ? 0 : "50px 0",
                display: "flex",
                justifyContent: "center",
                // marginBottom: 120,
            }}
        >
            <Box style={{ width: "100%", maxWidth: 1100, position: "relative" }}>
                {/* TITLE */}{!isLoader && (
                    <Box>
                        <Text
                            style={{
                                textAlign: "center",
                                fontSize: isMobile ? 28 : 40,
                                fontWeight: 800,
                                marginBottom: 40,
                                background:
                                    "linear-gradient(90deg,#38bdf8,#22c55e,#a855f7)",
                                WebkitBackgroundClip: "text",
                                color: "transparent",
                            }}
                        >
                            From Idea to Output in Seconds
                        </Text>

                        <Box
                            style={{
                                height: 1,
                                background:
                                    "linear-gradient(90deg, transparent, #38bdf8, transparent)",
                                opacity: 0.3,
                                margin: "40px 0 60px 0",
                            }}
                        />
                    </Box>
                )}
                {/* ================= MOBILE ================= */}
                {isMobile ? (
                    <Box
                        style={{
                            position: "relative",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: stepGap,
                            paddingTop: startOffset,
                            paddingBottom: 40,
                        }}
                    >
                        {/* BASE LINE */}
                        <Box
                            style={{
                                position: "absolute",
                                top: startOffset + cardHalf,
                                height: totalHeight,
                                width: 2,
                                background: "rgba(255,255,255,0.15)",
                                left: "50%",
                                transform: "translateX(-50%)",
                            }}
                        />

                        {/* PROGRESS LINE */}
                        <Box
                            style={{
                                position: "absolute",
                                top: startOffset + cardHalf,
                                height: progressPx - (startOffset + cardHalf),
                                width: 2,
                                background:
                                    "linear-gradient(#38bdf8,#22c55e,#a855f7)",
                                left: "50%",
                                transform: "translateX(-50%)",
                                transition: "height 0.6s ease",
                                boxShadow: "0 0 12px #38bdf8",
                            }}
                        />

                        {/* MOVING DOT */}
                        <Box
                            style={{
                                position: "absolute",
                                top: progressPx,
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                width: 14,
                                height: 14,
                                borderRadius: "50%",
                                background: "#38bdf8",
                                boxShadow:
                                    "0 0 18px #38bdf8, 0 0 40px #38bdf8",
                                transition: "top 0.6s ease",
                                zIndex: 3,
                            }}
                        />

                        {/* STEPS */}
                        {steps.map((s, i) => {
                            const Icon = s.icon;
                            const isActive = i === active;

                            return (
                                <Box
                                    key={i}
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        position: "relative",
                                        zIndex: 4,
                                        marginTop: i === 0 ? 0 : -gapDiff,
                                    }}
                                >
                                    {isActive && (
                                        <Box
                                            style={{
                                                position: "absolute",
                                                width: 100,
                                                height: 100,
                                                borderRadius: "50%",
                                                background: `${s.color}33`,
                                                animation: "pulse 1.6s infinite",
                                                zIndex: -1,
                                            }}
                                        />
                                    )}

                                    {/* CARD */}
                                    <Box
                                        style={{
                                            width: 90,
                                            height: 90,
                                            borderRadius: 20,
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: 3,
                                            background: isActive
                                                ? `linear-gradient(135deg, ${s.color}, #111)`
                                                : "rgba(255,255,255,0.05)",
                                            border:
                                                "1px solid rgba(255,255,255,0.1)",
                                            boxShadow: isActive
                                                ? `0 0 25px ${s.color}`
                                                : "none",
                                            transition: "all 0.4s",
                                            backdropFilter: "blur(10px)",
                                        }}
                                    >
                                        <Icon size={26} />

                                        <Text
                                            style={{
                                                fontSize: 14,
                                                color: "#cbd5e1",
                                                fontWeight: 600,
                                            }}
                                        >
                                            {s.label}
                                        </Text>
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>
                ) : (
                    /* ================= DESKTOP ================= */
                    <Box style={{ position: "relative" }}>
                        <Box style={{ position: "relative", height: 220, marginBottom: 40 }}>
                            <svg
                                width="100%"
                                height="220"
                                viewBox="0 0 1100 220"
                                style={{ position: "absolute", inset: 0 }}
                            >
                                <path
                                    ref={pathRef}
                                    d="M60 140 C 260 40, 840 40, 1040 140"
                                    fill="none"
                                    stroke="rgba(255,255,255,0.15)"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />

                                <path
                                    d="M60 140 C 260 40, 840 40, 1040 140"
                                    fill="none"
                                    stroke="url(#grad)"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeDasharray="1000"
                                    strokeDashoffset={1000 - progressPercent * 10}
                                    style={{
                                        filter: "drop-shadow(0 0 6px #38bdf8)",
                                        transition: "stroke-dashoffset 0.8s ease",
                                    }}
                                />

                                {[...Array(6)].map((_, i) => (
                                    <circle key={i} r="4" fill="#38bdf8" opacity="0.8">
                                        <animateMotion
                                            dur={`${4 + i}s`}
                                            repeatCount="indefinite"
                                            path="M60 140 C 260 40, 840 40, 1040 140"
                                        />
                                    </circle>
                                ))}

                                <defs>
                                    <linearGradient id="grad">
                                        <stop offset="0%" stopColor="#38bdf8" />
                                        <stop offset="50%" stopColor="#22c55e" />
                                        <stop offset="100%" stopColor="#a855f7" />
                                    </linearGradient>
                                </defs>
                            </svg>

                            <Box
                                className={isLoader ? "loader-rotate" : ""}
                                style={{ position: "relative", zIndex: 3 }}
                            >
                                {points.map((pos, i) => {
                                    const s = steps[i];
                                    const Icon = s.icon;
                                    const isActive = i === active;

                                    return (
                                        <Box
                                            key={i}
                                            style={{
                                                position: "absolute",
                                                left: `${(pos.x / 1100) * 100}%`,
                                                top: pos.y,
                                                transform: "translate(-50%, -50%)",
                                                textAlign: "center",
                                            }}
                                        >
                                            <Box
                                                style={{
                                                    width: 80,
                                                    height: 80,
                                                    borderRadius: 20,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    background: isActive
                                                        ? `linear-gradient(135deg, ${s.color}, #111)`
                                                        : "rgba(255,255,255,0.05)",
                                                    border: "1px solid rgba(255,255,255,0.1)",
                                                    backdropFilter: "blur(10px)",
                                                    transition:
                                                        "all 0.6s cubic-bezier(.16,1,.3,1)",
                                                    boxShadow: isActive
                                                        ? `0 0 30px ${s.color}`
                                                        : "none",
                                                }}
                                            >
                                                <Box
                                                    style={{
                                                        transform: isLoader ? `rotate(${active * -72}deg)` : "none",
                                                    }}
                                                >
                                                    <Icon size={30} />
                                                </Box>
                                            </Box>

                                            <Text
                                                style={{
                                                    marginTop: 10,
                                                    fontSize: 16,
                                                    color: "#cbd5e1",
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {s.label}
                                            </Text>
                                        </Box>
                                    );
                                })}
                            </Box>
                        </Box>


                    </Box>
                )}
                {!isLoader && (
                    <Box
                        style={{
                            padding: 20,
                            borderRadius: 16,
                            background:
                                "linear-gradient(135deg, rgba(15,23,42,0.8), rgba(2,6,23,0.95))",
                            border: "1px solid rgba(255,255,255,0.08)",
                            fontFamily: "monospace",
                            color: "#34d399",
                            boxShadow: "0 0 30px rgba(56,189,248,0.15)",
                        }}
                    >
                        <span style={{ color: "#38bdf8" }}>$</span> {text}
                        <span className="cursor">|</span>
                    </Box>
                )}
            </Box>

            {/* ANIMATIONS */}
            <style>
                {`
        .cursor {
          animation: blink 1s infinite;
        }

        @keyframes blink {
          0% { opacity: 1 }
          50% { opacity: 0 }
          100% { opacity: 1 }
        }

        @keyframes pulse {
          0% { transform: scale(0.8); opacity: 0.6; }
          70% { transform: scale(1.4); opacity: 0; }
          100% { opacity: 0; }
        }
      `}
            </style>
        </Box>
    );
}
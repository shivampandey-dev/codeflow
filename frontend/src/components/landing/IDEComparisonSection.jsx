import { Box, Text } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@mantine/hooks";

export default function IDEComparisonSection() {
    const ref = useRef(null);
    const tableRef = useRef(null);

    const [visible, setVisible] = useState(false);

    const isBelow1020 = useMediaQuery("(max-width: 1020px)");
    const isSmall = useMediaQuery("(max-width: 480px)");

    /* ── REVEAL ── */
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setVisible(true); },
            { threshold: 0.2 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    /* ── PARALLAX ── */
    useEffect(() => {
        let rafId = null;
        const handleScroll = () => {
            if (rafId) return;
            rafId = requestAnimationFrame(() => {
                const rect = tableRef.current?.getBoundingClientRect();
                if (!rect) return;
                const offset = rect.top * (isBelow1020 ? -0.02 : -0.08);
                if (tableRef.current)
                    tableRef.current.style.transform = `translate3d(0,${offset}px,0)`;
                rafId = null;
            });
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, [isBelow1020]);

    /*
     * KEY FIX — instead of an absolutely-positioned divider that guesses pixel
     * positions, we put a borderRight directly on every Codeflow-column cell.
     * This guarantees perfect alignment at every screen size automatically.
     */
    const colDivider = {
        borderRight: "1px solid rgba(56,189,248,0.55)",
        boxShadow: "2px 0 12px rgba(56,189,248,0.35)",
        paddingRight: isSmall ? 8 : 12,
    };

    /* ── ROW ── */
    const Row = ({ label, good, bad }) => (
        <Box
            style={{
                display: "grid",
                gridTemplateColumns: "1.2fr 1fr 1fr",
                alignItems: "center",
                padding: isSmall ? "10px 0" : isBelow1020 ? "14px 0" : "18px 0",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
        >
            {/* Label */}
            <Text style={{ color: "#cbd5e1", fontSize: isSmall ? 12 : isBelow1020 ? 14 : 16 }}>
                {label}
            </Text>

            {/* Codeflow column — carries the glowing right border */}
            <Box
                style={{
                    ...colDivider,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: isSmall ? 4 : 6,
                    color: "#34d399",
                    fontSize: isSmall ? 11 : isBelow1020 ? 13 : 16,
                }}
            >
                <IconCheck size={isSmall ? 11 : isBelow1020 ? 13 : 16} strokeWidth={2.5} />
                <span>{good}</span>
            </Box>

            {/* Legacy IDEs column */}
            <Box
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: isSmall ? 4 : 6,
                    color: "#f87171",
                    fontSize: isSmall ? 11 : isBelow1020 ? 13 : 16,
                    paddingLeft: isSmall ? 10 : 14,
                }}
            >
                <IconX size={isSmall ? 11 : isBelow1020 ? 13 : 16} strokeWidth={2.5} />
                <span>{bad}</span>
            </Box>
        </Box>
    );

    return (
        <Box
            ref={ref}
            mt={50}
            style={{
                width: "100%",
                display: "flex",
                flexDirection: isBelow1020 ? "column" : "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 60,

                opacity: visible ? 1 : 0,
                transform: visible ? "translate3d(0,0,0)" : "translate3d(0,80px,0)",
                transition: "opacity 0.8s ease, transform 0.8s cubic-bezier(.16,1,.3,1)",
                willChange: "transform, opacity",
            }}
        >
            {/* ── LEFT TEXT ── */}
            <Box style={{ width: isBelow1020 ? "100%" : "35%", maxWidth: 520 }}>
                <Text
                    style={{
                        fontSize: isSmall ? 22 : isBelow1020 ? 26 : 38,
                        fontWeight: 800,
                        lineHeight: 1.15,
                        marginBottom: 18,
                        color: "#e2e8f0",
                        letterSpacing: -0.5,
                    }}
                >
                    What about
                    <span
                        style={{
                            background: "linear-gradient(90deg,#38bdf8,#22c55e)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        online IDEs
                    </span>
                    ?
                </Text>

                <Text style={{ color: "#94a3b8", lineHeight: 1.7, marginBottom: 18, fontSize: isSmall ? 13 : isBelow1020 ? 14 : 16 }}>
                    Traditional cloud IDEs run on remote servers and stream results back to
                    your browser. This introduces latency, increases startup time, and limits
                    responsiveness.
                </Text>

                <Text style={{ color: "#e2e8f0", fontWeight: 600, lineHeight: 1.6, fontSize: isSmall ? 13 : isBelow1020 ? 15 : 17 }}>
                    With{" "}
                    <span style={{ color: "#38bdf8", textShadow: "0 0 12px rgba(56,189,248,0.6)", fontWeight: 700 }}>
                        Codeflow
                    </span>
                    , computation happens directly in your browser — delivering instant
                    startup and zero network delay.
                </Text>
            </Box>

            {/* ── TABLE ── */}
            <Box
                ref={tableRef}
                style={{
                    position: "relative",
                    width: isBelow1020 ? "100%" : "65%",
                    maxWidth: 700,
                    padding: isSmall ? "14px 12px" : 20,
                    borderRadius: 20,
                    background: `
                        linear-gradient(135deg,
                            rgba(8,20,40,0.85)  0%,
                            rgba(6,18,38,0.92)  40%,
                            rgba(2,8,20,0.96)   100%
                        ),
                        radial-gradient(circle at 20% 0%,  rgba(56,189,248,0.18), transparent 55%),
                        radial-gradient(circle at 80% 30%, rgba(34,197,94,0.12),  transparent 60%)
                    `,
                    backdropFilter: isBelow1020 ? "blur(8px)" : "blur(14px)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
                    overflow: "hidden",
                    transform: "translateZ(0)",
                    willChange: "transform",
                    backfaceVisibility: "hidden",
                }}
            >
                {/* Ambient glow */}
                <Box
                    style={{
                        position: "absolute",
                        inset: 0,
                        background: "radial-gradient(circle at 60% 40%, rgba(56,189,248,0.15), transparent 60%)",
                        pointerEvents: "none",
                    }}
                />

                {/* CONTENT */}
                <Box style={{ position: "relative", zIndex: 1 }}>

                    {/* HEADER */}
                    <Box
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1.2fr 1fr 1fr",
                            alignItems: "center",
                            marginBottom: 6,
                            paddingBottom: 8,
                            borderBottom: "1px solid rgba(255,255,255,0.06)",
                        }}
                    >
                        <div />

                        {/* Codeflow header — same border as data rows */}
                        <Text
                            style={{
                                ...colDivider,
                                color: "#38bdf8",
                                fontWeight: 700,
                                letterSpacing: 0.2,
                                fontSize: isSmall ? 11 : isBelow1020 ? 13 : 14,
                                whiteSpace: "nowrap",
                            }}
                        >
                            Codeflow
                        </Text>

                        <Text
                            style={{
                                color: "#94a3b8",
                                fontWeight: 600,
                                letterSpacing: 0.2,
                                fontSize: isSmall ? 11 : isBelow1020 ? 13 : 14,
                                whiteSpace: "nowrap",
                                paddingLeft: isSmall ? 10 : 14,
                            }}
                        >
                            Legacy IDEs
                        </Text>
                    </Box>

                    <Row label="Startup" good="Instant" bad="Slow" />
                    <Row label="Latency" good="Zero" bad="High" />
                    <Row label="Offline" good="Yes" bad="No" />
                    <Row label="Debug" good="Easy" bad="Hard" />
                    <Row label="Reset" good="Click" bad="Manual" />
                </Box>
            </Box>
        </Box>
    );
}
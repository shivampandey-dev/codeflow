import { Box, Text } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@mantine/hooks";

export default function IDEComparisonSection() {
    const ref = useRef(null);
    const tableRef = useRef(null);

    const [visible, setVisible] = useState(false);

    /* ⭐ ONLY BREAKPOINT */
    const isBelow1020 = useMediaQuery("(max-width: 1020px)");

    /* reveal */
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setVisible(entry.isIntersecting),
            { threshold: 0.2 }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    /* parallax */
    useEffect(() => {
        const handleScroll = () => {
            const rect = tableRef.current?.getBoundingClientRect();
            if (!rect) return;

            const offset = rect.top * (isBelow1020 ? -0.02 : -0.08);

            if (tableRef.current) {
                tableRef.current.style.transform = `translateY(${offset}px)`;
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isBelow1020]);

    /* ROW */
    const Row = ({ label, good, bad }) => (
        <Box
            style={{
                display: "grid",
                gridTemplateColumns: "1.2fr 1fr 1fr",
                alignItems: "center",
                padding: isBelow1020 ? "14px 0" : "18px 0",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
        >
            {/* LABEL */}
            <Text style={{ color: "#cbd5e1" }}>{label}</Text>

            {/* CODEFLOW */}
            <Box
                style={{
                    display: "flex",
                    flexDirection: "column", // ⭐ icon top text bottom when tight
                    alignItems: "flex-start",
                    gap: 2,
                    color: "#34d399",
                    fontSize: isBelow1020 ? 14 : 16,
                }}
            >
                <IconCheck size={isBelow1020 ? 14 : 16} />
                <span>{good}</span>
            </Box>

            {/* LEGACY */}
            <Box
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: 4,
                    color: "#f87171",
                    fontSize: isBelow1020 ? 14 : 16,
                }}
            >
                <IconX size={isBelow1020 ? 14 : 16} />
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

                /* ⭐ LAYOUT SWITCH */
                flexDirection: isBelow1020 ? "column" : "row",

                alignItems: "center",
                justifyContent: "center",

                gap: 60,
                // padding: isBelow1020 ? "0 16px" : 0,

                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0px)" : "translateY(80px)",
                transition: "all 1s cubic-bezier(.16,1,.3,1)",
            }}
        >
            <Box
                style={{
                    width: isBelow1020 ? "100%" : "35%",
                    maxWidth: 520,
                }}
            >
                {/* HEADLINE */}
                <Text
                    style={{
                        fontSize: isBelow1020 ? 26 : 38,
                        fontWeight: 800,
                        lineHeight: 1.15,
                        marginBottom: 18,
                        color: "#e2e8f0",
                        letterSpacing: -0.5,
                    }}
                >
                    What about{" "}
                    <span
                        style={{
                            background:
                                "linear-gradient(90deg, #38bdf8, #22c55e)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        online IDEs
                    </span>
                    ?
                </Text>

                {/* DESCRIPTION */}
                <Text
                    style={{
                        color: "#94a3b8",
                        lineHeight: 1.7,
                        marginBottom: 18,
                        fontSize: isBelow1020 ? 14 : 16,
                    }}
                >
                    Traditional cloud IDEs run on remote servers and stream results back to
                    your browser. This introduces latency, increases startup time, and
                    limits the responsiveness developers expect from modern tools.
                </Text>

                {/* HIGHLIGHT STATEMENT */}
                <Text
                    style={{
                        color: "#e2e8f0",
                        fontWeight: 600,
                        lineHeight: 1.6,
                        fontSize: isBelow1020 ? 15 : 17,
                    }}
                >
                    With{" "}
                    <span
                        style={{
                            color: "#38bdf8",
                            textShadow: "0 0 12px rgba(56,189,248,0.6)",
                            fontWeight: 700,
                        }}
                    >
                        Codeflow
                    </span>
                    , computation happens directly in your browser —
                    delivering instant startup, offline capability,
                    and zero network delay.
                </Text>
            </Box>

            {/* TABLE */}
            <Box
                ref={tableRef}
                style={{
                    position: "relative",
                    width: isBelow1020 ? "100%" : "65%", // ⭐ 35 / 65 ratio
                    maxWidth: 700,
                    padding: 20,
                    borderRadius: 20,

                    background:
                        "linear-gradient(135deg, rgba(15,23,42,0.85), rgba(2,6,23,0.95))",

                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.6)",

                    overflow: "hidden",

                    transform: "translateY(0px)",
                    transition: "transform 0.2s linear",
                }}
            >
                {/* GLOW */}
                <Box
                    style={{
                        position: "absolute",
                        inset: 0,
                        background:
                            "radial-gradient(circle at 60% 40%, rgba(56,189,248,0.15), transparent 60%)",
                        pointerEvents: "none",
                    }}
                />

                {/* DIVIDER */}

                <Box
                    style={{
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        left: "61%",   // ⭐ correct alignment for 1.2fr 1fr 1fr
                        width: 1,
                        background:
                            "linear-gradient(to bottom, transparent, rgba(56,189,248,0.7), transparent)",
                        boxShadow: "0 0 14px rgba(56,189,248,0.9)",
                        opacity: 0.7,
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

                            marginBottom: 6,        // ⭐ reduced gap
                            paddingBottom: 8,       // ⭐ closer to rows
                            borderBottom: "1px solid rgba(255,255,255,0.06)",

                            color: "#94a3b8",
                            fontWeight: 600,
                            fontSize: isBelow1020 ? 13 : 14,   // ⭐ smaller text
                        }}
                    >
                        <div />

                        <Text
                            style={{
                                color: "#38bdf8",
                                fontWeight: 600,
                                letterSpacing: 0.2,
                                fontSize: isBelow1020 ? 13 : 14,
                                marginTop: isBelow1020 ? "32px" : 1,
                                marginRight: isBelow1020 ? "32px" : 1,
                            }}
                        >
                            Codeflow
                        </Text>

                        <Text
                            style={{
                                color: "#94a3b8",
                                fontWeight: 600,
                                letterSpacing: 0.2,
                                fontSize: isBelow1020 ? 12 : 14,
                                marginTop: isBelow1020 ? 32 : 1,
                                marginRight: isBelow1020 ? 14 : 1,
                                whiteSpace: "nowrap",   // ⭐ prevents line break
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
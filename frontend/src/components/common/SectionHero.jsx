import { Box, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useRef, useState } from "react";

/**
 * SectionHero
 * Props:
 *   title    — main gradient heading  (required)
 *   subtitle — smaller body line below the heading (optional)
 */
export default function SectionHero({ title = "Why Codeflow", subtitle = "" }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    const isBelow1020 = useMediaQuery("(max-width: 1020px)");

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setVisible(entry.isIntersecting),
            { threshold: 0.25 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <Box
            ref={ref}
            style={{
                position: "relative",
                width: "100%",
                padding: isBelow1020
                    ? "80px 20px 32px"
                    : "100px 20px 48px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
                textAlign: "center",
            }}
        >
            {/* Particle layer */}
            <Box className="hero-particles" style={{ pointerEvents: "none" }} />

            {/* ── TITLE ── */}
            <Text
                className={`hero-title ${visible ? "hero-visible" : ""}`}
                style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: isBelow1020 ? 34 : 64,
                    fontWeight: 700,
                    letterSpacing: "-0.03em",
                    lineHeight: 1.08,
                    maxWidth: 860,
                }}
            >
                <span className="hero-gradient">{title}</span>
                <span className="hero-underline" />
            </Text>

            {/* ── SUBTITLE ── */}
            {subtitle && (
                <Text
                    style={{
                        marginTop: isBelow1020 ? 14 : 20,
                        color: "#7a8fa8",           /* softer than #94a3b8 — less competing */
                        fontSize: isBelow1020 ? 14 : 17,
                        lineHeight: 1.65,
                        maxWidth: 620,
                        opacity: visible ? 1 : 0,
                        transform: visible ? "translateY(0)" : "translateY(16px)",
                        transition:
                            "opacity 0.9s ease 0.25s, transform 0.9s cubic-bezier(.16,1,.3,1) 0.25s",
                        fontWeight: 400,
                        letterSpacing: 0.1,
                    }}
                >
                    {subtitle}
                </Text>
            )}
        </Box>
    );
}
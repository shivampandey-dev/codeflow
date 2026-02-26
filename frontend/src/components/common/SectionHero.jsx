import { Box, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useRef, useState } from "react";

export default function SectionHero({ title = "Why Codeflow" }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    const isBelow1020 = useMediaQuery("(max-width: 1020px)");

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setVisible(entry.isIntersecting),
            { threshold: 0.3 }
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
                padding: isBelow1020 ? "80px 20px 40px" : "120px 20px 60px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
            }}
        >
            {/* AURA BACKGROUND */}
            <Box
                style={{
                    position: "absolute",
                    inset: 0,
                    background: `
                        radial-gradient(circle at 30% 40%, rgba(56,189,248,0.15), transparent 40%),
                        radial-gradient(circle at 70% 60%, rgba(34,197,94,0.12), transparent 40%)
                    `,
                    filter: "blur(70px)",
                    pointerEvents: "none",
                }}
            />

            {/* PARTICLES */}
            <Box className="hero-particles" />

            {/* HEADING */}
            <Text
                className={`hero-title ${visible ? "hero-visible" : ""}`}
                style={{
                    fontFamily: "Space Grotesk, sans-serif",
                    fontSize: isBelow1020 ? 38 : 72,
                    fontWeight: 700,
                    letterSpacing: "-0.04em",
                    textAlign: "center",
                    lineHeight: 1.05,
                }}
            >
                <span className="hero-gradient">
                    {title}
                </span>

                <span className="hero-underline" />
            </Text>
        </Box>
    );
}
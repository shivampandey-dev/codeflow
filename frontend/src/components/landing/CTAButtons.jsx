import { Box, Text } from "@mantine/core";
import { IconBolt, IconUpload } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@mantine/hooks";

export default function CTAButtons() {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    const isBelow720 = useMediaQuery("(max-width: 720px)");
    const isBelow450 = useMediaQuery("(max-width: 450px)");

    const columns = isBelow720 ? 1 : 2;

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setVisible(entry.isIntersecting),
            { threshold: 0.25 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const y = window.scrollY * 0.08;
            document.documentElement.style.setProperty("--cta-parallax", `${y}px`);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <Box
            ref={ref}
            style={{
                width: "100%",
                maxWidth: 1100,
                margin: "0 auto",

                /* keep left/right gutters at all widths */
                paddingInline: "clamp(16px, 5vw, 48px)",
                boxSizing: "border-box",

                display: "flex",
                flexDirection: "column",
                alignItems: "center",

                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0px)" : "translateY(40px)",
                transition: "all 0.9s cubic-bezier(.16,1,.3,1)",
            }}
        >
            {/* TEXT */}
            <Box
                style={{
                    textAlign: "center",
                    maxWidth: 820,
                    marginBottom: "clamp(24px, 5vw, 48px)",
                }}
            >
                <Text
                    style={{
                        fontSize: "clamp(26px, 6vw, 64px)",
                        fontWeight: 700,
                        lineHeight: 1.2,
                        color: "#e2e8f0",
                        letterSpacing: "-0.02em",
                        whiteSpace: "normal",
                        overflowWrap: "anywhere",
                        wordBreak: "break-word",
                    }}
                >
                    Faster and more <span className="gradient-text">secure</span>
                    <br />
                    than local.
                </Text>

                <Text
                    mt={16}
                    style={{
                        color: "#94a3b8",
                        fontSize: "clamp(14px, 2.8vw, 18px)",
                        maxWidth: 560,
                        margin: "0 auto",
                        lineHeight: 1.6,
                        whiteSpace: "normal",
                        overflowWrap: "anywhere",
                        wordBreak: "break-word",
                    }}
                >
                    Codeflow runs your full development environment directly in the
                    browser using isolated containers. No installs, no setup — just instant coding.
                </Text>
            </Box>

            {/* CARDS GRID */}
            <Box
                style={{
                    width: "100%",
                    maxWidth: 900,
                    margin: "0 auto",

                    /* consistent inner gutters */
                    paddingInline: 16,
                    boxSizing: "border-box",

                    display: "grid",
                    gridTemplateColumns: isBelow720 ? "1fr" : `repeat(${columns}, minmax(0, 1fr))`,
                    gap: isBelow720 ? 16 : 24,

                    /* ensure children stretch and can shrink */
                    alignItems: "stretch",
                }}
            >
                <GlassCard
                    icon={<IconBolt size={22} />}
                    title="Start with a Template"
                    desc="Choose from React, Node.js and more."
                    button="New Project"
                    gradient="linear-gradient(135deg,#14b8a6,#0ea5e9)"
                />

                <GlassCard
                    icon={<IconUpload size={22} />}
                    title="Upload Your Project"
                    desc="Open any local folder or ZIP archive."
                    button="Upload Folder"
                    gradient="linear-gradient(135deg,#6366f1,#8b5cf6)"
                />
            </Box>
        </Box>
    );
}

/* CARD */
function GlassCard({ icon, title, desc, button, gradient }) {
    return (
        <Box
            style={{
                width: "100%",
                minWidth: 0, // critical for shrinking inside grid
                padding: "clamp(16px, 4vw, 22px)",
                borderRadius: 18,

                background: "rgba(15, 23, 42, 0.55)",
                backdropFilter: "blur(18px)",
                border: "1px solid rgba(255,255,255,0.08)",

                boxShadow: `
          0 0 40px rgba(59,130,246,0.12),
          0 20px 60px rgba(0,0,0,0.6)
        `,

                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",

                minHeight: 200,

                /* allow the card to shrink when container narrows */
                flexShrink: 1,
                overflow: "hidden",
            }}
        >
            <Box
                style={{
                    width: 44,
                    height: 44,
                    minWidth: 44,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "#fff",
                    marginBottom: 14,
                    flexShrink: 0, // icon shouldn't shrink into text
                }}
            >
                {icon}
            </Box>

            <Text
                style={{
                    color: "#e2e8f0",
                    fontSize: 18,
                    fontWeight: 600,
                    whiteSpace: "normal",
                    overflowWrap: "anywhere",
                    wordBreak: "break-word",
                }}
            >
                {title}
            </Text>

            <Text
                style={{
                    color: "#94a3b8",
                    fontSize: 13,
                    marginTop: 6,
                    marginBottom: 18,
                    whiteSpace: "normal",
                    overflowWrap: "anywhere",
                    wordBreak: "break-word",
                }}
            >
                {desc}
            </Text>

            <Box
                style={{
                    minHeight: 42,
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: gradient,
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: 14,
                }}
            >
                {button}
            </Box>
        </Box>
    );
}
import { Box, Text } from "@mantine/core";
import { IconBolt, IconUpload } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";

export default function CTAButtons() {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // responsive check
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    // scroll reveal animation
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
                marginTop: isMobile ? 140 : 220,
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: isMobile ? 18 : 28,
                alignItems: "center",
                justifyContent: "center",

                opacity: visible ? 1 : 0,
                transform: visible
                    ? "translateY(0px) scale(1)"
                    : "translateY(80px) scale(0.95)",

                transition: "all 0.9s cubic-bezier(.16,1,.3,1)",
            }}
        >
            <GlassCard
                icon={<IconBolt size={22} />}
                title="Start with a Template"
                desc="Choose from React, Node.js and more."
                button="New Project"
                gradient="linear-gradient(135deg,#14b8a6,#0ea5e9)"
            />

            {!isMobile && (
                <Text
                    style={{
                        color: "#64748b",
                        fontSize: 14,
                        letterSpacing: 1,
                    }}
                >
                    OR
                </Text>
            )}

            <GlassCard
                icon={<IconUpload size={22} />}
                title="Upload Your Project"
                desc="Open any local folder or ZIP archive."
                button="Upload Folder"
                gradient="linear-gradient(135deg,#6366f1,#8b5cf6)"
            />
        </Box>
    );
}

function GlassCard({ icon, title, desc, button, gradient }) {
    return (
        <Box
            style={{
                width: 320,
                padding: 22,
                borderRadius: 18,

                background: "rgba(15, 23, 42, 0.55)",
                backdropFilter: "blur(18px)",

                border: "1px solid rgba(255,255,255,0.08)",

                boxShadow: `
          0 0 40px rgba(59,130,246,0.12),
          0 20px 60px rgba(0,0,0,0.6)
        `,

                transition: "all 0.35s cubic-bezier(.16,1,.3,1)",
                cursor: "pointer",

                animation: "cardFloat 7s ease-in-out infinite",

                transform: "translateY(-40px)",   // ✅ MOVE UP
            }}
            className="cta-card"
        >
            {/* Icon */}
            <Box
                style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "#fff",

                    marginBottom: 14,
                }}
            >
                {icon}
            </Box>

            {/* Title */}
            <Text
                style={{
                    color: "#e2e8f0",
                    fontSize: 18,
                    fontWeight: 600,
                }}
            >
                {title}
            </Text>

            {/* Description */}
            <Text
                style={{
                    color: "#94a3b8",
                    fontSize: 13,
                    marginTop: 6,
                    marginBottom: 18,
                }}
            >
                {desc}
            </Text>

            {/* Button */}
            <Box
                style={{
                    height: 42,
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                    background: gradient,
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: 14,

                    boxShadow: "0 10px 30px rgba(0,0,0,0.4)",

                    transition: "all 0.25s ease",
                }}
                className="cta-btn"
            >
                {button}
            </Box>
        </Box>
    );
}
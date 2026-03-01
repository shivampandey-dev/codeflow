import { Box, Text } from "@mantine/core";
import { motion } from "framer-motion";

export default function TechFooter() {
    return (
        <Box
            style={{
                marginTop: 28,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
            }}
        >
            <Text
                size="xs"
                c="#64748b"
                style={{
                    letterSpacing: "0.04em",
                }}
            >
                Running entirely in your browser
            </Text>

            <motion.div
                animate={{
                    boxShadow: [
                        "0 0 10px rgba(99,102,241,0.15)",
                        "0 0 25px rgba(99,102,241,0.35)",
                        "0 0 10px rgba(99,102,241,0.15)",
                    ],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                }}
            >
                <Box
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "6px 14px",
                        borderRadius: 999,
                        background:
                            "linear-gradient(135deg, rgba(99,102,241,0.18), rgba(56,189,248,0.18))",
                        border: "1px solid rgba(99,102,241,0.35)",
                        backdropFilter: "blur(10px)",
                        fontSize: 12,
                        fontWeight: 500,
                        color: "#c7d2fe",
                    }}
                >
                    ⚡ Built with WebContainers technology
                </Box>
            </motion.div>
        </Box>
    );
}
import { Box, Text } from "@mantine/core";

export default function LivePreview() {
    return (
        <Box
            mt={120}
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <Text
                style={{
                    color: "#e2e8f0",
                    fontSize: 28,
                    fontWeight: 600,
                    marginBottom: 40,
                }}
            >
                Build Instantly in Your Browser
            </Text>

            {/* Editor Card */}
            <Box
                style={{
                    width: "100%",
                    maxWidth: 900,
                    borderRadius: 18,
                    padding: 20,

                    background: "rgba(15,23,42,0.55)",
                    backdropFilter: "blur(18px)",

                    border: "1px solid rgba(255,255,255,0.08)",

                    boxShadow: `
            0 0 40px rgba(59,130,246,0.12),
            0 30px 80px rgba(0,0,0,0.6)
          `,
                }}
            >
                {/* Fake Header */}
                <Box
                    style={{
                        display: "flex",
                        gap: 8,
                        marginBottom: 14,
                    }}
                >
                    <Box style={{ width: 12, height: 12, borderRadius: "50%", background: "#ef4444" }} />
                    <Box style={{ width: 12, height: 12, borderRadius: "50%", background: "#f59e0b" }} />
                    <Box style={{ width: 12, height: 12, borderRadius: "50%", background: "#22c55e" }} />
                </Box>

                {/* Code */}
                <Box
                    style={{
                        fontFamily: "monospace",
                        fontSize: 14,
                        color: "#94a3b8",
                        lineHeight: 1.6,
                    }}
                >
                    {`import React from "react";

export default function App() {
  return (
    <div>
      <h1>Hello Codeflow 🚀</h1>
    </div>
  );
}`}
                </Box>
            </Box>
        </Box>
    );
}
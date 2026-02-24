import { Box } from "@mantine/core";
import { useEffect, useState } from "react";

const codeLines = [
    { text: 'import React from "react";' },
    { text: "" },
    { text: "export default function App() {" },
    { text: "  return (" },
    { text: "    <div>" },
    { text: "    Build, run, and ship JavaScript — instantly. 🚀" },
    { text: "      <p> The zero-config JavaScript IDE</p>" },
    { text: "    </div>" },
    { text: "  );" },
    { text: "}" },
];

export default function CodePreview() {

    /* ================= MOBILE DETECTION ================= */

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);


    /* ================= TYPE LOOP ================= */

    const [display, setDisplay] = useState("");
    const [index, setIndex] = useState(0);
    const [reverse, setReverse] = useState(false);

    const fullCode = codeLines.map(l => l.text).join("\n");

    useEffect(() => {
        let timeout;

        if (!reverse && index <= fullCode.length) {
            timeout = setTimeout(() => {
                setDisplay(fullCode.slice(0, index));
                setIndex(index + 1);
            }, 15);
        }
        else if (!reverse && index > fullCode.length) {
            timeout = setTimeout(() => setReverse(true), 2000);
        }
        else if (reverse && index >= 0) {
            timeout = setTimeout(() => {
                setDisplay(fullCode.slice(0, index));
                setIndex(index - 1);
            }, 8);
        }
        else if (reverse && index < 0) {
            timeout = setTimeout(() => {
                setReverse(false);
                setIndex(0);
            }, 800);
        }

        return () => clearTimeout(timeout);

    }, [index, reverse]);


    /* ================= POSITION ================= */

    const containerStyle = isMobile
        ? {
            position: "absolute",
            left: "40%",
            top: "80%",   // 👈 push lower (adjust 70–80 if needed)
            transform: "translate(-50%, 0) scale(0.92)",
            width: "94%",
            maxWidth: 420,
        }
        : {
            position: "absolute",
            right: "6%",
            top: "70%",
            transform: "translateY(-50%)",
            width: 420,
        };


    return (
        <Box
            style={{
                ...containerStyle,
                borderRadius: 16,
                overflow: "hidden",

                background: "rgba(15, 23, 42, 0.55)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.08)",

                boxShadow: `
          0 0 40px rgba(59,130,246,0.15),
          0 20px 60px rgba(0,0,0,0.6)
        `,

                animation: "floatPreview 8s ease-in-out infinite",
                zIndex: 5,
            }}
        >
            {/* Header */}
            <Box
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 12px",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    background: "rgba(255,255,255,0.03)",
                }}
            >
                <Circle color="#ff5f56" />
                <Circle color="#ffbd2e" />
                <Circle color="#27c93f" />

                <Box
                    style={{
                        marginLeft: 12,
                        fontSize: isMobile ? 12 : 12.5,
                        color: "#94a3b8",
                    }}
                >
                    App.jsx
                </Box>
            </Box>

            {/* Code */}
            <Box
                component="pre"
                style={{
                    margin: 0,
                    padding: 14,
                    fontSize: isMobile ? 10 : 12.5,
                    lineHeight: 1.6,
                    fontFamily: "monospace",
                    color: "#e2e8f0",
                    minHeight: 150,
                    whiteSpace: "pre-wrap",
                }}
            >
                {renderHighlighted(display)}
                <Cursor />
            </Box>
        </Box>
    );
}


/* ================= HIGHLIGHT ================= */

function renderHighlighted(text) {
    return text.split("\n").map((line, i) => {

        let color = "#e2e8f0";

        if (line.includes("import"))
            color = "#c084fc";
        if (line.includes("export") || line.includes("return"))
            color = "#0da3cc";

        if (line.includes("<div") || line.includes("</div") || line.includes("<p"))
            color = "#34d399";

        return (
            <div key={i} style={{ color }}>
                {line}
            </div>
        );
    });
}


/* ================= CURSOR ================= */

function Cursor() {
    return (
        <span
            style={{
                marginLeft: 2,
                color: "#60a5fa",
                animation: "blink 1s infinite",
            }}
        >
            |
        </span>
    );
}


/* ================= HEADER DOT ================= */

function Circle({ color }) {
    return (
        <Box
            style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: color,
            }}
        />
    );
}
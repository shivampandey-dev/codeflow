import { Box, Text } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import SectionHero from "../common/SectionHero";

/* ================= DEMO ================= */

const demos = [
    {
        code: [
            `import React from "react";`,
            ``,
            `export default function App() {`,
            `  const name = "Shivam";`,
            ``,
            `  return (`,
            `    <div style={{ padding: 20 }}>`,
            `      <h1>Hello {name}</h1>`,
            `    </div>`,
            `  );`,
            `}`,
        ],
        output: "Hello Shivam",
    },
];

/* ================= SAFE SYNTAX ================= */

const highlightCode = (line = "") => {
    if (typeof line !== "string") return "";

    let safe = line
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    safe = safe.replace(/(".*?"|'.*?')/g, `<span class="str">$1</span>`);

    safe = safe.replace(
        /\b(import|from|export|default|function|return|const)\b/g,
        `<span class="kw">$1</span>`
    );

    safe = safe.replace(/(&lt;\/?[a-zA-Z]+)/g, `<span class="tag">$1</span>`);

    safe = safe.replace(/([{}()])/g, `<span class="br">$1</span>`);

    return safe;
};

export default function CodeTransformCustom() {
    const [typedLines, setTypedLines] = useState([]);
    const [phase, setPhase] = useState("typing");
    const [output, setOutput] = useState("");
    const [isMobile, setIsMobile] = useState(false);

    const editorRef = useRef(null);
    const intervalRef = useRef(null);

    const demo = demos[0];

    /* ================= MOBILE DETECT ================= */

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    /* ================= TYPING ================= */

    useEffect(() => {
        if (phase !== "typing") return;

        const lines = demo.code;

        let lineIndex = 0;
        let charIndex = 0;

        intervalRef.current = setInterval(() => {
            if (lineIndex >= lines.length) {
                clearInterval(intervalRef.current);
                setTypedLines(lines);

                setTimeout(() => setPhase("move"), 600);
                return;
            }

            const currentLine = lines[lineIndex] ?? "";

            setTypedLines((prev) => {
                const copy = [...prev];
                copy[lineIndex] = currentLine.slice(0, charIndex);
                return copy;
            });

            charIndex++;

            if (charIndex > currentLine.length) {
                lineIndex++;
                charIndex = 0;
            }
        }, 20);

        return () => clearInterval(intervalRef.current);
    }, [phase]);

    /* ================= AUTO SCROLL ================= */

    useEffect(() => {
        if (!editorRef.current) return;
        editorRef.current.scrollTop = editorRef.current.scrollHeight;
    }, [typedLines]);

    /* ================= MOVE ================= */

    useEffect(() => {
        if (phase !== "move") return;
        const t = setTimeout(() => setPhase("output"), 1200);
        return () => clearTimeout(t);
    }, [phase]);

    /* ================= OUTPUT ================= */

    useEffect(() => {
        if (phase !== "output") return;

        let i = 0;
        const text = demo.output;

        const interval = setInterval(() => {
            setOutput(text.slice(0, i));
            i++;

            if (i > text.length) {
                clearInterval(interval);

                setTimeout(() => {
                    setTypedLines([]);
                    setOutput("");
                    setPhase("typing");
                }, 1800);
            }
        }, 40);

        return () => clearInterval(interval);
    }, [phase]);

    const isMoving = phase === "move";

    const renderLines =
        typedLines.length === 0
            ? demo.code
            : typedLines.map((l) => l ?? "");

    return (
        <Box
            style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                padding: "60px 20px",
            }}
        >
            <Box style={{ width: "100%", maxWidth: 1200 }}>
                {/* ================= TITLE ================= */}

                <Text
                    style={{
                        textAlign: "center",
                        fontSize: isMobile ? 28 : 40,
                        fontWeight: 800,
                    
                        background:
                            "linear-gradient(90deg, #00f5ff, #22c55e, #a855f7, #ff2bd6)",
                        WebkitBackgroundClip: "text",
                        color: "transparent",
                    }}
                >
                    Type. Execute. Output.
                </Text>

                {/* DIVIDER */}
                <Box
                    style={{
                        height: 1,
                        background:
                            "linear-gradient(90deg, transparent, #38bdf8, transparent)",
                        opacity: 0.3,
                        margin: "40px 0 60px 0",
                    }}
                />

                {/* ================= CONTENT ================= */}

                <Box
                    style={{
                        display: "flex",
                        flexDirection: isMobile ? "column" : "row",
                        gap: 40,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {/* ================= EDITOR ================= */}

                    <Box style={{ flex: 1, width: "100%" }}>
                        <Text size="xs" c="dimmed" mb={6}>
                            Live Code
                        </Text>

                        <Box className="editor-box">
                            <div className="react-watermark">⚛</div>

                            <Box className="editor-bar">
                                <Box className="dot red" />
                                <Box className="dot yellow" />
                                <Box className="dot green" />
                                <Text className="file-name">App.jsx</Text>
                            </Box>

                            <Box ref={editorRef} className="code-area">
                                {renderLines.map((line, i) => (
                                    <div key={i} className="code-line">
                                        <div className="indent" />
                                        <span className="line-number">{i + 1}</span>
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: highlightCode(line),
                                            }}
                                        />
                                    </div>
                                ))}
                                <div className="caret" />
                            </Box>
                        </Box>
                    </Box>

                    {/* ================= PIPE ================= */}

                    {isMobile ? (
                        <Box className="mobile-pipe">
                            <div
                                className={`mobile-line ${isMoving ? "active" : ""}`}
                            />
                            <div className="arrow-down">▼</div>
                        </Box>
                    ) : (
                        <Box style={{ width: 260, height: 160 }}>
                            <svg width="100%" height="160" viewBox="0 0 300 160">
                                <path
                                    d="M10 120 C 120 10, 180 10, 290 120"
                                    fill="none"
                                    stroke="rgba(255,255,255,0.15)"
                                    strokeWidth="2"
                                />

                                <path
                                    d="M10 120 C 120 10, 180 10, 290 120"
                                    fill="none"
                                    stroke="url(#grad)"
                                    strokeWidth="3"
                                    strokeDasharray="500"
                                    strokeDashoffset={isMoving ? 0 : 500}
                                    style={{
                                        transition: "stroke-dashoffset 1.5s ease",
                                        filter: "drop-shadow(0 0 6px #38bdf8)",
                                    }}
                                />

                                <polygon
                                    points="0,-6 14,0 0,6"
                                    fill="#38bdf8"
                                    transform="translate(290,120)"
                                />

                                <defs>
                                    <linearGradient id="grad">
                                        <stop offset="0%" stopColor="#38bdf8" />
                                        <stop offset="50%" stopColor="#22c55e" />
                                        <stop offset="100%" stopColor="#a855f7" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </Box>
                    )}

                    {/* ================= OUTPUT ================= */}

                    <Box style={{ flex: 1, width: "100%" }}>
                        <Text size="xs" c="dimmed" mb={6}>
                            Instant Output
                        </Text>

                        <Box className="output-box">
                            <Text className="output-text">{output}</Text>
                        </Box>
                    </Box>
                </Box>

                {/* ================= STYLES ================= */}

                <style>
                    {`
          .kw { color:#60a5fa }
          .str { color:#fca5a5 }
          .tag { color:#34d399 }
          .br { color:#fbbf24 }

          .editor-box{
            height:260px;
            border-radius:18px;
            overflow:hidden;
            background:linear-gradient(135deg, rgba(15,23,42,0.9), rgba(2,6,23,0.95));
            border:1px solid rgba(255,255,255,0.08);
            box-shadow:0 0 40px rgba(56,189,248,0.15);
            display:flex;
            flex-direction:column;
            position:relative;
          }

          .editor-bar{
            height:36px;
            display:flex;
            align-items:center;
            padding:0 12px;
            gap:8px;
            background:rgba(255,255,255,0.04);
            border-bottom:1px solid rgba(255,255,255,0.08);
          }

          .file-name{ margin-left:10px;font-size:12px;opacity:.7 }

          .code-area{
            flex:1;
            overflow:auto;
            padding:14px;
            font-family:monospace;
            font-size:13px;
            line-height:1.6;
            color:#e2e8f0;
            position:relative;
          }

          .code-line{ display:flex; position:relative }

          .dot{ width:10px;height:10px;border-radius:50% }
          .red{background:#ff5f56}
          .yellow{background:#ffbd2e}
          .green{background:#27c93f}

          .line-number{
            opacity:.3;
            margin-right:8px;
            width:20px;
            display:inline-block;
          }

          .caret{
            width:2px;
            height:18px;
            background:#38bdf8;
            position:absolute;
            bottom:8px;
            left:60px;
            animation:blink 1s infinite;
            box-shadow:0 0 10px #38bdf8;
          }

          @keyframes blink{
            0%,100%{opacity:1}
            50%{opacity:0}
          }

          .indent{
            position:absolute;
            left:30px;
            top:0;
            bottom:0;
            width:1px;
            background:rgba(255,255,255,.06);
          }

          .react-watermark{
            position:absolute;
            right:20px;
            bottom:10px;
            font-size:60px;
            opacity:.05;
            pointer-events:none;
          }

          .output-box{
            height:260px;
            border-radius:18px;
            padding:20px;
            background:linear-gradient(135deg, rgba(15,23,42,0.9), rgba(2,6,23,0.95));
            border:1px solid rgba(255,255,255,0.08);
            box-shadow:0 0 40px rgba(34,197,94,0.15);
            display:flex;
            align-items:center;
            justify-content:center;
          }

          .output-text{
            font-size:32px;
            font-weight:800;
            background:linear-gradient(90deg,#38bdf8,#22c55e,#a855f7);
            -webkit-background-clip:text;
            color:transparent;
            text-align:center;
          }

          .mobile-pipe{
            display:flex;
            flex-direction:column;
            align-items:center;
            justify-content:center;
            height:80px;
          }

          .mobile-line{
            width:2px;
            height:0;
            background:linear-gradient(#38bdf8,#22c55e,#a855f7);
            transition:height 1s ease;
            box-shadow:0 0 10px #38bdf8;
          }

          .mobile-line.active{
            height:60px;
          }

          .arrow-down{
            margin-top:6px;
            color:#38bdf8;
            font-size:18px;
          }

          @media (max-width:768px){
            .output-box{
              min-width:100%;
            }
          }
          `}
                </style>
            </Box>
        </Box>
    );
}
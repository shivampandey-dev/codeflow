import { Box } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import { useState, useRef } from "react";

import FileTree from "./FileTree/FileTree";
import Preview from "./Preview/Preview";
import Terminal from "./Terminal/Terminal";
import CodeEditor from "./Editor/CodeEditor";

export default function WorkspaceLayout({
    previewUrl,
    logs,
    process,
    webcontainer,
    projectPath,
}) {
    const isMobile = useMediaQuery("(max-width: 768px)");

    const [terminalFullscreen, setTerminalFullscreen] = useState(false);
    const [editorFullscreen, setEditorFullscreen] = useState(false);

    // 🔥 IMPORTANT: Allotment ref
    const allotmentRef = useRef(null);

    // 🔥 FULLSCREEN HANDLER (MAIN FIX)
    const handleTerminalFullscreen = (value) => {
        setTerminalFullscreen(value);

        if (allotmentRef.current) {
            if (value) {
                // FULLSCREEN TERMINAL
                allotmentRef.current.resize([0, 100]);
            } else {
                // NORMAL LAYOUT
                allotmentRef.current.resize([75, 25]);
            }
        }
    };

    /* ================= MOBILE ================= */
    if (isMobile) {
        return (
            <Box
                style={{
                    height: "100vh",
                    width: "100%",
                    overflowY: "auto",
                    background: "#0b1220",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    padding: "8px",
                }}
            >
                <Box style={{ minHeight: "200px", height: "30vh" }}>
                    <FileTree webcontainer={webcontainer} />
                </Box>

                <Box style={{ minHeight: "320px", height: "45vh" }}>
                    <CodeEditor />
                </Box>

                <Box style={{ minHeight: "220px", height: "35vh" }}>
                    <Preview previewUrl={previewUrl} logs={logs} />
                </Box>

                <Box style={{ minHeight: "260px", height: "40vh" }}>
                    <Terminal
                        logs={logs}
                        process={process}
                        webcontainer={webcontainer}
                        projectPath={projectPath}
                    />
                </Box>
            </Box>
        );
    }

    /* ================= DESKTOP ================= */
    return (
        <Box
            style={{
                height: "100dvh",
                position: "relative",
                overflow: "hidden",
                background: "#0b1220",
            }}
        >
            <Allotment
                vertical
                ref={allotmentRef}
                defaultSizes={[75, 25]} // 🔥 IMPORTANT
                style={{ height: "100%" }}
            >

                {/* ===== TOP PANE ===== */}
                <Allotment.Pane minSize={0}>
                    <Allotment>

                        {/* FILE TREE */}
                        <Allotment.Pane
                            preferredSize={260}
                            minSize={editorFullscreen ? 0 : 180}
                            style={
                                editorFullscreen
                                    ? { maxWidth: 0, overflow: "hidden" }
                                    : {}
                            }
                        >
                            <FileTree webcontainer={webcontainer} logs={logs} />
                        </Allotment.Pane>

                        {/* EDITOR */}
                        <Allotment.Pane minSize={0}>
                            <CodeEditor
                                fullscreen={editorFullscreen}
                                setFullscreen={setEditorFullscreen}
                            />
                        </Allotment.Pane>

                        {/* PREVIEW */}
                        <Allotment.Pane
                            preferredSize={320}
                            minSize={editorFullscreen ? 0 : 180}
                            style={
                                editorFullscreen
                                    ? { maxWidth: 0, overflow: "hidden" }
                                    : {}
                            }
                        >
                            <Preview previewUrl={previewUrl} logs={logs} />
                        </Allotment.Pane>

                    </Allotment>
                </Allotment.Pane>

                {/* ===== TERMINAL ===== */}
                <Allotment.Pane minSize={10}>
                    <Box
                        style={{
                            height: "100%",
                            background: "#0b1220",
                        }}
                    >
                        <Terminal
                            logs={logs}
                            process={process}
                            webcontainer={webcontainer}
                            projectPath={projectPath}
                            fullscreen={terminalFullscreen}
                            setFullscreen={handleTerminalFullscreen} // 🔥 FIX HERE
                        />
                    </Box>
                </Allotment.Pane>

            </Allotment>
        </Box>
    );
}
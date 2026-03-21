import { Box } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import { useState } from "react";

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

    // ✅ FULLSCREEN STATES
    const [terminalFullscreen, setTerminalFullscreen] = useState(false);
    const [editorFullscreen, setEditorFullscreen] = useState(false);

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
            <Allotment key={`${terminalFullscreen}-${editorFullscreen}`} vertical style={{ height: "100%" }}>

                {/* ================= EDITOR FULLSCREEN ================= */}
                {editorFullscreen && (
                    <Allotment.Pane preferredSize="100%">
                        <CodeEditor
                            fullscreen={editorFullscreen}
                            setFullscreen={setEditorFullscreen}
                        />
                    </Allotment.Pane>
                )}

                {/* ================= NORMAL LAYOUT ================= */}
                {!editorFullscreen && !terminalFullscreen && (
                    <Allotment.Pane preferredSize="75%">
                        <Allotment>

                            <Allotment.Pane preferredSize={260} minSize={180}>
                                <FileTree webcontainer={webcontainer} logs={logs} />
                            </Allotment.Pane>

                            <Allotment.Pane>
                                <CodeEditor
                                    fullscreen={editorFullscreen}
                                    setFullscreen={setEditorFullscreen}
                                />
                            </Allotment.Pane>

                            <Allotment.Pane preferredSize={320} minSize={180}>
                                <Preview previewUrl={previewUrl} logs={logs} />
                            </Allotment.Pane>

                        </Allotment>
                    </Allotment.Pane>
                )}

                {/* ================= TERMINAL ================= */}
                {!editorFullscreen && (
                    <Allotment.Pane
                        preferredSize={terminalFullscreen ? "100%" : 260}
                        minSize={160}
                    >
                        <Terminal
                            logs={logs}
                            process={process}
                            webcontainer={webcontainer}
                            projectPath={projectPath}
                            fullscreen={terminalFullscreen}
                            setFullscreen={setTerminalFullscreen}
                        />
                    </Allotment.Pane>
                )}

            </Allotment>
        </Box>
    );
}
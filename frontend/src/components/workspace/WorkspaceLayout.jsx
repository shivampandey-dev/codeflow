import { Box } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Allotment } from "allotment";
import "allotment/dist/style.css";

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
                {/* FILE TREE */}
                <Box style={{ minHeight: "200px", height: "30vh" }}>
                    <FileTree webcontainer={webcontainer} />
                </Box>

                {/* EDITOR */}
                <Box style={{ minHeight: "320px", height: "45vh" }}>
                    <CodeEditor />
                </Box>

                {/* PREVIEW */}
                <Box style={{ minHeight: "220px", height: "35vh" }}>
                    <Preview
                        previewUrl={previewUrl}
                        logs={logs}
                    />
                </Box>

                {/* TERMINAL */}
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
            <Allotment vertical style={{ height: "100%" }}>

                {/* TOP SECTION */}
                <Allotment.Pane preferredSize="75%">
                    <Allotment>

                        <Allotment.Pane preferredSize={260} minSize={180}>
                            <FileTree webcontainer={webcontainer} logs={logs} />
                        </Allotment.Pane>

                        <Allotment.Pane>
                            <CodeEditor />
                        </Allotment.Pane>

                        <Allotment.Pane preferredSize={320} minSize={180}>
                            <Preview
                                previewUrl={previewUrl}
                                logs={logs}
                            />
                        </Allotment.Pane>

                    </Allotment>
                </Allotment.Pane>

                {/* TERMINAL */}
                <Allotment.Pane preferredSize={260} minSize={160}>
                    <Terminal
                        logs={logs}
                        process={process}
                        webcontainer={webcontainer}
                        projectPath={projectPath}
                    />
                </Allotment.Pane>

            </Allotment>
        </Box>
    );
}
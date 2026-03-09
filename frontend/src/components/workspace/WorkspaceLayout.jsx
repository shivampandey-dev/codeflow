import { Box } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Allotment } from "allotment";
import "allotment/dist/style.css";

import FileTree from "./FileTree/FileTree";
import Editor from "./Editor/Editor";
import Preview from "./Preview/Preview";
import Terminal from "./Terminal/Terminal";

export default function WorkspaceLayout({
    previewUrl,
    logs,
    process,
    webcontainer,
    projectPath,
}) {
    const isMobile = useMediaQuery("(max-width: 768px)");

    // MOBILE LAYOUT (STACKED WITH BIGGER HEIGHT)
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
                <Box
                    style={{
                        minHeight: "200px",
                        height: "30vh",
                    }}
                >
                    <FileTree />
                </Box>

                {/* EDITOR */}
                <Box
                    style={{
                        minHeight: "320px",
                        height: "45vh",
                    }}
                >
                    <Editor />
                </Box>

                {/* PREVIEW */}
                <Box
                    style={{
                        minHeight: "220px",
                        height: "35vh",
                    }}
                >
                    <Preview previewUrl={previewUrl} />
                </Box>

                {/* TERMINAL */}
                <Box
                    style={{
                        minHeight: "260px",
                        height: "40vh",
                    }}
                >
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

    // DESKTOP LAYOUT
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
                {/* TOP */}
                <Allotment.Pane preferredSize="75%">
                    <Allotment>
                        <Allotment.Pane preferredSize={260} minSize={180}>
                            <FileTree />
                        </Allotment.Pane>

                        <Allotment.Pane>
                            <Editor />
                        </Allotment.Pane>

                        <Allotment.Pane preferredSize={320} minSize={180}>
                            <Preview previewUrl={previewUrl} />
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
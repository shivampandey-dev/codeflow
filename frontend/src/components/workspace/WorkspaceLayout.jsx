import { Box } from "@mantine/core";
import { Allotment } from "allotment";
import "allotment/dist/style.css";

import FileTree from "./FileTree/FileTree";
import Editor from "./Editor/Editor";
import Preview from "./Preview/Preview";
import Terminal from "./Terminal/Terminal";

export default function WorkspaceLayout({ previewUrl, logs, process, webcontainer, projectPath }) {
    return (
        <Box
            style={{
                height: "100vh",
                width: "100%",
                position: "fixed",
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

                        <Allotment.Pane preferredSize={420} minSize={280}>
                            <Preview previewUrl={previewUrl} />
                        </Allotment.Pane>

                    </Allotment>
                </Allotment.Pane>

                {/* TERMINAL */}
                <Allotment.Pane preferredSize={220} minSize={120}>
                    <Terminal logs={logs} process={process} webcontainer={webcontainer} projectPath={projectPath} />
                </Allotment.Pane>

            </Allotment>
        </Box>
    );
}
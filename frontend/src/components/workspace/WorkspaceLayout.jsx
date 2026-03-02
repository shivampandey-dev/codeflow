import { Box } from "@mantine/core";
import { Allotment } from "allotment";
import "allotment/dist/style.css";

import FileTree from "./FileTree/FileTree";
import Editor from "./Editor/Editor";
import Preview from "./Preview/Preview";
import Terminal from "./Terminal/Terminal";

export default function WorkspaceLayout({ previewUrl }) {
    return (
        <Box
            style={{
                height: "100vh",
                background: "#0b1220",
            }}
        >
            <Allotment vertical>

                {/* TOP AREA */}
                <Allotment.Pane preferredSize="75%">
                    <Allotment>

                        {/* FILE TREE */}
                        <Allotment.Pane preferredSize={260} minSize={180}>
                            <FileTree />
                        </Allotment.Pane>

                        {/* EDITOR */}
                        <Allotment.Pane>
                            <Editor />
                        </Allotment.Pane>

                        {/* PREVIEW */}
                        <Allotment.Pane preferredSize={420} minSize={280}>
                            <Preview previewUrl={previewUrl} />
                        </Allotment.Pane>

                    </Allotment>
                </Allotment.Pane>

                {/* TERMINAL */}
                <Allotment.Pane preferredSize={220} minSize={120}>
                    <Terminal />
                </Allotment.Pane>

            </Allotment>
        </Box>
    );
}
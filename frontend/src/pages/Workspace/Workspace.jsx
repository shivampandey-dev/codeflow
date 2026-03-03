import { useEffect, useRef, useState } from "react";

import { bootWebContainer } from "../runtime/webcontainer/webcontainer";
import { mountTemplate } from "../runtime/webcontainer/mountFiles";
import { startDevServer } from "../runtime/webcontainer/startDevServer";

import WorkspaceLayout from "../../components/workspace/WorkspaceLayout";

export default function Workspace({ templateId }) {

    const [previewUrl, setPreviewUrl] = useState(null);
    const [logs, setLogs] = useState("");
    const [process, setProcess] = useState(null);
    const [wcs, setWcs] = useState(null);
    const initializedRef = useRef(false);
    const [projectPath, setProjectPath] = useState("");
    useEffect(() => {
        setProjectPath(`/${templateId}`);
    }, [])

    useEffect(() => {

        if (initializedRef.current) return;
        initializedRef.current = true;

        async function init() {

            try {

                setLogs("🚀 Booting WebContainer...\r\n");

                const wc = await bootWebContainer();
                setWcs(wc);

                setLogs(prev => prev + "📁 Mounting project files...\r\n");

                await mountTemplate(wc, templateId);

                wc.on("server-ready", (port, url) => {
                    console.log("Server ready:", url);
                    setPreviewUrl(url);
                });

                const devProcess = await startDevServer(
                    wc,
                    (data) => {
                        setLogs(prev => prev + data);
                    },
                    templateId   // 👈 pass folder name (NOT /templateId)
                );

                setProcess(devProcess);

            } catch (err) {
                console.error(err);
                setLogs(prev => prev + "\r\n❌ Error: " + err.message);
            }
        }

        init();

    }, [templateId]);

    return (
        <WorkspaceLayout
            previewUrl={previewUrl}
            logs={logs}
            process={process}
            webcontainer={wcs}
            projectPath={projectPath}
        />
    );
}
import { useEffect, useRef, useState } from "react";

import { bootWebContainer } from "../runtime/webcontainer/webcontainer";
import { mountTemplate } from "../runtime/webcontainer/mountFiles";
import { startDevServer } from "../runtime/webcontainer/startDevServer";

import WorkspaceLayout from "../../components/workspace/WorkspaceLayout";

export default function Workspace({ templateId }) {

    const [previewUrl, setPreviewUrl] = useState(null);
    const [logs, setLogs] = useState("");
    const [process, setProcess] = useState(null);
    const [webcontainer, setWebcontainer] = useState(null);
    const [projectPath, setProjectPath] = useState("");

    const initializedRef = useRef(false);
    const previewChannelRef = useRef(null);

    useEffect(() => {
        setProjectPath(`/${templateId}`);
    }, [templateId]);

    useEffect(() => {

        if (initializedRef.current) return;
        initializedRef.current = true;

        previewChannelRef.current = new BroadcastChannel("webcontainer-preview");

        /**
         * LISTEN FOR PREVIEW REQUEST FROM NEW TABS
         */
        previewChannelRef.current.onmessage = (event) => {

            if (event.data?.type === "preview-request") {

                const cachedUrl = localStorage.getItem("preview-url");

                if (cachedUrl) {

                    previewChannelRef.current.postMessage({
                        type: "preview-ready",
                        url: cachedUrl
                    });

                }

            }

        };

        async function init() {

            try {

                setLogs("🚀 Booting WebContainer...\r\n");

                const wc = await bootWebContainer();
                setWebcontainer(wc);

                setLogs(prev => prev + "📁 Mounting project files...\r\n");

                await mountTemplate(wc, templateId);

                /**
                 * DEV SERVER READY
                 */

                wc.on("server-ready", (port, url) => {

                    console.log("Server ready:", port, url);

                    setPreviewUrl(url);

                    /**
                     * Cache URL so new preview tabs load instantly
                     */
                    localStorage.setItem("preview-url", url);

                    /**
                     * Broadcast to all preview tabs
                     */

                    previewChannelRef.current.postMessage({
                        type: "preview-ready",
                        url
                    });

                });

                setLogs(prev => prev + "⚡ Starting dev server...\r\n");

                const devProcess = await startDevServer(
                    wc,
                    (data) => {
                        setLogs(prev => prev + data);
                    }
                );

                setProcess(devProcess);

            } catch (err) {

                console.error(err);

                setLogs(prev =>
                    prev + "\r\n❌ Error: " + err.message
                );
            }
        }

        init();

        return () => previewChannelRef.current?.close();

    }, [templateId]);

    return (
        <WorkspaceLayout
            previewUrl={previewUrl}
            logs={logs}
            process={process}
            webcontainer={webcontainer}
            projectPath={projectPath}
        />
    );
}
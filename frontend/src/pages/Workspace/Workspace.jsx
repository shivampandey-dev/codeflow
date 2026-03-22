import { useEffect, useRef, useState } from "react";
import { bootWebContainer } from "../runtime/webcontainer/webcontainer";
import { mountTemplate } from "../runtime/webcontainer/mountFiles";
import { startDevServer } from "../runtime/webcontainer/startDevServer";
import WorkspaceLayout from "../../components/workspace/WorkspaceLayout";
import { getUploadedTree, clearUploadedTree } from "../../store/uploadStore";

export default function Workspace({ templateId }) {
    const [previewUrl, setPreviewUrl] = useState(null);
    const [logs, setLogs] = useState("");
    const [process, setProcess] = useState(null);
    const [webcontainer, setWebcontainer] = useState(null);
    const [projectPath, setProjectPath] = useState("");
    const initializedRef = useRef(false);
    const previewChannelRef = useRef(null);

    const isUpload = templateId === "uploaded";

    useEffect(() => {
        setProjectPath(isUpload ? "/uploaded-project" : `/${templateId}`);
    }, [templateId]);

    useEffect(() => {
        if (initializedRef.current) return;
        initializedRef.current = true;

        previewChannelRef.current = new BroadcastChannel("webcontainer-preview");

        previewChannelRef.current.onmessage = (event) => {
            if (event.data?.type === "preview-request") {
                const cachedUrl = localStorage.getItem("preview-url");
                if (cachedUrl) {
                    previewChannelRef.current.postMessage({
                        type: "preview-ready",
                        url: cachedUrl,
                    });
                }
            }
        };

        async function init() {
            try {
                setLogs("🚀 Booting WebContainer...\r\n");
                const wc = await bootWebContainer();
                setWebcontainer(wc);

                if (isUpload) {
                    // ── UPLOADED PROJECT PATH ──────────────────────
                    const tree = getUploadedTree();

                    if (!tree) {
                        setLogs(
                            "❌ No uploaded project found. Please go back and upload again.\r\n"
                        );
                        return;
                    }

                    setLogs((prev) => prev + "📁 Mounting uploaded project...\r\n");
                    await wc.mount(tree);

                    // Clear from memory after mounting — no longer needed
                    clearUploadedTree();
                } else {
                    // ── TEMPLATE PATH (existing logic) ─────────────
                    setLogs((prev) => prev + "📁 Mounting project files...\r\n");
                    await mountTemplate(wc, templateId);
                }

                // ── DEV SERVER (same for both paths) ──────────────
                wc.on("server-ready", (port, url) => {
                    console.log("Server ready:", port, url);
                    setPreviewUrl(url);
                    localStorage.setItem("preview-url", url);
                    previewChannelRef.current.postMessage({
                        type: "preview-ready",
                        url,
                    });
                });

                setLogs((prev) => prev + "⚡ Starting dev server...\r\n");

                const devProcess = await startDevServer(wc, (data) => {
                    setLogs((prev) => prev + data);
                });

                setProcess(devProcess);
            } catch (err) {
                console.error(err);
                setLogs((prev) => prev + "\r\n❌ Error: " + err.message);
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
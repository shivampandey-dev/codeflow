import { useEffect, useRef, useState } from "react";
import { bootWebContainer } from "../runtime/webcontainer/webcontainer";
import { mountTemplate } from "../runtime/webcontainer/mountFiles";
import { startDevServer } from "../runtime/webcontainer/startDevServer";
import WorkspaceLayout from "../../components/workspace/WorkspaceLayout";
import { startBackendServer } from "../runtime/webcontainer/startBackendServer";
import { loadProject, clearProject } from "../../components/project/UploadProjectModal/projectStorage"; // ← ADD

const BACKEND_TEMPLATES = new Set(["node", "express", "fastify", "cli", "package"]);
const FULLSTACK_TEMPLATES = new Set(["next", "astro"]);
export default function Workspace({ templateId }) {
    const [previewUrl, setPreviewUrl] = useState(null);
    const [logs, setLogs] = useState("");
    const [process, setProcess] = useState(null);
    const [webcontainer, setWebcontainer] = useState(null);
    const [projectPath, setProjectPath] = useState("");

    const initializedRef = useRef(false);
    const previewChannelRef = useRef(null);

    const isUpload = templateId === "uploaded";
    const isBackend = BACKEND_TEMPLATES.has(templateId);

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
                    previewChannelRef.current.postMessage({ type: "preview-ready", url: cachedUrl });
                }
            }
        };

        async function init() {
            try {
                setLogs("🚀 Booting WebContainer...\r\n");
                const wc = await bootWebContainer();
                setWebcontainer(wc);

                if (isUpload) {
                    // ── 1. Try opener (fresh upload from landing page) ──
                    let tree = window.opener?.uploadedTree;

                    // ── 2. Fall back to IndexedDB (page refresh) ────────
                    if (!tree) {
                        setLogs((prev) => prev + "🔄 Restoring project from cache...\r\n");
                        const saved = await loadProject("current");
                        tree = saved?.tree ?? null;
                    } else {
                        delete window.opener.uploadedTree;
                    }

                    if (!tree) {
                        setLogs("❌ No project found. Please go back and upload again.\r\n");
                        return;
                    }

                    setLogs((prev) => prev + "📁 Mounting uploaded project...\r\n");
                    await wc.mount({ workspace: { directory: tree } });

                } else {
                    setLogs((prev) => prev + "📁 Mounting project files...\r\n");
                    await mountTemplate(wc, templateId);
                }

                wc.on("server-ready", (port, url) => {
                    setPreviewUrl(url);
                    localStorage.setItem("preview-url", url);
                    previewChannelRef.current.postMessage({ type: "preview-ready", url });
                });

                if (isBackend) {
                    setLogs((prev) => prev + "⚡ Starting backend server...\r\n");
                    const devProcess = await startBackendServer(
                        wc,
                        (data) => setLogs((prev) => prev + data),
                        (p) => setProcess(p),
                        null,
                        false
                    );
                    setProcess(devProcess);

                    // ✅ NEW — fullstack branch
                } else if (FULLSTACK_TEMPLATES.has(templateId)) {
                    setLogs((prev) => prev + "⚡ Starting fullstack dev server...\r\n");
                    const devProcess = await startDevServer(
                        wc,
                        (data) => setLogs((prev) => prev + data)
                    );
                    setProcess(devProcess);

                } else {
                    setLogs((prev) => prev + "⚡ Starting dev server...\r\n");
                    const devProcess = await startDevServer(
                        wc,
                        (data) => setLogs((prev) => prev + data)
                    );
                    setProcess(devProcess);
                }

            } catch (err) {
                console.error(err);
                setLogs((prev) => prev + "\r\n❌ Error: " + err.message);
            }
        }

        init();
        return () => previewChannelRef.current?.close();
    }, [templateId]);

    // ── Pass clearProject down so user can reset from the UI ────────────────
    const handleClearProject = async () => {
        await clearProject("current");
        window.location.href = "/"; // send back to landing
    };

    return (
        <WorkspaceLayout
            previewUrl={previewUrl}
            logs={logs}
            process={process}
            webcontainer={webcontainer}
            projectPath={projectPath}
            isBackend={isBackend}
            onClearProject={handleClearProject} // ← wire up to a "Close Project" button in your header
        />
    );
}
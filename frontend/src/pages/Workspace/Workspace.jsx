import { useEffect, useState } from "react";
import { bootWebContainer } from "../runtime/webcontainer/webcontainer";
import { mountTemplate } from "../runtime/webcontainer/mountFiles";
import { startDevServer } from "../runtime/webcontainer/startDevServer";

export default function Workspace({ templateId }) {
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        async function init() {
            const wc = await bootWebContainer();

            await mountTemplate(wc, templateId);

            await startDevServer(wc);

            // ✅ LISTEN FOR DEV SERVER
            wc.on("server-ready", (port, url) => {
                console.log("Server ready:", url);
                setPreviewUrl(url);
            });
        }

        init();
    }, [templateId]);

    return (
        <div style={{ height: "100vh", background: "#0f172a" }}>
            {!previewUrl && (
                <div style={{ color: "white", padding: 20 }}>
                    Booting container...
                </div>
            )}

            {previewUrl && (
                <iframe
                    src={previewUrl}
                    style={{
                        width: "100%",
                        height: "100%",
                        border: "none",
                    }}
                />
            )}
        </div>
    );
}
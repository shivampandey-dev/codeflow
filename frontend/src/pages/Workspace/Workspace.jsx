import { useEffect, useState } from "react";


import { bootWebContainer } from "../runtime/webcontainer/webcontainer";
import { mountTemplate } from "../runtime/webcontainer/mountFiles";
import { startDevServer } from "../runtime/webcontainer/startDevServer";
import WorkspaceLayout from "../../components/workspace/WorkspaceLayout";

export default function Workspace({ templateId }) {
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        async function init() {
            const wc = await bootWebContainer();

            await mountTemplate(wc, templateId);

            wc.on("server-ready", (port, url) => {
                console.log("Server ready:", url);
                setPreviewUrl(url);
            });

            await startDevServer(wc);
        }

        init();
    }, [templateId]);

    return <WorkspaceLayout previewUrl={previewUrl} />;
}
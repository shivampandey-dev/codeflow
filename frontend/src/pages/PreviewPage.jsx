import { useEffect, useState } from "react";

export default function PreviewPage() {

    const [url, setUrl] = useState(null);

    useEffect(() => {

        /**
         * First check cached preview URL
         */

        const cached = localStorage.getItem("preview-url");

        if (cached) {
            setUrl(cached);
        }

        const channel = new BroadcastChannel("webcontainer-preview");

        /**
         * Listen for preview updates
         */

        channel.onmessage = (event) => {

            if (event.data?.type === "preview-ready") {
                setUrl(event.data.url);
            }

        };

        /**
         * Request preview from workspace
         */

        channel.postMessage({
            type: "preview-request"
        });

        return () => channel.close();

    }, []);

    if (!url) {

        return (
            <div
                style={{
                    height: "100vh",
                    background: "#020617",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#94a3b8"
                }}
            >
                Waiting for preview...
            </div>
        );

    }

    return (
        <iframe
            src={url}
            style={{
                width: "100vw",
                height: "100vh",
                border: "none",
                background: "white"
            }}
        />
    );
}
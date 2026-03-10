import { useEffect, useState } from "react";
import Loder from "../../common/Loder";

export default function Preview({ previewUrl, logs }) {

    const [currentStep, setCurrentStep] = useState(1);
    const [showLoader, setShowLoader] = useState(true);

    useEffect(() => {

        if (!logs) return;

        // extract last status marker
        const matches = logs.match(/__STATUS__:[a-z_]+/g);
        const lastStatus = matches ? matches[matches.length - 1] : null;

        /* ---------- EARLY BOOT STAGES ---------- */

        if (logs.includes("📁 Mounting project files")) {
            setCurrentStep((s) => Math.max(s, 2));
        }

        if (logs.includes("⚡ Starting dev server")) {
            setCurrentStep((s) => Math.max(s, 3));
        }

        /* ---------- SHELL ---------- */

        if (lastStatus === "__STATUS__:starting_shell") {
            setCurrentStep((s) => Math.max(s, 4));
        }

        /* ---------- INSTALLING ---------- */

        if (lastStatus === "__STATUS__:installing_deps") {
            setCurrentStep((s) => Math.max(s, 5));
        }

        /* ---------- SERVER READY ---------- */

        if (
            lastStatus === "__STATUS__:server_ready" ||
            logs.includes("ready in")
        ) {

            setCurrentStep((s) => Math.max(s, 6));

            // show final step briefly
            setTimeout(() => {
                setShowLoader(false);
            }, 1200);
        }

    }, [logs]);

    const openExternal = () => {
        window.open("/preview", "_blank");
    };

    return (
        <div
            style={{
                height: "100%",
                background: "#020617",
                position: "relative"
            }}
        >

            {previewUrl && (
                <button
                    onClick={openExternal}
                    style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        zIndex: 5,
                        padding: "6px 10px",
                        border: "1px solid #1e293b",
                        background: "#020617",
                        color: "#e2e8f0",
                        cursor: "pointer"
                    }}
                >
                    Open ↗
                </button>
            )}

            {showLoader ? (

                <div
                    style={{
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    <Loder step={currentStep} />
                </div>

            ) : (

                <iframe
                    src={previewUrl}
                    title="preview"
                    style={{
                        width: "100%",
                        height: "100%",
                        border: "none",
                        background: "white"
                    }}
                />

            )}

        </div>
    );
}
import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import Loder from "../../common/Loder";

export default function Preview({ previewUrl, logs }) {

    const [currentStep, setCurrentStep] = useState(1);
    const [showLoader, setShowLoader] = useState(true);

    useEffect(() => {

        if (!logs) return;

        const matches = logs.match(/__STATUS__:[a-z_]+/g);
        const lastStatus = matches ? matches[matches.length - 1] : null;

        if (logs.includes("📁 Mounting project files")) {
            setCurrentStep((s) => Math.max(s, 2));
        }

        if (logs.includes("⚡ Starting dev server")) {
            setCurrentStep((s) => Math.max(s, 3));
        }

        if (lastStatus === "__STATUS__:starting_shell") {
            setCurrentStep((s) => Math.max(s, 4));
        }

        if (lastStatus === "__STATUS__:installing_deps") {
            setCurrentStep((s) => Math.max(s, 5));
        }

        if (
            lastStatus === "__STATUS__:server_ready" ||
            logs.includes("ready in")
        ) {
            setCurrentStep((s) => Math.max(s, 6));

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
                background: "#1e1e1e",
                display: "flex",
                flexDirection: "column"
            }}
        >

            {/* ✅ HEADER */}
            <div
                style={{
                    height: 30, // 🔥 reduced
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 8px",
                    borderBottom: "1px solid #535252",
                    background: "#1e1e1e",
                    flexShrink: 0
                }}
            >
                {/* Left */}
                <span style={{ fontSize: 12, color: "#9ca3af" }}>
                    Preview
                </span>

                {/* Right */}
                {previewUrl && (
                    <button
                        onClick={openExternal}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 26,
                            height: 22,
                            border: "1px solid #2d2d2d",
                            background: "#252526",
                            color: "#e5e7eb",
                            cursor: "pointer",
                            borderRadius: 4,
                            transition: "all 0.15s ease"
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#2d2d2d";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "#252526";
                        }}
                    >
                        <ExternalLink size={16} color="#38bdf8"/>
                    </button>
                )}
            </div>

            {/* ✅ CONTENT */}
            <div style={{ flex: 1, position: "relative" }}>
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
                            background: "#1e1e1e"
                        }}
                    />

                )}
            </div>

        </div>
    );
}
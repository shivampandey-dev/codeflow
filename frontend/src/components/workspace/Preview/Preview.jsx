import { useEffect, useState, useRef, useCallback } from "react";
import { ExternalLink } from "lucide-react";
import Loder from "../../common/Loder";

export default function Preview({ previewUrl, logs }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [showLoader, setShowLoader] = useState(true);

    const iframeRef = useRef(null);
    const serverReadyCountRef = useRef(0);
    const restartCountRef = useRef(0);
    const loaderHiddenRef = useRef(false);
    const pollTimerRef = useRef(null);   // ← track polling so we can cancel it

    // ── Poll until server responds, THEN reload iframe ──────────────────────
    const reloadWhenReady = useCallback(() => {
        // Cancel any in-flight poll
        if (pollTimerRef.current) clearTimeout(pollTimerRef.current);

        const attempt = () => {
            fetch(previewUrl, { method: "HEAD", cache: "no-store" })
                .then((res) => {
                    if (res.ok || res.status < 500) {
                        // Server is up — reload without blanking
                        if (iframeRef.current) {
                            iframeRef.current.src = previewUrl;
                        }
                    } else {
                        pollTimerRef.current = setTimeout(attempt, 300);
                    }
                })
                .catch(() => {
                    // Still starting — try again shortly
                    pollTimerRef.current = setTimeout(attempt, 300);
                });
        };

        attempt();
    }, [previewUrl]);

    useEffect(() => {
        // Cleanup polling on unmount
        return () => {
            if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
        };
    }, []);

    useEffect(() => {
        if (!logs) return;

        const matches = logs.match(/__STATUS__:[a-z_]+/g);
        const lastStatus = matches ? matches[matches.length - 1] : null;

        // RESET when new workspace starts
        if (lastStatus === "__STATUS__:preparing_workspace" && loaderHiddenRef.current) {
            setCurrentStep(1);
            setShowLoader(true);
            serverReadyCountRef.current = 0;
            restartCountRef.current = 0;
            loaderHiddenRef.current = false;
            return;
        }

        // Step progression
        if (logs.includes("📁 Mounting project files")) setCurrentStep((s) => Math.max(s, 2));
        if (logs.includes("⚡ Starting dev server")) setCurrentStep((s) => Math.max(s, 3));
        if (lastStatus === "__STATUS__:starting_shell") setCurrentStep((s) => Math.max(s, 4));
        if (
            lastStatus === "__STATUS__:installing_deps" ||
            lastStatus === "__STATUS__:preparing_workspace" ||
            lastStatus === "__STATUS__:starting_server"
        ) setCurrentStep((s) => Math.max(s, 5));

        const serverReadyCount = (
            logs.match(/__STATUS__:(server_ready|starting_server)/g) || []
        ).length;

        const restartCount = (logs.match(/Restarting 'server\.js'/g) || []).length;

        // Reset if logs shrink (new session)
        if (serverReadyCount < serverReadyCountRef.current) {
            serverReadyCountRef.current = 0;
            restartCountRef.current = 0;
            loaderHiddenRef.current = false;
            setShowLoader(true);
            setCurrentStep(1);
        }

        // Server came up OR restarted
        if (
            (serverReadyCount > serverReadyCountRef.current && !loaderHiddenRef.current) ||
            restartCount > restartCountRef.current
        ) {
            serverReadyCountRef.current = serverReadyCount;
            restartCountRef.current = restartCount;
            setCurrentStep(6);

            if (!loaderHiddenRef.current) {
                loaderHiddenRef.current = true;
                setTimeout(() => setShowLoader(false), 800);
            }

            // ✅ Poll instead of blank-then-reload
            reloadWhenReady();
        }
    }, [logs, previewUrl, reloadWhenReady]);

    return (
        <div style={{ height: "100%", background: "#1e1e1e", display: "flex", flexDirection: "column" }}>
            {/* Header */}
            <div style={{
                height: 30, display: "flex", alignItems: "center",
                justifyContent: "space-between", padding: "0 8px",
                borderBottom: "1px solid #535252", background: "#1e1e1e", flexShrink: 0,
            }}>
                <span style={{ fontSize: 12, color: "#9ca3af" }}>Preview</span>
                {previewUrl && (
                    <button
                        onClick={() => window.open("/preview", "_blank")}
                        style={{
                            display: "flex", alignItems: "center", justifyContent: "center",
                            width: 26, height: 22, border: "1px solid #2d2d2d",
                            background: "#252526", color: "#e5e7eb", cursor: "pointer",
                            borderRadius: 4, transition: "all 0.15s ease",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "#2d2d2d"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "#252526"}
                    >
                        <ExternalLink size={16} color="#38bdf8" />
                    </button>
                )}
            </div>

            {/* Body */}
            <div style={{ flex: 1, position: "relative" }}>
                {showLoader ? (
                    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Loder step={currentStep} />
                    </div>
                ) : (
                    <iframe
                        ref={iframeRef}
                        src={previewUrl}
                        title="preview"
                        style={{ width: "100%", height: "100%", border: "none", background: "#1e1e1e" }}
                    />
                )}
            </div>
        </div>
    );
}
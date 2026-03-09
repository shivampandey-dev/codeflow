export default function Preview({ previewUrl }) {

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

            {!previewUrl ? (
                <div
                    style={{
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#94a3b8"
                    }}
                >
                    Starting Dev Server...
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
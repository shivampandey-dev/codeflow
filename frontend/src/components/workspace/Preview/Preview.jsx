export default function Preview({ previewUrl }) {
    return (
        <div
            style={{
                height: "100%",
                background: "#020617",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#94a3b8",
            }}
        >
            {!previewUrl ? (
                "Starting Dev Server..."
            ) : (
                <iframe
                    src={previewUrl}
                    title="preview"
                    style={{
                        width: "100%",
                        height: "100%",
                        border: "none",
                        background: "white",
                    }}
                />
            )}
        </div>
    );
}
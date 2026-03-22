import { Box, Text, Button, Group, Loader } from "@mantine/core";
import { IconUpload, IconFolderOpen, IconFileZip } from "@tabler/icons-react";
import { useRef, useState } from "react";

export default function UploadDropzone({ onUpload }) {
    const [drag, setDrag] = useState(false);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(""); // status message

    const handleZipInput = async (files) => {
        if (!files?.length) return;
        const zipFile = Array.from(files).find((f) => f.name.endsWith(".zip"));
        if (!zipFile) return;
        setLoading(true);
        setStatus("Extracting ZIP...");
        await onUpload?.({ type: "zip", file: zipFile });
        setLoading(false);
        setStatus("");
    };

    const handleFolderInput = async (files) => {
        if (!files?.length) return;
        setLoading(true);
        setStatus("Reading folder...");
        await onUpload?.({ type: "folder", files: Array.from(files) });
        setLoading(false);
        setStatus("");
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        setDrag(false);
        const files = Array.from(e.dataTransfer.files || []);
        const zipFile = files.find((f) => f.name.endsWith(".zip"));
        if (zipFile) {
            setLoading(true);
            setStatus("Extracting ZIP...");
            await onUpload?.({ type: "zip", file: zipFile });
        } else if (files.length > 0) {
            setLoading(true);
            setStatus("Reading folder...");
            await onUpload?.({ type: "folder", files });
        }
        setLoading(false);
        setStatus("");
    };

    return (
        <Box
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={handleDrop}
            style={{
                border: drag
                    ? "1px solid rgba(99,102,241,0.7)"
                    : "1px dashed rgba(255,255,255,0.2)",
                borderRadius: 14,
                padding: 30,
                textAlign: "center",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.8 : 1,
                transition: "all 0.2s ease",
            }}
        >
            {loading ? (
                /* ── LOADING STATE ── */
                <Box
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 14,
                        padding: "10px 0",
                    }}
                >
                    <Loader size="md" color="indigo" />
                    <Text c="#e2e8f0" size="sm">
                        {status}
                    </Text>
                    <Text c="#94a3b8" size="xs">
                        Skipping node_modules and binaries...
                    </Text>
                </Box>
            ) : (
                /* ── DEFAULT STATE ── */
                <>
                    <IconUpload size={40} style={{ marginBottom: 10, color: "#94a3b8" }} />
                    <Text mb={10} c="#e2e8f0">
                        Drag & Drop your project here
                    </Text>
                    <Text size="sm" c="#94a3b8" mb={20}>
                        Supports ZIP file or folder upload
                    </Text>

                    <Group justify="center" gap={12}>
                        {/* ── ZIP — label trick fixes popup block ── */}
                        <label htmlFor="zip-upload" style={{ display: "inline-block" }}>
                            <Box
                                component="span"
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 8,
                                    padding: "8px 18px",
                                    borderRadius: 8,
                                    border: "1px solid rgba(99,102,241,0.6)",
                                    color: "#a5b4fc",
                                    fontSize: 14,
                                    fontWeight: 500,
                                    cursor: "pointer",
                                    transition: "all 0.2s ease",
                                }}
                            >
                                <IconFileZip size={16} />
                                Upload ZIP
                            </Box>
                        </label>
                        <input
                            id="zip-upload"
                            type="file"
                            accept=".zip"
                            style={{ display: "none" }}
                            onChange={(e) => handleZipInput(e.target.files)}
                        />

                        {/* ── FOLDER — label trick fixes popup block ── */}
                        <label htmlFor="folder-upload" style={{ display: "inline-block" }}>
                            <Box
                                component="span"
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 8,
                                    padding: "8px 18px",
                                    borderRadius: 8,
                                    background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                                    color: "#fff",
                                    fontSize: 14,
                                    fontWeight: 500,
                                    cursor: "pointer",
                                    transition: "all 0.2s ease",
                                }}
                            >
                                <IconFolderOpen size={16} />
                                Upload Folder
                            </Box>
                        </label>
                        <input
                            id="folder-upload"
                            type="file"
                            webkitdirectory="true"
                            mozdirectory="true"
                            style={{ display: "none" }}
                            onChange={(e) => handleFolderInput(e.target.files)}
                        />
                    </Group>
                </>
            )}
        </Box>
    );
}
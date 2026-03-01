import { Box, Text, Button } from "@mantine/core";
import { IconUpload } from "@tabler/icons-react";
import { useRef, useState } from "react";

export default function UploadDropzone({ onUpload }) {
    const inputRef = useRef();
    const [drag, setDrag] = useState(false);

    const handleFiles = (files) => {
        if (!files?.length) return;
        onUpload?.(files);
    };

    return (
        <Box
            onDragOver={(e) => {
                e.preventDefault();
                setDrag(true);
            }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => {
                e.preventDefault();
                setDrag(false);
                handleFiles(e.dataTransfer.files);
            }}
            style={{
                border: drag
                    ? "1px solid rgba(99,102,241,0.7)"
                    : "1px dashed rgba(255,255,255,0.2)",

                borderRadius: 14,
                padding: 30,
                textAlign: "center",
                cursor: "pointer",
            }}
        >
            <IconUpload
                size={40}
                style={{ marginBottom: 10 }}
            />

            <Text mb={10} c="#e2e8f0">
                Drag & Drop your project here
            </Text>

            <Text size="sm" c="#94a3b8" mb={16}>
                Supports ZIP or folder upload
            </Text>

            <Button
                onClick={() => inputRef.current.click()}
            >
                Select Files
            </Button>

            <input
                ref={inputRef}
                type="file"
                multiple
                style={{ display: "none" }}
                onChange={(e) =>
                    handleFiles(e.target.files)
                }
            />
        </Box>
    );
}
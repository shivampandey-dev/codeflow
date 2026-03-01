import { Box, Text, ActionIcon } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import UploadDropzone from "./UploadDropzone";

export default function UploadProjectModal({
    opened,
    onClose,
    onUpload,
    layoutId = "upload-project-card",
}) {
    return (
        <AnimatePresence>
            {opened && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.55)",
                        backdropFilter: "blur(10px)",
                        zIndex: 200,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 20,
                    }}
                >
                    {/* MORPH CONTAINER */}
                    <motion.div
                        layoutId={layoutId}
                        transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 26,
                        }}
                        style={{
                            width: "100%",
                            maxWidth: 600,
                            borderRadius: 18,
                            background: "rgba(15,23,42,0.9)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            boxShadow:
                                "0 40px 120px rgba(0,0,0,0.8)",
                            position: "relative",
                            padding: 28,
                        }}
                    >
                        {/* Close */}
                        <ActionIcon
                            onClick={onClose}
                            variant="subtle"
                            size="lg"
                            style={{
                                position: "absolute",
                                top: 12,
                                right: 12,
                                color: "#94a3b8",
                            }}
                        >
                            <IconX size={20} />
                        </ActionIcon>

                        {/* Header */}
                        <Box mb={20}>
                            <Text
                                style={{
                                    fontSize: 22,
                                    fontWeight: 700,
                                    color: "#e2e8f0",
                                }}
                            >
                                Upload Project
                            </Text>

                            <Text
                                style={{
                                    color: "#94a3b8",
                                    fontSize: 14,
                                }}
                            >
                                Upload a ZIP file or select a folder
                            </Text>
                        </Box>

                        {/* Dropzone */}
                        <UploadDropzone onUpload={onUpload} />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
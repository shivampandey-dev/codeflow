import { Box, Text } from "@mantine/core";
import { IconBolt, IconUpload } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { bootWebContainer } from "../../pages/runtime/webcontainer/webcontainer";
import CreateProjectModal from "../project/CreateProjectModal/CreateProjectModal";
import UploadProjectModal from "../project/UploadProjectModal/UploadProjectModal";
import { folderFilesToTree, zipFileToTree } from "../project/UploadProjectModal/fileUtils";
import { setUploadedTree } from "../../store/uploadStore";

export default function CTAButtons() {
    const ref = useRef(null);
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);
    const [openCreate, setOpenCreate] = useState(false);
    const [openUpload, setOpenUpload] = useState(false);

    const isBelow720 = useMediaQuery("(max-width: 720px)");
    const isBelow450 = useMediaQuery("(max-width: 450px)");
    const columns = isBelow720 ? 1 : 2;

    /* ================= REVEAL ================= */
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setVisible(true);
            },
            { threshold: 0.25 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    /* ================= UPLOAD HANDLER ================= */
    const handleUpload = async ({ type, file, files }) => {
        // Boot WebContainer early so it's ready by the time workspace loads
        let wc;
        try {
            wc = await bootWebContainer();
        } catch (err) {
            console.error("Failed to boot WebContainer:", err);
            alert("Failed to initialize editor environment. Please refresh.");
            return;
        }

        // Parse upload into WebContainer file tree
        let result;
        try {
            if (type === "zip") {
                result = await zipFileToTree(file);
            } else if (type === "folder") {
                result = await folderFilesToTree(files);
            }
        } catch (err) {
            console.error("Failed to parse upload:", err);
            alert("Failed to read the uploaded files. Please try again.");
            return;
        }

        const { tree, warnings, hasPackageJson } = result;

        if (warnings.length) {
            console.warn("Skipped files:\n", warnings.join("\n"));
        }

        if (!hasPackageJson) {
            alert("No package.json found. Please upload a valid Node.js project.");
            return;
        }

        // Mount files into the already-booted WebContainer
        await wc.mount(tree);

        // Save tree to store so Workspace can access it
        setUploadedTree(tree);

        setOpenUpload(false);

        // Navigate to workspace — Workspace.jsx will detect templateId === "uploaded"
        navigate("/workspace/uploaded");
    };

    return (
        <>
            <Box
                ref={ref}
                style={{
                    width: "100%",
                    maxWidth: 1100,
                    margin: "0 auto",
                    paddingInline: "clamp(16px, 5vw, 48px)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    opacity: visible ? 1 : 0,
                    transform: visible
                        ? "translate3d(0,0,0)"
                        : "translate3d(0,40px,0)",
                    transition:
                        "opacity 0.8s ease, transform 0.8s cubic-bezier(.16,1,.3,1)",
                    marginBottom: isBelow450 ? 10 : 20,
                }}
            >
                {/* TEXT */}
                <Box
                    style={{
                        textAlign: "center",
                        maxWidth: 820,
                        marginBottom: "clamp(24px, 5vw, 48px)",
                    }}
                >
                    <Text
                        style={{
                            fontSize: "clamp(26px, 6vw, 64px)",
                            fontWeight: 700,
                            lineHeight: 1.2,
                            color: "#e2e8f0",
                        }}
                    >
                        Faster and more{" "}
                        <span className="gradient-text">secure</span>
                        <br />
                        than local.
                    </Text>

                    <Text
                        mt={16}
                        style={{
                            color: "#94a3b8",
                            fontSize: "clamp(14px, 2.8vw, 18px)",
                            maxWidth: 560,
                            margin: "0 auto",
                        }}
                    >
                        Codeflow runs your full development environment directly in
                        the browser using isolated containers.
                    </Text>
                </Box>

                {/* CARDS */}
                <Box
                    style={{
                        width: "100%",
                        maxWidth: 900,
                        paddingInline: 16,
                        display: "grid",
                        gridTemplateColumns: isBelow720
                            ? "1fr"
                            : `repeat(${columns}, minmax(0, 1fr))`,
                        gap: isBelow720 ? 16 : 24,
                    }}
                >
                    {/* CREATE PROJECT CARD */}
                    <motion.div
                        layoutId="create-project-card"
                        onClick={() => setOpenCreate(true)}
                    >
                        <GlassCard
                            icon={<IconBolt size={22} />}
                            title="Start with a Template"
                            desc="Choose from React, Node.js and more."
                            button="New Project"
                            gradient="linear-gradient(135deg,#14b8a6,#0ea5e9)"
                        />
                    </motion.div>

                    {/* UPLOAD PROJECT CARD */}
                    <motion.div
                        layoutId="upload-project-card"
                        onClick={() => setOpenUpload(true)}
                    >
                        <GlassCard
                            icon={<IconUpload size={22} />}
                            title="Upload Your Project"
                            desc="Open any local folder or ZIP archive."
                            button="Upload Folder"
                            gradient="linear-gradient(135deg,#6366f1,#8b5cf6)"
                        />
                    </motion.div>
                </Box>
            </Box>

            {/* CREATE MODAL */}
            <CreateProjectModal
                opened={openCreate}
                onClose={() => setOpenCreate(false)}
                layoutId="create-project-card"
            />

            {/* UPLOAD MODAL */}
            <UploadProjectModal
                opened={openUpload}
                onClose={() => setOpenUpload(false)}
                onUpload={handleUpload}
                layoutId="upload-project-card"
            />
        </>
    );
}

/* ================= CARD ================= */
function GlassCard({ icon, title, desc, button, gradient }) {
    const isMobile = useMediaQuery("(max-width: 720px)");
    const [hovered, setHovered] = useState(false);

    return (
        <Box
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                width: "100%",
                padding: "clamp(16px, 4vw, 22px)",
                borderRadius: 18,
                cursor: "pointer",
                background: "rgba(15, 23, 42, 0.55)",
                backdropFilter: isMobile ? "blur(8px)" : "blur(14px)",
                border: hovered
                    ? "1px solid rgba(99,102,241,0.6)"
                    : "1px solid rgba(255,255,255,0.08)",
                boxShadow: hovered
                    ? `0 0 60px rgba(99,102,241,0.35), 0 25px 80px rgba(0,0,0,0.7)`
                    : `0 0 40px rgba(59,130,246,0.12), 0 20px 60px rgba(0,0,0,0.6)`,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: 200,
                transform: hovered
                    ? "translateY(-6px) scale(1.02)"
                    : "translateY(0px) scale(1)",
                transition: "all 0.35s cubic-bezier(.16,1,.3,1)",
            }}
        >
            <Box
                style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "#fff",
                    marginBottom: 14,
                    transform: hovered ? "scale(1.15)" : "scale(1)",
                    transition: "transform 0.3s ease",
                }}
            >
                {icon}
            </Box>

            <Text style={{ color: "#e2e8f0", fontSize: 18, fontWeight: 600 }}>
                {title}
            </Text>

            <Text style={{ color: "#94a3b8", fontSize: 13, marginTop: 6, marginBottom: 18 }}>
                {desc}
            </Text>

            <Box
                style={{
                    minHeight: 42,
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: gradient,
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: 14,
                }}
            >
                {button}
            </Box>
        </Box>
    );
}
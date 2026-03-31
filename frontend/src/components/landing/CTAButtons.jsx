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

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setVisible(true); },
            { threshold: 0.25 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    const handleUpload = async ({ type, file, files }) => {
        let wc; 
        try {
            wc = await bootWebContainer();
        } catch (err) {
            alert("Failed to initialize editor environment. Please refresh.");
            return;
        }
        let result;
        try {
            if (type === "zip") result = await zipFileToTree(file);
            else if (type === "folder") result = await folderFilesToTree(files);
        } catch (err) {
            alert("Failed to read the uploaded files. Please try again.");
            return;
        }
        const { tree, warnings, hasPackageJson } = result;
        if (warnings.length) console.warn("Skipped files:\n", warnings.join("\n"));
        if (!hasPackageJson) {
            alert("No package.json found. Please upload a valid Node.js project.");
            return;
        }
        setUploadedTree(tree);
        await wc.mount(tree);
        setOpenUpload(false);
        window.uploadedTree = tree;
        window.open("/workspace/uploaded", "_blank");
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
                    paddingTop: "clamp(40px, 8vh, 80px)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",   /* ← keeps all children centered */
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translate3d(0,0,0)" : "translate3d(0,40px,0)",
                    transition: "opacity 0.8s ease, transform 0.8s cubic-bezier(.16,1,.3,1)",
                    marginBottom: isBelow450 ? 10 : 20,
                }}
            >
                {/* ── HEADLINE ── */}
                <Box style={{ textAlign: "center", maxWidth: 760, marginBottom: "clamp(24px, 5vw, 48px)" }}>
                    <Text
                        style={{
                            fontSize: 12, fontWeight: 600,
                            letterSpacing: "0.14em", textTransform: "uppercase",
                            color: "#38bdf8", marginBottom: 12, opacity: 0.85,
                        }}
                    >
                        Start in seconds — no signup needed
                    </Text>

                    <Text
                        style={{
                            fontSize: "clamp(28px, 5.5vw, 56px)",
                            fontWeight: 800, lineHeight: 1.15,
                            color: "#e2e8f0", letterSpacing: "-0.02em",
                        }}
                    >
                        Your browser is your{" "}
                        <span className="gradient-text">dev environment.</span>
                    </Text>

                    <Text
                        style={{
                            color: "#7a8fa8",
                            fontSize: "clamp(14px, 2.4vw, 17px)",
                            maxWidth: 520, margin: "16px auto 0", lineHeight: 1.7,
                        }}
                    >
                        Pick a template or drop in your existing project.
                        Codeflow runs it instantly — fully isolated, completely private.
                    </Text>
                </Box>

                {/* ── ACTION CARDS ── */}
                <Box
                    style={{
                        width: "100%",
                        maxWidth: 860,
                        paddingInline: 16,
                        display: "grid",
                        gridTemplateColumns: isBelow720 ? "1fr" : "repeat(2, minmax(0, 1fr))",
                        gap: isBelow720 ? 16 : 24,
                    }}
                >
                    <motion.div layoutId="create-project-card" onClick={() => setOpenCreate(true)}>
                        <GlassCard
                            icon={<IconBolt size={22} />}
                            title="Start from a Template"
                            desc="React, Node.js, Vanilla JS and more — ready to code in one click."
                            button="New Project"
                            gradient="linear-gradient(135deg, #0ea5e9, #14b8a6)"
                        />
                    </motion.div>

                    <motion.div layoutId="upload-project-card" onClick={() => setOpenUpload(true)}>
                        <GlassCard
                            icon={<IconUpload size={22} />}
                            title="Bring Your Own Project"
                            desc="Drag in a folder or ZIP archive — your files open instantly."
                            button="Upload Project"
                            gradient="linear-gradient(135deg, #6366f1, #8b5cf6)"
                        />
                    </motion.div>
                </Box>

                {/*
                 * ── TRUST LINE ──
                 * FIX: was left-aligned on mobile because the parent flexbox
                 * shrink-wrapped it. Now it has explicit width + textAlign.
                 * "100 %" typo (space before %) also removed.
                 */}

            </Box>

            <CreateProjectModal
                opened={openCreate}
                onClose={() => setOpenCreate(false)}
                layoutId="create-project-card"
            />
            <UploadProjectModal
                opened={openUpload}
                onClose={() => setOpenUpload(false)}
                onUpload={handleUpload}
                layoutId="upload-project-card"
            />
        </>
    );
}

/* ── GLASS CARD ── */
function GlassCard({ icon, title, desc, button, gradient }) {
    const isMobile = useMediaQuery("(max-width: 720px)");
    const [hovered, setHovered] = useState(false);

    return (
        <Box
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                width: "100%",
                padding: "clamp(20px, 4vw, 26px)",
                borderRadius: 18,
                cursor: "pointer",
                background: "rgba(15, 23, 42, 0.55)",
                backdropFilter: isMobile ? "blur(8px)" : "blur(14px)",
                border: hovered
                    ? "1px solid rgba(99,102,241,0.55)"
                    : "1px solid rgba(255,255,255,0.07)",
                boxShadow: hovered
                    ? "0 0 60px rgba(99,102,241,0.30), 0 25px 80px rgba(0,0,0,0.7)"
                    : "0 0 30px rgba(59,130,246,0.08), 0 20px 60px rgba(0,0,0,0.5)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: 210,
                transform: hovered ? "translateY(-6px) scale(1.015)" : "translateY(0px) scale(1)",
                transition: "all 0.35s cubic-bezier(.16,1,.3,1)",
            }}
        >
            <Box
                style={{
                    width: 46, height: 46, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    color: "#fff", marginBottom: 16,
                    transform: hovered ? "scale(1.12)" : "scale(1)",
                    transition: "transform 0.3s ease",
                }}
            >
                {icon}
            </Box>

            <Text style={{ color: "#e2e8f0", fontSize: 18, fontWeight: 700, letterSpacing: "-0.01em" }}>
                {title}
            </Text>
            <Text style={{ color: "#7a8fa8", fontSize: 13.5, marginTop: 8, marginBottom: 20, lineHeight: 1.6 }}>
                {desc}
            </Text>

            <Box
                style={{
                    minHeight: 44, borderRadius: 10,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: gradient, color: "#fff",
                    fontWeight: 600, fontSize: 14, letterSpacing: "0.02em",
                    boxShadow: hovered ? "0 6px 24px rgba(0,0,0,0.35)" : "none",
                    transition: "box-shadow 0.3s ease",
                }}
            >
                {button}
            </Box>
        </Box>
    );
}
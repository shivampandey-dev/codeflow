import { Box, Text } from "@mantine/core";
import { motion } from "framer-motion";
import {
    Globe,
    Cpu,
    Boxes,
    Terminal,
    Package,
    Server,
    Atom,
    Layers,
    Database,
    Code,
} from "lucide-react";

/* ================= ICON BOX ================= */

function IconBox({ Icon, glow }) {
    return (
        <Box
            style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                background: "rgba(15,23,42,0.6)",
                border: "1px solid rgba(255,255,255,0.12)",
                backdropFilter: "blur(10px)",

                boxShadow: `0 0 25px ${glow}55`,
            }}
        >
            <Icon size={20} color={glow} />
        </Box>
    );
}

/* ================= ICON CLUSTER VARIANTS ================= */

function IconCluster({ icons, variant = "cluster", glow }) {
    if (variant === "orbit") {
        return (
            <Box style={{ position: "relative", width: 80, height: 80 }}>
                {icons.map((Icon, i) => (
                    <motion.div
                        key={i}
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 18 + i * 4,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        style={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Box
                            style={{
                                transform: `translate(${28 + i * 6}px)`,
                            }}
                        >
                            <IconBox Icon={Icon} glow={glow} />
                        </Box>
                    </motion.div>
                ))}
            </Box>
        );
    }

    if (variant === "stack") {
        return (
            <Box style={{ position: "relative", width: 80, height: 80 }}>
                {icons.map((Icon, i) => (
                    <Box
                        key={i}
                        style={{
                            position: "absolute",
                            top: i * 6,
                            left: i * 6,
                            opacity: 1 - i * 0.2,
                        }}
                    >
                        <IconBox Icon={Icon} glow={glow} />
                    </Box>
                ))}
            </Box>
        );
    }

    if (variant === "vertical") {
        return (
            <Box
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    height: 80,
                    justifyContent: "center",
                }}
            >
                {icons.map((Icon, i) => (
                    <IconBox key={i} Icon={Icon} glow={glow} />
                ))}
            </Box>
        );
    }

    // default cluster
    return (
        <Box style={{ position: "relative", width: 80, height: 80 }}>
            {icons.map((Icon, i) => (
                <motion.div
                    key={i}
                    animate={{ y: [0, -5, 0] }}
                    transition={{
                        duration: 3 + i,
                        repeat: Infinity,
                    }}
                    style={{
                        position: "absolute",
                        top: `${18 + i * 12}%`,
                        left: `${18 + i * 12}%`,
                    }}
                >
                    <IconBox Icon={Icon} glow={glow} />
                </motion.div>
            ))}
        </Box>
    );
}

/* ================= DATA ================= */

const cards = [
    {
        title: "Browser-native runtime",
        desc: "Runs directly on your device with zero latency — no remote servers.",
        icons: [Globe, Cpu, Boxes],
        variant: "orbit",
        glow: "#6366f1",
    },
    {
        title: "Full dev environment",
        desc: "Terminal, packages, and servers running instantly inside containers.",
        icons: [Terminal, Package, Server],
        variant: "stack",
        glow: "#22c55e",
    },
    {
        title: "All modern frameworks",
        desc: "Start React, Node.js, and other modern frameworks instantly — no configuration, just code.",
        icons: [Atom, Layers, Boxes],
        variant: "cluster",
        glow: "#a855f7",
    },
    {
        title: "Multi-language ready",
        desc: "Future support for Python and WebAssembly runtimes in your browser.",
        icons: [Cpu, Database, Code],
        variant: "vertical",
        glow: "#f97316",
    },
];

/* ================= MAIN COMPONENT ================= */

export default function CodeflowFeatureCards() {
    return (
        <Box
            style={{
                width: "100%",
                maxWidth: 1300,
                margin: "70px auto",
                padding: "0 20px",
            }}
        >
            <Box
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(260px, 1fr))",
                    gap: 24,
                }}
            >
                {cards.map((card, i) => (
                    <motion.div
                        key={card.title}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{
                            opacity: 1,
                            y: 0,
                        }}
                        viewport={{ once: true }}
                        transition={{
                            duration: 0.45,
                            delay: i * 0.08,
                        }}
                        whileHover={{
                            y: -6,
                            scale: 1.02,
                        }}
                    >
                        <Box
                            style={{
                                padding: 24,
                                borderRadius: 18,
                                minHeight: 200,

                                background: `linear-gradient(
                                    135deg,
                                    #020617,
                                    #020617 60%,
                                    ${card.glow}22
                                )`,

                                border:
                                    "1px solid rgba(255,255,255,0.06)",

                                boxShadow:
                                    "0 20px 50px rgba(0,0,0,0.6)",

                                position: "relative",
                                overflow: "hidden",
                            }}
                        >
                            {/* radial glow */}
                            <Box
                                style={{
                                    position: "absolute",
                                    inset: 0,
                                    background: `radial-gradient(circle at 20% 20%, ${card.glow}22, transparent 60%)`,
                                    pointerEvents: "none",
                                }}
                            />

                            <IconCluster
                                icons={card.icons}
                                variant={card.variant}
                                glow={card.glow}
                            />

                            <Text
                                style={{
                                    fontSize: 17,
                                    fontWeight: 600,
                                    color: "#e2e8f0",
                                    marginBottom: 8,
                                }}
                            >
                                {card.title}
                            </Text>

                            <Text
                                style={{
                                    color: "#94a3b8",
                                    fontSize: 13.5,
                                    lineHeight: 1.6,
                                }}
                            >
                                {card.desc}
                            </Text>
                        </Box>
                    </motion.div>
                ))}
            </Box>
        </Box>
    );
}
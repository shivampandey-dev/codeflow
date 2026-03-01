import {
    Box,
    Text,
    TextInput,
    Tooltip,
    Skeleton,
    Badge,
} from "@mantine/core";
import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { templateCategories } from "./templates.data";

export default function TemplateGrid({ onSelect }) {
    const [activeTab, setActiveTab] = useState("frontend");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [recent, setRecent] = useState([]);

    /* ================= FAKE LOADING ================= */

    useEffect(() => {
        const t = setTimeout(() => setLoading(false), 600);
        return () => clearTimeout(t);
    }, []);

    /* ================= ACTIVE CATEGORY ================= */

    const activeCategory = templateCategories.find(
        (c) => c.id === activeTab
    );

    const templates = activeCategory?.templates || [];

    const filtered = useMemo(() => {
        return templates.filter((tpl) =>
            tpl.label
                .toLowerCase()
                .includes(search.toLowerCase())
        );
    }, [templates, search]);

    /* ================= KEYBOARD NAV ================= */

    useEffect(() => {
        const handler = (e) => {
            if (!filtered.length) return;

            if (e.key === "ArrowRight")
                setSelectedIndex(
                    (i) => (i + 1) % filtered.length
                );

            if (e.key === "ArrowLeft")
                setSelectedIndex(
                    (i) =>
                        (i - 1 + filtered.length) %
                        filtered.length
                );

            if (e.key === "Enter")
                handleSelect(filtered[selectedIndex]);
        };

        window.addEventListener("keydown", handler);
        return () =>
            window.removeEventListener(
                "keydown",
                handler
            );
    }, [filtered, selectedIndex]);

    /* ================= SELECT ================= */

    const handleSelect = (tpl) => {
        onSelect?.(tpl);

        setRecent((prev) => {
            const updated = [
                tpl,
                ...prev.filter((p) => p.id !== tpl.id),
            ];
            return updated.slice(0, 4);
        });
    };

    /* ================= RENDER ================= */

    return (
        <Box>
            {/* TABS */}
            <Box
                style={{
                    display: "flex",
                    gap: 8,
                    marginBottom: 18,
                    flexWrap: "wrap",
                }}
            >
                {templateCategories.map((cat) => (
                    <Box
                        key={cat.id}
                        onClick={() =>
                            setActiveTab(cat.id)
                        }
                        style={{
                            padding: "8px 14px",
                            borderRadius: 10,
                            cursor: "pointer",
                            fontSize: 13,
                            fontWeight: 600,

                            background:
                                activeTab === cat.id
                                    ? "rgba(99,102,241,0.2)"
                                    : "rgba(255,255,255,0.04)",

                            border:
                                activeTab === cat.id
                                    ? "1px solid rgba(99,102,241,0.5)"
                                    : "1px solid rgba(255,255,255,0.08)",

                            color:
                                activeTab === cat.id
                                    ? "#e2e8f0"
                                    : "#94a3b8",
                        }}
                    >
                        {cat.title}
                    </Box>
                ))}
            </Box>

            {/* SEARCH */}
            <TextInput
                value={search}
                onChange={(e) =>
                    setSearch(e.target.value)
                }
                placeholder="Search templates..."
                leftSection={<Search size={16} />}
                mb={20}
            />

            {/* RECENT */}
            {recent.length > 0 && (
                <Box mb={20}>
                    <Text
                        size="sm"
                        mb={6}
                        c="#94a3b8"
                    >
                        Recently Used
                    </Text>

                    <Box
                        style={{
                            display: "flex",
                            gap: 10,
                            flexWrap: "wrap",
                        }}
                    >
                        {recent.map((tpl) => (
                            <Badge
                                key={tpl.id}
                                variant="light"
                                style={{
                                    cursor: "pointer",
                                }}
                                onClick={() =>
                                    handleSelect(tpl)
                                }
                            >
                                {tpl.label}
                            </Badge>
                        ))}
                    </Box>
                </Box>
            )}

            {/* GRID */}
            <Box
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(140px, 1fr))",
                    gap: 16,
                }}
            >
                {loading
                    ? Array.from({ length: 6 }).map(
                        (_, i) => (
                            <Skeleton
                                key={i}
                                height={110}
                                radius={14}
                            />
                        )
                    )
                    : filtered.map((tpl, index) => {
                        const Icon = tpl.icon;
                        const active =
                            index === selectedIndex;

                        return (
                            <Tooltip
                                key={tpl.id}
                                label={
                                    tpl.description
                                }
                                withArrow
                            >
                                <motion.div
                                    whileHover={{
                                        y: -6,
                                        scale: 1.04,
                                    }}
                                >
                                    <Box
                                        onClick={() =>
                                            handleSelect(
                                                tpl
                                            )
                                        }
                                        style={{
                                            padding:
                                                "18px 16px",
                                            borderRadius: 14,
                                            cursor:
                                                "pointer",

                                            background:
                                                active
                                                    ? "rgba(99,102,241,0.18)"
                                                    : "rgba(15,23,42,0.55)",

                                            border:
                                                active
                                                    ? "1px solid rgba(99,102,241,0.6)"
                                                    : "1px solid rgba(255,255,255,0.08)",

                                            backdropFilter:
                                                "blur(14px)",

                                            display:
                                                "flex",
                                            flexDirection:
                                                "column",
                                            alignItems:
                                                "center",
                                            justifyContent:
                                                "center",
                                            gap: 10,
                                            textAlign:
                                                "center",
                                            position:
                                                "relative",
                                        }}
                                    >
                                        {/* Recommended */}
                                        {tpl.recommended && (
                                            <Badge
                                                size="xs"
                                                style={{
                                                    position:
                                                        "absolute",
                                                    top: 8,
                                                    right: 8,
                                                }}
                                            >
                                                ⭐
                                            </Badge>
                                        )}

                                        <Icon
                                            size={28}
                                            color={
                                                tpl.color
                                            }
                                        />

                                        <Text
                                            size="sm"
                                            fw={600}
                                            c="#e2e8f0"
                                        >
                                            {
                                                tpl.label
                                            }
                                        </Text>
                                    </Box>
                                </motion.div>
                            </Tooltip>
                        );
                    })}
            </Box>
        </Box>
    );
}
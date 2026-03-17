import { Group, Text, ActionIcon } from "@mantine/core"
import { X } from "lucide-react"
import { useState } from "react"

import { useEditorStore } from "../../../store/editorStore"
import { resolveIcon } from "../FileTree/iconResolver"

import { useSettingsStore } from "../../../store/settingsStore"
import { deriveUIColors } from "../../../utils/themeColors"

export default function Tabs() {

    const {
        tabs,
        activeFile,
        closeFile,
        openFile,
        dirty,
        reorderTabs
    } = useEditorStore()

    const { themeData } = useSettingsStore()

    const editorBg =
        themeData?.colors?.["editor.background"] || "#1e1e1e"

    const editorFg =
        themeData?.colors?.["editor.foreground"] || "#d4d4d4"

    const ui = deriveUIColors(editorBg)

    const [hovered, setHovered] = useState(null)

    function handleDragStart(e, index) {
        e.dataTransfer.setData("tabIndex", index)
    }

    function handleDrop(e, index) {
        const from = Number(e.dataTransfer.getData("tabIndex"))
        reorderTabs(from, index)
    }

    return (

        <div
            style={{
                borderBottom: `1px solid ${ui.border}`,
                background: ui.sidebarBg,
                overflowX: "auto",
                whiteSpace: "nowrap"
            }}
        >

            <Group gap={0} wrap="nowrap">

                {tabs.map((path, index) => {

                    const name = path.split("/").pop()
                    const active = path === activeFile
                    const icon = resolveIcon(name, "file")
                    const isHovered = hovered === path

                    return (

                        <Group
                            key={path}
                            gap={6}
                            px="sm"

                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => handleDrop(e, index)}

                            onMouseEnter={() => setHovered(path)}
                            onMouseLeave={() => setHovered(null)}

                            onClick={(e) => {
                                if (e.target.closest("button")) return
                                if (!active) openFile(path)
                            }}

                            onAuxClick={(e) => {
                                if (e.button === 1) closeFile(path)
                            }}

                            style={{
                                cursor: "pointer",

                                background:
                                    active
                                        ? editorBg
                                        : isHovered
                                            ? ui.hover
                                            : "transparent",

                                borderRight: `1px solid ${ui.border}`,

                                borderTop:
                                    active
                                        ? "2px solid #007acc"
                                        : "2px solid transparent",

                                minWidth: 120,
                                height: 32,
                                flexShrink: 0,

                                alignItems: "center",

                                transition: "background 0.15s ease"
                            }}
                        >

                            <img
                                src={icon}
                                width={14}
                                height={14}
                            />

                            <Text
                                size="sm"
                                style={{
                                    color: editorFg,
                                    maxWidth: 110,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap"
                                }}
                            >

                                {name}

                                {dirty[path] && (
                                    <span
                                        style={{
                                            marginLeft: 6,
                                            color: "#e2c08d"
                                        }}
                                    >
                                        ●
                                    </span>
                                )}

                            </Text>

                            {(active || isHovered) && (

                                <ActionIcon
                                    size="xs"
                                    variant="subtle"
                                    onMouseDown={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        closeFile(path)
                                    }}
                                >
                                    <X size={12} />
                                </ActionIcon>

                            )}

                        </Group>

                    )

                })}

            </Group>

        </div>

    )

}
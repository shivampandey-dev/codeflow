import { Group, Text, ActionIcon } from "@mantine/core"
import { X } from "lucide-react"

import { useEditorStore } from "../../../store/editorStore"
import { resolveIcon } from "../FileTree/iconResolver"

export default function Tabs() {

    const {
        tabs,
        activeFile,
        closeFile,
        openFile,
        dirty,
        reorderTabs
    } = useEditorStore()

    function handleDragStart(e, index) {

        e.dataTransfer.setData("tabIndex", index)

    }

    function handleDrop(e, index) {

        const from = Number(
            e.dataTransfer.getData("tabIndex")
        )

        reorderTabs(from, index)

    }

    return (

        <Group
            gap={0}
            style={{
                borderBottom: "1px solid #1e293b",
                background: "#020617",
                overflowX: "auto"
            }}
        >

            {tabs.map((path, index) => {

                const name = path.split("/").pop()

                const active = path === activeFile

                const icon = resolveIcon(name, "file")

                return (

                    <Group
                        key={path}
                        gap={6}
                        px="sm"
                        py={6}

                        draggable
                        onDragStart={(e) =>
                            handleDragStart(e, index)
                        }

                        onDragOver={(e) =>
                            e.preventDefault()
                        }

                        onDrop={(e) =>
                            handleDrop(e, index)
                        }

                        style={{
                            cursor: "pointer",
                            background: active
                                ? "#0f172a"
                                : "transparent",
                            borderRight:
                                "1px solid #1e293b"
                        }}

                        onClick={() => openFile(path)}

                        onAuxClick={(e) => {
                            if (e.button === 1)
                                closeFile(path)
                        }}
                    >

                        <img
                            src={icon}
                            width={14}
                            height={14}
                        />

                        <Text size="sm">

                            {name}

                            {dirty[path] && (
                                <span style={{ marginLeft: 4 }}>
                                    ●
                                </span>
                            )}

                        </Text>

                        <ActionIcon
                            size="xs"
                            variant="subtle"

                            onClick={(e) => {

                                e.stopPropagation()

                                closeFile(path)

                            }}
                        >
                            <X size={12} />
                        </ActionIcon>

                    </Group>

                )

            })}

        </Group>

    )

}
import { useState } from "react"
import { Group, Text, ActionIcon, Tooltip } from "@mantine/core"
import {
    FilePlus,
    FolderPlus,
    RefreshCw,
    MoreHorizontal
} from "lucide-react"

import { useSettingsStore } from "../../../store/settingsStore"
import { useEditorStore } from "../../../store/editorStore"
import { deriveUIColors } from "../../../utils/themeColors"
import { useFileTreeStore } from "../../../store/fileTreeStore"
const tooltipProps = {
    withArrow: true,
    openDelay: 300,
    styles: {
        tooltip: {
            fontSize: "11px",
            padding: "3px 6px",
            lineHeight: 1.2
        }
    }
}

export default function FileTreeHeader({
    refresh
}) {

    const [rotating, setRotating] = useState(false)

    const { themeData } = useSettingsStore()

    const { startCreate } = useEditorStore()
    const { selectedPath } = useFileTreeStore()

    const editorBg =
        themeData?.colors?.["editor.background"] || "#1e1e1e"

    const ui = deriveUIColors(editorBg)

    /*
    GET TARGET DIRECTORY
    */

    function getTargetDir() {

        if (!selectedPath) return "/workspace"

        const name = selectedPath.split("/").pop()

        // if selected is a file → return parent folder
        if (name.includes(".")) {

            const lastSlash = selectedPath.lastIndexOf("/")

            return selectedPath.substring(0, lastSlash)

        }

        // if folder → return folder
        return selectedPath

    }

    /*
    NEW FILE
    */

    function handleNewFile() {

        const dir = getTargetDir()

        startCreate("file", dir)

    }

    /*
    NEW FOLDER
    */

    function handleNewFolder() {

        const dir = getTargetDir()

        startCreate("folder", dir)

    }

    /*
    REFRESH
    */

    const handleRefresh = async () => {

        setRotating(true)

        await refresh?.()

        setTimeout(() => {
            setRotating(false)
        }, 400)

    }

    return (

        <Group
            justify="space-between"
            style={{
                padding: "6px 8px",
                borderBottom: `1px solid ${ui.border}`,
                background: ui.panelBg
            }}
        >

            <Text
                size="xs"
                fw={700}
                style={{
                    color: themeData?.colors?.["editor.foreground"] || "#d4d4d4",
                    letterSpacing: 0.5
                }}
            >
                EXPLORER
            </Text>

            <Group gap={4}>

                <Tooltip label="New File" {...tooltipProps}>
                    <ActionIcon
                        size="sm"
                        variant="subtle"
                        onClick={handleNewFile}
                    >
                        <FilePlus size={14} />
                    </ActionIcon>
                </Tooltip>

                <Tooltip label="New Folder" {...tooltipProps}>
                    <ActionIcon
                        size="sm"
                        variant="subtle"
                        onClick={handleNewFolder}
                    >
                        <FolderPlus size={14} />
                    </ActionIcon>
                </Tooltip>

                <Tooltip label="Refresh Explorer" {...tooltipProps}>
                    <ActionIcon
                        size="sm"
                        variant="subtle"
                        onClick={handleRefresh}
                    >
                        <RefreshCw
                            size={14}
                            style={{
                                transition: "transform 0.35s ease",
                                transform: rotating
                                    ? "rotate(360deg)"
                                    : "rotate(0deg)"
                            }}
                        />
                    </ActionIcon>
                </Tooltip>

                <Tooltip label="More Actions" {...tooltipProps}>
                    <ActionIcon
                        size="sm"
                        variant="subtle"
                        onClick={() =>
                            alert("More actions coming soon")
                        }
                    >
                        <MoreHorizontal size={14} />
                    </ActionIcon>
                </Tooltip>

            </Group>

        </Group>

    )
}
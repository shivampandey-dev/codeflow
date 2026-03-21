import { useState } from "react"
import { Group, Text, ActionIcon, Tooltip } from "@mantine/core"
import {
    FilePlus,
    FolderPlus,
    RefreshCw,
    MoreHorizontal,
    Download
} from "lucide-react"

import JSZip from "jszip"
import { saveAs } from "file-saver"

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

const SKIP_LIST = ["node_modules", ".git", ".cache", "dist", "build"]

export default function FileTreeHeader({
    refresh,
    webcontainer
}) {

    const [rotating, setRotating] = useState(false)
    const [downloading, setDownloading] = useState(false)

    const { themeData } = useSettingsStore()
    const { startCreate, saveFile } = useEditorStore()
    const { selectedPath } = useFileTreeStore()

    const editorBg = themeData?.colors?.["editor.background"] || "#1e1e1e"
    const ui = deriveUIColors(editorBg)

    /*
    =========================
    GET TARGET DIRECTORY
    =========================
    */
    function getTargetDir() {
        if (!selectedPath) return "/workspace"
        const name = selectedPath.split("/").pop()
        if (name.includes(".")) {
            const lastSlash = selectedPath.lastIndexOf("/")
            return selectedPath.substring(0, lastSlash)
        }
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
        setTimeout(() => setRotating(false), 400)
    }

    /*
    =========================
    DOWNLOAD PROJECT (ZIP)
    =========================
    */
    const downloadProject = async () => {
        if (!webcontainer) return

        setDownloading(true)

        // Edge case 5: save current file buffer before zipping
        // so the latest unsaved changes are included
        try {
            await saveFile()
        } catch {
            // saveFile failing shouldn't block the download
        }

        const zip = new JSZip()
        let fileCount = 0

        // Edge case 1: track visited paths to prevent symlink infinite loops
        const visited = new Set()

        const isDirectory = async (path) => {
            try {
                await webcontainer.fs.readdir(path)
                return true
            } catch {
                return false
            }
        }

        const readDir = async (dir, zipFolder) => {
            let files

            try {
                files = await webcontainer.fs.readdir(dir)
            } catch {
                return
            }

            for (const file of files) {
                if (SKIP_LIST.includes(file)) continue

                const fullPath = `${dir}/${file}`

                // Edge case 1: skip already visited paths (circular symlinks)
                if (visited.has(fullPath)) continue
                visited.add(fullPath)

                if (await isDirectory(fullPath)) {
                    const folder = zipFolder.folder(file)

                    // Edge case 2: preserve empty directories with .gitkeep
                    const subFiles = await webcontainer.fs.readdir(fullPath)
                    const hasContent = subFiles.some(f => !SKIP_LIST.includes(f))

                    if (!hasContent) {
                        folder.file(".gitkeep", "")
                    } else {
                        await readDir(fullPath, folder)
                    }
                } else {
                    try {
                        const content = await webcontainer.fs.readFile(fullPath)
                        zipFolder.file(file, content)
                        fileCount++
                    } catch {
                        // skip unreadable files silently
                    }
                }
            }
        }

        await readDir("/workspace", zip)

        if (fileCount === 0) {
            setDownloading(false)
            return
        }

        try {
            const blob = await zip.generateAsync({ type: "blob" })
            saveAs(blob, "project.zip")
        } catch {
            // zip generation failed — nothing to do
        }

        setDownloading(false)
    }

    return (
        <Group
            justify="space-between"
            style={{
                padding: "3px 8px",
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

                {/* DOWNLOAD */}
                <Tooltip label="Download Project" {...tooltipProps}>
                    <ActionIcon
                        size="sm"
                        variant="subtle"
                        onClick={downloadProject}
                        loading={downloading}
                    >
                        <Download size={14} />
                    </ActionIcon>
                </Tooltip>

                {/* NEW FILE */}
                <Tooltip label="New File" {...tooltipProps}>
                    <ActionIcon size="sm" variant="subtle" onClick={handleNewFile}>
                        <FilePlus size={14} />
                    </ActionIcon>
                </Tooltip>

                {/* NEW FOLDER */}
                <Tooltip label="New Folder" {...tooltipProps}>
                    <ActionIcon size="sm" variant="subtle" onClick={handleNewFolder}>
                        <FolderPlus size={14} />
                    </ActionIcon>
                </Tooltip>

                {/* REFRESH */}
                <Tooltip label="Refresh Explorer" {...tooltipProps}>
                    <ActionIcon size="sm" variant="subtle" onClick={handleRefresh}>
                        <RefreshCw
                            size={14}
                            style={{
                                transition: "transform 0.35s ease",
                                transform: rotating ? "rotate(360deg)" : "rotate(0deg)"
                            }}
                        />
                    </ActionIcon>
                </Tooltip>

                {/* MORE */}
             

            </Group>
        </Group>
    )
}
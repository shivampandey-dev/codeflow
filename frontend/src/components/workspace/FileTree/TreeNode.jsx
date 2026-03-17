import { useState, useRef, useEffect } from "react"
import { Group, Text } from "@mantine/core"
import { ChevronRight, ChevronDown } from "lucide-react"

import { resolveIcon } from "./iconResolver"

import { useEditorStore } from "../../../store/editorStore"
import { useSettingsStore } from "../../../store/settingsStore"

import { deriveTreeGuide, deriveUIColors } from "../../../utils/themeColors"

export default function TreeNode({
    node,
    level,
    webcontainer,
    refresh
}) {

    const [open, setOpen] = useState(false)
    const [renaming, setRenaming] = useState(false)
    const [name, setName] = useState(node.name)

    const inputRef = useRef(null)

    const {
        openFile,
        activeFile,
        getFileStatus
    } = useEditorStore()

    const status = getFileStatus(node.path)

    const {
        themeData,
        fileTreeFontSize,
        fileTreeIconSize,
        compactFolders
    } = useSettingsStore()

    const editorBg =
        themeData?.colors?.["editor.background"] || "#1e1e1e"

    const editorFg =
        themeData?.colors?.["editor.foreground"] || "#d4d4d4"

    const ui = deriveUIColors(editorBg)

    const isFolder = node.type === "folder"

    const icon = resolveIcon(node.name, node.type)

    const guideColor = deriveTreeGuide(editorBg, editorFg)

    function getFileColor() {

        if (!status) return editorFg

        if (status === "M")
            return themeData?.colors?.["gitDecoration.modifiedResourceForeground"] || "#58a6ff"

        if (status === "U")
            return themeData?.colors?.["gitDecoration.untrackedResourceForeground"] || "#3fb950"

        return editorFg
    }

    useEffect(() => {

        function handler(e) {

            if (e.detail?.path === node.path) {

                setRenaming(true)

                setTimeout(() => {
                    inputRef.current?.focus()
                    inputRef.current?.select()
                }, 0)

            }

        }

        window.addEventListener("filetree-rename", handler)

        return () =>
            window.removeEventListener("filetree-rename", handler)

    }, [node.path])


    async function handleRename() {

        if (name === node.name) {
            setRenaming(false)
            return
        }

        try {

            const newPath =
                node.path.split("/").slice(0, -1).join("/") + "/" + name

            await webcontainer.fs.rename(node.path, newPath)

            setRenaming(false)

            refresh()

        } catch (err) {

            console.error("Rename failed", err)

            setRenaming(false)

        }

    }

    function toggle() {

        if (isFolder) {

            setOpen(!open)

        } else {

            openFile(node.path)

        }

    }

    function handleRightClick(e) {

        e.preventDefault()

        window.dispatchEvent(
            new CustomEvent("filetree-contextmenu", {
                detail: {
                    x: e.clientX,
                    y: e.clientY,
                    node
                }
            })
        )

    }

    const isActive = activeFile === node.path

    return (

        <div>

            <Group
                gap={6}
                onClick={toggle}
                onContextMenu={handleRightClick}

                style={{
                    cursor: "pointer",
                    paddingLeft: level * (compactFolders ? 12 : 16),
                    height: compactFolders ? 22 : 28,
                    userSelect: "none",
                    borderRadius: 4,
                    background: isActive ? ui.activeBg : "transparent"
                }}

                onMouseEnter={(e) => {
                    if (!isActive)
                        e.currentTarget.style.background = ui.hoverBg
                }}

                onMouseLeave={(e) => {
                    if (!isActive)
                        e.currentTarget.style.background = "transparent"
                }}
            >

                {isFolder ? (
                    open
                        ? <ChevronDown size={14} />
                        : <ChevronRight size={14} />
                ) : (
                    <div style={{ width: 14 }} />
                )}

                <img
                    src={icon}
                    width={fileTreeIconSize}
                    height={fileTreeIconSize}
                />

                {renaming ? (

                    <input
                        ref={inputRef}
                        value={name}
                        onChange={(e) => setName(e.target.value)}

                        onBlur={handleRename}

                        onKeyDown={(e) => {

                            if (e.key === "Enter") handleRename()

                            if (e.key === "Escape") {

                                setName(node.name)

                                setRenaming(false)

                            }

                        }}

                        style={{
                            fontSize: fileTreeFontSize,
                            background: ui.sidebarBg,
                            border: `1px solid ${ui.border}`,
                            color: editorFg,
                            outline: "none",
                            padding: "2px 4px",
                            borderRadius: 3
                        }}
                    />

                ) : (

                    <Group
                        style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between"
                        }}
                    >

                        <Text
                            style={{
                                fontSize: fileTreeFontSize,
                                color: getFileColor(),
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap"
                            }}
                        >
                            {node.name}
                        </Text>

                        {status && (

                            <Text
                                size="xs"
                                fw={700}
                                style={{
                                    color: getFileColor(),
                                    marginLeft: 8
                                }}
                            >
                                {status}
                            </Text>

                        )}

                    </Group>

                )}

            </Group>


            {isFolder && open && node.children && (

                <div
                    style={{
                        marginLeft: 8,
                        borderLeft: `1px solid ${guideColor}`,
                        paddingLeft: 8
                    }}
                >

                    {node.children.map(child => (

                        <TreeNode
                            key={child.path}
                            node={child}
                            level={level + 1}
                            webcontainer={webcontainer}
                            refresh={refresh}
                        />

                    ))}

                </div>

            )}

        </div>

    )

}
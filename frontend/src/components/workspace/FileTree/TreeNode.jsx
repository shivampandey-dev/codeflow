import { useState, useRef, useEffect } from "react"
import { Group, Text } from "@mantine/core"
import { ChevronRight, ChevronDown } from "lucide-react"

import { resolveIcon } from "./iconResolver"

import { useEditorStore } from "../../../store/editorStore"
import { useSettingsStore } from "../../../store/settingsStore"
import { useFileTreeStore } from "../../../store/fileTreeStore"

import { deriveTreeGuide, deriveUIColors } from "../../../utils/themeColors"

export default function TreeNode({
    node,
    level,
    webcontainer,
    refresh
}) {

    const [open, setOpen] = useState(node.path === "/workspace")
    const [creatingName, setCreatingName] = useState("")

    const inputRef = useRef(null)

    const {
        openFile,
        creating,
        stopCreate,
        getFileStatus
    } = useEditorStore()

    const {
        selectedPath,
        setSelected
    } = useFileTreeStore()

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

    const activeBg =
        themeData?.colors?.["list.activeSelectionBackground"]

    const hoverBg =
        themeData?.colors?.["list.hoverBackground"]

    const ui = deriveUIColors(editorBg)

    const icon = resolveIcon(node.name, node.type)

    const guideColor = deriveTreeGuide(editorBg, editorFg)

    const isFolder = node.type === "folder"

    const status = getFileStatus(node.path)

    /*
    =========================
    ACTIVE NODE LOGIC
    =========================
    */

    const selectedIsFile =
        selectedPath?.split("/").pop()?.includes(".")

    const parentPath = selectedIsFile
        ? selectedPath.substring(0, selectedPath.lastIndexOf("/"))
        : selectedPath

    const sidebarFg =
        themeData?.colors?.["sideBar.foreground"] || editorFg

    const isActive = parentPath === node.path


    /*
    =========================
    AUTO OPEN WHEN CREATING
    =========================
    */

    useEffect(() => {

        if (creating?.dir === node.path) {

            setOpen(true)

            setTimeout(() => {
                inputRef.current?.focus()
            }, 0)

        }

    }, [creating, node.path])


    /*
    =========================
    FILE COLOR (GIT STATUS)
    =========================
    */

    function getFileColor() {

        if (!status) return editorFg

        if (status === "M")
            return themeData?.colors?.["gitDecoration.modifiedResourceForeground"] || "#58a6ff"

        if (status === "U")
            return themeData?.colors?.["gitDecoration.untrackedResourceForeground"] || "#3fb950"

        return editorFg

    }


    /*
    =========================
    CREATE FILE / FOLDER
    =========================
    */

    async function handleCreate(e) {

        if (e.key === "Enter") {

            if (!creatingName.trim()) return

            const path = `${node.path}/${creatingName}`

            try {

                if (creating.type === "file") {

                    await webcontainer.fs.writeFile(path, "")

                    const { registerNewFile } = useEditorStore.getState()
                    registerNewFile(path)

                } else {

                    await webcontainer.fs.mkdir(path)

                }

                setCreatingName("")
                stopCreate()
                refresh()

            } catch (err) {

                console.error("Create failed", err)

            }

        }

        if (e.key === "Escape") {

            stopCreate()
            setCreatingName("")

        }

    }


    /*
    =========================
    CLICK HANDLER
    =========================
    */

    function handleClick() {

        setSelected(node.path)

        if (isFolder) {

            setOpen(!open)

        } else {

            openFile(node.path)

        }

    }


    /*
    =========================
    CONTEXT MENU
    =========================
    */

    function handleRightClick(e) {

        e.preventDefault()
        e.stopPropagation()

        setSelected(node.path)

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


    /*
    =========================
    UI
    =========================
    */

    return (

        <div>

            <Group
                gap={6}
                onClick={handleClick}
                onContextMenu={handleRightClick}

                style={{
                    cursor: "pointer",
                    paddingLeft: level * (compactFolders ? 12 : 16),
                    height: compactFolders ? 22 : 28,
                    userSelect: "none",
                    borderRadius: 4,
                    backgroundColor: isActive
                        ? activeBg || ui.activeBg
                        : "transparent"
                }}

                onMouseEnter={(e) => {

                    if (!isActive)
                        e.currentTarget.style.backgroundColor =
                            ui.hoverBg || "#2a2d2e"

                }}

                onMouseLeave={(e) => {

                    if (!isActive)
                        e.currentTarget.style.backgroundColor =
                            "transparent"

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

                <Text
                    style={{
                        fontSize: fileTreeFontSize,
                        color: getFileColor(),
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        flex: 1
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


            {isFolder && open && (

                <div
                    style={{
                        marginLeft: 8,
                        borderLeft: `1px solid ${guideColor}`,
                        paddingLeft: 8
                    }}
                >

                    {node.children?.map(child => (

                        <TreeNode
                            key={child.path}
                            node={child}
                            level={level + 1}
                            webcontainer={webcontainer}
                            refresh={refresh}
                        />

                    ))}

                    {creating?.dir === node.path && (

                        <input
                            ref={inputRef}
                            autoFocus
                            value={creatingName}
                            onChange={(e) =>
                                setCreatingName(e.target.value)
                            }
                            onKeyDown={handleCreate}

                            placeholder={
                                creating.type === "file"
                                    ? "File name"
                                    : "Folder name"
                            }

                            style={{
                                fontSize: fileTreeFontSize,
                                background: ui.sidebarBg,
                                border: `1px solid ${ui.border}`,
                                color: sidebarFg,
                                outline: "none",
                                padding: "2px 4px",
                                borderRadius: 3,
                                marginTop: 4,
                                width: "100%"
                            }}
                        />

                    )}

                </div>

            )}

        </div>

    )

}
import { useEffect, useState } from "react"
import { Group, Text, Menu } from "@mantine/core"
import { ChevronRight, ChevronDown } from "lucide-react"

import { resolveIcon } from "./iconResolver"

import {
    createFile,
    createFolder,
    deletePath,
    renamePath
} from "./fsOperations"

import { useEditorStore } from "../../../store/editorStore"

export default function TreeNode({
    node,
    webcontainer,
    refresh,
    level
}) {

    const [open, setOpen] = useState(level === 0 ? true : false)

    const [menuOpened, setMenuOpened] = useState(false)
    const [menuPos, setMenuPos] = useState({ x: 0, y: 0 })

    const icon = resolveIcon(node.name, node.type, open)

    const openFile = useEditorStore((state) => state.openFile)

    useEffect(() => {
        setMenuOpened(false)
    }, [])

    async function handleNewFile() {

        setMenuOpened(false)

        const name = prompt("File name")
        if (!name) return

        await createFile(webcontainer, `${node.path}/${name}`)
        refresh()
    }

    async function handleNewFolder() {

        setMenuOpened(false)

        const name = prompt("Folder name")
        if (!name) return

        await createFolder(webcontainer, `${node.path}/${name}`)
        refresh()
    }

    async function handleDelete() {

        setMenuOpened(false)

        await deletePath(webcontainer, node.path)
        refresh()
    }

    async function handleRename() {

        setMenuOpened(false)

        const newName = prompt("Rename", node.name)
        if (!newName) return

        const parent =
            node.path.split("/").slice(0, -1).join("/")

        await renamePath(
            webcontainer,
            node.path,
            `${parent}/${newName}`
        )

        refresh()
    }

    const padding = level * 8

    function handleRightClick(e) {

        e.preventDefault()

        setMenuPos({
            x: e.clientX,
            y: e.clientY
        })

        setMenuOpened(true)
    }

    async function handleClick() {

        if (node.type === "folder") {
            setOpen(!open)
            return
        }

        if (!webcontainer) return

        try {

            const content = await webcontainer.fs.readFile(
                node.path,
                "utf-8"
            )

            openFile(node.path, content)

        } catch (err) {
            console.error("Failed to open file", err)
        }
    }

    return (
        <>

            {/* FILE ROW */}

            <div onContextMenu={handleRightClick}>

                <Group
                    gap={3}
                    style={{
                        paddingLeft: padding,
                        height: 24,
                        cursor: "pointer",
                        userSelect: "none",
                        borderRadius: 4
                    }}
                    className="tree-row"
                    onClick={handleClick}
                >

                    {/* Dropdown Arrow */}

                    {node.type === "folder" && (
                        open
                            ? <ChevronDown size={14} />
                            : <ChevronRight size={14} />
                    )}

                    {node.type !== "folder" && (
                        <div style={{ width: 14 }} />
                    )}

                    {/* File Icon */}

                    <img
                        src={icon}
                        width={16}
                        height={16}
                    />

                    <Text size="sm">
                        {node.name}
                    </Text>

                </Group>

            </div>

            {/* CONTEXT MENU */}

            <Menu
                opened={menuOpened}
                onChange={setMenuOpened}
                position="bottom-start"
                withinPortal
            >

                <Menu.Target>
                    <div
                        style={{
                            position: "fixed",
                            top: menuPos.y,
                            left: menuPos.x
                        }}
                    />
                </Menu.Target>

                <Menu.Dropdown>

                    {node.type === "folder" && (
                        <>
                            <Menu.Item onClick={handleNewFile}>
                                New File
                            </Menu.Item>

                            <Menu.Item onClick={handleNewFolder}>
                                New Folder
                            </Menu.Item>
                        </>
                    )}

                    <Menu.Item onClick={handleRename}>
                        Rename
                    </Menu.Item>

                    <Menu.Item
                        color="red"
                        onClick={handleDelete}
                    >
                        Delete
                    </Menu.Item>

                </Menu.Dropdown>

            </Menu>

            {/* Children */}

            {node.type === "folder" && open && (

                <div className="tree-children">

                    {node.children?.map(child => (
                        <TreeNode
                            key={child.path}
                            node={child}
                            webcontainer={webcontainer}
                            refresh={refresh}
                            level={level + 1}
                        />
                    ))}

                </div>

            )}

        </>
    )
}
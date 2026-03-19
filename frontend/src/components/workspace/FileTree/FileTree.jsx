import { useEffect, useState } from "react"
import { scanTree } from "./scanTree"
import TreeNode from "./TreeNode"
import FileTreeHeader from "./FileTreeHeader"

import { useFileTreeStore } from "../../../store/fileTreeStore"
import { useEditorStore } from "../../../store/editorStore"
import { useSettingsStore } from "../../../store/settingsStore"
export default function FileTree({ webcontainer }) {

    const { tree, setTree } = useFileTreeStore()
    const { startCreate } = useEditorStore()
    const { themeData } = useSettingsStore()
    const sidebarBg =
        themeData?.colors?.["sideBar.background"] || "#1e1e1e"
    const menuBg =
        themeData?.colors?.["menu.background"] || "#1e1e1e"

    const menuBorder =
        themeData?.colors?.["menu.border"] || "#333"

    const [menu, setMenu] = useState(null)
    async function refresh() {

        if (!webcontainer) return

        try {

            let entries = []

            while (entries.length === 0) {

                entries = await webcontainer.fs.readdir("/workspace")

                if (entries.length === 0) {
                    await new Promise(r => setTimeout(r, 200))
                }

            }

            const children = await scanTree(webcontainer, "/workspace")

            setTree([
                {
                    name: "workspace",
                    path: "/workspace",
                    type: "folder",
                    children
                }
            ])

        } catch (err) {

            console.error("Failed to scan tree", err)

        }

    }

    /*
    =========================
    INITIAL LOAD
    =========================
    */

    useEffect(() => {

        if (!webcontainer) return

        refresh()

    }, [webcontainer])


    /*
    =========================
    FILESYSTEM WATCHER
    =========================
    */

    useEffect(() => {

        if (!webcontainer) return

        let debounce

        const watcher = webcontainer.fs.watch("/workspace", () => {

            clearTimeout(debounce)

            debounce = setTimeout(() => {

                refresh()

            }, 200)

        })

        return () => {

            watcher.close()

        }

    }, [webcontainer])


    /*
    =========================
    CONTEXT MENU LISTENER
    =========================
    */

    useEffect(() => {

        function handler(e) {

            setMenu(e.detail)

        }

        window.addEventListener("filetree-contextmenu", handler)

        return () =>
            window.removeEventListener("filetree-contextmenu", handler)

    }, [])


    /*
    CLOSE MENU ON CLICK
    */

    useEffect(() => {

        function closeMenu() {

            setMenu(null)

        }

        window.addEventListener("click", closeMenu)

        return () =>
            window.removeEventListener("click", closeMenu)

    }, [])


    /*
    =========================
    CONTEXT MENU ACTIONS
    =========================
    */

    async function handleDelete(node) {

        try {

            if (node.type === "folder") {

                await webcontainer.fs.rm(node.path, {
                    recursive: true
                })

            } else {

                await webcontainer.fs.rm(node.path)

            }

            refresh()

        } catch (err) {

            console.error("Delete failed", err)

        }

        setMenu(null)

    }

    function handleRename(node) {

        window.dispatchEvent(
            new CustomEvent("filetree-rename", {
                detail: { path: node.path }
            })
        )

        setMenu(null)

    }

    function handleNewFile(node) {

        startCreate("file", node.path)
        setMenu(null)

    }

    function handleNewFolder(node) {

        startCreate("folder", node.path)
        setMenu(null)

    }


    /*
    =========================
    UI
    =========================
    */

    return (

        <div
            style={{
                position: "relative",
                height: "100%",
                background: sidebarBg   // ✅ THIS FIXES IT
            }}
        >

            <FileTreeHeader refresh={refresh} />

            {tree.map(node => (

                <TreeNode
                    key={node.path}
                    node={node}
                    level={0}
                    webcontainer={webcontainer}
                    refresh={refresh}
                />

            ))}


            {menu && (

                <div
                    style={{
                        position: "fixed",
                        top: menu.y,
                        left: menu.x,
                        background: menuBg,
                        border: `1px solid ${menuBorder}`,
                        borderRadius: 6,
                        padding: "4px 0",
                        zIndex: 999,
                        minWidth: 150
                    }}
                >

                    {menu.node.type === "folder" && (

                        <>
                            <MenuItem
                                label="New File"
                                onClick={() => handleNewFile(menu.node)}
                            />

                            <MenuItem
                                label="New Folder"
                                onClick={() => handleNewFolder(menu.node)}
                            />
                        </>

                    )}

                    <MenuItem
                        label="Rename"
                        onClick={() => handleRename(menu.node)}
                    />

                    <MenuItem
                        label="Delete"
                        onClick={() => handleDelete(menu.node)}
                    />

                </div>

            )}

        </div>

    )

}


/*
=========================
MENU ITEM COMPONENT
=========================
*/

function MenuItem({ label, onClick }) {

    return (

        <div
            onClick={onClick}
            style={{
                padding: "6px 14px",
                fontSize: 13,
                cursor: "pointer"
            }}
            onMouseEnter={(e) =>
                e.currentTarget.style.background = "#2a2d2e"
            }
            onMouseLeave={(e) =>
                e.currentTarget.style.background = "transparent"
            }
        >
            {label}
        </div>

    )

}
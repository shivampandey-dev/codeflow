import { useEffect, useState, useRef } from "react"
import { scanTree } from "./scanTree"
import TreeNode from "./TreeNode"
import FileTreeHeader from "./FileTreeHeader"
import ContextMenu from "./ContextMenu"

import { ScrollArea } from "@mantine/core"

import { useSettingsStore } from "../../../store/settingsStore"
import { deriveUIColors } from "../../../utils/themeColors"
import { useEditorStore } from "../../../store/editorStore"

export default function FileTree({ webcontainer, logs }) {

    const [tree, setTree] = useState([])
    const [ready, setReady] = useState(false)
    const [menu, setMenu] = useState(null)

    const { openFile } = useEditorStore()

    const {
        themeData,
        showHiddenFiles
    } = useSettingsStore()

    const editorBg =
        themeData?.colors?.["editor.background"] || "#1e1e1e"

    const ui = deriveUIColors(editorBg)

    const defaultOpened = useRef(false)

    /*
    =========================
    REFRESH TREE
    =========================
    */

    async function refresh() {

        if (!webcontainer) return

        try {

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
    INITIAL LOAD
    */

    useEffect(() => {

        if (!webcontainer) return

        refresh()

    }, [webcontainer])


    /*
    WATCH FILESYSTEM CHANGES
    */

    useEffect(() => {

        if (!webcontainer) return

        let timer

        const watcher = webcontainer.fs.watch("/workspace", () => {

            clearTimeout(timer)

            timer = setTimeout(() => {
                refresh()
            }, 200)

        })

        const interval = setInterval(refresh, 2000)

        return () => {

            watcher.close()
            clearInterval(interval)

        }

    }, [webcontainer])


    /*
    PROJECT READY
    */

    useEffect(() => {

        if (!logs) return

        if (logs.includes("Mounting")) {
            setReady(true)
        }

    }, [logs])


    /*
    CONTEXT MENU
    */

    useEffect(() => {

        function handler(e) {
            setMenu(e.detail)
        }

        window.addEventListener("filetree-contextmenu", handler)

        return () =>
            window.removeEventListener("filetree-contextmenu", handler)

    }, [])


    useEffect(() => {

        function closeMenu() {
            setMenu(null)
        }

        window.addEventListener("click", closeMenu)

        return () =>
            window.removeEventListener("click", closeMenu)

    }, [])


    /*
    AUTO OPEN DEFAULT FILE
    */

    function findFirstFile(nodes) {

        for (const node of nodes) {

            if (node.type === "file") return node

            if (node.children) {

                const file = findFirstFile(node.children)

                if (file) return file

            }

        }

    }

    useEffect(() => {

        if (defaultOpened.current) return
        if (!tree.length) return

        function findApp(nodes) {

            for (const node of nodes) {

                if (node.path === "/workspace/src/App.jsx")
                    return node

                if (node.children) {

                    const found = findApp(node.children)

                    if (found) return found

                }

            }

        }

        const file = findApp(tree) || findFirstFile(tree)

        if (!file) return

        openFile(file.path)

        defaultOpened.current = true

    }, [tree])


    /*
    FILTER HIDDEN FILES
    */

    function filterNodes(nodes) {

        return nodes
            .filter(node => showHiddenFiles || !node.name.startsWith("."))
            .map(node => ({
                ...node,
                children: node.children
                    ? filterNodes(node.children)
                    : null
            }))

    }

    const filteredTree = filterNodes(tree)


    /*
    UI
    */

    return (

        <div
            style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                background: ui.sidebarBg
            }}
        >

            {ready && (
                <FileTreeHeader refresh={refresh} />
            )}

            <ScrollArea
                h={ready ? "calc(100% - 32px)" : "100%"}
                px="xs"
            >

                {filteredTree.map(node => (

                    <TreeNode
                        key={node.path}
                        node={node}
                        webcontainer={webcontainer}
                        refresh={refresh}
                        level={0}
                    />

                ))}

            </ScrollArea>

            {menu && (

                <ContextMenu
                    x={menu.x}
                    y={menu.y}
                    node={menu.node}
                    webcontainer={webcontainer}
                    refresh={refresh}
                    close={() => setMenu(null)}
                />

            )}

        </div>

    )

}
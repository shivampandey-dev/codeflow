import { useEffect, useRef, useState } from "react"
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

    const sidebarBg = themeData?.colors?.["sideBar.background"] || "#1e1e1e"
    const menuBg = themeData?.colors?.["menu.background"] || "#1e1e1e"
    const menuBorder = themeData?.colors?.["menu.border"] || "#333"

    const [menu, setMenu] = useState(null)

    // Track watchers so we can close them on cleanup
    const rootWatcherRef = useRef(null)
    const workspaceWatcherRef = useRef(null)

    /*
    =========================
    REFRESH
    Keeps retrying until /workspace exists AND has files.
    Safe to call at any time — handles the case where mounting
    hasn't finished yet by catching errors inside the loop.
    =========================
    */
    async function refresh() {
        if (!webcontainer) return

        try {
            let children = []
            let attempts = 0
            const MAX = 60   // 60 × 200 ms = 12 s max wait

            while (attempts < MAX) {
                try {
                    const entries = await webcontainer.fs.readdir("/workspace")

                    if (entries.length > 0) {
                        children = await scanTree(webcontainer, "/workspace")
                        break
                    }
                } catch {
                    // /workspace doesn't exist yet — keep waiting
                }

                await new Promise(r => setTimeout(r, 200))
                attempts++
            }

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
    INITIAL LOAD + WATCHERS
    =========================
    */
    useEffect(() => {
        if (!webcontainer) return

        // Kick off the initial scan right away.
        // refresh() will poll until /workspace is ready,
        // so it works even if mounting hasn't finished yet.
        refresh()

        // ── ROOT WATCHER ────────────────────────────────────────────────────
        // Watches "/" so we detect the moment /workspace is created.
        // This covers the first mount (when the workspace watcher below
        // can't be registered yet because /workspace doesn't exist).
        try {
            rootWatcherRef.current = webcontainer.fs.watch("/", { recursive: false }, () => {
                refresh()
            })
        } catch {
            // Some environments don't support watching "/"
        }

        // ── WORKSPACE WATCHER ───────────────────────────────────────────────
        // Watches /workspace for any file changes after the initial mount.
        // We try immediately; if /workspace doesn't exist yet we retry until it does.
        const attachWorkspaceWatcher = async () => {
            let attempts = 0
            while (attempts < 60) {
                try {
                    await webcontainer.fs.readdir("/workspace")  // throws if not ready
                    let debounce
                    workspaceWatcherRef.current = webcontainer.fs.watch(
                        "/workspace",
                        { recursive: true },
                        () => {
                            clearTimeout(debounce)
                            debounce = setTimeout(() => refresh(), 200)
                        }
                    )
                    return  // watcher registered — done
                } catch {
                    await new Promise(r => setTimeout(r, 200))
                    attempts++
                }
            }
        }

        attachWorkspaceWatcher()

        return () => {
            try { rootWatcherRef.current?.close() } catch { }
            try { workspaceWatcherRef.current?.close() } catch { }
        }

    }, [webcontainer])


    /*
    =========================
    CONTEXT MENU LISTENER
    =========================
    */
    useEffect(() => {
        function handler(e) { setMenu(e.detail) }
        window.addEventListener("filetree-contextmenu", handler)
        return () => window.removeEventListener("filetree-contextmenu", handler)
    }, [])

    useEffect(() => {
        function closeMenu() { setMenu(null) }
        window.addEventListener("click", closeMenu)
        return () => window.removeEventListener("click", closeMenu)
    }, [])


    /*
    =========================
    CONTEXT MENU ACTIONS
    =========================
    */
    async function handleDelete(node) {
        try {
            if (node.type === "folder") {
                await webcontainer.fs.rm(node.path, { recursive: true })
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
            new CustomEvent("filetree-rename", { detail: { path: node.path } })
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
        <div style={{ position: "relative", height: "100%", background: sidebarBg }}>

            <FileTreeHeader refresh={refresh} webcontainer={webcontainer} />

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
                            <MenuItem label="New File" onClick={() => handleNewFile(menu.node)} />
                            <MenuItem label="New Folder" onClick={() => handleNewFolder(menu.node)} />
                        </>
                    )}
                    <MenuItem label="Rename" onClick={() => handleRename(menu.node)} />
                    <MenuItem label="Delete" onClick={() => handleDelete(menu.node)} />
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
            style={{ padding: "6px 14px", fontSize: 13, cursor: "pointer" }}
            onMouseEnter={e => e.currentTarget.style.background = "#2a2d2e"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
            {label}
        </div>
    )
}
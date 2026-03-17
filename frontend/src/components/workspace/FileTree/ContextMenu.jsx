import { Paper, Text } from "@mantine/core"
import {
    createFile,
    createFolder,
    deletePath,
    renamePath
} from "../FileTree/fsOperations"

export default function ContextMenu({
    x,
    y,
    node,
    webcontainer,
    refresh,
    close
}) {


    if (!node) return null

    const isFolder = node.type === "folder"

    /*
    ======================
    CREATE FILE
    ======================
    */

    async function handleNewFile() {

        const name = prompt("File name")

        if (!name) return

        const path = `${node.path}/${name}`

        await createFile(webcontainer, path)

        refresh()
        close()

    }

    /*
    ======================
    CREATE FOLDER
    ======================
    */

    async function handleNewFolder() {

        const name = prompt("Folder name")

        if (!name) return

        const path = `${node.path}/${name}`

        await createFolder(webcontainer, path)

        refresh()
        close()

    }

    /*
    ======================
    RENAME
    ======================
    */

    async function handleRename() {

        const name = prompt("New name", node.name)

        if (!name) return

        const parent =
            node.path.split("/").slice(0, -1).join("/")

        const newPath = `${parent}/${name}`

        await renamePath(webcontainer, node.path, newPath)

        refresh()
        close()

    }

    /*
    ======================
    DELETE
    ======================
    */

    async function handleDelete() {

        const ok = confirm(`Delete ${node.name}?`)

        if (!ok) return

        await deletePath(webcontainer, node.path)

        refresh()
        close()

    }

    return (

        <Paper
            shadow="md"
            style={{
                position: "fixed",
                top: y,
                left: x,
                width: 170,
                background: "#252526",
                zIndex: 9999
            }}
        >

            {/* FOLDER ONLY OPTIONS */}

            {isFolder && (
                <>
                    <MenuItem
                        label="New File"
                        onClick={handleNewFile}
                    />

                    <MenuItem
                        label="New Folder"
                        onClick={handleNewFolder}
                    />
                </>
            )}

            {/* COMMON OPTIONS */}

            <MenuItem
                label="Rename"
                onClick={handleRename}
            />

            <MenuItem
                label="Delete"
                onClick={handleDelete}
            />

        </Paper>

    )


}

function MenuItem({ label, onClick }) {


    return (

        <Text
            size="sm"
            onClick={onClick}
            style={{
                padding: "6px 10px",
                cursor: "pointer"
            }}
        >
            {label}
        </Text>

    )


}

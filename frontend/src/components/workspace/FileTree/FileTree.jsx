import { useEffect, useState } from "react"
import { scanTree } from "./scanTree"
import TreeNode from "./TreeNode"
import FileTreeHeader from "./FileTreeHeader"

import { ScrollArea } from "@mantine/core"

export default function FileTree({ webcontainer, logs }) {

    const [tree, setTree] = useState([])
    const [ready, setReady] = useState(false)

    async function refresh() {

        if (!webcontainer) return

        const data = await scanTree(webcontainer)

        setTree(data)
    }

    useEffect(() => {
        refresh()
    }, [webcontainer])

    useEffect(() => {

        if (!logs) return

        if (logs.includes("Mounting")) {
            setReady(true)
        }

    }, [logs])

    return (

        <div
            style={{
                height: "100%",
                display: "flex",
                flexDirection: "column"
            }}
        >

            {/* Header (only when ready) */}

            {ready && (
                <FileTreeHeader refresh={refresh} />
            )}

            {/* Tree */}

            <ScrollArea
                h={ready ? "calc(100% - 32px)" : "100%"}
                px="xs"
            >

                {tree.map(node => (
                    <TreeNode
                        key={node.path}
                        node={node}
                        webcontainer={webcontainer}
                        refresh={refresh}
                        level={0}
                    />
                ))}

            </ScrollArea>

        </div>
    )
}
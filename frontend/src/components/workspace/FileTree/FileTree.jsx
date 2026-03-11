import { useEffect, useState } from "react"
import { scanTree } from "./scanTree"
import TreeNode from "./TreeNode"
import FileTreeHeader from "./FileTreeHeader"

import { ScrollArea } from "@mantine/core"

export default function FileTree({ webcontainer }) {

    const [tree, setTree] = useState([])

    async function refresh() {

        if (!webcontainer) return

        const data = await scanTree(webcontainer)

        setTree(data)

    }

    useEffect(() => {
        refresh()
    }, [webcontainer])

    return (

        <div
            style={{
                height: "100%",
                display: "flex",
                flexDirection: "column"
            }}
        >

            {/* Header */}
            <FileTreeHeader refresh={refresh} />

            {/* Tree */}
            <ScrollArea h="calc(100% - 32px)" px="xs">

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
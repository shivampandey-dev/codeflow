export async function scanTree(webcontainer, path = "/workspace") {

    let entries = []

    try {

        entries = await webcontainer.fs.readdir(
            path,
            { withFileTypes: true }
        )

    } catch {
        return []
    }

    const tree = []

    for (const entry of entries) {

        if (entry.name === "node_modules") continue

        const fullPath = `${path}/${entry.name}`

        if (entry.isDirectory()) {

            tree.push({
                name: entry.name,
                path: fullPath,
                type: "folder",
                children: await scanTree(webcontainer, fullPath)
            })

        } else {

            tree.push({
                name: entry.name,
                path: fullPath,
                type: "file"
            })

        }

    }

    return tree
}
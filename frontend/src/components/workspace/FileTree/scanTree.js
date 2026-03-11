export async function scanTree(webcontainer, path = "/") {

    const entries = await webcontainer.fs.readdir(
        path,
        { withFileTypes: true }
    )

    const tree = []

    for (const entry of entries) {

        const fullPath =
            path === "/"
                ? `/${entry.name}`
                : `${path}/${entry.name}`

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
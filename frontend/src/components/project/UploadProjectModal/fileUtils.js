export async function filesToWebContainer(files) {
    const tree = {};

    for (const file of files) {
        const text = await file.text();

        tree[file.name] = {
            file: { contents: text },
        };
    }

    return tree;
} 
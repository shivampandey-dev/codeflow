export async function createFile(webcontainer, path) {

    await webcontainer.fs.writeFile(path, "")
}

export async function createFolder(webcontainer, path) {

    await webcontainer.fs.mkdir(path)
}

export async function deletePath(webcontainer, path) {

    await webcontainer.fs.rm(path, { recursive: true })
}

export async function renamePath(
    webcontainer,
    oldPath,
    newPath
) {

    await webcontainer.fs.rename(oldPath, newPath)
}
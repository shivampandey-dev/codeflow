import { create } from "zustand"

export const useEditorStore = create((set, get) => ({

    tabs: [],
    activeFile: null,

    contents: {},
    originalContents: {},
    dirty: {},

    webcontainer: null,

    setWebcontainer: (wc) => {
        set({ webcontainer: wc })
    },

    /*
    OPEN FILE
    */

    openFile: async (path) => {

        const { tabs, contents, webcontainer } = get()

        if (!tabs.includes(path)) {
            set({ tabs: [...tabs, path] })
        }

        set({ activeFile: path })

        if (contents[path] !== undefined) return

        let fileContent = ""

        if (webcontainer) {

            try {

                fileContent =
                    await webcontainer.fs.readFile(path, "utf-8")

            } catch {

                fileContent = ""

            }

        }

        set((state) => ({

            contents: {
                ...state.contents,
                [path]: fileContent
            },

            originalContents: {
                ...state.originalContents,
                [path]: fileContent
            },

            dirty: {
                ...state.dirty,
                [path]: false
            }

        }))
    },

    /*
    UPDATE CONTENT
    */

    updateContent: (value) => {

        const {
            activeFile,
            contents,
            originalContents,
            dirty
        } = get()

        if (!activeFile) return

        const safeValue = value ?? ""

        const isDirty =
            safeValue !== originalContents[activeFile]

        set({

            contents: {
                ...contents,
                [activeFile]: safeValue
            },

            dirty: {
                ...dirty,
                [activeFile]: isDirty
            }

        })
    },

    /*
    SAVE FILE
    */

    saveFile: async () => {

        const {
            activeFile,
            contents,
            originalContents,
            dirty,
            webcontainer
        } = get()

        if (!activeFile || !webcontainer) return

        const content = contents[activeFile] ?? ""

        await webcontainer.fs.writeFile(activeFile, content)

        set({

            originalContents: {
                ...originalContents,
                [activeFile]: content
            },

            dirty: {
                ...dirty,
                [activeFile]: false
            }

        })
    },

    /*
    RENAME FILE
    */

    renameFile: (oldPath, newPath) => {

        const {
            tabs,
            contents,
            originalContents,
            dirty,
            activeFile
        } = get()

        const newTabs =
            tabs.map(t => t === oldPath ? newPath : t)

        const newContents = { ...contents }
        const newOriginal = { ...originalContents }
        const newDirty = { ...dirty }

        if (contents[oldPath] !== undefined) {
            newContents[newPath] = contents[oldPath]
            delete newContents[oldPath]
        }

        if (originalContents[oldPath] !== undefined) {
            newOriginal[newPath] = originalContents[oldPath]
            delete newOriginal[oldPath]
        }

        if (dirty[oldPath] !== undefined) {
            newDirty[newPath] = dirty[oldPath]
            delete newDirty[oldPath]
        }

        set({

            tabs: newTabs,

            activeFile:
                activeFile === oldPath
                    ? newPath
                    : activeFile,

            contents: newContents,
            originalContents: newOriginal,
            dirty: newDirty

        })

    },

    /*
    CLOSE TAB
    */

    /*
   CLOSE TAB
   */

    closeFile: (path) => {

        const {
            tabs,
            activeFile,
            contents,
            originalContents,
            dirty
        } = get()

        const newTabs = tabs.filter(t => t !== path)

        const newContents = { ...contents }
        const newOriginal = { ...originalContents }
        const newDirty = { ...dirty }

        delete newContents[path]
        delete newOriginal[path]
        delete newDirty[path]

        set({

            tabs: newTabs,

            contents: newContents,
            originalContents: newOriginal,
            dirty: newDirty,

            activeFile:
                activeFile === path
                    ? newTabs[newTabs.length - 1] || null
                    : activeFile

        })

    },
    /*
    REORDER TABS
    */

    reorderTabs: (from, to) => {

        const { tabs } = get()

        const updated = [...tabs]

        const [moved] = updated.splice(from, 1)

        updated.splice(to, 0, moved)

        set({ tabs: updated })

    },

    /*
    FILE STATUS FOR FILETREE
    */

    getFileStatus: (path) => {

        const { dirty, originalContents } = get()

        if (dirty[path]) return "M"

        if (originalContents[path] === undefined)
            return "U"

        return null
    }

}))
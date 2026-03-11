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

    openFile: (path, content) => {

        const { tabs } = get()

        if (!tabs.includes(path)) {

            set({
                tabs: [...tabs, path],
                contents: {
                    ...get().contents,
                    [path]: content
                },
                originalContents: {
                    ...get().originalContents,
                    [path]: content
                },
                dirty: {
                    ...get().dirty,
                    [path]: false
                },
                activeFile: path
            })

        } else {

            set({ activeFile: path })

        }
    },

    updateContent: (value) => {

        const { activeFile, contents, originalContents, dirty } = get()

        if (!activeFile) return

        const isDirty = value !== originalContents[activeFile]

        set({
            contents: {
                ...contents,
                [activeFile]: value
            },
            dirty: {
                ...dirty,
                [activeFile]: isDirty
            }
        })
    },

    saveFile: async () => {

        const {
            activeFile,
            contents,
            originalContents,
            dirty,
            webcontainer
        } = get()

        if (!activeFile || !webcontainer) return

        const content = contents[activeFile]

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

    closeFile: (path) => {

        const { tabs, activeFile } = get()

        const newTabs = tabs.filter(t => t !== path)

        set({
            tabs: newTabs,
            activeFile:
                activeFile === path
                    ? newTabs[newTabs.length - 1] || null
                    : activeFile
        })
    },

    reorderTabs: (from, to) => {

        const { tabs } = get()

        const updated = [...tabs]

        const [moved] = updated.splice(from, 1)

        updated.splice(to, 0, moved)

        set({ tabs: updated })

    }

}))
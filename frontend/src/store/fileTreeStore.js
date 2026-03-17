import { create } from "zustand"

export const useFileTreeStore = create((set) => ({

    tree: [],
    selectedPath: "/workspace",

    setTree: (tree) => set({ tree }),

    setSelected: (path) =>
        set({ selectedPath: path })

}))
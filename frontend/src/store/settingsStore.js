import { create } from "zustand"

export const useSettingsStore = create((set) => ({

    /* GLOBAL */

    theme: "vs-dark",
    themeData: null,

    /* EDITOR */

    fontSize: 14,

    /* FILE TREE */

    fileTreeFontSize: 13,
    fileTreeIconSize: 16,
    showHiddenFiles: false,
    compactFolders: false,

    /* SETTERS */

    setTheme: (theme) => set({ theme }),

    setFontSize: (fontSize) => set({ fontSize }),

    setThemeData: (themeData) => set({ themeData }),

    setFileTreeFontSize: (size) => set({ fileTreeFontSize: size }),

    setFileTreeIconSize: (size) => set({ fileTreeIconSize: size }),

    setShowHiddenFiles: (value) => set({ showHiddenFiles: value }),

    setCompactFolders: (value) => set({ compactFolders: value })

}))
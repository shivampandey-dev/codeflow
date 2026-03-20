import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export const useSettingsStore = create(
    persist(
        (set) => ({

            /* ================= GLOBAL ================= */
            theme: "vs-dark",
            themeData: null,

            setTheme: (theme) => set({ theme }),
            setThemeData: (themeData) => set({ themeData }),

            /* ================= EDITOR ================= */
            editorFontFamily: "monospace",
            editorFontWeight: "400",
            editorFontItalic: false,
            fontSize: 14,
            wordWrap: false,
            minimap: true,
            cursorStyle: "line",
            autoSave: true,
            autoSaveDelay: 1500,

            setEditorFontFamily: (v) => set({ editorFontFamily: v }),
            setEditorFontWeight: (v) => set({ editorFontWeight: v }),
            setEditorFontItalic: (v) => set({ editorFontItalic: v }),

            setFontSize: (v) => set({ fontSize: v }),
            setWordWrap: (v) => set({ wordWrap: v }),
            setMinimap: (v) => set({ minimap: v }),
            setCursorStyle: (v) => set({ cursorStyle: v }),
            setAutoSave: (v) => set({ autoSave: v }),
            setAutoSaveDelay: (v) => set({ autoSaveDelay: v }),

            /* ================= TERMINAL ================= */
            terminalFontFamily: "monospace",
            terminalFontWeight: "400",
            terminalFontItalic: false,
            terminalFontSize: 13,
            cursorBlink: true,
            scrollback: 1000,
            lineHeight: 1.2,

            setTerminalFontFamily: (v) => set({ terminalFontFamily: v }),
            setTerminalFontWeight: (v) => set({ terminalFontWeight: v }),
            setTerminalFontItalic: (v) => set({ terminalFontItalic: v }),

            setTerminalFontSize: (v) => set({ terminalFontSize: v }),
            setCursorBlink: (v) => set({ cursorBlink: v }),
            setScrollback: (v) => set({ scrollback: v }),
            setLineHeight: (v) => set({ lineHeight: v }),

            /* ================= FILE TREE ================= */
            fileTreeFontFamily: "monospace",
            fileTreeFontWeight: "400",
            fileTreeFontItalic: false,
            fileTreeFontSize: 13,
            fileTreeIconSize: 16,
            showHiddenFiles: false,
            compactFolders: false,

            setFileTreeFontFamily: (v) => set({ fileTreeFontFamily: v }),
            setFileTreeFontWeight: (v) => set({ fileTreeFontWeight: v }),
            setFileTreeFontItalic: (v) => set({ fileTreeFontItalic: v }),

            setFileTreeFontSize: (v) => set({ fileTreeFontSize: v }),
            setFileTreeIconSize: (v) => set({ fileTreeIconSize: v }),
            setShowHiddenFiles: (v) => set({ showHiddenFiles: v }),
            setCompactFolders: (v) => set({ compactFolders: v })

        }),
        {
            name: "editor-settings",
            storage: createJSONStorage(() => sessionStorage),

            partialize: (state) => ({
                theme: state.theme,

                /* EDITOR */
                editorFontFamily: state.editorFontFamily,
                editorFontWeight: state.editorFontWeight,
                editorFontItalic: state.editorFontItalic,
                fontSize: state.fontSize,
                wordWrap: state.wordWrap,
                minimap: state.minimap,
                cursorStyle: state.cursorStyle,
                autoSave: state.autoSave,
                autoSaveDelay: state.autoSaveDelay,

                /* TERMINAL */
                terminalFontFamily: state.terminalFontFamily,
                terminalFontWeight: state.terminalFontWeight,
                terminalFontItalic: state.terminalFontItalic,
                terminalFontSize: state.terminalFontSize,
                cursorBlink: state.cursorBlink,
                scrollback: state.scrollback,
                lineHeight: state.lineHeight,

                /* FILE TREE */
                fileTreeFontFamily: state.fileTreeFontFamily,
                fileTreeFontWeight: state.fileTreeFontWeight,
                fileTreeFontItalic: state.fileTreeFontItalic,
                fileTreeFontSize: state.fileTreeFontSize,
                fileTreeIconSize: state.fileTreeIconSize,
                showHiddenFiles: state.showHiddenFiles,
                compactFolders: state.compactFolders
            })
        }
    )
)
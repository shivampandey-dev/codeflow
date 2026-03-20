import Editor, { useMonaco } from "@monaco-editor/react"
import { useEditorStore } from "../../../store/editorStore"
import { getLanguage } from "./languageMap"
import Tabs from "./Tabs"
import SettingsPanel from "./SettingsPanel"
import image from "../../../Assets/logo.png"

import { useSettingsStore } from "../../../store/settingsStore"
import { loadMonacoTheme } from "../../../utils/loadTheme"
import { deriveUIColors } from "../../../utils/themeColors"

import { useEffect, useRef, useState } from "react"

import { ActionIcon } from "@mantine/core"
import { Settings } from "lucide-react"

export default function CodeEditor() {

    const {
        activeFile,
        contents,
        updateContent,
        saveFile,
        webcontainer
    } = useEditorStore()

    const {
        theme,
        themeData,
        setThemeData,

        fontSize,
        editorFontFamily,
        wordWrap,
        minimap,
        cursorStyle,
        autoSave,
        autoSaveDelay
    } = useSettingsStore()

    const monaco = useMonaco()

    const fileName = activeFile?.split("/").pop()
    const language = getLanguage(fileName || "")

    const saveTimeout = useRef(null)
    const watcherStarted = useRef(false)

    const [settingsOpen, setSettingsOpen] = useState(false)

    /*
    THEME COLORS
    */

    const editorBg =
        themeData?.colors?.["editor.background"] || "#1e1e1e"

    const ui = deriveUIColors(editorBg)

    /*
    APPLY THEME
    */

    useEffect(() => {

        if (!monaco) return

        async function applyTheme() {
            const data = await loadMonacoTheme(monaco, theme)
            setThemeData(data)
        }

        applyTheme()

    }, [theme, monaco])

    /*
    LOAD TYPES
    */

    async function loadTypes(monacoInstance) {

        if (!webcontainer) return

        const loaded = new Set()

        async function walk(dir) {

            let entries

            try {
                entries = await webcontainer.fs.readdir(dir)
            } catch {
                return
            }

            for (const entry of entries) {

                const path = `${dir}/${entry}`

                try {

                    const stat = await webcontainer.fs.stat(path)

                    if (stat.isDirectory()) {

                        if (
                            entry === ".bin" ||
                            entry === "dist" ||
                            entry === "build"
                        ) continue

                        await walk(path)

                    } else if (entry.endsWith(".d.ts")) {

                        if (loaded.has(path)) continue

                        const content =
                            await webcontainer.fs.readFile(path, "utf-8")

                        monacoInstance.languages.typescript.javascriptDefaults.addExtraLib(
                            content,
                            `file://${path}`
                        )

                        loaded.add(path)

                    }

                } catch { }

            }

        }

        await walk("/node_modules")

    }

    /*
    WATCH NODE MODULES
    */

    async function watchNodeModules(monacoInstance) {

        if (!webcontainer) return
        if (watcherStarted.current) return

        watcherStarted.current = true

        try {

            const watcher = await webcontainer.fs.watch("/node_modules", {
                recursive: true
            })

            watcher.on("change", async () => {
                await loadTypes(monacoInstance)
            })

        } catch { }

    }

    /*
    MONACO INIT
    */

    function handleEditorMount(editor, monacoInstance) {

        monacoInstance.languages.typescript.javascriptDefaults.setCompilerOptions({
            target: monacoInstance.languages.typescript.ScriptTarget.ES2020,
            module: monacoInstance.languages.typescript.ModuleKind.ESNext,
            moduleResolution:
                monacoInstance.languages.typescript.ModuleResolutionKind.NodeJs,
            allowNonTsExtensions: true,
            allowJs: true,
            jsx: monacoInstance.languages.typescript.JsxEmit.ReactJSX,
            esModuleInterop: true,
            allowSyntheticDefaultImports: true,
            resolveJsonModule: true,
            strict: false,
            noEmit: true
        })

        loadTypes(monacoInstance)
        watchNodeModules(monacoInstance)

        editor.addCommand(
            monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.KeyS,
            async () => await saveFile()
        )

        editor.addCommand(
            monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.Comma,
            () => setSettingsOpen(true)
        )
    }

    /*
    REGISTER MODELS
    */

    useEffect(() => {

        if (!monaco) return

        Object.entries(contents).forEach(([path, code]) => {

            const uri = monaco.Uri.parse(`file://${path}`)

            let model = monaco.editor.getModel(uri)

            const safeCode = code ?? ""

            if (!model) {

                monaco.editor.createModel(
                    safeCode,
                    getLanguage(path),
                    uri
                )

            } else if (model.getValue() !== safeCode) {

                model.setValue(safeCode)

            }

        })

    }, [contents, monaco])

    /*
    AUTO SAVE (UPDATED)
    */

    useEffect(() => {

        if (!activeFile) return
        if (!autoSave) return

        if (saveTimeout.current) {
            clearTimeout(saveTimeout.current)
        }

        saveTimeout.current = setTimeout(() => {
            saveFile()
        }, autoSaveDelay)

        return () => {
            if (saveTimeout.current) {
                clearTimeout(saveTimeout.current)
            }
        }

    }, [activeFile, contents, autoSave, autoSaveDelay])

    /*
    UI
    */

    return (

        <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>

            {/* HEADER */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    borderBottom: `1px solid ${ui.border}`,
                    background: ui.sidebarBg
                }}
            >
                <div style={{ background: editorBg, flex: 1 }}>
                    <Tabs />
                </div>

                <ActionIcon
                    variant="subtle"
                    mr="xs"
                    onClick={() => setSettingsOpen(true)}
                >
                    <Settings size={16} />
                </ActionIcon>
            </div>

            {/* EDITOR */}
            <div style={{ flex: 1 }}>

                {!activeFile ? (

                    <div
                        style={{
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: editorBg,
                            position: "relative"
                        }}
                    >
                        <img
                            src={image}
                            style={{
                                position: "absolute",
                                width: 520,
                                opacity: 0.08,
                                filter: "blur(1.5px) brightness(1.1)"
                            }}
                        />
                    </div>

                ) : (

                    <Editor
                        height="100%"
                        path={`file://${activeFile}`}
                        language={language}
                        theme={theme}

                        options={{
                            fontSize,
                            fontFamily: editorFontFamily,
                            wordWrap: wordWrap ? "on" : "off",
                            minimap: { enabled: minimap },
                            cursorStyle,
                            automaticLayout: true,
                            quickSuggestions: true,
                            suggestOnTriggerCharacters: true,
                            wordBasedSuggestions: true
                        }}

                        onChange={(value) =>
                            updateContent(value ?? "")
                        }

                        onMount={handleEditorMount}
                    />

                )}

            </div>

            <SettingsPanel
                opened={settingsOpen}
                close={() => setSettingsOpen(false)}
            />

        </div>
    )
}
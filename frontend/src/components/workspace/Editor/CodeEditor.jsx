import Editor, { useMonaco } from "@monaco-editor/react"
import { useEditorStore } from "../../../store/editorStore"
import { getLanguage } from "./languageMap"
import Tabs from "./Tabs"
import { useEffect, useRef } from "react"

export default function CodeEditor() {

    const {
        activeFile,
        contents,
        updateContent,
        saveFile,
        webcontainer
    } = useEditorStore()

    const monaco = useMonaco()

    const fileName = activeFile?.split("/").pop()
    const language = getLanguage(fileName)

    const saveTimeout = useRef(null)
    const watcherStarted = useRef(false)

    /*
    --------------------------------
    LOAD TYPES FROM NODE_MODULES
    --------------------------------
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

                        // skip large folders
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

        console.log("Loaded type files:", loaded.size)

    }

    /*
    --------------------------------
    WATCH NODE_MODULES FOR CHANGES
    --------------------------------
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

                console.log("node_modules updated → reloading types")

                await loadTypes(monacoInstance)

            })

        } catch (err) {

            console.log("Watcher failed:", err)

        }

    }

    /*
    --------------------------------
    MONACO INITIALIZATION
    --------------------------------
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

        monacoInstance.languages.typescript.javascriptDefaults.setDiagnosticsOptions({

            noSemanticValidation: false,
            noSyntaxValidation: false

        })

        // load types
        loadTypes(monacoInstance)

        // watch node_modules
        watchNodeModules(monacoInstance)

        // Ctrl + S
        editor.addCommand(
            monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.KeyS,
            async () => {

                await saveFile()

            }
        )

    }

    /*
    --------------------------------
    REGISTER FILES IN MONACO
    --------------------------------
    */

    useEffect(() => {

        if (!monaco) return

        Object.entries(contents).forEach(([path, code]) => {

            const uri = monaco.Uri.parse(`file://${path}`)

            let model = monaco.editor.getModel(uri)

            if (!model) {

                monaco.editor.createModel(
                    code,
                    getLanguage(path),
                    uri
                )

            } else if (model.getValue() !== code) {

                model.setValue(code)

            }

        })

    }, [contents, monaco])

    /*
    --------------------------------
    AUTO SAVE
    --------------------------------
    */

    useEffect(() => {

        if (!activeFile) return

        if (saveTimeout.current) {
            clearTimeout(saveTimeout.current)
        }

        saveTimeout.current = setTimeout(() => {

            saveFile()

        }, 1500)

        return () => {

            if (saveTimeout.current) {
                clearTimeout(saveTimeout.current)
            }

        }

    }, [contents[activeFile]])

    /*
    --------------------------------
    UI
    --------------------------------
    */

    return (

        <div
            style={{
                height: "100%",
                display: "flex",
                flexDirection: "column"
            }}
        >

            <Tabs />

            <div style={{ flex: 1 }}>

                {activeFile && (

                    <Editor
                        height="100%"
                        path={`file://${activeFile}`}
                        language={language}
                        theme="vs-dark"

                        options={{
                            fontSize: 14,
                            minimap: { enabled: false },
                            automaticLayout: true,
                            quickSuggestions: true,
                            suggestOnTriggerCharacters: true,
                            wordBasedSuggestions: true
                        }}

                        onChange={(value) =>
                            updateContent(value || "")
                        }

                        onMount={handleEditorMount}

                    />

                )}

            </div>

        </div>

    )

}
import Editor from "@monaco-editor/react"
import { useEditorStore } from "../../../store/editorStore"
import { getLanguage } from "./languageMap"
import Tabs from "./Tabs"

export default function CodeEditor() {

    const {
        activeFile,
        contents,
        updateContent,
        saveFile
    } = useEditorStore()

    const fileName = activeFile?.split("/").pop()
    const language = getLanguage(fileName)
    const content = contents[activeFile] || ""

    function handleEditorMount(editor, monaco) {

        editor.addCommand(
            monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
            async () => {

                await saveFile()

                console.log("Saved with Ctrl+S")

            }
        )

    }

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
                        language={language}
                        value={content}
                        theme="vs-dark"

                        options={{
                            fontSize: 14,
                            minimap: { enabled: false },
                            automaticLayout: true
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
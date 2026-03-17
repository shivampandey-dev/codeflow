import { useEffect, useRef, useState } from "react"
import { Terminal as XTerm } from "xterm"
import { FitAddon } from "xterm-addon-fit"
import { Allotment } from "allotment"
import "allotment/dist/style.css"
import "xterm/css/xterm.css"

import { useMediaQuery } from "@mantine/hooks"
import {
    SquareSplitHorizontal,
    Trash2,
    Minimize,
    Expand,
    Terminal as TerminalIcon
} from "lucide-react"

import { useSettingsStore } from "../../../store/settingsStore"
import { deriveUIColors } from "../../../utils/themeColors"

const presetColors = [
    "#22c55e",
    "#38bdf8",
    "#f97316",
    "#a855f7",
    "#e11d48",
    "#facc15"
]

export default function Terminal({
    process,
    logs,
    webcontainer
}) {

    const { themeData } = useSettingsStore()

    const editorBg =
        themeData?.colors?.["editor.background"] || "#1e1e1e"

    const editorFg =
        themeData?.colors?.["editor.foreground"] || "#e2e8f0"

    const ui = deriveUIColors(editorBg)

    const [terms, setTerms] = useState([
        {
            id: crypto.randomUUID(),
            type: "main",
            name: "npm dev",
            color: "#22c55e"
        }
    ])

    const [activeIndex, setActiveIndex] = useState(0)
    const [renameModal, setRenameModal] = useState(null)
    const [fullscreen, setFullscreen] = useState(false)

    const isMobile = useMediaQuery("(max-width:768px)")

    /* SPLIT TERMINAL */

    const addSplit = () => {

        setTerms(prev => [
            ...prev,
            {
                id: crypto.randomUUID(),
                type: "shell",
                name: "bash",
                color: "#38bdf8"
            }
        ])

        setActiveIndex(terms.length)
    }

    const deleteTerminal = () => {

        if (terms.length === 1) return

        setTerms(prev =>
            prev.filter((_, i) => i !== activeIndex)
        )

        setActiveIndex(0)
    }

    const saveRename = (name, color) => {

        setTerms(prev =>
            prev.map((t, i) =>
                i === renameModal.index
                    ? { ...t, name, color }
                    : t
            )
        )

        setRenameModal(null)
    }

    const buttonStyle = {
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "6px",
        display: "flex",
        alignItems: "center",
        color: editorFg
    }

    return (

        <div
            style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                background: ui.sidebarBg
            }}
        >

            {/* TERMINAL TABS */}

            <div
                style={{
                    display: "flex",
                    borderBottom: `1px solid ${ui.border}`,
                    minHeight: 30
                }}
            >

                <div
                    style={{
                        flex: 1,
                        overflowX: "auto",
                        display: "flex"
                    }}
                >

                    {terms.map((term, i) => (

                        <div
                            key={term.id}
                            onClick={() => setActiveIndex(i)}
                            onDoubleClick={() =>
                                setRenameModal({ ...term, index: i })
                            }
                            style={{
                                minWidth: 130,
                                padding: "4px 10px",
                                fontSize: 12,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                borderBottom:
                                    activeIndex === i
                                        ? `2px solid ${term.color}`
                                        : "2px solid transparent",
                                color: editorFg
                            }}
                        >

                            <TerminalIcon size={14} color={term.color} />

                            <span
                                style={{
                                    overflow: "hidden",
                                    textOverflow: "ellipsis"
                                }}
                            >
                                {term.name}
                            </span>

                        </div>

                    ))}

                </div>

                {/* TOOLBAR */}

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        borderLeft: `1px solid ${ui.border}`,
                        paddingLeft: 6
                    }}
                >

                    <button
                        onClick={() => setFullscreen(!fullscreen)}
                        style={buttonStyle}
                    >
                        {fullscreen
                            ? <Minimize size={16} />
                            : <Expand size={16} />}
                    </button>

                    <button
                        onClick={addSplit}
                        style={buttonStyle}
                    >
                        <SquareSplitHorizontal size={16} />
                    </button>

                    {terms.length > 1 && (
                        <button
                            onClick={deleteTerminal}
                            style={buttonStyle}
                        >
                            <Trash2 size={16} />
                        </button>
                    )}

                </div>

            </div>

            {/* TERMINAL PANES */}

            {isMobile ? (

                <div style={{ flex: 1 }}>

                    {terms.map((term, idx) => (

                        <TerminalInstance
                            key={term.id}
                            type={term.type}
                            process={process}
                            logs={logs}
                            webcontainer={webcontainer}
                            isActive={activeIndex === idx}
                            editorBg={editorBg}
                            editorFg={editorFg}
                        />

                    ))}

                </div>

            ) : (

                <Allotment key={terms.length}>

                    {terms.map((term, idx) => (

                        <Allotment.Pane key={term.id}>

                            <TerminalInstance
                                type={term.type}
                                process={process}
                                logs={logs}
                                webcontainer={webcontainer}
                                isActive={activeIndex === idx}
                                editorBg={editorBg}
                                editorFg={editorFg}
                            />

                        </Allotment.Pane>

                    ))}

                </Allotment>

            )}

            {renameModal && (
                <RenameModal
                    data={renameModal}
                    onSave={saveRename}
                    onClose={() => setRenameModal(null)}
                />
            )}

        </div>
    )
}


/* TERMINAL INSTANCE */

function TerminalInstance({
    type,
    process,
    logs,
    webcontainer,
    isActive,
    editorBg,
    editorFg
}) {

    const containerRef = useRef(null)
    const termRef = useRef(null)
    const fitAddonRef = useRef(null)

    const lastIndexRef = useRef(0)
    const attachedRef = useRef(false)

    useEffect(() => {

        const term = new XTerm({
            allowTransparency: true,
            fontSize: 12,
            cursorBlink: true,
            scrollback: 5000,
            theme: {
                background: editorBg,
                foreground: editorFg,
                cursor: editorFg,
                selectionBackground: editorFg + "33"
            }
        })

        const fitAddon = new FitAddon()

        term.loadAddon(fitAddon)

        term.open(containerRef.current)

        fitAddon.fit()

        term.refresh(0, term.rows)

        termRef.current = term
        fitAddonRef.current = fitAddon

        const resizeObserver = new ResizeObserver(() => {
            fitAddon.fit()
        })

        resizeObserver.observe(containerRef.current)

        return () => {
            resizeObserver.disconnect()
            term.dispose()
        }

    }, [editorBg, editorFg])


    /* MAIN TERMINAL OUTPUT */

    useEffect(() => {

        if (type !== "main") return
        if (!logs || !termRef.current) return

        const term = termRef.current

        const newData = logs.slice(lastIndexRef.current)

        if (newData) {

            term.write(newData)

            lastIndexRef.current = logs.length

        }

    }, [logs])


    /* MAIN TERMINAL INPUT */

    useEffect(() => {

        if (type !== "main") return
        if (!process || !termRef.current) return
        if (attachedRef.current) return

        attachedRef.current = true

        const term = termRef.current
        const writer = process.input.getWriter()

        const disposable = term.onData(data => {
            writer.write(data)
        })

        return () => {

            disposable.dispose()

            try {
                writer.releaseLock()
            } catch { }

            attachedRef.current = false

        }

    }, [process])


    /* SHELL TERMINAL */

    useEffect(() => {

        if (type !== "shell") return
        if (!webcontainer || !termRef.current) return

        const startShell = async () => {

            const term = termRef.current

            const shell = await webcontainer.spawn("jsh", {
                terminal: {
                    cols: term.cols,
                    rows: term.rows
                }
            })

            shell.output.pipeTo(
                new WritableStream({
                    write(data) {
                        term.write(data)
                    }
                })
            )

            const writer = shell.input.getWriter()

            term.onData(data => writer.write(data))

        }

        startShell()

    }, [webcontainer])


    return (

        <div
            style={{
                height: "100%",
                border: isActive
                    ? `2px solid ${editorFg}33`
                    : `1px solid ${editorFg}22`
            }}
        >

            <div
                ref={containerRef}
                style={{
                    height: "100%",
                    width: "100%"
                }}
            />

        </div>

    )
}


/* RENAME MODAL */

function RenameModal({ data, onSave, onClose }) {

    const [name, setName] = useState(data.name)
    const [color, setColor] = useState(data.color)

    return (

        <div
            style={{
                position: "absolute",
                top: "35%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                background: "#020617",
                border: "1px solid #1e293b",
                padding: 16,
                width: 260
            }}
        >

            <div>Terminal Name</div>

            <input
                value={name}
                onChange={e => setName(e.target.value)}
                style={{
                    width: "100%",
                    padding: 6,
                    marginBottom: 10
                }}
            />

            <div style={{ display: "flex", gap: 6 }}>

                {presetColors.map(c => (

                    <div
                        key={c}
                        onClick={() => setColor(c)}
                        style={{
                            width: 18,
                            height: 18,
                            background: c,
                            cursor: "pointer",
                            border:
                                color === c
                                    ? "2px solid white"
                                    : "none"
                        }}
                    />

                ))}

            </div>

            <div style={{ marginTop: 14 }}>

                <button onClick={onClose}>Cancel</button>
                <button onClick={() => onSave(name, color)}>
                    Save
                </button>

            </div>

        </div>

    )
}
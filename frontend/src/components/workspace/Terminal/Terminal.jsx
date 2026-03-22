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
import { loadFont } from "../../../utils/loadFont"

/* ================= MAIN ================= */

export default function Terminal({
    process,
    logs,
    webcontainer,
    fullscreen,
    setFullscreen
}) {

    const { themeData } = useSettingsStore()

    const editorBg = themeData?.colors?.["editor.background"] || "#1e1e1e"
    const editorFg = themeData?.colors?.["editor.foreground"] || "#e2e8f0"

    const ui = deriveUIColors(editorBg)

    const accent = "#38bdf8"

    const [terms, setTerms] = useState([
        {
            id: crypto.randomUUID(),
            type: "main",
            name: "npm dev",
            color: "#22c55e"
        }
    ])

    const [activeIndex, setActiveIndex] = useState(0)

    const isMobile = useMediaQuery("(max-width:768px)")

    const buttonStyle = {
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "6px",
        display: "flex",
        alignItems: "center",
        color: accent
    }

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
        setTerms(prev => prev.filter((_, i) => i !== activeIndex))
        setActiveIndex(0)
    }

    return (
        <div style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            background: ui.sidebarBg,
            minHeight: 0
        }}>

            {/* HEADER */}
            <div style={{ display: "flex", borderBottom: `1px solid ${ui.border}` }}>

                <div style={{ flex: 1, display: "flex", overflowX: "auto" }}>
                    {terms.map((term, i) => (
                        <div
                            key={term.id}
                            onClick={() => setActiveIndex(i)}
                            style={{
                                minWidth: 130,
                                padding: "4px 10px",
                                fontSize: 12,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                borderBottom: activeIndex === i
                                    ? `2px solid ${accent}`
                                    : "transparent",
                                color: editorFg
                            }}
                        >
                            <TerminalIcon
                                size={14}
                                color={activeIndex === i ? accent : "#64748b"}
                            />
                            {term.name}
                        </div>
                    ))}
                </div>

                {/* TOOLBAR */}
                <div style={{ display: "flex", gap: 4 }}>
                    <button onClick={() => setFullscreen(!fullscreen)} style={buttonStyle}>
                        {fullscreen ? <Minimize size={16} /> : <Expand size={16} />}
                    </button>

                    <button onClick={addSplit} style={buttonStyle}>
                        <SquareSplitHorizontal size={16} />
                    </button>

                    {terms.length > 1 && (
                        <button onClick={deleteTerminal} style={buttonStyle}>
                            <Trash2 size={16} />
                        </button>
                    )}
                </div>
            </div>

            {/* TERMINAL AREA */}
            {isMobile ? (
                <div style={{ flex: 1, minHeight: 0 }}>
                    {terms.map((term, idx) => (
                        <TerminalInstance
                            key={term.id}
                            {...term}
                            process={process}
                            logs={logs}
                            webcontainer={webcontainer}
                            isActive={activeIndex === idx}
                            editorBg={editorBg}
                            editorFg={editorFg}
                            fullscreen={fullscreen}
                        />
                    ))}
                </div>
            ) : (
                <Allotment>
                    {terms.map((term, idx) => (
                        <Allotment.Pane key={term.id}>
                            <TerminalInstance
                                {...term}
                                process={process}
                                logs={logs}
                                webcontainer={webcontainer}
                                isActive={activeIndex === idx}
                                editorBg={editorBg}
                                editorFg={editorFg}
                                fullscreen={fullscreen}
                            />
                        </Allotment.Pane>
                    ))}
                </Allotment>
            )}
        </div>
    )
}

/* ================= TERMINAL INSTANCE ================= */

function TerminalInstance({
    type,
    process,
    logs,
    webcontainer,
    isActive,
    editorBg,
    editorFg,
    fullscreen
}) {

    const containerRef = useRef(null)
    const termRef = useRef(null)
    const fitAddonRef = useRef(null)

    // ✅ Ref so onData always sees current isActive without stale closure
    const isActiveRef = useRef(isActive)
    useEffect(() => {
        isActiveRef.current = isActive
    }, [isActive])

    const lastIndexRef = useRef(0)
    const attachedRef = useRef(false)

    const {
        terminalFontSize,
        terminalFontFamily,
        terminalFontWeight,
        terminalFontItalic,
        cursorBlink,
        scrollback,
        lineHeight
    } = useSettingsStore()

    /*
    =========================
    🔥 LOAD FONT
    =========================
    */
    useEffect(() => {
        loadFont(terminalFontFamily, terminalFontWeight, terminalFontItalic)
    }, [terminalFontFamily, terminalFontWeight, terminalFontItalic])

    /*
    =========================
    TERMINAL INIT
    =========================
    */
    useEffect(() => {

        const term = new XTerm({
            fontSize: terminalFontSize,
            fontFamily: `"${terminalFontFamily}", monospace`,
            fontWeight: terminalFontWeight,
            fontStyle: terminalFontItalic ? "italic" : "normal",
            lineHeight,
            cursorBlink,
            scrollback,
            theme: {
                background: editorBg,
                foreground: editorFg
            }
        })

        const fitAddon = new FitAddon()
        term.loadAddon(fitAddon)

        term.open(containerRef.current)

        termRef.current = term
        fitAddonRef.current = fitAddon

        setTimeout(() => fitAddon.fit(), 50)

        lastIndexRef.current = 0

        const resizeObserver = new ResizeObserver(() => {
            fitAddon.fit()
        })

        resizeObserver.observe(containerRef.current)

        return () => {
            resizeObserver.disconnect()
            term.dispose()
        }

    }, [
        terminalFontSize,
        terminalFontFamily,
        terminalFontWeight,
        terminalFontItalic,
        cursorBlink,
        scrollback,
        lineHeight,
        editorBg,
        editorFg
    ])

    /*
    =========================
    RESIZE — also forward to shell process so PTY cols/rows stay in sync
    =========================
    */
    useEffect(() => {
        if (!fitAddonRef.current) return

        const t = setTimeout(() => {
            fitAddonRef.current.fit()

            // ✅ Resize the jsh PTY to match xterm dimensions
            if (process?.resize && termRef.current) {
                try {
                    process.resize(termRef.current.cols, termRef.current.rows)
                } catch { }
            }
        }, 80)

        return () => clearTimeout(t)

    }, [fullscreen, isActive, process])

    /*
    =========================
    LOG STREAM (main terminal only)
    Reads new chunks from the accumulated `logs` string and writes
    them to xterm. Strips __STATUS__ control lines before display.
    =========================
    */
    useEffect(() => {

        if (type !== "main") return
        if (!logs || !termRef.current) return

        const term = termRef.current

        // Handle reset (e.g. project reload clears logs)
        if (logs.length < lastIndexRef.current) {
            lastIndexRef.current = 0
        }

        const newData = logs.slice(lastIndexRef.current)
        lastIndexRef.current = logs.length

        if (!newData) return

        // ✅ Strip __STATUS__:... control lines — they are for app state only,
        // not for display. Replace the whole line including surrounding \r\n.
        const filtered = newData.replace(/\r?\n?__STATUS__:[^\r\n]*\r?\n?/g, "")

        if (filtered) {
            term.write(filtered)
        }

    }, [logs])

    /*
    =========================
    PROCESS INPUT (main terminal)

    Now that startDevServer spawns a `jsh` PTY (same as the split shell),
    this effect is straightforward: every keystroke goes straight to the
    shell's stdin.

    Ctrl+C (\x03) is passed through unchanged — jsh receives it, sends
    SIGINT to the foreground process (npm install / npm run dev), and
    automatically returns its own prompt when the child exits.
    No manual kill() or fallback shell needed.
    =========================
    */
    useEffect(() => {

        if (type !== "main") return
        if (!process || !termRef.current) return
        if (attachedRef.current) return

        attachedRef.current = true

        let writer

        const disposable = termRef.current.onData(async (data) => {

            // Only the active (focused) terminal pane sends input
            if (!isActiveRef.current) return

            try {
                if (!writer) {
                    // jsh always has a writable stdin — this will succeed
                    if (!process?.input) return
                    writer = process.input.getWriter()
                }
                // Forward ALL keystrokes including \x03 (Ctrl+C) to jsh.
                // The shell's PTY layer handles SIGINT, echo, line discipline.
                await writer.write(data)
            } catch (err) {
                console.error("[terminal input error]", err)
            }
        })

        return () => {
            disposable.dispose()
            try { writer?.releaseLock() } catch { }
            attachedRef.current = false
        }

    }, [process])

    /*
    =========================
    SHELL MODE (split terminals)
    Identical to before — spawn jsh and connect stdin/stdout directly.
    =========================
    */
    useEffect(() => {

        if (type !== "shell") return
        if (!webcontainer || !termRef.current) return

        const startShell = async () => {

            const term = termRef.current

            const shell = await webcontainer.spawn("jsh", {
                terminal: { cols: term.cols, rows: term.rows }
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

            // Keep PTY size in sync for split shells too
            term.onResize(({ cols, rows }) => {
                try { shell.resize?.(cols, rows) } catch { }
            })
        }

        startShell()

    }, [webcontainer])

    return (
        <div style={{
            height: "100%",
            minHeight: 0,
            border: isActive ? "2px solid #38bdf833" : "1px solid #8882"
        }}>
            <div ref={containerRef} style={{ height: "100%" }} />
        </div>
    )
}
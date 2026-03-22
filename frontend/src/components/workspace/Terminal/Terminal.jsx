import { useEffect, useRef, useState, useCallback } from "react"
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
    Terminal as TerminalIcon,
    StopCircle,
    PlayCircle
} from "lucide-react"

import { useSettingsStore } from "../../../store/settingsStore"
import { deriveUIColors } from "../../../utils/themeColors"
import { loadFont } from "../../../utils/loadFont"
import {
    startDevServer,
    killDevServer,
    isServerRunning
} from "../../../pages/runtime/webcontainer/startDevServer"

/* ================= MAIN ================= */

export default function Terminal({
    process,
    logs,
    webcontainer,
    fullscreen,
    setFullscreen,
    onProcessChange,
    onLogsChange
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

    // "booting" | "stopped" | "running"
    const [serverState, setServerState] = useState("booting")

    // Transition out of booting once webcontainer is ready
    useEffect(() => {
        if (!webcontainer) {
            setServerState("booting")
            return
        }
        setServerState(isServerRunning() ? "running" : "stopped")
    }, [webcontainer])

    // Sync button when process prop changes from outside
    useEffect(() => {
        if (!webcontainer) return
        setServerState(process ? "running" : "stopped")
    }, [process, webcontainer])

    const isMobile = useMediaQuery("(max-width:768px)")

    const iconButtonStyle = {
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "5px 6px",
        display: "flex",
        alignItems: "center",
        color: accent
    }

    const serverButtonStyle = (color) => ({
        background: "none",
        border: `1px solid ${color}33`,
        borderRadius: 4,
        cursor: "pointer",
        padding: "3px 8px",
        display: "flex",
        alignItems: "center",
        gap: 5,
        fontSize: 11,
        fontWeight: 500,
        color,
        margin: "0 2px"
    })

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

        const deletedTerm = terms[activeIndex]

        setTerms(prev => {
            const next = prev.filter((_, i) => i !== activeIndex)

            // ✅ If we deleted the "main" terminal (log receiver), promote
            // the first remaining terminal so server logs keep showing.
            if (deletedTerm.type === "main") {
                next[0] = { ...next[0], type: "main" }
            }

            return next
        })

        setActiveIndex(prev => Math.max(0, prev - 1))
    }

    // ✅ Called by startDevServer's detection loop when npm exits
    const handleServerStopped = useCallback(() => {
        setServerState("stopped")
        onProcessChange?.(null)
    }, [onProcessChange])

    // ✅ Stop: sends \x03 into jsh stdin — same as Ctrl+C in terminal
    const handleStop = useCallback(async () => {
        await killDevServer()
        // State will update via handleServerStopped callback when
        // the detection loop sees the prompt return — no optimistic setState
        // needed, but set it anyway for instant UI feedback
        setServerState("stopped")
        onProcessChange?.(null)
    }, [onProcessChange])

    // ✅ Start: re-runs flow with skipInstall=true — only runs npm run dev
    const handleStart = useCallback(async () => {
        if (!webcontainer) return
        setServerState("running")
        await startDevServer(
            webcontainer,
            (data) => onLogsChange?.(data),
            (proc) => {
                onProcessChange?.(proc)
                if (proc) setServerState("running")
            },
            handleServerStopped,
            true   // ✅ skipInstall — deps already installed
        )
    }, [webcontainer, onProcessChange, onLogsChange, handleServerStopped])

    return (
        <div style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            background: ui.sidebarBg,
            minHeight: 0
        }}>

            {/* HEADER */}
            <div style={{ display: "flex", borderBottom: `1px solid ${ui.border}`, alignItems: "center" }}>

                {/* TABS */}
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
                                    : "2px solid transparent",
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
                <div style={{ display: "flex", alignItems: "center", paddingRight: 4 }}>

                    {/* SERVER STATUS BUTTON — only when webcontainer is ready */}
                    {serverState === "running" && (
                        <button
                            onClick={handleStop}
                            title="Stop dev server"
                            style={serverButtonStyle("#f87171")}
                        >
                            <StopCircle size={13} />
                            Stop
                        </button>
                    )}

                    {serverState === "stopped" && (
                        <button
                            onClick={handleStart}
                            title="Start dev server"
                            style={serverButtonStyle("#4ade80")}
                        >
                            <PlayCircle size={13} />
                            Start
                        </button>
                    )}

                    {/* booting → render nothing for the server button */}

                    {serverState !== "booting" && (
                        <div style={{
                            width: 1,
                            height: 14,
                            background: ui.border,
                            margin: "0 4px"
                        }} />
                    )}

                    <button onClick={() => setFullscreen(!fullscreen)} style={iconButtonStyle}>
                        {fullscreen ? <Minimize size={15} /> : <Expand size={15} />}
                    </button>

                    <button onClick={addSplit} style={iconButtonStyle}>
                        <SquareSplitHorizontal size={15} />
                    </button>

                    {terms.length > 1 && (
                        <button onClick={deleteTerminal} style={iconButtonStyle}>
                            <Trash2 size={15} />
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

    const isActiveRef = useRef(isActive)
    useEffect(() => { isActiveRef.current = isActive }, [isActive])

    const lastIndexRef = useRef(0)
    const attachedRef = useRef(false)
    // ✅ Bumped when this terminal is promoted to "main" so the log effect re-fires
    const [logFlush, setLogFlush] = useState(0)

    const {
        terminalFontSize,
        terminalFontFamily,
        terminalFontWeight,
        terminalFontItalic,
        cursorBlink,
        scrollback,
        lineHeight
    } = useSettingsStore()

    useEffect(() => {
        loadFont(terminalFontFamily, terminalFontWeight, terminalFontItalic)
    }, [terminalFontFamily, terminalFontWeight, terminalFontItalic])

    /* TERMINAL INIT */
    useEffect(() => {
        const term = new XTerm({
            fontSize: terminalFontSize,
            fontFamily: `"${terminalFontFamily}", monospace`,
            fontWeight: terminalFontWeight,
            fontStyle: terminalFontItalic ? "italic" : "normal",
            lineHeight,
            cursorBlink,
            scrollback,
            theme: { background: editorBg, foreground: editorFg }
        })

        const fitAddon = new FitAddon()
        term.loadAddon(fitAddon)
        term.open(containerRef.current)

        termRef.current = term
        fitAddonRef.current = fitAddon

        setTimeout(() => fitAddon.fit(), 50)
        lastIndexRef.current = 0

        const ro = new ResizeObserver(() => fitAddon.fit())
        ro.observe(containerRef.current)

        return () => { ro.disconnect(); term.dispose() }

    }, [
        terminalFontSize, terminalFontFamily, terminalFontWeight,
        terminalFontItalic, cursorBlink, scrollback, lineHeight,
        editorBg, editorFg
    ])

    /* RESIZE */
    useEffect(() => {
        if (!fitAddonRef.current) return
        const t = setTimeout(() => {
            fitAddonRef.current.fit()
            if (process?.resize && termRef.current) {
                try { process.resize(termRef.current.cols, termRef.current.rows) } catch { }
            }
        }, 80)
        return () => clearTimeout(t)
    }, [fullscreen, isActive, process])

    /* PROMOTION: when this terminal is promoted to "main" (e.g. the original
       main terminal was deleted), immediately write all existing logs so the
       user doesn't see a blank terminal while the server is running. */
    useEffect(() => {
        if (type !== "main") return
        lastIndexRef.current = 0          // rewind so full log history is written
        setLogFlush(n => n + 1)           // force the log effect to re-fire
    }, [type]) // eslint-disable-line react-hooks/exhaustive-deps

    /* LOG STREAM — only the "main" terminal shows server logs */
    useEffect(() => {
        if (type !== "main") return
        if (!logs || !termRef.current) return

        if (logs.length < lastIndexRef.current) lastIndexRef.current = 0

        const newData = logs.slice(lastIndexRef.current)
        lastIndexRef.current = logs.length
        if (!newData) return

        const filtered = newData.replace(/\r?\n?__STATUS__:[^\r\n]*\r?\n?/g, "")
        if (filtered) termRef.current.write(filtered)

    }, [logs, logFlush])

    /* PROCESS INPUT (main terminal)
       ✅ terminal gets its OWN writer — separate from signalWriter in startDevServer.
       Both writers coexist on jsh stdin without conflict. */
    useEffect(() => {
        if (type !== "main") return
        if (!process || !termRef.current) return
        if (attachedRef.current) return

        attachedRef.current = true
        let writer

        const disposable = termRef.current.onData(async (data) => {
            if (!isActiveRef.current) return
            try {
                if (!writer) {
                    if (!process?.input) return
                    writer = process.input.getWriter()
                }
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

    /* SHELL MODE (split terminals) */
    useEffect(() => {
        if (type !== "shell") return
        if (!webcontainer || !termRef.current) return

        const startShell = async () => {
            const term = termRef.current
            const shell = await webcontainer.spawn("jsh", {
                terminal: { cols: term.cols, rows: term.rows }
            })
            shell.output.pipeTo(new WritableStream({
                write(data) { term.write(data) }
            }))
            const writer = shell.input.getWriter()
            term.onData(data => writer.write(data))
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
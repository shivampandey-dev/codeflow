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
    PlayCircle,
    Check,
    X
} from "lucide-react"

import { useSettingsStore } from "../../../store/settingsStore"
import { deriveUIColors } from "../../../utils/themeColors"
import { loadFont } from "../../../utils/loadFont"

import {
    startDevServer,
    killDevServer,
} from "../../../pages/runtime/webcontainer/startDevServer"

import {
    startBackendServer,
    killBackendServer,
} from "../../../pages/runtime/webcontainer/startBackendServer"

// ── Palette for the color picker ─────────────────────────────────────────────
const TAB_COLORS = [
    "#22c55e", "#38bdf8", "#fb923c", "#f87171",
    "#a78bfa", "#f472b6", "#facc15", "#34d399",
    "#e879f9", "#67e8f9", "#fbbf24", "#a3e635"
]

export default function Terminal({
    process,
    logs,
    webcontainer,
    fullscreen,
    setFullscreen,
    onProcessChange,
    onLogsChange,
    isBackend = false
}) {
    const { themeData } = useSettingsStore()

    const editorBg = themeData?.colors?.["editor.background"] || "#1e1e1e"
    const editorFg = themeData?.colors?.["editor.foreground"] || "#e2e8f0"

    const ui = deriveUIColors(editorBg)
    const accent = "#38bdf8"

    const killServer = isBackend ? killBackendServer : killDevServer
    const startServer = isBackend ? startBackendServer : startDevServer
    const tabLabel = isBackend ? "server" : "Runtime"
    const tabColor = isBackend ? "#fb923c" : "#22c55e"

    const [terms, setTerms] = useState([
        { id: crypto.randomUUID(), type: "main", name: tabLabel, color: tabColor }
    ])
    const [activeIndex, setActiveIndex] = useState(0)
    const [serverState, setServerState] = useState("booting")

    // ── Tab edit state ────────────────────────────────────────────────────────
    const [editingIdx, setEditingIdx] = useState(null)   // which tab is being edited
    const [editName, setEditName] = useState("")
    const [editColor, setEditColor] = useState("")
    const editPopupRef = useRef(null)
    const editInputRef = useRef(null)

    // Close popup on outside click
    useEffect(() => {
        if (editingIdx === null) return
        const onMouseDown = (e) => {
            if (editPopupRef.current && !editPopupRef.current.contains(e.target)) {
                setEditingIdx(null)
            }
        }
        document.addEventListener("mousedown", onMouseDown)
        return () => document.removeEventListener("mousedown", onMouseDown)
    }, [editingIdx])

    // Focus input when popup opens
    useEffect(() => {
        if (editingIdx !== null) {
            setTimeout(() => editInputRef.current?.focus(), 50)
        }
    }, [editingIdx])

    // ── Server state machine ──────────────────────────────────────────────────
    useEffect(() => { setServerState("booting") }, [])
    useEffect(() => { if (!webcontainer) setServerState("booting") }, [webcontainer])
    useEffect(() => {
        if (!webcontainer) return
        if (process) {
            setServerState("running")
        } else if (serverState === "running") {
            setServerState("stopped")
        }
    }, [process, webcontainer])  // eslint-disable-line react-hooks/exhaustive-deps

    const isMobile = useMediaQuery("(max-width:768px)")

    // ── Styles ────────────────────────────────────────────────────────────────
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

    // ── Tab actions ───────────────────────────────────────────────────────────
    const addSplit = () => {
        setTerms(prev => [
            ...prev,
            { id: crypto.randomUUID(), type: "shell", name: "bash", color: "#38bdf8" }
        ])
        setActiveIndex(terms.length)
    }

    const deleteTerminal = () => {
        if (terms.length === 1) return
        const deletedTerm = terms[activeIndex]
        setTerms(prev => {
            const next = prev.filter((_, i) => i !== activeIndex)
            if (deletedTerm.type === "main") {
                next[0] = { ...next[0], type: "main" }
            }
            return next
        })
        setActiveIndex(prev => Math.max(0, prev - 1))
    }

    // Double-click opens the name/color popup
    const handleTabDoubleClick = (e, idx) => {
        e.stopPropagation()
        setEditingIdx(idx)
        setEditName(terms[idx].name)
        setEditColor(terms[idx].color)
    }

    const applyEdit = () => {
        if (editingIdx === null) return
        setTerms(prev => prev.map((t, i) =>
            i === editingIdx
                ? { ...t, name: editName.trim() || t.name, color: editColor || t.color }
                : t
        ))
        setEditingIdx(null)
    }

    const cancelEdit = () => setEditingIdx(null)

    // ── Server controls ───────────────────────────────────────────────────────
    const handleServerStopped = useCallback(() => {
        setServerState("stopped")
        onProcessChange?.(null)
    }, [onProcessChange])

    const handleStop = useCallback(async () => {
        await killServer()
        setServerState("stopped")
        onProcessChange?.(null)
    }, [killServer, onProcessChange])

    const handleStart = useCallback(async () => {
        if (!webcontainer) return
        setServerState("running")
        await startServer(
            webcontainer,
            (data) => onLogsChange?.(data),
            (proc) => {
                onProcessChange?.(proc)
                if (proc) setServerState("running")
            },
            handleServerStopped,
            true    // skipInstall
        )
    }, [webcontainer, startServer, onProcessChange, onLogsChange, handleServerStopped])

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            background: ui.sidebarBg,
            minHeight: 0,
            position: "relative"   // needed for popup absolute positioning
        }}>
            {/* ── HEADER ── */}
            <div style={{
                display: "flex",
                borderBottom: `1px solid ${ui.border}`,
                alignItems: "center"
            }}>
                {/* TABS */}
                <div style={{ flex: 1, display: "flex", overflowX: "auto" }}>
                    {terms.map((term, i) => {
                        const isActive = activeIndex === i
                        const tabAccent = term.color || accent
                        return (
                            <div
                                key={term.id}
                                onClick={() => setActiveIndex(i)}
                                onDoubleClick={(e) => handleTabDoubleClick(e, i)}
                                title="Double-click to rename / recolor"
                                style={{
                                    minWidth: 130,
                                    padding: "4px 10px",
                                    fontSize: 12,
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6,
                                    borderBottom: isActive
                                        ? `2px solid ${tabAccent}`
                                        : "2px solid transparent",
                                    color: isActive ? tabAccent : editorFg,
                                    userSelect: "none"
                                }}
                            >
                                <TerminalIcon
                                    size={14}
                                    color={isActive ? tabAccent : "#64748b"}
                                />
                                {term.name}
                            </div>
                        )
                    })}
                </div>

                {/* TOOLBAR */}
                <div style={{ display: "flex", alignItems: "center", paddingRight: 4 }}>
                    {serverState === "running" && (
                        <button
                            onClick={handleStop}
                            title="Stop server"
                            style={serverButtonStyle("#f87171")}
                        >
                            <StopCircle size={13} /> Stop
                        </button>
                    )}
                    {serverState === "stopped" && (
                        <button
                            onClick={handleStart}
                            title="Start server"
                            style={serverButtonStyle("#4ade80")}
                        >
                            <PlayCircle size={13} /> Start
                        </button>
                    )}
                    {serverState !== "booting" && (
                        <div style={{ width: 1, height: 14, background: ui.border, margin: "0 4px" }} />
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

            {/* ── TAB EDIT POPUP ── */}
            {editingIdx !== null && (() => {
                // Clamp popup so it doesn't overflow right edge
                const approxLeft = editingIdx * 130
                return (
                    <div
                        ref={editPopupRef}
                        style={{
                            position: "absolute",
                            top: 37,
                            left: approxLeft,
                            zIndex: 200,
                            background: ui.sidebarBg || "#0f172a",
                            border: `1px solid ${ui.border}`,
                            borderRadius: 8,
                            padding: "12px 14px",
                            minWidth: 210,
                            boxShadow: "0 12px 32px rgba(0,0,0,0.5)"
                        }}
                    >
                        {/* Name input */}
                        <div style={{ fontSize: 10, color: "#64748b", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                            Tab name
                        </div>
                        <input
                            ref={editInputRef}
                            value={editName}
                            onChange={e => setEditName(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === "Enter") applyEdit()
                                if (e.key === "Escape") cancelEdit()
                            }}
                            placeholder="Enter name…"
                            style={{
                                width: "100%",
                                background: "transparent",
                                border: `1px solid ${ui.border}`,
                                borderRadius: 4,
                                color: editorFg,
                                padding: "5px 8px",
                                fontSize: 12,
                                outline: "none",
                                boxSizing: "border-box"
                            }}
                        />

                        {/* Color picker */}
                        <div style={{ fontSize: 10, color: "#64748b", margin: "10px 0 6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                            Color
                        </div>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                            {TAB_COLORS.map(c => (
                                <button
                                    key={c}
                                    onClick={() => setEditColor(c)}
                                    title={c}
                                    style={{
                                        width: 22,
                                        height: 22,
                                        borderRadius: "50%",
                                        background: c,
                                        border: editColor === c
                                            ? "2px solid #fff"
                                            : "2px solid transparent",
                                        outline: editColor === c ? `2px solid ${c}` : "none",
                                        cursor: "pointer",
                                        padding: 0,
                                        transition: "transform 0.1s",
                                        transform: editColor === c ? "scale(1.2)" : "scale(1)"
                                    }}
                                />
                            ))}
                        </div>

                        {/* Preview swatch + actions */}
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
                            <div style={{
                                flex: 1,
                                fontSize: 11,
                                color: editColor,
                                background: `${editColor}18`,
                                border: `1px solid ${editColor}44`,
                                borderRadius: 4,
                                padding: "3px 8px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap"
                            }}>
                                {editName || terms[editingIdx]?.name}
                            </div>
                            <button
                                onClick={applyEdit}
                                title="Apply (Enter)"
                                style={{
                                    background: "#22c55e22",
                                    border: "1px solid #22c55e55",
                                    borderRadius: 4,
                                    color: "#22c55e",
                                    cursor: "pointer",
                                    padding: "4px 6px",
                                    display: "flex",
                                    alignItems: "center"
                                }}
                            >
                                <Check size={13} />
                            </button>
                            <button
                                onClick={cancelEdit}
                                title="Cancel (Esc)"
                                style={{
                                    background: "#f8717122",
                                    border: "1px solid #f8717155",
                                    borderRadius: 4,
                                    color: "#f87171",
                                    cursor: "pointer",
                                    padding: "4px 6px",
                                    display: "flex",
                                    alignItems: "center"
                                }}
                            >
                                <X size={13} />
                            </button>
                        </div>
                    </div>
                )
            })()}

            {/* ── TERMINAL PANES ── */}
            {isMobile ? (
                <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
                    {terms.map((term, idx) => (
                        <div
                            key={term.id}
                            style={{
                                position: "absolute",
                                inset: 0,
                                display: activeIndex === idx ? "flex" : "none",
                                flexDirection: "column",
                            }}
                        >
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
                        </div>
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

/* ─────────────────────────────────────────────────────────────────────────────
   TERMINAL INSTANCE
───────────────────────────────────────────────────────────────────────────── */

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

    // Track isActive without causing effect re-runs
    const isActiveRef = useRef(isActive)
    useEffect(() => { isActiveRef.current = isActive }, [isActive])

    const lastIndexRef = useRef(0)
    const [logFlush, setLogFlush] = useState(0)

    // ── FIX: increment each time the XTerm instance is recreated so that
    //         keyboard / shell effects re-subscribe to the NEW terminal.
    const [termVersion, setTermVersion] = useState(0)

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

    // ── INIT XTERM ─────────────────────────────────────────────────────────────
    useEffect(() => {
        if (!containerRef.current) return

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
        lastIndexRef.current = 0

        setTimeout(() => fitAddon.fit(), 50)

        const ro = new ResizeObserver(() => {
            try { fitAddon.fit() } catch { }
        })
        ro.observe(containerRef.current)

        // Signal a new terminal instance exists — this causes keyboard/shell
        // effects to re-run and attach to the new XTerm object.
        setTermVersion(v => v + 1)

        return () => {
            ro.disconnect()
            term.dispose()
        }
    }, [
        terminalFontSize, terminalFontFamily, terminalFontWeight,
        terminalFontItalic, cursorBlink, scrollback, lineHeight,
        editorBg, editorFg
    ])

    // ── RESIZE ─────────────────────────────────────────────────────────────────
    useEffect(() => {
        if (!fitAddonRef.current) return
        const t = setTimeout(() => {
            try { fitAddonRef.current?.fit() } catch { }
            if (process?.resize && termRef.current) {
                try { process.resize(termRef.current.cols, termRef.current.rows) } catch { }
            }
        }, 80)
        return () => clearTimeout(t)
    }, [fullscreen, isActive, process])

    // ── PROMOTION (tab becomes "main") ─────────────────────────────────────────
    useEffect(() => {
        if (type !== "main") return
        lastIndexRef.current = 0
        setLogFlush(n => n + 1)
    }, [type])  // eslint-disable-line react-hooks/exhaustive-deps

    // ── LOG STREAM ─────────────────────────────────────────────────────────────
    useEffect(() => {
        if (type !== "main") return
        if (!logs || !termRef.current) return

        if (logs.length < lastIndexRef.current) lastIndexRef.current = 0

        const newData = logs.slice(lastIndexRef.current)
        lastIndexRef.current = logs.length
        if (!newData) return

        const filtered = newData.replace(/\r?\n?__STATUS__:[^\r\n]*\r?\n?/g, "")
        if (filtered) termRef.current.write(filtered)
    }, [logs, logFlush, termVersion])   // termVersion replays logs into fresh terminal

    // ── KEYBOARD INPUT ─────────────────────────────────────────────────────────
    // FIX: removed `attachedRef` guard — the cleanup + termVersion dependency
    //      is sufficient to prevent double-attachment and to re-attach when
    //      the XTerm instance is recreated (e.g. after theme/font changes).
    useEffect(() => {
        if (type !== "main") return
        if (!process || !termRef.current) return

        let writer = null

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
        }
    }, [process, type, termVersion])    // termVersion re-attaches on terminal recreate

    // ── SHELL MODE ─────────────────────────────────────────────────────────────
    useEffect(() => {
        if (type !== "shell") return
        if (!webcontainer || !termRef.current) return

        let cancelled = false

        const startShell = async () => {
            const term = termRef.current
            const shell = await webcontainer.spawn("jsh", {
                terminal: { cols: term.cols, rows: term.rows }
            })

            if (cancelled) return

            shell.output.pipeTo(new WritableStream({
                write(data) { if (!cancelled) term.write(data) }
            }))

            const writer = shell.input.getWriter()
            term.onData(data => {
                if (!cancelled) writer.write(data)
            })
            term.onResize(({ cols, rows }) => {
                try { shell.resize?.(cols, rows) } catch { }
            })
        }

        startShell()

        return () => { cancelled = true }
    }, [webcontainer, type, termVersion])   // termVersion re-spawns shell on terminal recreate

    return (
        <div style={{
            height: "100%",
            minHeight: 0,
            border: isActive ? "2px solid #38bdf833" : "1px solid #8882",
            boxSizing: "border-box"
        }}>
            <div ref={containerRef} style={{ height: "100%" }} />
        </div>
    )
}
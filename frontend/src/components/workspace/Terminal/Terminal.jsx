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

    // ✅ Accent color (same as settings icon)
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
        color: accent // ✅ APPLY BLUE COLOR
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
                            {/* ✅ ICON COLOR FIX */}
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

    useEffect(() => {

        const term = new XTerm({
            fontSize: terminalFontSize,
            fontFamily: terminalFontFamily,
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

        if (logs ) {
            term.write(logs)
            lastIndexRef.current = logs.length
        }

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

    useEffect(() => {
        if (!fitAddonRef.current) return

        const t = setTimeout(() => {
            fitAddonRef.current.fit()
        }, 80)

        return () => clearTimeout(t)

    }, [fullscreen, isActive])

    useEffect(() => {
        const handleResize = () => {
            fitAddonRef.current?.fit()
        }

        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

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

    useEffect(() => {

        if (type !== "main") return
        if (!process || !termRef.current) return
        if (attachedRef.current) return

        attachedRef.current = true

        const writer = process.input.getWriter()

        const disposable = termRef.current.onData(data => {
            writer.write(data)
        })

        return () => {
            disposable.dispose()
            try { writer.releaseLock() } catch { }
            attachedRef.current = false
        }

    }, [process])

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
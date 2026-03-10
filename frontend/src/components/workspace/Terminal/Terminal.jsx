import { SearchAddon } from "xterm-addon-search";
import { useEffect, useRef, useState } from "react";
import { Terminal as XTerm } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import "xterm/css/xterm.css";
import { useMediaQuery } from "@mantine/hooks";
import {
    SquareSplitHorizontal,
    Trash2,
    Minimize,
    Expand,
    Terminal as TerminalIcon
} from "lucide-react";

const presetColors = [
    "#22c55e",
    "#38bdf8",
    "#f97316",
    "#a855f7",
    "#e11d48",
    "#facc15"
];

export default function Terminal({
    process,
    logs,
    webcontainer,
    projectPath
}) {



    const [terms, setTerms] = useState([
        {
            id: crypto.randomUUID(),
            type: "main",
            name: "npm dev",
            color: "#22c55e"
        }
    ]);

    const [activeIndex, setActiveIndex] = useState(0);
    const [renameModal, setRenameModal] = useState(null);
    const [fullscreen, setFullscreen] = useState(false);
    const isMobile = useMediaQuery("(max-width: 768px)");


    useEffect(() => {
        const handleKeyDown = (e) => {

            if (e.ctrlKey && e.key === "`") {
                e.preventDefault();
                addSplit();
            }

            if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "y") {
                e.preventDefault();
                deleteTerminal();
            }

            if (e.altKey && e.key === "ArrowRight") {
                e.preventDefault();
                setActiveIndex((p) => (p + 1) % terms.length);
            }

            if (e.altKey && e.key === "ArrowLeft") {
                e.preventDefault();
                setActiveIndex((p) => (p - 1 + terms.length) % terms.length);
            }

            if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "s") {
                e.preventDefault();
                addSplit();
            }

        };

        window.addEventListener("keydown", handleKeyDown, true);

        return () =>
            window.removeEventListener("keydown", handleKeyDown, true);

    }, [terms]);

    /* ---------------- TERMINAL ACTIONS ---------------- */

    const addSplit = () => {

        setTerms((prev) => [
            ...prev,
            {
                id: crypto.randomUUID(),
                type: "shell",
                name: "bash",
                color: "#38bdf8"
            }
        ]);

        setActiveIndex(terms.length);
    };

    const deleteTerminal = () => {

        if (terms.length === 1) return;

        setTerms((prev) =>
            prev.filter((_, i) => i !== activeIndex)
        );

        setActiveIndex(0);
    };

    const saveRename = (name, color) => {

        setTerms((prev) =>
            prev.map((t, i) =>
                i === renameModal.index
                    ? { ...t, name, color }
                    : t
            )
        );

        setRenameModal(null);
    };

    const buttonStyle = {
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "6px",
        display: "flex",
        alignItems: "center",
        color: "#e2e8f0"
    };

    /* ---------------- UI ---------------- */

    return (
        <div
            style={{
                height: "100%",
                width: "100%",
                position: fullscreen ? "fixed" : "relative",
                top: fullscreen ? 0 : "auto",
                left: fullscreen ? 0 : "auto",
                right: fullscreen ? 0 : "auto",
                bottom: fullscreen ? 0 : "auto",
                zIndex: fullscreen ? 9999 : "auto",
                display: "flex",
                flexDirection: "column",
                background: "#020617"

            }}
        >

            {/* -------- TERMINAL TABS -------- */}

            <div
                style={{
                    display: "flex",
                    borderBottom: "1px solid #1e293b",
                    minHeight: 30
                }}
            >

                {/* SCROLLABLE TAB AREA */}
                <div
                    style={{
                        flex: 1,
                        overflowX: "auto",
                        overflowY: "hidden",
                        display: "flex",
                        whiteSpace: "nowrap"
                    }}
                >
                    {terms.map((term, i) => (
                        <div
                            key={term.id}
                            title="Double click to rename terminal"
                            onClick={() => setActiveIndex(i)}
                            onDoubleClick={() => setRenameModal({ ...term, index: i })}
                            style={{
                                minWidth: 130,        // 🔥 important
                                maxWidth: 200,
                                padding: "4px 10px",
                                fontSize: 12,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: 6,

                                flexShrink: 0,        // 🔥 prevents squeezing
                                flexGrow: 0,
                                flexBasis: "auto",

                                borderBottom:
                                    activeIndex === i
                                        ? `2px solid ${term.color}`
                                        : "2px solid transparent"
                            }}
                        >
                            <TerminalIcon size={14} color={term.color} />

                            <span
                                style={{
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap"
                                }}
                            >
                                {term.name}
                            </span>
                        </div>
                    ))}
                </div>

                {/* TOOLBAR (RIGHT SIDE) */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        borderLeft: "1px solid #1e293b",
                        paddingLeft: 6
                    }}
                >
                    <button
                        title={fullscreen ? "Exit fullscreen" : "Expand terminal"}
                        onClick={() => setFullscreen(!fullscreen)}
                        style={buttonStyle}
                    >
                        {fullscreen ? <Minimize size={16} /> : <Expand size={16} />}
                    </button>

                    <button
                        title="Split terminal"
                        onClick={addSplit}
                        style={buttonStyle}
                    >
                        <SquareSplitHorizontal size={16} />
                    </button>

                    {terms.length > 1 && (
                        <button
                            title="Delete terminal"
                            onClick={deleteTerminal}
                            style={buttonStyle}
                        >
                            <Trash2 size={16} />
                        </button>
                    )}
                </div>

            </div>

            {/* -------- TOOLBAR -------- */}



            {/* -------- TERMINAL PANES -------- */}

            {/* -------- TERMINAL PANES -------- */}

            {isMobile ? (

                /* MOBILE STACKED TERMINALS */

                <div
                    style={{
                        flex: 1,
                        overflowY: "auto",
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                        padding: 6
                    }}
                >
                    {terms.map((term, idx) => (
                        <div
                            key={term.id}
                            style={{
                                height: "40vh",
                                minHeight: "240px"
                            }}
                        >
                            <TerminalInstance
                                type={term.type}
                                process={process}
                                logs={logs}
                                webcontainer={webcontainer}
                                projectPath={projectPath}
                                isActive={activeIndex === idx}
                                onFocus={() => setActiveIndex(idx)}
                            />
                        </div>
                    ))}
                </div>

            ) : (

                /* DESKTOP SPLIT TERMINALS */

                <Allotment key={terms.length}>
                    {terms.map((term, idx) => (
                        <Allotment.Pane key={term.id}>
                            <TerminalInstance
                                type={term.type}
                                process={process}
                                logs={logs}
                                webcontainer={webcontainer}
                                projectPath={projectPath}
                                isActive={activeIndex === idx}
                                onFocus={() => setActiveIndex(idx)}
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
    );
}

/* ---------------- TERMINAL INSTANCE ---------------- */

function TerminalInstance({
    type,
    process,
    logs,
    webcontainer,
    projectPath,
    onFocus,
    isActive
}) {
    const [searchVisible, setSearchVisible] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const containerRef = useRef(null);
    const termRef = useRef(null);
    const fitAddonRef = useRef(null);
    const searchAddonRef = useRef(null);
    const attachedRef = useRef(false);
    const lastIndexRef = useRef(0);

    const [fontSize, setFontSize] = useState(12);

    useEffect(() => {

        const term = new XTerm({
            theme: {
                background: "#020617",
                foreground: "#e2e8f0",
                cursor: "#22c55e"
            },
            fontSize: 12,
            lineHeight: 1.1,
            cursorBlink: true,
            fontFamily: "JetBrains Mono, monospace",
            scrollback: 5000
        });

        const fitAddon = new FitAddon();
        const searchAddon = new SearchAddon();

        term.loadAddon(fitAddon);
        term.loadAddon(searchAddon);

        term.open(containerRef.current);

        fitAddon.fit();
        term.focus();

        termRef.current = term;
        fitAddonRef.current = fitAddon;
        searchAddonRef.current = searchAddon;

        /* CLICK FOCUS */

        const handleClick = () => {
            term.focus();
            onFocus?.();
        };

        containerRef.current.addEventListener("mousedown", handleClick);

        /* AUTO FIT ON RESIZE */

        const resizeObserver = new ResizeObserver(() => {
            fitAddon.fit();
        });

        resizeObserver.observe(containerRef.current);

        /* TERMINAL SHORTCUTS */

        term.attachCustomKeyEventHandler((event) => {

            /* SEARCH TERMINAL */

            if (event.ctrlKey && event.key.toLowerCase() === "f") {
                event.preventDefault();
                setSearchVisible(true);
                setTimeout(() => {
                    document.getElementById("terminal-search-input")?.focus();
                }, 50);
                return false;
            }

            /* CLEAR TERMINAL */

            if (event.ctrlKey && event.key.toLowerCase() === "l") {

                event.preventDefault();
                term.clear();
                return false;
            }

            /* FONT ZOOM IN */

            if (event.ctrlKey && event.key === "=") {

                event.preventDefault();

                const newSize = term.options.fontSize + 1;
                term.options.fontSize = newSize;

                fitAddon.fit();

                return false;
            }

            /* FONT ZOOM OUT */

            if (event.ctrlKey && event.key === "-") {

                event.preventDefault();

                const newSize = term.options.fontSize - 1;
                term.options.fontSize = newSize;

                fitAddon.fit();

                return false;
            }

            return true;
        });

        return () => {
            containerRef.current?.removeEventListener("mousedown", handleClick);
            resizeObserver.disconnect();
            term.dispose();
        };

    }, []);

    /* MAIN TERMINAL OUTPUT */

    useEffect(() => {

        if (type !== "main") return;
        if (!logs || !termRef.current) return;

        const term = termRef.current;
        const newData = logs.slice(lastIndexRef.current);

        if (newData) {
            term.write(newData);
            lastIndexRef.current = logs.length;
        }

    }, [logs, type]);

    /* MAIN TERMINAL INPUT */

    useEffect(() => {

        if (type !== "main") return;
        if (!process || !termRef.current) return;
        if (attachedRef.current) return;

        attachedRef.current = true;

        const term = termRef.current;
        const writer = process.input.getWriter();

        const disposable = term.onData((data) => {
            writer.write(data);
        });

        return () => {

            disposable.dispose();

            try {
                writer.releaseLock();
            } catch { }

            attachedRef.current = false;

        };

    }, [process, type]);

    /* SPLIT TERMINAL SHELL */

    useEffect(() => {

        if (type !== "shell") return;
        if (!webcontainer || !termRef.current) return;

        const startShell = async () => {

            const term = termRef.current;

            const shellProcess = await webcontainer.spawn("jsh", {
                terminal: {
                    cols: term.cols,
                    rows: term.rows
                }
            });

            shellProcess.output.pipeTo(
                new WritableStream({
                    write(data) {
                        term.write(data);
                    }
                })
            );

            const writer = shellProcess.input.getWriter();

            term.onData((data) => {
                writer.write(data);
            });

        };

        startShell();

    }, [type, webcontainer]);

    return (
        <div
            style={{
                height: "100%",
                width: "100%",
                position: "relative"
            }}
        >

            {searchVisible && (
                <div
                    style={{
                        position: "absolute",
                        top: 6,
                        right: 6,
                        zIndex: 20,
                        background: "#0f172a",
                        border: "1px solid #334155",
                        padding: "4px 6px",
                        display: "flex",
                        gap: 6,
                        alignItems: "center",
                        borderRadius: 4
                    }}
                >

                    <input
                        id="terminal-search-input"
                        value={searchValue}
                        onChange={(e) => {
                            setSearchValue(e.target.value);
                            searchAddonRef.current?.findNext(e.target.value);
                        }}
                        placeholder="Search"
                        style={{
                            background: "transparent",
                            border: "none",
                            outline: "none",
                            color: "#e2e8f0",
                            fontSize: 12
                        }}
                    />

                    <button
                        onClick={() =>
                            searchAddonRef.current?.findNext(searchValue)
                        }
                    >
                        ↓
                    </button>

                    <button
                        onClick={() =>
                            searchAddonRef.current?.findPrevious(searchValue)
                        }
                    >
                        ↑
                    </button>

                    <button onClick={() => setSearchVisible(false)}>
                        ✕
                    </button>

                </div>
            )}

            <div
                ref={containerRef}
                style={{
                    height: "100%",
                    width: "100%",
                    border: isActive
                        ? "2px solid #3d403e"
                        : "1px solid #1e293b",
                    minHeight: 0
                }}
            />

        </div>
    );
}
/* ---------------- RENAME MODAL ---------------- */

function RenameModal({ data, onSave, onClose }) {

    const [name, setName] = useState(data.name);
    const [color, setColor] = useState(data.color);

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
                width: 260,
                zIndex: 999
            }}
        >

            <div style={{ marginBottom: 8 }}>
                Terminal Name
            </div>

            <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                    width: "100%",
                    padding: 6,
                    marginBottom: 10,
                    background: "#0f172a",
                    border: "1px solid #1e293b",
                    color: "#fff"
                }}
            />

            <div style={{ marginBottom: 6 }}>
                Color
            </div>

            <div style={{ display: "flex", gap: 6 }}>
                {presetColors.map((c) => (
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

            <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                style={{ marginTop: 10 }}
            />

            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: 14,
                    gap: 6
                }}
            >
                <button onClick={onClose}>Cancel</button>
                <button onClick={() => onSave(name, color)}>
                    Save
                </button>
            </div>

        </div>
    );
}

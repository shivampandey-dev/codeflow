
import { useEffect, useRef, useState } from "react";
import { Terminal as XTerm } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import "xterm/css/xterm.css";

import {
    SquareSplitHorizontal,
    Trash2,
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

    /* ---------------- KEYBOARD SHORTCUTS ---------------- */

    useEffect(() => {
        const handleKeyDown = (e) => {

            if (e.ctrlKey && e.key === "`") {
                e.preventDefault();
                addSplit();
            }

            if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "w") {
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
                position: "relative",
                display: "flex",
                flexDirection: "column",
                background: "#020617"
            }}
        >

            {/* -------- TERMINAL TABS -------- */}

            <div
                style={{
                    display: "flex",
                    borderBottom: "1px solid #1e293b"
                }}
            >

                {terms.map((term, i) => (
                    <div
                        key={term.id}
                        title="Double click to rename terminal"
                        onClick={() => setActiveIndex(i)}
                        onDoubleClick={() =>
                            setRenameModal({ ...term, index: i })
                        }
                        style={{
                            padding: "4px 10px",
                            fontSize: 12,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            borderBottom:
                                activeIndex === i
                                    ? `2px solid ${term.color}`
                                    : "2px solid transparent"
                        }}
                    >
                        <TerminalIcon
                            size={14}
                            color={term.color}
                        />

                        {term.name}
                    </div>
                ))}

            </div>

            {/* -------- TOOLBAR -------- */}

            <div
                style={{
                    position: "absolute",
                    top: 30,
                    right: 0,
                    zIndex: 10,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    background: "#020617",
                    border: "1px solid #1e293b"
                }}
            >

                <button
                    title="Split terminal"
                    onClick={addSplit}
                    style={buttonStyle}
                >
                    <SquareSplitHorizontal size={16} />
                </button>

                {terms.length > 1 && (
                    <>
                        <div
                            style={{
                                width: "70%",
                                height: 1,
                                background: "#334155"
                            }}
                        />

                        <button
                            title="Delete terminal"
                            onClick={deleteTerminal}
                            style={buttonStyle}
                        >
                            <Trash2 size={16} />
                        </button>
                    </>
                )}

            </div>

            {/* -------- TERMINAL PANES -------- */}

            <Allotment>

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

    const containerRef = useRef(null);
    const termRef = useRef(null);
    const fitAddonRef = useRef(null);
    const attachedRef = useRef(false);
    const lastIndexRef = useRef(0);

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

        term.loadAddon(fitAddon);
        term.open(containerRef.current);

        fitAddon.fit();
        term.focus();

        termRef.current = term;
        fitAddonRef.current = fitAddon;

        const handleClick = () => {
            term.focus();
            onFocus?.();
        };

        containerRef.current.addEventListener("mousedown", handleClick);

        return () => {
            containerRef.current?.removeEventListener("mousedown", handleClick);
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
        const fitAddon = fitAddonRef.current;

        const writer = process.input.getWriter();

        const disposable = term.onData((data) => {
            writer.write(data);
        });

        fitAddon.fit();

        const resizeObserver = new ResizeObserver(() => {
            fitAddon.fit();
        });

        resizeObserver.observe(containerRef.current);

        return () => {

            disposable.dispose();
            resizeObserver.disconnect();

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

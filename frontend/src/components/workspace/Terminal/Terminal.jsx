import { useEffect, useRef, useState } from "react";
import { Terminal as XTerm } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

export default function Terminal({
    process,
    logs,
    webcontainer,
    projectPath, // 👈 pass this from Workspace
}) {
    const [terms, setTerms] = useState([{ type: "main" }]);



    const addSplit = () => {
        setTerms((prev) => [...prev, { type: "shell" }]);
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row", // 🔥 horizontal split
                height: "100%",
                width: "100%",
                position: "relative",
            }}
        >
            {terms.map((term, idx) => (
                <TerminalInstance
                    key={idx}
                    type={term.type}
                    process={process}
                    logs={logs}
                    webcontainer={webcontainer}
                    projectPath={projectPath}
                />
            ))}

            <button
                onClick={addSplit}
                style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    zIndex: 10,
                    background: "#1e293b",
                    color: "#fff",
                    padding: "4px 8px",
                    borderRadius: 4,
                    cursor: "pointer",
                }}
            >
                Split
            </button>
        </div>
    );
}

function TerminalInstance({
    type,
    process,
    logs,
    webcontainer,
    projectPath,
}) {
    const containerRef = useRef(null);
    const termRef = useRef(null);
    const fitAddonRef = useRef(null);
    const attachedRef = useRef(false);
    const lastIndexRef = useRef(0);
    const localProcessRef = useRef(null);

    // 🔹 Initialize xterm
    useEffect(() => {
        const term = new XTerm({
            theme: {
                background: "#020617",
                foreground: "#e2e8f0",
                cursor: "#22c55e",
            },
            fontSize: 13,
            cursorBlink: true,
            fontFamily: "JetBrains Mono, monospace",
            scrollback: 5000,
        });

        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        term.open(containerRef.current);
        fitAddon.fit();
        term.focus();

        termRef.current = term;
        fitAddonRef.current = fitAddon;

        // ✅ Focus when clicking this terminal
        const handleClick = () => {
            term.focus();
        };
        containerRef.current.addEventListener("mousedown", handleClick);

        return () => {
            containerRef.current?.removeEventListener("mousedown", handleClick);
            term.dispose();
        };
    }, []);

    // 🔥 MAIN TERMINAL (install/dev process)
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
        process.resize?.({ cols: term.cols, rows: term.rows });

        const resizeObserver = new ResizeObserver(() => {
            fitAddon.fit();
            process.resize?.({ cols: term.cols, rows: term.rows });
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

    // 🔥 SPLIT TERMINAL (independent shell)
    useEffect(() => {
        if (type !== "shell") return;
        if (!webcontainer || !termRef.current) return;

        const startShell = async () => {
            const term = termRef.current;
            const fitAddon = fitAddonRef.current;

            const shellProcess = await webcontainer.spawn("jsh", {
                terminal: {
                    cols: term.cols,
                    rows: term.rows,
                },
            });

            localProcessRef.current = shellProcess;

            // Output → Terminal
            shellProcess.output.pipeTo(
                new WritableStream({
                    write(data) {
                        term.write(data);
                    },
                })
            );

            // Get a writer for input
            const inputWriter = shellProcess.input.getWriter();


            // Input → Shell
            term.onData((data) => {
                inputWriter.write(data);
            });

            const resizeObserver = new ResizeObserver(() => {
                fitAddon.fit();
                shellProcess.resize({
                    cols: term.cols,
                    rows: term.rows,
                });
            });

            resizeObserver.observe(containerRef.current);

            // Focus on click
            const handleClick = () => {
                term.focus();
            };
            containerRef.current.addEventListener("mousedown", handleClick);

            return () => {
                containerRef.current?.removeEventListener("mousedown", handleClick);
                resizeObserver.disconnect();
                try {
                    inputWriter.releaseLock();
                } catch { }
            };
        };

        startShell();
    }, [type, webcontainer, projectPath]);

    return (
        <div
            ref={containerRef}
            style={{
                flex: 1,
                border: "1px solid #1e293b",
                margin: 2,
                minHeight: 0,
            }}
        />
    );
}
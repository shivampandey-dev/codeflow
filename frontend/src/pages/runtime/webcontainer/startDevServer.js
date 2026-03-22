let shellInstance = null   // the persistent jsh shell
let installing = false

export async function startDevServer(
    webcontainer,
    onOutput,
    onProcessChange
) {
    if (shellInstance) return shellInstance
    if (installing) return
    installing = true

    const writeStatus = (tag) => onOutput?.(`\r\n__STATUS__:${tag}\r\n`)
    const write = (data) => onOutput?.(data)
    const decoder = new TextDecoder()
    const decode = (v) => typeof v === "string" ? v : decoder.decode(v)

    try {
        /* -------- FS PREP (no shell needed) -------- */
        writeStatus("preparing_workspace")
        write("\r\n🚀 Preparing workspace...\r\n")

        await webcontainer.fs.mkdir("/workspace").catch(() => { })
        const rootFiles = await webcontainer.fs.readdir("/")
        for (const file of rootFiles) {
            if (["workspace", ".git", ".gitignore"].includes(file)) continue
            try {
                await webcontainer.fs.rename(`/${file}`, `/workspace/${file}`)
            } catch { }
        }

        /* -------- SPAWN JSH (PTY shell — same as split terminal) -------- */
        const shell = await webcontainer.spawn("jsh", {
            terminal: { cols: 80, rows: 24 }
        })

        shellInstance = shell

        /* -------- TEE OUTPUT -------- */
        // We need two consumers: terminal display + status detection.
        // ReadableStream.tee() splits into two independent streams.
        const [outForTerminal, outForDetection] = shell.output.tee()

        // Branch 1 → forward raw output to logs (terminal reads from logs)
        outForTerminal.pipeTo(new WritableStream({
            write(chunk) { write(decode(chunk)) }
        }))

            // Branch 2 → watch output for install/server-ready milestones
            ; (async () => {
                const reader = outForDetection.getReader()
                let installFlagged = false
                let serverFlagged = false

                while (true) {
                    const { value, done } = await reader.read()
                    if (done) break
                    const text = decode(value)

                    if (!installFlagged && /added \d+ package/i.test(text)) {
                        installFlagged = true
                        writeStatus("starting_server")
                        write("\r\n🚀 Starting dev server...\r\n")
                    }

                    if (!serverFlagged && (/Local:\s+http/i.test(text) || /ready in/i.test(text))) {
                        serverFlagged = true
                        writeStatus("server_ready")
                        write("\r\n🟢 Dev Server Ready!\r\n")
                    }
                }

                // Shell exited — clean up
                shellInstance = null
                onProcessChange?.(null)
            })()

        // ✅ FIX: Prompt detection via regex fails because jsh wraps its prompt
        // in ANSI color codes — the text chunk never ends with a bare `>` or `❯`.
        // A 500ms timeout is simpler and reliable: jsh is always ready well within
        // that window after spawn().
        await new Promise(resolve => setTimeout(resolve, 500))

        writeStatus("installing_deps")
        write("\r\n📦 Installing dependencies...\r\n")

        // ✅ FIX: webcontainer.fs root (`/`) maps to jsh's home dir, so
        // `webcontainer.fs.mkdir("/workspace")` creates ~/workspace in the shell.
        // Use `~/workspace` (not `/workspace`) to match what jsh actually sees.
        const cmdWriter = shell.input.getWriter()
        // ✅ FIX: In WebContainer jsh, `~` expands to /home/workspace (wrong).
        // The shell starts in the container home dir which already contains
        // `workspace/` as a direct child — use a plain relative path.
        await cmdWriter.write("cd workspace && npm install && npm run dev\n")
        cmdWriter.releaseLock()  // release so terminal can acquire writer on keypress

        // Hand shell to terminal
        onProcessChange?.(shell)

    } catch (err) {
        write(`\r\n❌ Error starting dev server:\r\n${err}\r\n`)
        shellInstance = null
    }

    installing = false
    return shellInstance
}

export function resetDevServer() {
    shellInstance = null
    installing = false
}

export function getCurrentProcess() {
    return shellInstance
}
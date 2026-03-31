let shellInstance = null
let installing = false
let signalWriter = null
let onStopCallback = null
let depsInstalled = false   // flips true once install is confirmed done

export async function startBackendServer(
    webcontainer,
    onOutput,
    onProcessChange,
    onServerStop,
    skipInstall = false
) {
    // ── RESTART PATH ──────────────────────────────────────────────────────────
    // jsh is still alive after Ctrl+C — only node/nodemon died.
    // Skip the whole boot sequence and just re-run the right command.
    if (shellInstance && signalWriter && skipInstall) {
        onStopCallback = onServerStop
        const writeStatus = (tag) => onOutput?.(`\r\n__STATUS__:${tag}\r\n`)
        const write = (data) => onOutput?.(data)
        try {
            if (depsInstalled) {
                writeStatus("starting_server")
                write("\r\n🚀 Restarting backend server...\r\n")
                await signalWriter.write("npm run dev\n")
            } else {
                writeStatus("installing_deps")
                write("\r\n⚠️  Previous install was incomplete — reinstalling...\r\n")
                await signalWriter.write("npm install && npm run dev\n")
            }
        } catch (err) {
            console.error("[backend restart error]", err)
        }
        onProcessChange?.(shellInstance)
        return shellInstance
    }

    if (shellInstance) return shellInstance
    if (installing) return
    installing = true

    depsInstalled = false
    onStopCallback = onServerStop

    const writeStatus = (tag) => onOutput?.(`\r\n__STATUS__:${tag}\r\n`)
    const write = (data) => onOutput?.(data)
    const decoder = new TextDecoder()
    const decode = (v) => typeof v === "string" ? v : decoder.decode(v)

    try {
        // ── FS PREP ───────────────────────────────────────────────────────────
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

        // ── SPAWN JSH ─────────────────────────────────────────────────────────
        const shell = await webcontainer.spawn("jsh", {
            terminal: { cols: 80, rows: 24 }
        })
        shellInstance = shell

        // ── TEE OUTPUT ────────────────────────────────────────────────────────
        const [outForTerminal, outForDetection] = shell.output.tee()

        outForTerminal.pipeTo(new WritableStream({
            write(chunk) { write(decode(chunk)) }
        }))

            // Detection loop — runs in background, never awaited
            ; (async () => {
                const reader = outForDetection.getReader()
                let installFlagged = false
                let serverFlagged = false
                let serverWasRunning = false

                while (true) {
                    const { value, done } = await reader.read()
                    if (done) break
                    const text = decode(value)

                    // ── INSTALL COMPLETE ─────────────────────────────────────────
                    // "added X packages"  → normal install with dependencies
                    // "up to date"        → nothing new to install
                    // "found 0 vulnerabilities" → appears for no-dep projects too
                    if (!installFlagged && (
                        /added \d+ package/i.test(text) ||
                        /up to date/i.test(text) ||
                        /found \d+ vulnerabilit/i.test(text)
                    )) {
                        installFlagged = true
                        depsInstalled = true
                        writeStatus("starting_server")
                        write("\r\n🚀 Starting backend server...\r\n")
                    }

                    // ── SERVER READY ──────────────────────────────────────────────
                    // Covers: Node http, Express, Fastify, nodemon, and most other
                    // popular Node frameworks that log their bound address.
                    if (!serverFlagged && (
                        /listening on.*(https?:\/\/|port\s*)\d+/i.test(text) ||
                        /localhost:\d+/i.test(text) ||
                        /server.*(?:started|running|ready)/i.test(text) ||
                        /ready.*\d{4}/i.test(text)
                    )) {
                        serverFlagged = true
                        serverWasRunning = true
                        writeStatus("server_ready")
                        write("\r\n🟢 Backend Server Ready!\r\n")
                    }

                    // ── SERVER STOPPED ────────────────────────────────────────────
                    // After the server was running, if the jsh prompt reappears it
                    // means the foreground process (node/nodemon) has exited.
                    if (serverWasRunning && /[❯>$]\s*$/.test(
                        text.replace(/\x1b\[[0-9;]*[mGKHF]/g, "").trimEnd()
                    )) {
                        serverWasRunning = false
                        serverFlagged = false
                        writeStatus("server_stopped")
                        onStopCallback?.()
                    }
                }

                // Shell itself exited — full reset so next boot starts clean
                shellInstance = null
                signalWriter = null
                depsInstalled = false
                onProcessChange?.(null)
                onStopCallback?.()
            })()

        // ── SEND COMMAND ──────────────────────────────────────────────────────
        await new Promise(resolve => setTimeout(resolve, 500))

        signalWriter = shell.input.getWriter()

        if (skipInstall) {
            writeStatus("starting_server")
            write("\r\n🚀 Starting backend server...\r\n")
            await signalWriter.write("cd workspace && npm run dev\n")
        } else {
            // For templates with no deps (plain node), npm install finishes
            // instantly with "up to date" — the detection above handles that.
            writeStatus("installing_deps")
            write("\r\n📦 Installing dependencies...\r\n")
            await signalWriter.write("cd workspace && npm install && npm run dev\n")
        }

        onProcessChange?.(shell)

    } catch (err) {
        write(`\r\n❌ Error starting backend server:\r\n${err}\r\n`)
        shellInstance = null
        signalWriter = null
    }

    installing = false
    return shellInstance
}

// Send Ctrl+C — kills node/nodemon but jsh stays alive for restart
export async function killBackendServer() {
    if (!signalWriter) return false
    try {
        await signalWriter.write("\x03")
    } catch { }
    return true
}

export function resetBackendServer() {
    try { signalWriter?.releaseLock() } catch { }
    shellInstance = null
    signalWriter = null
    installing = false
    depsInstalled = false
}

export function isBackendServerRunning() {
    return shellInstance !== null
}
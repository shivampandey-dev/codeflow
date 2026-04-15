let shellInstance = null
let installing = false
let signalWriter = null
let onStopCallback = null
let depsInstalled = false   // ✅ flips true only when "added X packages" is seen

export async function startDevServer(
    webcontainer,
    onOutput,
    onProcessChange,
    onServerStop,
    skipInstall = false
) {
    // ✅ RESTART: jsh is still alive after Ctrl+C (only npm died).
    // Decide command based on whether npm install actually completed.
    if (shellInstance && signalWriter && skipInstall) {
        onStopCallback = onServerStop
        const writeStatus = (tag) => onOutput?.(`\r\n__STATUS__:${tag}\r\n`)
        const write = (data) => onOutput?.(data)
        try {
            if (depsInstalled) {
                // ✅ install completed before — just start the server
                writeStatus("starting_server")
                write("\r\n🚀 Starting dev server...\r\n")
                await signalWriter.write("npm run dev\n")
            } else {
                // ⚠️ install was interrupted — must reinstall first
                writeStatus("installing_deps")
                write("\r\n⚠️  Previous install was incomplete — reinstalling...\r\n")
                await signalWriter.write("npm install && npm run dev\n")
            }
        } catch (err) {
            console.error("[restart error]", err)
        }
        onProcessChange?.(shellInstance)
        return shellInstance
    }

    if (shellInstance) return shellInstance
    if (installing) return
    installing = true

    depsInstalled = false   // reset for this boot session
    onStopCallback = onServerStop

    const writeStatus = (tag) => onOutput?.(`\r\n__STATUS__:${tag}\r\n`)
    const write = (data) => onOutput?.(data)
    const decoder = new TextDecoder()
    const decode = (v) => typeof v === "string" ? v : decoder.decode(v)

    try {
        /* -------- FS PREP -------- */
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

        /* -------- SPAWN JSH -------- */
        const shell = await webcontainer.spawn("jsh", {
            terminal: { cols: 80, rows: 24 }
        })
        shellInstance = shell

        /* -------- TEE OUTPUT -------- */
        const [outForTerminal, outForDetection] = shell.output.tee()

        outForTerminal.pipeTo(new WritableStream({
            write(chunk) { write(decode(chunk)) }
        }))

            ; (async () => {
                const reader = outForDetection.getReader()
                let installFlagged = false
                let serverFlagged = false
                let serverWasRunning = false

                while (true) {
                    const { value, done } = await reader.read()
                    if (done) break
                    const text = decode(value)


                    if (!installFlagged && /added \d+ package/i.test(text)) {
                        installFlagged = true
                        depsInstalled = true   // ✅ mark install as complete
                        writeStatus("starting_server")
                        write("\r\n🚀 Starting dev server...\r\n")
                    }

                    if (!serverFlagged && (/Local:\s+http/i.test(text) || /ready in/i.test(text))) {
                        serverFlagged = true
                        serverWasRunning = true
                        writeStatus("server_ready")
                        write("\r\n🟢 Dev Server Ready!\r\n")
                    }

                    // ✅ Detect when npm exits and jsh prompt returns
                    // After server was running, if we see the shell prompt again
                    // it means the foreground process (npm) has stopped.
                    if (serverWasRunning && /[❯>$]\s*$/.test(
                        text.replace(/\x1b\[[0-9;]*[mGKHF]/g, "").trimEnd()
                    )) {
                        serverWasRunning = false
                        serverFlagged = false
                        writeStatus("server_stopped")
                        onStopCallback?.()
                    }
                }

                shellInstance = null
                signalWriter = null
                depsInstalled = false   // shell is gone — next boot must reinstall
                onProcessChange?.(null)
                onStopCallback?.()
            })()

        /* -------- WAIT FOR SHELL READY THEN SEND COMMAND -------- */
        await new Promise(resolve => setTimeout(resolve, 500))

        if (skipInstall) {
            // ✅ Restart: deps already installed, just start the server
            writeStatus("starting_server")
            write("\r\n🚀 Starting dev server...\r\n")
            signalWriter = shell.input.getWriter()
            await signalWriter.write("cd workspace && npm run dev\n")
        } else {
            // First boot: install then start
            writeStatus("installing_deps")
            write("\r\n📦 Installing dependencies...\r\n")
            signalWriter = shell.input.getWriter()
            await signalWriter.write("cd workspace && npm install && npm run dev\n")
        }

        onProcessChange?.(shell)

    } catch (err) {
        write(`\r\n❌ Error starting dev server:\r\n${err}\r\n`)
        shellInstance = null
        signalWriter = null
    }

    installing = false
    return shellInstance
}

// ✅ Send Ctrl+C to the foreground process inside jsh — same as pressing ^C in terminal
export async function killDevServer() {
    if (!signalWriter) return false
    try {
        await signalWriter.write("\x03")   // SIGINT → kills npm, jsh stays alive
    } catch { }
    return true
}

export function resetDevServer() {
    try { signalWriter?.releaseLock() } catch { }
    shellInstance = null
    signalWriter = null
    installing = false
    depsInstalled = false
}

export function getCurrentProcess() {
    return shellInstance
}

export function isServerRunning() {
    return shellInstance !== null
}
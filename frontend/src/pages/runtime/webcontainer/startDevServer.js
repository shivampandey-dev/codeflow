let devProcessInstance = null;
let installing = false;

export async function startDevServer(webcontainer, onOutput) {

    if (devProcessInstance) return devProcessInstance;
    if (installing) return;

    installing = true;

    const write = (data) => onOutput?.(data);
    const decoder = new TextDecoder();

    const decode = (value) =>
        typeof value === "string"
            ? value
            : decoder.decode(value);

    try {

        /* ---------------- PREPARING ---------------- */

        write("\r\n__STATUS__:preparing_workspace\r\n"); // ✅ ADD
        write("\r\n🚀 Preparing workspace...\r\n");

        await webcontainer.fs.mkdir("/workspace").catch(() => { });

        const rootFiles = await webcontainer.fs.readdir("/");

        for (const file of rootFiles) {

            if (
                file === "workspace" ||
                file === ".git" ||
                file === ".gitignore"
            ) continue;

            try {
                await webcontainer.fs.rename(
                    `/${file}`,
                    `/workspace/${file}`
                );
            } catch { }

        }

        /* ---------------- INSTALL DEPENDENCIES ---------------- */

        write("\r\n__STATUS__:installing_deps\r\n"); // ✅ IMPORTANT
        write("\r\n📦 Installing dependencies...\r\n");

        const installProcess = await webcontainer.spawn(
            "npm",
            ["install"],
            { cwd: "/workspace" }
        );

        const reader = installProcess.output.getReader();

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            if (value) write(decode(value));
        }

        await installProcess.exit;

        /* ---------------- START DEV SERVER ---------------- */

        write("\r\n__STATUS__:starting_server\r\n"); // ✅ ADD
        write("\r\n🚀 Starting dev server...\r\n");

        devProcessInstance = await webcontainer.spawn(
            "npm",
            ["run", "dev"],
            { cwd: "/workspace" }
        );

        const devReader = devProcessInstance.output.getReader();

        (async () => {

            while (true) {

                const { value, done } = await devReader.read();
                if (done) break;

                if (value) {

                    const text = decode(value);

                    write(text);

                    /* ---------------- SERVER READY ---------------- */

                    if (/Local:\s+http/i.test(text) || /ready in/i.test(text)) {

                        write("\r\n__STATUS__:server_ready\r\n"); // ✅ ADD
                        write("\r\n🟢 Dev Server Ready!\r\n");

                    }

                }

            }

        })();

    } catch (err) {

        write(`\r\n❌ Error starting dev server:\r\n${err}\r\n`);

    }

    installing = false;

    return devProcessInstance;
}
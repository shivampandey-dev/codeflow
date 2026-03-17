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

        write("\n🚀 Preparing workspace...\n");

        /* ---------------- CREATE WORKSPACE ---------------- */

        await webcontainer.fs.mkdir("/workspace").catch(() => { });

        /* ---------------- MOVE ROOT FILES INTO PROJECT ---------------- */

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

        write("\n📦 Installing dependencies...\n");

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

        write("\n🚀 Starting dev server...\n");

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

                    if (/Local:\s+http/i.test(text) || /ready in/i.test(text)) {

                        write("\n🟢 Dev Server Ready!\n");

                    }

                }

            }

        })();

    } catch (err) {

        write(`\n❌ Error starting dev server:\n${err}\n`);

    }

    installing = false;

    return devProcessInstance;
}
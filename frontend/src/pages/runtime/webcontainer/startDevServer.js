let devProcessInstance = null;
let installing = false;

export async function startDevServer(webcontainer, onOutput) {

    if (devProcessInstance) return devProcessInstance;
    if (installing) return;

    installing = true;

    const write = (data) => onOutput?.(data);
    const decoder = new TextDecoder();

    const color = {
        reset: "\x1b[0m",
        red: "\x1b[31m",
        yellow: "\x1b[33m",
        green: "\x1b[32m",
        cyan: "\x1b[36m",
        dim: "\x1b[2m"
    };

    const highlightLine = (line) => {
        if (/error|ERR!/i.test(line)) {
            return color.red + line + color.reset;
        }
        if (/warn/i.test(line)) {
            return color.yellow + line + color.reset;
        }
        return line;
    };

    /* ---------------- START SHELL ---------------- */

    write("__STATUS__:starting_shell\n");
    write(`${color.cyan}\r\n🚀 Starting interactive shell...${color.reset}\r\n`);

    devProcessInstance = await webcontainer.spawn("jsh", {
        terminal: { cols: 80, rows: 24 }
    });

    const reader = devProcessInstance.output.getReader();
    const writer = devProcessInstance.input.getWriter();

    /* Stream output */
    (async () => {
        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            if (value) {
                const text = typeof value === "string"
                    ? value
                    : decoder.decode(value);

                const lines = text.split("\n").map(highlightLine).join("\n");
                write(lines);

                /* Detect Vite Ready */
                if (/Local:\s+http/i.test(text) || /ready in/i.test(text)) {
                    write("__STATUS__:server_ready\n");
                    write(`\r\n${color.green}🟢 Server Running Successfully!${color.reset}\r\n`);
                }
            }
        }
    })();

    write("__STATUS__:installing_deps\n");
    write(`\r\n${color.cyan}📦 Installing dependencies...${color.reset}\r\n`);
    write(`${color.dim}Running npm install && npm run dev${color.reset}\r\n\n`);

    await writer.write(" npm install --loglevel verbose && npm run dev\n");

    writer.releaseLock();
    installing = false;

    return devProcessInstance;
}
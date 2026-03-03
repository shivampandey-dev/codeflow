export async function startShell(webcontainer) {

    const shellProcess = await webcontainer.spawn("jsh", {
        terminal: {
            cols: 80,
            rows: 24,
        },
    });

    return shellProcess;
}
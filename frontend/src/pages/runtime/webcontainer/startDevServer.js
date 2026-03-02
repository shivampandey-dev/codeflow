export async function startDevServer(webcontainer) {
    const installProcess = await webcontainer.spawn("npm", ["install"]);

    await installProcess.exit;

    const devProcess = await webcontainer.spawn("npm", ["run", "dev"]);

    return devProcess;
}
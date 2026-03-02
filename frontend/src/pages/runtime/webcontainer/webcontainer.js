import { WebContainer } from "@webcontainer/api";

let webcontainerInstance = null;

export async function bootWebContainer() {
    if (webcontainerInstance) return webcontainerInstance;

    webcontainerInstance = await WebContainer.boot();

    return webcontainerInstance;
}
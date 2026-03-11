import { WebContainer } from "@webcontainer/api"
import { useEditorStore } from "../../../store/editorStore"

let webcontainerInstance = null

export async function bootWebContainer() {

    if (webcontainerInstance) return webcontainerInstance

    webcontainerInstance = await WebContainer.boot()

    /* store WebContainer globally for editor */
    const setWebcontainer =
        useEditorStore.getState().setWebcontainer

    setWebcontainer(webcontainerInstance)

    return webcontainerInstance
}
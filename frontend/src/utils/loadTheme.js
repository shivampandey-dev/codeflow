export async function loadMonacoTheme(monaco, themeName) {

    const builtInThemes = ["vs-dark", "vs-light", "hc-black"]

    if (builtInThemes.includes(themeName)) {

        monaco.editor.setTheme(themeName)

        return null

    }

    try {

        const themeModule = await import(`../assets/themes/${themeName}.json`)
        const themeData = themeModule.default

        const themeId = themeName
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "-")
            .replace(/-+/g, "-")

        monaco.editor.defineTheme(themeId, themeData)

        monaco.editor.setTheme(themeId)

        return themeData

    } catch (err) {

        console.error("Failed to load theme:", themeName)

    }

}
export function getThemes() {

    /*
    --------------------------------
    Built-in Monaco themes
    --------------------------------
    */

    const defaultThemes = [
        { value: "vs-dark", label: "VS Dark (Default)" },
        { value: "vs-light", label: "VS Light" },
        { value: "hc-black", label: "High Contrast" }
    ]


    /*
    --------------------------------
    Load all JSON themes automatically
    --------------------------------
    */

    const modules = import.meta.glob(
        "../assets/themes/*.json",
        { eager: true }
    )


    const customThemes = Object.keys(modules).map((path) => {

        const file = path.split("/").pop().replace(".json", "")

        return {
            value: file,
            label: file
                .replace(/_/g, " ")
                .replace(/-/g, " ")
        }

    })


    /*
    --------------------------------
    Sort themes alphabetically
    --------------------------------
    */

    customThemes.sort((a, b) =>
        a.label.localeCompare(b.label)
    )


    /*
    --------------------------------
    Return final theme list
    --------------------------------
    */

    return [
        ...defaultThemes,
        ...customThemes
    ]

}
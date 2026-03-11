const languageMap = {
    js: "javascript",
    jsx: "javascript",
    ts: "typescript",
    tsx: "typescript",
    json: "json",
    css: "css",
    html: "html",
    md: "markdown",
    yaml: "yaml",
    yml: "yaml"
}

export function getLanguage(fileName) {

    if (!fileName) return "plaintext"

    const ext = fileName.split(".").pop().toLowerCase()

    return languageMap[ext] || "plaintext"
}
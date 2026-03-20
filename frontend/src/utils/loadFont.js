// utils/loadFont.js

export function loadFont(fontName, fontData, weight = "400", style = "normal") {

    if (!fontName || !fontData) return

    // unique id (prevents duplicate injection)
    const id = `font-${fontName}-${weight}-${style}`

    if (document.getElementById(id)) return

    // safely get URL
    const url =
        fontData?.variants?.[style]?.[weight]?.url?.woff2

    if (!url) {
        console.warn("Font not available:", fontName, weight, style)
        return
    }

    const styleTag = document.createElement("style")
    styleTag.id = id

    styleTag.innerHTML = `
        @font-face {
            font-family: '${fontName}';
            src: url('${url}') format('woff2');
            font-weight: ${weight};
            font-style: ${style};
            font-display: swap;
        }
    `

    document.head.appendChild(styleTag)
}
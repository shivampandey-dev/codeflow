
export function getFontOptions(fontJson, limit = 120) {
    return Object.keys(fontJson)
        .slice(0, limit)
        .map((font) => ({
            value: font,
            label: font
        }))
}

/*
=========================
GET FONT DATA
=========================
*/

export function getFontData(fontJson, fontName) {
    return fontJson?.[fontName] || null
}

/*
=========================
GET FONT CATEGORY
=========================
*/

export function getFontCategory(fontData) {
    return fontData?.category || "unknown"
}

/*
=========================
GET AVAILABLE WEIGHTS
=========================
*/

export function getFontWeights(fontData) {
    if (!fontData?.variants?.normal) return []

    return Object.keys(fontData.variants.normal).map((w) => ({
        value: w,
        label: w
    }))
}

/*
=========================
CHECK ITALIC SUPPORT
=========================
*/

export function hasItalic(fontData) {
    return !!fontData?.variants?.italic
}

/*
=========================
GET FONT URL (DYNAMIC)
=========================
*/

export function getFontUrl(fontData, weight = "400", style = "normal") {
    return fontData?.variants?.[style]?.[weight]?.url?.woff2 || null
}

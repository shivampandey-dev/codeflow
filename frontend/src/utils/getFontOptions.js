/*
=========================
GET FONT OPTIONS
=========================
*/

export function getFontOptions(fontJson, limit) {

    if (!fontJson) return []

    // ✅ ARRAY FORMAT
    if (Array.isArray(fontJson)) {
        const data = limit ? fontJson.slice(0, limit) : fontJson

        return data.map((font) => ({
            value: font.family,
            label: font.family
        }))
    }

    // ✅ OBJECT FORMAT
    const keys = Object.keys(fontJson)
    const data = limit ? keys.slice(0, limit) : keys

    return data.map((font) => ({
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

    if (!fontJson || !fontName) return null

    // ✅ ARRAY FORMAT
    if (Array.isArray(fontJson)) {
        return fontJson.find(f => f.family === fontName) || null
    }

    // ✅ OBJECT FORMAT
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

export function getWeightsFromVariants(fontData) {

    if (!fontData?.variants) {
        return [{ value: "400", label: "400" }]
    }

    const weights = new Set()

    fontData.variants.forEach((variant) => {

        // remove "italic"
        const clean = variant.replace("italic", "")

        if (clean === "regular") {
            weights.add("400")
        } else if (/^\d+$/.test(clean)) {
            weights.add(clean)
        }
    })

    return Array.from(weights)
        .sort((a, b) => Number(a) - Number(b))
        .map((w) => ({
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

    if (!fontData?.variants) return false

    return fontData.variants.some(v => v.includes("italic"))
}

/*
=========================
GET FONT URL (LEGACY)
=========================
*/

export function getFontUrl(fontData, weight = "400", style = "normal") {
    return fontData?.variants?.[style]?.[weight]?.url?.woff2 || null
}
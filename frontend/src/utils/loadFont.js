// src/utils/loadFont.js

// ✅ In-memory cache — survives re-renders, faster than DOM lookup
const loaded = new Set()

// ✅ Preconnect to Google Fonts once — reduces DNS + TLS handshake time
function ensurePreconnect() {
    if (document.getElementById("__gf_preconnect__")) return
    const origins = [
        "https://fonts.googleapis.com",
        "https://fonts.gstatic.com",
    ]
    origins.forEach((href) => {
        const link = document.createElement("link")
        link.rel = "preconnect"
        link.href = href
        link.crossOrigin = "anonymous"
        document.head.appendChild(link)
    })
    // Mark as done
    const marker = document.createElement("meta")
    marker.id = "__gf_preconnect__"
    document.head.appendChild(marker)
}

export function loadFont(fontName, weight = "400", italic = false) {
    if (!fontName || fontName === "monospace") return

    const cacheKey = `${fontName}-${weight}-${italic}`
    if (loaded.has(cacheKey)) return  // ✅ in-memory check, no DOM query needed
    loaded.add(cacheKey)

    ensurePreconnect()  // ✅ runs once, no-ops after

    const formatted = fontName.replace(/ /g, "+")

    // ✅ Cleaner URL — only request the exact weight/style needed
    const href = italic
        ? `https://fonts.googleapis.com/css2?family=${formatted}:ital,wght@1,${weight}&display=swap`
        : `https://fonts.googleapis.com/css2?family=${formatted}:wght@${weight}&display=swap`

    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = href
    document.head.appendChild(link)
}
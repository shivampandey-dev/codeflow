// utils/themeColors.js

function hexToRgb(hex) {

    hex = hex.replace("#", "")

    if (hex.length === 3) {
        hex = hex.split("").map(x => x + x).join("")
    }

    const bigint = parseInt(hex, 16)

    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255
    }
}

function rgbToHex(r, g, b) {
    return (
        "#" +
        [r, g, b]
            .map(x => {
                const hex = x.toString(16)
                return hex.length === 1 ? "0" + hex : hex
            })
            .join("")
    )
}

function adjust(hex, amount) {

    const { r, g, b } = hexToRgb(hex)

    const nr = Math.min(255, Math.max(0, r + amount))
    const ng = Math.min(255, Math.max(0, g + amount))
    const nb = Math.min(255, Math.max(0, b + amount))

    return rgbToHex(nr, ng, nb)
}

/*
----------------------------------
MAIN THEME DERIVER
----------------------------------
*/

export function deriveUIColors(editorBg = "#1e1e1e") {

    const isLight = hexToRgb(editorBg).r > 200

    return {

        sidebarBg: adjust(editorBg, isLight ? -10 : 10),

        panelBg: adjust(editorBg, isLight ? -5 : 5),

        tabActive: adjust(editorBg, isLight ? -20 : 20),

        tabInactive: adjust(editorBg, isLight ? -5 : 5),

        hover: adjust(editorBg, isLight ? -15 : 15),

        border: adjust(editorBg, isLight ? -30 : 30)
    }
}

export function deriveTreeGuide(editorBg, editorFg) {

    function hexToRgb(hex) {

        hex = hex.replace("#", "")

        const bigint = parseInt(hex, 16)

        return {
            r: (bigint >> 16) & 255,
            g: (bigint >> 8) & 255,
            b: bigint & 255
        }
    }

    function rgbToHex(r, g, b) {

        return (
            "#" +
            [r, g, b]
                .map(x => {
                    const hex = x.toString(16)
                    return hex.length === 1 ? "0" + hex : hex
                })
                .join("")
        )

    }

    const bg = hexToRgb(editorBg)
    const fg = hexToRgb(editorFg)

    const mix = (a, b) => Math.round(a * 0.65 + b * 0.35)

    return rgbToHex(
        mix(bg.r, fg.r),
        mix(bg.g, fg.g),
        mix(bg.b, fg.b)
    )

}
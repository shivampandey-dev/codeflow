import { Select, Switch } from "@mantine/core"
import { useState, useMemo } from "react"

import fontJson from "../../../Assets/google-fonts.json"
import { getFontOptions } from "../../../utils/getFontOptions"
import { loadFont } from "../../../utils/loadFont"

// 🔥 limit here only (150–200 as you want)
const ALL_FONTS = getFontOptions(fontJson, 100)

export default function FontSettings({
    fontFamily,
    setFontFamily,
    fontWeight,
    setFontWeight,
    fontItalic,
    setFontItalic
}) {

    const [search, setSearch] = useState("")

    const fontData = fontJson?.[fontFamily]

    /*
    =========================
    🔥 FILTER ONLY
    =========================
    */
    const filteredFonts = useMemo(() => {
        if (!search) return ALL_FONTS

        return ALL_FONTS.filter(f =>
            f.label.toLowerCase().includes(search.toLowerCase())
        )
    }, [search])

    /*
    =========================
    WEIGHTS
    =========================
    */
    const weightOptions = Object.keys(
        fontData?.variants?.normal || { 400: true }
    ).map((w) => ({ value: w, label: w }))

    const italicSupported = !!fontData?.variants?.italic

    /*
    =========================
    FONT LOADER
    =========================
    */
    function safeLoadFont(name, weight, italic) {
        const data = fontJson?.[name]
        if (!data) return

        loadFont(name, data, weight, italic ? "italic" : "normal")
    }

    return (
        <>
            <Select
                label="Font Family"
                searchable
                searchValue={search}
                onSearchChange={setSearch}
                value={fontFamily}
                onChange={(value) => {
                    setFontFamily(value)
                    safeLoadFont(value, fontWeight, fontItalic)
                }}
                data={filteredFonts}
                limit={150} // 🔥 IMPORTANT (UI smoothness)
                nothingFoundMessage="No fonts found"
            />

            <Select
                label="Font Weight"
                value={fontWeight}
                onChange={(value) => {
                    setFontWeight(value)
                    safeLoadFont(fontFamily, value, fontItalic)
                }}
                data={weightOptions}
            />

            <Switch
                label="Italic"
                checked={fontItalic}
                disabled={!italicSupported}
                onChange={(e) => {
                    const checked = e.currentTarget.checked
                    setFontItalic(checked)
                    safeLoadFont(fontFamily, fontWeight, checked)
                }}
            />
        </>
    )
}
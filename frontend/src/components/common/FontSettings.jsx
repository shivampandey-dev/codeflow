// src/components/common/FontSettings.jsx
import { useState, useMemo, useRef, useCallback, useEffect } from "react"
import { Combobox, useCombobox, InputBase, Switch, Select } from "@mantine/core"

import fontJson from "../../Assets/font_style.json"
import { getFontData, getWeightsFromVariants, hasItalic } from "../../utils/getFontOptions"
import { loadFont } from "../../utils/loadFont"


function buildFontList(json) {
    if (!json) return []
    const list = Array.isArray(json)
        ? json.map((f) => ({ value: f.family, label: f.family }))
        : Object.keys(json).map((key) => ({ value: key, label: key }))
    return list.sort((a, b) => a.label.localeCompare(b.label))
}

// ✅ Monospace pinned at top
const ALL_FONTS = [
    { value: "monospace", label: "Monospace (Default)" },
    ...buildFontList(fontJson)
]

const ITEM_HEIGHT = 34
const VISIBLE_COUNT = 8
const VIEWPORT_HEIGHT = ITEM_HEIGHT * VISIBLE_COUNT

/* ─────────────────────────────────────────────
   DEBOUNCE HOOK
───────────────────────────────────────────── */
function useDebounce(value, delay = 150) {
    const [debounced, setDebounced] = useState(value)
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay)
        return () => clearTimeout(t)
    }, [value, delay])
    return debounced
}

export default function FontSettings({
    fontFamily = "monospace",   // ✅ default prop
    setFontFamily,
    fontWeight,
    setFontWeight,
    fontItalic,
    setFontItalic,
}) {
    const combobox = useCombobox({
        onDropdownClose: () => setSearch(""),
    })

    const [search, setSearch] = useState("")
    const debouncedSearch = useDebounce(search, 150)  // ✅ debounced filter
    const listRef = useRef(null)
    const [scrollTop, setScrollTop] = useState(0)

    /* ─── Filtered list uses DEBOUNCED value so typing doesn't lag ─── */
    const filtered = useMemo(() => {
        const q = debouncedSearch.trim().toLowerCase()
        if (!q) return ALL_FONTS
        return ALL_FONTS.filter((f) => f.label.toLowerCase().includes(q))
    }, [debouncedSearch])

    /* ─── Virtualizer math ─── */
    const totalHeight = filtered.length * ITEM_HEIGHT
    const startIndex = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - 2)
    const endIndex = Math.min(filtered.length, startIndex + VISIBLE_COUNT + 4)
    const visibleItems = filtered.slice(startIndex, endIndex)

    const handleScroll = useCallback((e) => {
        setScrollTop(e.currentTarget.scrollTop)
    }, [])

    /* ─── Reset scroll on new search ─── */
    useEffect(() => {
        if (listRef.current) listRef.current.scrollTop = 0
        setScrollTop(0)
    }, [debouncedSearch])

    /* ─── Font metadata ─── */
    const fontData = getFontData(fontJson, fontFamily)
    const weightOpts = getWeightsFromVariants(fontData)
    const italicOk = hasItalic(fontData)

    function safeLoad(name, weight, italic) {
        if (!name || name === "monospace") return
        loadFont(name, weight, italic)
    }

    /* ─── Lazy: load font only when user hovers an option ─── */
    const handleOptionHover = useCallback((fontName) => {
        if (!fontName || fontName === "monospace") return
        loadFont(fontName, "400", false)   // preview weight only
    }, [])

    const handleSelect = useCallback((value) => {
        setFontFamily(value)
        if (value === "monospace") {
            setFontWeight("400")
            combobox.closeDropdown()
            return
        }
        const data = getFontData(fontJson, value)
        const weights = getWeightsFromVariants(data)
        const w = weights[0]?.value || "400"
        setFontWeight(w)
        safeLoad(value, w, fontItalic)
        combobox.closeDropdown()
    }, [fontItalic, setFontFamily, setFontWeight, combobox])

    /* ─── ✅ Default to monospace label if nothing selected ─── */
    const selectedLabel = ALL_FONTS.find((f) => f.value === fontFamily)?.label
        ?? "Monospace (Default)"

    return (
        <>
            {/* ── FONT FAMILY ── */}
            <Combobox store={combobox} onOptionSubmit={handleSelect} withinPortal={false}>
                <Combobox.Target>
                    <InputBase
                        label={`Font Family (${ALL_FONTS.length} fonts)`}
                        component="button"
                        type="button"
                        pointer
                        rightSection={<Combobox.Chevron />}
                        rightSectionPointerEvents="none"
                        onClick={() => combobox.toggleDropdown()}
                    >
                        {selectedLabel}
                    </InputBase>
                </Combobox.Target>

                <Combobox.Dropdown>
                    <Combobox.Search
                        value={search}
                        onChange={(e) => setSearch(e.currentTarget.value)}
                        placeholder={`Search ${ALL_FONTS.length} fonts…`}
                    />

                    <div
                        ref={listRef}
                        onScroll={handleScroll}
                        style={{ height: VIEWPORT_HEIGHT, overflowY: "auto", position: "relative" }}
                    >
                        <div style={{ height: totalHeight, position: "relative" }}>
                            {visibleItems.map((font, i) => {
                                const absoluteIndex = startIndex + i
                                return (
                                    <Combobox.Option
                                        key={font.value}
                                        value={font.value}
                                        active={font.value === fontFamily}
                                        onMouseEnter={() => handleOptionHover(font.value)} // ✅ lazy load on hover
                                        style={{
                                            position: "absolute",
                                            top: absoluteIndex * ITEM_HEIGHT,
                                            left: 0,
                                            right: 0,
                                            height: ITEM_HEIGHT,
                                            display: "flex",
                                            alignItems: "center",
                                            padding: "0 12px",
                                            cursor: "pointer",
                                            boxSizing: "border-box",
                                        }}
                                    >
                                        {font.label}
                                    </Combobox.Option>
                                )
                            })}
                        </div>
                    </div>

                    {filtered.length === 0 && (
                        <Combobox.Empty>No fonts found</Combobox.Empty>
                    )}

                    <div style={{
                        padding: "4px 12px",
                        fontSize: 11,
                        color: "var(--mantine-color-dimmed)",
                        borderTop: "1px solid var(--mantine-color-default-border)"
                    }}>
                        {filtered.length} font{filtered.length !== 1 ? "s" : ""}
                        {search ? ` matching "${search}"` : " total"}
                    </div>
                </Combobox.Dropdown>
            </Combobox>

            {/* ── FONT WEIGHT ── */}
            <Select
                label="Font Weight"
                value={fontWeight}
                onChange={(v) => { setFontWeight(v); safeLoad(fontFamily, v, fontItalic) }}
                data={weightOpts.length ? weightOpts : [{ value: "400", label: "400" }]}
            />

            {/* ── ITALIC ── */}
            <Switch
                label="Italic"
                checked={fontItalic}
                disabled={!italicOk}
                onChange={(e) => {
                    const c = e.currentTarget.checked
                    setFontItalic(c)
                    safeLoad(fontFamily, fontWeight, c)
                }}
            />
        </>
    )
}
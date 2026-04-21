// src/components/Settings/SettingsPanel.jsx
import {
    Modal,
    Select,
    NumberInput,
    Grid,
    Stack,
    Title,
    Divider,
    Switch,
    Card,
    Group,
} from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import { Palette, FileStack, TerminalSquare, Pencil } from "lucide-react"
import { useSettingsStore } from "../../../store/settingsStore"
import { getThemes } from "../../../utils/getThemes"
import FontSettings from "../../common/FontSettings"

const themes = getThemes()

export default function SettingsPanel({ opened, close }) {
    const isMobile = useMediaQuery("(max-width: 600px)")

    const {
        theme, setTheme,
        editorFontFamily, setEditorFontFamily,
        editorFontWeight, setEditorFontWeight,
        editorFontItalic, setEditorFontItalic,
        fontSize, setFontSize,
        autoSave, setAutoSave,
        autoSaveDelay, setAutoSaveDelay,
        cursorStyle, setCursorStyle,
        wordWrap, setWordWrap,
        minimap, setMinimap,
        fileTreeFontFamily, setFileTreeFontFamily,
        fileTreeFontWeight, setFileTreeFontWeight,
        fileTreeFontItalic, setFileTreeFontItalic,
        fileTreeFontSize, setFileTreeFontSize,
        fileTreeIconSize, setFileTreeIconSize,
        showHiddenFiles, setShowHiddenFiles,
        compactFolders, setCompactFolders,
        terminalFontFamily, setTerminalFontFamily,
        terminalFontWeight, setTerminalFontWeight,
        terminalFontItalic, setTerminalFontItalic,
        terminalFontSize, setTerminalFontSize,
        cursorBlink, setCursorBlink,
        scrollback, setScrollback,
        lineHeight, setLineHeight,
    } = useSettingsStore()

    return (
        <Modal
            opened={opened}
            onClose={close}
            title="Settings"
            /*
             * KEY FIX: use fullScreen on mobile.
             * This avoids all the sizing / centering / overflow edge-cases
             * that make the modal invisible on small viewports.
             */
            fullScreen={isMobile}
            size={isMobile ? "100%" : "90%"}
            centered={!isMobile}
            styles={{
                root: { zIndex: 300 },

                inner: isMobile ? {
                    padding: 0,
                    margin: 0,
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    width: "100%",
                    height: "100%",
                } : undefined,

                header: {
                    backgroundColor: "#1a1e26",
                    borderBottom: "1px solid #2c3140",
                    padding: isMobile ? "12px 14px" : "14px 20px",
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                    flexShrink: 0,
                },
                title: {
                    color: "#c9d1e8",
                    fontWeight: 700,
                    fontSize: isMobile ? 15 : 17,
                },
                close: {
                    color: "#c9d1e8",
                    width: 34,
                    height: 34,
                },
                content: {
                    backgroundColor: "#13161b",
                    borderRadius: isMobile ? 0 : undefined,
                    height: isMobile ? "100%" : undefined,
                    maxHeight: isMobile ? "100%" : "90dvh",
                    display: "flex",
                    flexDirection: "column",
                    // ← fixes iOS/Android bottom bar gap
                    paddingBottom: isMobile ? "env(safe-area-inset-bottom)" : 0,
                },
                body: {
                    padding: isMobile ? "12px" : "20px",
                    overflowY: "auto",       // ← scroll here, not on content
                    flex: 1,
                    minHeight: 0,
                },
            }}
        >
            <Stack gap={isMobile ? "md" : "xl"}>

                {/* ── THEME ──────────────────────────────────────────────── */}
                <Card withBorder p={isMobile ? "sm" : "lg"}
                    style={{ backgroundColor: "#1a1e26", borderColor: "#2c3140" }}>
                    <Stack gap="sm">
                        <Group gap="xs">
                            <Palette size={16} color="#38bdf8" />
                            <Title order={isMobile ? 5 : 4} style={{ color: "#c9d1e8" }}>Theme</Title>
                        </Group>
                        <Select value={theme} onChange={setTheme} data={themes} size={isMobile ? "sm" : "md"} />
                    </Stack>
                </Card>

                <Divider color="#2c3140" />

                <Grid gutter={isMobile ? "sm" : "md"}>

                    {/* ── FILE TREE ──────────────────────────────────────── */}
                    <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                        <Card withBorder p={isMobile ? "sm" : "lg"} h="100%"
                            style={{ backgroundColor: "#1a1e26", borderColor: "#2c3140" }}>
                            <Stack gap="sm">
                                <Group gap="xs">
                                    <FileStack size={15} color="#38bdf8" />
                                    <Title order={5} style={{ color: "#c9d1e8", fontSize: 14 }}>File Tree</Title>
                                </Group>
                                <NumberInput label="Font Size" value={fileTreeFontSize}
                                    onChange={setFileTreeFontSize} size="sm" />
                                <Select
                                    label="Icon Size"
                                    value={String(fileTreeIconSize)}
                                    onChange={(v) => setFileTreeIconSize(Number(v))}
                                    size="sm"
                                    data={[
                                        { value: "14", label: "Small" },
                                        { value: "16", label: "Medium" },
                                        { value: "20", label: "Large" },
                                    ]}
                                />
                                <FontSettings
                                    fontFamily={fileTreeFontFamily} setFontFamily={setFileTreeFontFamily}
                                    fontWeight={fileTreeFontWeight} setFontWeight={setFileTreeFontWeight}
                                    fontItalic={fileTreeFontItalic} setFontItalic={setFileTreeFontItalic}
                                />
                                <Switch label="Show Hidden Files" checked={showHiddenFiles} size="sm"
                                    onChange={(e) => setShowHiddenFiles(e.currentTarget.checked)} />
                                <Switch label="Compact Folders" checked={compactFolders} size="sm"
                                    onChange={(e) => setCompactFolders(e.currentTarget.checked)} />
                            </Stack>
                        </Card>
                    </Grid.Col>

                    {/* ── EDITOR ─────────────────────────────────────────── */}
                    <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                        <Card withBorder p={isMobile ? "sm" : "lg"} h="100%"
                            style={{ backgroundColor: "#1a1e26", borderColor: "#2c3140" }}>
                            <Stack gap="sm">
                                <Group gap="xs">
                                    <Pencil size={15} color="#38bdf8" />
                                    <Title order={5} style={{ color: "#c9d1e8", fontSize: 14 }}>Editor</Title>
                                </Group>
                                <NumberInput label="Font Size" value={fontSize} onChange={setFontSize} size="sm" />
                                <FontSettings
                                    fontFamily={editorFontFamily} setFontFamily={setEditorFontFamily}
                                    fontWeight={editorFontWeight} setFontWeight={setEditorFontWeight}
                                    fontItalic={editorFontItalic} setFontItalic={setEditorFontItalic}
                                />
                                <Divider color="#2c3140" />
                                <Switch label="Auto Save" checked={autoSave} size="sm"
                                    onChange={(e) => setAutoSave(e.currentTarget.checked)} />
                                <NumberInput label="Auto Save Delay (ms)" value={autoSaveDelay}
                                    onChange={setAutoSaveDelay} size="sm" />
                                <Select label="Cursor Style" value={cursorStyle} onChange={setCursorStyle}
                                    size="sm"
                                    data={[
                                        { value: "line", label: "Line" },
                                        { value: "block", label: "Block" },
                                        { value: "underline", label: "Underline" },
                                    ]}
                                />
                                <Switch label="Word Wrap" checked={wordWrap} size="sm"
                                    onChange={(e) => setWordWrap(e.currentTarget.checked)} />
                                <Switch label="Minimap" checked={minimap} size="sm"
                                    onChange={(e) => setMinimap(e.currentTarget.checked)} />
                            </Stack>
                        </Card>
                    </Grid.Col>

                    {/* ── TERMINAL ───────────────────────────────────────── */}
                    <Grid.Col span={{ base: 12, sm: 12, md: 4 }}>
                        <Card withBorder p={isMobile ? "sm" : "lg"} h="100%"
                            style={{ backgroundColor: "#1a1e26", borderColor: "#2c3140" }}>
                            <Stack gap="sm">
                                <Group gap="xs">
                                    <TerminalSquare size={15} color="#38bdf8" />
                                    <Title order={5} style={{ color: "#c9d1e8", fontSize: 14 }}>Terminal</Title>
                                </Group>
                                <NumberInput label="Font Size" value={terminalFontSize}
                                    onChange={setTerminalFontSize} size="sm" />
                                <FontSettings
                                    fontFamily={terminalFontFamily} setFontFamily={setTerminalFontFamily}
                                    fontWeight={terminalFontWeight} setFontWeight={setTerminalFontWeight}
                                    fontItalic={terminalFontItalic} setFontItalic={setTerminalFontItalic}
                                />
                                <Divider color="#2c3140" />
                                <Switch label="Cursor Blink" checked={cursorBlink} size="sm"
                                    onChange={(e) => setCursorBlink(e.currentTarget.checked)} />
                                <NumberInput label="Scrollback Buffer" value={scrollback}
                                    onChange={setScrollback} size="sm" />
                                <NumberInput label="Line Height" value={lineHeight}
                                    onChange={setLineHeight} step={0.1} size="sm" />
                            </Stack>
                        </Card>
                    </Grid.Col>

                </Grid>
            </Stack>
        </Modal>
    )
}
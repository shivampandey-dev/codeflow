// src/components/Settings/SettingsPanel.jsx  ← adjust path if different
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
    Group
} from "@mantine/core"

import {
    Palette,
    FileStack,
    TerminalSquare,
    Pencil
} from "lucide-react"

import { useSettingsStore } from "../../../store/settingsStore"
import { getThemes } from "../../../utils/getThemes"
import FontSettings from "../../common/FontSettings"



const themes = getThemes()

export default function SettingsPanel({ opened, close }) {

    const {
        theme,
        setTheme,

        /* EDITOR */
        editorFontFamily, setEditorFontFamily,
        editorFontWeight, setEditorFontWeight,
        editorFontItalic, setEditorFontItalic,
        fontSize, setFontSize,
        autoSave, setAutoSave,
        autoSaveDelay, setAutoSaveDelay,
        cursorStyle, setCursorStyle,
        wordWrap, setWordWrap,
        minimap, setMinimap,

        /* FILE TREE */
        fileTreeFontFamily, setFileTreeFontFamily,
        fileTreeFontWeight, setFileTreeFontWeight,
        fileTreeFontItalic, setFileTreeFontItalic,
        fileTreeFontSize, setFileTreeFontSize,
        fileTreeIconSize, setFileTreeIconSize,
        showHiddenFiles, setShowHiddenFiles,
        compactFolders, setCompactFolders,

        /* TERMINAL */
        terminalFontFamily, setTerminalFontFamily,
        terminalFontWeight, setTerminalFontWeight,
        terminalFontItalic, setTerminalFontItalic,
        terminalFontSize, setTerminalFontSize,
        cursorBlink, setCursorBlink,
        scrollback, setScrollback,
        lineHeight, setLineHeight,

    } = useSettingsStore()

    return (
        <Modal opened={opened} onClose={close} title="Settings" size="95%" centered >
            <Stack gap="xl">

                {/* THEME */}
                <Card withBorder p="lg">
                    <Stack>
                        <Group>
                            <Palette size={18} />
                            <Title order={4}>Theme</Title>
                        </Group>
                        <Select value={theme} onChange={setTheme} data={themes} />
                    </Stack>
                </Card>

                <Divider />

                <Grid>

                    {/* FILE TREE */}
                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <Card withBorder p="lg">
                            <Stack>
                                <Group>
                                    <FileStack size={18} />
                                    <Title order={5}>FileTree</Title>
                                </Group>

                                <NumberInput
                                    label="Font Size"
                                    value={fileTreeFontSize}
                                    onChange={setFileTreeFontSize}
                                />

                                <Select
                                    label="Icon Size"
                                    value={String(fileTreeIconSize)}
                                    onChange={(v) => setFileTreeIconSize(Number(v))}
                                    data={[
                                        { value: "14", label: "Small" },
                                        { value: "16", label: "Medium" },
                                        { value: "20", label: "Large" }
                                    ]}
                                />

                                {/* ✅ NEW FontSettings */}
                                <FontSettings
                                    fontFamily={fileTreeFontFamily}
                                    setFontFamily={setFileTreeFontFamily}
                                    fontWeight={fileTreeFontWeight}
                                    setFontWeight={setFileTreeFontWeight}
                                    fontItalic={fileTreeFontItalic}
                                    setFontItalic={setFileTreeFontItalic}
                                />

                                <Switch
                                    label="Show Hidden Files"
                                    checked={showHiddenFiles}
                                    onChange={(e) => setShowHiddenFiles(e.currentTarget.checked)}
                                />
                                <Switch
                                    label="Compact Folders"
                                    checked={compactFolders}
                                    onChange={(e) => setCompactFolders(e.currentTarget.checked)}
                                />
                            </Stack>
                        </Card>
                    </Grid.Col>

                    {/* EDITOR */}
                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <Card withBorder p="lg">
                            <Stack>
                                <Group>
                                    <Pencil size={18} />
                                    <Title order={5}>Editor</Title>
                                </Group>

                                <NumberInput
                                    label="Font Size"
                                    value={fontSize}
                                    onChange={setFontSize}
                                />

                                {/* ✅ NEW FontSettings */}
                                <FontSettings
                                    fontFamily={editorFontFamily}
                                    setFontFamily={setEditorFontFamily}
                                    fontWeight={editorFontWeight}
                                    setFontWeight={setEditorFontWeight}
                                    fontItalic={editorFontItalic}
                                    setFontItalic={setEditorFontItalic}
                                />

                                <Divider />

                                <Switch
                                    label="Auto Save"
                                    checked={autoSave}
                                    onChange={(e) => setAutoSave(e.currentTarget.checked)}
                                />
                                <NumberInput
                                    label="Auto Save Delay"
                                    value={autoSaveDelay}
                                    onChange={setAutoSaveDelay}
                                />
                                <Select
                                    label="Cursor Style"
                                    value={cursorStyle}
                                    onChange={setCursorStyle}
                                    data={[
                                        { value: "line", label: "Line" },
                                        { value: "block", label: "Block" },
                                        { value: "underline", label: "Underline" }
                                    ]}
                                />
                                <Switch
                                    label="Word Wrap"
                                    checked={wordWrap}
                                    onChange={(e) => setWordWrap(e.currentTarget.checked)}
                                />
                                <Switch
                                    label="Minimap"
                                    checked={minimap}
                                    onChange={(e) => setMinimap(e.currentTarget.checked)}
                                />
                            </Stack>
                        </Card>
                    </Grid.Col>

                    {/* TERMINAL */}
                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <Card withBorder p="lg">
                            <Stack>
                                <Group>
                                    <TerminalSquare size={18} />
                                    <Title order={5}>Terminal</Title>
                                </Group>

                                <NumberInput
                                    label="Font Size"
                                    value={terminalFontSize}
                                    onChange={setTerminalFontSize}
                                />

                                {/* ✅ NEW FontSettings */}
                                <FontSettings
                                    fontFamily={terminalFontFamily}
                                    setFontFamily={setTerminalFontFamily}
                                    fontWeight={terminalFontWeight}
                                    setFontWeight={setTerminalFontWeight}
                                    fontItalic={terminalFontItalic}
                                    setFontItalic={setTerminalFontItalic}
                                />

                                <Divider />

                                <Switch
                                    label="Cursor Blink"
                                    checked={cursorBlink}
                                    onChange={(e) => setCursorBlink(e.currentTarget.checked)}
                                />
                                <NumberInput
                                    label="Scrollback Buffer"
                                    value={scrollback}
                                    onChange={setScrollback}
                                />
                                <NumberInput
                                    label="Line Height"
                                    value={lineHeight}
                                    onChange={setLineHeight}
                                    step={0.1}
                                />
                            </Stack>
                        </Card>
                    </Grid.Col>

                </Grid>
            </Stack>
        </Modal>
    )
}
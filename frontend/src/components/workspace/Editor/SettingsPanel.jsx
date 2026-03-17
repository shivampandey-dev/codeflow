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
    Text,
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

const themes = getThemes()

export default function SettingsPanel({ opened, close }) {

    const {
        fontSize,
        setFontSize,
        theme,
        setTheme,

        fileTreeFontSize,
        fileTreeIconSize,
        showHiddenFiles,
        compactFolders,

        setFileTreeFontSize,
        setFileTreeIconSize,
        setShowHiddenFiles,
        setCompactFolders
    } = useSettingsStore()

    return (
        <Modal
            opened={opened}
            onClose={close}
            title="Settings"
            size="95%"
            centered
            overlayProps={{ blur: 4 }}
            styles={{
                body: { paddingTop: 20 },
                title: { fontSize: 20, fontWeight: 600 }
            }}
        >

            <Stack gap="xl">

                {/* GLOBAL THEME */}
                <Card
                    withBorder
                    radius="md"
                    p="lg"
                    style={{
                        background: "rgba(255,255,255,0.02)",
                        borderColor: "rgba(255,255,255,0.08)"
                    }}
                >

                    <Stack gap="sm">

                        <Group gap={6}>
                            <Palette size={18} color="#8ab4ff" />
                            <Title order={4}>Theme</Title>
                        </Group>

                        <Text size="sm" c="dimmed">
                            Global theme applied to all components.
                        </Text>

                        <Select
                            value={theme}
                            onChange={setTheme}
                            data={themes}
                        />

                    </Stack>

                </Card>

                <Divider />

                {/* SETTINGS GRID */}
                <Grid gutter="xl">

                    {/* FILETREE */}
                    {/* FILETREE */}
                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <Card
                            withBorder
                            radius="md"
                            p="lg"
                            style={{
                                background: "rgba(255,255,255,0.02)",
                                borderColor: "rgba(255,255,255,0.08)"
                            }}
                        >
                            <Stack gap="md">

                                <Group gap={6}>
                                    <FileStack size={18} color="#60a5fa" />
                                    <Title order={5}>FileTree</Title>
                                </Group>

                                <NumberInput
                                    label="Font Size"
                                    min={10}
                                    max={24}
                                    value={fileTreeFontSize}
                                    onChange={setFileTreeFontSize}
                                />

                                <Select
                                    label="Icon Size"
                                    value={String(fileTreeIconSize)}
                                    onChange={(value) => setFileTreeIconSize(Number(value))}
                                    data={[
                                        { value: "14", label: "Small" },
                                        { value: "16", label: "Medium" },
                                        { value: "20", label: "Large" }
                                    ]}
                                />

                                <Divider />

                                <Switch
                                    label="Show Hidden Files"
                                    checked={showHiddenFiles}
                                    onChange={(e) =>
                                        setShowHiddenFiles(e.currentTarget.checked)
                                    }
                                />

                                <Switch
                                    label="Compact Folders"
                                    checked={compactFolders}
                                    onChange={(e) =>
                                        setCompactFolders(e.currentTarget.checked)
                                    }
                                />

                            </Stack>
                        </Card>
                    </Grid.Col>


                    {/* EDITOR */}
                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <Card
                            withBorder
                            radius="md"
                            p="lg"
                            style={{
                                background: "rgba(255,255,255,0.02)",
                                borderColor: "rgba(255,255,255,0.08)"
                            }}
                        >

                            <Stack gap="md">

                                <Group gap={6}>
                                    <Pencil size={18} color="#a78bfa" />
                                    <Title order={5}>Editor</Title>
                                </Group>

                                <NumberInput
                                    label="Font Size"
                                    value={fontSize}
                                    onChange={setFontSize}
                                    min={10}
                                    max={40}
                                />

                                <Select
                                    label="Font Style"
                                    data={[
                                        { value: "monospace", label: "Monospace" },
                                        { value: "jetbrains", label: "JetBrains Mono" },
                                        { value: "fira", label: "Fira Code" }
                                    ]}
                                />

                                <Divider />

                                <Switch label="Auto Save" />

                                <NumberInput
                                    label="Auto Save Delay (ms)"
                                    min={200}
                                    max={5000}
                                    defaultValue={1000}
                                />

                                <Divider />

                                <Select
                                    label="Cursor Style"
                                    data={[
                                        { value: "line", label: "Line" },
                                        { value: "block", label: "Block" },
                                        { value: "underline", label: "Underline" }
                                    ]}
                                />

                                <Switch label="Word Wrap" />
                                <Switch label="Show Minimap" />

                            </Stack>

                        </Card>
                    </Grid.Col>


                    {/* TERMINAL */}
                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <Card
                            withBorder
                            radius="md"
                            p="lg"
                            style={{
                                background: "rgba(255,255,255,0.02)",
                                borderColor: "rgba(255,255,255,0.08)"
                            }}
                        >

                            <Stack gap="md">

                                <Group gap={6}>
                                    <TerminalSquare size={18} color="#34d399" />
                                    <Title order={5}>Terminal</Title>
                                </Group>

                                <NumberInput
                                    label="Font Size"
                                    min={10}
                                    max={24}
                                    defaultValue={13}
                                />

                                <Select
                                    label="Font Family"
                                    data={[
                                        { value: "monospace", label: "Monospace" },
                                        { value: "jetbrains", label: "JetBrains Mono" },
                                        { value: "fira", label: "Fira Code" }
                                    ]}
                                />

                                <Divider />

                                <Switch label="Cursor Blink" />

                                <NumberInput
                                    label="Scrollback Buffer"
                                    min={100}
                                    max={5000}
                                    defaultValue={1000}
                                />

                                <NumberInput
                                    label="Line Height"
                                    min={1}
                                    max={2}
                                    step={0.1}
                                    defaultValue={1.2}
                                />

                            </Stack>

                        </Card>
                    </Grid.Col>

                </Grid>

            </Stack>
        </Modal>
    )
}
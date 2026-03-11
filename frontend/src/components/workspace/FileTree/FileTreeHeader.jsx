import { Group, Text, ActionIcon } from "@mantine/core"
import {
    FilePlus,
    FolderPlus,
    RefreshCw,
    MoreHorizontal
} from "lucide-react"

export default function FileTreeHeader({ refresh }) {

    return (

        <Group
            justify="space-between"
            style={{
                padding: "6px 8px",
                borderBottom: "1px solid #1e293b"
            }}
        >

            <Text size="xs" fw={700} c="gray">
                EXPLORER
            </Text>

            <Group gap={4}>

                <ActionIcon size="sm" variant="subtle">
                    <FilePlus size={14} />
                </ActionIcon>

                <ActionIcon size="sm" variant="subtle">
                    <FolderPlus size={14} />
                </ActionIcon>

                <ActionIcon size="sm" variant="subtle" onClick={refresh}>
                    <RefreshCw size={14} />
                </ActionIcon>

                <ActionIcon size="sm" variant="subtle">
                    <MoreHorizontal size={14} />
                </ActionIcon>

            </Group>

        </Group>

    )
}
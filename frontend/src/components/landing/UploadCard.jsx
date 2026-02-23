import { Text, Button, Stack } from "@mantine/core";
import { IconUpload } from "@tabler/icons-react";
import GlassCard from "../common/GlassCard";

export default function UploadCard() {
    return (
        <GlassCard>
            <Stack align="center" gap={16}>
                <IconUpload size={48} color="#22c55e" />

                <Text fw={600} size="lg">
                    Upload Folder
                </Text>

                <Text size="sm" c="dimmed" ta="center">
                    Open local project instantly
                </Text>

                <Button
                    radius="xl"
                    fullWidth
                    style={{
                        background: "linear-gradient(90deg,#14b8a6,#22c55e)",
                    }}
                >
                    Upload
                </Button>
            </Stack>
        </GlassCard>
    );
}
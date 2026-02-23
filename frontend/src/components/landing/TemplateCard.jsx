import { Text, Button, Stack } from "@mantine/core";
import { IconBolt } from "@tabler/icons-react";
import GlassCard from "../common/GlassCard";

export default function TemplateCard() {
    return (
        <GlassCard>
            <Stack align="center" gap={16}>
                <IconBolt size={48} color="#facc15" />

                <Text fw={600} size="lg">
                    Start with a Template
                </Text>

                <Text size="sm" c="dimmed" ta="center">
                    React, Node and more
                </Text>

                <Button
                    radius="xl"
                    fullWidth
                    style={{
                        background: "linear-gradient(90deg,#06b6d4,#3b82f6)",
                    }}
                >
                    New Project
                </Button>
            </Stack>
        </GlassCard>
    );
}
import { Button, Group } from "@mantine/core";

export default function CTAButtons() {
    return (
        <Group>
            <Button
                radius="xl"
                size="lg"
                style={{
                    background: "linear-gradient(90deg,#2563eb,#3b82f6)",
                    padding: "14px 28px",
                    fontWeight: 600,
                }}
            >
                Start Coding
            </Button>

            <Button
                radius="xl"
                size="lg"
                variant="outline"
                style={{
                    borderColor: "#3b82f6",
                    color: "#60a5fa",
                    padding: "14px 28px",
                }}
            >
                View Templates
            </Button>
        </Group>
    );
}
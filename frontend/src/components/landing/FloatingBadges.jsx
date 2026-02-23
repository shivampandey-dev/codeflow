import { Badge, Group } from "@mantine/core";

export default function FloatingBadges() {
    return (
        <Group
            style={{
                position: "absolute",
                top: -40,
                right: 0,
            }}
        >
            <Badge color="blue">JS-FIRST</Badge>
            <Badge color="green">ZERO SETUP</Badge>
            <Badge color="violet">SECURE SANDBOX</Badge>
        </Group>
    );
}
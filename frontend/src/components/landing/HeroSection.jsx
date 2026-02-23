import { Box, Stack, Title, Text } from "@mantine/core";
import CTAButtons from "./CTAButtons";
import CodePreview from "./CodePreview";
import FloatingBadges from "./FloatingBadges";

export default function HeroSection() {
    return (
        <Box
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 80,
                flexWrap: "wrap",
                minHeight: "70vh",
            }}
        >
            <Stack maw={520} gap={26}>
                <Title
                    style={{
                        fontSize: 76,
                        fontWeight: 900,
                        letterSpacing: -2,
                    }}
                >
                    Code
                    <span
                        style={{
                            background: "linear-gradient(90deg,#60a5fa,#3b82f6)",
                            WebkitBackgroundClip: "text",
                            color: "transparent",
                        }}
                    >
                        Flow
                    </span>
                </Title>

                <Text size="lg" c="dimmed">
                    Build, run, and ship JavaScript — instantly in your browser.
                </Text>

                <CTAButtons />
            </Stack>

            <Box pos="relative">
                <FloatingBadges />
                <CodePreview />
            </Box>
        </Box>
    );
}
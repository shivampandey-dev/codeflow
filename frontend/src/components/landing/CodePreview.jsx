import { Paper, Text } from "@mantine/core";

export default function CodePreview() {
    return (
        <Paper
            radius="xl"
            p="lg"
            shadow="xl"
            style={{
                width: 420,
                background: "rgba(15,23,42,0.9)",
                backdropFilter: "blur(30px)",
                border: "1px solid rgba(255,255,255,0.08)",
                fontFamily: "monospace",
            }}
        >
            <Text c="#60a5fa">import {'{ createRoot }'} from 'react-dom/client'</Text>
            <Text mt={8}>function App() {'{'}</Text>
            <Text ml={16} c="#34d399">
                return &lt;h1&gt;Welcome to CodeFlow 🚀&lt;/h1&gt;
            </Text>
            <Text>{'}'}</Text>
        </Paper>
    );
}
import { Card } from "@mantine/core";

export default function GlassCard({ children }) {
    return (
        <Card
            radius="xl"
            p="xl"
            style={{
                backdropFilter: "blur(30px)",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                width: 360,
            }}
        >
            {children}
        </Card>
    );
}
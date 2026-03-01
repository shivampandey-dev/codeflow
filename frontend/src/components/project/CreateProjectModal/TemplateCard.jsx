import { Box, Text } from "@mantine/core";

export default function TemplateCard({
    template,
    active,
    onClick,
}) {
    const Icon = template.icon;

    return (
        <Box
            onClick={onClick}
            style={{
                padding: "18px 16px",
                borderRadius: 14,
                cursor: "pointer",
                userSelect: "none",

                background: active
                    ? "rgba(99,102,241,0.18)"
                    : "rgba(15,23,42,0.55)",

                border: active
                    ? "1px solid rgba(99,102,241,0.6)"
                    : "1px solid rgba(255,255,255,0.08)",

                backdropFilter: "blur(14px)",

                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                textAlign: "center",

                transform: active
                    ? "translateY(-4px) scale(1.04)"
                    : "translateY(0px)",

                boxShadow: active
                    ? `0 0 40px ${template.color}40`
                    : "0 10px 30px rgba(0,0,0,0.5)",

                transition:
                    "all 0.25s cubic-bezier(.16,1,.3,1)",
            }}
        >
            <Icon size={28} color={template.color} />

            <Text
                style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#e2e8f0",
                }}
            >
                {template.label}
            </Text>
        </Box>
    );
}
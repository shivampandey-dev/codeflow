import { Box } from "@mantine/core";
import { useEffect, useRef } from "react";
import BackgroundLanding from "../../components/landing/BackgroundLanding";
import CTAButtons from "../../components/landing/CTAButtons";
import SectionNeuralBackground from "../../components/common/SectionNeuralBackground";

export default function LandingPage() {
    return (
        <Box pos="relative">

            {/* HERO SECTION */}
            <Box pos="relative" mih="100vh">
                <BackgroundLanding />
            </Box>

            {/* CTA SECTION */}
            <Box
                py={140}
                px={60}
                style={{
                    position: "relative",
                    background: "#010205",
                    overflow: "hidden",
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                {/* ✅ NEURAL BACKGROUND */}
                <SectionNeuralBackground />

                {/* ✅ FADE OVERLAY (smooth transition from hero) */}
                <Box
                    style={{
                        position: "absolute",
                        inset: 0,
                        background: `
              radial-gradient(
                ellipse at top,
                rgba(59,130,246,0.12) 0%,
                rgba(1,2,5,1) 55%
              )
            `,
                        pointerEvents: "none",
                    }}
                />

                {/* CONTENT */}
                <Box style={{ position: "relative", zIndex: 2 }}>
                    <CTAButtons />
                </Box>
            </Box>

        </Box>
    );
}

/* ================= CTA NEURAL BACKGROUND ================= */


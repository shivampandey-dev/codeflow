import { Box } from "@mantine/core";
import BackgroundLanding from "../../components/landing/BackgroundLanding";
import CTAButtons from "../../components/landing/CTAButtons";
import SectionNeuralBackground from "../../components/common/SectionNeuralBackground";
import "../../components/Style/AllLandingStyle.css";
import IDEComparisonSection from "../../components/landing/IDEComparisonSection";
import SectionHero from "../../components/common/SectionHero";
import ProcessFlow from "../../components/common/ProcessFlow";
import CodeTransformSection from "../../components/landing/CodeTransformSection";


export default function LandingPage() {
    return (
        <Box pos="relative">
            {/* HERO SECTION */}
            <Box pos="relative" mih="100vh">
                <BackgroundLanding />
            </Box>

            {/* CTA SECTION - responsive paddings */}
            <Box
                style={{
                    position: "relative",
                    background: "#010205",
                    overflow: "hidden",
                    display: "flex",
                    justifyContent: "center",

                    /* Responsive vertical and horizontal padding */
                    paddingBlock: "clamp(40px, 12vh, 140px)",      // top/bottom
                    paddingInline: "clamp(16px, 6vw, 60px)",       // left/right

                    boxSizing: "border-box",                       // critical
                    width: "100%",
                }}
            >
                {/* NEURAL BACKGROUND (absolute, non-layout) */}
                <SectionNeuralBackground />

                {/* FADE OVERLAY */}
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
                        zIndex: 1,
                    }}
                />

                {/* CONTENT (stacked above background) */}
                <Box style={{ position: "relative", zIndex: 2, width: "100%" }}>
              
                    <SectionHero title="Why Codeflow" />
                    <IDEComparisonSection />
                    <ProcessFlow isLoader={false} />
                    <CodeTransformSection />
                    <CTAButtons />
                </Box>
            </Box>
        </Box>
    );
}
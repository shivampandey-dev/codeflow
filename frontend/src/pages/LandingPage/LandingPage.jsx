import { Box } from "@mantine/core";
import BackgroundLanding from "../../components/landing/BackgroundLanding";
import CTAButtons from "../../components/landing/CTAButtons";
import SectionNeuralBackground from "../../components/common/SectionNeuralBackground";
import "../../components/Style/AllLandingStyle.css";
import IDEComparisonSection from "../../components/landing/IDEComparisonSection";
import SectionHero from "../../components/common/SectionHero";
import ProcessFlow from "../../components/common/ProcessFlow";
import CodeTransformSection from "../../components/landing/CodeTransformSection";
import TechFooter from "../../components/common/TechFooter";
import CodeflowFeatures from "../../components/landing/CodeflowFeatures";

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

                    paddingBlock: "clamp(40px, 12vh, 140px)",
                    paddingInline: "clamp(16px, 6vw, 60px)",

                    boxSizing: "border-box",
                    width: "100%",
                }}
            >

                {/* NEURAL BACKGROUND */}
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

                {/* CONTENT */}
                <Box
                    style={{
                        position: "relative",
                        zIndex: 2,
                        width: "100%",
                    }}
                >

                    {/* WHAT CODEFLOW DOES */}
                    <CodeTransformSection />

                    {/* MAIN FEATURES */}
                    <CodeflowFeatures />

                    {/* HOW IT WORKS */}
                    <ProcessFlow isLoader={false} />

                    {/* WHY CODEFLOW */}
                    <SectionHero title="Why Codeflow" />
                    <IDEComparisonSection />

                    {/* FINAL CTA */}
                    <CTAButtons />

                    {/* FOOTER */}
                    <TechFooter />

                </Box>
            </Box>
        </Box>
    );
}
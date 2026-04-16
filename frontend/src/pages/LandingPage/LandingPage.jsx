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
        <Box
            pos="relative"
            style={{
                overscrollBehavior: "none",
                WebkitOverflowScrolling: "touch",
            }}
        >
            {/* ── HERO ── */}
            <Box pos="relative" mih="100vh">
                <BackgroundLanding />
            </Box>

            {/* ── BELOW-THE-FOLD CONTENT ── */}
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
                {/* Subtle neural mesh — skips itself on mobile */}
                <SectionNeuralBackground />

                {/* Top-edge radial fade so hero bleeds into content */}
                <Box
                    style={{
                        position: "absolute",
                        inset: 0,
                        background:
                            "radial-gradient(ellipse at top, rgba(59,130,246,0.10) 0%, rgba(1,2,5,1) 55%)",
                        pointerEvents: "none",
                        zIndex: 1,
                    }}
                />

                <Box style={{ position: "relative", zIndex: 2, width: "100%" }}>
                    {/* SECTION 1 — live coding demo */}
                    <CodeTransformSection />

                    {/* SECTION 2 — feature cards */}
                    <SectionHero
                        title="Everything You Need"
                        subtitle="A full dev environment that lives in your browser — terminal, packages, frameworks and all."
                    />
                    <CodeflowFeatures />

                    {/* SECTION 3 — workflow pipeline */}
                    <SectionHero
                        title="From Idea to Output in Seconds"
                        subtitle="Open a template, write code, test it live, download your project. No CLI required."
                    />
                    <ProcessFlow isLoader={false} />

                    {/* SECTION 4 — IDE comparison */}
                    <SectionHero
                        title="Why Developers Choose Codeflow"
                        subtitle="Traditional cloud IDEs keep you waiting. Codeflow runs entirely on your device — instant startup, zero latency, works offline."
                    />
                    <IDEComparisonSection />

                    {/* SECTION 5 — final CTA */}
                    <CTAButtons />

                    {/* FOOTER */}
                    <TechFooter />
                </Box>
            </Box>
        </Box>
    );
}
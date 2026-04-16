import { Box } from "@mantine/core";
import { useEffect } from "react";
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
    /* ── Dynamic browser tab title ── */

    return (
        <Box pos="relative">
            {/* ── HERO ── */}
            <Box pos="relative" mih="100vh" style={{
                overscrollBehavior: "none",
                WebkitOverflowScrolling: "touch", // momentum scroll on iOS
            }}>
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
                {/* Subtle neural mesh */}
                <SectionNeuralBackground />

                {/* Top-edge radial fade so hero bleeds into content */}
                <Box
                    style={{
                        position: "absolute",
                        inset: 0,
                        background: `
radial-gradient(ellipse 85% 50% at 50% 8%,

    rgba(80, 40, 200, 0.20) 0%, transparent 60%),

  radial-gradient(ellipse 50% 30% at 50% 55%,

    rgba(0, 180, 130, 0.08) 0%, transparent 55%),

  radial-gradient(ellipse 70% 30% at 20% 40%,

    rgba(60, 20, 160, 0.10) 0%, transparent 50%),

  linear-gradient(to bottom,

    #000208 0%, #040916 35%, #030810 65%, #020a14 100%);
  `,
                        pointerEvents: "none",
                        zIndex: 1,
                    }}
                />

                <Box style={{ position: "relative", zIndex: 2, width: "100%" }}>

                    {/* SECTION 1 — live coding demo */}
                    {/* "See your code run as you type — no installs, no setup." */}
                    <CodeTransformSection />

                    {/* SECTION 2 — feature cards */}
                    {/* "Everything a dev environment needs, zero the friction." */}
                    <SectionHero
                        title="Everything You Need"
                        subtitle="A full dev environment that lives in your browser — terminal, packages, frameworks and all."
                    />
                    <CodeflowFeatures />

                    {/* SECTION 3 — workflow pipeline */}
                    {/* "Browser → Type → Test → Output → Download" */}
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
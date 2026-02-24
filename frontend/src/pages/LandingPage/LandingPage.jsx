import { Box, Group } from "@mantine/core";
import BackgroundLanding from "../../components/landing/BackgroundLanding";
import TemplateCard from "../../components/landing/TemplateCard";
import UploadCard from "../../components/landing/UploadCard";

export default function LandingPage() {
    return (
        <Box pos="relative" mih="100vh" px={60} pt={40}>
            <BackgroundLanding />
        </Box>
    );
}
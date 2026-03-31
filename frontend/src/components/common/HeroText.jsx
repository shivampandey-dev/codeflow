import { useState, useEffect } from "react";
import { Box } from "@mantine/core";
import "../Style/HeroText.css";

const phrases = [
    "Streamline your coding workflow and increase productivity.",
    "Build, run, and deploy apps directly in your browser.",
    "Create projects instantly without installing anything.",
    "Spin up development environments in seconds.",
    "Write, test, and ship code faster with Codeflow."
];

export default function HeroText({ embedded = false }) {
    const [index, setIndex] = useState(0);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setVisible(false);
            setTimeout(() => {
                setIndex((i) => (i + 1) % phrases.length);
                setVisible(true);
            }, 250);
        }, 2600);
        return () => clearInterval(interval);
    }, []);

    return (
        <Box className={embedded ? "heroWrapper--embedded" : "heroWrapper"}>
            <h1 className="heroTitle">
                <span>Ship better code,</span>
                <span className="heroAccent">faster.</span>
            </h1>
            <p className={`heroDynamic ${visible ? "fadeIn" : "fadeOut"}`}>
                {phrases[index]}
            </p>
        </Box>
    );
}
import {
    Atom,
    FileCode,
    Braces,
    Globe,
    Server,
    Boxes,
    Rocket,
    Layers,
    Terminal,
    Package,
    Cpu,
    Wand2,
} from "lucide-react";

export const templateCategories = [
    {
        title: "Frontend",
        id: "frontend",
        templates: [
            {
                id: "react",
                label: "React",
                icon: Atom,
                color: "#61dafb",
                description: "React + Vite starter with fast refresh.",
                recommended: true,
                preview: "/previews/react.png",
            },
            {
                id: "vue",
                label: "Vue",
                icon: Boxes,
                color: "#42b883",
                description: "Vue 3 + Vite starter template.",
                preview: "/previews/vue.png",
            },
            {
                id: "svelte",
                label: "Svelte",
                icon: Rocket,
                color: "#ff3e00",
                description: "Svelte starter with lightning performance.",
            },
            {
                id: "javascript",
                label: "JavaScript",
                icon: FileCode,
                color: "#f7df1e",
                description: "Vanilla JS playground.",
            },
            {
                id: "typescript",
                label: "TypeScript",
                icon: Braces,
                color: "#3178c6",
                description: "TypeScript starter project.",
            },
            {
                id: "htmlcssjs",
                label: "HTML CSS JS",
                icon: Globe,
                color: "#38bdf8",
                description: "Classic web starter.",
            },
        ],
    },

    {
        title: "Backend",
        id: "backend",
        templates: [
            {
                id: "node",
                label: "Node.js",
                icon: Server,
                color: "#68a063",
                description: "Node server starter.",
            },
            {
                id: "express",
                label: "Express",
                icon: Server,
                color: "#9ca3af",
                description: "Express REST API template.",
                recommended: true,
            },
            {
                id: "fastify",
                label: "Fastify",
                icon: Cpu,
                color: "#000000",
                description: "Fastify high-performance backend.",
            },
        ],
    },

    {
        title: "Fullstack",
        id: "fullstack",
        templates: [
            {
                id: "next",
                label: "Next.js",
                icon: Layers,
                color: "#ffffff",
                description: "Next.js fullstack framework.",
                recommended: true,
            },
            {
                id: "astro",
                label: "Astro",
                icon: Wand2,
                color: "#ff5d01",
                description: "Astro static + server framework.",
            },
        ],
    },

 
];
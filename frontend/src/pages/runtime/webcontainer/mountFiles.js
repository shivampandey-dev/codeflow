/* ================================
   SHARED HTML STYLE
================================ */

const baseHtml = (entry) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Codeflow</title>

    <style>
      body {
        margin: 0;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: radial-gradient(circle at top, #0b1220, #020617);
        color: #e2e8f0;
        font-family: Inter, system-ui, sans-serif;
      }

      #root, #app {
        text-align: center;
        max-width: 600px;
      }

      h1 {
        font-size: 42px;
        margin-bottom: 12px;
        background: linear-gradient(90deg,#38bdf8,#22c55e,#a855f7);
        -webkit-background-clip: text;
        color: transparent;
      }

      p {
        color: #94a3b8;
        margin-bottom: 24px;
      }

      button {
        background: linear-gradient(90deg,#6366f1,#8b5cf6);
        border: none;
        padding: 12px 22px;
        border-radius: 10px;
        color: white;
        font-weight: 600;
        cursor: pointer;
      }
    </style>
  </head>

  <body>
    <div id="root"></div>
    <div id="app"></div>
    <script type="module" src="${entry}"></script>
  </body>
</html>
`;

const reactTemplate = {
    "package.json": {
        file: {
            contents: JSON.stringify({
                name: "react-app",
                private: true,
                version: "0.0.0",
                type: "module",
                scripts: { dev: "vite" },
                dependencies: {
                    react: "^18.2.0",
                    "react-dom": "^18.2.0",
                },
                devDependencies: {
                    vite: "^5.0.0",
                    "@vitejs/plugin-react": "^4.0.0",
                },
            }, null, 2),
        },
    },

    "vite.config.js": {
        file: {
            contents: `
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
`,
        },
    },

    "index.html": {
        file: { contents: baseHtml("/src/main.jsx") },
    },

    src: {
        directory: {
            "main.jsx": {
                file: {
                    contents: `
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
`,
                },
            },

            "App.jsx": {
                file: {
                    contents: `
export default function App() {
  return (
    <div>
      <h1>Codeflow React</h1>
      <p>React + Vite running inside your browser</p>
      <button>Start Building</button>
    </div>
  );
}
`,
                },
            },
        },
    },
};

const vueTemplate = {
    "package.json": {
        file: {
            contents: JSON.stringify({
                name: "vue-app",
                private: true,
                version: "0.0.0",
                type: "module",
                scripts: { dev: "vite" },
                dependencies: { vue: "^3.4.0" },
                devDependencies: {
                    vite: "^5.0.0",
                    "@vitejs/plugin-vue": "^5.0.0",
                },
            }, null, 2),
        },
    },

    "vite.config.js": {
        file: {
            contents: `
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
})
`,
        },
    },

    "index.html": {
        file: { contents: baseHtml("/src/main.js") },
    },

    src: {
        directory: {
            "main.js": {
                file: {
                    contents: `
import { createApp } from "vue";
import App from "./App.vue";

createApp(App).mount("#app");
`,
                },
            },

            "App.vue": {
                file: {
                    contents: `
<template>
  <div>
    <h1>Codeflow Vue</h1>
    <p>Vue + Vite running inside your browser</p>
    <button>Start Building</button>
  </div>
</template>
`,
                },
            },
        },
    },
};


const vanillaTemplate = {
    "package.json": {
        file: {
            contents: JSON.stringify({
                name: "js-app",
                private: true,
                scripts: { dev: "vite" },
                devDependencies: { vite: "^5.0.0" },
            }, null, 2),
        },
    },

    "index.html": {
        file: { contents: baseHtml("/main.js") },
    },

    "main.js": {
        file: {
            contents: `
document.getElementById("root").innerHTML = \`
  <h1>Codeflow JavaScript</h1>
  <p>Vanilla JS running inside your browser</p>
  <button>Start Building</button>
\`;
`,
        },
    },
};


const tsTemplate = {
    "package.json": {
        file: {
            contents: JSON.stringify({
                name: "ts-app",
                private: true,
                scripts: { dev: "vite" },
                devDependencies: {
                    vite: "^5.0.0",
                    typescript: "^5.0.0",
                },
            }, null, 2),
        },
    },

    "index.html": {
        file: { contents: baseHtml("/main.ts") },
    },

    "main.ts": {
        file: {
            contents: `
const root = document.getElementById("root")!;

root.innerHTML = \`
  <h1>Codeflow TypeScript</h1>
  <p>TypeScript running inside your browser</p>
  <button>Start Building</button>
\`;
`,
        },
    },
};

const templates = {
    react: reactTemplate,
    vue: vueTemplate,
    javascript: vanillaTemplate,
    typescript: tsTemplate,
};

export async function mountTemplate(webcontainer, templateId) {
    const files = templates[templateId];

    if (!files) {
        throw new Error(`Unknown template: ${templateId}`);
    }

    await webcontainer.mount(files);
}
/* ================================
   SHARED HTML TEMPLATE
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
        background: #1e1e1e;
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



/* ================================
   REACT TEMPLATE
================================ */

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
                    "react-dom": "^18.2.0"
                },
                devDependencies: {
                    vite: "^5.0.0",
                    "@vitejs/plugin-react": "^4.0.0"
                }
            }, null, 2)
        }
    },

    "vite.config.js": {
        file: {
            contents: `
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
`
        }
    },

    "index.html": {
        file: { contents: baseHtml("/src/main.jsx") }
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
`
                }
            },

            "App.jsx": {
                file: {
                    contents: `
export default function App() {
  return (
    <div>
      <h1>React Template</h1>
      <p>Running inside WebContainer</p>
      <button>Start Building</button>
    </div>
  );
}
`
                }
            }
        }
    }
};



/* ================================
   VUE TEMPLATE
================================ */

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
                    "@vitejs/plugin-vue": "^5.0.0"
                }
            }, null, 2)
        }
    },

    "vite.config.js": {
        file: {
            contents: `
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
})
`
        }
    },

    "index.html": {
        file: { contents: baseHtml("/src/main.js") }
    },

    src: {
        directory: {
            "main.js": {
                file: {
                    contents: `
import { createApp } from "vue";
import App from "./App.vue";

createApp(App).mount("#app");
`
                }
            },

            "App.vue": {
                file: {
                    contents: `
<template>
  <div>
    <h1>Vue Template</h1>
    <p>Running inside WebContainer</p>
    <button>Start Building</button>
  </div>
</template>
`
                }
            }
        }
    }
};



/* ================================
   SVELTE TEMPLATE
================================ */

const svelteTemplate = {
    "package.json": {
        file: {
            contents: JSON.stringify({
                name: "svelte-app",
                private: true,
                version: "0.0.0",
                type: "module",
                scripts: { dev: "vite" },
                devDependencies: {
                    vite: "^5.0.0",
                    svelte: "^4.0.0",
                    "@sveltejs/vite-plugin-svelte": "^3.0.0"
                }
            }, null, 2)
        }
    },

    "vite.config.js": {
        file: {
            contents: `
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [svelte()],
})
`
        }
    },

    "index.html": {
        file: { contents: baseHtml("/src/main.js") }
    },

    src: {
        directory: {
            "main.js": {
                file: {
                    contents: `
import App from './App.svelte'

const app = new App({
  target: document.getElementById('app')
})

export default app
`
                }
            },

            "App.svelte": {
                file: {
                    contents: `
<script>
  let name = "Svelte Template";
</script>

<h1>{name}</h1>
<p>Running inside WebContainer</p>
<button>Start Building</button>
`
                }
            }
        }
    }
};



/* ================================
   VANILLA JS TEMPLATE
================================ */

const jsTemplate = {
    "package.json": {
        file: {
            contents: JSON.stringify({
                name: "js-app",
                private: true,
                scripts: { dev: "vite" },
                devDependencies: { vite: "^5.0.0" }
            }, null, 2)
        }
    },

    "index.html": {
        file: { contents: baseHtml("/main.js") }
    },

    "main.js": {
        file: {
            contents: `
document.getElementById("root").innerHTML = \`
  <h1>JavaScript Template</h1>
  <p>Running inside WebContainer</p>
  <button>Start Building</button>
\`;
`
        }
    }
};



/* ================================
   TYPESCRIPT TEMPLATE
================================ */

const tsTemplate = {
    "package.json": {
        file: {
            contents: JSON.stringify({
                name: "ts-app",
                private: true,
                scripts: { dev: "vite" },
                devDependencies: {
                    vite: "^5.0.0",
                    typescript: "^5.0.0"
                }
            }, null, 2)
        }
    },

    "index.html": {
        file: { contents: baseHtml("/main.ts") }
    },

    "main.ts": {
        file: {
            contents: `
const root = document.getElementById("root")!;

root.innerHTML = \`
  <h1>TypeScript Template</h1>
  <p>Running inside WebContainer</p>
  <button>Start Building</button>
\`;
`
        }
    }
};



/* ================================
   PURE HTML TEMPLATE
================================ */

const htmlTemplate = {
    "index.html": {
        file: {
            contents: `
<!DOCTYPE html>
<html>
<head>
  <title>HTML Template</title>
</head>
<body>
  <h1>HTML + CSS + JS</h1>
  <button onclick="alert('Hello from Codeflow')">Click</button>
</body>
</html>
`
        }
    }
};



/* ================================
   NODE.JS TEMPLATE
================================ */

const nodeTemplate = {
    "package.json": {
        file: {
            contents: JSON.stringify({
                name: "node-app",
                version: "1.0.0",
                type: "commonjs",
                scripts: {
                    dev: "node --watch server.js",
                    start: "node server.js"
                }
            }, null, 2)
        }
    },

    "server.js": {
        file: {
            contents: `
const http = require('http');

const PORT = 3000;

const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');

    if (req.url === '/' && req.method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({ message: 'Hello from Node.js!', status: 'ok' }));
    } else if (req.url === '/api/ping' && req.method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({ pong: true, timestamp: Date.now() }));
    } else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Not found', path: req.url }));
    }
});

server.listen(PORT, () => {
    console.log(\`Server listening on http://localhost:\${PORT}\`);
});
`
        }
    }
};



/* ================================
   EXPRESS TEMPLATE
================================ */

const expressTemplate = {
    "package.json": {
        file: {
            contents: JSON.stringify({
                name: "express-app",
                version: "1.0.0",
                type: "commonjs",
                scripts: {
                    dev: "nodemon server.js",
                    start: "node server.js"
                },
                dependencies: {
                    express: "^4.18.2"
                },
                devDependencies: {
                    nodemon: "^3.0.0"
                }
            }, null, 2)
        }
    },

    "server.js": {
        file: {
            contents: `
const express = require('express');

const app = express();
const PORT = 3000;

app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Hello from Express!', status: 'ok' });
});

app.get('/api/items', (req, res) => {
    res.json({ items: ['apple', 'banana', 'cherry'] });
});

app.post('/api/items', (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'name is required' });
    res.status(201).json({ created: name, id: Date.now() });
});

app.delete('/api/items/:id', (req, res) => {
    res.json({ deleted: req.params.id });
});

app.listen(PORT, () => {
    console.log(\`Express server listening on http://localhost:\${PORT}\`);
});
`
        }
    }
};



/* ================================
   FASTIFY TEMPLATE
================================ */

const fastifyTemplate = {
    "package.json": {
        file: {
            contents: JSON.stringify({
                name: "fastify-app",
                version: "1.0.0",
                type: "module",
                scripts: {
                    dev: "node --watch server.js",
                    start: "node server.js"
                },
                dependencies: {
                    fastify: "^4.26.0"
                }
            }, null, 2)
        }
    },

    "server.js": {
        file: {
            contents: `
import Fastify from 'fastify';

const app = Fastify({ logger: false });
const PORT = 3000;

// Routes
app.get('/', async () => {
    return { message: 'Hello from Fastify!', status: 'ok' };
});

app.get('/api/items', async () => {
    return { items: ['apple', 'banana', 'cherry'] };
});

app.post('/api/items', async (request, reply) => {
    const { name } = request.body;
    if (!name) return reply.status(400).send({ error: 'name is required' });
    return reply.status(201).send({ created: name, id: Date.now() });
});

app.delete('/api/items/:id', async (request) => {
    return { deleted: request.params.id };
});

app.listen({ port: PORT, host: '0.0.0.0' }, (err) => {
    if (err) { console.error(err); process.exit(1); }
    console.log(\`Fastify server listening on http://localhost:\${PORT}\`);
});
`
        }
    }
};



/* ================================
   TEMPLATE MAP
================================ */

const templates = {
    // Frontend
    react: reactTemplate,
    vue: vueTemplate,
    svelte: svelteTemplate,
    javascript: jsTemplate,
    typescript: tsTemplate,
    html: htmlTemplate,

    // Backend
    node: nodeTemplate,
    express: expressTemplate,
    fastify: fastifyTemplate,
};



/* ================================
   MOUNT FUNCTION
================================ */

export async function mountTemplate(webcontainer, templateId) {
    const files = templates[templateId];

    if (!files) {
        throw new Error(`Unknown template: ${templateId}`);
    }

    // Clean old workspace
    await webcontainer.fs.rm("/workspace", { recursive: true, force: true }).catch(() => { });

    // Recreate workspace
    await webcontainer.fs.mkdir("/workspace").catch(() => { });

    // Mount template files
    await webcontainer.mount({
        workspace: {
            directory: files
        }
    });
}
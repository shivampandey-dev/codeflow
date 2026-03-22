import JSZip from "jszip";

// Files/folders to always skip
const SKIP_ENTRIES = new Set([
    "node_modules",
    ".git",
    ".DS_Store",
    "Thumbs.db",
    ".env",          // optional — remove if you want .env uploaded
]);

// Extensions treated as binary — skip or handle separately
const BINARY_EXTENSIONS = new Set([
    ".png", ".jpg", ".jpeg", ".gif", ".webp", ".ico", ".svg",
    ".woff", ".woff2", ".ttf", ".eot", ".otf",
    ".mp4", ".mp3", ".wav", ".ogg",
    ".pdf", ".zip", ".tar", ".gz",
    ".exe", ".dll", ".so",
]);

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

function shouldSkipPath(pathParts) {
    return pathParts.some((part) => SKIP_ENTRIES.has(part));
}

function isBinary(filename) {
    const ext = filename.slice(filename.lastIndexOf(".")).toLowerCase();
    return BINARY_EXTENSIONS.has(ext);
}

function setNestedPath(tree, pathParts, contents) {
    let node = tree;
    for (let i = 0; i < pathParts.length - 1; i++) {
        const part = pathParts[i];
        if (!node[part]) {
            node[part] = { directory: {} };
        }
        node = node[part].directory;
    }
    const fileName = pathParts[pathParts.length - 1];
    node[fileName] = { file: { contents } };
}

// ─── FOLDER UPLOAD ───────────────────────────────────────────────
export async function folderFilesToTree(files) {
    const tree = {};
    const warnings = [];
    let hasPackageJson = false;

    for (const file of files) {
        const relativePath = file.webkitRelativePath || file.name;
        const parts = relativePath.split("/");

        // Strip root folder name
        const pathParts = parts.slice(1);
        if (!pathParts.length || pathParts[0] === "") continue;

        // Skip node_modules / .git etc
        if (shouldSkipPath(pathParts)) continue;

        // Skip binary files
        if (isBinary(file.name)) {
            warnings.push(`Skipped binary file: ${relativePath}`);
            continue;
        }

        // Skip large files
        if (file.size > MAX_FILE_SIZE_BYTES) {
            warnings.push(`Skipped large file (>${MAX_FILE_SIZE_MB}MB): ${relativePath}`);
            continue;
        }

        if (file.name === "package.json" && pathParts.length === 1) {
            hasPackageJson = true;
        }

        const text = await file.text();
        setNestedPath(tree, pathParts, text);
    }

    return { tree, warnings, hasPackageJson };
}

// ─── ZIP UPLOAD ───────────────────────────────────────────────────
export async function zipFileToTree(zipFile) {
    const zip = await JSZip.loadAsync(zipFile);
    const tree = {};
    const warnings = [];
    let hasPackageJson = false;
    const promises = [];

    zip.forEach((relativePath, zipEntry) => {
        if (zipEntry.dir) return;

        const parts = relativePath.split("/");
        const pathParts = parts.length > 1 ? parts.slice(1) : parts;
        if (!pathParts.length || pathParts[0] === "") return;

        // Skip node_modules / .git etc
        if (shouldSkipPath(pathParts)) return;

        const fileName = pathParts[pathParts.length - 1];

        // Skip binary files
        if (isBinary(fileName)) {
            warnings.push(`Skipped binary file: ${relativePath}`);
            return;
        }

        // Check size via _data if available
        const fileSize = zipEntry._data?.uncompressedSize ?? 0;
        if (fileSize > MAX_FILE_SIZE_BYTES) {
            warnings.push(`Skipped large file (>${MAX_FILE_SIZE_MB}MB): ${relativePath}`);
            return;
        }

        if (fileName === "package.json" && pathParts.length === 1) {
            hasPackageJson = true;
        }

        const p = zipEntry.async("string").then((text) => {
            setNestedPath(tree, pathParts, text);
        });

        promises.push(p);
    });

    await Promise.all(promises);
    return { tree, warnings, hasPackageJson };
}
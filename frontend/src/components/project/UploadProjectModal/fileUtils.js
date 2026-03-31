import JSZip from "jszip";

// Files/folders to always skip
const SKIP_ENTRIES = new Set([
    "node_modules",
    ".git",
    ".DS_Store",
    "Thumbs.db",
    ".env",
]);

const IMAGE_EXTENSIONS = new Set([
    ".png", ".jpg", ".jpeg", ".gif", ".webp", ".ico", ".svg",
]);

const BINARY_EXTENSIONS = new Set([
    // Fonts
    ".woff", ".woff2", ".ttf", ".eot", ".otf",
    // Video (all common formats)
    ".mp4", ".mkv", ".mov", ".avi", ".webm", ".flv", ".wmv", ".m4v",
    // Audio
    ".mp3", ".wav", ".ogg", ".aac", ".flac", ".m4a",
    // Docs & archives
    ".pdf", ".zip", ".tar", ".gz", ".rar", ".7z",
    // Executables & libraries
    ".exe", ".dll", ".so", ".dylib",
    // Compiled code
    ".class", ".pyc", ".pyd",
    // Databases
    ".db", ".sqlite", ".sqlite3",
]);

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const MAX_IMAGE_SIZE_MB = 1;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

function shouldSkipPath(pathParts) {
    return pathParts.some((part) => SKIP_ENTRIES.has(part));
}

function isBinary(filename) {
    const ext = filename.slice(filename.lastIndexOf(".")).toLowerCase();
    return BINARY_EXTENSIONS.has(ext);
}

function isImage(filename) {
    const ext = filename.slice(filename.lastIndexOf(".")).toLowerCase();
    return IMAGE_EXTENSIONS.has(ext);
}

async function readImageAsBase64(file) {
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = "";
    // Process in chunks to avoid call stack overflow on large files
    const chunkSize = 8192;
    for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
    }
    const base64 = btoa(binary);
    const ext = file.name.slice(file.name.lastIndexOf(".") + 1).toLowerCase();
    const mimeType = ext === "svg" ? "image/svg+xml" : `image/${ext}`;
    return `data:${mimeType};base64,${base64}`;
}

async function readZipEntryAsBase64(zipEntry, fileName) {
    const buffer = await zipEntry.async("arraybuffer");
    const bytes = new Uint8Array(buffer);
    let binary = "";
    const chunkSize = 8192;
    for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
    }
    const base64 = btoa(binary);
    const ext = fileName.slice(fileName.lastIndexOf(".") + 1).toLowerCase();
    const mimeType = ext === "svg" ? "image/svg+xml" : `image/${ext}`;
    return `data:${mimeType};base64,${base64}`;
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

function detectRootFolder(paths) {
    const nonEmpty = paths.filter((p) => p && !p.endsWith("/"));
    if (!nonEmpty.length) return null;
    const firstSegments = nonEmpty.map((p) => p.split("/")[0]);
    const candidate = firstSegments[0];
    const allMatch = firstSegments.every((s) => s === candidate);
    const hasSubPath = nonEmpty.some((p) => p.includes("/"));
    return allMatch && hasSubPath ? candidate : null;
}

export async function folderFilesToTree(files) {
    const tree = {};
    const warnings = [];
    let hasPackageJson = false;

    for (const file of files) {
        const relativePath = file.webkitRelativePath || file.name;
        const parts = relativePath.split("/");
        const pathParts = parts.slice(1);

        if (!pathParts.length || pathParts[0] === "") continue;
        if (shouldSkipPath(pathParts)) continue;

        const fileName = pathParts[pathParts.length - 1];

        // Always skip binary non-image files
        if (isBinary(fileName)) {
            warnings.push(`Skipped binary file: ${relativePath}`);
            continue;
        }

        // Handle images separately with their own size limit
        if (isImage(fileName)) {
            if (file.size > MAX_IMAGE_SIZE_BYTES) {
                warnings.push(
                    `Skipped large image (>${MAX_IMAGE_SIZE_MB}MB): ${relativePath}`
                );
                continue;
            }
            const base64Contents = await readImageAsBase64(file);
            setNestedPath(tree, pathParts, base64Contents);
            continue;
        }

        // Skip oversized text files
        if (file.size > MAX_FILE_SIZE_BYTES) {
            warnings.push(
                `Skipped large file (>${MAX_FILE_SIZE_MB}MB): ${relativePath}`
            );
            continue;
        }

        if (fileName === "package.json" && pathParts.length === 1) {
            hasPackageJson = true;
        }

        const text = await file.text();
        setNestedPath(tree, pathParts, text);
    }

    return { tree, warnings, hasPackageJson };
}

export async function zipFileToTree(zipFile) {
    const zip = await JSZip.loadAsync(zipFile);
    const tree = {};
    const warnings = [];
    let hasPackageJson = false;
    const promises = [];

    const allPaths = [];
    zip.forEach((relativePath) => allPaths.push(relativePath));
    const rootFolder = detectRootFolder(allPaths);

    zip.forEach((relativePath, zipEntry) => {
        if (zipEntry.dir) return;

        const parts = relativePath.split("/");
        const pathParts = rootFolder ? parts.slice(1) : parts;

        if (!pathParts.length || pathParts[0] === "") return;
        if (shouldSkipPath(pathParts)) return;

        const fileName = pathParts[pathParts.length - 1];

        // Always skip binary non-image files
        if (isBinary(fileName)) {
            warnings.push(`Skipped binary file: ${relativePath}`);
            return;
        }

        const fileSize = zipEntry._data?.uncompressedSize ?? 0;

        // Handle images separately with their own size limit
        if (isImage(fileName)) {
            if (fileSize > MAX_IMAGE_SIZE_BYTES) {
                warnings.push(
                    `Skipped large image (>${MAX_IMAGE_SIZE_MB}MB): ${relativePath}`
                );
                return;
            }
            const p = readZipEntryAsBase64(zipEntry, fileName).then((base64Contents) => {
                setNestedPath(tree, pathParts, base64Contents);
            });
            promises.push(p);
            return;
        }

        // Skip oversized text files
        if (fileSize > MAX_FILE_SIZE_BYTES) {
            warnings.push(
                `Skipped large file (>${MAX_FILE_SIZE_MB}MB): ${relativePath}`
            );
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
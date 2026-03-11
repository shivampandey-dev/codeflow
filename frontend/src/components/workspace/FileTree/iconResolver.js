const modules = import.meta.glob(
    "../../../Assets/icons/*.svg",
    {
        eager: true,
        import: "default"
    }
)

const iconMap = {}

for (const path in modules) {

    const name = path
        .split("/")
        .pop()
        .replace(".svg", "")

    iconMap[name] = modules[path]
}

/*
FILE EXTENSION MAP
*/

const extensionMap = {
    js: "js",
    jsx: "reactjs",
    ts: "typescript",
    tsx: "typescript",
    json: "json",
    html: "html",
    css: "css",
    md: "markdown",
    yaml: "yaml",
    yml: "yaml"
}

/*
FOLDER NAME MAP
*/

const folderMap = {

    /* core */
    src: "src",
    dist: "dist",
    build: "dist",

    /* node ecosystem */
    node_modules: "node",
    node: "node",

    /* package managers */
    ".npm": "node",
    ".yarn": "node",

    /* config */
    config: "config",
    configs: "config",

    /* assets */
    assets: "asset",
    static: "asset",
    public: "public",
    images: "images",
    img: "images",
    fonts: "fonts",
    css: "css",

    /* source */
    components: "component",
    component: "component",
    hooks: "helper",
    utils: "helper",
    helpers: "helper",
    lib: "library",
    library: "library",

    /* backend */
    api: "api",
    server: "server",
    db: "db",
    database: "db",

    /* testing */
    test: "test",
    tests: "test",
    spec: "test",

    /* docs */
    docs: "docs",
    doc: "docs",

    /* git */
    ".git": "git",
    ".github": "github",
    ".gitlab": "gitlab",

    /* frameworks */
    docker: "docker",
    nginx: "nginx",

    /* misc */
    scripts: "script",
    style: "style",
    styles: "style",
    temp: "temp",
    tmp: "temp"
}

export function resolveIcon(name, type, open = false) {

    if (type === "folder") {

        const folderName = name.toLowerCase()

        const mapped = folderMap[folderName] || folderName

        const specific = open
            ? `folder_type_${mapped}_opened`
            : `folder_type_${mapped}`

        if (iconMap[specific])
            return iconMap[specific]

        return open
            ? iconMap["default_folder_opened"]
            : iconMap["default_folder"]
    }

    const ext = name.split(".").pop().toLowerCase()

    const mapped = extensionMap[ext] || ext

    const icon = `file_type_${mapped}`

    if (iconMap[icon])
        return iconMap[icon]

    return iconMap["default_file"]
}
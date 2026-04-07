import { useState, useRef, useCallback, useEffect } from "react";
import { Drawer } from "@mantine/core";

/* ─── design tokens ──────────────────────────────────────────────────── */
const C = {
    bg0: "#0d0f12",
    bg1: "#13161b",
    bg2: "#1a1e26",
    bg3: "#222733",
    border: "#2c3140",
    accent: "#38bdf8",
    accentDim: "#0ea5e920",
    green: "#4ade80",
    red: "#f87171",
    yellow: "#fbbf24",
    muted: "#5a6380",
    text: "#c9d1e8",
    textDim: "#7a849e",
    mono: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
    sans: "'DM Sans', 'Instrument Sans', sans-serif",
};

const METHOD_COLORS = {
    GET: "#4ade80", POST: "#38bdf8", PUT: "#fbbf24",
    PATCH: "#fb923c", DELETE: "#f87171", HEAD: "#a78bfa", OPTIONS: "#e879f9",
};

/* Methods that cannot carry a body. For these we NEVER send Content-Type
   because that would trigger a CORS preflight the server may not handle. */
const NO_BODY_METHODS = ["GET", "HEAD", "DELETE", "OPTIONS"];

/* ─── micro-components ───────────────────────────────────────────────── */
const Input = ({ style, ...p }) => (
    <input
        {...p}
        style={{
            background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 5,
            color: C.text, padding: "6px 10px", fontSize: 12, fontFamily: C.mono,
            outline: "none", width: "100%", boxSizing: "border-box", transition: "border-color .15s",
            ...style,
        }}
        onFocus={e => { e.target.style.borderColor = C.accent; p.onFocus?.(e); }}
        onBlur={e => { e.target.style.borderColor = C.border; p.onBlur?.(e); }}
    />
);

const Btn = ({ children, variant = "ghost", style, ...p }) => {
    const variants = {
        ghost: { background: C.bg3, color: C.textDim, border: `1px solid ${C.border}` },
        primary: { background: C.accent, color: C.bg0 },
        danger: { background: "#f871711a", color: C.red, border: `1px solid #f8717130` },
    };
    return (
        <button {...p} style={{
            border: "none", borderRadius: 5, cursor: "pointer", fontSize: 11,
            fontFamily: C.sans, fontWeight: 600, letterSpacing: ".03em",
            padding: "5px 11px", transition: "all .15s",
            display: "inline-flex", alignItems: "center", gap: 5,
            ...variants[variant], ...style,
        }}>{children}</button>
    );
};

const Label = ({ children }) => (
    <div style={{
        fontSize: 10, fontFamily: C.sans, fontWeight: 700, letterSpacing: ".08em",
        color: C.muted, textTransform: "uppercase", marginBottom: 6,
    }}>{children}</div>
);

/* ─── key-value editor ───────────────────────────────────────────────── */
function KVEditor({ rows, onChange, placeholder = ["Key", "Value"], fileSupport = false }) {
    const add = () => onChange([...rows, { key: "", value: "", enabled: true, file: null }]);
    const del = i => onChange(rows.filter((_, idx) => idx !== i));
    const upd = (i, f, v) => onChange(rows.map((r, idx) => idx === i ? { ...r, [f]: v } : r));

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {rows.map((row, i) => (
                <div key={i} style={{ display: "flex", gap: 4, alignItems: "center" }}>
                    <input type="checkbox" checked={row.enabled}
                        onChange={e => upd(i, "enabled", e.target.checked)}
                        style={{ accentColor: C.accent, flexShrink: 0 }} />
                    <Input value={row.key} onChange={e => upd(i, "key", e.target.value)}
                        placeholder={placeholder[0]} style={{ flex: 1 }} />
                    {fileSupport && row.isFile ? (
                        <input type="file" onChange={e => upd(i, "file", e.target.files[0])} style={{
                            flex: 1, fontSize: 11, color: C.textDim, fontFamily: C.mono,
                            background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 5, padding: "4px 8px",
                        }} />
                    ) : (
                        <Input value={row.value} onChange={e => upd(i, "value", e.target.value)}
                            placeholder={placeholder[1]} style={{ flex: 1 }} />
                    )}
                    {fileSupport && (
                        <button onClick={() => upd(i, "isFile", !row.isFile)} style={{
                            background: row.isFile ? C.accentDim : "transparent",
                            border: `1px solid ${C.border}`, borderRadius: 4,
                            color: row.isFile ? C.accent : C.muted, cursor: "pointer",
                            fontSize: 10, padding: "4px 7px", fontFamily: C.sans, fontWeight: 700,
                        }}>FILE</button>
                    )}
                    <button onClick={() => del(i)} style={{
                        background: "none", border: "none", color: C.muted,
                        cursor: "pointer", fontSize: 14, lineHeight: 1, padding: "2px 5px", borderRadius: 3,
                    }}>×</button>
                </div>
            ))}
            <Btn onClick={add} style={{ alignSelf: "flex-start", marginTop: 2 }}>+ Add Row</Btn>
        </div>
    );
}

/* ─── JSON syntax highlighter ────────────────────────────────────────── */
function HighlightJSON({ text }) {
    if (!text) return null;
    const html = text
        .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        .replace(
            /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
            m => {
                let c = "#ce93d8";
                if (/^"/.test(m)) c = /:$/.test(m) ? "#80cbc4" : "#a5d6a7";
                else if (/true|false/.test(m)) c = "#ffcc80";
                else if (/null/.test(m)) c = "#ef9a9a";
                return `<span style="color:${c}">${m}</span>`;
            }
        );
    return (
        <pre dangerouslySetInnerHTML={{ __html: html }} style={{
            margin: 0, fontFamily: C.mono, fontSize: 11, lineHeight: 1.65,
            color: C.text, whiteSpace: "pre-wrap", wordBreak: "break-all",
        }} />
    );
}

/* ─── status pill ────────────────────────────────────────────────────── */
function StatusPill({ code }) {
    const color = (code === "ERR" || code === "ABT") ? C.red
        : code < 300 ? C.green : code < 400 ? C.yellow : C.red;
    return (
        <span style={{
            background: color + "20", border: `1px solid ${color}50`, color,
            borderRadius: 4, padding: "1px 8px", fontSize: 11, fontFamily: C.mono, fontWeight: 700,
        }}>{code}</span>
    );
}

/* ─── code snippet generator ─────────────────────────────────────────── */
function buildSnippets(method, url, hdrs, body) {
    const hStr = Object.entries(hdrs).map(([k, v]) => `  '${k}': '${v}'`).join(",\n");
    const curl = [
        `curl -X ${method} '${url}'`,
        ...Object.entries(hdrs).map(([k, v]) => `  -H '${k}: ${v}'`),
        body ? `  -d '${body}'` : "",
    ].filter(Boolean).join(" \\\n");
    const fetchSnippet = `fetch('${url}', {\n  method: '${method}',\n  headers: {\n${hStr}\n  },${body ? `\n  body: \`${body}\`,` : ""}\n});`;
    const axiosSnippet = `axios.${method.toLowerCase()}('${url}', ${body ? `${body}, ` : ""}{\n  headers: {\n${hStr}\n  },\n});`;
    return { curl, fetch: fetchSnippet, axios: axiosSnippet };
}

/* ─── resizable drag handle ──────────────────────────────────────────── */
function ResizeHandle({ onDrag }) {
    const dragging = useRef(false);
    const lastY = useRef(0);

    const onMouseDown = e => {
        dragging.current = true;
        lastY.current = e.clientY;
        document.body.style.cursor = "ns-resize";
        document.body.style.userSelect = "none";
    };

    useEffect(() => {
        const onMove = e => {
            if (!dragging.current) return;
            const delta = lastY.current - e.clientY; // drag up → bigger panel
            lastY.current = e.clientY;
            onDrag(delta);
        };
        const onUp = () => {
            if (!dragging.current) return;
            dragging.current = false;
            document.body.style.cursor = "";
            document.body.style.userSelect = "";
        };
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
        return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
    }, [onDrag]);

    return (
        <div
            onMouseDown={onMouseDown}
            title="Drag to resize"
            style={{
                height: 10, cursor: "ns-resize", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: C.bg1, borderTop: `1px solid ${C.border}`,
                transition: "background .15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = C.bg3}
            onMouseLeave={e => e.currentTarget.style.background = C.bg1}
        >
            <div style={{ display: "flex", gap: 3 }}>
                {[0, 1, 2, 3, 4].map(i => (
                    <div key={i} style={{ width: 3, height: 3, borderRadius: "50%", background: C.muted, opacity: 0.6 }} />
                ))}
            </div>
        </div>
    );
}

/* ─── main component ─────────────────────────────────────────────────── */
export default function ApiTester({ defaultUrl, opened, close }) {

    /* request state */
    // const [serverUrl, setServerUrl] = useState(defaultUrl || "http://localhost:3000");
    const [serverUrl, setServerUrl] = useState("");
    const [method, setMethod] = useState("GET");
    const [path, setPath] = useState("/");
    const [activeTab, setActiveTab] = useState("params");
    const [queryParams, setQueryParams] = useState([{ key: "", value: "", enabled: true }]);
    const [headers, setHeaders] = useState([
        /* ✅ Use Accept instead of Content-Type as default so GET doesn't
              trigger a CORS preflight. Content-Type is added automatically
              when a body is present. */
        { key: "Accept", value: "application/json", enabled: true },
    ]);
    const [bodyType, setBodyType] = useState("json");
    const [rawBody, setRawBody] = useState("");
    const [formRows, setFormRows] = useState([{ key: "", value: "", enabled: true, isFile: false, file: null }]);
    const [urlEncRows, setUrlEncRows] = useState([{ key: "", value: "", enabled: true }]);
    const [authType, setAuthType] = useState("none");
    const [authUser, setAuthUser] = useState("");
    const [authPass, setAuthPass] = useState("");
    const [authBearer, setAuthBearer] = useState("");

    /* response state */
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);

    /* resizable response panel – starts at 240px, clamp 120–600 */
    const [respHeight, setRespHeight] = useState(240);
    const handleDrag = useCallback(delta => {
        setRespHeight(h => Math.min(600, Math.max(120, h + delta)));
    }, []);

    /* utilities */
    const [history, setHistory] = useState(() => {
        try { return JSON.parse(localStorage.getItem("apitester_history") || "[]"); } catch { return []; }
    });
    const [showHistory, setShowHistory] = useState(false);
    const [envVars, setEnvVars] = useState([{ key: "", value: "", enabled: true }]);
    const [showEnv, setShowEnv] = useState(false);
    const [snippetLang, setSnippetLang] = useState(null);
    const [copyDone, setCopyDone] = useState(false);
    const abortRef = useRef(null);

    /* sync when parent pushes a new webcontainer URL */
    useEffect(() => { if (defaultUrl) setServerUrl(defaultUrl); }, [defaultUrl]);

    /* env interpolation */
    const interpolate = useCallback((str = "") => {
        const map = Object.fromEntries(
            envVars.filter(r => r.enabled && r.key).map(r => [r.key, r.value])
        );
        return str.replace(/\{\{(\w+)\}\}/g, (_, k) => map[k] ?? `{{${k}}}`);
    }, [envVars]);

    /* build full URL */
    const buildUrl = useCallback(() => {
        const base = `${path}`;   // ❗ no serverUrl
        const params = queryParams
            .filter(r => r.enabled && r.key)
            .map(r => `${encodeURIComponent(r.key)}=${encodeURIComponent(r.value)}`)
            .join("&");

        return params ? `${base}?${params}` : base;
    }, [path, queryParams]);

    /* ── SEND ─────────────────────────────────────────────────────────── */
    const send = async () => {
        setLoading(true);
        setResponse(null);
        abortRef.current = new AbortController();

        try {
            const hdrs = {};

            /* Copy user-defined headers, but skip Content-Type for methods
               that have no body — this prevents a CORS preflight on GET etc. */
            headers.filter(r => r.enabled && r.key).forEach(r => {
                const k = interpolate(r.key);
                if (NO_BODY_METHODS.includes(method) && k.toLowerCase() === "content-type") return;
                hdrs[k] = interpolate(r.value);
            });

            /* Auth injection */
            if (authType === "bearer" && authBearer) {
                hdrs["Authorization"] = `Bearer ${authBearer}`;
            } else if (authType === "basic" && authUser) {
                hdrs["Authorization"] = `Basic ${btoa(`${authUser}:${authPass}`)}`;
            }

            /* Body construction — only for methods that support it */
            let body = undefined;
            if (!NO_BODY_METHODS.includes(method)) {
                if (bodyType === "json" && rawBody) {
                    hdrs["Content-Type"] = "application/json";
                    body = rawBody;
                } else if (bodyType === "urlencoded") {
                    const encoded = urlEncRows
                        .filter(r => r.enabled && r.key)
                        .map(r => `${encodeURIComponent(r.key)}=${encodeURIComponent(r.value)}`)
                        .join("&");
                    hdrs["Content-Type"] = "application/x-www-form-urlencoded";
                    body = encoded;
                } else if (bodyType === "form") {
                    const fd = new FormData();
                    formRows.filter(r => r.enabled && r.key).forEach(r => {
                        fd.append(r.key, r.isFile && r.file ? r.file : r.value);
                    });
                    body = fd;
                    /* Do NOT set Content-Type for multipart — browser sets it with boundary */
                }
            }

            const url = buildUrl();
            const t0 = performance.now();
            const res = await fetch(url, { method, headers: hdrs, body, signal: abortRef.current.signal });
            const elapsed = Math.round(performance.now() - t0);
            const text = await res.text();
            const size = new Blob([text]).size;

            let pretty;
            try { pretty = JSON.stringify(JSON.parse(text), null, 2); }
            catch { pretty = text; }

            const entry = { id: Date.now(), method, url, status: res.status, time: new Date().toLocaleTimeString() };
            setHistory(h => {
                const next = [entry, ...h].slice(0, 30);
                try { localStorage.setItem("apitester_history", JSON.stringify(next)); } catch { }
                return next;
            });

            setResponse({ status: res.status, ok: res.ok, body: pretty, elapsed, size });
        } catch (err) {
            setResponse({
                status: err.name === "AbortError" ? "ABT" : "ERR",
                ok: false,
                body: err.name === "AbortError" ? "Request cancelled." : err.message,
            });
        }
        setLoading(false);
    };

    const cancel = () => abortRef.current?.abort();

    const formatJson = () => {
        try { setRawBody(JSON.stringify(JSON.parse(rawBody), null, 2)); }
        catch { alert("Invalid JSON — cannot format."); }
    };

    const copyResponse = () => {
        if (!response?.body) return;
        navigator.clipboard.writeText(response.body).then(() => {
            setCopyDone(true); setTimeout(() => setCopyDone(false), 1500);
        });
    };

    const downloadResponse = () => {
        if (!response?.body) return;
        const isJson = (() => { try { JSON.parse(response.body); return true; } catch { return false; } })();
        const a = Object.assign(document.createElement("a"), {
            href: URL.createObjectURL(new Blob([response.body], { type: isJson ? "application/json" : "text/plain" })),
            download: `response.${isJson ? "json" : "txt"}`,
        });
        a.click();
    };

    const loadFromHistory = h => {
        try { const u = new URL(h.url); setServerUrl(u.origin); setPath(u.pathname); }
        catch { setServerUrl(h.url); }
        setMethod(h.method);
        setShowHistory(false);
    };

    const TABS = ["params", "headers", "body", "auth"];
    const tabCount = {
        params: queryParams.filter(r => r.enabled && r.key).length || null,
        headers: headers.filter(r => r.enabled && r.key).length || null,
    };
    const snippets = buildSnippets(
        method, buildUrl(),
        Object.fromEntries(headers.filter(r => r.enabled && r.key).map(r => [r.key, r.value])),
        rawBody
    );

    /* ── RENDER ───────────────────────────────────────────────────────── */
    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
                .api-drawer * { box-sizing: border-box; }
                .api-tab:hover  { color: ${C.text} !important; }
                textarea.api-ta { resize: none; }
                textarea.api-ta:focus { outline: none; border-color: ${C.accent} !important; }
                .api-send:hover  { filter: brightness(1.12); transform: translateY(-1px); }
                .api-send:active { transform: translateY(0); }
                .hist-row:hover  { background: ${C.bg3} !important; }
                .apit-scroll::-webkit-scrollbar { width: 4px; height: 4px; }
                .apit-scroll::-webkit-scrollbar-track { background: transparent; }
                .apit-scroll::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 2px; }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>

            <Drawer
                opened={opened} onClose={close}
                title={
                    <span style={{ fontFamily: C.sans, fontWeight: 700, color: C.text, fontSize: 13, letterSpacing: ".02em" }}>
                        <span style={{ color: C.accent }}>⬡</span> API Tester
                    </span>
                }
                position="right" size={500}
                styles={{
                    content: { background: C.bg0, borderLeft: `1px solid ${C.border}` },
                    header: { background: C.bg1, borderBottom: `1px solid ${C.border}`, padding: "10px 14px" },
                    close: { color: C.muted },
                    body: { padding: 0 },
                }}
                className="api-drawer"
            >
                <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 52px)", overflow: "hidden" }}>

                    {/* ── TOOLBAR ─────────────────────────────────────────────── */}
                    <div style={{ padding: "10px 14px", borderBottom: `1px solid ${C.border}`, background: C.bg1, flexShrink: 0 }}>
                        <Input
                            value={serverUrl}
                            onChange={e => setServerUrl(e.target.value)}
                            placeholder="https://xxxx.webcontainer-api.io"
                            style={{ marginBottom: 8 }}
                        />

                        <div style={{ display: "flex", gap: 6 }}>
                            <select value={method} onChange={e => setMethod(e.target.value)} style={{
                                background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 5,
                                color: METHOD_COLORS[method] || C.text, fontFamily: C.mono,
                                fontWeight: 700, fontSize: 11, padding: "6px 8px", cursor: "pointer", flexShrink: 0,
                            }}>
                                {Object.keys(METHOD_COLORS).map(m => (
                                    <option key={m} style={{ color: METHOD_COLORS[m] }}>{m}</option>
                                ))}
                            </select>

                            <Input value={path} onChange={e => setPath(e.target.value)} placeholder="/api/endpoint" style={{ flex: 1 }} />

                            {loading
                                ? <Btn variant="danger" onClick={cancel} style={{ flexShrink: 0 }}>✕ Cancel</Btn>
                                : <button className="api-send" onClick={send} style={{
                                    background: C.accent, border: "none", borderRadius: 5,
                                    color: C.bg0, cursor: "pointer", flexShrink: 0, fontFamily: C.sans,
                                    fontWeight: 700, fontSize: 12, padding: "6px 16px", transition: "all .15s", letterSpacing: ".02em",
                                }}>Send ▶</button>
                            }
                        </div>

                        <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                            <Btn onClick={() => setShowEnv(!showEnv)}>{"{}"} Env</Btn>
                            <Btn onClick={() => setShowHistory(!showHistory)}>⏱ History ({history.length})</Btn>
                            <Btn onClick={() => setSnippetLang(snippetLang ? null : "curl")}>{"</"} Snippets</Btn>
                        </div>
                    </div>

                    {/* ── ENV VARS ─────────────────────────────────────────────── */}
                    {showEnv && (
                        <div style={{ background: C.bg1, padding: 12, borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
                            <Label>Environment Variables</Label>
                            <KVEditor rows={envVars} onChange={setEnvVars} placeholder={["VAR_NAME", "value"]} />
                        </div>
                    )}

                    {/* ── HISTORY ──────────────────────────────────────────────── */}
                    {showHistory && (
                        <div className="apit-scroll" style={{
                            background: C.bg1, padding: 12, borderBottom: `1px solid ${C.border}`,
                            maxHeight: 180, overflowY: "auto", flexShrink: 0,
                        }}>
                            <Label>Request History</Label>
                            {history.length === 0
                                ? <div style={{ color: C.muted, fontSize: 12 }}>No history yet.</div>
                                : history.map(h => (
                                    <div key={h.id} className="hist-row" onClick={() => loadFromHistory(h)} style={{
                                        display: "flex", gap: 8, alignItems: "center", padding: "5px 6px",
                                        borderRadius: 5, cursor: "pointer", fontSize: 11,
                                        fontFamily: C.mono, color: C.textDim, transition: "background .1s",
                                    }}>
                                        <span style={{ color: METHOD_COLORS[h.method] || C.text, fontWeight: 700, flexShrink: 0 }}>{h.method}</span>
                                        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{h.url}</span>
                                        <StatusPill code={h.status} />
                                        <span style={{ color: C.muted, flexShrink: 0 }}>{h.time}</span>
                                    </div>
                                ))
                            }
                            {history.length > 0 && (
                                <Btn variant="danger" style={{ marginTop: 8 }}
                                    onClick={() => { setHistory([]); localStorage.removeItem("apitester_history"); }}>
                                    Clear
                                </Btn>
                            )}
                        </div>
                    )}

                    {/* ── SNIPPETS ─────────────────────────────────────────────── */}
                    {snippetLang && (
                        <div style={{ background: C.bg1, padding: 12, borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
                            <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                                {["curl", "fetch", "axios"].map(l => (
                                    <Btn key={l} onClick={() => setSnippetLang(l)} style={snippetLang === l
                                        ? { background: C.accentDim, color: C.accent, borderColor: C.accent + "60" } : {}}
                                    >{l}</Btn>
                                ))}
                            </div>
                            <pre className="apit-scroll" style={{
                                background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 6,
                                padding: 10, fontSize: 11, fontFamily: C.mono, color: C.text,
                                margin: 0, overflowX: "auto", maxHeight: 140,
                            }}>{snippets[snippetLang]}</pre>
                        </div>
                    )}

                    {/* ── TABS BAR ─────────────────────────────────────────────── */}
                    <div style={{
                        background: C.bg1, borderBottom: `1px solid ${C.border}`,
                        display: "flex", padding: "0 14px", flexShrink: 0,
                    }}>
                        {TABS.map(t => (
                            <button key={t} className="api-tab" onClick={() => setActiveTab(t)} style={{
                                background: "none", border: "none",
                                borderBottom: `2px solid ${activeTab === t ? C.accent : "transparent"}`,
                                color: activeTab === t ? C.accent : C.muted, cursor: "pointer",
                                fontFamily: C.sans, fontWeight: 600, fontSize: 11,
                                letterSpacing: ".05em", padding: "9px 12px",
                                textTransform: "uppercase", transition: "all .15s",
                                display: "flex", alignItems: "center", gap: 5,
                            }}>
                                {t}
                                {tabCount[t] && (
                                    <span style={{ background: C.accentDim, color: C.accent, borderRadius: 10, fontSize: 9, padding: "1px 5px", fontWeight: 700 }}>
                                        {tabCount[t]}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* ── TAB CONTENT ──────────────────────────────────────────── */}
                    <div className="apit-scroll" style={{ flex: 1, overflowY: "auto", padding: 14, background: C.bg0, minHeight: 0 }}>

                        {activeTab === "params" && (
                            <div>
                                <Label>Query Parameters</Label>
                                <KVEditor rows={queryParams} onChange={setQueryParams} />
                            </div>
                        )}

                        {activeTab === "headers" && (
                            <div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                                    <Label>Request Headers</Label>
                                    {NO_BODY_METHODS.includes(method) && (
                                        <span style={{
                                            fontSize: 9, fontFamily: C.mono, color: C.yellow,
                                            background: C.yellow + "15", border: `1px solid ${C.yellow}40`,
                                            borderRadius: 4, padding: "2px 7px",
                                        }}>Content-Type auto-removed for {method}</span>
                                    )}
                                </div>
                                <KVEditor rows={headers} onChange={setHeaders} />
                            </div>
                        )}

                        {activeTab === "body" && (
                            NO_BODY_METHODS.includes(method) ? (
                                <div style={{
                                    color: C.muted, fontSize: 12, fontFamily: C.mono,
                                    textAlign: "center", padding: 40,
                                    border: `1px dashed ${C.border}`, borderRadius: 8,
                                }}>{method} requests cannot have a body.</div>
                            ) : (
                                <div>
                                    <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
                                        {["json", "form", "urlencoded", "none"].map(t => (
                                            <button key={t} onClick={() => setBodyType(t)} style={{
                                                background: bodyType === t ? C.accentDim : C.bg2,
                                                border: `1px solid ${bodyType === t ? C.accent + "60" : C.border}`,
                                                borderRadius: 4, color: bodyType === t ? C.accent : C.muted,
                                                cursor: "pointer", fontFamily: C.sans, fontWeight: 600,
                                                fontSize: 10, letterSpacing: ".05em", padding: "4px 10px",
                                                textTransform: "uppercase", transition: "all .15s",
                                            }}>{t === "urlencoded" ? "URL-Encoded" : t}</button>
                                        ))}
                                    </div>
                                    {bodyType === "json" && (
                                        <div>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                                                <Label>JSON Body</Label>
                                                <Btn onClick={formatJson} style={{ fontSize: 10 }}>✦ Format</Btn>
                                            </div>
                                            <textarea className="api-ta" value={rawBody} onChange={e => setRawBody(e.target.value)}
                                                rows={10} placeholder={'{\n  "key": "value"\n}'} spellCheck={false} style={{
                                                    width: "100%", background: C.bg2, border: `1px solid ${C.border}`,
                                                    borderRadius: 6, color: C.text, fontFamily: C.mono,
                                                    fontSize: 11, lineHeight: 1.6, padding: 10, transition: "border-color .15s",
                                                }} />
                                        </div>
                                    )}
                                    {bodyType === "form" && <div><Label>Form Data</Label><KVEditor rows={formRows} onChange={setFormRows} fileSupport /></div>}
                                    {bodyType === "urlencoded" && <div><Label>URL-Encoded Fields</Label><KVEditor rows={urlEncRows} onChange={setUrlEncRows} /></div>}
                                    {bodyType === "none" && <div style={{ color: C.muted, fontSize: 12, fontFamily: C.mono, textAlign: "center", padding: 24 }}>No body</div>}
                                </div>
                            )
                        )}

                        {activeTab === "auth" && (
                            <div>
                                <Label>Auth Type</Label>
                                <div style={{ display: "flex", gap: 4, marginBottom: 14 }}>
                                    {["none", "bearer", "basic"].map(t => (
                                        <button key={t} onClick={() => setAuthType(t)} style={{
                                            background: authType === t ? C.accentDim : C.bg2,
                                            border: `1px solid ${authType === t ? C.accent + "60" : C.border}`,
                                            borderRadius: 4, color: authType === t ? C.accent : C.muted,
                                            cursor: "pointer", fontFamily: C.sans, fontWeight: 600,
                                            fontSize: 10, letterSpacing: ".05em", padding: "4px 10px",
                                            textTransform: "uppercase", transition: "all .15s",
                                        }}>{t}</button>
                                    ))}
                                </div>
                                {authType === "bearer" && <div><Label>Bearer Token</Label><Input value={authBearer} onChange={e => setAuthBearer(e.target.value)} placeholder="eyJhbGci..." /></div>}
                                {authType === "basic" && (
                                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                        <div><Label>Username</Label><Input value={authUser} onChange={e => setAuthUser(e.target.value)} placeholder="username" /></div>
                                        <div><Label>Password</Label><Input type="password" value={authPass} onChange={e => setAuthPass(e.target.value)} placeholder="••••••••" /></div>
                                    </div>
                                )}
                                {authType === "none" && <div style={{ color: C.muted, fontSize: 12, fontFamily: C.mono }}>No authentication</div>}
                            </div>
                        )}
                    </div>

                    {/* ── RESPONSE PANEL (resizable) ───────────────────────────── */}
                    {(loading || response) && (
                        <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", height: respHeight }}>

                            {/* drag handle */}
                            <ResizeHandle onDrag={handleDrag} />

                            {/* header bar */}
                            <div style={{
                                display: "flex", alignItems: "center", gap: 8,
                                padding: "7px 14px", background: C.bg1,
                                borderBottom: `1px solid ${C.border}`,
                                flexShrink: 0, flexWrap: "wrap",
                            }}>
                                <span style={{
                                    fontFamily: C.sans, fontWeight: 700, fontSize: 10,
                                    color: C.muted, letterSpacing: ".08em", textTransform: "uppercase",
                                }}>Response</span>

                                {loading && (
                                    <span style={{ color: C.yellow, fontSize: 11, fontFamily: C.mono, display: "flex", alignItems: "center", gap: 5 }}>
                                        <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>◌</span> Sending…
                                    </span>
                                )}

                                {response && <>
                                    <StatusPill code={response.status} />
                                    {response.elapsed != null && <span style={{ fontSize: 10, fontFamily: C.mono, color: C.muted }}>{response.elapsed} ms</span>}
                                    {response.size != null && (
                                        <span style={{ fontSize: 10, fontFamily: C.mono, color: C.muted }}>
                                            {response.size < 1024 ? `${response.size} B` : `${(response.size / 1024).toFixed(1)} KB`}
                                        </span>
                                    )}
                                    <div style={{ marginLeft: "auto", display: "flex", gap: 5 }}>
                                        <Btn onClick={copyResponse}>{copyDone ? "✓ Copied" : "⧉ Copy"}</Btn>
                                        <Btn onClick={downloadResponse}>↓ Download</Btn>
                                    </div>
                                </>}
                            </div>

                            {/* body */}
                            {response && (
                                <div className="apit-scroll" style={{ overflowY: "auto", padding: 12, flex: 1, minHeight: 0, background: C.bg0 }}>
                                    <HighlightJSON text={response.body} />
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </Drawer>
        </>
    );
}
import { useEffect, useState, useRef } from "react";
import { Allotment } from "allotment";
import "allotment/dist/style.css";

import {
    Monitor,
    Smartphone,
    Tablet,
    RotateCw,
    ZoomIn,
    ZoomOut,
    RefreshCw,
    PanelTopClose,
    PanelTopOpen
} from "lucide-react";

const DEVICES = {
    desktop: { name: "Desktop", width: "100%", height: "100%" },
    iphone14: { name: "iPhone 14", width: 390, height: 844 },
    pixel7: { name: "Pixel 7", width: 412, height: 915 },
    galaxyS20: { name: "Galaxy S20", width: 360, height: 800 },
    ipad: { name: "iPad", width: 820, height: 1180 }
};

const BREAKPOINTS = [320, 375, 414, 640, 768, 1024, 1280, 1440];

export default function PreviewPage() {

    const iframeRef = useRef();

    const [url, setUrl] = useState(null);
    const [device, setDevice] = useState("desktop");
    const [rotate, setRotate] = useState(false);

    const [viewportWidth, setViewportWidth] = useState(390);
    const [customWidth, setCustomWidth] = useState("");

    const [zoom, setZoom] = useState(1);
    const [dpr, setDpr] = useState(1);
    const [network, setNetwork] = useState("online");

    const [showToolbar, setShowToolbar] = useState(true);

    useEffect(() => {

        const cached = localStorage.getItem("preview-url");
        if (cached) setUrl(cached);

        const channel = new BroadcastChannel("webcontainer-preview");

        channel.onmessage = (event) => {
            if (event.data?.type === "preview-ready") {
                setUrl(event.data.url);
            }
        };

        channel.postMessage({ type: "preview-request" });

        return () => channel.close();

    }, []);

    useEffect(() => {

        const config = DEVICES[device];

        if (device !== "desktop") {
            setViewportWidth(config.width);
            setCustomWidth(config.width);
        }

    }, [device]);

    if (!url) {
        return <div style={loadingStyle}>Waiting for preview...</div>;
    }

    const config = DEVICES[device];

    let height = config.height;

    if (rotate && device !== "desktop") {
        height = config.width;
    }

    const DevicePreview = () => (
        <div
            style={{
                width: viewportWidth,
                height,
                transform: `scale(${zoom})`,
                transformOrigin: "center center",
                border: "8px solid #111827",
                borderRadius: "28px",
                overflow: "hidden",
                background: "black"
            }}
        >
            <iframe
                ref={iframeRef}
                src={url}
                style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                    zoom: dpr
                }}
            />
        </div>
    );

    const isLargeScreen = window.innerWidth > 900;

    return (

        <div style={rootStyle}>

            {/* TOOLBAR */}

            {showToolbar && (

                <div style={toolbarStyle}>

                    <div style={leftControls}>

                        <select
                            value={device}
                            onChange={(e) => {
                                setDevice(e.target.value);
                                setRotate(false);
                                setZoom(1);
                            }}
                            style={selectStyle}
                        >
                            {Object.entries(DEVICES).map(([key, d]) => (
                                <option key={key} value={key}>
                                    {d.name}
                                </option>
                            ))}
                        </select>

                        {device !== "desktop" && (
                            <input
                                type="number"
                                value={customWidth}
                                onChange={(e) => {
                                    setCustomWidth(e.target.value);
                                    setViewportWidth(Number(e.target.value));
                                }}
                                style={inputStyle}
                            />
                        )}

                        {device !== "desktop" && (
                            <button onClick={() => setRotate(!rotate)} style={btn}>
                                <RotateCw size={16} />
                            </button>
                        )}

                        <select
                            value={dpr}
                            onChange={(e) => setDpr(Number(e.target.value))}
                            style={selectStyle}
                        >
                            <option value={1}>1x</option>
                            <option value={2}>2x</option>
                            <option value={3}>3x</option>
                        </select>

                        <select
                            value={network}
                            onChange={(e) => setNetwork(e.target.value)}
                            style={selectStyle}
                        >
                            <option value="online">Online</option>
                            <option value="slow">Slow 3G</option>
                            <option value="offline">Offline</option>
                        </select>

                        <div style={groupStyle}>

                            <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} style={btn}>
                                <ZoomIn size={16} />
                            </button>

                            <span style={zoomBadge}>
                                {(zoom * 100).toFixed(0)}%
                            </span>

                            <button onClick={() => setZoom(z => Math.max(0.3, z - 0.1))} style={btn}>
                                <ZoomOut size={16} />
                            </button>

                            <button onClick={() => setZoom(1)} style={btn}>
                                <RefreshCw size={16} />
                            </button>

                        </div>

                    </div>

                    <button onClick={() => setShowToolbar(false)} style={btn}>
                        <PanelTopClose size={16} />
                    </button>

                </div>

            )}

            {/* BREAKPOINT BAR */}

            {showToolbar && device !== "desktop" && (

                <div style={breakpointBar}>

                    {BREAKPOINTS.map(bp => (
                        <button
                            key={bp}
                            onClick={() => {
                                setViewportWidth(bp);
                                setCustomWidth(bp);
                            }}
                            style={{
                                ...breakpointBtn,
                                background: viewportWidth === bp ? "#2563eb" : "#020617"
                            }}
                        >
                            {bp}
                        </button>
                    ))}

                </div>

            )}

            {!showToolbar && (
                <button onClick={() => setShowToolbar(true)} style={floatingBtn}>
                    <PanelTopOpen size={18} />
                </button>
            )}

            {/* DESKTOP */}

            {device === "desktop" && (

                <iframe
                    src={url}
                    style={{
                        width: "100%",
                        height: "100%",
                        border: "none",
                        transform: `scale(${zoom})`,
                        transformOrigin: "center center"
                    }}
                />

            )}

            {/* RESPONSIVE */}

            {device !== "desktop" && (

                <div style={{ flex: 1 }}>

                    {isLargeScreen ? (

                        <Allotment onChange={(sizes) => setViewportWidth(sizes[1])}>

                            <Allotment.Pane minSize={100} />
                            <Allotment.Pane minSize={300}>
                                <div style={centerWrapper}>
                                    <DevicePreview />
                                </div>
                            </Allotment.Pane>
                            <Allotment.Pane minSize={100} />

                        </Allotment>

                    ) : (

                        <div style={centerWrapper}>
                            <DevicePreview />
                        </div>

                    )}

                </div>

            )}

        </div>

    );
}

/* STYLES */

const rootStyle = {
    height: "100vh",
    background: "#020617",
    display: "flex",
    flexDirection: "column"
};

const toolbarStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 12px",
    borderBottom: "1px solid #1e293b",
    flexWrap: "wrap"
};

const leftControls = {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    alignItems: "center"
};

const groupStyle = {
    display: "flex",
    gap: "6px",
    alignItems: "center"
};

const btn = {
    padding: "6px",
    borderRadius: "6px",
    border: "1px solid #1e293b",
    background: "#020617",
    color: "white",
    cursor: "pointer"
};

const selectStyle = {
    padding: "4px 8px",
    background: "#020617",
    border: "1px solid #1e293b",
    color: "white",
    borderRadius: "6px"
};

const inputStyle = {
    width: "80px",
    padding: "4px",
    background: "#020617",
    border: "1px solid #1e293b",
    color: "white",
    borderRadius: "6px"
};

const zoomBadge = {
    fontSize: "12px",
    padding: "2px 6px",
    background: "#1e293b",
    borderRadius: "4px"
};

const breakpointBar = {
    display: "flex",
    gap: "8px",
    padding: "6px 12px",
    borderBottom: "1px solid #1e293b",
    flexWrap: "wrap"
};

const breakpointBtn = {
    padding: "4px 8px",
    fontSize: "12px",
    borderRadius: "6px",
    border: "1px solid #1e293b",
    color: "white",
    cursor: "pointer"
};

const centerWrapper = {
    height: "100%",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
};

const floatingBtn = {
    position: "absolute",
    top: 12,
    right: 12,
    padding: "8px",
    borderRadius: "8px",
    background: "#020617",
    border: "1px solid #1e293b",
    color: "white",
    cursor: "pointer"
};

const loadingStyle = {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#020617",
    color: "#94a3b8"
};
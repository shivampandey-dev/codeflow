import React from "react";
import { Globe, Code2, FlaskConical, Box as Cube, Download } from "lucide-react";

const icons = [
    { Icon: Globe, color: "#3b82f6" },
    { Icon: Code2, color: "#22c55e" },
    { Icon: FlaskConical, color: "#a855f7" },
    { Icon: Cube, color: "#f59e0b" },
    { Icon: Download, color: "#ec4899" }
];

const steps = [
    "Booting WebContainer",
    "Mounting project files",
    "Starting dev server",
    "Starting interactive shell",
    "Installing dependencies",
    "Server ready"
];

function Loder({ step = 1, showSteps = true }) {
    return (
        <div style={styles.wrapper}>

            {/* Orbit Icons */}
            <div className="orbit">
                {icons.map(({ Icon, color }, i) => (
                    <div
                        key={i}
                        className="orbitItem"
                        style={{ "--i": i }}
                    >
                        <Icon size={24} color={color} />
                    </div>
                ))}
            </div>

            {/* Steps (optional) */}
            {showSteps && (
                <div className="steps">
                    {steps.slice(0, step).map((text, i) => {

                        const index = i + 1;

                        let style = "stepFuture";

                        if (index < step) style = "stepDone";
                        else if (index === step) style = "stepActive";

                        return (
                            <div key={i} className={`step ${style}`}>
                                {index < step ? "✓" : "•"} {text}
                            </div>
                        );
                    })}
                </div>
            )}

            <style>{`
            .orbit{
                position:relative;
                width:120px;
                height:120px;
            }

            .orbitItem{
                position:absolute;
                top:50%;
                left:50%;
                transform:
                    rotate(calc(var(--i) * 72deg))
                    translate(45px)
                    rotate(calc(var(--i) * -72deg));

                width:40px;
                height:40px;

                display:flex;
                align-items:center;
                justify-content:center;

                border-radius:12px;
                background:rgba(255,255,255,0.05);
                border:1px solid rgba(255,255,255,0.08);

                animation:pulse 1.8s ease-in-out infinite;
                animation-delay:calc(var(--i) * 0.2s);
            }

            @keyframes pulse{
                0%{
                    transform:
                    rotate(calc(var(--i) * 72deg))
                    translate(45px)
                    rotate(calc(var(--i) * -72deg))
                    scale(1);
                }

                50%{
                    transform:
                    rotate(calc(var(--i) * 72deg))
                    translate(25px)
                    rotate(calc(var(--i) * -72deg))
                    scale(1.2);
                }

                100%{
                    transform:
                    rotate(calc(var(--i) * 72deg))
                    translate(45px)
                    rotate(calc(var(--i) * -72deg))
                    scale(1);
                }
            }

            .steps{
                margin-top:35px;
                display:flex;
                flex-direction:column;
                gap:8px;
                font-size:15px;
                text-align:left;
                min-width:260px;
            }

            .step{
                transition:all .35s ease;
                font-family:monospace;
            }

            .stepDone{
                color:#64748b;
            }

            .stepActive{
                color:#38bdf8;
                font-weight:600;
                animation: glow 1.2s ease-in-out infinite;
            }

            @keyframes glow{
                0%{opacity:.6}
                50%{opacity:1}
                100%{opacity:.6}
            }

            .stepFuture{
                color:#334155;
            }
            `}</style>
        </div>
    );
}

const styles = {
    wrapper: {
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#020617"
    }
};

export default Loder;
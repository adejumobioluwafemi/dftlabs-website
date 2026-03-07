// src/components/Sectors.jsx
import { useState } from "react";
import { SECTORS } from "../data/content";
import SectionHeader from "./ui/SectionHeader";

export default function Sectors() {
    const [active, setActive] = useState(0);

    return (
        <div style={{
            background: "rgba(255,255,255,0.015)",
            borderTop: "1px solid var(--border)",
            borderBottom: "1px solid var(--border)",
            position: "relative", zIndex: 1,
        }}>
            <div id="sectors" className="section-wrapper">
                <SectionHeader
                    eyebrow="Industry Focus"
                    title="Built for Critical Sectors"
                    sub="We go deep in four industries where AI can change lives — not just improve metrics."
                />
                <div className="grid-4">
                    {SECTORS.map((s, i) => (
                        <div
                            key={s.label}
                            onClick={() => setActive(i)}
                            style={{
                                background: active === i ? "rgba(74,143,212,0.12)" : "var(--bg-card)",
                                border: `1px solid ${active === i ? "var(--blue)" : "var(--border)"}`,
                                borderRadius: 16, padding: "28px 24px", cursor: "pointer",
                                transition: "all 0.3s ease",
                                boxShadow: active === i ? "0 0 30px rgba(74,143,212,0.15)" : "none",
                            }}
                        >
                            <div style={{ fontSize: 36, marginBottom: 12 }}>{s.icon}</div>
                            <div style={{
                                fontSize: 17, fontWeight: 700,
                                color: active === i ? "var(--blue)" : "var(--text)",
                                marginBottom: 10, fontFamily: "var(--font-display)",
                            }}>
                                {s.label}
                            </div>
                            <div style={{ fontSize: 13.5, color: "var(--text-muted)", lineHeight: 1.7 }}>
                                {s.desc}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
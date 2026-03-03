import { useState } from "react";
import { ALL_JOBS } from "../../data/content";
import Tag from "../../components/ui/Tag";

const SECTOR_COLORS = {
    Healthcare: "#22c55e",
    Agriculture: "#84cc16",
    Banking: "#f59e0b",
    Education: "#8b5cf6",
};

export default function AdminJobs() {
    const [jobs, setJobs] = useState(ALL_JOBS.map(j => ({ ...j, visible: true })));
    const [featured, setFeatured] = useState([]);

    const toggle = (id) => setJobs(js => js.map(j => j.id === id ? { ...j, visible: !j.visible } : j));
    const toggleFeatured = (id) => setFeatured(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id]);

    return (
        <div>
            <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: "var(--text)", fontFamily: "var(--font-display)", marginBottom: 6 }}>
                    Jobs Management
                </h1>
                <div style={{ display: "flex", gap: 24 }}>
                    <span style={{ fontSize: 14, color: "var(--text-faint)" }}>{jobs.filter(j => j.visible).length} visible</span>
                    <span style={{ fontSize: 14, color: "var(--text-faint)" }}>{jobs.filter(j => !j.visible).length} hidden</span>
                    <span style={{ fontSize: 14, color: "#f59e0b" }}>{featured.length} featured</span>
                </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {jobs.map(j => (
                    <div key={j.id} style={{
                        background: j.visible ? "var(--bg-card)" : "rgba(255,255,255,0.01)",
                        border: `1px solid ${featured.includes(j.id) ? "rgba(245,158,11,0.4)" : j.visible ? "var(--border)" : "rgba(255,255,255,0.04)"}`,
                        borderRadius: 12, padding: "16px 20px",
                        display: "flex", justifyContent: "space-between",
                        alignItems: "center", gap: 12, flexWrap: "wrap",
                        opacity: j.visible ? 1 : 0.45, transition: "all 0.2s",
                    }}>
                        <div style={{ flex: 1, minWidth: 180 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                                {featured.includes(j.id) && <span style={{ fontSize: 11, color: "#f59e0b", fontWeight: 700 }}>★ FEATURED</span>}
                                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-display)" }}>
                                    {j.role}
                                </div>
                            </div>
                            <div style={{ fontSize: 12, color: "var(--text-faint)" }}>
                                {j.company} · {j.location} · {j.posted}
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                            <Tag label={j.sector} color={SECTOR_COLORS[j.sector] || "var(--blue)"} />
                            <Tag label={j.type} color="var(--text-faint)" />
                            <button onClick={() => toggleFeatured(j.id)} style={{
                                background: featured.includes(j.id) ? "rgba(245,158,11,0.15)" : "none",
                                border: `1px solid ${featured.includes(j.id) ? "rgba(245,158,11,0.4)" : "var(--border)"}`,
                                color: featured.includes(j.id) ? "#f59e0b" : "var(--text-faint)",
                                borderRadius: 8, padding: "6px 12px", fontSize: 11,
                                fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                            }}>
                                ★ Feature
                            </button>
                            <button onClick={() => toggle(j.id)} style={{
                                background: j.visible ? "rgba(239,68,68,0.08)" : "rgba(34,197,94,0.08)",
                                border: `1px solid ${j.visible ? "rgba(239,68,68,0.2)" : "rgba(34,197,94,0.2)"}`,
                                color: j.visible ? "#ef4444" : "#22c55e",
                                borderRadius: 8, padding: "6px 14px", fontSize: 11,
                                fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                            }}>
                                {j.visible ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
import { JOBS } from "../data/content";
import SectionHeader from "./ui/SectionHeader";
import Tag from "./ui/Tag";

const SECTOR_COLORS = {
    Healthcare: "#22c55e",
    Agriculture: "#84cc16",
    Banking: "#f59e0b",
    Education: "#8b5cf6",
};

export default function Jobs() {
    return (
        <div style={{ position: "relative", zIndex: 1 }}>
            <div id="jobs" className="section-wrapper">
                <SectionHeader
                    eyebrow="AI Jobs Board"
                    title="Opportunities in AI & Automation"
                    sub="Curated listings across our four focus sectors — aggregated weekly from top companies worldwide."
                />
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {JOBS.map((j, i) => (
                        <div key={i}
                            style={{
                                background: "var(--bg-card)", border: "1px solid var(--border)",
                                borderRadius: 12, padding: "20px 24px",
                                display: "flex", justifyContent: "space-between",
                                alignItems: "center", flexWrap: "wrap", gap: 12,
                                transition: "all 0.3s",
                            }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(74,143,212,0.4)"}
                            onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
                        >
                            <div>
                                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 6, fontFamily: "var(--font-display)" }}>
                                    {j.role}
                                </div>
                                <div style={{ fontSize: 12.5, color: "var(--text-muted)" }}>
                                    {j.company} · {j.location}
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                                <Tag label={j.sector} color={SECTOR_COLORS[j.sector] || "var(--blue)"} />
                                <Tag label={j.type} color="var(--text-faint)" />
                                <button style={{
                                    background: "var(--blue-dim)",
                                    border: "1px solid var(--border-blue)",
                                    color: "var(--blue)", borderRadius: 8,
                                    padding: "7px 16px", fontSize: 12, fontWeight: 600,
                                    cursor: "pointer",
                                }}>
                                    View →
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ textAlign: "center", marginTop: 40 }}>
                    <button style={{
                        background: "none", border: "1px solid var(--border-blue)",
                        color: "var(--blue)", borderRadius: 12,
                        padding: "13px 36px", fontSize: 14, fontWeight: 600,
                        cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
                    }}
                        onMouseEnter={e => e.currentTarget.style.background = "var(--blue-dim)"}
                        onMouseLeave={e => e.currentTarget.style.background = "none"}>
                        Browse All Jobs →
                    </button>
                </div>
            </div>
        </div>
    );
}
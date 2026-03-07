// src/components/Jobs.jsx
// Homepage preview section — pulls latest 4 featured jobs from live API
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchJobs } from "../api/jobs";
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
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchJobs({ limit: 4, is_visible: true })
            .then(data => {
                const items = Array.isArray(data) ? data : data?.items ?? data?.jobs ?? [];
                setJobs(items.length > 0 ? items.slice(0, 4) : JOBS.slice(0, 4));
            })
            .catch(() => setJobs(JOBS.slice(0, 4)))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div style={{ position: "relative", zIndex: 1 }}>
            <div id="jobs" className="section-wrapper">
                <SectionHeader
                    eyebrow="AI Jobs Board"
                    title="Opportunities in AI & Automation"
                    sub="Curated listings across our four focus sectors — aggregated weekly from top companies worldwide."
                />
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {loading
                        ? Array(4).fill(null).map((_, i) => (
                            <div key={i} style={{
                                background: "var(--bg-card)", border: "1px solid var(--border)",
                                borderRadius: 12, padding: "20px 24px", opacity: 0.5,
                            }}>
                                <div style={{ height: 18, background: "rgba(255,255,255,0.06)", borderRadius: 6, width: "45%", marginBottom: 10 }} />
                                <div style={{ height: 14, background: "rgba(255,255,255,0.04)", borderRadius: 6, width: "30%" }} />
                            </div>
                        ))
                        : jobs.map((j, i) => (
                            <div key={j.id ?? i}
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
                                        {j.role || j.title}
                                    </div>
                                    <div style={{ fontSize: 12.5, color: "var(--text-muted)" }}>
                                        {j.company} · {j.location}
                                        {j.salary && <span style={{ marginLeft: 8, color: "var(--blue)", fontWeight: 600 }}>{j.salary}</span>}
                                    </div>
                                </div>
                                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                                    {j.sector && <Tag label={j.sector} color={SECTOR_COLORS[j.sector] || "var(--blue)"} />}
                                    {(j.type || j.job_type) && <Tag label={j.type || j.job_type} color="var(--text-faint)" />}
                                    <button
                                        onClick={() => navigate(`/jobs/${j.id}`)}
                                        style={{
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
                        ))
                    }
                </div>
                <div style={{ textAlign: "center", marginTop: 40 }}>
                    <button
                        onClick={() => navigate("/jobs")}
                        style={{
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
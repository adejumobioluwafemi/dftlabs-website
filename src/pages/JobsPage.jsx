//src/pages/JobsPage.jsx
import { useState, useEffect } from "react";
import { fetchJobs } from "../api/jobs";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Tag from "../components/ui/Tag";
import CircuitBackground from "../components/CircuitBackground";

const SECTOR_COLORS = {
    Healthcare: "#22c55e",
    Agriculture: "#84cc16",
    Banking: "#f59e0b",
    Education: "#8b5cf6",
};
const SECTORS = ["All", "Healthcare", "Agriculture", "Banking", "Education"];
const JOB_TYPES = ["All", "Full-time", "Contract", "Part-time"];

function JobSkeleton() {
    return (
        <div style={{
            background: "var(--bg-card)", border: "1px solid var(--border)",
            borderRadius: 14, padding: "22px 28px",
            animation: "pulse 1.5s ease-in-out infinite",
        }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
                <div style={{ flex: 1 }}>
                    <div style={{ height: 18, width: "40%", background: "var(--border)", borderRadius: 6, marginBottom: 10 }} />
                    <div style={{ height: 13, width: "60%", background: "var(--border)", borderRadius: 6 }} />
                </div>
                <div style={{ height: 32, width: 100, background: "var(--border)", borderRadius: 8 }} />
            </div>
        </div>
    );
}

const FilterRow = ({ label, options, value, onChange }) => (
    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <span style={{ fontSize: 12, color: "var(--text-faint)", minWidth: 60, letterSpacing: "0.06em" }}>{label}</span>
        {options.map(opt => (
            <button key={opt} onClick={() => onChange(opt)} style={{
                background: value === opt ? "var(--blue)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${value === opt ? "var(--blue)" : "var(--border)"}`,
                color: value === opt ? "#fff" : "var(--text-muted)",
                borderRadius: 99, padding: "6px 14px",
                fontSize: 12, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit",
                transition: "all 0.2s",
            }}>
                {opt}
            </button>
        ))}
    </div>
);

export default function JobsPage() {
    const [sector, setSector] = useState("All");
    const [type, setType] = useState("All");
    const [location, setLocation] = useState("All");
    const [search, setSearch] = useState("");
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);
        const timer = setTimeout(async () => {
            try {
                const data = await fetchJobs({ sector, type, location, search });
                if (!cancelled) setJobs(data);
            } catch {
                if (!cancelled) setError("Failed to load jobs. Please try again.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }, search ? 300 : 0);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [sector, type, location, search]);

    const locations = ["All", "Remote", ...new Set(jobs.map(j => j.location).filter(l => l && l !== "Remote"))];
    const remoteCount = jobs.filter(j => j.location === "Remote").length;
    const companyCount = new Set(jobs.map(j => j.company)).size;

    return (
        <>
            <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
            <CircuitBackground />
            <Navbar />
            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 24px 100px", position: "relative", zIndex: 1 }}>
                {/* Header */}
                <div style={{ marginBottom: 48, textAlign: "center" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--blue)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 14 }}>
                        AI Jobs Board
                    </div>
                    <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 800, color: "var(--text)", fontFamily: "var(--font-display)", marginBottom: 16 }}>
                        Opportunities in AI & Automation
                    </h1>
                    <p style={{ fontSize: 16, color: "var(--text-muted)", maxWidth: 520, margin: "0 auto" }}>
                        Curated listings across Healthcare, Agriculture, Banking, and Education — updated weekly.
                    </p>
                </div>

                {/* Stats bar */}
                <div style={{
                    display: "flex", gap: 32, justifyContent: "center",
                    marginBottom: 40, padding: "20px 32px",
                    background: "var(--bg-card)", border: "1px solid var(--border)",
                    borderRadius: 14, flexWrap: "wrap",
                }}>
                    {[
                        ["Total Listings", jobs.length],
                        ["Remote Roles", remoteCount],
                        ["Companies", companyCount],
                    ].map(([label, val]) => (
                        <div key={label} style={{ textAlign: "center" }}>
                            <div style={{ fontSize: 26, fontWeight: 800, color: "var(--blue)", fontFamily: "var(--font-display)" }}>
                                {loading ? "—" : val}
                            </div>
                            <div style={{ fontSize: 12, color: "var(--text-faint)", marginTop: 2 }}>{label}</div>
                        </div>
                    ))}
                </div>

                {/* Search + Filters */}
                <div style={{
                    background: "var(--bg-card)", border: "1px solid var(--border)",
                    borderRadius: 16, padding: "24px", marginBottom: 32,
                    display: "flex", flexDirection: "column", gap: 16,
                }}>
                    <input
                        placeholder="Search roles or companies..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{
                            background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)",
                            borderRadius: 10, padding: "11px 16px", color: "var(--text)",
                            fontSize: 14, outline: "none", fontFamily: "inherit", width: "100%",
                        }}
                        onFocus={e => e.target.style.borderColor = "var(--blue)"}
                        onBlur={e => e.target.style.borderColor = "var(--border)"}
                    />
                    <FilterRow label="Sector" options={SECTORS} value={sector} onChange={setSector} />
                    <FilterRow label="Type" options={JOB_TYPES} value={type} onChange={setType} />
                    <FilterRow label="Location" options={locations} value={location} onChange={setLocation} />
                </div>

                {/* Results count */}
                {!loading && (
                    <div style={{ fontSize: 13, color: "var(--text-faint)", marginBottom: 20 }}>
                        Showing {jobs.length} listing{jobs.length !== 1 ? "s" : ""}
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
                        <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
                        <p>{error}</p>
                    </div>
                )}

                {/* Skeletons */}
                {loading && !error && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        {[1, 2, 3, 4, 5].map(i => <JobSkeleton key={i} />)}
                    </div>
                )}

                {/* Job Cards */}
                {!loading && !error && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        {jobs.length === 0 ? (
                            <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-faint)" }}>
                                <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                                No jobs match your filters.
                            </div>
                        ) : jobs.map(j => (
                            <Link key={j.id} to={`/jobs/${j.id}`} style={{ textDecoration: "none" }}>
                                <div style={{
                                    background: "var(--bg-card)", border: "1px solid var(--border)",
                                    borderRadius: 14, padding: "22px 28px",
                                    display: "flex", justifyContent: "space-between",
                                    alignItems: "center", flexWrap: "wrap", gap: 16,
                                    transition: "all 0.25s", cursor: "pointer",
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(74,143,212,0.4)"; e.currentTarget.style.background = "rgba(74,143,212,0.04)"; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--bg-card)"; }}>
                                    <div style={{ flex: 1, minWidth: 200 }}>
                                        <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", marginBottom: 6, fontFamily: "var(--font-display)" }}>
                                            {j.role}
                                        </div>
                                        <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                                            {j.company} · {j.location} · <span style={{ color: "var(--text-faint)" }}>{j.posted}</span>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                                        {j.salary && (
                                            <span style={{ fontSize: 13, fontWeight: 700, color: "#22c55e" }}>{j.salary}</span>
                                        )}
                                        <Tag label={j.sector} color={SECTOR_COLORS[j.sector] || "var(--blue)"} />
                                        <Tag label={j.type} color="var(--text-faint)" />
                                        <button
                                            onClick={e => { e.preventDefault(); e.stopPropagation(); j.apply_url && window.open(j.apply_url, "_blank"); }}
                                            style={{
                                                background: "linear-gradient(135deg, #4A8FD4, #2d6ba8)",
                                                border: "none", color: "#fff", borderRadius: 8,
                                                padding: "8px 18px", fontSize: 12, fontWeight: 700,
                                                cursor: j.apply_url ? "pointer" : "default",
                                                fontFamily: "inherit",
                                                opacity: j.apply_url ? 1 : 0.5,
                                            }}>
                                            Apply →
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}
/* eslint-disable react-hooks/static-components */
import { useState } from "react";
import { ALL_JOBS } from "../data/content";
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

export default function JobsPage() {
    const [sector, setSector] = useState("All");
    const [type, setType] = useState("All");
    const [location, setLocation] = useState("All");
    const [search, setSearch] = useState("");

    const locations = ["All", "Remote", ...new Set(ALL_JOBS.map(j => j.location).filter(l => l !== "Remote"))];

    const filtered = ALL_JOBS.filter(j => {
        const matchSector = sector === "All" || j.sector === sector;
        const matchType = type === "All" || j.type === type;
        const matchLocation = location === "All" || j.location === location;
        const matchSearch = j.role.toLowerCase().includes(search.toLowerCase()) ||
            j.company.toLowerCase().includes(search.toLowerCase());
        return matchSector && matchType && matchLocation && matchSearch;
    });

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

    return (
        <>
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
                    {[["Total Listings", ALL_JOBS.length], ["Remote Roles", ALL_JOBS.filter(j => j.location === "Remote").length], ["Added This Week", 6], ["Companies", new Set(ALL_JOBS.map(j => j.company)).size]].map(([label, val]) => (
                        <div key={label} style={{ textAlign: "center" }}>
                            <div style={{ fontSize: 26, fontWeight: 800, color: "var(--blue)", fontFamily: "var(--font-display)" }}>{val}</div>
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
                <div style={{ fontSize: 13, color: "var(--text-faint)", marginBottom: 20 }}>
                    Showing {filtered.length} of {ALL_JOBS.length} listings
                </div>

                {/* Job Cards */}
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {filtered.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-faint)" }}>
                            No jobs match your filters.
                        </div>
                    ) : filtered.map(j => (
                        <div key={j.id} style={{
                            background: "var(--bg-card)", border: "1px solid var(--border)",
                            borderRadius: 14, padding: "22px 28px",
                            display: "flex", justifyContent: "space-between",
                            alignItems: "center", flexWrap: "wrap", gap: 16,
                            transition: "all 0.25s",
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
                                <button style={{
                                    background: "linear-gradient(135deg, #4A8FD4, #2d6ba8)",
                                    border: "none", color: "#fff", borderRadius: 8,
                                    padding: "8px 18px", fontSize: 12, fontWeight: 700,
                                    cursor: "pointer", fontFamily: "inherit",
                                }}>
                                    Apply →
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </>
    );
}
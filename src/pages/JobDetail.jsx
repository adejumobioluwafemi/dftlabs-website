//src/pages/JobDetail.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchJobs } from "../api/jobs";
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

function renderDescription(text) {
    if (!text) return <p style={{ fontSize: 15, color: "var(--text-muted)", lineHeight: 1.9 }}>No description provided.</p>;
    return text.split("\n\n").map((block, i) => {
        if (block.startsWith("## ")) {
            return <h2 key={i} style={{ fontSize: 20, fontWeight: 800, color: "var(--text)", fontFamily: "var(--font-display)", margin: "32px 0 14px" }}>{block.replace("## ", "")}</h2>;
        }
        if (block.includes("\n- ")) {
            const lines = block.split("\n");
            return (
                <div key={i} style={{ marginBottom: 16 }}>
                    {lines.map((line, j) => {
                        if (line.startsWith("- "))
                            return <div key={j} style={{ fontSize: 15, color: "var(--text-muted)", lineHeight: 1.8, paddingLeft: 16, marginBottom: 6 }}>• {line.replace("- ", "")}</div>;
                        return line ? <div key={j} style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 8, marginTop: j > 0 ? 12 : 0 }}>{line}</div> : null;
                    })}
                </div>
            );
        }
        return <p key={i} style={{ fontSize: 15, color: "var(--text-muted)", lineHeight: 1.9, marginBottom: 16 }}>{block}</p>;
    });
}

export default function JobDetail() {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        let cancelled = false;
        fetchJobs({ limit: 50 })
            .then(jobs => {
                if (cancelled) return;
                const found = jobs.find(j => String(j.id) === String(id));
                if (!found) { setNotFound(true); }
                else {
                    setJob(found);
                    setRelated(jobs.filter(j => j.sector === found.sector && j.id !== found.id).slice(0, 3));
                }
            })
            .catch(() => { if (!cancelled) setNotFound(true); })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [id]);

    if (loading) {
        return (
            <>
                <CircuitBackground />
                <Navbar />
                <div style={{ maxWidth: 860, margin: "0 auto", padding: "60px 24px", position: "relative", zIndex: 1, animation: "pulse 1.5s ease-in-out infinite" }}>
                    <div style={{ height: 14, width: 100, background: "var(--border)", borderRadius: 6, marginBottom: 28 }} />
                    <div style={{ height: 36, background: "var(--border)", borderRadius: 8, marginBottom: 12 }} />
                    <div style={{ height: 36, width: "65%", background: "var(--border)", borderRadius: 8, marginBottom: 24 }} />
                    <div style={{ height: 200, background: "var(--border)", borderRadius: 12 }} />
                </div>
                <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
                <Footer />
            </>
        );
    }

    if (notFound) {
        return (
            <>
                <Navbar />
                <div style={{ textAlign: "center", padding: "120px 24px", position: "relative", zIndex: 1 }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>💼</div>
                    <h1 style={{ color: "var(--text)", fontFamily: "var(--font-display)", marginBottom: 16 }}>Job not found</h1>
                    <Link to="/jobs" style={{ color: "var(--blue)" }}>← Back to Jobs</Link>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
            <CircuitBackground />
            <Navbar />
            <div style={{ position: "relative", zIndex: 1 }}>
                {/* Hero */}
                <div style={{ background: "linear-gradient(180deg, rgba(74,143,212,0.08) 0%, transparent 100%)", borderBottom: "1px solid var(--border)", padding: "60px 24px 48px" }}>
                    <div style={{ maxWidth: 860, margin: "0 auto" }}>
                        <Link to="/jobs" style={{ color: "var(--blue)", fontSize: 13, fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 28 }}>
                            ← All Jobs
                        </Link>
                        <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap", alignItems: "center" }}>
                            <Tag label={job.sector} color={SECTOR_COLORS[job.sector] || "var(--blue)"} />
                            <Tag label={job.type} color="var(--text-faint)" />
                            {job.is_featured && <Tag label="Featured" color="#f59e0b" />}
                        </div>
                        <h1 style={{ fontSize: "clamp(24px, 4vw, 44px)", fontWeight: 800, color: "var(--text)", fontFamily: "var(--font-display)", lineHeight: 1.2, marginBottom: 16 }}>
                            {job.role}
                        </h1>
                        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginBottom: 8 }}>
                            {[["🏢", job.company], ["📍", job.location], ["🕒", job.posted]].map(([icon, val]) => (
                                <div key={val} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "var(--text-muted)" }}>
                                    <span>{icon}</span><span>{val}</span>
                                </div>
                            ))}
                            {job.salary && (
                                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 700, color: "#22c55e" }}>
                                    <span>💰</span><span>{job.salary}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div style={{ maxWidth: 860, margin: "0 auto", padding: "48px 24px 80px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 48, alignItems: "start" }} className="job-grid">
                        {/* Left: Description */}
                        <div>
                            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: 32, marginBottom: 32 }}>
                                <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", fontFamily: "var(--font-display)", marginBottom: 20 }}>
                                    About This Role
                                </h2>
                                {renderDescription(job.description)}
                            </div>

                            {/* Related jobs */}
                            {related.length > 0 && (
                                <div>
                                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-display)", marginBottom: 16 }}>
                                        More {job.sector} Roles
                                    </h3>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                        {related.map(r => (
                                            <Link key={r.id} to={`/jobs/${r.id}`} style={{ textDecoration: "none" }}>
                                                <div style={{
                                                    background: "var(--bg-card)", border: "1px solid var(--border)",
                                                    borderRadius: 12, padding: "16px 20px",
                                                    display: "flex", justifyContent: "space-between", alignItems: "center",
                                                    transition: "all 0.2s",
                                                }}
                                                    onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(74,143,212,0.4)"}
                                                    onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
                                                    <div>
                                                        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>{r.role}</div>
                                                        <div style={{ fontSize: 12, color: "var(--text-faint)" }}>{r.company} · {r.location}</div>
                                                    </div>
                                                    {r.salary && <span style={{ fontSize: 13, fontWeight: 700, color: "#22c55e" }}>{r.salary}</span>}
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right: Apply card */}
                        <div style={{ position: "sticky", top: 90 }}>
                            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 20, padding: 28 }}>
                                <h3 style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", fontFamily: "var(--font-display)", marginBottom: 6 }}>
                                    Interested in this role?
                                </h3>
                                <p style={{ fontSize: 13, color: "var(--text-faint)", marginBottom: 24, lineHeight: 1.6 }}>
                                    {job.type} · {job.location}{job.salary ? ` · ${job.salary}` : ""}
                                </p>

                                <button
                                    onClick={() => job.apply_url && window.open(job.apply_url, "_blank")}
                                    disabled={!job.apply_url}
                                    style={{
                                        width: "100%",
                                        background: job.apply_url ? "linear-gradient(135deg, #4A8FD4, #2d6ba8)" : "rgba(255,255,255,0.04)",
                                        border: "none", color: job.apply_url ? "#fff" : "var(--text-muted)",
                                        borderRadius: 12, padding: "14px",
                                        fontSize: 14, fontWeight: 700,
                                        cursor: job.apply_url ? "pointer" : "not-allowed",
                                        fontFamily: "inherit", letterSpacing: "0.04em",
                                        marginBottom: 10, transition: "opacity 0.2s",
                                    }}
                                    onMouseEnter={e => { if (job.apply_url) e.currentTarget.style.opacity = "0.9"; }}
                                    onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                                >
                                    Apply Now →
                                </button>

                                <button
                                    onClick={() => navigator.clipboard?.writeText(window.location.href)}
                                    style={{
                                        width: "100%",
                                        background: "none", border: "1px solid var(--border)",
                                        color: "var(--text-muted)", borderRadius: 12,
                                        padding: "11px", fontSize: 13, fontWeight: 600,
                                        cursor: "pointer", fontFamily: "inherit",
                                    }}
                                >
                                    Copy Link
                                </button>

                                <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--border)" }}>
                                    <div style={{ fontSize: 12, color: "var(--text-faint)", marginBottom: 10 }}>Role details</div>
                                    {[
                                        ["Type", job.type],
                                        ["Location", job.location],
                                        ["Sector", job.sector],
                                        ["Posted", job.posted],
                                        job.salary && ["Salary", job.salary],
                                    ].filter(Boolean).map(([label, val]) => (
                                        <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 10 }}>
                                            <span style={{ color: "var(--text-faint)" }}>{label}</span>
                                            <span style={{ color: "var(--text)", fontWeight: 600 }}>{val}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            <style>{`@media (max-width: 768px) { .job-grid { grid-template-columns: 1fr !important; } }`}</style>
        </>
    );
}
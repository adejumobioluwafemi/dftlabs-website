// src/pages/admin/AdminJobs.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../context/useAuth";
import { fetchAllJobs, updateJob, deleteJob, triggerJobsAgent } from "../../api/adminApi";
import { useSessionExpiry } from "../../hooks/useSessionExpiry";
import Tag from "../../components/ui/Tag";

const SECTOR_COLORS = { Healthcare: "#22c55e", Agriculture: "#84cc16", Banking: "#f59e0b", Education: "#8b5cf6" };
const SECTORS = ["Healthcare", "Agriculture", "Banking", "Education"];
const JOB_TYPES = ["Full-time", "Contract", "Part-time"];

function timeAgo(dateStr) {
    if (!dateStr) return "";
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;
    return `${Math.floor(days / 7)}w ago`;
}

const inputStyle = {
    width: "100%", background: "rgba(255,255,255,0.04)",
    border: "1px solid var(--border)", borderRadius: 10,
    padding: "10px 14px", color: "var(--text)", fontSize: 13,
    outline: "none", fontFamily: "inherit",
};

function EditModal({ job, onSave, onClose }) {
    const [form, setForm] = useState({
        role: job.role || "",
        company: job.company || "",
        location: job.location || "",
        job_type: job.job_type || "Full-time",
        sector: job.sector || "Healthcare",
        salary: job.salary || "",
        apply_url: job.apply_url || "",
        description: job.description || "",
    });
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        try { await onSave(form); }
        finally { setSaving(false); }
    };

    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={onClose}>
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 20, padding: 32, width: "100%", maxWidth: 600, maxHeight: "90vh", overflow: "auto" }} onClick={e => e.stopPropagation()}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", fontFamily: "var(--font-display)" }}>Edit Job</h2>
                    <button onClick={onClose} style={{ background: "none", border: "1px solid var(--border)", color: "var(--text-muted)", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}>✕</button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <input placeholder="Role / Job title *" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} style={inputStyle} />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <input placeholder="Company" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} style={inputStyle} />
                        <input placeholder="Location" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} style={inputStyle} />
                        <input placeholder="Salary range" value={form.salary} onChange={e => setForm(f => ({ ...f, salary: e.target.value }))} style={inputStyle} />
                        <input placeholder="Apply URL" value={form.apply_url} onChange={e => setForm(f => ({ ...f, apply_url: e.target.value }))} style={inputStyle} />
                    </div>
                    {/* Sector */}
                    <div>
                        <div style={{ fontSize: 11, color: "var(--text-faint)", marginBottom: 8, letterSpacing: "0.08em" }}>SECTOR</div>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            {SECTORS.map(s => (
                                <button key={s} onClick={() => setForm(f => ({ ...f, sector: s }))} style={{ background: form.sector === s ? (SECTOR_COLORS[s] + "25") : "none", border: `1px solid ${form.sector === s ? SECTOR_COLORS[s] : "var(--border)"}`, color: form.sector === s ? SECTOR_COLORS[s] : "var(--text-muted)", borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{s}</button>
                            ))}
                        </div>
                    </div>
                    {/* Type */}
                    <div>
                        <div style={{ fontSize: 11, color: "var(--text-faint)", marginBottom: 8, letterSpacing: "0.08em" }}>JOB TYPE</div>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            {JOB_TYPES.map(t => (
                                <button key={t} onClick={() => setForm(f => ({ ...f, job_type: t }))} style={{ background: form.job_type === t ? "var(--blue-dim)" : "none", border: `1px solid ${form.job_type === t ? "var(--border-blue)" : "var(--border)"}`, color: form.job_type === t ? "var(--blue)" : "var(--text-muted)", borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{t}</button>
                            ))}
                        </div>
                    </div>
                    <textarea placeholder="Description (markdown supported)" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={6} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.7 }} />
                    <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                        <button onClick={handleSave} disabled={saving} style={{ background: "linear-gradient(135deg, #4A8FD4, #2d6ba8)", border: "none", color: "#fff", borderRadius: 10, padding: "11px 24px", fontSize: 13, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                        <button onClick={onClose} style={{ background: "none", border: "1px solid var(--border)", color: "var(--text-muted)", borderRadius: 10, padding: "11px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AdminJobs() {
    const { token } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updating, setUpdating] = useState(null);
    const [editingJob, setEditingJob] = useState(null);
    const [agentRunning, setAgentRunning] = useState(false);
    const [agentResult, setAgentResult] = useState(null);
    const [search, setSearch] = useState("");

    const handleError = useSessionExpiry();

    useEffect(() => { load(); }, []);

    async function load() {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchAllJobs(token);
            setJobs(data);
        } catch (err) {
            handleError(err, "Failed to load jobs.");
            setError("Failed to load jobs.");
        } finally { setLoading(false); }
    }

    const handleToggleVisible = async (job) => {
        setUpdating(job.id);
        try {
            const updated = await updateJob(token, job.id, { is_visible: !job.is_visible });
            setJobs(js => js.map(j => j.id === job.id ? { ...j, ...updated } : j));
        } catch { alert("Failed to update."); }
        finally { setUpdating(null); }
    };

    const handleToggleFeatured = async (job) => {
        setUpdating(job.id);
        try {
            const updated = await updateJob(token, job.id, { is_featured: !job.is_featured });
            setJobs(js => js.map(j => j.id === job.id ? { ...j, ...updated } : j));
        } catch { alert("Failed to update."); }
        finally { setUpdating(null); }
    };

    const handleSaveEdit = async (jobId, form) => {
        try {
            // Backend JobUpdate only allows is_visible, is_featured, salary
            // For full field edits we send what the backend accepts
            const updated = await updateJob(token, jobId, { salary: form.salary });
            setJobs(js => js.map(j => j.id === jobId ? { ...j, ...updated, ...form } : j));
            setEditingJob(null);
        } catch { alert("Failed to save."); }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this job permanently?")) return;
        try {
            await deleteJob(token, id);
            setJobs(js => js.filter(j => j.id !== id));
        } catch { alert("Failed to delete."); }
    };

    const handleRunAgent = async () => {
        setAgentRunning(true);
        setAgentResult(null);
        try {
            const result = await triggerJobsAgent(token);
            setAgentResult(`✅ Added ${result.new_jobs} new job${result.new_jobs !== 1 ? "s" : ""}`);
            await load();
        } catch { setAgentResult("❌ Agent failed."); }
        finally { setAgentRunning(false); }
    };

    const filtered = jobs.filter(j =>
        j.role?.toLowerCase().includes(search.toLowerCase()) ||
        j.company?.toLowerCase().includes(search.toLowerCase()) ||
        j.sector?.toLowerCase().includes(search.toLowerCase())
    );

    const visibleCount = jobs.filter(j => j.is_visible).length;
    const featuredCount = jobs.filter(j => j.is_featured).length;

    return (
        <div>
            {editingJob && (
                <EditModal
                    job={editingJob}
                    onSave={(form) => handleSaveEdit(editingJob.id, form)}
                    onClose={() => setEditingJob(null)}
                />
            )}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
                <div>
                    <h1 style={{ fontSize: 26, fontWeight: 800, color: "var(--text)", fontFamily: "var(--font-display)", marginBottom: 6 }}>Jobs Management</h1>
                    {!loading && (
                        <div style={{ display: "flex", gap: 20, fontSize: 13 }}>
                            <span style={{ color: "var(--text-faint)" }}>{visibleCount} visible</span>
                            <span style={{ color: "var(--text-faint)" }}>{jobs.length - visibleCount} hidden</span>
                            <span style={{ color: "#f59e0b" }}>{featuredCount} featured</span>
                        </div>
                    )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                    <button onClick={handleRunAgent} disabled={agentRunning} style={{ background: agentRunning ? "rgba(74,143,212,0.3)" : "linear-gradient(135deg, #4A8FD4, #2d6ba8)", border: "none", color: "#fff", borderRadius: 10, padding: "11px 22px", fontSize: 13, fontWeight: 700, cursor: agentRunning ? "not-allowed" : "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 8 }}>
                        {agentRunning ? <><span style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }} />Running...</> : "🤖 Run Jobs Agent"}
                    </button>
                    {agentResult && <div style={{ fontSize: 12, color: "var(--text-faint)" }}>{agentResult}</div>}
                </div>
            </div>

            {error && (
                <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 12, padding: "16px 20px", marginBottom: 24, color: "#ef4444", fontSize: 14 }}>
                    {error} <button onClick={load} style={{ background: "none", border: "none", color: "var(--blue)", cursor: "pointer", fontFamily: "inherit", fontSize: 13, marginLeft: 8 }}>Retry</button>
                </div>
            )}

            <input
                placeholder="Search jobs, companies, sectors..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ ...inputStyle, marginBottom: 20, fontSize: 14, padding: "11px 16px" }}
                onFocus={e => e.target.style.borderColor = "var(--blue)"}
                onBlur={e => e.target.style.borderColor = "var(--border)"}
            />

            {loading ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 20px", animation: "pulse 1.5s ease-in-out infinite" }}>
                            <div style={{ height: 14, width: "45%", background: "var(--border)", borderRadius: 6, marginBottom: 8 }} />
                            <div style={{ height: 12, width: "30%", background: "var(--border)", borderRadius: 6 }} />
                        </div>
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-faint)" }}>No jobs match your search.</div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {filtered.map(j => (
                        <div key={j.id} style={{ background: j.is_visible ? "var(--bg-card)" : "rgba(255,255,255,0.01)", border: `1px solid ${j.is_featured ? "rgba(245,158,11,0.4)" : j.is_visible ? "var(--border)" : "rgba(255,255,255,0.04)"}`, borderRadius: 12, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", opacity: j.is_visible ? 1 : 0.45, transition: "all 0.2s" }}>
                            <div style={{ flex: 1, minWidth: 180 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
                                    {j.is_featured && <span style={{ fontSize: 11, color: "#f59e0b", fontWeight: 700 }}>★ FEATURED</span>}
                                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-display)" }}>{j.role}</div>
                                </div>
                                <div style={{ fontSize: 12, color: "var(--text-faint)" }}>
                                    {j.company} · {j.location} · {timeAgo(j.created_at)}
                                    {j.salary && <span style={{ color: "#22c55e", marginLeft: 8 }}>{j.salary}</span>}
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                                <Tag label={j.sector} color={SECTOR_COLORS[j.sector] || "var(--blue)"} />
                                <Tag label={j.job_type} color="var(--text-faint)" />
                                <button onClick={() => setEditingJob(j)} style={{ background: "var(--blue-dim)", border: "1px solid var(--border-blue)", color: "var(--blue)", borderRadius: 8, padding: "6px 12px", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>✏️ Edit</button>
                                <button onClick={() => handleToggleFeatured(j)} disabled={updating === j.id} style={{ background: j.is_featured ? "rgba(245,158,11,0.15)" : "none", border: `1px solid ${j.is_featured ? "rgba(245,158,11,0.4)" : "var(--border)"}`, color: j.is_featured ? "#f59e0b" : "var(--text-faint)", borderRadius: 8, padding: "6px 12px", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                                    ★ {j.is_featured ? "Unfeature" : "Feature"}
                                </button>
                                <button onClick={() => handleToggleVisible(j)} disabled={updating === j.id} style={{ background: j.is_visible ? "rgba(239,68,68,0.08)" : "rgba(34,197,94,0.08)", border: `1px solid ${j.is_visible ? "rgba(239,68,68,0.2)" : "rgba(34,197,94,0.2)"}`, color: j.is_visible ? "#ef4444" : "#22c55e", borderRadius: 8, padding: "6px 14px", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                                    {updating === j.id ? "..." : j.is_visible ? "Hide" : "Show"}
                                </button>
                                <button onClick={() => handleDelete(j.id)} style={{ background: "none", border: "1px solid var(--border)", color: "var(--text-faint)", borderRadius: 8, padding: "6px 10px", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>🗑</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
            `}</style>
        </div>
    );
}
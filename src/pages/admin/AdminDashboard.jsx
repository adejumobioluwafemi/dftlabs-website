// src/pages/admin/AdminDashboard.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../context/useAuth";
import { fetchDrafts, fetchAllJobs, fetchAllEvents } from "../../api/adminApi";
import { useSessionExpiry } from "../../hooks/useSessionExpiry";

const API_BASE = import.meta.env.VITE_API_URL || "https://dftlabs-backend.onrender.com";

export default function AdminDashboard() {
    const { token } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleError = useSessionExpiry();
    useEffect(() => {
        async function loadStats() {
            try {
                const [drafts, publishedRes, jobs, events] = await Promise.all([
                    fetchDrafts(token),
                    fetch(`${API_BASE}/api/blog/?limit=50`).then(r => r.json()),
                    fetchAllJobs(token),
                    fetchAllEvents(token),
                ]);
                const published = Array.isArray(publishedRes) ? publishedRes : [];
                const totalRegs = events.reduce((sum, e) => sum + (e.filled || 0), 0);
                const newJobsThisWeek = jobs.filter(j => {
                    const diff = Date.now() - new Date(j.created_at).getTime();
                    return diff < 7 * 86400000;
                }).length;
                setStats({
                    drafts: drafts.length,
                    published: published.length,
                    jobs: jobs.length,
                    newJobsThisWeek,
                    events: events.filter(e => e.is_active !== false).length,
                    registrations: totalRegs,
                });
            } catch (err) {
                handleError(err, "Failed to load stats");
                setStats({ drafts: "—", published: "—", jobs: "—", newJobsThisWeek: "—", events: "—", registrations: "—" });
            } finally {
                setLoading(false);
            }
        }
        loadStats();
    }, [token]);

    const statCards = stats ? [
        { icon: "✍️", label: "Blog Drafts", value: stats.drafts, color: "#4A8FD4", note: "Pending review", href: "/admin/blog" },
        { icon: "📰", label: "Published Posts", value: stats.published, color: "#22c55e", note: "Live on site", href: "/admin/blog" },
        { icon: "💼", label: "Job Listings", value: stats.jobs, color: "#84cc16", note: `${stats.newJobsThisWeek} added this week`, href: "/admin/jobs" },
        { icon: "📅", label: "Active Events", value: stats.events, color: "#f59e0b", note: "Upcoming", href: "/admin/events" },
        { icon: "👥", label: "Registrations", value: stats.registrations, color: "#8b5cf6", note: "All time", href: "/admin/events" },
    ] : [];

    return (
        <div>
            <div style={{ marginBottom: 36 }}>
                <h1 style={{ fontSize: 28, fontWeight: 800, color: "var(--text)", fontFamily: "var(--font-display)", marginBottom: 6 }}>Dashboard</h1>
                <p style={{ fontSize: 14, color: "var(--text-faint)" }}>Welcome back. Here's what needs your attention.</p>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, marginBottom: 40 }} className="admin-stats">
                {loading ? (
                    [1, 2, 3, 4, 5].map(i => (
                        <div key={i} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px 20px", animation: "pulse 1.5s ease-in-out infinite" }}>
                            <div style={{ height: 28, width: 40, background: "var(--border)", borderRadius: 6, marginBottom: 12 }} />
                            <div style={{ height: 32, width: 60, background: "var(--border)", borderRadius: 6, marginBottom: 8 }} />
                            <div style={{ height: 13, width: 80, background: "var(--border)", borderRadius: 6 }} />
                        </div>
                    ))
                ) : statCards.map(s => (
                    <a key={s.label} href={s.href} style={{ textDecoration: "none" }}>
                        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px 20px", cursor: "pointer", transition: "border-color 0.2s" }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = s.color + "60"}
                            onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
                            <div style={{ fontSize: 26, marginBottom: 12 }}>{s.icon}</div>
                            <div style={{ fontSize: 28, fontWeight: 800, color: s.color, fontFamily: "var(--font-display)", marginBottom: 4 }}>{s.value}</div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>{s.label}</div>
                            <div style={{ fontSize: 12, color: "var(--text-faint)" }}>{s.note}</div>
                        </div>
                    </a>
                ))}
            </div>

            {/* Quick actions */}
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: "28px" }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-display)", marginBottom: 20 }}>Quick Actions</h2>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    {[
                        { label: "Review Drafts", href: "/admin/blog", color: "#4A8FD4" },
                        { label: "Manage Jobs", href: "/admin/jobs", color: "#22c55e" },
                        { label: "Manage Events", href: "/admin/events", color: "#f59e0b" },
                    ].map(a => (
                        <a key={a.href} href={a.href} style={{ textDecoration: "none" }}>
                            <button style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${a.color}40`, color: a.color, borderRadius: 10, padding: "10px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}
                                onMouseEnter={e => e.currentTarget.style.background = `${a.color}15`}
                                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}>
                                {a.label} →
                            </button>
                        </a>
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
                @media (max-width: 1100px) { .admin-stats { grid-template-columns: repeat(3,1fr) !important; } }
                @media (max-width: 700px) { .admin-stats { grid-template-columns: repeat(2,1fr) !important; } }
                @media (max-width: 420px) { .admin-stats { grid-template-columns: 1fr !important; } }
            `}</style>
        </div>
    );
}
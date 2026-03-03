export default function AdminDashboard() {
    const stats = [
        { icon: "✍️", label: "Blog Drafts", value: 3, color: "#4A8FD4", note: "Pending review" },
        { icon: "💼", label: "New Job Listings", value: 8, color: "#22c55e", note: "Added this week" },
        { icon: "📅", label: "Upcoming Events", value: 3, color: "#f59e0b", note: "Need confirmation" },
        { icon: "👥", label: "Event Registrations", value: 127, color: "#8b5cf6", note: "This month" },
    ];

    const activity = [
        { time: "2 hours ago", icon: "🤖", text: "Research agent generated 4 new blog drafts" },
        { time: "5 hours ago", icon: "💼", text: "Jobs agent added 8 new listings from LinkedIn & RemoteOK" },
        { time: "Yesterday", icon: "📅", text: "2 new registrations for AI in Healthcare Workshop" },
        { time: "2 days ago", icon: "📝", text: "MedScan AI v2.0 announcement post published" },
        { time: "3 days ago", icon: "🤖", text: "Research agent weekly digest ready for review" },
    ];

    return (
        <div>
            <div style={{ marginBottom: 36 }}>
                <h1 style={{ fontSize: 28, fontWeight: 800, color: "var(--text)", fontFamily: "var(--font-display)", marginBottom: 6 }}>
                    Dashboard
                </h1>
                <p style={{ fontSize: 14, color: "var(--text-faint)" }}>
                    Welcome back. Here's what needs your attention.
                </p>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 40 }} className="admin-stats">
                {stats.map(s => (
                    <div key={s.label} style={{
                        background: "var(--bg-card)", border: "1px solid var(--border)",
                        borderRadius: 16, padding: "24px 20px",
                    }}>
                        <div style={{ fontSize: 28, marginBottom: 12 }}>{s.icon}</div>
                        <div style={{ fontSize: 28, fontWeight: 800, color: s.color, fontFamily: "var(--font-display)", marginBottom: 4 }}>
                            {s.value}
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>{s.label}</div>
                        <div style={{ fontSize: 12, color: "var(--text-faint)" }}>{s.note}</div>
                    </div>
                ))}
            </div>

            {/* Activity Feed */}
            <div style={{
                background: "var(--bg-card)", border: "1px solid var(--border)",
                borderRadius: 16, padding: "28px",
            }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-display)", marginBottom: 24 }}>
                    Recent Activity
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                    {activity.map((a, i) => (
                        <div key={i} style={{
                            display: "flex", gap: 16, alignItems: "flex-start",
                            paddingBottom: i < activity.length - 1 ? 20 : 0,
                            marginBottom: i < activity.length - 1 ? 20 : 0,
                            borderBottom: i < activity.length - 1 ? "1px solid var(--border)" : "none",
                        }}>
                            <div style={{ fontSize: 20, marginTop: 2 }}>{a.icon}</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 14, color: "var(--text)", marginBottom: 4 }}>{a.text}</div>
                                <div style={{ fontSize: 12, color: "var(--text-faint)" }}>{a.time}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
        @media (max-width: 900px) { .admin-stats { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 500px) { .admin-stats { grid-template-columns: 1fr !important; } }
      `}</style>
        </div>
    );
}
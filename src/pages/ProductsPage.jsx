// src/pages/ProductsPage.jsx
// Public products listing — fetches from API, falls back to static data
// Cards link to /products/:slug for full detail page
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { APPS } from "../data/content";

const API_BASE = import.meta.env.VITE_API_URL || "https://dftlabs-backend.onrender.com";

const SECTORS = ["All", "Healthcare", "Agriculture", "Banking", "Education"];
const STATUSES = ["All", "Live", "Beta", "Coming Soon"];

const STATUS_STYLES = {
    "Live": { bg: "rgba(34,197,94,0.12)", border: "rgba(34,197,94,0.3)", color: "#22c55e", dot: "#22c55e" },
    "Beta": { bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.3)", color: "#f59e0b", dot: "#f59e0b" },
    "Coming Soon": { bg: "rgba(139,92,246,0.12)", border: "rgba(139,92,246,0.3)", color: "#8b5cf6", dot: "#8b5cf6" },
};
const SECTOR_COLORS = {
    Healthcare: "#22c55e", Agriculture: "#84cc16",
    Banking: "#f59e0b", Education: "#8b5cf6", General: "#4A8FD4",
};

function normalizeProduct(p) {
    return {
        id: p.id,
        slug: p.slug || p.id || p.name?.toLowerCase().replace(/\s+/g, "-"),
        name: p.name,
        sector: p.sector,
        status: p.status,
        tagline: p.tagline,
        icon: p.icon || "🔷",
        version: p.version || "",
        metrics: p.metrics || [],
        tech: p.tech || [],
        cta: p.cta || "Learn More",
        is_visible: p.is_visible !== false,
    };
}

// Normalize static APPS data (which uses different field names)
function normalizeStatic(a) {
    return {
        id: a.id || a.name?.toLowerCase().replace(/\s+/g, "-"),
        slug: a.id || a.name?.toLowerCase().replace(/\s+/g, "-"),
        name: a.name,
        sector: a.sector,
        status: a.status,
        tagline: a.tagline || a.desc,
        icon: a.icon || "🔷",
        version: "",
        metrics: [],
        tech: [],
        cta: "Learn More",
        is_visible: true,
    };
}

function StatusBadge({ status }) {
    const s = STATUS_STYLES[status] || STATUS_STYLES["Coming Soon"];
    return (
        <span style={{
            background: s.bg, border: `1px solid ${s.border}`, color: s.color,
            fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 99,
            letterSpacing: "0.06em", display: "inline-flex", alignItems: "center", gap: 6,
        }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, display: "inline-block" }} />
            {status}
        </span>
    );
}

function AppCard({ app, onClick }) {
    const sectorColor = SECTOR_COLORS[app.sector] || "#4A8FD4";
    return (
        <div
            onClick={() => onClick(app.slug)}
            style={{
                background: "var(--bg-card)", border: "1px solid var(--border)",
                borderRadius: 18, padding: 26, cursor: "pointer",
                transition: "all 0.3s", display: "flex", flexDirection: "column", gap: 14,
            }}
            onMouseEnter={e => {
                e.currentTarget.style.borderColor = "rgba(74,143,212,0.4)";
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 12px 40px rgba(74,143,212,0.1)";
            }}
            onMouseLeave={e => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
            }}
        >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ fontSize: 38 }}>{app.icon}</div>
                <StatusBadge status={app.status} />
            </div>

            <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", fontFamily: "var(--font-display)" }}>{app.name}</div>
                    {app.version && <span style={{ fontSize: 11, color: "var(--text-faint)" }}>{app.version}</span>}
                </div>
                <div style={{ fontSize: 12, color: sectorColor, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 8 }}>
                    {app.sector}
                </div>
                <div style={{ fontSize: 13.5, color: "var(--text-muted)", lineHeight: 1.65 }}>
                    {app.tagline}
                </div>
            </div>

            {/* Metrics preview */}
            {app.metrics.length > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {app.metrics.slice(0, 2).map(([val, label]) => (
                        <div key={label} style={{
                            background: "rgba(74,143,212,0.06)", border: "1px solid rgba(74,143,212,0.1)",
                            borderRadius: 10, padding: "8px 12px",
                        }}>
                            <div style={{ fontSize: 16, fontWeight: 800, color: "var(--blue)", fontFamily: "var(--font-display)" }}>{val}</div>
                            <div style={{ fontSize: 11, color: "var(--text-faint)" }}>{label}</div>
                        </div>
                    ))}
                </div>
            )}

            {app.tech.length > 0 && (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {app.tech.slice(0, 3).map(t => (
                        <span key={t} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "var(--text-faint)", fontSize: 11, padding: "3px 9px", borderRadius: 6 }}>{t}</span>
                    ))}
                </div>
            )}

            <button style={{
                background: app.status === "Live" ? "linear-gradient(135deg, #4A8FD4, #2d6ba8)" : "rgba(74,143,212,0.1)",
                border: app.status === "Live" ? "none" : "1px solid var(--border-blue)",
                color: app.status === "Live" ? "#fff" : "var(--blue)",
                borderRadius: 10, padding: "10px 16px",
                fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
            }}>
                View Details →
            </button>
        </div>
    );
}

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sectorFilter, setSectorFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");
    const navigate = useNavigate();

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch(`${API_BASE}/api/products/?limit=50`);
                if (res.ok) {
                    const data = await res.json();
                    const items = Array.isArray(data) ? data : data?.items ?? [];
                    setProducts(items.filter(p => p.is_visible !== false).map(normalizeProduct));
                } else {
                    throw new Error();
                }
            } catch {
                setProducts(APPS.map(normalizeStatic));
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const filtered = products.filter(a => {
        if (sectorFilter !== "All" && a.sector !== sectorFilter) return false;
        if (statusFilter !== "All" && a.status !== statusFilter) return false;
        return true;
    });

    const liveCounts = {
        Live: products.filter(a => a.status === "Live").length,
        Beta: products.filter(a => a.status === "Beta").length,
        "Coming Soon": products.filter(a => a.status === "Coming Soon").length,
    };

    return (
        <div style={{ minHeight: "100vh", position: "relative", zIndex: 1 }}>

            {/* Hero */}
            <div style={{
                background: "linear-gradient(180deg, rgba(74,143,212,0.08) 0%, transparent 100%)",
                borderBottom: "1px solid var(--border)",
                padding: "60px 24px 48px", textAlign: "center",
            }}>
                <div style={{ maxWidth: 700, margin: "0 auto" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--blue)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 14 }}>Our Products</div>
                    <h1 style={{ fontSize: "clamp(30px, 5vw, 52px)", fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--text)", marginBottom: 16, lineHeight: 1.1 }}>
                        Apps &{" "}
                        <span style={{ background: "linear-gradient(135deg, #4A8FD4, #7CB9E8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Platforms</span>
                    </h1>
                    <p style={{ fontSize: 16, color: "var(--text-muted)", lineHeight: 1.8 }}>
                        From diagnostics to decision support — each tool built on rigorous ML engineering for Healthcare, Agriculture, Banking, and Education.
                    </p>
                    {!loading && (
                        <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 28, flexWrap: "wrap" }}>
                            {Object.entries(liveCounts).map(([status, count]) => {
                                const s = STATUS_STYLES[status];
                                return (
                                    <div key={status} style={{
                                        background: s.bg, border: `1px solid ${s.border}`,
                                        borderRadius: 12, padding: "10px 20px", textAlign: "center",
                                        cursor: "pointer",
                                    }}
                                        onClick={() => setStatusFilter(statusFilter === status ? "All" : status)}
                                    >
                                        <div style={{ fontSize: 22, fontWeight: 800, color: s.color, fontFamily: "var(--font-display)" }}>{count}</div>
                                        <div style={{ fontSize: 12, color: s.color, fontWeight: 600 }}>{status}</div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px" }}>

                {/* Filters */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 36, alignItems: "center" }}>
                    <div style={{ fontSize: 13, color: "var(--text-faint)" }}>Sector:</div>
                    {SECTORS.map(s => (
                        <button key={s} onClick={() => setSectorFilter(s)} style={{
                            background: sectorFilter === s ? "rgba(74,143,212,0.15)" : "rgba(255,255,255,0.04)",
                            border: `1px solid ${sectorFilter === s ? "var(--blue)" : "var(--border)"}`,
                            color: sectorFilter === s ? "var(--blue)" : "var(--text-muted)",
                            borderRadius: 8, padding: "8px 14px", fontSize: 12.5, fontWeight: 600,
                            cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
                        }}>{s}</button>
                    ))}
                    <div style={{ width: "100%", height: 0 }} />
                    <div style={{ fontSize: 13, color: "var(--text-faint)" }}>Status:</div>
                    {STATUSES.map(s => {
                        const style = STATUS_STYLES[s];
                        const isActive = statusFilter === s;
                        return (
                            <button key={s} onClick={() => setStatusFilter(s)} style={{
                                background: isActive && style ? style.bg : "rgba(255,255,255,0.04)",
                                border: `1px solid ${isActive && style ? style.border : "var(--border)"}`,
                                color: isActive && style ? style.color : "var(--text-muted)",
                                borderRadius: 8, padding: "8px 14px", fontSize: 12.5, fontWeight: 600,
                                cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
                            }}>{s}</button>
                        );
                    })}
                </div>

                {loading ? (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 18, padding: 26, opacity: 0.4, height: 260 }} />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
                        <div style={{ fontSize: 40, marginBottom: 14 }}>🔍</div>
                        <div style={{ fontSize: 16, fontWeight: 600 }}>No products match your filters</div>
                        <button onClick={() => { setSectorFilter("All"); setStatusFilter("All"); }}
                            style={{ marginTop: 14, background: "none", border: "1px solid var(--border-blue)", color: "var(--blue)", borderRadius: 8, padding: "8px 20px", fontSize: 13, cursor: "pointer" }}>
                            Clear filters
                        </button>
                    </div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
                        {filtered.map(app => (
                            <AppCard key={app.slug} app={app} onClick={(slug) => navigate(`/products/${slug}`)} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
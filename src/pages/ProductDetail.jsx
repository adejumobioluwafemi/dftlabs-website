// src/pages/ProductDetail.jsx
// Individual product page at /products/:slug
// Fetches from API, falls back to static APPS_DATA from content.js
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { APPS } from "../data/content";

const API_BASE = import.meta.env.VITE_API_URL || "https://dftlabs-backend.onrender.com";

const STATUS_STYLES = {
    "Live": { bg: "rgba(34,197,94,0.12)", border: "rgba(34,197,94,0.3)", color: "#22c55e", dot: "#22c55e" },
    "Beta": { bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.3)", color: "#f59e0b", dot: "#f59e0b" },
    "Coming Soon": { bg: "rgba(139,92,246,0.12)", border: "rgba(139,92,246,0.3)", color: "#8b5cf6", dot: "#8b5cf6" },
};
const SECTOR_COLORS = {
    Healthcare: "#22c55e", Agriculture: "#84cc16",
    Banking: "#f59e0b", Education: "#8b5cf6", General: "#4A8FD4",
};

function StatusBadge({ status }) {
    const s = STATUS_STYLES[status] || STATUS_STYLES["Coming Soon"];
    return (
        <span style={{
            background: s.bg, border: `1px solid ${s.border}`, color: s.color,
            fontSize: 13, fontWeight: 700, padding: "6px 16px", borderRadius: 99,
            letterSpacing: "0.06em", display: "inline-flex", alignItems: "center", gap: 8,
        }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: s.dot, display: "inline-block", animation: status === "Live" ? "pulse 2s infinite" : "none" }} />
            {status}
        </span>
    );
}

// Normalize API product or static product to consistent shape
function normalizeProduct(p) {
    return {
        id: p.id,
        name: p.name,
        slug: p.slug || p.id,
        sector: p.sector,
        status: p.status,
        tagline: p.tagline,
        desc: p.desc || p.description,
        icon: p.icon || "🔷",
        version: p.version || "",
        image: p.image || null,
        metrics: p.metrics || [],
        features: p.features || [],
        use_cases: p.use_cases || p.useCases || [],
        tech: p.tech || [],
        cta: p.cta || "Request Demo",
        cta_url: p.cta_url || "",
    };
}

export default function ProductDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        async function load() {
            setLoading(true);
            setNotFound(false);
            try {
                // Try API first
                const res = await fetch(`${API_BASE}/api/products/${slug}`);
                if (res.ok) {
                    const data = await res.json();
                    setProduct(normalizeProduct(data));
                    // Fetch related (same sector)
                    const allRes = await fetch(`${API_BASE}/api/products/?limit=20`);
                    if (allRes.ok) {
                        const all = await allRes.json();
                        const items = Array.isArray(all) ? all : all?.items ?? [];
                        setRelated(items.filter(p => p.sector === data.sector && p.slug !== slug).slice(0, 3).map(normalizeProduct));
                    }
                } else {
                    throw new Error("Not found");
                }
            } catch {
                // Fall back to static data
                const staticProduct = APPS.find(a =>
                    a.id === slug || a.name.toLowerCase().replace(/\s+/g, "-") === slug
                );
                if (staticProduct) {
                    setProduct(normalizeProduct(staticProduct));
                    setRelated(APPS.filter(a => a.sector === staticProduct.sector && a.id !== staticProduct.id).slice(0, 3).map(normalizeProduct));
                } else {
                    setNotFound(true);
                }
            } finally {
                setLoading(false);
            }
        }
        load();
        window.scrollTo(0, 0);
    }, [slug]);

    if (loading) return (
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "60px 24px" }}>
            <div style={{ height: 36, width: "50%", background: "var(--bg-card)", borderRadius: 8, marginBottom: 16 }} />
            <div style={{ height: 20, width: "70%", background: "var(--bg-card)", borderRadius: 6, marginBottom: 10 }} />
            <div style={{ height: 20, width: "40%", background: "var(--bg-card)", borderRadius: 6 }} />
        </div>
    );

    if (notFound) return (
        <div style={{ maxWidth: 600, margin: "80px auto", padding: "0 24px", textAlign: "center" }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>🔍</div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "var(--text)", marginBottom: 12 }}>Product Not Found</h1>
            <p style={{ color: "var(--text-muted)", marginBottom: 28 }}>This product doesn't exist or may have been removed.</p>
            <button onClick={() => navigate("/products")} style={{ background: "linear-gradient(135deg, #4A8FD4, #2d6ba8)", border: "none", color: "#fff", borderRadius: 12, padding: "12px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                ← Back to Products
            </button>
        </div>
    );

    if (!product) return null;

    const sectorColor = SECTOR_COLORS[product.sector] || "#4A8FD4";

    return (
        <div style={{ minHeight: "100vh" }}>

            {/* Hero section */}
            <div style={{
                background: "linear-gradient(180deg, rgba(74,143,212,0.06) 0%, transparent 100%)",
                borderBottom: "1px solid var(--border)",
                padding: "52px 24px 44px",
            }}>
                <div style={{ maxWidth: 900, margin: "0 auto" }}>
                    {/* Breadcrumb */}
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 24, fontSize: 13, color: "var(--text-faint)" }}>
                        <Link to="/" style={{ color: "var(--text-faint)", textDecoration: "none" }}
                            onMouseEnter={e => e.target.style.color = "var(--blue)"}
                            onMouseLeave={e => e.target.style.color = "var(--text-faint)"}>
                            Home
                        </Link>
                        <span>/</span>
                        <Link to="/products" style={{ color: "var(--text-faint)", textDecoration: "none" }}
                            onMouseEnter={e => e.target.style.color = "var(--blue)"}
                            onMouseLeave={e => e.target.style.color = "var(--text-faint)"}>
                            Products
                        </Link>
                        <span>/</span>
                        <span style={{ color: "var(--text-muted)" }}>{product.name}</span>
                    </div>

                    <div style={{ display: "flex", gap: 28, alignItems: "flex-start", flexWrap: "wrap" }}>
                        {/* Icon */}
                        <div style={{
                            width: 88, height: 88, borderRadius: 22,
                            background: `${sectorColor}18`,
                            border: `1px solid ${sectorColor}33`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 48, flexShrink: 0,
                        }}>
                            {product.icon}
                        </div>

                        <div style={{ flex: 1, minWidth: 260 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                                <StatusBadge status={product.status} />
                                <span style={{
                                    background: `${sectorColor}18`, color: sectorColor,
                                    border: `1px solid ${sectorColor}33`,
                                    fontSize: 12, fontWeight: 700, padding: "5px 14px", borderRadius: 99, letterSpacing: "0.07em",
                                }}>
                                    {product.sector.toUpperCase()}
                                </span>
                                {product.version && <span style={{ fontSize: 12, color: "var(--text-faint)" }}>{product.version}</span>}
                            </div>

                            <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, color: "var(--text)", fontFamily: "var(--font-display)", marginBottom: 12, lineHeight: 1.1 }}>
                                {product.name}
                            </h1>
                            <p style={{ fontSize: 17, color: "var(--text-muted)", lineHeight: 1.7, maxWidth: 620, marginBottom: 24 }}>
                                {product.tagline}
                            </p>

                            {/* CTAs */}
                            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                                <button style={{
                                    background: "linear-gradient(135deg, #4A8FD4, #2d6ba8)",
                                    border: "none", color: "#fff", borderRadius: 12,
                                    padding: "13px 28px", fontSize: 14, fontWeight: 700,
                                    cursor: "pointer", fontFamily: "inherit", transition: "transform 0.2s",
                                }}
                                    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                                    onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                                >
                                    {product.cta} →
                                </button>
                                <button
                                    onClick={() => navigate("/products")}
                                    style={{
                                        background: "none", border: "1px solid var(--border-blue)",
                                        color: "var(--blue)", borderRadius: 12,
                                        padding: "13px 24px", fontSize: 14, fontWeight: 600,
                                        cursor: "pointer", fontFamily: "inherit",
                                    }}
                                >
                                    ← All Products
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cover image */}
            {product.image && (
                <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 24px 0" }}>
                    <img src={product.image} alt={product.name} style={{ width: "100%", borderRadius: 16, border: "1px solid var(--border)", display: "block", maxHeight: 380, objectFit: "cover" }} />
                </div>
            )}

            {/* Main content */}
            <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 48, alignItems: "start" }} className="product-detail-grid">

                    {/* Left column */}
                    <div>
                        {/* Description */}
                        <section style={{ marginBottom: 44 }}>
                            <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--text)", fontFamily: "var(--font-display)", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid var(--border)" }}>
                                About {product.name}
                            </h2>
                            <p style={{ fontSize: 15, color: "var(--text-muted)", lineHeight: 1.85 }}>{product.desc}</p>
                        </section>

                        {/* Features */}
                        {product.features.length > 0 && (
                            <section style={{ marginBottom: 44 }}>
                                <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--text)", fontFamily: "var(--font-display)", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid var(--border)" }}>
                                    Key Features
                                </h2>
                                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                    {product.features.map((f, i) => (
                                        <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                                            <div style={{
                                                width: 24, height: 24, borderRadius: 6, flexShrink: 0,
                                                background: `${sectorColor}18`, border: `1px solid ${sectorColor}33`,
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                color: sectorColor, fontSize: 12, fontWeight: 700,
                                            }}>✓</div>
                                            <span style={{ fontSize: 14.5, color: "var(--text-muted)", lineHeight: 1.6, paddingTop: 2 }}>{f}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Use Cases */}
                        {product.use_cases.length > 0 && (
                            <section style={{ marginBottom: 44 }}>
                                <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--text)", fontFamily: "var(--font-display)", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid var(--border)" }}>
                                    Use Cases
                                </h2>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                                    {product.use_cases.map((u, i) => (
                                        <span key={i} style={{
                                            background: "rgba(74,143,212,0.08)", border: "1px solid rgba(74,143,212,0.2)",
                                            color: "var(--blue-light)", fontSize: 13.5, padding: "8px 16px", borderRadius: 10,
                                        }}>{u}</span>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Tech stack */}
                        {product.tech.length > 0 && (
                            <section>
                                <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--text)", fontFamily: "var(--font-display)", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid var(--border)" }}>
                                    Technology
                                </h2>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                    {product.tech.map(t => (
                                        <span key={t} style={{
                                            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                                            color: "var(--text-muted)", fontSize: 13.5, padding: "7px 14px", borderRadius: 8,
                                        }}>{t}</span>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right sidebar */}
                    <div style={{ position: "sticky", top: 90 }}>
                        {/* Metrics card */}
                        {product.metrics.length > 0 && (
                            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 18, padding: 24, marginBottom: 20 }}>
                                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>
                                    By the Numbers
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                    {product.metrics.map(([val, label], i) => (
                                        <div key={i} style={{
                                            background: "rgba(74,143,212,0.07)", border: "1px solid rgba(74,143,212,0.12)",
                                            borderRadius: 12, padding: "14px 16px", textAlign: "center",
                                        }}>
                                            <div style={{ fontSize: 22, fontWeight: 800, color: "var(--blue)", fontFamily: "var(--font-display)", lineHeight: 1.1 }}>{val}</div>
                                            <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 4 }}>{label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* CTA card */}
                        <div style={{ background: `linear-gradient(135deg, ${sectorColor}10, rgba(74,143,212,0.08))`, border: `1px solid ${sectorColor}28`, borderRadius: 18, padding: 24 }}>
                            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 8, fontFamily: "var(--font-display)" }}>
                                Interested in {product.name}?
                            </div>
                            <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.7, marginBottom: 18 }}>
                                {product.status === "Live"
                                    ? "This product is live and available. Get in touch to schedule a demo or discuss integration."
                                    : product.status === "Beta"
                                        ? "Join our beta program and be among the first to test this product in your environment."
                                        : "Join the waitlist to be notified when this product launches."}
                            </p>
                            <button style={{
                                width: "100%", background: "linear-gradient(135deg, #4A8FD4, #2d6ba8)",
                                border: "none", color: "#fff", borderRadius: 12,
                                padding: "13px", fontSize: 14, fontWeight: 700,
                                cursor: "pointer", fontFamily: "inherit",
                            }}>
                                {product.cta} →
                            </button>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {related.length > 0 && (
                    <div style={{ marginTop: 64, paddingTop: 48, borderTop: "1px solid var(--border)" }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--blue)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 20 }}>
                            More in {product.sector}
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
                            {related.map(r => (
                                <div
                                    key={r.slug}
                                    onClick={() => navigate(`/products/${r.slug}`)}
                                    style={{
                                        background: "var(--bg-card)", border: "1px solid var(--border)",
                                        borderRadius: 14, padding: 20, cursor: "pointer", transition: "all 0.3s",
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(74,143,212,0.4)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)"; }}
                                >
                                    <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8 }}>
                                        <span style={{ fontSize: 26 }}>{r.icon}</span>
                                        <div>
                                            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-display)" }}>{r.name}</div>
                                            {r.status && (
                                                <span style={{ fontSize: 10, color: STATUS_STYLES[r.status]?.color || "var(--blue)", fontWeight: 600 }}>{r.status}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div style={{ fontSize: 12.5, color: "var(--text-muted)", lineHeight: 1.6 }}>{r.tagline}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.5 } }
                @media (max-width: 768px) {
                    .product-detail-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </div>
    );
}
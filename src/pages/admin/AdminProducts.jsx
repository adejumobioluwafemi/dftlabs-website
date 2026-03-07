// src/pages/admin/AdminProducts.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../context/useAuth";
import {
    fetchAllProducts, createProduct, updateProduct,
    deleteProduct, showProduct, hideProduct,
} from "../../api/adminApi";
import { useSessionExpiry } from "../../hooks/useSessionExpiry";
import ImageUploader from "../../components/ui/ImageUploader";

const API_BASE = import.meta.env.VITE_API_URL || "https://dftlabs-backend.onrender.com";

const SECTORS = ["Healthcare", "Agriculture", "Banking", "Education", "General"];
const STATUSES = ["Live", "Beta", "Coming Soon"];
const STATUS_STYLES = {
    "Live": { bg: "rgba(34,197,94,0.12)", border: "rgba(34,197,94,0.3)", color: "#22c55e" },
    "Beta": { bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.3)", color: "#f59e0b" },
    "Coming Soon": { bg: "rgba(139,92,246,0.12)", border: "rgba(139,92,246,0.3)", color: "#8b5cf6" },
};
const SECTOR_COLORS = {
    Healthcare: "#22c55e", Agriculture: "#84cc16",
    Banking: "#f59e0b", Education: "#8b5cf6", General: "#4A8FD4",
};

const inputStyle = {
    width: "100%", background: "rgba(255,255,255,0.04)",
    border: "1px solid var(--border)", borderRadius: 10,
    padding: "10px 14px", color: "var(--text)", fontSize: 14,
    outline: "none", fontFamily: "inherit", boxSizing: "border-box",
};

const EMPTY_PRODUCT = {
    name: "",
    slug: "",
    sector: "Healthcare",
    status: "Live",
    tagline: "",
    desc: "",
    version: "",
    icon: "🔷",
    image: "",
    // Structured arrays stored as newline-separated strings in the form
    metrics_raw: "",        // "94%;Accuracy\n<200ms;Latency"
    features_raw: "",       // one per line
    use_cases_raw: "",      // one per line
    tech_raw: "",           // comma or newline separated
    cta: "Request Demo",
    cta_url: "",
    is_visible: true,
    order_index: 0,
};

function slugify(str) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// Parse "val;label\nval2;label2" → [["val","label"],...]
function parseMetrics(raw) {
    if (!raw) return [];
    return raw.split("\n").map(l => l.trim()).filter(Boolean).map(l => {
        const [val, ...rest] = l.split(";");
        return [val?.trim() || "", rest.join(";")?.trim() || ""];
    });
}
// Parse newline list → string[]
function parseLines(raw) {
    if (!raw) return [];
    return raw.split("\n").map(l => l.trim()).filter(Boolean);
}
// Parse comma/newline list → string[]
function parseTech(raw) {
    if (!raw) return [];
    return raw.split(/[\n,]/).map(l => l.trim()).filter(Boolean);
}

// Serialize back to form strings from a product object
function productToForm(p) {
    return {
        name: p.name || "",
        slug: p.slug || "",
        sector: p.sector || "Healthcare",
        status: p.status || "Live",
        tagline: p.tagline || "",
        desc: p.desc || p.description || "",
        version: p.version || "",
        icon: p.icon || "🔷",
        image: p.image || "",
        metrics_raw: (p.metrics || []).map(([v, l]) => `${v};${l}`).join("\n"),
        features_raw: (p.features || []).join("\n"),
        use_cases_raw: (p.use_cases || p.useCases || []).join("\n"),
        tech_raw: (p.tech || []).join(", "),
        cta: p.cta || "Request Demo",
        cta_url: p.cta_url || "",
        is_visible: p.is_visible !== false,
        order_index: p.order_index ?? 0,
    };
}

function formToPayload(form) {
    return {
        name: form.name,
        slug: form.slug || slugify(form.name),
        sector: form.sector,
        status: form.status,
        tagline: form.tagline,
        desc: form.desc,
        version: form.version,
        icon: form.icon,
        image: form.image || null,
        metrics: parseMetrics(form.metrics_raw),
        features: parseLines(form.features_raw),
        use_cases: parseLines(form.use_cases_raw),
        tech: parseTech(form.tech_raw),
        cta: form.cta,
        cta_url: form.cta_url,
        is_visible: form.is_visible,
        order_index: Number(form.order_index) || 0,
    };
}

// ── Shared form component ─────────────────────────────────────────────────────
function ProductForm({ initial, onSave, onCancel, saving, isNew = false }) {
    const [form, setForm] = useState(initial);
    const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

    const labelStyle = { fontSize: 11, fontWeight: 700, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6, display: "block" };
    const sectionStyle = { marginBottom: 22 };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>

            {/* Row 1: Name + slug + icon + version */}
            <div style={sectionStyle}>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 80px 120px", gap: 10 }} className="product-form-row1">
                    <div>
                        <label style={labelStyle}>Product Name *</label>
                        <input value={form.name} onChange={e => { set("name", e.target.value); if (!form.slug || form.slug === slugify(form.name)) set("slug", slugify(e.target.value)); }} style={inputStyle} placeholder="MedScan AI" />
                    </div>
                    <div>
                        <label style={labelStyle}>Slug *</label>
                        <input value={form.slug} onChange={e => set("slug", e.target.value)} style={inputStyle} placeholder="medscan-ai" />
                    </div>
                    <div>
                        <label style={labelStyle}>Icon</label>
                        <input value={form.icon} onChange={e => set("icon", e.target.value)} style={{ ...inputStyle, textAlign: "center", fontSize: 22 }} placeholder="🔷" />
                    </div>
                    <div>
                        <label style={labelStyle}>Version</label>
                        <input value={form.version} onChange={e => set("version", e.target.value)} style={inputStyle} placeholder="v1.0" />
                    </div>
                </div>
            </div>

            {/* Row 2: Sector + Status + Visibility */}
            <div style={{ ...sectionStyle, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }} className="product-form-row2">
                <div>
                    <label style={labelStyle}>Sector</label>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {SECTORS.map(s => (
                            <button key={s} type="button" onClick={() => set("sector", s)} style={{
                                background: form.sector === s ? `${SECTOR_COLORS[s]}22` : "none",
                                border: `1px solid ${form.sector === s ? SECTOR_COLORS[s] : "var(--border)"}`,
                                color: form.sector === s ? SECTOR_COLORS[s] : "var(--text-muted)",
                                borderRadius: 7, padding: "5px 11px", fontSize: 12, fontWeight: 600,
                                cursor: "pointer", fontFamily: "inherit",
                            }}>{s}</button>
                        ))}
                    </div>
                </div>
                <div>
                    <label style={labelStyle}>Status</label>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {STATUSES.map(s => {
                            const st = STATUS_STYLES[s];
                            return (
                                <button key={s} type="button" onClick={() => set("status", s)} style={{
                                    background: form.status === s ? st.bg : "none",
                                    border: `1px solid ${form.status === s ? st.border : "var(--border)"}`,
                                    color: form.status === s ? st.color : "var(--text-muted)",
                                    borderRadius: 7, padding: "5px 11px", fontSize: 12, fontWeight: 600,
                                    cursor: "pointer", fontFamily: "inherit",
                                }}>{s}</button>
                            );
                        })}
                    </div>
                </div>
                <div>
                    <label style={labelStyle}>Visibility</label>
                    <div style={{ display: "flex", gap: 6 }}>
                        {[true, false].map(v => (
                            <button key={String(v)} type="button" onClick={() => set("is_visible", v)} style={{
                                background: form.is_visible === v ? (v ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.1)") : "none",
                                border: `1px solid ${form.is_visible === v ? (v ? "rgba(34,197,94,0.4)" : "rgba(239,68,68,0.3)") : "var(--border)"}`,
                                color: form.is_visible === v ? (v ? "#22c55e" : "#ef4444") : "var(--text-muted)",
                                borderRadius: 7, padding: "5px 14px", fontSize: 12, fontWeight: 600,
                                cursor: "pointer", fontFamily: "inherit",
                            }}>{v ? "👁 Visible" : "🙈 Hidden"}</button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tagline */}
            <div style={sectionStyle}>
                <label style={labelStyle}>Tagline *</label>
                <input value={form.tagline} onChange={e => set("tagline", e.target.value)} style={inputStyle} placeholder="Real-time medical image analysis at clinical scale" />
            </div>

            {/* Description */}
            <div style={sectionStyle}>
                <label style={labelStyle}>Full Description *</label>
                <textarea value={form.desc} onChange={e => set("desc", e.target.value)} rows={4} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.7 }} placeholder="Detailed description shown on the product detail page..." />
            </div>

            {/* Cover image */}
            <div style={sectionStyle}>
                <label style={labelStyle}>Cover Image</label>
                <ImageUploader
                    label="Upload product image (optional)"
                    preview={form.image}
                    onUpload={url => set("image", url || "")}
                />
            </div>

            {/* Metrics */}
            <div style={sectionStyle}>
                <label style={labelStyle}>Key Metrics</label>
                <div style={{ fontSize: 12, color: "var(--text-faint)", marginBottom: 8 }}>
                    One per line, format: <code style={{ background: "rgba(255,255,255,0.05)", padding: "1px 6px", borderRadius: 4 }}>value;label</code> — e.g. <code style={{ background: "rgba(255,255,255,0.05)", padding: "1px 6px", borderRadius: 4 }}>94%;Accuracy</code>
                </div>
                <textarea value={form.metrics_raw} onChange={e => set("metrics_raw", e.target.value)} rows={4} style={{ ...inputStyle, resize: "vertical", fontFamily: "monospace", fontSize: 13 }} placeholder={"94%;Accuracy\n<200ms;Latency\n5+;Organ Types\n12;Partner Clinics"} />
                {/* Live preview */}
                {form.metrics_raw && (
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
                        {parseMetrics(form.metrics_raw).map(([val, label], i) => (
                            <div key={i} style={{ background: "rgba(74,143,212,0.08)", border: "1px solid rgba(74,143,212,0.15)", borderRadius: 10, padding: "8px 14px", textAlign: "center", minWidth: 80 }}>
                                <div style={{ fontSize: 16, fontWeight: 800, color: "var(--blue)", fontFamily: "var(--font-display)" }}>{val}</div>
                                <div style={{ fontSize: 11, color: "var(--text-faint)" }}>{label}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Features */}
            <div style={sectionStyle}>
                <label style={labelStyle}>Features</label>
                <div style={{ fontSize: 12, color: "var(--text-faint)", marginBottom: 8 }}>One feature per line.</div>
                <textarea value={form.features_raw} onChange={e => set("features_raw", e.target.value)} rows={5} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.7 }} placeholder={"Multi-organ scan analysis (chest, cardiac, neuro)\nVisual attention maps for clinical review\nDICOM & HL7 FHIR integration ready"} />
            </div>

            {/* Use cases */}
            <div style={sectionStyle}>
                <label style={labelStyle}>Use Cases</label>
                <div style={{ fontSize: 12, color: "var(--text-faint)", marginBottom: 8 }}>One use case per line.</div>
                <textarea value={form.use_cases_raw} onChange={e => set("use_cases_raw", e.target.value)} rows={3} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.7 }} placeholder={"Radiology triage prioritization\nRemote diagnostics in low-resource settings"} />
            </div>

            {/* Tech stack */}
            <div style={sectionStyle}>
                <label style={labelStyle}>Tech Stack</label>
                <div style={{ fontSize: 12, color: "var(--text-faint)", marginBottom: 8 }}>Comma-separated.</div>
                <input value={form.tech_raw} onChange={e => set("tech_raw", e.target.value)} style={inputStyle} placeholder="PyTorch, FastAPI, DICOM, FHIR" />
                {form.tech_raw && (
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                        {parseTech(form.tech_raw).map(t => (
                            <span key={t} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--text-muted)", fontSize: 12, padding: "3px 10px", borderRadius: 6 }}>{t}</span>
                        ))}
                    </div>
                )}
            </div>

            {/* CTA */}
            <div style={{ ...sectionStyle, display: "grid", gridTemplateColumns: "1fr 2fr", gap: 12 }}>
                <div>
                    <label style={labelStyle}>CTA Button Label</label>
                    <input value={form.cta} onChange={e => set("cta", e.target.value)} style={inputStyle} placeholder="Request Demo" />
                </div>
                <div>
                    <label style={labelStyle}>CTA URL (optional)</label>
                    <input value={form.cta_url} onChange={e => set("cta_url", e.target.value)} style={inputStyle} placeholder="/contact or https://..." />
                </div>
            </div>

            {/* Order */}
            <div style={sectionStyle}>
                <label style={labelStyle}>Display Order</label>
                <input type="number" value={form.order_index} onChange={e => set("order_index", e.target.value)} style={{ ...inputStyle, width: 100 }} min={0} />
                <div style={{ fontSize: 12, color: "var(--text-faint)", marginTop: 4 }}>Lower number = shown first</div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 10, paddingTop: 4 }}>
                <button type="button" onClick={() => onSave(formToPayload(form))} disabled={saving} style={{
                    background: isNew ? "rgba(34,197,94,0.12)" : "var(--blue-dim)",
                    border: `1px solid ${isNew ? "rgba(34,197,94,0.3)" : "var(--border-blue)"}`,
                    color: isNew ? "#22c55e" : "var(--blue)",
                    borderRadius: 8, padding: "10px 22px", fontSize: 13, fontWeight: 700,
                    cursor: saving ? "not-allowed" : "pointer", fontFamily: "inherit",
                }}>
                    {saving ? "Saving..." : isNew ? "Create Product" : "Save Changes"}
                </button>
                <button type="button" onClick={onCancel} style={{ background: "none", border: "1px solid var(--border)", color: "var(--text-muted)", borderRadius: 8, padding: "10px 22px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                    Cancel
                </button>
            </div>

            <style>{`
                @media (max-width: 700px) {
                    .product-form-row1 { grid-template-columns: 1fr 1fr !important; }
                    .product-form-row2 { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </div>
    );
}

// ── Main AdminProducts page ───────────────────────────────────────────────────
export default function AdminProducts() {
    const { token } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState("all");       // all | visible | hidden
    const [sectorFilter, setSectorFilter] = useState("All");
    const [creating, setCreating] = useState(false);
    const [createSaving, setCreateSaving] = useState(false);
    const [editing, setEditing] = useState(null);      // product id
    const [saving, setSaving] = useState(null);
    const handleError = useSessionExpiry();

    useEffect(() => { load(); }, []);

    async function load() {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchAllProducts(token);
            const items = Array.isArray(data) ? data : data?.items ?? [];
            setProducts(items);
        } catch (err) {
            handleError(err, "Failed to load products.");
            setError("Failed to load products.");
        } finally {
            setLoading(false);
        }
    }

    const filtered = products.filter(p => {
        if (filter === "visible" && !p.is_visible) return false;
        if (filter === "hidden" && p.is_visible) return false;
        if (sectorFilter !== "All" && p.sector !== sectorFilter) return false;
        return true;
    });

    const visibleCount = products.filter(p => p.is_visible).length;
    const hiddenCount = products.filter(p => !p.is_visible).length;

    const handleCreate = async (payload) => {
        setCreateSaving(true);
        try {
            const created = await createProduct(token, payload);
            setProducts(ps => [created, ...ps]);
            setCreating(false);
        } catch (err) {
            alert(err.message || "Failed to create product.");
        } finally {
            setCreateSaving(false);
        }
    };

    const handleSaveEdit = async (id, payload) => {
        setSaving(id);
        try {
            const updated = await updateProduct(token, id, payload);
            setProducts(ps => ps.map(p => p.id === id ? { ...p, ...updated } : p));
            setEditing(null);
        } catch {
            alert("Failed to save.");
        } finally {
            setSaving(null);
        }
    };

    const handleToggleVisibility = async (product) => {
        setSaving(product.id);
        try {
            const updated = product.is_visible
                ? await hideProduct(token, product.id)
                : await showProduct(token, product.id);
            setProducts(ps => ps.map(p => p.id === product.id ? { ...p, ...updated } : p));
        } catch {
            alert("Failed to update visibility.");
        } finally {
            setSaving(null);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Permanently delete this product? This cannot be undone.")) return;
        try {
            await deleteProduct(token, id);
            setProducts(ps => ps.filter(p => p.id !== id));
        } catch {
            alert("Failed to delete product.");
        }
    };

    return (
        <div>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
                <div>
                    <h1 style={{ fontSize: 26, fontWeight: 800, color: "var(--text)", fontFamily: "var(--font-display)", marginBottom: 6 }}>Products</h1>
                    <div style={{ display: "flex", gap: 16, fontSize: 13 }}>
                        <span style={{ color: "#22c55e" }}>{visibleCount} visible</span>
                        <span style={{ color: "var(--text-faint)" }}>{hiddenCount} hidden</span>
                        <span style={{ color: "var(--text-faint)" }}>{products.length} total</span>
                    </div>
                </div>
                <button
                    onClick={() => { setCreating(c => !c); setEditing(null); }}
                    style={{
                        background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)",
                        color: "#22c55e", borderRadius: 10, padding: "11px 18px",
                        fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                    }}
                >
                    {creating ? "✕ Cancel" : "＋ New Product"}
                </button>
            </div>

            {/* Create form */}
            {creating && (
                <div style={{
                    background: "rgba(34,197,94,0.04)", border: "1px solid rgba(34,197,94,0.2)",
                    borderRadius: 18, padding: 28, marginBottom: 28,
                }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 20, fontFamily: "var(--font-display)" }}>
                        New Product
                    </div>
                    <ProductForm
                        initial={EMPTY_PRODUCT}
                        onSave={handleCreate}
                        onCancel={() => setCreating(false)}
                        saving={createSaving}
                        isNew
                    />
                </div>
            )}

            {/* Filters */}
            <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
                <div style={{ display: "flex", gap: 6 }}>
                    {[["all", `All (${products.length})`], ["visible", `Visible (${visibleCount})`], ["hidden", `Hidden (${hiddenCount})`]].map(([val, label]) => (
                        <button key={val} onClick={() => setFilter(val)} style={{
                            background: filter === val ? "var(--blue)" : "rgba(255,255,255,0.04)",
                            border: `1px solid ${filter === val ? "var(--blue)" : "var(--border)"}`,
                            color: filter === val ? "#fff" : "var(--text-muted)",
                            borderRadius: 99, padding: "7px 16px", fontSize: 12, fontWeight: 600,
                            cursor: "pointer", fontFamily: "inherit",
                        }}>{label}</button>
                    ))}
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                    {["All", ...SECTORS].map(s => (
                        <button key={s} onClick={() => setSectorFilter(s)} style={{
                            background: sectorFilter === s ? "rgba(74,143,212,0.15)" : "rgba(255,255,255,0.03)",
                            border: `1px solid ${sectorFilter === s ? "var(--blue)" : "var(--border)"}`,
                            color: sectorFilter === s ? "var(--blue)" : "var(--text-faint)",
                            borderRadius: 99, padding: "6px 14px", fontSize: 11, fontWeight: 600,
                            cursor: "pointer", fontFamily: "inherit",
                        }}>{s}</button>
                    ))}
                </div>
            </div>

            {/* Error */}
            {error && (
                <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 12, padding: "16px 20px", marginBottom: 24, color: "#ef4444", fontSize: 14 }}>
                    {error} <button onClick={load} style={{ background: "none", border: "none", color: "var(--blue)", cursor: "pointer", fontFamily: "inherit", fontSize: 13, marginLeft: 8 }}>Retry</button>
                </div>
            )}

            {/* Loading skeletons */}
            {loading ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {[1, 2, 3].map(i => (
                        <div key={i} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: 24, opacity: 0.5 }}>
                            <div style={{ height: 16, width: "40%", background: "var(--border)", borderRadius: 6, marginBottom: 10 }} />
                            <div style={{ height: 13, width: "60%", background: "var(--border)", borderRadius: 6 }} />
                        </div>
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-muted)" }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
                    <p>{products.length === 0 ? "No products yet. Create your first one above." : "No products match your filters."}</p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    {filtered.map(product => {
                        const st = STATUS_STYLES[product.status] || STATUS_STYLES["Coming Soon"];
                        const isEditing = editing === product.id;

                        return (
                            <div
                                key={product.id}
                                style={{
                                    background: "var(--bg-card)",
                                    border: `1px solid ${product.is_visible ? "var(--border)" : "rgba(239,68,68,0.2)"}`,
                                    borderRadius: 18, overflow: "hidden",
                                    opacity: product.is_visible ? 1 : 0.75,
                                }}
                            >
                                {/* Card header — always visible */}
                                <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
                                        {/* Left: icon + name + badges */}
                                        <div style={{ display: "flex", gap: 14, alignItems: "flex-start", flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: 32, flexShrink: 0 }}>{product.icon || "🔷"}</div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                                                    <span style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", fontFamily: "var(--font-display)" }}>{product.name}</span>
                                                    {product.version && <span style={{ fontSize: 11, color: "var(--text-faint)" }}>{product.version}</span>}
                                                    {/* Status badge */}
                                                    <span style={{ background: st.bg, border: `1px solid ${st.border}`, color: st.color, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99, letterSpacing: "0.05em" }}>
                                                        {product.status}
                                                    </span>
                                                    {/* Sector badge */}
                                                    <span style={{ background: `${SECTOR_COLORS[product.sector] || "#4A8FD4"}18`, color: SECTOR_COLORS[product.sector] || "#4A8FD4", border: `1px solid ${SECTOR_COLORS[product.sector] || "#4A8FD4"}33`, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99, letterSpacing: "0.05em" }}>
                                                        {product.sector}
                                                    </span>
                                                    {/* Visibility */}
                                                    {!product.is_visible && (
                                                        <span style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#ef4444", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99 }}>
                                                            Hidden
                                                        </span>
                                                    )}
                                                </div>
                                                {!isEditing && (
                                                    <div style={{ fontSize: 13.5, color: "var(--text-muted)", lineHeight: 1.5 }}>{product.tagline}</div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        {!isEditing && (
                                            <div style={{ display: "flex", gap: 8, flexShrink: 0, flexWrap: "wrap" }}>
                                                <button
                                                    onClick={() => { setEditing(product.id); setCreating(false); }}
                                                    style={{ background: "var(--blue-dim)", border: "1px solid var(--border-blue)", color: "var(--blue)", borderRadius: 8, padding: "8px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
                                                >
                                                    ✏️ Edit
                                                </button>
                                                <button
                                                    onClick={() => handleToggleVisibility(product)}
                                                    disabled={saving === product.id}
                                                    style={{
                                                        background: product.is_visible ? "rgba(239,68,68,0.08)" : "rgba(34,197,94,0.1)",
                                                        border: `1px solid ${product.is_visible ? "rgba(239,68,68,0.25)" : "rgba(34,197,94,0.3)"}`,
                                                        color: product.is_visible ? "#ef4444" : "#22c55e",
                                                        borderRadius: 8, padding: "8px 14px", fontSize: 12, fontWeight: 600,
                                                        cursor: saving === product.id ? "not-allowed" : "pointer", fontFamily: "inherit",
                                                    }}
                                                >
                                                    {saving === product.id ? "..." : product.is_visible ? "🙈 Hide" : "👁 Show"}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", borderRadius: 8, padding: "8px 10px", fontSize: 12, cursor: "pointer" }}
                                                >
                                                    🗑
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Collapsed view — quick metrics */}
                                {!isEditing && (
                                    <div style={{ padding: "14px 24px", display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center" }}>
                                        {(product.metrics || []).slice(0, 4).map(([val, label], i) => (
                                            <div key={i} style={{ textAlign: "center" }}>
                                                <div style={{ fontSize: 15, fontWeight: 800, color: "var(--blue)", fontFamily: "var(--font-display)" }}>{val}</div>
                                                <div style={{ fontSize: 10, color: "var(--text-faint)" }}>{label}</div>
                                            </div>
                                        ))}
                                        {(product.tech || []).slice(0, 4).map(t => (
                                            <span key={t} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "var(--text-faint)", fontSize: 11, padding: "2px 8px", borderRadius: 5 }}>{t}</span>
                                        ))}
                                        {product.features?.length > 0 && (
                                            <span style={{ fontSize: 12, color: "var(--text-faint)", marginLeft: "auto" }}>
                                                {product.features.length} feature{product.features.length !== 1 ? "s" : ""} · {product.use_cases?.length || 0} use cases
                                            </span>
                                        )}
                                    </div>
                                )}

                                {/* Inline edit form */}
                                {isEditing && (
                                    <div style={{ padding: 24 }}>
                                        <ProductForm
                                            initial={productToForm(product)}
                                            onSave={(payload) => handleSaveEdit(product.id, payload)}
                                            onCancel={() => setEditing(null)}
                                            saving={saving === product.id}
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
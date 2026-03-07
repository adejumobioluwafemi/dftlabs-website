// src/components/Products.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { APPS } from "../data/content";
import SectionHeader from "./ui/SectionHeader";
import Tag from "./ui/Tag";

const API_BASE = import.meta.env.VITE_API_URL || "https://dftlabs-backend.onrender.com";

const STATUS_COLORS = {
    "Live": "#22c55e",
    "Beta": "#f59e0b",
    "Coming Soon": "#8b5cf6",
};

function normalizeProduct(p) {
    return {
        slug: p.slug || p.id || p.name?.toLowerCase().replace(/\s+/g, "-"),
        name: p.name,
        sector: p.sector,
        status: p.status,
        statusColor: STATUS_COLORS[p.status] || "#4A8FD4",
        desc: p.desc || p.tagline || "",
        icon: p.icon || "🔷",
    };
}

function normalizeStatic(a) {
    return {
        slug: a.id || a.name?.toLowerCase().replace(/\s+/g, "-"),
        name: a.name,
        sector: a.sector,
        status: a.status,
        statusColor: a.statusColor || STATUS_COLORS[a.status] || "#4A8FD4",
        desc: a.desc || a.tagline || "",
        icon: a.icon || "🔷",
    };
}

function AppCard({ slug, name, sector, status, statusColor, desc, icon, onClick }) {
    return (
        <div
            onClick={() => onClick(slug)}
            style={{
                background: "var(--bg-card)", border: "1px solid var(--border)",
                borderRadius: 16, padding: 24, transition: "all 0.3s", cursor: "pointer",
            }}
            onMouseEnter={e => {
                e.currentTarget.style.borderColor = "rgba(74,143,212,0.4)";
                e.currentTarget.style.background = "rgba(74,143,212,0.06)";
                e.currentTarget.style.transform = "translateY(-3px)";
            }}
            onMouseLeave={e => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.background = "var(--bg-card)";
                e.currentTarget.style.transform = "translateY(0)";
            }}
        >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 26 }}>{icon}</span>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-display)" }}>{name}</div>
                </div>
                <Tag label={status} color={statusColor} />
            </div>
            <div style={{ fontSize: 12, color: "var(--blue)", fontWeight: 600, marginBottom: 10, letterSpacing: "0.06em" }}>
                {sector.toUpperCase()}
            </div>
            <div style={{ fontSize: 13.5, color: "var(--text-muted)", lineHeight: 1.7 }}>{desc}</div>
            <button
                style={{
                    marginTop: 20,
                    background: "rgba(74,143,212,0.12)",
                    border: "1px solid var(--border-blue)",
                    color: "var(--blue)", borderRadius: 8,
                    padding: "8px 18px", fontSize: 12, fontWeight: 600,
                    cursor: "pointer", letterSpacing: "0.05em",
                    fontFamily: "inherit",
                }}
            >
                Learn More →
            </button>
        </div>
    );
}

function SkeletonCard() {
    return (
        <div style={{
            background: "var(--bg-card)", border: "1px solid var(--border)",
            borderRadius: 16, padding: 24, opacity: 0.5,
        }}>
            <div style={{ height: 16, width: "60%", background: "var(--border)", borderRadius: 6, marginBottom: 12 }} />
            <div style={{ height: 12, width: "30%", background: "var(--border)", borderRadius: 5, marginBottom: 14 }} />
            <div style={{ height: 13, background: "var(--border)", borderRadius: 5, marginBottom: 6 }} />
            <div style={{ height: 13, width: "80%", background: "var(--border)", borderRadius: 5 }} />
            <div style={{ height: 32, width: 110, background: "var(--border)", borderRadius: 8, marginTop: 20 }} />
        </div>
    );
}

export default function Products() {
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch(`${API_BASE}/api/products/?limit=6`);
                if (!res.ok) throw new Error();
                const data = await res.json();
                const items = Array.isArray(data) ? data : data?.items ?? [];
                setApps(items.length > 0 ? items.map(normalizeProduct) : APPS.map(normalizeStatic));
            } catch {
                setApps(APPS.map(normalizeStatic));
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    return (
        <div style={{ position: "relative", zIndex: 1 }}>
            <div id="products" className="section-wrapper">
                <SectionHeader
                    eyebrow="Our Products"
                    title="Apps & Platforms"
                    sub="From diagnostics to decision support — each tool built on rigorous ML engineering."
                />
                <div className="grid-3">
                    {loading
                        ? [1, 2, 3].map(i => <SkeletonCard key={i} />)
                        : apps.map(a => (
                            <AppCard
                                key={a.slug}
                                {...a}
                                onClick={(slug) => navigate(`/products/${slug}`)}
                            />
                        ))
                    }
                </div>
                <div style={{ textAlign: "center", marginTop: 48 }}>
                    <OutlineBtn onClick={() => navigate("/products")}>View All Products →</OutlineBtn>
                </div>
            </div>
        </div>
    );
}

function OutlineBtn({ children, onClick }) {
    return (
        <button
            onClick={onClick}
            style={{
                background: "none", border: "1px solid var(--border-blue)",
                color: "var(--blue)", borderRadius: 12,
                padding: "13px 36px", fontSize: 14, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--blue-dim)"}
            onMouseLeave={e => e.currentTarget.style.background = "none"}
        >
            {children}
        </button>
    );
}
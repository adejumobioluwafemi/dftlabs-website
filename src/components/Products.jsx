import { APPS } from "../data/content";
import SectionHeader from "./ui/SectionHeader";
import Tag from "./ui/Tag";

function AppCard({ name, sector, status, statusColor, desc }) {
    return (
        <div
            style={{
                background: "var(--bg-card)", border: "1px solid var(--border)",
                borderRadius: 16, padding: 24, transition: "all 0.3s",
            }}
            onMouseEnter={e => {
                e.currentTarget.style.borderColor = "rgba(74,143,212,0.4)";
                e.currentTarget.style.background = "rgba(74,143,212,0.06)";
            }}
            onMouseLeave={e => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.background = "var(--bg-card)";
            }}
        >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-display)" }}>{name}</div>
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
                }}
            >
                Learn More →
            </button>
        </div>
    );
}

export default function Products() {
    return (
        <div style={{ position: "relative", zIndex: 1 }}>
            <div id="products" className="section-wrapper">
                <SectionHeader
                    eyebrow="Our Products"
                    title="Apps & Platforms"
                    sub="From diagnostics to decision support — each tool built on rigorous ML engineering."
                />
                <div className="grid-3">
                    {APPS.map(a => <AppCard key={a.name} {...a} />)}
                </div>
                <div style={{ textAlign: "center", marginTop: 48 }}>
                    <OutlineBtn>View All Products →</OutlineBtn>
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
import { BLOG_POSTS } from "../data/content";
import SectionHeader from "./ui/SectionHeader";
import Tag from "./ui/Tag";

const TAG_COLORS = {
    "Research Digest": "#4A8FD4",
    "Opinion": "#f59e0b",
    "Announcement": "#22c55e",
};

export default function Blog() {
    return (
        <div style={{
            background: "rgba(255,255,255,0.015)",
            borderTop: "1px solid var(--border)",
            borderBottom: "1px solid var(--border)",
            position: "relative", zIndex: 1,
        }}>
            <div id="blog" className="section-wrapper">
                <SectionHeader
                    eyebrow="Insights & Research"
                    title="From the DFT Labs Blog"
                    sub="Weekly AI research digests, opinions, and announcements from our team."
                />
                <div className="grid-3">
                    {BLOG_POSTS.map((p, i) => (
                        <div
                            key={i}
                            style={{
                                background: "var(--bg-card)", border: "1px solid var(--border)",
                                borderRadius: 16, padding: 24, cursor: "pointer", transition: "all 0.3s",
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.borderColor = "rgba(74,143,212,0.4)";
                                e.currentTarget.style.transform = "translateY(-4px)";
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.borderColor = "var(--border)";
                                e.currentTarget.style.transform = "translateY(0)";
                            }}
                        >
                            <Tag label={p.tag} color={TAG_COLORS[p.tag] || "var(--blue)"} />
                            <div style={{
                                fontSize: 16, fontWeight: 600, color: "var(--text)",
                                margin: "14px 0 12px", lineHeight: 1.5,
                                fontFamily: "var(--font-display)",
                            }}>
                                {p.title}
                            </div>
                            <div style={{ fontSize: 12, color: "var(--text-faint)" }}>
                                {p.date} · {p.read} read
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ textAlign: "center", marginTop: 48 }}>
                    <button style={{
                        background: "none", border: "1px solid var(--border-blue)",
                        color: "var(--blue)", borderRadius: 12,
                        padding: "13px 36px", fontSize: 14, fontWeight: 600,
                        cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
                    }}
                        onMouseEnter={e => e.currentTarget.style.background = "var(--blue-dim)"}
                        onMouseLeave={e => e.currentTarget.style.background = "none"}>
                        Read All Posts →
                    </button>
                </div>
            </div>
        </div>
    );
}
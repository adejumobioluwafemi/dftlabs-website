import { useState } from "react";
import { Link } from "react-router-dom";
import { ALL_BLOG_POSTS } from "../data/content";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Tag from "../components/ui/Tag";
import CircuitBackground from "../components/CircuitBackground";

const TAG_COLORS = {
    "Research Digest": "#4A8FD4",
    "Opinion": "#f59e0b",
    "Announcement": "#22c55e",
    "Technical": "#8b5cf6",
};

const ALL_TAGS = ["All", ...Object.keys(TAG_COLORS)];

export default function BlogPage() {
    const [activeTag, setActiveTag] = useState("All");
    const [search, setSearch] = useState("");

    const filtered = ALL_BLOG_POSTS.filter(p => {
        const matchTag = activeTag === "All" || p.tag === activeTag;
        const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.excerpt.toLowerCase().includes(search.toLowerCase());
        return matchTag && matchSearch;
    });

    return (
        <>
            <CircuitBackground />
            <Navbar />
            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px 100px", position: "relative", zIndex: 1 }}>

                {/* Header */}
                <div style={{ marginBottom: 56, textAlign: "center" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--blue)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 14 }}>
                        Insights & Research
                    </div>
                    <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 800, color: "var(--text)", fontFamily: "var(--font-display)", marginBottom: 16 }}>
                        DFT Labs Blog
                    </h1>
                    <p style={{ fontSize: 16, color: "var(--text-muted)", maxWidth: 520, margin: "0 auto" }}>
                        Weekly research digests, opinions, and product announcements from our team.
                    </p>
                </div>

                {/* Search + Filter */}
                <div style={{ display: "flex", gap: 16, marginBottom: 48, flexWrap: "wrap", alignItems: "center" }}>
                    <input
                        placeholder="Search posts..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{
                            flex: 1, minWidth: 220,
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid var(--border)", borderRadius: 10,
                            padding: "11px 16px", color: "var(--text)",
                            fontSize: 14, outline: "none", fontFamily: "inherit",
                        }}
                        onFocus={e => e.target.style.borderColor = "var(--blue)"}
                        onBlur={e => e.target.style.borderColor = "var(--border)"}
                    />
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {ALL_TAGS.map(tag => (
                            <button
                                key={tag}
                                onClick={() => setActiveTag(tag)}
                                style={{
                                    background: activeTag === tag ? "var(--blue)" : "rgba(255,255,255,0.04)",
                                    border: `1px solid ${activeTag === tag ? "var(--blue)" : "var(--border)"}`,
                                    color: activeTag === tag ? "#fff" : "var(--text-muted)",
                                    borderRadius: 99, padding: "8px 18px",
                                    fontSize: 13, fontWeight: 600,
                                    cursor: "pointer", fontFamily: "inherit",
                                    transition: "all 0.2s",
                                }}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Featured Post */}
                {activeTag === "All" && search === "" && (
                    <Link to={`/blog/${filtered[0].slug}`} style={{ textDecoration: "none", display: "block", marginBottom: 48 }}>
                        <div style={{
                            background: "rgba(74,143,212,0.06)",
                            border: "1px solid rgba(74,143,212,0.25)",
                            borderRadius: 20, padding: "36px 40px",
                            transition: "all 0.3s",
                        }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(74,143,212,0.5)"}
                            onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(74,143,212,0.25)"}>
                            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
                                <Tag label={filtered[0].tag} color={TAG_COLORS[filtered[0].tag]} />
                                <span style={{ fontSize: 12, color: "var(--text-faint)" }}>FEATURED</span>
                            </div>
                            <h2 style={{ fontSize: "clamp(20px, 3vw, 30px)", fontWeight: 800, color: "var(--text)", fontFamily: "var(--font-display)", marginBottom: 14, lineHeight: 1.3 }}>
                                {filtered[0].title}
                            </h2>
                            <p style={{ fontSize: 15, color: "var(--text-muted)", lineHeight: 1.8, maxWidth: 720, marginBottom: 20 }}>
                                {filtered[0].excerpt}
                            </p>
                            <div style={{ fontSize: 13, color: "var(--text-faint)" }}>
                                {filtered[0].date} · {filtered[0].read} read · {filtered[0].author}
                            </div>
                        </div>
                    </Link>
                )}

                {/* Post Grid */}
                {filtered.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-faint)" }}>
                        No posts match your search.
                    </div>
                ) : (
                    <div className="grid-3">
                        {(activeTag === "All" && search === "" ? filtered.slice(1) : filtered).map(post => (
                            <Link key={post.slug} to={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
                                <div style={{
                                    background: "var(--bg-card)", border: "1px solid var(--border)",
                                    borderRadius: 16, padding: 24, height: "100%",
                                    cursor: "pointer", transition: "all 0.3s",
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(74,143,212,0.4)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                                    <Tag label={post.tag} color={TAG_COLORS[post.tag] || "var(--blue)"} />
                                    <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", margin: "14px 0 10px", lineHeight: 1.5, fontFamily: "var(--font-display)" }}>
                                        {post.title}
                                    </div>
                                    <p style={{ fontSize: 13.5, color: "var(--text-muted)", lineHeight: 1.7, marginBottom: 16 }}>
                                        {post.excerpt}
                                    </p>
                                    <div style={{ fontSize: 12, color: "var(--text-faint)" }}>
                                        {post.date} · {post.read} read
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}
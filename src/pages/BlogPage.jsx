import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchPublishedPosts } from "../api/blog";
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

function PostSkeleton() {
    return (
        <div style={{
            background: "var(--bg-card)", border: "1px solid var(--border)",
            borderRadius: 16, overflow: "hidden", animation: "pulse 1.5s ease-in-out infinite",
        }}>
            <div style={{ height: 200, background: "var(--border)" }} />
            <div style={{ padding: 24 }}>
                <div style={{ height: 12, width: 80, background: "var(--border)", borderRadius: 6, marginBottom: 12 }} />
                <div style={{ height: 20, background: "var(--border)", borderRadius: 6, marginBottom: 8 }} />
                <div style={{ height: 20, width: "70%", background: "var(--border)", borderRadius: 6, marginBottom: 16 }} />
                <div style={{ height: 14, background: "var(--border)", borderRadius: 6, marginBottom: 6 }} />
                <div style={{ height: 14, width: "85%", background: "var(--border)", borderRadius: 6 }} />
            </div>
        </div>
    );
}

export default function BlogPage() {
    const [activeTag, setActiveTag] = useState("All");
    const [search, setSearch] = useState("");
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);

        const timer = setTimeout(async () => {
            try {
                const data = await fetchPublishedPosts({ tag: activeTag, search });
                if (!cancelled) setPosts(data);
                // eslint-disable-next-line no-unused-vars
            } catch (err) {
                if (!cancelled) setError("Failed to load posts. Please try again.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }, search ? 300 : 0); // debounce search

        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [activeTag, search]);

    return (
        <>
            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>
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
                    />
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {ALL_TAGS.map(tag => (
                            <button
                                key={tag}
                                onClick={() => setActiveTag(tag)}
                                style={{
                                    padding: "8px 16px", borderRadius: 20, fontSize: 13, fontWeight: 600,
                                    cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
                                    background: activeTag === tag ? "var(--blue)" : "rgba(255,255,255,0.04)",
                                    color: activeTag === tag ? "#fff" : "var(--text-muted)",
                                    border: activeTag === tag ? "1px solid var(--blue)" : "1px solid var(--border)",
                                }}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div style={{ textAlign: "center", padding: "60px 24px", color: "var(--text-muted)" }}>
                        <div style={{ fontSize: 40, marginBottom: 16 }}>⚠️</div>
                        <p>{error}</p>
                        <button
                            onClick={() => { setError(null); setLoading(true); }}
                            style={{ marginTop: 16, padding: "10px 24px", background: "var(--blue)", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* Skeleton loading */}
                {loading && !error && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24 }}>
                        {[1, 2, 3, 4, 5, 6].map(i => <PostSkeleton key={i} />)}
                    </div>
                )}

                {/* Empty state */}
                {!loading && !error && posts.length === 0 && (
                    <div style={{ textAlign: "center", padding: "80px 24px", color: "var(--text-muted)" }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
                        <h3 style={{ color: "var(--text)", marginBottom: 8 }}>No posts found</h3>
                        <p style={{ fontSize: 14 }}>
                            {search || activeTag !== "All"
                                ? "Try adjusting your search or filter."
                                : "New research digests are published every Monday."}
                        </p>
                    </div>
                )}

                {/* Posts grid */}
                {!loading && !error && posts.length > 0 && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24 }}>
                        {posts.map(post => (
                            <Link key={post.slug} to={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
                                <article
                                    style={{
                                        background: "var(--bg-card)", border: "1px solid var(--border)",
                                        borderRadius: 16, overflow: "hidden", height: "100%",
                                        transition: "all 0.25s", cursor: "pointer",
                                        display: "flex", flexDirection: "column",
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.borderColor = "rgba(74,143,212,0.4)";
                                        e.currentTarget.style.transform = "translateY(-3px)";
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.borderColor = "var(--border)";
                                        e.currentTarget.style.transform = "translateY(0)";
                                    }}
                                >
                                    {post.image ? (
                                        <div style={{ height: 200, overflow: "hidden" }}>
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                                            />
                                        </div>
                                    ) : (
                                        <div style={{
                                            height: 200, background: "linear-gradient(135deg, rgba(74,143,212,0.15), rgba(74,143,212,0.05))",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                        }}>
                                            <div style={{ fontSize: 48, opacity: 0.4 }}>
                                                {post.tag === "Research Digest" ? "🔬" : post.tag === "Opinion" ? "💡" : post.tag === "Announcement" ? "📢" : "⚙️"}
                                            </div>
                                        </div>
                                    )}
                                    <div style={{ padding: 24, flex: 1, display: "flex", flexDirection: "column" }}>
                                        <div style={{ display: "flex", gap: 8, marginBottom: 14, alignItems: "center", justifyContent: "space-between" }}>
                                            <Tag label={post.tag} color={TAG_COLORS[post.tag] || "var(--blue)"} />
                                            <span style={{ fontSize: 12, color: "var(--text-faint)" }}>{post.read} read</span>
                                        </div>
                                        <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-display)", lineHeight: 1.35, marginBottom: 12, flex: 1 }}>
                                            {post.title}
                                        </h3>
                                        <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.7, marginBottom: 16, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                            {post.excerpt}
                                        </p>
                                        <div style={{ fontSize: 12, color: "var(--text-faint)", display: "flex", justifyContent: "space-between" }}>
                                            <span>{post.date}</span>
                                            <span>{post.author}</span>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}
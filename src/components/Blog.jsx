// src/components/Blog.jsx
// Homepage preview section — pulls latest 3 posts from live API
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPublishedPosts } from "../api/blog";
import { BLOG_POSTS } from "../data/content";
import SectionHeader from "./ui/SectionHeader";
import Tag from "./ui/Tag";

const TAG_COLORS = {
    "Research Digest": "#4A8FD4",
    "Opinion": "#f59e0b",
    "Announcement": "#22c55e",
    "Technical": "#8b5cf6",
};

export default function Blog() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPublishedPosts({ limit: 3, status: "published" })
            .then(data => {
                const items = Array.isArray(data) ? data : data?.items ?? data?.posts ?? [];
                setPosts(items.length > 0 ? items.slice(0, 3) : BLOG_POSTS.slice(0, 3));
            })
            .catch(() => setPosts(BLOG_POSTS.slice(0, 3)))
            .finally(() => setLoading(false));
    }, []);

    const handleClick = (post) => {
        const slug = post.slug || post.id;
        if (slug) navigate(`/blog/${slug}`);
    };

    const displayPosts = loading
        ? Array(3).fill(null) // skeleton placeholders
        : posts;

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
                    {displayPosts.map((p, i) => (
                        <div
                            key={p?.slug ?? p?.id ?? i}
                            onClick={() => p && handleClick(p)}
                            style={{
                                background: "var(--bg-card)", border: "1px solid var(--border)",
                                borderRadius: 16, padding: 24,
                                cursor: loading ? "default" : "pointer",
                                transition: "all 0.3s",
                                opacity: loading ? 0.5 : 1,
                            }}
                            onMouseEnter={e => {
                                if (!loading) {
                                    e.currentTarget.style.borderColor = "rgba(74,143,212,0.4)";
                                    e.currentTarget.style.transform = "translateY(-4px)";
                                }
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.borderColor = "var(--border)";
                                e.currentTarget.style.transform = "translateY(0)";
                            }}
                        >
                            {/* Image */}
                            {p?.image && (
                                <div style={{
                                    height: 140, borderRadius: 10, marginBottom: 16,
                                    backgroundImage: `url(${p.image})`,
                                    backgroundSize: "cover", backgroundPosition: "center",
                                    border: "1px solid var(--border)",
                                }} />
                            )}

                            {loading ? (
                                <>
                                    <div style={{ height: 22, background: "rgba(255,255,255,0.06)", borderRadius: 6, marginBottom: 14, width: "40%" }} />
                                    <div style={{ height: 18, background: "rgba(255,255,255,0.06)", borderRadius: 6, marginBottom: 8 }} />
                                    <div style={{ height: 18, background: "rgba(255,255,255,0.04)", borderRadius: 6, width: "70%" }} />
                                </>
                            ) : (
                                <>
                                    <Tag label={p.tag} color={TAG_COLORS[p.tag] || "var(--blue)"} />
                                    <div style={{
                                        fontSize: 16, fontWeight: 600, color: "var(--text)",
                                        margin: "14px 0 12px", lineHeight: 1.5,
                                        fontFamily: "var(--font-display)",
                                    }}>
                                        {p.title}
                                    </div>
                                    {p.excerpt && (
                                        <div style={{
                                            fontSize: 13, color: "var(--text-muted)",
                                            lineHeight: 1.6, marginBottom: 12,
                                            display: "-webkit-box",
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: "vertical",
                                            overflow: "hidden",
                                        }}>
                                            {p.excerpt}
                                        </div>
                                    )}
                                    <div style={{ fontSize: 12, color: "var(--text-faint)" }}>
                                        {p.date || p.created_at?.slice(0, 10)} · {p.read || p.read_time || "5 min"} read
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
                <div style={{ textAlign: "center", marginTop: 48 }}>
                    <button
                        onClick={() => navigate("/blog")}
                        style={{
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
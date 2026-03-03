import { useParams, Link, useNavigate } from "react-router-dom";
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

// Very simple markdown-like renderer for our content
function renderContent(content) {
    return content.split("\n\n").map((block, i) => {
        if (block.startsWith("## ")) {
            return (
                <h2 key={i} style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", fontFamily: "var(--font-display)", margin: "36px 0 16px" }}>
                    {block.replace("## ", "")}
                </h2>
            );
        }
        if (block.startsWith("1. ") || block.startsWith("2. ")) {
            const items = block.split("\n");
            return (
                <ol key={i} style={{ paddingLeft: 24, margin: "16px 0" }}>
                    {items.map((item, j) => (
                        <li key={j} style={{ fontSize: 16, color: "var(--text-muted)", lineHeight: 1.9, marginBottom: 8 }}>
                            {item.replace(/^\d+\.\s/, "")}
                        </li>
                    ))}
                </ol>
            );
        }
        return (
            <p key={i} style={{ fontSize: 16, color: "var(--text-muted)", lineHeight: 1.9, marginBottom: 20 }}>
                {block}
            </p>
        );
    });
}

export default function BlogPost() {
    const { slug } = useParams();
    // eslint-disable-next-line no-unused-vars
    const navigate = useNavigate();
    const post = ALL_BLOG_POSTS.find(p => p.slug === slug);

    if (!post) {
        return (
            <>
                <Navbar />
                <div style={{ textAlign: "center", padding: "120px 24px", position: "relative", zIndex: 1 }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>📄</div>
                    <h1 style={{ color: "var(--text)", fontFamily: "var(--font-display)", marginBottom: 16 }}>Post not found</h1>
                    <Link to="/blog" style={{ color: "var(--blue)" }}>← Back to Blog</Link>
                </div>
                <Footer />
            </>
        );
    }

    const currentIndex = ALL_BLOG_POSTS.findIndex(p => p.slug === slug);
    const prev = ALL_BLOG_POSTS[currentIndex + 1];
    const next = ALL_BLOG_POSTS[currentIndex - 1];

    return (
        <>
            <CircuitBackground />
            <Navbar />
            <div style={{ position: "relative", zIndex: 1 }}>
                {/* Hero */}
                <div style={{
                    maxWidth: 800, margin: "0 auto",
                    padding: "60px 24px 0",
                    textAlign: "center",
                }}>
                    <Link to="/blog" style={{ color: "var(--blue)", fontSize: 13, fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 32 }}>
                        ← Back to Blog
                    </Link>
                    <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 24 }}>
                        <Tag label={post.tag} color={TAG_COLORS[post.tag] || "var(--blue)"} />
                    </div>
                    <h1 style={{ fontSize: "clamp(26px, 4vw, 46px)", fontWeight: 800, color: "var(--text)", fontFamily: "var(--font-display)", lineHeight: 1.2, marginBottom: 20 }}>
                        {post.title}
                    </h1>
                    <div style={{ fontSize: 14, color: "var(--text-faint)", marginBottom: 48 }}>
                        {post.date} · {post.read} read · By {post.author}
                    </div>
                </div>

                {/* Divider */}
                <div style={{ maxWidth: 800, margin: "0 auto 48px", padding: "0 24px" }}>
                    <div style={{ height: 1, background: "linear-gradient(90deg, transparent, var(--blue), transparent)" }} />
                </div>

                {/* Content */}
                <article style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px 80px" }}>

                    {post.image && (
                        <div style={{ marginBottom: 36, borderRadius: 16, overflow: "hidden" }}>
                            <img
                                src={post.image}
                                alt={post.title}
                                style={{ width: "100%", height: 380, objectFit: "cover", display: "block" }}
                            />
                        </div>
                    )}
                    <div style={{ fontSize: 18, color: "var(--text-muted)", lineHeight: 1.9, marginBottom: 32, fontStyle: "italic", borderLeft: "3px solid var(--blue)", paddingLeft: 20 }}>
                        {post.excerpt}
                    </div>
                    {renderContent(post.content)}

                    {/* Share / Tags */}
                    <div style={{ marginTop: 56, paddingTop: 32, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
                        <Tag label={post.tag} color={TAG_COLORS[post.tag] || "var(--blue)"} />
                        <div style={{ display: "flex", gap: 10 }}>
                            {["Share on X", "Copy Link"].map(action => (
                                <button key={action} style={{
                                    background: "var(--blue-dim)", border: "1px solid var(--border-blue)",
                                    color: "var(--blue)", borderRadius: 8, padding: "8px 16px",
                                    fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                                }}>
                                    {action}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Prev / Next */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 48 }}>
                        {prev ? (
                            <Link to={`/blog/${prev.slug}`} style={{ textDecoration: "none" }}>
                                <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 20, transition: "all 0.2s" }}
                                    onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(74,143,212,0.4)"}
                                    onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
                                    <div style={{ fontSize: 11, color: "var(--text-faint)", marginBottom: 8, letterSpacing: "0.06em" }}>← PREVIOUS</div>
                                    <div style={{ fontSize: 14, color: "var(--text)", fontWeight: 600, lineHeight: 1.4 }}>{prev.title}</div>
                                </div>
                            </Link>
                        ) : <div />}
                        {next ? (
                            <Link to={`/blog/${next.slug}`} style={{ textDecoration: "none" }}>
                                <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 20, textAlign: "right", transition: "all 0.2s" }}
                                    onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(74,143,212,0.4)"}
                                    onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
                                    <div style={{ fontSize: 11, color: "var(--text-faint)", marginBottom: 8, letterSpacing: "0.06em" }}>NEXT →</div>
                                    <div style={{ fontSize: 14, color: "var(--text)", fontWeight: 600, lineHeight: 1.4 }}>{next.title}</div>
                                </div>
                            </Link>
                        ) : <div />}
                    </div>
                </article>
            </div>
            <Footer />
        </>
    );
}
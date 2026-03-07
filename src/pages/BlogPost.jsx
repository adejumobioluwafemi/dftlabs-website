import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchPostBySlug, fetchPublishedPosts } from "../api/blog";
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

// Replace your existing renderContent function in BlogPost.jsx with this one.
// It adds support for:
//   - Inline images:  ![alt text](https://url)
//   - Links:          [link text](https://url)
//   - Bold:           **text**
//   - Italic:         *text*
//   - Blockquotes:    > text
//   - Code blocks:    ```code```

function renderInline(text) {
    // Bold + italic + links inline
    const parts = [];
    const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|\[(.+?)\]\((https?:\/\/.+?)\))/g;
    let last = 0;
    let match;
    while ((match = regex.exec(text)) !== null) {
        if (match.index > last) parts.push(text.slice(last, match.index));
        if (match[0].startsWith("**")) {
            parts.push(<strong key={match.index} style={{ color: "var(--text)", fontWeight: 700 }}>{match[2]}</strong>);
        } else if (match[0].startsWith("*")) {
            parts.push(<em key={match.index}>{match[3]}</em>);
        } else if (match[0].startsWith("[")) {
            parts.push(<a key={match.index} href={match[5]} target="_blank" rel="noreferrer" style={{ color: "var(--blue)", textDecoration: "underline" }}>{match[4]}</a>);
        }
        last = match.index + match[0].length;
    }
    if (last < text.length) parts.push(text.slice(last));
    return parts.length > 0 ? parts : text;
}

function renderContent(content) {
    if (!content) return null;

    // Handle fenced code blocks first (multi-line)
    const codeBlockRegex = /```[\s\S]*?```/g;
    const blocks = [];
    let lastIndex = 0;
    let cbMatch;

    while ((cbMatch = codeBlockRegex.exec(content)) !== null) {
        if (cbMatch.index > lastIndex) {
            blocks.push({ type: "text", value: content.slice(lastIndex, cbMatch.index) });
        }
        blocks.push({ type: "code", value: cbMatch[0].replace(/^```\w*\n?/, "").replace(/```$/, "") });
        lastIndex = cbMatch.index + cbMatch[0].length;
    }
    if (lastIndex < content.length) {
        blocks.push({ type: "text", value: content.slice(lastIndex) });
    }

    const elements = [];
    let key = 0;

    for (const block of blocks) {
        if (block.type === "code") {
            elements.push(
                <pre key={key++} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)", borderRadius: 10, padding: "16px 20px", overflowX: "auto", margin: "20px 0" }}>
                    <code style={{ fontSize: 13, color: "#7CB9E8", fontFamily: "monospace", lineHeight: 1.7 }}>{block.value.trim()}</code>
                </pre>
            );
            continue;
        }

        // Process text blocks paragraph by paragraph
        const paragraphs = block.value.split("\n\n");
        for (const para of paragraphs) {
            const trimmed = para.trim();
            if (!trimmed) continue;

            // Inline image: ![alt](url)
            if (/^!\[.*?\]\(https?:\/\/.+?\)$/.test(trimmed)) {
                const altMatch = trimmed.match(/^!\[(.*?)\]/);
                const urlMatch = trimmed.match(/\((https?:\/\/.+?)\)$/);
                if (urlMatch) {
                    elements.push(
                        <figure key={key++} style={{ margin: "28px 0" }}>
                            <img
                                src={urlMatch[1]}
                                alt={altMatch?.[1] || ""}
                                style={{ width: "100%", borderRadius: 12, display: "block", border: "1px solid var(--border)" }}
                            />
                            {altMatch?.[1] && altMatch[1] !== "image" && (
                                <figcaption style={{ fontSize: 13, color: "var(--text-faint)", textAlign: "center", marginTop: 8 }}>{altMatch[1]}</figcaption>
                            )}
                        </figure>
                    );
                    continue;
                }
            }

            if (trimmed.startsWith("## ")) {
                elements.push(<h2 key={key++} style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", fontFamily: "var(--font-display)", margin: "36px 0 16px" }}>{trimmed.replace("## ", "")}</h2>);
                continue;
            }
            if (trimmed.startsWith("### ")) {
                elements.push(<h3 key={key++} style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-display)", margin: "28px 0 12px" }}>{trimmed.replace("### ", "")}</h3>);
                continue;
            }
            if (trimmed.startsWith("> ")) {
                elements.push(
                    <blockquote key={key++} style={{ borderLeft: "3px solid var(--blue)", paddingLeft: 20, margin: "20px 0", color: "var(--text-muted)", fontStyle: "italic" }}>
                        {renderInline(trimmed.replace(/^> /gm, ""))}
                    </blockquote>
                );
                continue;
            }
            if (trimmed.startsWith("- ") || /^\d+\.\s/.test(trimmed)) {
                const items = trimmed.split("\n").filter(Boolean);
                const isOrdered = /^\d+\./.test(items[0]);
                const ListTag = isOrdered ? "ol" : "ul";
                elements.push(
                    <ListTag key={key++} style={{ paddingLeft: 24, margin: "16px 0" }}>
                        {items.map((item, j) => (
                            <li key={j} style={{ fontSize: 16, color: "var(--text-muted)", lineHeight: 1.9, marginBottom: 8 }}>
                                {renderInline(item.replace(/^(\d+\.|-)\s*/, ""))}
                            </li>
                        ))}
                    </ListTag>
                );
                continue;
            }
            if (trimmed.startsWith("**") && trimmed.endsWith("**") && !trimmed.slice(2, -2).includes("**")) {
                elements.push(<p key={key++} style={{ fontSize: 16, color: "var(--text)", fontWeight: 700, lineHeight: 1.9, marginBottom: 20 }}>{trimmed.replace(/\*\*/g, "")}</p>);
                continue;
            }
            elements.push(
                <p key={key++} style={{ fontSize: 16, color: "var(--text-muted)", lineHeight: 1.9, marginBottom: 20 }}>
                    {renderInline(trimmed)}
                </p>
            );
        }
    }

    return elements;
}

function LoadingSkeleton() {
    return (
        <div style={{ animation: "pulse 1.5s ease-in-out infinite" }}>
            <div style={{ height: 16, width: 100, background: "var(--border)", borderRadius: 6, margin: "0 auto 32px" }} />
            <div style={{ height: 48, background: "var(--border)", borderRadius: 8, marginBottom: 12 }} />
            <div style={{ height: 48, width: "75%", background: "var(--border)", borderRadius: 8, margin: "0 auto 24px" }} />
            <div style={{ height: 14, width: 200, background: "var(--border)", borderRadius: 6, margin: "0 auto 48px" }} />
            <div style={{ height: 380, background: "var(--border)", borderRadius: 16, marginBottom: 36 }} />
            {[1, 2, 3, 4, 5].map(i => (
                <div key={i} style={{ height: 16, background: "var(--border)", borderRadius: 6, marginBottom: 10, width: i % 3 === 0 ? "85%" : "100%" }} />
            ))}
        </div>
    );
}

export default function BlogPost() {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [adjacent, setAdjacent] = useState({ prev: null, next: null });
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setNotFound(false);

        async function load() {
            try {
                const [data, allPosts] = await Promise.all([
                    fetchPostBySlug(slug),
                    fetchPublishedPosts({ limit: 50 }),
                ]);
                if (cancelled) return;
                if (!data) { setNotFound(true); setLoading(false); return; }
                setPost(data);

                const idx = allPosts.findIndex(p => p.slug === slug);
                setAdjacent({
                    prev: idx < allPosts.length - 1 ? allPosts[idx + 1] : null,
                    next: idx > 0 ? allPosts[idx - 1] : null,
                });
            } catch {
                if (!cancelled) setNotFound(true);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => { cancelled = true; };
    }, [slug]);

    if (notFound) {
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
            <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ maxWidth: 800, margin: "0 auto", padding: "60px 24px 0", textAlign: "center" }}>
                    <Link to="/blog" style={{ color: "var(--blue)", fontSize: 13, fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 32 }}>
                        ← Back to Blog
                    </Link>

                    {loading ? (
                        <LoadingSkeleton />
                    ) : (
                        <>
                            <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 24 }}>
                                <Tag label={post.tag} color={TAG_COLORS[post.tag] || "var(--blue)"} />
                            </div>
                            <h1 style={{ fontSize: "clamp(26px, 4vw, 46px)", fontWeight: 800, color: "var(--text)", fontFamily: "var(--font-display)", lineHeight: 1.2, marginBottom: 20 }}>
                                {post.title}
                            </h1>
                            <div style={{ fontSize: 14, color: "var(--text-faint)", marginBottom: 48 }}>
                                {post.date} · {post.read} read · By {post.author}
                            </div>
                        </>
                    )}
                </div>

                {!loading && post && (
                    <>
                        <div style={{ maxWidth: 800, margin: "0 auto 48px", padding: "0 24px" }}>
                            <div style={{ height: 1, background: "linear-gradient(90deg, transparent, var(--blue), transparent)" }} />
                        </div>

                        <article style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px 80px" }}>
                            {post.image && (
                                <div style={{ marginBottom: 36, borderRadius: 16, overflow: "hidden" }}>
                                    <img src={post.image} alt={post.title} style={{ width: "100%", height: 380, objectFit: "cover", display: "block" }} />
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
                                    <button
                                        onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`, "_blank")}
                                        style={{ background: "var(--blue-dim)", border: "1px solid var(--border-blue)", color: "var(--blue)", borderRadius: 8, padding: "8px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
                                    >
                                        Share on X
                                    </button>
                                    <button
                                        onClick={() => navigator.clipboard?.writeText(window.location.href)}
                                        style={{ background: "var(--blue-dim)", border: "1px solid var(--border-blue)", color: "var(--blue)", borderRadius: 8, padding: "8px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
                                    >
                                        Copy Link
                                    </button>
                                </div>
                            </div>

                            {/* Prev / Next */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 48 }}>
                                {adjacent.prev ? (
                                    <Link to={`/blog/${adjacent.prev.slug}`} style={{ textDecoration: "none" }}>
                                        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 20, transition: "all 0.2s" }}
                                            onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(74,143,212,0.4)"}
                                            onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
                                            <div style={{ fontSize: 11, color: "var(--text-faint)", marginBottom: 8, letterSpacing: "0.06em" }}>← PREVIOUS</div>
                                            <div style={{ fontSize: 14, color: "var(--text)", fontWeight: 600, lineHeight: 1.4 }}>{adjacent.prev.title}</div>
                                        </div>
                                    </Link>
                                ) : <div />}
                                {adjacent.next ? (
                                    <Link to={`/blog/${adjacent.next.slug}`} style={{ textDecoration: "none" }}>
                                        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 20, textAlign: "right", transition: "all 0.2s" }}
                                            onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(74,143,212,0.4)"}
                                            onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
                                            <div style={{ fontSize: 11, color: "var(--text-faint)", marginBottom: 8, letterSpacing: "0.06em" }}>NEXT →</div>
                                            <div style={{ fontSize: 14, color: "var(--text)", fontWeight: 600, lineHeight: 1.4 }}>{adjacent.next.title}</div>
                                        </div>
                                    </Link>
                                ) : <div />}
                            </div>
                        </article>
                    </>
                )}
            </div>
            <Footer />
        </>
    );
}
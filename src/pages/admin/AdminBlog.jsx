// src/pages/admin/AdminBlog.jsx
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/useAuth";
import { fetchDrafts, updatePost, publishPost, unpublishPost, deletePost, createPost, triggerResearchAgent } from "../../api/adminApi";
import { useSessionExpiry } from "../../hooks/useSessionExpiry";
import ImageUploader from "../../components/ui/ImageUploader";
import Tag from "../../components/ui/Tag";
import { uploadToCloudinary } from "../../utils/cloudinary";

const TAG_COLORS = { "Research Digest": "#4A8FD4", "Opinion": "#f59e0b", "Announcement": "#22c55e", "Technical": "#8b5cf6" };
const ALL_TAGS = ["Research Digest", "Opinion", "Announcement", "Technical"];
const API_BASE = import.meta.env.VITE_API_URL || "https://dftlabs-backend.onrender.com";

function timeAgo(dateStr) {
    if (!dateStr) return "";
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
}

function slugify(str) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const inputStyle = {
    width: "100%", background: "rgba(255,255,255,0.04)",
    border: "1px solid var(--border)", borderRadius: 10,
    padding: "10px 14px", color: "var(--text)", fontSize: 14,
    outline: "none", fontFamily: "inherit",
};

const EMPTY_POST = { title: "", slug: "", tag: "Research Digest", excerpt: "", content: "", image: "" };

// Toolbar for content editor — bold, heading, list, inline image
function EditorToolbar({ textareaRef, onContentChange, content }) {
    const [imgUploading, setImgUploading] = useState(false);
    const [imgProgress, setImgProgress] = useState(0);
    const fileRef = useRef();

    const insertAtCursor = (before, after = "") => {
        const el = textareaRef.current;
        if (!el) return;
        const start = el.selectionStart;
        const end = el.selectionEnd;
        const selected = content.slice(start, end);
        const newContent = content.slice(0, start) + before + selected + after + content.slice(end);
        onContentChange(newContent);
        setTimeout(() => {
            el.focus();
            el.setSelectionRange(start + before.length, start + before.length + selected.length);
        }, 0);
    };

    const handleInlineImage = async (file) => {
        if (!file || !file.type.startsWith("image/")) return;
        setImgUploading(true);
        setImgProgress(0);
        try {
            const url = await uploadToCloudinary(file, setImgProgress);
            const el = textareaRef.current;
            const pos = el ? el.selectionStart : content.length;
            const tag = `\n![image](${url})\n`;
            const newContent = content.slice(0, pos) + tag + content.slice(pos);
            onContentChange(newContent);
        } catch {
            alert("Image upload failed.");
        } finally {
            setImgUploading(false);
            setImgProgress(0);
        }
    };

    const btnStyle = {
        background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)",
        color: "var(--text-muted)", borderRadius: 7, padding: "5px 10px",
        fontSize: 12, cursor: "pointer", fontFamily: "inherit",
    };

    return (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", padding: "8px 12px", background: "rgba(255,255,255,0.03)", borderRadius: "10px 10px 0 0", borderBottom: "1px solid var(--border)" }}>
            <button type="button" style={btnStyle} onClick={() => insertAtCursor("**", "**")} title="Bold">B</button>
            <button type="button" style={{ ...btnStyle, fontStyle: "italic" }} onClick={() => insertAtCursor("*", "*")} title="Italic">I</button>
            <button type="button" style={btnStyle} onClick={() => insertAtCursor("\n## ", "")} title="Heading 2">H2</button>
            <button type="button" style={btnStyle} onClick={() => insertAtCursor("\n### ", "")} title="Heading 3">H3</button>
            <button type="button" style={btnStyle} onClick={() => insertAtCursor("\n- ", "")} title="Bullet list">• List</button>
            <button type="button" style={btnStyle} onClick={() => insertAtCursor("\n> ", "")} title="Blockquote">❝</button>
            <button type="button" style={btnStyle} onClick={() => insertAtCursor("\n```\n", "\n```")} title="Code block">{"</>"}</button>
            <div style={{ width: 1, background: "var(--border)", margin: "0 2px" }} />
            {/* Inline image upload */}
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => handleInlineImage(e.target.files[0])} />
            <button
                type="button"
                onClick={() => fileRef.current.click()}
                disabled={imgUploading}
                style={{ ...btnStyle, color: imgUploading ? "var(--text-faint)" : "var(--blue)", borderColor: "var(--border-blue)", background: "var(--blue-dim)", display: "flex", alignItems: "center", gap: 5 }}
                title="Insert image"
            >
                {imgUploading
                    ? <><span style={{ width: 11, height: 11, border: "2px solid rgba(255,255,255,0.2)", borderTopColor: "var(--blue)", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }} />{imgProgress}%</>
                    : "🖼 Insert Image"
                }
            </button>
        </div>
    );
}

// Inline edit form (shown when editing an existing post)
function EditForm({ post, onSave, onCancel, saving }) {
    const [form, setForm] = useState({
        title: post.title || "",
        tag: post.tag || "Research Digest",
        excerpt: post.excerpt || "",
        content: post.content || "",
        image: post.image || "",
    });
    const textareaRef = useRef();

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} style={{ ...inputStyle, fontSize: 16, fontWeight: 700 }} placeholder="Title" />
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {ALL_TAGS.map(t => (
                    <button key={t} type="button" onClick={() => setForm(f => ({ ...f, tag: t }))} style={{ background: form.tag === t ? (TAG_COLORS[t] + "30") : "none", border: `1px solid ${form.tag === t ? TAG_COLORS[t] : "var(--border)"}`, color: form.tag === t ? TAG_COLORS[t] : "var(--text-muted)", borderRadius: 8, padding: "5px 12px", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{t}</button>
                ))}
            </div>
            <textarea value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} rows={2} placeholder="Excerpt" style={{ ...inputStyle, resize: "vertical" }} />

            {/* Cover image */}
            <div>
                <div style={{ fontSize: 11, color: "var(--text-faint)", letterSpacing: "0.08em", marginBottom: 8 }}>COVER IMAGE</div>
                <ImageUploader
                    label="Upload cover image"
                    preview={form.image}
                    onUpload={url => setForm(f => ({ ...f, image: url || "" }))}
                />
            </div>

            {/* Content with toolbar */}
            <div style={{ border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
                <EditorToolbar
                    textareaRef={textareaRef}
                    content={form.content}
                    onContentChange={val => setForm(f => ({ ...f, content: val }))}
                />
                <textarea
                    ref={textareaRef}
                    value={form.content}
                    onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                    rows={14}
                    placeholder="Content (markdown supported)"
                    style={{ ...inputStyle, border: "none", borderRadius: 0, resize: "vertical", lineHeight: 1.7 }}
                />
            </div>

            <div style={{ display: "flex", gap: 10 }}>
                <button type="button" onClick={() => onSave(form)} disabled={saving} style={{ background: "var(--blue-dim)", border: "1px solid var(--border-blue)", color: "var(--blue)", borderRadius: 8, padding: "9px 20px", fontSize: 13, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
                    {saving ? "Saving..." : "Save Changes"}
                </button>
                <button type="button" onClick={onCancel} style={{ background: "none", border: "1px solid var(--border)", color: "var(--text-muted)", borderRadius: 8, padding: "9px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
            </div>
        </div>
    );
}

export default function AdminBlog() {
    const { token } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState("draft");
    const [editing, setEditing] = useState(null);
    const [saving, setSaving] = useState(null);
    const [agentRunning, setAgentRunning] = useState(false);
    const [agentResult, setAgentResult] = useState(null);
    const [creating, setCreating] = useState(false);
    const [newPost, setNewPost] = useState(EMPTY_POST);
    const [createSaving, setCreateSaving] = useState(false);
    const newTextareaRef = useRef();

    const handleError = useSessionExpiry();

    useEffect(() => { load(); }, []);

    async function load() {
        setLoading(true);
        setError(null);
        try {
            const [drafts, published] = await Promise.all([
                fetchDrafts(token),
                fetch(`${API_BASE}/api/blog/?limit=50`).then(r => r.json()),
            ]);
            const seen = new Set();
            const merged = [];
            for (const p of [...drafts, ...published]) {
                if (!seen.has(p.id)) { seen.add(p.id); merged.push(p); }
            }
            setPosts(merged);
        } catch (err) {
            handleError(err, "Failed to load posts.");
            setError("Failed to load posts.");
        } finally {
            setLoading(false);
        }
    }

    const filtered = posts.filter(p => filter === "all" ? true : p.status === filter);
    const draftCount = posts.filter(p => p.status === "draft").length;
    const publishedCount = posts.filter(p => p.status === "published").length;

    const handleSaveEdit = async (id, form) => {
        setSaving(id);
        try {
            const updated = await updatePost(token, id, {
                title: form.title, content: form.content,
                tag: form.tag, excerpt: form.excerpt, image: form.image,
            });
            setPosts(ps => ps.map(p => p.id === id ? { ...p, ...updated } : p));
            setEditing(null);
        } catch { alert("Failed to save."); }
        finally { setSaving(null); }
    };

    const handlePublish = async (id) => {
        setSaving(id);
        try {
            const updated = await publishPost(token, id);
            setPosts(ps => ps.map(p => p.id === id ? { ...p, ...updated } : p));
        } catch { alert("Failed to publish."); }
        finally { setSaving(null); }
    };

    const handleUnpublish = async (id) => {
        setSaving(id);
        try {
            const updated = await unpublishPost(token, id);
            setPosts(ps => ps.map(p => p.id === id ? { ...p, ...updated } : p));
        } catch { alert("Failed to unpublish."); }
        finally { setSaving(null); }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this post permanently?")) return;
        try {
            await deletePost(token, id);
            setPosts(ps => ps.filter(p => p.id !== id));
        } catch { alert("Failed to delete."); }
    };

    const handleCreate = async () => {
        if (!newPost.title || !newPost.content) return alert("Title and content are required.");
        setCreateSaving(true);
        try {
            const created = await createPost(token, {
                title: newPost.title,
                slug: newPost.slug || slugify(newPost.title),
                tag: newPost.tag,
                excerpt: newPost.excerpt || newPost.content.slice(0, 200),
                content: newPost.content,
                image: newPost.image || null,
                status: "draft",
            });
            setPosts(ps => [created, ...ps]);
            setNewPost(EMPTY_POST);
            setCreating(false);
            setFilter("draft");
        } catch (err) { alert(err.message || "Failed to create post."); }
        finally { setCreateSaving(false); }
    };

    const handleRunAgent = async () => {
        setAgentRunning(true);
        setAgentResult(null);
        try {
            const result = await triggerResearchAgent(token);
            setAgentResult(`✅ ${result.drafts_created} new draft${result.drafts_created !== 1 ? "s" : ""} created`);
            await load();
        } catch { setAgentResult("❌ Agent failed."); }
        finally { setAgentRunning(false); }
    };

    return (
        <div>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
                <div>
                    <h1 style={{ fontSize: 26, fontWeight: 800, color: "var(--text)", fontFamily: "var(--font-display)", marginBottom: 6 }}>Blog Posts</h1>
                    <div style={{ display: "flex", gap: 16, fontSize: 13 }}>
                        <span style={{ color: "var(--text-faint)" }}>{draftCount} draft{draftCount !== 1 ? "s" : ""}</span>
                        <span style={{ color: "#22c55e" }}>{publishedCount} published</span>
                    </div>
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-start" }}>
                    <button onClick={() => setCreating(c => !c)} style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)", color: "#22c55e", borderRadius: 10, padding: "11px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                        ✍️ New Post
                    </button>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                        <button onClick={handleRunAgent} disabled={agentRunning} style={{ background: agentRunning ? "rgba(74,143,212,0.3)" : "linear-gradient(135deg, #4A8FD4, #2d6ba8)", border: "none", color: "#fff", borderRadius: 10, padding: "11px 18px", fontSize: 13, fontWeight: 700, cursor: agentRunning ? "not-allowed" : "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 8 }}>
                            {agentRunning ? <><span style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }} />Running...</> : "🤖 Run Research Agent"}
                        </button>
                        {agentResult && <div style={{ fontSize: 11, color: "var(--text-faint)" }}>{agentResult}</div>}
                    </div>
                </div>
            </div>

            {/* Filter tabs */}
            <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
                {[["draft", `Drafts (${draftCount})`], ["published", `Published (${publishedCount})`], ["all", `All (${posts.length})`]].map(([val, label]) => (
                    <button key={val} onClick={() => setFilter(val)} style={{ background: filter === val ? "var(--blue)" : "rgba(255,255,255,0.04)", border: `1px solid ${filter === val ? "var(--blue)" : "var(--border)"}`, color: filter === val ? "#fff" : "var(--text-muted)", borderRadius: 99, padding: "7px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                        {label}
                    </button>
                ))}
            </div>

            {/* Create form */}
            {creating && (
                <div style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: 16, padding: 24, marginBottom: 24 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 16 }}>New Blog Post</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                        <input placeholder="Title *" value={newPost.title} onChange={e => setNewPost(n => ({ ...n, title: e.target.value }))} style={inputStyle} />
                        <input placeholder="Slug (auto-generated if blank)" value={newPost.slug} onChange={e => setNewPost(n => ({ ...n, slug: e.target.value }))} style={inputStyle} />
                    </div>
                    <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                        {ALL_TAGS.map(t => (
                            <button key={t} type="button" onClick={() => setNewPost(n => ({ ...n, tag: t }))} style={{ background: newPost.tag === t ? (TAG_COLORS[t] + "30") : "none", border: `1px solid ${newPost.tag === t ? TAG_COLORS[t] : "var(--border)"}`, color: newPost.tag === t ? TAG_COLORS[t] : "var(--text-muted)", borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{t}</button>
                        ))}
                    </div>
                    <textarea placeholder="Excerpt (optional)" value={newPost.excerpt} onChange={e => setNewPost(n => ({ ...n, excerpt: e.target.value }))} rows={2} style={{ ...inputStyle, resize: "vertical", marginBottom: 12 }} />

                    {/* Cover image */}
                    <div style={{ marginBottom: 12 }}>
                        <div style={{ fontSize: 11, color: "var(--text-faint)", letterSpacing: "0.08em", marginBottom: 8 }}>COVER IMAGE</div>
                        <ImageUploader
                            label="Upload cover image (optional)"
                            preview={newPost.image}
                            onUpload={url => setNewPost(n => ({ ...n, image: url || "" }))}
                        />
                    </div>

                    {/* Content with toolbar */}
                    <div style={{ border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden", marginBottom: 16 }}>
                        <EditorToolbar
                            textareaRef={newTextareaRef}
                            content={newPost.content}
                            onContentChange={val => setNewPost(n => ({ ...n, content: val }))}
                        />
                        <textarea
                            ref={newTextareaRef}
                            placeholder="Content (markdown supported) *"
                            value={newPost.content}
                            onChange={e => setNewPost(n => ({ ...n, content: e.target.value }))}
                            rows={12}
                            style={{ ...inputStyle, border: "none", borderRadius: 0, resize: "vertical", lineHeight: 1.7 }}
                        />
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                        <button onClick={handleCreate} disabled={createSaving} style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)", color: "#22c55e", borderRadius: 8, padding: "9px 20px", fontSize: 13, fontWeight: 700, cursor: createSaving ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
                            {createSaving ? "Saving..." : "Save as Draft"}
                        </button>
                        <button onClick={() => { setCreating(false); setNewPost(EMPTY_POST); }} style={{ background: "none", border: "1px solid var(--border)", color: "var(--text-muted)", borderRadius: 8, padding: "9px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
                    </div>
                </div>
            )}

            {error && (
                <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 12, padding: "16px 20px", marginBottom: 24, color: "#ef4444", fontSize: 14 }}>
                    {error} <button onClick={load} style={{ background: "none", border: "none", color: "var(--blue)", cursor: "pointer", fontFamily: "inherit", fontSize: 13, marginLeft: 8 }}>Retry</button>
                </div>
            )}

            {loading ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {[1, 2, 3].map(i => (
                        <div key={i} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: 24, animation: "pulse 1.5s ease-in-out infinite" }}>
                            <div style={{ height: 16, width: "60%", background: "var(--border)", borderRadius: 6, marginBottom: 12 }} />
                            <div style={{ height: 13, background: "var(--border)", borderRadius: 6 }} />
                        </div>
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-muted)" }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>✍️</div>
                    <p>{filter === "draft" ? "No drafts. Run the research agent or create a post manually." : "No posts found."}</p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    {filtered.map(post => (
                        <div key={post.id} style={{ background: "var(--bg-card)", border: `1px solid ${post.status === "published" ? "rgba(34,197,94,0.25)" : "var(--border)"}`, borderRadius: 16, overflow: "hidden" }}>
                            {/* Cover thumbnail if exists */}
                            {post.image && editing !== post.id && (
                                <img src={post.image} alt={post.title} style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }} />
                            )}
                            <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10, flexWrap: "wrap" }}>
                                            <Tag label={post.tag} color={TAG_COLORS[post.tag] || "var(--blue)"} />
                                            <Tag label={post.status === "published" ? "Published ✓" : "Draft"} color={post.status === "published" ? "#22c55e" : "#f59e0b"} />
                                            <span style={{ fontSize: 12, color: "var(--text-faint)" }}>{timeAgo(post.created_at)}</span>
                                        </div>
                                        {editing !== post.id && (
                                            <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-display)", lineHeight: 1.4 }}>{post.title}</h3>
                                        )}
                                    </div>
                                    <div style={{ display: "flex", gap: 8, flexShrink: 0, flexWrap: "wrap" }}>
                                        {editing !== post.id && (
                                            <>
                                                <button onClick={() => setEditing(post.id)} style={{ background: "var(--blue-dim)", border: "1px solid var(--border-blue)", color: "var(--blue)", borderRadius: 8, padding: "8px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>✏️ Edit</button>
                                                {post.status === "draft" ? (
                                                    <button onClick={() => handlePublish(post.id)} disabled={saving === post.id} style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)", color: "#22c55e", borderRadius: 8, padding: "8px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                                                        {saving === post.id ? "..." : "🚀 Publish"}
                                                    </button>
                                                ) : (
                                                    <button onClick={() => handleUnpublish(post.id)} disabled={saving === post.id} style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.3)", color: "#f59e0b", borderRadius: 8, padding: "8px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                                                        {saving === post.id ? "..." : "⏸ Unpublish"}
                                                    </button>
                                                )}
                                                <button onClick={() => handleDelete(post.id)} style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", borderRadius: 8, padding: "8px 10px", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>🗑</button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div style={{ padding: "20px 24px" }}>
                                {editing === post.id ? (
                                    <EditForm
                                        post={post}
                                        saving={saving === post.id}
                                        onSave={(form) => handleSaveEdit(post.id, form)}
                                        onCancel={() => setEditing(null)}
                                    />
                                ) : (
                                    <>
                                        <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.8 }}>
                                            {post.excerpt || post.content?.slice(0, 200) + "..."}
                                        </p>
                                        {Array.isArray(post.sources) && post.sources.length > 0 && (
                                            <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
                                                <div style={{ fontSize: 11, color: "var(--text-faint)", letterSpacing: "0.08em", marginBottom: 10 }}>SOURCES</div>
                                                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                                    {post.sources.map(src => (
                                                        <a key={src} href={src.startsWith("http") ? src : `https://${src}`} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: "var(--blue)", background: "var(--blue-dim)", border: "1px solid var(--border-blue)", borderRadius: 6, padding: "4px 10px", textDecoration: "none" }}>
                                                            🔗 {src.replace(/^https?:\/\//, "").slice(0, 50)}
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
            `}</style>
        </div>
    );
}
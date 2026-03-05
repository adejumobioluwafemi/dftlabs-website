const API_BASE = import.meta.env.VITE_API_URL || "https://dftlabs-backend.onrender.com";

function formatPost(p) {
    return {
        slug: p.slug,
        tag: p.tag,
        title: p.title,
        date: p.published_at
            ? new Date(p.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
            : new Date(p.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        read: p.read_time,
        author: p.author,
        image: p.image || null,
        excerpt: p.excerpt,
        content: p.content,
    };
}

export async function fetchPublishedPosts({ tag, search, limit = 20, offset = 0 } = {}) {
    const params = new URLSearchParams({ limit, offset });
    if (tag && tag !== "All") params.set("tag", tag);
    if (search) params.set("search", search);
    const res = await fetch(`${API_BASE}/api/blog/?${params}`);
    if (!res.ok) throw new Error("Failed to fetch posts");
    const posts = await res.json();
    return posts.map(formatPost);
}

export async function fetchPostBySlug(slug) {
    const res = await fetch(`${API_BASE}/api/blog/${slug}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Failed to fetch post");
    return formatPost(await res.json());
}
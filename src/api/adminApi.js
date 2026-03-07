// src/api/adminApi.js
const API_BASE = import.meta.env.VITE_API_URL || "https://dftlabs-backend.onrender.com";

// ── Session expiry ─────────────────────────────────────────────────────────────

export class SessionExpiredError extends Error {
    constructor() {
        super("Session expired");
        this.name = "SessionExpiredError";
    }
}

// Central fetch wrapper — throws SessionExpiredError on 401
async function apiFetch(url, options = {}) {
    const res = await fetch(url, options);
    if (res.status === 401) throw new SessionExpiredError();
    return res;
}

function authHeaders(token) {
    return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export async function adminLogin(password) {
    const res = await fetch(`${API_BASE}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
    });
    if (!res.ok) throw new Error("Incorrect password");
    return res.json();
}

// ── Blog ──────────────────────────────────────────────────────────────────────

export async function fetchDrafts(token) {
    const res = await apiFetch(`${API_BASE}/api/blog/admin/drafts`, {
        headers: authHeaders(token),
    });
    if (!res.ok) throw new Error("Failed to fetch drafts");
    return res.json();
}

export async function updatePost(token, postId, updates) {
    const res = await apiFetch(`${API_BASE}/api/blog/admin/${postId}`, {
        method: "PATCH",
        headers: authHeaders(token),
        body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error("Failed to update post");
    return res.json();
}

export async function deletePost(token, postId) {
    const res = await apiFetch(`${API_BASE}/api/blog/admin/${postId}`, {
        method: "DELETE",
        headers: authHeaders(token),
    });
    if (!res.ok) throw new Error("Failed to delete post");
}

export async function createPost(token, data) {
    const res = await apiFetch(`${API_BASE}/api/blog/admin/`, {
        method: "POST",
        headers: authHeaders(token),
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to create post");
    }
    return res.json();
}

export async function publishPost(token, postId) {
    return updatePost(token, postId, { status: "published" });
}

export async function unpublishPost(token, postId) {
    return updatePost(token, postId, { status: "draft" });
}

// ── Jobs ──────────────────────────────────────────────────────────────────────

export async function fetchAllJobs(token) {
    const res = await apiFetch(`${API_BASE}/api/jobs/?limit=100`, {
        headers: authHeaders(token),
    });
    if (!res.ok) throw new Error("Failed to fetch jobs");
    return res.json();
}

export async function updateJob(token, jobId, updates) {
    const res = await apiFetch(`${API_BASE}/api/jobs/admin/${jobId}`, {
        method: "PATCH",
        headers: authHeaders(token),
        body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error("Failed to update job");
    return res.json();
}

export async function deleteJob(token, jobId) {
    const res = await apiFetch(`${API_BASE}/api/jobs/admin/${jobId}`, {
        method: "DELETE",
        headers: authHeaders(token),
    });
    if (!res.ok) throw new Error("Failed to delete job");
}

// ── Events ────────────────────────────────────────────────────────────────────

export async function fetchAllEvents(token) {
    const res = await apiFetch(`${API_BASE}/api/events/?limit=100`, {
        headers: authHeaders(token),
    });
    if (!res.ok) throw new Error("Failed to fetch events");
    return res.json();
}

export async function createEvent(token, data) {
    const res = await apiFetch(`${API_BASE}/api/events/admin/`, {
        method: "POST",
        headers: authHeaders(token),
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to create event");
    }
    return res.json();
}

export async function updateEvent(token, eventId, updates) {
    const res = await apiFetch(`${API_BASE}/api/events/admin/${eventId}`, {
        method: "PATCH",
        headers: authHeaders(token),
        body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error("Failed to update event");
    return res.json();
}

export async function deleteEvent(token, eventId) {
    const res = await apiFetch(`${API_BASE}/api/events/admin/${eventId}`, {
        method: "DELETE",
        headers: authHeaders(token),
    });
    if (!res.ok) throw new Error("Failed to delete event");
}

// ── Registrations ─────────────────────────────────────────────────────────────

export async function fetchRegistrations(token, eventId) {
    const res = await apiFetch(`${API_BASE}/api/registrations/admin/event/${eventId}`, {
        headers: authHeaders(token),
    });
    if (!res.ok) throw new Error("Failed to fetch registrations");
    return res.json();
}

// ── Products ──────────────────────────────────────────────────────────────────

export async function fetchAllProducts(token) {
    // Admin fetch includes hidden products — public endpoint only returns visible ones
    const res = await apiFetch(`${API_BASE}/api/products/admin/`, {
        headers: authHeaders(token),
    });
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
}

export async function createProduct(token, data) {
    const res = await apiFetch(`${API_BASE}/api/products/admin/`, {
        method: "POST",
        headers: authHeaders(token),
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to create product");
    }
    return res.json();
}

export async function updateProduct(token, productId, updates) {
    const res = await apiFetch(`${API_BASE}/api/products/admin/${productId}`, {
        method: "PATCH",
        headers: authHeaders(token),
        body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error("Failed to update product");
    return res.json();
}

export async function deleteProduct(token, productId) {
    const res = await apiFetch(`${API_BASE}/api/products/admin/${productId}`, {
        method: "DELETE",
        headers: authHeaders(token),
    });
    if (!res.ok) throw new Error("Failed to delete product");
}

export async function showProduct(token, productId) {
    return updateProduct(token, productId, { is_visible: true });
}

export async function hideProduct(token, productId) {
    return updateProduct(token, productId, { is_visible: false });
}

// ── Agents ────────────────────────────────────────────────────────────────────

export async function triggerResearchAgent(token) {
    const res = await apiFetch(`${API_BASE}/api/admin/run-research-agent`, {
        method: "POST",
        headers: authHeaders(token),
    });
    if (!res.ok) throw new Error("Failed to trigger research agent");
    return res.json();
}

export async function triggerJobsAgent(token) {
    const res = await apiFetch(`${API_BASE}/api/admin/run-jobs-agent`, {
        method: "POST",
        headers: authHeaders(token),
    });
    if (!res.ok) throw new Error("Failed to trigger jobs agent");
    return res.json();
}
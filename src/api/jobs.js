// src/api/jobs.js
const API_BASE = import.meta.env.VITE_API_URL || "https://dftlabs-backend.onrender.com";

function formatJob(j) {
    return {
        id: j.id,
        role: j.role,           // backend field: role
        type: j.job_type,       // backend field: job_type
        location: j.location,
        company: j.company,
        sector: j.sector,
        posted: formatPosted(j.created_at),
        salary: j.salary || null,       // backend field: salary
        apply_url: j.apply_url || null,
        description: j.description || null,
        is_featured: j.is_featured || false,
    };
}

function formatPosted(dateStr) {
    if (!dateStr) return "";
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 14) return "1 week ago";
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? "s" : ""} ago`;
}

export async function fetchJobs({ sector, type, location, search } = {}) {
    const params = new URLSearchParams({ limit: 50, offset: 0 });
    if (sector && sector !== "All") params.set("sector", sector);
    if (type && type !== "All") params.set("job_type", type);
    if (location && location !== "All") params.set("location", location);
    if (search) params.set("search", search);
    const res = await fetch(`${API_BASE}/api/jobs/?${params}`);
    if (!res.ok) throw new Error("Failed to fetch jobs");
    const jobs = await res.json();
    return jobs.map(formatJob);
}
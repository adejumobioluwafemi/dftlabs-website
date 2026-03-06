const API_BASE = import.meta.env.VITE_API_URL || "https://dftlabs-backend.onrender.com";

function formatEvent(e) {
    return {
        id: e.slug,
        slug: e.slug,
        title: e.title,
        date: e.date || "",         // backend field: date (string like "Mar 22, 2026")
        time: e.time || "",         // backend field: time (string)
        type: e.event_type || "Workshop",  // backend field: event_type
        location: e.location || "",
        spots: e.max_spots || 0,    // backend field: max_spots
        filled: e.filled || 0,      // computed by backend
        price: e.price || "Free",
        image: e.image || null,
        shortDesc: e.short_desc || "",    // backend field: short_desc
        description: e.description || "",
        is_active: e.is_active,
        speakers: e.speakers || null,
    };
}

export async function fetchEvents() {
    const res = await fetch(`${API_BASE}/api/events/?limit=50`);
    if (!res.ok) throw new Error("Failed to fetch events");
    const events = await res.json();
    return events.map(formatEvent);
}

export async function fetchEventBySlug(slug) {
    const res = await fetch(`${API_BASE}/api/events/${slug}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Failed to fetch event");
    return formatEvent(await res.json());
}

export async function registerForEvent(slug, formData) {
    const res = await fetch(`${API_BASE}/api/registrations/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event_slug: slug, ...formData }),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Registration failed");
    }
    return res.json();
}
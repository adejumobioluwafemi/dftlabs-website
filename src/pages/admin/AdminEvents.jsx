// src/pages/admin/AdminEvents.jsx

import { useState, useEffect } from "react";
import { useAuth } from "../../context/useAuth";
import { fetchAllEvents, createEvent, updateEvent, deleteEvent, fetchRegistrations } from "../../api/adminApi";
import Tag from "../../components/ui/Tag";

const TYPE_COLORS = { Workshop: "#4A8FD4", Seminar: "#f59e0b", "Open Day": "#22c55e" };

function RegistrationsModal({ event, token, onClose }) {
    const [regs, setRegs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRegistrations(token, event.id)
            .then(setRegs)
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [event.id]);

    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={onClose}>
            <div style={{ background: "#0d1929", border: "1px solid var(--border)", borderRadius: 20, padding: 32, width: "100%", maxWidth: 640, maxHeight: "80vh", overflow: "auto" }} onClick={e => e.stopPropagation()}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                    <div>
                        <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", fontFamily: "var(--font-display)", marginBottom: 4 }}>Registrations</h2>
                        <p style={{ fontSize: 13, color: "var(--text-faint)" }}>{event.title}</p>
                    </div>
                    <button onClick={onClose} style={{ background: "none", border: "1px solid var(--border)", color: "var(--text-muted)", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}>✕ Close</button>
                </div>
                {loading ? (
                    <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-faint)" }}>Loading...</div>
                ) : regs.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-faint)" }}>No registrations yet.</div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 12, padding: "8px 12px", fontSize: 11, color: "var(--text-faint)", letterSpacing: "0.08em" }}>
                            <span>NAME</span><span>EMAIL</span><span>TYPE</span>
                        </div>
                        {regs.map(r => (
                            <div key={r.id} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 12, padding: "12px", background: "rgba(255,255,255,0.03)", borderRadius: 10, alignItems: "center" }}>
                                <div>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{r.first_name} {r.last_name}</div>
                                    {r.organization && <div style={{ fontSize: 11, color: "var(--text-faint)" }}>{r.organization}</div>}
                                </div>
                                <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{r.email}</div>
                                <div style={{ fontSize: 11, color: r.is_virtual ? "#4A8FD4" : "#22c55e", fontWeight: 600 }}>
                                    {r.is_virtual ? "Virtual" : "In-person"}
                                </div>
                            </div>
                        ))}
                        <div style={{ marginTop: 12, fontSize: 12, color: "var(--text-faint)", textAlign: "right" }}>
                            {regs.length} registration{regs.length !== 1 ? "s" : ""} total
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

const EMPTY_FORM = { title: "", slug: "", date: "", time: "", event_type: "Workshop", location: "", price: "Free", short_desc: "", description: "", max_spots: 50 };

function slugify(str) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function AdminEvents() {
    const { token } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [adding, setAdding] = useState(false);
    const [newEvent, setNewEvent] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [regsModal, setRegsModal] = useState(null); // event object

    useEffect(() => { load(); }, []);

    async function load() {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchAllEvents(token);
            setEvents(data);
        } catch {
            setError("Failed to load events.");
        } finally {
            setLoading(false);
        }
    }

    const handleCreate = async () => {
        if (!newEvent.title || !newEvent.date || !newEvent.short_desc) return alert("Title, date, and short description are required.");
        setSaving(true);
        try {
            const payload = {
                ...newEvent,
                slug: newEvent.slug || slugify(newEvent.title) + "-" + newEvent.date.replace(/[^a-z0-9]/gi, "").toLowerCase(),
                max_spots: Number(newEvent.max_spots) || 50,
                description: newEvent.description || newEvent.short_desc,
            };
            const created = await createEvent(token, payload);
            setEvents(es => [created, ...es]);
            setNewEvent(EMPTY_FORM);
            setAdding(false);
        } catch (err) {
            alert(err.message || "Failed to create event.");
        } finally {
            setSaving(false);
        }
    };

    const handleToggleActive = async (ev) => {
        try {
            const updated = await updateEvent(token, ev.id, { is_active: !ev.is_active });
            setEvents(es => es.map(e => e.id === ev.id ? { ...e, ...updated } : e));
        } catch {
            alert("Failed to update event.");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this event and all its registrations?")) return;
        try {
            await deleteEvent(token, id);
            setEvents(es => es.filter(e => e.id !== id));
        } catch {
            alert("Failed to delete event.");
        }
    };

    const inputStyle = {
        background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)",
        borderRadius: 10, padding: "10px 14px", color: "var(--text)",
        fontSize: 13, outline: "none", fontFamily: "inherit", width: "100%",
    };

    return (
        <div>
            {regsModal && <RegistrationsModal event={regsModal} token={token} onClose={() => setRegsModal(null)} />}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
                <div>
                    <h1 style={{ fontSize: 26, fontWeight: 800, color: "var(--text)", fontFamily: "var(--font-display)", marginBottom: 6 }}>Events</h1>
                    <p style={{ fontSize: 14, color: "var(--text-faint)" }}>{loading ? "Loading..." : `${events.length} event${events.length !== 1 ? "s" : ""}`}</p>
                </div>
                <button onClick={() => setAdding(a => !a)} style={{ background: "linear-gradient(135deg, #4A8FD4, #2d6ba8)", border: "none", color: "#fff", borderRadius: 10, padding: "11px 22px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                    + New Event
                </button>
            </div>

            {error && (
                <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 12, padding: "16px 20px", marginBottom: 24, color: "#ef4444", fontSize: 14 }}>
                    {error} <button onClick={load} style={{ background: "none", border: "none", color: "var(--blue)", cursor: "pointer", fontFamily: "inherit", fontSize: 13, marginLeft: 8 }}>Retry</button>
                </div>
            )}

            {/* Add event form */}
            {adding && (
                <div style={{ background: "rgba(74,143,212,0.06)", border: "1px solid rgba(74,143,212,0.25)", borderRadius: 16, padding: 24, marginBottom: 24 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 16 }}>New Event</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                        <input placeholder="Event title *" value={newEvent.title} onChange={e => setNewEvent(n => ({ ...n, title: e.target.value }))} style={inputStyle} />
                        <input placeholder="Slug (auto-generated if blank)" value={newEvent.slug} onChange={e => setNewEvent(n => ({ ...n, slug: e.target.value }))} style={inputStyle} />
                        <input placeholder="Date (e.g. Apr 15, 2026) *" value={newEvent.date} onChange={e => setNewEvent(n => ({ ...n, date: e.target.value }))} style={inputStyle} />
                        <input placeholder="Time (e.g. 9:00 AM – 5:00 PM WAT)" value={newEvent.time} onChange={e => setNewEvent(n => ({ ...n, time: e.target.value }))} style={inputStyle} />
                        <input placeholder="Location" value={newEvent.location} onChange={e => setNewEvent(n => ({ ...n, location: e.target.value }))} style={inputStyle} />
                        <input placeholder="Price (e.g. Free, ₦5,000)" value={newEvent.price} onChange={e => setNewEvent(n => ({ ...n, price: e.target.value }))} style={inputStyle} />
                        <input placeholder="Max spots" type="number" value={newEvent.max_spots} onChange={e => setNewEvent(n => ({ ...n, max_spots: e.target.value }))} style={inputStyle} />
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            {["Workshop", "Seminar", "Open Day"].map(t => (
                                <button key={t} onClick={() => setNewEvent(n => ({ ...n, event_type: t }))} style={{
                                    background: newEvent.event_type === t ? "var(--blue)" : "none",
                                    border: `1px solid ${newEvent.event_type === t ? "var(--blue)" : "var(--border)"}`,
                                    color: newEvent.event_type === t ? "#fff" : "var(--text-muted)",
                                    borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                                }}>{t}</button>
                            ))}
                        </div>
                    </div>
                    <textarea placeholder="Short description (shown on events list) *" value={newEvent.short_desc} onChange={e => setNewEvent(n => ({ ...n, short_desc: e.target.value }))} rows={2} style={{ ...inputStyle, resize: "vertical", marginBottom: 10 }} />
                    <textarea placeholder="Full description (markdown supported)" value={newEvent.description} onChange={e => setNewEvent(n => ({ ...n, description: e.target.value }))} rows={5} style={{ ...inputStyle, resize: "vertical", marginBottom: 16 }} />
                    <div style={{ display: "flex", gap: 10 }}>
                        <button onClick={handleCreate} disabled={saving} style={{ background: saving ? "rgba(74,143,212,0.4)" : "linear-gradient(135deg, #4A8FD4, #2d6ba8)", border: "none", color: "#fff", borderRadius: 8, padding: "9px 20px", fontSize: 13, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
                            {saving ? "Saving..." : "Save Event"}
                        </button>
                        <button onClick={() => { setAdding(false); setNewEvent(EMPTY_FORM); }} style={{ background: "none", border: "1px solid var(--border)", color: "var(--text-muted)", borderRadius: 8, padding: "9px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Events list */}
            {loading ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {[1, 2].map(i => (
                        <div key={i} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "20px 24px", animation: "pulse 1.5s ease-in-out infinite" }}>
                            <div style={{ height: 16, width: "50%", background: "var(--border)", borderRadius: 6, marginBottom: 10 }} />
                            <div style={{ height: 12, width: "35%", background: "var(--border)", borderRadius: 6 }} />
                        </div>
                    ))}
                </div>
            ) : events.length === 0 && !adding ? (
                <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-muted)" }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>📅</div>
                    <p>No events yet. Create one above.</p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {events.map(ev => {
                        const filled = ev.filled || 0;
                        const spots = ev.max_spots || ev.spots || 1;
                        const pct = Math.round((filled / spots) * 100);
                        return (
                            <div key={ev.id} style={{
                                background: "var(--bg-card)", border: `1px solid ${ev.is_active !== false ? "var(--border)" : "rgba(255,255,255,0.04)"}`,
                                borderRadius: 14, padding: "20px 24px",
                                opacity: ev.is_active !== false ? 1 : 0.5, transition: "all 0.2s",
                            }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8, flexWrap: "wrap" }}>
                                            <Tag label={ev.event_type || ev.type} color={TYPE_COLORS[ev.event_type || ev.type] || "var(--blue)"} />
                                            <Tag label={ev.price || "Free"} color={ev.price === "Free" ? "#22c55e" : "#4A8FD4"} />
                                            {ev.is_active === false && <Tag label="Inactive" color="#ef4444" />}
                                            <span style={{ fontSize: 12, color: "var(--text-faint)" }}>{ev.date}</span>
                                        </div>
                                        <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-display)", marginBottom: 4 }}>{ev.title}</div>
                                        {ev.location && <div style={{ fontSize: 12.5, color: "var(--text-muted)" }}>📍 {ev.location}</div>}
                                    </div>
                                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                        <button
                                            onClick={() => setRegsModal(ev)}
                                            style={{ background: "var(--blue-dim)", border: "1px solid var(--border-blue)", color: "var(--blue)", borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                                            👥 {filled} Registrations
                                        </button>
                                        <button
                                            onClick={() => handleToggleActive(ev)}
                                            style={{ background: ev.is_active !== false ? "rgba(239,68,68,0.08)" : "rgba(34,197,94,0.08)", border: `1px solid ${ev.is_active !== false ? "rgba(239,68,68,0.2)" : "rgba(34,197,94,0.2)"}`, color: ev.is_active !== false ? "#ef4444" : "#22c55e", borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                                            {ev.is_active !== false ? "Deactivate" : "Activate"}
                                        </button>
                                        <button onClick={() => handleDelete(ev.id)} style={{ background: "none", border: "1px solid var(--border)", color: "var(--text-faint)", borderRadius: 8, padding: "7px 10px", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
                                            🗑
                                        </button>
                                    </div>
                                </div>
                                <div style={{ marginTop: 16 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-faint)", marginBottom: 6 }}>
                                        <span>{filled} registered</span>
                                        <span>{spots - filled} spots left · {pct}% full</span>
                                    </div>
                                    <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 99, height: 5 }}>
                                        <div style={{ width: `${pct}%`, background: "linear-gradient(90deg, #4A8FD4, #7CB9E8)", borderRadius: 99, height: "100%", transition: "width 0.8s ease" }} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
            <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
        </div>
    );
}
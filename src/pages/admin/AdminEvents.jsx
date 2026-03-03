import { useState } from "react";
import { EVENTS } from "../../data/content";
import Tag from "../../components/ui/Tag";

const TYPE_COLORS = { Workshop: "#4A8FD4", Seminar: "#f59e0b", "Open Day": "#22c55e" };

export default function AdminEvents() {
    const [events, setEvents] = useState(EVENTS.map((e, i) => ({ ...e, id: i + 1 })));
    const [adding, setAdding] = useState(false);
    const [newEvent, setNewEvent] = useState({ title: "", date: "", type: "Workshop", location: "", spots: "" });

    const addEvent = () => {
        if (!newEvent.title || !newEvent.date) return;
        setEvents(es => [...es, { ...newEvent, id: Date.now(), spots: Number(newEvent.spots) || 50, filled: 0 }]);
        setNewEvent({ title: "", date: "", type: "Workshop", location: "", spots: "" });
        setAdding(false);
    };

    const inputStyle = {
        background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)",
        borderRadius: 10, padding: "10px 14px", color: "var(--text)",
        fontSize: 13, outline: "none", fontFamily: "inherit", width: "100%",
    };

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
                <div>
                    <h1 style={{ fontSize: 26, fontWeight: 800, color: "var(--text)", fontFamily: "var(--font-display)", marginBottom: 6 }}>Events</h1>
                    <p style={{ fontSize: 14, color: "var(--text-faint)" }}>{events.length} events scheduled</p>
                </div>
                <button
                    onClick={() => setAdding(a => !a)}
                    style={{
                        background: "linear-gradient(135deg, #4A8FD4, #2d6ba8)",
                        border: "none", color: "#fff", borderRadius: 10,
                        padding: "11px 22px", fontSize: 13, fontWeight: 700,
                        cursor: "pointer", fontFamily: "inherit",
                    }}
                >
                    + New Event
                </button>
            </div>

            {/* Add event form */}
            {adding && (
                <div style={{ background: "rgba(74,143,212,0.06)", border: "1px solid rgba(74,143,212,0.25)", borderRadius: 16, padding: 24, marginBottom: 24 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 16 }}>New Event</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                        <input placeholder="Event title" value={newEvent.title} onChange={e => setNewEvent(n => ({ ...n, title: e.target.value }))} style={inputStyle} />
                        <input placeholder="Date (e.g. Apr 15, 2026)" value={newEvent.date} onChange={e => setNewEvent(n => ({ ...n, date: e.target.value }))} style={inputStyle} />
                        <input placeholder="Location" value={newEvent.location} onChange={e => setNewEvent(n => ({ ...n, location: e.target.value }))} style={inputStyle} />
                        <input placeholder="Max spots" type="number" value={newEvent.spots} onChange={e => setNewEvent(n => ({ ...n, spots: e.target.value }))} style={inputStyle} />
                    </div>
                    <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                        {["Workshop", "Seminar", "Open Day"].map(t => (
                            <button key={t} onClick={() => setNewEvent(n => ({ ...n, type: t }))} style={{
                                background: newEvent.type === t ? "var(--blue)" : "none",
                                border: `1px solid ${newEvent.type === t ? "var(--blue)" : "var(--border)"}`,
                                color: newEvent.type === t ? "#fff" : "var(--text-muted)",
                                borderRadius: 8, padding: "7px 14px", fontSize: 12,
                                fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                            }}>{t}</button>
                        ))}
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                        <button onClick={addEvent} style={{ background: "linear-gradient(135deg, #4A8FD4, #2d6ba8)", border: "none", color: "#fff", borderRadius: 8, padding: "9px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                            Save Event
                        </button>
                        <button onClick={() => setAdding(false)} style={{ background: "none", border: "1px solid var(--border)", color: "var(--text-muted)", borderRadius: 8, padding: "9px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Events list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {events.map(ev => {
                    const pct = Math.round(((ev.filled || 0) / (ev.spots || 1)) * 100);
                    return (
                        <div key={ev.id} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "20px 24px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8, flexWrap: "wrap" }}>
                                        <Tag label={ev.type} color={TYPE_COLORS[ev.type] || "var(--blue)"} />
                                        <span style={{ fontSize: 12, color: "var(--text-faint)" }}>{ev.date}</span>
                                    </div>
                                    <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-display)", marginBottom: 4 }}>{ev.title}</div>
                                    <div style={{ fontSize: 12.5, color: "var(--text-muted)" }}>📍 {ev.location}</div>
                                </div>
                                <div style={{ display: "flex", gap: 8 }}>
                                    <button style={{ background: "var(--blue-dim)", border: "1px solid var(--border-blue)", color: "var(--blue)", borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                                        View Registrations
                                    </button>
                                    <button onClick={() => setEvents(es => es.filter(e => e.id !== ev.id))} style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                                        Remove
                                    </button>
                                </div>
                            </div>
                            <div style={{ marginTop: 16 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-faint)", marginBottom: 6 }}>
                                    <span>{ev.filled || 0} registered</span>
                                    <span>{(ev.spots || 0) - (ev.filled || 0)} spots left · {pct}% full</span>
                                </div>
                                <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 99, height: 5 }}>
                                    <div style={{ width: `${pct}%`, background: "linear-gradient(90deg, #4A8FD4, #7CB9E8)", borderRadius: 99, height: "100%", transition: "width 0.8s ease" }} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
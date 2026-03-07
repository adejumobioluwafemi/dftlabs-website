// src/components/Events.jsx
// Homepage preview section — pulls next 3 upcoming events from live API
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchEvents } from "../api/events";
import { EVENTS } from "../data/content";
import SectionHeader from "./ui/SectionHeader";
import Tag from "./ui/Tag";

const TYPE_COLORS = { Workshop: "#4A8FD4", Seminar: "#f59e0b", "Open Day": "#22c55e" };

export default function Events() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchEvents({ limit: 3, upcoming: true })
            .then(data => {
                const items = Array.isArray(data) ? data : data?.items ?? data?.events ?? [];
                setEvents(items.length > 0 ? items.slice(0, 3) : EVENTS.slice(0, 3));
            })
            .catch(() => setEvents(EVENTS.slice(0, 3)))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div style={{
            background: "rgba(255,255,255,0.015)",
            borderTop: "1px solid var(--border)",
            borderBottom: "1px solid var(--border)",
            position: "relative", zIndex: 1,
        }}>
            <div id="events" className="section-wrapper">
                <SectionHeader
                    eyebrow="Events & Workshops"
                    title="Learn Live with DFT Labs"
                    sub="Intensive workshops and seminars — register your seat before they fill up."
                />
                <div className="grid-3">
                    {loading
                        ? Array(3).fill(null).map((_, i) => (
                            <div key={i} style={{
                                background: "var(--bg-card)", border: "1px solid var(--border)",
                                borderRadius: 16, padding: 24, opacity: 0.5,
                            }}>
                                <div style={{ height: 22, background: "rgba(255,255,255,0.06)", borderRadius: 6, width: "40%", marginBottom: 14 }} />
                                <div style={{ height: 18, background: "rgba(255,255,255,0.06)", borderRadius: 6, marginBottom: 10 }} />
                                <div style={{ height: 14, background: "rgba(255,255,255,0.04)", borderRadius: 6, width: "55%" }} />
                            </div>
                        ))
                        : events.map((ev, i) => {
                            const filled = ev.filled ?? ev.registered_count ?? 0;
                            const spots = ev.spots ?? ev.capacity ?? 100;
                            const pct = spots > 0 ? Math.round((filled / spots) * 100) : 0;
                            const eventId = ev.id || ev.slug;
                            const eventType = ev.type || ev.event_type;

                            return (
                                <div key={eventId ?? i} style={{
                                    background: "var(--bg-card)", border: "1px solid var(--border)",
                                    borderRadius: 16, padding: 24,
                                    transition: "all 0.3s",
                                }}
                                    onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(74,143,212,0.4)"}
                                    onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
                                >
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                                        <Tag label={eventType} color={TYPE_COLORS[eventType] || "var(--blue)"} />
                                        <div style={{ fontSize: 12, color: "var(--text-faint)" }}>{ev.date}</div>
                                    </div>
                                    <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", margin: "12px 0 8px", fontFamily: "var(--font-display)" }}>
                                        {ev.title}
                                    </div>
                                    <div style={{ fontSize: 12.5, color: "var(--text-muted)", marginBottom: 16 }}>
                                        📍 {ev.location}
                                    </div>
                                    <div style={{ marginBottom: 8 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-faint)", marginBottom: 6 }}>
                                            <span>{filled} registered</span>
                                            <span>{spots - filled} spots left</span>
                                        </div>
                                        <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 99, height: 5 }}>
                                            <div style={{
                                                width: `${pct}%`,
                                                background: "linear-gradient(90deg, #4A8FD4, #7CB9E8)",
                                                borderRadius: 99, height: "100%",
                                                transition: "width 1s ease",
                                            }} />
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => navigate(`/events/${eventId}`)}
                                        style={{
                                            marginTop: 16, width: "100%",
                                            background: "linear-gradient(135deg, #4A8FD4, #2d6ba8)",
                                            border: "none", color: "#fff", borderRadius: 10,
                                            padding: 11, fontSize: 13, fontWeight: 700,
                                            cursor: "pointer", fontFamily: "inherit",
                                        }}>
                                        Register Now →
                                    </button>
                                </div>
                            );
                        })
                    }
                </div>
                <div style={{ textAlign: "center", marginTop: 40 }}>
                    <button
                        onClick={() => navigate("/events")}
                        style={{
                            background: "none", border: "1px solid var(--border-blue)",
                            color: "var(--blue)", borderRadius: 12,
                            padding: "13px 36px", fontSize: 14, fontWeight: 600,
                            cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "var(--blue-dim)"}
                        onMouseLeave={e => e.currentTarget.style.background = "none"}>
                        View All Events →
                    </button>
                </div>
            </div>
        </div>
    );
}
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchEvents } from "../api/events";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Tag from "../components/ui/Tag";
import CircuitBackground from "../components/CircuitBackground";

const TYPE_COLORS = { Workshop: "#4A8FD4", Seminar: "#f59e0b", "Open Day": "#22c55e" };

function EventSkeleton() {
    return (
        <div style={{
            background: "var(--bg-card)", border: "1px solid var(--border)",
            borderRadius: 20, padding: "32px 36px",
            animation: "pulse 1.5s ease-in-out infinite",
        }}>
            <div style={{ height: 14, width: 120, background: "var(--border)", borderRadius: 6, marginBottom: 16 }} />
            <div style={{ height: 24, width: "60%", background: "var(--border)", borderRadius: 6, marginBottom: 12 }} />
            <div style={{ height: 14, background: "var(--border)", borderRadius: 6, marginBottom: 8 }} />
            <div style={{ height: 14, width: "80%", background: "var(--border)", borderRadius: 6, marginBottom: 20 }} />
            <div style={{ height: 5, background: "var(--border)", borderRadius: 99 }} />
        </div>
    );
}

export default function EventsPage() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;
        fetchEvents()
            .then(data => { if (!cancelled) setEvents(data); })
            .catch(() => { if (!cancelled) setError("Failed to load events."); })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, []);

    return (
        <>
            <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
            <CircuitBackground />
            <Navbar />
            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 24px 100px", position: "relative", zIndex: 1 }}>
                <div style={{ marginBottom: 56, textAlign: "center" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--blue)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 14 }}>
                        Events & Workshops
                    </div>
                    <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 800, color: "var(--text)", fontFamily: "var(--font-display)", marginBottom: 16 }}>
                        Learn Live with DFT Labs
                    </h1>
                    <p style={{ fontSize: 16, color: "var(--text-muted)", maxWidth: 520, margin: "0 auto" }}>
                        Intensive workshops, seminars, and open days — register your spot before they fill up.
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
                        <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
                        <p>{error}</p>
                    </div>
                )}

                {/* Skeletons */}
                {loading && !error && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                        {[1, 2, 3].map(i => <EventSkeleton key={i} />)}
                    </div>
                )}

                {/* Empty */}
                {!loading && !error && events.length === 0 && (
                    <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-muted)" }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>📅</div>
                        <h3 style={{ color: "var(--text)", marginBottom: 8 }}>No upcoming events</h3>
                        <p style={{ fontSize: 14 }}>Check back soon — we run workshops monthly.</p>
                    </div>
                )}

                {/* Event Cards */}
                {!loading && !error && events.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                        {events.map(ev => {
                            const pct = ev.spots > 0 ? Math.round((ev.filled / ev.spots) * 100) : 0;
                            const spotsLeft = ev.spots - ev.filled;
                            return (
                                <div key={ev.id} style={{
                                    background: "var(--bg-card)", border: "1px solid var(--border)",
                                    borderRadius: 20, overflow: "hidden", transition: "all 0.3s",
                                }}
                                    onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(74,143,212,0.4)"}
                                    onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 24, padding: "32px 36px", alignItems: "start" }} className="event-row">
                                        <div>
                                            <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
                                                <Tag label={ev.type} color={TYPE_COLORS[ev.type] || "var(--blue)"} />
                                                <Tag label={ev.price === "Free" ? "Free" : ev.price} color={ev.price === "Free" ? "#22c55e" : "#4A8FD4"} />
                                                <span style={{ fontSize: 12, color: "var(--text-faint)" }}>{ev.date}{ev.time ? ` · ${ev.time}` : ""}</span>
                                            </div>
                                            <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", fontFamily: "var(--font-display)", marginBottom: 10, lineHeight: 1.3 }}>
                                                {ev.title}
                                            </h2>
                                            <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.8, marginBottom: 16, maxWidth: 600 }}>
                                                {ev.shortDesc}
                                            </p>
                                            {ev.location && (
                                                <div style={{ fontSize: 13, color: "var(--text-muted)" }}>📍 {ev.location}</div>
                                            )}
                                            {ev.spots > 0 && (
                                                <div style={{ marginTop: 20, maxWidth: 360 }}>
                                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-faint)", marginBottom: 6 }}>
                                                        <span>{ev.filled} registered</span>
                                                        <span>{spotsLeft > 0 ? `${spotsLeft} spots left` : "Fully booked"}</span>
                                                    </div>
                                                    <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 99, height: 5 }}>
                                                        <div style={{ width: `${pct}%`, background: "linear-gradient(90deg, #4A8FD4, #7CB9E8)", borderRadius: 99, height: "100%", transition: "width 1s" }} />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 160 }}>
                                            <Link to={`/events/${ev.slug}`} style={{ textDecoration: "none" }}>
                                                <button style={{
                                                    width: "100%",
                                                    background: spotsLeft > 0 ? "linear-gradient(135deg, #4A8FD4, #2d6ba8)" : "rgba(255,255,255,0.04)",
                                                    border: `1px solid ${spotsLeft > 0 ? "transparent" : "var(--border)"}`,
                                                    color: spotsLeft > 0 ? "#fff" : "var(--text-muted)",
                                                    borderRadius: 12, padding: "12px 20px",
                                                    fontSize: 13, fontWeight: 700,
                                                    cursor: "pointer", fontFamily: "inherit",
                                                }}>
                                                    {spotsLeft > 0 ? "Register Now →" : "View Event →"}
                                                </button>
                                            </Link>
                                            <Link to={`/events/${ev.slug}`} style={{ textDecoration: "none" }}>
                                                <button style={{
                                                    width: "100%",
                                                    background: "none", border: "1px solid var(--border)",
                                                    color: "var(--text-muted)", borderRadius: 12,
                                                    padding: "10px 20px", fontSize: 12, fontWeight: 600,
                                                    cursor: "pointer", fontFamily: "inherit",
                                                }}>
                                                    Event Details
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            <Footer />
            <style>{`@media (max-width: 640px) { .event-row { grid-template-columns: 1fr !important; } }`}</style>
        </>
    );
}
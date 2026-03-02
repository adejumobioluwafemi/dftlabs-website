import { EVENTS } from "../data/content";
import SectionHeader from "./ui/SectionHeader";
import Tag from "./ui/Tag";

const TYPE_COLORS = { Workshop: "#4A8FD4", Seminar: "#f59e0b", "Open Day": "#22c55e" };

export default function Events() {
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
                    {EVENTS.map((ev, i) => {
                        const pct = Math.round((ev.filled / ev.spots) * 100);
                        return (
                            <div key={i} style={{
                                background: "var(--bg-card)", border: "1px solid var(--border)",
                                borderRadius: 16, padding: 24,
                            }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                                    <Tag label={ev.type} color={TYPE_COLORS[ev.type] || "var(--blue)"} />
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
                                        <span>{ev.filled} registered</span>
                                        <span>{ev.spots - ev.filled} spots left</span>
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
                                <button style={{
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
                    })}
                </div>
            </div>
        </div>
    );
}
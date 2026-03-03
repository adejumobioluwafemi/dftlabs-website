import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { EVENTS } from "../data/content";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Tag from "../components/ui/Tag";
import CircuitBackground from "../components/CircuitBackground";

const TYPE_COLORS = { Workshop: "#4A8FD4", Seminar: "#f59e0b", "Open Day": "#22c55e" };

function renderDescription(text) {
    return text.split("\n\n").map((block, i) => {
        if (block.startsWith("## ")) {
            return (
                <h2 key={i} style={{
                    fontSize: 20, fontWeight: 800, color: "var(--text)",
                    fontFamily: "var(--font-display)", margin: "32px 0 14px",
                }}>
                    {block.replace("## ", "")}
                </h2>
            );
        }
        if (block.startsWith("**") || block.includes("\n- ")) {
            const lines = block.split("\n");
            return (
                <div key={i} style={{ marginBottom: 16 }}>
                    {lines.map((line, j) => {
                        if (line.startsWith("**") && line.endsWith("**")) {
                            return <div key={j} style={{ fontWeight: 700, color: "var(--text)", marginBottom: 6, marginTop: j > 0 ? 14 : 0 }}>{line.replace(/\*\*/g, "")}</div>;
                        }
                        if (line.startsWith("- ")) {
                            return <div key={j} style={{ fontSize: 15, color: "var(--text-muted)", lineHeight: 1.8, paddingLeft: 16, marginBottom: 4 }}>• {line.replace("- ", "")}</div>;
                        }
                        return <div key={j} style={{ fontSize: 15, color: "var(--text-muted)", lineHeight: 1.8, marginBottom: 4 }}>{line}</div>;
                    })}
                </div>
            );
        }
        return (
            <p key={i} style={{ fontSize: 15, color: "var(--text-muted)", lineHeight: 1.9, marginBottom: 16 }}>
                {block}
            </p>
        );
    });
}

function RegistrationForm({ event, onSuccess }) {
    const [form, setForm] = useState({
        firstName: "", lastName: "", email: "",
        phone: "", organization: "", role: "", dietary: "", virtual: false,
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const validate = () => {
        const e = {};
        if (!form.firstName.trim()) e.firstName = "Required";
        if (!form.lastName.trim()) e.lastName = "Required";
        if (!form.email.trim()) e.email = "Required";
        if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
        return e;
    };

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setSubmitting(true);
        // Simulate API call — replace with real FastAPI call later
        await new Promise(r => setTimeout(r, 1200));
        setSubmitting(false);
        onSuccess({ ...form, eventId: event.id, registeredAt: new Date().toISOString() });
    };

    const field = (key, placeholder, type = "text", required = false) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <input
                type={type}
                placeholder={`${placeholder}${required ? " *" : ""}`}
                value={form[key]}
                onChange={e => { setForm(f => ({ ...f, [key]: e.target.value })); setErrors(er => ({ ...er, [key]: null })); }}
                style={{
                    background: errors[key] ? "rgba(239,68,68,0.08)" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${errors[key] ? "#ef4444" : "var(--border)"}`,
                    borderRadius: 10, padding: "12px 14px",
                    color: "var(--text)", fontSize: 14,
                    outline: "none", fontFamily: "inherit",
                }}
                onFocus={e => { if (!errors[key]) e.target.style.borderColor = "var(--blue)"; }}
                onBlur={e => { if (!errors[key]) e.target.style.borderColor = "var(--border)"; }}
            />
            {errors[key] && <span style={{ fontSize: 11, color: "#ef4444" }}>{errors[key]}</span>}
        </div>
    );

    return (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="grid-2">
                {field("firstName", "First name", "text", true)}
                {field("lastName", "Last name", "text", true)}
            </div>
            {field("email", "Email address", "email", true)}
            {field("phone", "Phone number (optional)", "tel")}
            {field("organization", "Organization / Company")}
            <select
                value={form.role}
                onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid var(--border)", borderRadius: 10,
                    padding: "12px 14px", color: form.role ? "var(--text)" : "var(--text-faint)",
                    fontSize: 14, outline: "none", fontFamily: "inherit",
                }}
            >
                <option value="" style={{ background: "#0f1a2e" }}>Your role / background</option>
                {["AI / ML Engineer", "Healthcare Professional", "Researcher / Academic",
                    "Entrepreneur / Founder", "Student", "Other"].map(r => (
                        <option key={r} value={r} style={{ background: "#0f1a2e" }}>{r}</option>
                    ))}
            </select>

            {event.location.includes("Virtual") || event.location.includes("+") ? (
                <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14, color: "var(--text-muted)" }}>
                    <input
                        type="checkbox"
                        checked={form.virtual}
                        onChange={e => setForm(f => ({ ...f, virtual: e.target.checked }))}
                        style={{ width: 16, height: 16, accentColor: "var(--blue)" }}
                    />
                    I will be attending virtually
                </label>
            ) : null}

            <button
                type="submit"
                disabled={submitting}
                style={{
                    background: submitting ? "rgba(74,143,212,0.4)" : "linear-gradient(135deg, #4A8FD4, #2d6ba8)",
                    border: "none", color: "#fff", borderRadius: 12,
                    padding: "14px", fontSize: 14, fontWeight: 700,
                    cursor: submitting ? "not-allowed" : "pointer",
                    fontFamily: "inherit", letterSpacing: "0.04em",
                    transition: "all 0.2s",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}
            >
                {submitting ? (
                    <>
                        <span style={{
                            width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)",
                            borderTopColor: "#fff", borderRadius: "50%",
                            display: "inline-block",
                            animation: "spin 0.8s linear infinite",
                        }} />
                        Registering...
                    </>
                ) : `Register for ${event.price === "Free" ? "Free" : event.price} →`}
            </button>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </form>
    );
}

export default function EventDetail() {
    const { id } = useParams();
    const event = EVENTS.find(e => e.id === id);
    const [registered, setRegistered] = useState(false);
    const [regData, setRegData] = useState(null);

    if (!event) {
        return (
            <>
                <Navbar />
                <div style={{ textAlign: "center", padding: "120px 24px", position: "relative", zIndex: 1 }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>📅</div>
                    <h1 style={{ color: "var(--text)", fontFamily: "var(--font-display)", marginBottom: 16 }}>Event not found</h1>
                    <Link to="/events" style={{ color: "var(--blue)" }}>← Back to Events</Link>
                </div>
                <Footer />
            </>
        );
    }

    const pct = Math.round((event.filled / event.spots) * 100);
    const spotsLeft = event.spots - event.filled;
    const isFull = spotsLeft <= 0;

    return (
        <>
            <CircuitBackground />
            <Navbar />

            <div style={{ position: "relative", zIndex: 1 }}>

                {/* Hero */}
                <div style={{
                    background: "linear-gradient(180deg, rgba(74,143,212,0.08) 0%, transparent 100%)",
                    borderBottom: "1px solid var(--border)", padding: "60px 24px 48px",
                }}>
                    <div style={{ maxWidth: 900, margin: "0 auto" }}>
                        <Link to="/events" style={{ color: "var(--blue)", fontSize: 13, fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 28 }}>
                            ← All Events
                        </Link>

                        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
                            <Tag label={event.type} color={TYPE_COLORS[event.type] || "var(--blue)"} />
                            <Tag label={event.price === "Free" ? "Free" : event.price} color={event.price === "Free" ? "#22c55e" : "#4A8FD4"} />
                            {isFull && <Tag label="Fully Booked" color="#ef4444" />}
                        </div>

                        <h1 style={{ fontSize: "clamp(26px, 4vw, 48px)", fontWeight: 800, color: "var(--text)", fontFamily: "var(--font-display)", lineHeight: 1.2, marginBottom: 20 }}>
                            {event.title}
                        </h1>

                        {/* Meta row */}
                        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginBottom: 24 }}>
                            {[["📅", event.date], ["🕒", event.time], ["📍", event.location]].map(([icon, val]) => (
                                <div key={val} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "var(--text-muted)" }}>
                                    <span>{icon}</span><span>{val}</span>
                                </div>
                            ))}
                        </div>

                        {/* Progress */}
                        <div style={{ maxWidth: 400 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-faint)", marginBottom: 6 }}>
                                <span>{event.filled} registered</span>
                                <span>{spotsLeft > 0 ? `${spotsLeft} spots left` : "Fully booked"}</span>
                            </div>
                            <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 99, height: 6 }}>
                                <div style={{ width: `${pct}%`, background: "linear-gradient(90deg, #4A8FD4, #7CB9E8)", borderRadius: 99, height: "100%", transition: "width 1s" }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content + Registration */}
                <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px 80px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 48, alignItems: "start" }} className="event-grid">

                        {/* Left: Description */}
                        <div>
                            {event.image && (
                                <img src={event.image} alt={event.title} style={{ width: "100%", borderRadius: 16, marginBottom: 32, objectFit: "cover", height: 280 }} />
                            )}
                            <div>{renderDescription(event.description)}</div>

                            {/* Speakers */}
                            {event.speakers?.length > 0 && (
                                <div style={{ marginTop: 36 }}>
                                    <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", fontFamily: "var(--font-display)", marginBottom: 16 }}>
                                        Facilitators
                                    </h2>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                        {event.speakers.map((s, i) => (
                                            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                                                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--blue-dim)", border: "1px solid var(--border-blue)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                                                    🧑‍💻
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>{s.name}</div>
                                                    <div style={{ fontSize: 12, color: "var(--text-faint)" }}>{s.role}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right: Registration card */}
                        <div style={{ position: "sticky", top: 90 }}>
                            <div style={{
                                background: "var(--bg-card)", border: "1px solid var(--border)",
                                borderRadius: 20, padding: 28,
                            }}>
                                {registered ? (
                                    <div style={{ textAlign: "center", padding: "20px 0" }}>
                                        <div style={{ fontSize: 52, marginBottom: 16 }}>🎉</div>
                                        <h3 style={{ fontSize: 20, fontWeight: 800, color: "#22c55e", fontFamily: "var(--font-display)", marginBottom: 10 }}>
                                            You're registered!
                                        </h3>
                                        <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.7, marginBottom: 20 }}>
                                            Confirmation sent to <strong style={{ color: "var(--text)" }}>{regData?.email}</strong>. We'll send event details closer to the date.
                                        </p>
                                        <div style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 12, padding: "16px", fontSize: 13, color: "#22c55e" }}>
                                            📅 Add to your calendar — {event.date}, {event.time}
                                        </div>
                                    </div>
                                ) : isFull ? (
                                    <div style={{ textAlign: "center", padding: "20px 0" }}>
                                        <div style={{ fontSize: 42, marginBottom: 16 }}>😔</div>
                                        <h3 style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", fontFamily: "var(--font-display)", marginBottom: 10 }}>
                                            Fully Booked
                                        </h3>
                                        <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.7 }}>
                                            This event is at capacity. Leave your email to be notified of future events.
                                        </p>
                                        <input placeholder="your@email.com" style={{ marginTop: 16, width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 14px", color: "var(--text)", fontSize: 14, outline: "none", fontFamily: "inherit" }} />
                                        <button style={{ marginTop: 10, width: "100%", background: "var(--blue-dim)", border: "1px solid var(--border-blue)", color: "var(--blue)", borderRadius: 10, padding: 12, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                                            Notify Me
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <h3 style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", fontFamily: "var(--font-display)", marginBottom: 6 }}>
                                            Register for this event
                                        </h3>
                                        <p style={{ fontSize: 13, color: "var(--text-faint)", marginBottom: 20 }}>
                                            {spotsLeft} spots remaining · {event.price === "Free" ? "No cost to attend" : `Entry: ${event.price}`}
                                        </p>
                                        <RegistrationForm
                                            event={event}
                                            onSuccess={(data) => { setRegData(data); setRegistered(true); }}
                                        />
                                    </>
                                )}
                            </div>

                            {/* Share */}
                            <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
                                <button style={{ flex: 1, background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-muted)", borderRadius: 10, padding: "10px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                                    Share on X
                                </button>
                                <button
                                    onClick={() => navigator.clipboard.writeText(window.location.href)}
                                    style={{ flex: 1, background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-muted)", borderRadius: 10, padding: "10px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
                                >
                                    Copy Link
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />

            <style>{`
        @media (max-width: 768px) {
          .event-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
        </>
    );
}
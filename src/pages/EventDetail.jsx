import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchEventBySlug, registerForEvent } from "../api/events";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Tag from "../components/ui/Tag";
import CircuitBackground from "../components/CircuitBackground";

const TYPE_COLORS = { Workshop: "#4A8FD4", Seminar: "#f59e0b", "Open Day": "#22c55e" };

function renderDescription(text) {
    if (!text) return null;
    return text.split("\n\n").map((block, i) => {
        if (block.startsWith("## ")) {
            return (
                <h2 key={i} style={{ fontSize: 20, fontWeight: 800, color: "var(--text)", fontFamily: "var(--font-display)", margin: "32px 0 14px" }}>
                    {block.replace("## ", "")}
                </h2>
            );
        }
        if (block.startsWith("**") || block.includes("\n- ")) {
            const lines = block.split("\n");
            return (
                <div key={i} style={{ marginBottom: 16 }}>
                    {lines.map((line, j) => {
                        if (line.startsWith("**") && line.endsWith("**"))
                            return <div key={j} style={{ fontWeight: 700, color: "var(--text)", marginBottom: 6, marginTop: j > 0 ? 14 : 0 }}>{line.replace(/\*\*/g, "")}</div>;
                        if (line.startsWith("- "))
                            return <div key={j} style={{ fontSize: 15, color: "var(--text-muted)", lineHeight: 1.8, paddingLeft: 16, marginBottom: 4 }}>• {line.replace("- ", "")}</div>;
                        return <div key={j} style={{ fontSize: 15, color: "var(--text-muted)", lineHeight: 1.8, marginBottom: 4 }}>{line}</div>;
                    })}
                </div>
            );
        }
        return <p key={i} style={{ fontSize: 15, color: "var(--text-muted)", lineHeight: 1.9, marginBottom: 16 }}>{block}</p>;
    });
}

function RegistrationForm({ event, onSuccess }) {
    const [form, setForm] = useState({
        first_name: "", last_name: "", email: "",
        phone: "", organization: "", attendee_role: "", virtual: false,
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [apiError, setApiError] = useState(null);

    const validate = () => {
        const e = {};
        if (!form.first_name.trim()) e.first_name = "Required";
        if (!form.last_name.trim()) e.last_name = "Required";
        if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
        return e;
    };

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setSubmitting(true);
        setApiError(null);
        try {
            await registerForEvent(event.slug, {
                first_name: form.first_name,
                last_name: form.last_name,
                email: form.email,
                phone: form.phone || null,
                organization: form.organization || null,
                attendee_role: form.attendee_role || null,
                is_virtual: form.virtual,
            });
            onSuccess({ email: form.email });
        } catch (err) {
            setApiError(err.message || "Registration failed. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const field = (key, placeholder, type = "text", required = false) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
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
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {field("first_name", "First name", "text", true)}
                {field("last_name", "Last name", "text", true)}
            </div>
            {field("email", "Email address", "email", true)}
            {field("phone", "Phone number (optional)", "tel")}
            {field("organization", "Organization / Company")}
            <select
                value={form.attendee_role}
                onChange={e => setForm(f => ({ ...f, attendee_role: e.target.value }))}
                style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid var(--border)", borderRadius: 10,
                    padding: "12px 14px", color: form.attendee_role ? "var(--text)" : "var(--text-faint)",
                    fontSize: 14, outline: "none", fontFamily: "inherit",
                }}
            >
                <option value="" style={{ background: "#0f1a2e" }}>Your role / background</option>
                {["AI / ML Engineer", "Healthcare Professional", "Researcher / Academic",
                    "Entrepreneur / Founder", "Student", "Other"].map(r => (
                        <option key={r} value={r} style={{ background: "#0f1a2e" }}>{r}</option>
                    ))}
            </select>
            {(event.location?.includes("Virtual") || event.location?.includes("+")) && (
                <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14, color: "var(--text-muted)" }}>
                    <input
                        type="checkbox"
                        checked={form.virtual}
                        onChange={e => setForm(f => ({ ...f, virtual: e.target.checked }))}
                        style={{ width: 16, height: 16, accentColor: "var(--blue)" }}
                    />
                    I will be attending virtually
                </label>
            )}
            {apiError && (
                <div style={{ fontSize: 13, color: "#ef4444", background: "rgba(239,68,68,0.08)", borderRadius: 8, padding: "10px 14px" }}>
                    {apiError}
                </div>
            )}
            <button
                type="submit"
                disabled={submitting}
                style={{
                    background: submitting ? "rgba(74,143,212,0.4)" : "linear-gradient(135deg, #4A8FD4, #2d6ba8)",
                    border: "none", color: "#fff", borderRadius: 12,
                    padding: "14px", fontSize: 14, fontWeight: 700,
                    cursor: submitting ? "not-allowed" : "pointer",
                    fontFamily: "inherit", letterSpacing: "0.04em", transition: "all 0.2s",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}
            >
                {submitting ? (
                    <>
                        <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }} />
                        Registering...
                    </>
                ) : `Register for ${event.price === "Free" ? "Free" : event.price} →`}
            </button>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </form>
    );
}

function LoadingSkeleton() {
    return (
        <div style={{ animation: "pulse 1.5s ease-in-out infinite" }}>
            <div style={{ height: 14, width: 80, background: "var(--border)", borderRadius: 6, marginBottom: 28 }} />
            <div style={{ height: 40, background: "var(--border)", borderRadius: 8, marginBottom: 12 }} />
            <div style={{ height: 40, width: "70%", background: "var(--border)", borderRadius: 8, marginBottom: 24 }} />
            <div style={{ display: "flex", gap: 24 }}>
                {[1, 2, 3].map(i => <div key={i} style={{ height: 14, width: 120, background: "var(--border)", borderRadius: 6 }} />)}
            </div>
        </div>
    );
}

export default function EventDetail() {
    const { id } = useParams(); // id = slug
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [registered, setRegistered] = useState(false);
    const [regData, setRegData] = useState(null);

    useEffect(() => {
        let cancelled = false;
        fetchEventBySlug(id)
            .then(data => {
                if (cancelled) return;
                if (!data) setNotFound(true);
                else setEvent(data);
            })
            .catch(() => { if (!cancelled) setNotFound(true); })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [id]);

    if (notFound) {
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

    const pct = event && event.spots > 0 ? Math.round((event.filled / event.spots) * 100) : 0;
    const spotsLeft = event ? event.spots - event.filled : 0;
    const isFull = event ? spotsLeft <= 0 : false;

    return (
        <>
            <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <CircuitBackground />
            <Navbar />
            <div style={{ position: "relative", zIndex: 1 }}>
                {/* Hero */}
                <div style={{ background: "linear-gradient(180deg, rgba(74,143,212,0.08) 0%, transparent 100%)", borderBottom: "1px solid var(--border)", padding: "60px 24px 48px" }}>
                    <div style={{ maxWidth: 900, margin: "0 auto" }}>
                        <Link to="/events" style={{ color: "var(--blue)", fontSize: 13, fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 28 }}>
                            ← All Events
                        </Link>
                        {loading ? <LoadingSkeleton /> : (
                            <>
                                <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
                                    <Tag label={event.type} color={TYPE_COLORS[event.type] || "var(--blue)"} />
                                    <Tag label={event.price === "Free" ? "Free" : event.price} color={event.price === "Free" ? "#22c55e" : "#4A8FD4"} />
                                    {isFull && <Tag label="Fully Booked" color="#ef4444" />}
                                </div>
                                <h1 style={{ fontSize: "clamp(26px, 4vw, 48px)", fontWeight: 800, color: "var(--text)", fontFamily: "var(--font-display)", lineHeight: 1.2, marginBottom: 20 }}>
                                    {event.title}
                                </h1>
                                <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginBottom: 24 }}>
                                    {[["📅", event.date], ["🕒", event.time], ["📍", event.location]].filter(([, v]) => v).map(([icon, val]) => (
                                        <div key={val} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "var(--text-muted)" }}>
                                            <span>{icon}</span><span>{val}</span>
                                        </div>
                                    ))}
                                </div>
                                {event.spots > 0 && (
                                    <div style={{ maxWidth: 400 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-faint)", marginBottom: 6 }}>
                                            <span>{event.filled} registered</span>
                                            <span>{spotsLeft > 0 ? `${spotsLeft} spots left` : "Fully booked"}</span>
                                        </div>
                                        <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 99, height: 6 }}>
                                            <div style={{ width: `${pct}%`, background: "linear-gradient(90deg, #4A8FD4, #7CB9E8)", borderRadius: 99, height: "100%", transition: "width 1s" }} />
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Content + Registration */}
                {!loading && event && (
                    <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px 80px" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 48, alignItems: "start" }} className="event-grid">
                            {/* Description */}
                            <div>
                                {event.image && (
                                    <img src={event.image} alt={event.title} style={{ width: "100%", borderRadius: 16, marginBottom: 32, objectFit: "cover", height: 280 }} />
                                )}
                                <div>{renderDescription(event.description)}</div>
                                {event.speakers && (
                                    <div style={{ marginTop: 36 }}>
                                        <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", fontFamily: "var(--font-display)", marginBottom: 16 }}>Facilitators</h2>
                                        <div style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.8 }}>{event.speakers}</div>
                                    </div>
                                )}
                            </div>

                            {/* Registration card */}
                            <div style={{ position: "sticky", top: 90 }}>
                                <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 20, padding: 28, width: '420px' }}>
                                    {registered ? (
                                        <div style={{ textAlign: "center", padding: "20px 0" }}>
                                            <div style={{ fontSize: 52, marginBottom: 16 }}>🎉</div>
                                            <h3 style={{ fontSize: 20, fontWeight: 800, color: "#22c55e", fontFamily: "var(--font-display)", marginBottom: 10 }}>You're registered!</h3>
                                            <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.7, marginBottom: 20 }}>
                                                Confirmation sent to <strong style={{ color: "var(--text)" }}>{regData?.email}</strong>. We'll send event details closer to the date.
                                            </p>
                                            <div style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 12, padding: "16px", fontSize: 13, color: "#22c55e" }}>
                                                📅 Add to your calendar — {event.date}{event.time ? `, ${event.time}` : ""}
                                            </div>
                                        </div>
                                    ) : isFull ? (
                                        <div style={{ textAlign: "center", padding: "20px 0" }}>
                                            <div style={{ fontSize: 42, marginBottom: 16 }}>😔</div>
                                            <h3 style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", fontFamily: "var(--font-display)", marginBottom: 10 }}>Fully Booked</h3>
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
                                            <RegistrationForm event={event} onSuccess={(data) => { setRegData(data); setRegistered(true); }} />
                                        </>
                                    )}
                                </div>
                                <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
                                    <button
                                        onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(event.title)}&url=${encodeURIComponent(window.location.href)}`, "_blank")}
                                        style={{ flex: 1, background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-muted)", borderRadius: 10, padding: "10px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                                        Share on X
                                    </button>
                                    <button
                                        onClick={() => navigator.clipboard?.writeText(window.location.href)}
                                        style={{ flex: 1, background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-muted)", borderRadius: 10, padding: "10px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                                        Copy Link
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
            <style>{`@media (max-width: 768px) { .event-grid { grid-template-columns: 1fr !important; } }`}</style>
        </>
    );
}
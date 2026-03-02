import { useState } from "react";
import SectionHeader from "./ui/SectionHeader";

const SUBJECTS = ["Partnership", "Custom AI Solution", "Course Inquiry", "Event Registration", "Press / Media", "Other"];

export default function Contact() {
    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
    const [sent, setSent] = useState(false);

    const inputStyle = {
        width: "100%", background: "rgba(255,255,255,0.04)",
        border: "1px solid var(--border)", borderRadius: 10,
        padding: "13px 16px", color: "var(--text)", fontSize: 14,
        outline: "none", fontFamily: "inherit", transition: "border 0.2s",
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSent(true);
        setForm({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setSent(false), 4000);
    };

    return (
        <div style={{
            background: "rgba(255,255,255,0.015)",
            borderTop: "1px solid var(--border)",
            position: "relative", zIndex: 1,
        }}>
            <div id="contact" className="section-wrapper">
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 60, alignItems: "start",
                }}
                    className="contact-grid">
                    {/* Info */}
                    <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--blue)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 14 }}>
                            Get In Touch
                        </div>
                        <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 800, color: "var(--text)", marginBottom: 20, fontFamily: "var(--font-display)", lineHeight: 1.2 }}>
                            Let's Build Something Meaningful
                        </h2>
                        <p style={{ fontSize: 15, color: "var(--text-muted)", lineHeight: 1.85, marginBottom: 36 }}>
                            Whether you're exploring a partnership, need a custom AI solution, or just want to talk about what's possible — we're listening.
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                            {[
                                ["📧", "hello@dftlabs.ai", "Email Us"],
                                ["🐦", "@DFTLabsAI", "Twitter / X"],
                                ["💼", "DeepFly Tech Labs", "LinkedIn"],
                            ].map(([icon, val, label]) => (
                                <div key={label} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                                    <div style={{
                                        width: 44, height: 44, borderRadius: 12,
                                        background: "rgba(74,143,212,0.1)",
                                        border: "1px solid rgba(74,143,212,0.2)",
                                        display: "flex", alignItems: "center",
                                        justifyContent: "center", fontSize: 18,
                                    }}>
                                        {icon}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 11, color: "var(--text-faint)", marginBottom: 2, letterSpacing: "0.06em" }}>{label}</div>
                                        <div style={{ fontSize: 14, color: "var(--blue)", fontWeight: 600 }}>{val}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Form */}
                    <div style={{
                        background: "var(--bg-card)", border: "1px solid var(--border)",
                        borderRadius: 20, padding: 36,
                    }}>
                        {sent ? (
                            <div style={{ textAlign: "center", padding: "40px 0" }}>
                                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                                <div style={{ fontSize: 18, fontWeight: 700, color: "#22c55e", fontFamily: "var(--font-display)", marginBottom: 8 }}>
                                    Message Sent!
                                </div>
                                <div style={{ fontSize: 14, color: "var(--text-muted)" }}>
                                    We'll get back to you within 24 hours.
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                <div className="grid-2">
                                    {[["name", "Your name", "text"], ["email", "Email address", "email"]].map(([field, ph, type]) => (
                                        <input key={field} required type={type} placeholder={ph}
                                            value={form[field]}
                                            onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}
                                            style={inputStyle}
                                            onFocus={e => e.target.style.borderColor = "var(--blue)"}
                                            onBlur={e => e.target.style.borderColor = "var(--border)"}
                                        />
                                    ))}
                                </div>
                                <select
                                    value={form.subject}
                                    onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                                    style={{ ...inputStyle, color: form.subject ? "var(--text)" : "var(--text-faint)" }}
                                >
                                    <option value="" disabled hidden>Select subject</option>
                                    {SUBJECTS.map(s => <option key={s} value={s} style={{ background: "#0f1a2e" }}>{s}</option>)}
                                </select>
                                <textarea required rows={5} placeholder="Your message..."
                                    value={form.message}
                                    onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                                    style={{ ...inputStyle, resize: "vertical" }}
                                    onFocus={e => e.target.style.borderColor = "var(--blue)"}
                                    onBlur={e => e.target.style.borderColor = "var(--border)"}
                                />
                                <button type="submit" style={{
                                    background: "linear-gradient(135deg, #4A8FD4, #2d6ba8)",
                                    border: "none", color: "#fff", borderRadius: 12,
                                    padding: 14, fontSize: 14, fontWeight: 700,
                                    cursor: "pointer", fontFamily: "inherit",
                                    letterSpacing: "0.05em", transition: "transform 0.2s",
                                }}
                                    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                                    onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                                    Send Message →
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
        </div>
    );
}
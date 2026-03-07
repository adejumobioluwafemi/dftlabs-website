
// src/components/Hero.jsx
import { STATS } from "../data/content";

export default function Hero() {
    const scrollTo = (id) =>
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

    return (
        <div style={{
            position: "relative", zIndex: 1,
            minHeight: "92vh",
            display: "flex", alignItems: "center",
            justifyContent: "center", textAlign: "center",
            padding: "60px 24px",
        }}>
            {/* Radial glow */}
            <div style={{
                position: "absolute",
                width: 700, height: 700, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(74,143,212,0.07) 0%, transparent 70%)",
                top: "50%", left: "50%",
                transform: "translate(-50%,-50%)",
                pointerEvents: "none",
            }} />

            <div style={{ maxWidth: 820, animation: "fadeUp 0.9s ease both" }}>
                {/* Badge */}
                <div style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    background: "rgba(74,143,212,0.1)",
                    border: "1px solid rgba(74,143,212,0.25)",
                    borderRadius: 99, padding: "7px 18px", marginBottom: 32,
                }}>
                    <span style={{
                        width: 7, height: 7, borderRadius: "50%",
                        background: "#22c55e", display: "inline-block",
                        animation: "pulse 2s infinite",
                    }} />
                    <span style={{
                        fontSize: 12, color: "var(--blue-light)",
                        fontWeight: 600, letterSpacing: "0.08em",
                    }}>
                        AI & AUTOMATION RESEARCH LAB
                    </span>
                </div>

                {/* Headline */}
                <h1 style={{
                    fontSize: "clamp(38px, 6vw, 76px)",
                    fontWeight: 800, lineHeight: 1.08,
                    fontFamily: "var(--font-display)", marginBottom: 24,
                }}>
                    <span style={{ color: "var(--text)" }}>Intelligent Systems</span>
                    <br />
                    <span style={{
                        background: "linear-gradient(135deg, #4A8FD4 30%, #7CB9E8 70%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}>
                        for the Real World
                    </span>
                </h1>

                <p style={{
                    fontSize: "clamp(15px, 2vw, 18px)",
                    color: "var(--text-muted)", lineHeight: 1.85,
                    maxWidth: 620, margin: "0 auto 40px", fontWeight: 300,
                }}>
                    DFT Labs builds safe, production-grade AI and automation solutions for{" "}
                    <strong style={{ color: "var(--text)", fontWeight: 600 }}>
                        Healthcare, Agriculture, Banking, and Education
                    </strong>{" "}
                    — transforming complex challenges into scalable intelligence.
                </p>

                {/* CTAs */}
                <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
                    <button
                        onClick={() => scrollTo("products")}
                        style={{
                            background: "linear-gradient(135deg, #4A8FD4, #2d6ba8)",
                            border: "none", color: "#fff", borderRadius: 12,
                            padding: "15px 34px", fontSize: 15, fontWeight: 700,
                            cursor: "pointer", fontFamily: "inherit",
                            letterSpacing: "0.04em", animation: "glow 3s ease infinite",
                            transition: "transform 0.2s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                        onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                    >
                        Explore Our Products
                    </button>
                    <button
                        onClick={() => scrollTo("contact")}
                        style={{
                            background: "rgba(74,143,212,0.08)",
                            border: "1px solid rgba(74,143,212,0.35)",
                            color: "var(--blue-light)", borderRadius: 12,
                            padding: "15px 34px", fontSize: 15, fontWeight: 600,
                            cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(74,143,212,0.15)"}
                        onMouseLeave={e => e.currentTarget.style.background = "rgba(74,143,212,0.08)"}
                    >
                        Work With Us →
                    </button>
                </div>

                {/* Stats */}
                <div style={{
                    display: "flex", gap: 40, justifyContent: "center",
                    flexWrap: "wrap", marginTop: 64, paddingTop: 48,
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                }}>
                    {STATS.map(([num, label]) => (
                        <div key={label} style={{ textAlign: "center" }}>
                            <div style={{
                                fontSize: 32, fontWeight: 800,
                                color: "var(--blue)", fontFamily: "var(--font-display)",
                            }}>
                                {num}
                            </div>
                            <div style={{ fontSize: 12, color: "var(--text-faint)", marginTop: 4, letterSpacing: "0.06em" }}>
                                {label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
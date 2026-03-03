import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CircuitBackground from "../components/CircuitBackground";

const TEAM = [
    {
        name: "Oluwafemi Adejumobi",
        role: "Founder & AI Engineer",
        bio: "AI engineer with deep expertise in Python, FastAPI, and production ML systems. Building DFT Labs to bridge the gap between frontier AI research and real-world impact across African industries.",
        avatar: "👨🏾‍💻",
        links: { x: "https://x.com/oluwabeloved", linkedin: "https://www.linkedin.com/in/oluwafemiadejumobi", github: "https://github.com/adejumobioluwafemi" },
    },
];

const VALUES = [
    { icon: "🎯", title: "Impact First", desc: "We build where AI creates the most meaningful change — healthcare outcomes, food security, financial access, and education quality." },
    { icon: "🔬", title: "Research-Grounded", desc: "Every product we ship is rooted in rigorous experimentation. We read the papers, run the benchmarks, and question the assumptions." },
    { icon: "🌍", title: "Africa-Focused", desc: "We build for African contexts first — diverse languages, variable infrastructure, local regulatory frameworks, and real community needs." },
    { icon: "🛠️", title: "Builder Culture", desc: "We're a lean, technical team. We ship fast, iterate in public, and believe the best way to learn is to build." },
];

const TIMELINE = [
    { year: "2024", event: "DFT Labs founded. First experiments in medical imaging AI." },
    { year: "Q1 2025", event: "MedScan AI v1.0 launched. First pilot with partner clinic in Lagos." },
    { year: "Q2 2025", event: "CropMind beta released. AgriBot 2.0 development begins." },
    { year: "Q3 2025", event: "VaultIQ and DocuFlow launched for banking sector clients." },
    { year: "Q4 2025", event: "LearnForge development starts. First DFT Labs workshop hosted." },
    { year: "2026", event: "MedScan AI v2.0 launched. Research Agent and Jobs Aggregator go live." },
];

export default function AboutPage() {
    return (
        <>
            <CircuitBackground />
            <Navbar />
            <div style={{ position: "relative", zIndex: 1 }}>

                {/* Hero */}
                <div style={{ maxWidth: 860, margin: "0 auto", padding: "80px 24px 60px", textAlign: "center" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--blue)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16 }}>
                        About DFT Labs
                    </div>
                    <h1 style={{ fontSize: "clamp(32px, 5vw, 60px)", fontWeight: 800, color: "var(--text)", fontFamily: "var(--font-display)", lineHeight: 1.1, marginBottom: 24 }}>
                        We Build AI That{" "}
                        <span style={{ background: "linear-gradient(135deg, #4A8FD4, #7CB9E8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                            Actually Works
                        </span>
                    </h1>
                    <p style={{ fontSize: 18, color: "var(--text-muted)", lineHeight: 1.85, maxWidth: 680, margin: "0 auto" }}>
                        DeepFly Tech Labs is an AI and automation research lab focused on building production-grade intelligent systems for Healthcare, Agriculture, Banking, and Education — with Africa at the center.
                    </p>
                </div>

                {/* Mission Statement */}
                <div style={{ background: "rgba(74,143,212,0.06)", borderTop: "1px solid rgba(74,143,212,0.15)", borderBottom: "1px solid rgba(74,143,212,0.15)" }}>
                    <div style={{ maxWidth: 860, margin: "0 auto", padding: "60px 24px", textAlign: "center" }}>
                        <div style={{ fontSize: 13, color: "var(--blue)", fontWeight: 700, letterSpacing: "0.15em", marginBottom: 20, textTransform: "uppercase" }}>
                            Our Mission
                        </div>
                        <blockquote style={{ fontSize: "clamp(18px, 2.5vw, 26px)", color: "var(--text)", fontFamily: "var(--font-display)", fontWeight: 700, lineHeight: 1.5, fontStyle: "italic", margin: 0 }}>
                            "To close the gap between frontier AI research and real-world deployment in the sectors that matter most to African communities."
                        </blockquote>
                    </div>
                </div>

                {/* Values */}
                <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px" }}>
                    <div style={{ textAlign: "center", marginBottom: 52 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--blue)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 14 }}>How We Work</div>
                        <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 800, color: "var(--text)", fontFamily: "var(--font-display)" }}>Our Values</h2>
                    </div>
                    <div className="grid-4">
                        {VALUES.map(v => (
                            <div key={v.title} style={{
                                background: "var(--bg-card)", border: "1px solid var(--border)",
                                borderRadius: 16, padding: "28px 22px",
                                transition: "all 0.3s",
                            }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(74,143,212,0.4)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                                <div style={{ fontSize: 32, marginBottom: 14 }}>{v.icon}</div>
                                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 10, fontFamily: "var(--font-display)" }}>{v.title}</div>
                                <div style={{ fontSize: 13.5, color: "var(--text-muted)", lineHeight: 1.75 }}>{v.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Timeline */}
                <div style={{ background: "rgba(255,255,255,0.015)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
                    <div style={{ maxWidth: 760, margin: "0 auto", padding: "80px 24px" }}>
                        <div style={{ textAlign: "center", marginBottom: 52 }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--blue)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 14 }}>Our Journey</div>
                            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 800, color: "var(--text)", fontFamily: "var(--font-display)" }}>Timeline</h2>
                        </div>
                        <div style={{ position: "relative", paddingLeft: 32 }}>
                            {/* Vertical line */}
                            <div style={{ position: "absolute", left: 7, top: 8, bottom: 8, width: 2, background: "linear-gradient(180deg, var(--blue), transparent)" }} />
                            {TIMELINE.map((t, i) => (
                                <div key={i} style={{ position: "relative", marginBottom: i < TIMELINE.length - 1 ? 36 : 0 }}>
                                    {/* Dot */}
                                    <div style={{ position: "absolute", left: -29, top: 4, width: 12, height: 12, borderRadius: "50%", background: "var(--blue)", border: "2px solid var(--bg)", boxShadow: "0 0 10px rgba(74,143,212,0.5)" }} />
                                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--blue)", letterSpacing: "0.08em", marginBottom: 6 }}>{t.year}</div>
                                    <div style={{ fontSize: 15, color: "var(--text-muted)", lineHeight: 1.7 }}>{t.event}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Team */}
                <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px" }}>
                    <div style={{ textAlign: "center", marginBottom: 52 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--blue)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 14 }}>The People</div>
                        <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 800, color: "var(--text)", fontFamily: "var(--font-display)" }}>Who We Are</h2>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        {TEAM.map(member => (
                            <div key={member.name} style={{
                                background: "var(--bg-card)", border: "1px solid var(--border)",
                                borderRadius: 20, padding: "36px 32px", maxWidth: 400,
                                textAlign: "center",
                            }}>
                                <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--blue-dim)", border: "2px solid var(--border-blue)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, margin: "0 auto 20px" }}>
                                    {member.avatar}
                                </div>
                                <div style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", fontFamily: "var(--font-display)", marginBottom: 6 }}>{member.name}</div>
                                <div style={{ fontSize: 13, color: "var(--blue)", fontWeight: 600, marginBottom: 16 }}>{member.role}</div>
                                <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.8, marginBottom: 20 }}>{member.bio}</p>
                                <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                                    {Object.entries(member.links).map(([platform, url]) => (
                                        <a key={platform} href={url} style={{ width: 34, height: 34, borderRadius: 8, background: "var(--blue-dim)", border: "1px solid var(--border-blue)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "var(--blue)", textDecoration: "none", fontWeight: 700 }}>
                                            {platform === "x" ? "𝕏" : platform === "linkedin" ? "in" : "gh"}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <p style={{ textAlign: "center", fontSize: 14, color: "var(--text-faint)", marginTop: 32 }}>
                        DFT Labs is a lean, solo-founded lab. As we grow, so will this team.{" "}
                        <Link to="/jobs" style={{ color: "var(--blue)", fontWeight: 600 }}>We're always looking for collaborators →</Link>
                    </p>
                </div>

                {/* CTA */}
                <div style={{ background: "rgba(74,143,212,0.06)", borderTop: "1px solid rgba(74,143,212,0.15)" }}>
                    <div style={{ maxWidth: 700, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
                        <h2 style={{ fontSize: "clamp(24px, 3.5vw, 38px)", fontWeight: 800, color: "var(--text)", fontFamily: "var(--font-display)", marginBottom: 16 }}>
                            Want to Build With Us?
                        </h2>
                        <p style={{ fontSize: 16, color: "var(--text-muted)", lineHeight: 1.8, marginBottom: 36 }}>
                            Whether it's a partnership, custom AI solution, or just a good conversation about what's possible — reach out.
                        </p>
                        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
                            <Link to="/#contact" style={{ textDecoration: "none" }}>
                                <button style={{ background: "linear-gradient(135deg, #4A8FD4, #2d6ba8)", border: "none", color: "#fff", borderRadius: 12, padding: "14px 32px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                                    Get In Touch →
                                </button>
                            </Link>
                            <Link to="/events" style={{ textDecoration: "none" }}>
                                <button style={{ background: "none", border: "1px solid var(--border-blue)", color: "var(--blue)", borderRadius: 12, padding: "14px 32px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                                    Join an Event
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
            <Footer />
        </>
    );
}
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NAV_LINKS } from "../data/content";


const SwanLogo = ({ size = 38, color = "#4A8FD4" }) => (
    <svg width={size} height={size * 0.75} viewBox="0 0 120 90" fill="none">
        <path d="M85 15 C75 5 60 8 45 11 C32 14 38 35 40 35 C42 48 55 52 55 52" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M55 52 C35 50 20 60 10 72 C5 78 10 87 25 85 C45 82 70 78 85 68 C100 58 108 44 100 30 C94 20 85 15 85 15" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M57 54 L91 49" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <path d="M52 63 L89 59" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <path d="M49 73 L83 71" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <circle cx="94" cy="48" r="3" fill={color} />
        <circle cx="92" cy="58" r="3" fill={color} />
        <circle cx="86" cy="70" r="3" fill={color} />
    </svg>
);

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const scrollTo = (label) => {
        const pageRoutes = { About: "/about", Blog: "/blog", Events: "/events", Jobs: "/jobs" };
        if (pageRoutes[label]) {
            navigate(pageRoutes[label]);
        } else {
            const el = document.getElementById(label.toLowerCase());
            if (el) el.scrollIntoView({ behavior: "smooth" });
        }
        setMobileOpen(false);
    };

    const btnBase = {
        background: "none", border: "none",
        color: "var(--text-muted)", fontSize: 13.5, fontWeight: 500,
        padding: "8px 14px", cursor: "pointer", borderRadius: 8,
        transition: "all 0.2s", fontFamily: "inherit",
    };

    return (
        <nav style={{
            position: "sticky", top: 0, zIndex: 99,
            background: scrolled ? "rgba(7,13,26,0.95)" : "transparent",
            backdropFilter: scrolled ? "blur(20px)" : "none",
            borderBottom: scrolled ? "1px solid rgba(74,143,212,0.15)" : "1px solid transparent",
            transition: "all 0.4s ease",
            padding: "0 24px",
        }}>
            <div style={{
                maxWidth: 1200, margin: "0 auto",
                display: "flex", alignItems: "center",
                justifyContent: "space-between", height: 68,
            }}>
                {/* Logo */}
                <div
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
                >
                    <SwanLogo />
                    <div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: "var(--blue)", fontFamily: "var(--font-display)", lineHeight: 1.1, letterSpacing: "0.02em" }}>DEEPFLY</div>
                        <div style={{ fontSize: 9.5, fontWeight: 500, color: "var(--text-faint)", letterSpacing: "0.25em" }}>TECH LABS</div>
                    </div>
                </div>

                {/* Desktop links */}
                <div style={{ display: "flex", gap: 4, alignItems: "center" }} className="desktop-nav">
                    {NAV_LINKS.map(l => (
                        <button
                            key={l}
                            onClick={() => scrollTo(l)}
                            style={btnBase}
                            onMouseEnter={e => { e.target.style.color = "var(--blue)"; e.target.style.background = "var(--blue-dim)"; }}
                            onMouseLeave={e => { e.target.style.color = "var(--text-muted)"; e.target.style.background = "none"; }}
                        >
                            {l}
                        </button>
                    ))}
                    <button
                        onClick={() => scrollTo("Contact")}
                        style={{
                            marginLeft: 8,
                            background: "linear-gradient(135deg, #4A8FD4, #2d6ba8)",
                            border: "none", color: "#fff", borderRadius: 10,
                            padding: "9px 22px", fontSize: 13, fontWeight: 700,
                            cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.04em",
                        }}
                    >
                        Get Started
                    </button>
                </div>

                {/* Hamburger */}
                <button
                    onClick={() => setMobileOpen(o => !o)}
                    className="mobile-btn"
                    style={{
                        background: "none",
                        border: "1px solid var(--border-blue)",
                        borderRadius: 8, padding: "8px 12px",
                        cursor: "pointer", color: "var(--blue)",
                        fontSize: 18, display: "none",
                    }}
                >
                    {mobileOpen ? "✕" : "☰"}
                </button>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div style={{
                    background: "rgba(7,13,26,0.98)",
                    backdropFilter: "blur(20px)",
                    borderTop: "1px solid rgba(74,143,212,0.15)",
                    padding: "16px 24px 24px",
                }}>
                    {NAV_LINKS.map(l => (
                        <button
                            key={l}
                            onClick={() => scrollTo(l)}
                            style={{
                                ...btnBase,
                                display: "block", width: "100%",
                                padding: "13px 0", textAlign: "left",
                                borderBottom: "1px solid rgba(255,255,255,0.05)",
                                borderRadius: 0, fontSize: 15,
                            }}
                        >
                            {l}
                        </button>
                    ))}
                    <button
                        onClick={() => scrollTo("Contact")}
                        style={{
                            marginTop: 16, width: "100%",
                            background: "linear-gradient(135deg, #4A8FD4, #2d6ba8)",
                            border: "none", color: "#fff", borderRadius: 10,
                            padding: "13px", fontSize: 14, fontWeight: 700,
                            cursor: "pointer", fontFamily: "inherit",
                        }}
                    >
                        Get Started
                    </button>
                </div>
            )}

            <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-btn  { display: block !important; }
        }
      `}</style>
        </nav>
    );
}
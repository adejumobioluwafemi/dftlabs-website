// src/components/Navbar.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { NAV_LINKS } from "../data/content";
import Logo from "./ui/Logo";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const isHome = location.pathname === "/";

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Handle scroll-after-navigate (when coming back to home from another page)
    useEffect(() => {
        if (isHome && location.state?.scrollTo) {
            const id = location.state.scrollTo;
            // Small delay to let the page render
            setTimeout(() => {
                const el = document.getElementById(id);
                if (el) el.scrollIntoView({ behavior: "smooth" });
            }, 100);
            // Clear the state so it doesn't re-scroll on re-renders
            navigate("/", { replace: true, state: {} });
        }
    }, [isHome, location.state]);

    const handleLogoClick = () => {
        if (isHome) {
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
            navigate("/");
        }
    };

    const scrollTo = (label) => {
        const pageRoutes = {
            About: "/about",
            Blog: "/blog",
            Events: "/events",
            Jobs: "/jobs",
            //Courses: "/courses",
            Products: "/products",
        };

        if (pageRoutes[label]) {
            navigate(pageRoutes[label]);
        } else if (!isHome) {
            navigate("/", { state: { scrollTo: label.toLowerCase() } });
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
                {/* Logo — navigates home from any page */}
                <div
                    onClick={handleLogoClick}
                    style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
                    title="Go to homepage"
                >
                    <Logo height={85} />
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
                        onClick={() => {
                            if (!isHome) navigate("/", { state: { scrollTo: "contact" } });
                            else document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                        }}
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
                        onClick={() => {
                            if (!isHome) navigate("/", { state: { scrollTo: "contact" } });
                            else document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                            setMobileOpen(false);
                        }}
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
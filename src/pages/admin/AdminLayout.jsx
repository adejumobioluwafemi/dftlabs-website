import { useState, useEffect, useCallback } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { SessionExpiredError } from "../../api/adminApi";

const NAV_ITEMS = [
    { path: "/admin", icon: "⚡", label: "Dashboard" },
    { path: "/admin/blog", icon: "✍️", label: "Blog" },
    { path: "/admin/jobs", icon: "💼", label: "Jobs" },
    { path: "/admin/events", icon: "📅", label: "Events" },
    { path: "/admin/products", icon: "📦", label: "Products" },
];

// Session expired modal
function SessionExpiredModal({ onReLogin }) {
    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
            <div style={{ background: "#0d1929", border: "1px solid rgba(239,68,68,0.4)", borderRadius: 20, padding: "40px 36px", width: "100%", maxWidth: 400, textAlign: "center" }}>
                <div style={{ fontSize: 44, marginBottom: 16 }}>⏱</div>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", fontFamily: "var(--font-display)", marginBottom: 10 }}>
                    Session Expired
                </h2>
                <p style={{ fontSize: 14, color: "var(--text-faint)", marginBottom: 32, lineHeight: 1.7 }}>
                    Your admin session has timed out due to inactivity. Please log in again to continue.
                </p>
                <button
                    onClick={onReLogin}
                    style={{ background: "linear-gradient(135deg, #4A8FD4, #2d6ba8)", border: "none", color: "#fff", borderRadius: 12, padding: "13px 32px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", width: "100%" }}
                >
                    Log In Again →
                </button>
            </div>
        </div>
    );
}

// Login screen
function LoginScreen() {
    const { login } = useAuth();
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [shake, setShake] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const ok = await login(password);
        setLoading(false);
        if (!ok) {
            setError(true);
            setShake(true);
            setTimeout(() => setShake(false), 600);
        }
    };

    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", padding: 24 }}>
            <div style={{
                background: "#0d1929", border: "1px solid var(--border)",
                borderRadius: 20, padding: "48px 40px",
                width: "100%", maxWidth: 420, textAlign: "center",
                animation: shake ? "shake 0.5s ease" : "none",
            }}>
                <div style={{ fontSize: 42, marginBottom: 16 }}>🔒</div>
                <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text)", fontFamily: "var(--font-display)", marginBottom: 8 }}>Admin Access</h1>
                <p style={{ fontSize: 14, color: "var(--text-faint)", marginBottom: 32 }}>DFT Labs Internal Panel</p>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <input
                        type="password"
                        placeholder="Enter admin password"
                        value={password}
                        onChange={e => { setPassword(e.target.value); setError(false); }}
                        style={{
                            background: error ? "rgba(239,68,68,0.08)" : "rgba(255,255,255,0.04)",
                            border: `1px solid ${error ? "#ef4444" : "var(--border)"}`,
                            borderRadius: 10, padding: "13px 16px",
                            color: "var(--text)", fontSize: 14,
                            outline: "none", fontFamily: "inherit",
                            textAlign: "center", letterSpacing: "0.1em",
                        }}
                        autoFocus
                    />
                    {error && <div style={{ fontSize: 13, color: "#ef4444" }}>Incorrect password</div>}
                    <button type="submit" disabled={loading} style={{ background: "linear-gradient(135deg, #4A8FD4, #2d6ba8)", border: "none", color: "#fff", borderRadius: 12, padding: 14, fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
                        {loading ? "Checking..." : "Enter Admin Panel →"}
                    </button>
                </form>
            </div>
            <style>{`
                @keyframes shake {
                    0%,100% { transform: translateX(0); }
                    20%,60%  { transform: translateX(-8px); }
                    40%,80%  { transform: translateX(8px); }
                }
            `}</style>
        </div>
    );
}

export default function AdminLayout() {
    const { isAuthenticated, logout } = useAuth();
    const location = useLocation();
    const [sessionExpired, setSessionExpired] = useState(false);

    // Global 401 / SessionExpiredError handler
    // Child pages bubble up errors — we listen via window event
    useEffect(() => {
        const handler = (e) => {
            if (e.detail?.type === "SessionExpiredError") {
                setSessionExpired(true);
            }
        };
        window.addEventListener("adminSessionExpired", handler);
        return () => window.removeEventListener("adminSessionExpired", handler);
    }, []);

    const handleReLogin = useCallback(() => {
        setSessionExpired(false);
        logout();
    }, [logout]);

    if (!isAuthenticated) return <LoginScreen />;

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)", fontFamily: "var(--font-body)" }}>
            {/* Session expired modal — shown over everything */}
            {sessionExpired && <SessionExpiredModal onReLogin={handleReLogin} />}

            {/* Sidebar */}
            <aside style={{
                width: 240, flexShrink: 0,
                background: "rgba(255,255,255,0.02)",
                borderRight: "1px solid var(--border)",
                padding: "28px 16px",
                display: "flex", flexDirection: "column",
                position: "sticky", top: 0, height: "100vh",
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 40, paddingLeft: 8 }}>
                    <div style={{ fontSize: 22 }}>🦢</div>
                    <div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: "var(--blue)", fontFamily: "var(--font-display)" }}>DFT LABS</div>
                        <div style={{ fontSize: 10, color: "var(--text-faint)", letterSpacing: "0.15em" }}>ADMIN PANEL</div>
                    </div>
                </div>
                <nav style={{ flex: 1 }}>
                    {NAV_ITEMS.map(item => {
                        const active = location.pathname === item.path;
                        return (
                            <Link key={item.path} to={item.path} style={{ textDecoration: "none" }}>
                                <div style={{
                                    display: "flex", alignItems: "center", gap: 12,
                                    padding: "11px 14px", borderRadius: 10, marginBottom: 4,
                                    background: active ? "var(--blue-dim)" : "transparent",
                                    color: active ? "var(--blue)" : "var(--text-muted)",
                                    fontWeight: active ? 700 : 400, fontSize: 14,
                                    transition: "all 0.2s",
                                    border: `1px solid ${active ? "var(--border-blue)" : "transparent"}`,
                                }}
                                    onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "var(--text)"; } }}
                                    onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-muted)"; } }}
                                >
                                    <span>{item.icon}</span>
                                    <span>{item.label}</span>
                                </div>
                            </Link>
                        );
                    })}
                </nav>
                <div style={{ paddingTop: 16, borderTop: "1px solid var(--border)" }}>
                    <Link to="/" style={{ textDecoration: "none" }}>
                        <div style={{ fontSize: 13, color: "var(--text-faint)", padding: "10px 14px", marginBottom: 4, cursor: "pointer" }}>
                            ← View Site
                        </div>
                    </Link>
                    <button onClick={logout} style={{ width: "100%", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", borderRadius: 10, padding: "10px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>
                        🚪 Logout
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main style={{ flex: 1, padding: "36px 40px", overflowY: "auto" }}>
                <Outlet />
            </main>
        </div>
    );
}
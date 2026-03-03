import { Link } from "react-router-dom";
import CircuitBackground from "../components/CircuitBackground";

export default function NotFound() {
    return (
        <>
            <CircuitBackground />
            <div style={{
                minHeight: "100vh", display: "flex",
                flexDirection: "column", alignItems: "center",
                justifyContent: "center", textAlign: "center",
                padding: 24, position: "relative", zIndex: 1,
            }}>
                <div style={{ fontSize: 80, marginBottom: 16 }}>🦢</div>
                <h1 style={{ fontSize: 80, fontWeight: 800, color: "var(--blue)", fontFamily: "var(--font-display)", lineHeight: 1, marginBottom: 16 }}>
                    404
                </h1>
                <p style={{ fontSize: 18, color: "var(--text-muted)", marginBottom: 36 }}>
                    This page doesn't exist — yet.
                </p>
                <Link to="/" style={{
                    background: "linear-gradient(135deg, #4A8FD4, #2d6ba8)",
                    color: "#fff", textDecoration: "none",
                    borderRadius: 12, padding: "13px 32px",
                    fontSize: 14, fontWeight: 700,
                }}>
                    ← Back to Home
                </Link>
            </div>
        </>
    );
}
const SwanLogo = ({ size = 32, color = "#4A8FD4" }) => (
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

const FOOTER_LINKS = [
    ["Products", ["MedScan AI", "CropMind", "VaultIQ", "LearnForge", "AgriBot 2.0"]],
    ["Resources", ["Blog", "Courses", "Research", "Documentation", "API Docs"]],
    ["Company", ["About Us", "Events", "Jobs Board", "Press Kit", "Contact"]],
];

export default function Footer() {
    return (
        <footer style={{
            background: "#04090f",
            borderTop: "1px solid rgba(74,143,212,0.12)",
            position: "relative", zIndex: 1,
        }}>
            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "56px 24px 32px" }}>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr 1fr 1fr",
                    gap: 40, marginBottom: 48,
                }} className="footer-grid">
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                            <SwanLogo />
                            <div>
                                <div style={{ fontSize: 15, fontWeight: 800, color: "var(--blue)", fontFamily: "var(--font-display)" }}>DEEPFLY</div>
                                <div style={{ fontSize: 8.5, color: "var(--text-faint)", letterSpacing: "0.2em" }}>TECH LABS</div>
                            </div>
                        </div>
                        <p style={{ fontSize: 13.5, color: "var(--text-faint)", lineHeight: 1.8, maxWidth: 280 }}>
                            Building intelligent systems that transform Healthcare, Agriculture, Banking, and Education.
                        </p>
                        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                            {["𝕏", "in", "gh", "▶"].map(s => (
                                <div key={s} style={{
                                    width: 34, height: 34, borderRadius: 8,
                                    background: "rgba(74,143,212,0.08)",
                                    border: "1px solid rgba(74,143,212,0.2)",
                                    display: "flex", alignItems: "center",
                                    justifyContent: "center", fontSize: 13,
                                    color: "var(--blue)", cursor: "pointer", fontWeight: 700,
                                }}>
                                    {s}
                                </div>
                            ))}
                        </div>
                    </div>

                    {FOOTER_LINKS.map(([heading, links]) => (
                        <div key={heading}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", letterSpacing: "0.1em", marginBottom: 18, textTransform: "uppercase" }}>
                                {heading}
                            </div>
                            {links.map(l => (
                                <div key={l} style={{ fontSize: 13.5, color: "var(--text-faint)", marginBottom: 10, cursor: "pointer", transition: "color 0.2s" }}
                                    onMouseEnter={e => e.target.style.color = "var(--blue)"}
                                    onMouseLeave={e => e.target.style.color = "var(--text-faint)"}>
                                    {l}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                <div style={{
                    borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24,
                    display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
                }}>
                    <div style={{ fontSize: 12, color: "var(--text-faint)" }}>
                        © 2026 DeepFly Tech Labs. All rights reserved.
                    </div>
                    <div style={{ display: "flex", gap: 24 }}>
                        {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(l => (
                            <span key={l} style={{ fontSize: 12, color: "var(--text-faint)", cursor: "pointer", transition: "color 0.2s" }}
                                onMouseEnter={e => e.target.style.color = "var(--blue)"}
                                onMouseLeave={e => e.target.style.color = "var(--text-faint)"}>
                                {l}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
        @media (max-width: 1024px) { .footer-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 480px)  { .footer-grid { grid-template-columns: 1fr !important; } }
      `}</style>
        </footer>
    );
}
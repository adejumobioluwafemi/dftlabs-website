export default function SectionHeader({ eyebrow, title, sub }) {
    return (
        <div style={{ marginBottom: 56, textAlign: "center" }}>
            <div style={{
                fontSize: 11, fontWeight: 700, color: "var(--blue)",
                letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 14,
            }}>
                {eyebrow}
            </div>
            <h2 style={{
                fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800,
                color: "var(--text)", margin: "0 0 16px",
                fontFamily: "var(--font-display)", lineHeight: 1.15,
            }}>
                {title}
            </h2>
            {sub && (
                <p style={{
                    fontSize: 16, color: "var(--text-muted)",
                    maxWidth: 580, margin: "0 auto", lineHeight: 1.8,
                }}>
                    {sub}
                </p>
            )}
        </div>
    );
}
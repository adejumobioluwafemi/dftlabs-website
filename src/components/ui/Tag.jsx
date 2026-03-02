export default function Tag({ label, color }) {
    return (
        <span style={{
            background: `${color}22`,
            color,
            border: `1px solid ${color}44`,
            borderRadius: 4,
            fontSize: 11,
            fontWeight: 700,
            padding: "2px 9px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
        }}>
            {label}
        </span>
    );
}
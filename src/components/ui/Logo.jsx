
export default function Logo({ height = 100, className = "" }) {
    return (
        <img
            src="/logo.svg"
            alt="DeepFly Tech Labs"
            height={height}
            className={className}
            style={{ display: "block", objectFit: "contain" }}
        />
    );
}
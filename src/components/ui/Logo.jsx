
export default function Logo({ height = 48, className = "" }) {
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
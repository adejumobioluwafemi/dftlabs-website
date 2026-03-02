import { useEffect, useRef } from "react";

export default function CircuitBackground() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        let animFrame;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        const nodes = Array.from({ length: 40 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            r: Math.random() * 2 + 1,
            pulse: Math.random() * Math.PI * 2,
        }));

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            nodes.forEach(n => {
                n.x += n.vx; n.y += n.vy; n.pulse += 0.02;
                if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
                if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
            });

            nodes.forEach((a, i) => {
                nodes.slice(i + 1).forEach(b => {
                    const d = Math.hypot(a.x - b.x, a.y - b.y);
                    if (d < 170) {
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.strokeStyle = `rgba(74,143,212,${0.13 * (1 - d / 170)})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                });
                const alpha = 0.15 + 0.1 * Math.sin(a.pulse);
                ctx.beginPath();
                ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(74,143,212,${alpha})`;
                ctx.fill();
            });

            animFrame = requestAnimationFrame(draw);
        };
        draw();

        return () => {
            cancelAnimationFrame(animFrame);
            window.removeEventListener("resize", resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "fixed", inset: 0,
                zIndex: 0, pointerEvents: "none",
            }}
        />
    );
}
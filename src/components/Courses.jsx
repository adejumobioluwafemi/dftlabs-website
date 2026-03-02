import { COURSES } from "../data/content";
import SectionHeader from "./ui/SectionHeader";
import Tag from "./ui/Tag";

const LEVEL_COLORS = { Beginner: "#22c55e", Intermediate: "#f59e0b", Advanced: "#ef4444" };

export default function Courses() {
    return (
        <div style={{ position: "relative", zIndex: 1 }}>
            <div id="courses" className="section-wrapper">
                <SectionHeader
                    eyebrow="Knowledge Hub"
                    title="Courses & Learning Paths"
                    sub="Hands-on AI and automation training from practitioners — built for engineers and domain experts."
                />
                <div className="grid-3">
                    {COURSES.map(c => (
                        <div key={c.title} style={{
                            background: "var(--bg-card)", border: "1px solid var(--border)",
                            borderRadius: 16, overflow: "hidden", transition: "all 0.3s",
                        }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(74,143,212,0.4)"}
                            onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
                            <div style={{ height: 6, background: "linear-gradient(90deg, #4A8FD4, #7CB9E8)" }} />
                            <div style={{ padding: 24 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                                    <Tag label={c.level} color={LEVEL_COLORS[c.level]} />
                                    <span style={{ fontSize: 20, fontWeight: 800, color: "var(--blue)", fontFamily: "var(--font-display)" }}>
                                        {c.price}
                                    </span>
                                </div>
                                <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", margin: "14px 0 8px", fontFamily: "var(--font-display)" }}>
                                    {c.title}
                                </div>
                                <div style={{ fontSize: 12.5, color: "var(--text-faint)" }}>
                                    ⏱ {c.duration} · 👥 {c.students.toLocaleString()} enrolled
                                </div>
                                <button style={{
                                    marginTop: 20, width: "100%",
                                    background: "rgba(74,143,212,0.1)",
                                    border: "1px solid var(--border-blue)",
                                    color: "var(--blue)", borderRadius: 10,
                                    padding: 11, fontSize: 13, fontWeight: 600,
                                    cursor: "pointer", fontFamily: "inherit",
                                }}>
                                    Enroll Now →
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
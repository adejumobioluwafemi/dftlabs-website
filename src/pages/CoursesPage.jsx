// src/pages/CoursesPage.jsx
// Full courses page — static frontend (no backend yet)
// Features: difficulty filter, duration, enrollment CTA, progress tracking if "logged in"
import { useState } from "react";

const COURSES_DATA = [
    {
        id: "applied-ml-healthcare",
        title: "Applied ML for Healthcare",
        subtitle: "Diagnose smarter with deep learning",
        level: "Intermediate",
        duration: "6 weeks",
        lessons: 24,
        students: 340,
        price: "$149",
        isFree: false,
        sector: "Healthcare",
        image: "🏥",
        rating: 4.8,
        reviews: 62,
        topics: ["Medical imaging with PyTorch", "Clinical decision support pipelines", "Model explainability (SHAP, Grad-CAM)", "Deployment on edge devices", "Regulatory considerations for health AI"],
        description: "A hands-on course for healthcare professionals and AI engineers building clinical AI systems. Train image classification models on real medical datasets and learn how to deploy them responsibly.",
        certificate: true,
        progress: 65,
    },
    {
        id: "llm-engineering-bootcamp",
        title: "LLM Engineering Bootcamp",
        subtitle: "Build production-grade AI agents",
        level: "Advanced",
        duration: "8 weeks",
        lessons: 32,
        students: 580,
        price: "$199",
        isFree: false,
        sector: "General",
        image: "🤖",
        rating: 4.9,
        reviews: 114,
        topics: ["LLM fundamentals & architecture", "Prompt engineering at scale", "RAG pipelines with LangChain", "Building ReAct agents", "Fine-tuning with LoRA/QLoRA", "Production deployment & monitoring"],
        description: "The most comprehensive LLM engineering course available. Go from transformer internals to shipping autonomous agents in production.",
        certificate: true,
        progress: 0,
    },
    {
        id: "ai-automation-python",
        title: "AI Automation with Python",
        subtitle: "Automate smarter, not harder",
        level: "Beginner",
        duration: "4 weeks",
        lessons: 16,
        students: 920,
        price: "Free",
        isFree: true,
        sector: "General",
        image: "🐍",
        rating: 4.7,
        reviews: 210,
        topics: ["Python for automation essentials", "Scraping & data pipelines", "Working with AI APIs (OpenAI, Claude)", "Building simple agents", "Scheduling & deployment basics"],
        description: "Your entry point into AI-powered automation. No prior ML experience needed — just Python basics. Perfect for developers, analysts, and domain experts.",
        certificate: false,
        progress: 100,
    },
    {
        id: "precision-agriculture-ai",
        title: "Precision Agriculture with AI",
        subtitle: "From satellite data to field intelligence",
        level: "Intermediate",
        duration: "5 weeks",
        lessons: 20,
        students: 178,
        price: "$129",
        isFree: false,
        sector: "Agriculture",
        image: "🌾",
        rating: 4.6,
        reviews: 34,
        topics: ["Satellite & drone imagery processing", "Crop disease classification", "Yield prediction models", "CropMind API integration", "Case studies: West African farms"],
        description: "Built for agritech engineers and agronomists. Process geospatial data, train crop monitoring models, and deploy them in real farming environments.",
        certificate: true,
        progress: 0,
    },
    {
        id: "fraud-detection-ml",
        title: "Fraud Detection with ML",
        subtitle: "Protect financial systems with AI",
        level: "Advanced",
        duration: "6 weeks",
        lessons: 22,
        students: 245,
        price: "$179",
        isFree: false,
        sector: "Banking",
        image: "🏦",
        rating: 4.8,
        reviews: 47,
        topics: ["Anomaly detection fundamentals", "Graph neural networks for fraud", "Imbalanced dataset strategies", "Real-time scoring pipelines", "Explainability for compliance (SHAP)"],
        description: "A practitioner-focused course on building fraud detection systems that work in production. Built by the team behind VaultIQ.",
        certificate: true,
        progress: 30,
    },
    {
        id: "adaptive-learning-systems",
        title: "Building Adaptive Learning Systems",
        subtitle: "Personalize education at scale",
        level: "Intermediate",
        duration: "5 weeks",
        lessons: 18,
        students: 122,
        price: "$139",
        isFree: false,
        sector: "Education",
        image: "🎓",
        rating: 4.5,
        reviews: 28,
        topics: ["Student performance modeling", "Knowledge graph construction", "Curriculum recommendation engines", "NLP for essay grading", "LLM tutors with guardrails"],
        description: "Build the next generation of EdTech — AI systems that adapt in real time to student needs. Includes hands-on projects with LearnForge's open datasets.",
        certificate: true,
        progress: 0,
    },
];

const LEVELS = ["All", "Beginner", "Intermediate", "Advanced"];
const SECTORS = ["All", "General", "Healthcare", "Agriculture", "Banking", "Education"];
const LEVEL_COLORS = { Beginner: "#22c55e", Intermediate: "#f59e0b", Advanced: "#ef4444" };
const SECTOR_COLORS = { Healthcare: "#22c55e", Agriculture: "#84cc16", Banking: "#f59e0b", Education: "#8b5cf6", General: "#4A8FD4" };

// Simulated logged-in state — replace with useAuth() when backend auth is wired
const IS_LOGGED_IN = true;

function ProgressBar({ pct, color = "#4A8FD4" }) {
    return (
        <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 99, height: 6, overflow: "hidden" }}>
            <div style={{
                width: `${pct}%`, height: "100%", borderRadius: 99,
                background: pct === 100 ? "#22c55e" : `linear-gradient(90deg, ${color}, #7CB9E8)`,
                transition: "width 0.8s ease",
            }} />
        </div>
    );
}

function CourseCard({ course, onEnroll }) {
    const hasProgress = IS_LOGGED_IN && course.progress > 0;
    const isCompleted = course.progress === 100;

    return (
        <div style={{
            background: "var(--bg-card)", border: "1px solid var(--border)",
            borderRadius: 18, overflow: "hidden", transition: "all 0.3s",
            display: "flex", flexDirection: "column",
        }}
            onMouseEnter={e => {
                e.currentTarget.style.borderColor = "rgba(74,143,212,0.4)";
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 12px 40px rgba(74,143,212,0.12)";
            }}
            onMouseLeave={e => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
            }}
        >
            <div style={{ height: 5, background: `linear-gradient(90deg, ${LEVEL_COLORS[course.level]}, ${SECTOR_COLORS[course.sector] || "#4A8FD4"})` }} />
            <div style={{ padding: "24px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ fontSize: 40 }}>{course.image}</div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                    <span style={{
                        background: `${LEVEL_COLORS[course.level]}22`, color: LEVEL_COLORS[course.level],
                        border: `1px solid ${LEVEL_COLORS[course.level]}44`,
                        fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99, letterSpacing: "0.06em",
                    }}>{course.level}</span>
                    <span style={{ fontSize: 20, fontWeight: 800, color: course.isFree ? "#22c55e" : "var(--blue)", fontFamily: "var(--font-display)" }}>
                        {course.price}
                    </span>
                </div>
            </div>
            <div style={{ padding: "16px 24px 24px", flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: 17, fontWeight: 700, color: "var(--text)", marginBottom: 4, fontFamily: "var(--font-display)", lineHeight: 1.3 }}>
                    {course.title}
                </div>
                <div style={{ fontSize: 12.5, color: "var(--blue)", marginBottom: 10, fontWeight: 500 }}>{course.subtitle}</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.65, marginBottom: 14, flex: 1 }}>{course.description}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 12, fontSize: 12, color: "var(--text-faint)" }}>
                    <span>⏱ {course.duration}</span>
                    <span>📚 {course.lessons} lessons</span>
                    <span>👥 {course.students.toLocaleString()}</span>
                    {course.certificate && <span>🏆 Certificate</span>}
                </div>
                <div style={{ marginBottom: 14 }}>
                    <span style={{ color: "#f59e0b", fontSize: 13 }}>{"★".repeat(Math.floor(course.rating))}</span>
                    <span style={{ color: "var(--text-faint)", fontSize: 12, marginLeft: 4 }}>{course.rating} ({course.reviews} reviews)</span>
                </div>

                {hasProgress && (
                    <div style={{ marginBottom: 14 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-faint)", marginBottom: 6 }}>
                            <span>{isCompleted ? "✅ Completed" : `${course.progress}% complete`}</span>
                            {!isCompleted && <span>{Math.round((course.lessons * course.progress) / 100)}/{course.lessons} lessons</span>}
                        </div>
                        <ProgressBar pct={course.progress} color={LEVEL_COLORS[course.level]} />
                    </div>
                )}

                <button onClick={() => onEnroll(course)} style={{
                    width: "100%", borderRadius: 10, padding: "11px 16px",
                    fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
                    ...(isCompleted
                        ? { background: "rgba(34,197,94,0.1)", border: "1px solid #22c55e44", color: "#22c55e" }
                        : hasProgress
                            ? { background: "linear-gradient(135deg, #4A8FD4, #2d6ba8)", border: "none", color: "#fff" }
                            : course.isFree
                                ? { background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", color: "#22c55e" }
                                : { background: "rgba(74,143,212,0.1)", border: "1px solid var(--border-blue)", color: "var(--blue)" }),
                }}>
                    {isCompleted ? "View Certificate →" : hasProgress ? "Continue Learning →" : course.isFree ? "Enroll Free →" : `Enroll for ${course.price} →`}
                </button>
            </div>
        </div>
    );
}

export default function CoursesPage() {
    const [levelFilter, setLevelFilter] = useState("All");
    const [sectorFilter, setSectorFilter] = useState("All");
    const [search, setSearch] = useState("");
    const [modal, setModal] = useState(null);

    const filtered = COURSES_DATA.filter(c => {
        if (levelFilter !== "All" && c.level !== levelFilter) return false;
        if (sectorFilter !== "All" && c.sector !== sectorFilter) return false;
        if (search && !c.title.toLowerCase().includes(search.toLowerCase()) && !c.description.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    const inProgress = IS_LOGGED_IN ? COURSES_DATA.filter(c => c.progress > 0 && c.progress < 100) : [];
    const completed = IS_LOGGED_IN ? COURSES_DATA.filter(c => c.progress === 100) : [];

    return (
        <div style={{ minHeight: "100vh", position: "relative", zIndex: 1 }}>

            {/* Hero */}
            <div style={{
                background: "linear-gradient(180deg, rgba(74,143,212,0.08) 0%, transparent 100%)",
                borderBottom: "1px solid var(--border)",
                padding: "60px 24px 48px", textAlign: "center",
            }}>
                <div style={{ maxWidth: 700, margin: "0 auto" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--blue)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 14 }}>Knowledge Hub</div>
                    <h1 style={{ fontSize: "clamp(30px, 5vw, 52px)", fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--text)", marginBottom: 16, lineHeight: 1.1 }}>
                        Courses &{" "}
                        <span style={{ background: "linear-gradient(135deg, #4A8FD4, #7CB9E8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Learning Paths</span>
                    </h1>
                    <p style={{ fontSize: 16, color: "var(--text-muted)", lineHeight: 1.8 }}>
                        Hands-on AI and automation training from practitioners — built for engineers and domain experts.
                    </p>
                    <div style={{ display: "flex", gap: 32, justifyContent: "center", marginTop: 28, flexWrap: "wrap" }}>
                        {[["6", "Courses"], ["2,385+", "Students"], ["4", "Sectors"], ["4.7★", "Avg Rating"]].map(([n, l]) => (
                            <div key={l} style={{ textAlign: "center" }}>
                                <div style={{ fontSize: 22, fontWeight: 800, color: "var(--blue)", fontFamily: "var(--font-display)" }}>{n}</div>
                                <div style={{ fontSize: 12, color: "var(--text-faint)" }}>{l}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px" }}>

                {/* My Learning */}
                {IS_LOGGED_IN && (inProgress.length > 0 || completed.length > 0) && (
                    <div style={{ marginBottom: 52 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--blue)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 18 }}>My Learning</div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
                            {[...inProgress, ...completed].map(c => (
                                <div key={c.id} style={{
                                    background: "var(--bg-card)", border: "1px solid var(--border)",
                                    borderRadius: 14, padding: "18px 20px",
                                    display: "flex", gap: 14, alignItems: "center",
                                }}>
                                    <div style={{ fontSize: 28, flexShrink: 0 }}>{c.image}</div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--text)", marginBottom: 6, fontFamily: "var(--font-display)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.title}</div>
                                        <ProgressBar pct={c.progress} color={LEVEL_COLORS[c.level]} />
                                        <div style={{ fontSize: 11, color: c.progress === 100 ? "#22c55e" : "var(--text-faint)", marginTop: 5 }}>
                                            {c.progress === 100 ? "✅ Completed" : `${c.progress}% · ${Math.round((c.lessons * c.progress) / 100)}/${c.lessons} lessons`}
                                        </div>
                                    </div>
                                    <button onClick={() => setModal(c)} style={{
                                        flexShrink: 0, background: "var(--blue-dim)", border: "1px solid var(--border-blue)",
                                        color: "var(--blue)", borderRadius: 8, padding: "7px 12px",
                                        fontSize: 12, fontWeight: 600, cursor: "pointer",
                                    }}>
                                        {c.progress === 100 ? "Review" : "Continue"}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Filters */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 36, alignItems: "center" }}>
                    <input
                        placeholder="Search courses..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{
                            background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)",
                            borderRadius: 10, padding: "10px 16px", color: "var(--text)",
                            fontSize: 13.5, outline: "none", fontFamily: "inherit",
                            minWidth: 200, flex: "1 1 200px",
                        }}
                        onFocus={e => e.target.style.borderColor = "var(--blue)"}
                        onBlur={e => e.target.style.borderColor = "var(--border)"}
                    />
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {LEVELS.map(l => (
                            <button key={l} onClick={() => setLevelFilter(l)} style={{
                                background: levelFilter === l ? "rgba(74,143,212,0.15)" : "rgba(255,255,255,0.04)",
                                border: `1px solid ${levelFilter === l ? "var(--blue)" : "var(--border)"}`,
                                color: levelFilter === l ? "var(--blue)" : "var(--text-muted)",
                                borderRadius: 8, padding: "8px 14px", fontSize: 12.5, fontWeight: 600,
                                cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
                            }}>{l}</button>
                        ))}
                    </div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {SECTORS.map(s => (
                            <button key={s} onClick={() => setSectorFilter(s)} style={{
                                background: sectorFilter === s ? "rgba(74,143,212,0.15)" : "rgba(255,255,255,0.04)",
                                border: `1px solid ${sectorFilter === s ? "var(--blue)" : "var(--border)"}`,
                                color: sectorFilter === s ? "var(--blue)" : "var(--text-muted)",
                                borderRadius: 8, padding: "8px 14px", fontSize: 12.5, fontWeight: 600,
                                cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
                            }}>{s}</button>
                        ))}
                    </div>
                </div>

                <div style={{ fontSize: 13, color: "var(--text-faint)", marginBottom: 22 }}>
                    {filtered.length} course{filtered.length !== 1 ? "s" : ""} found
                </div>

                {filtered.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
                        <div style={{ fontSize: 40, marginBottom: 14 }}>🔍</div>
                        <div style={{ fontSize: 16, fontWeight: 600 }}>No courses match your filters</div>
                        <button onClick={() => { setLevelFilter("All"); setSectorFilter("All"); setSearch(""); }}
                            style={{ marginTop: 14, background: "none", border: "1px solid var(--border-blue)", color: "var(--blue)", borderRadius: 8, padding: "8px 20px", fontSize: 13, cursor: "pointer" }}>
                            Clear filters
                        </button>
                    </div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24 }}>
                        {filtered.map(c => <CourseCard key={c.id} course={c} onEnroll={setModal} />)}
                    </div>
                )}
            </div>

            {/* Enroll Modal */}
            {modal && (
                <div onClick={() => setModal(null)} style={{
                    position: "fixed", inset: 0, zIndex: 1000,
                    background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)",
                    display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
                }}>
                    <div onClick={e => e.stopPropagation()} style={{
                        background: "#0d1929", border: "1px solid rgba(74,143,212,0.3)",
                        borderRadius: 20, padding: 36, maxWidth: 480, width: "100%",
                        maxHeight: "90vh", overflowY: "auto",
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
                            <div>
                                <div style={{ fontSize: 36, marginBottom: 8 }}>{modal.image}</div>
                                <div style={{ fontSize: 20, fontWeight: 800, color: "var(--text)", fontFamily: "var(--font-display)" }}>{modal.title}</div>
                                <div style={{ fontSize: 13, color: "var(--blue)", marginTop: 4 }}>{modal.subtitle}</div>
                            </div>
                            <button onClick={() => setModal(null)} style={{ background: "none", border: "none", color: "var(--text-faint)", fontSize: 22, cursor: "pointer", flexShrink: 0 }}>✕</button>
                        </div>
                        <div style={{ marginBottom: 18 }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>What you'll learn</div>
                            {modal.topics.map(t => (
                                <div key={t} style={{ display: "flex", gap: 10, marginBottom: 8, fontSize: 13.5, color: "var(--text-muted)" }}>
                                    <span style={{ color: "#22c55e", flexShrink: 0 }}>✓</span>{t}
                                </div>
                            ))}
                        </div>
                        <div style={{ display: "flex", gap: 16, marginBottom: 22, fontSize: 12.5, color: "var(--text-faint)", flexWrap: "wrap" }}>
                            <span>⏱ {modal.duration}</span>
                            <span>📚 {modal.lessons} lessons</span>
                            {modal.certificate && <span>🏆 Certificate included</span>}
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ fontSize: 28, fontWeight: 800, color: modal.isFree ? "#22c55e" : "var(--blue)", fontFamily: "var(--font-display)" }}>
                                {modal.price}
                            </div>
                            <button style={{
                                background: "linear-gradient(135deg, #4A8FD4, #2d6ba8)",
                                border: "none", color: "#fff", borderRadius: 12,
                                padding: "12px 28px", fontSize: 14, fontWeight: 700,
                                cursor: "pointer", fontFamily: "inherit",
                            }}>
                                {modal.isFree ? "Start Free →" : "Enroll Now →"}
                            </button>
                        </div>
                        <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 12, textAlign: "center" }}>
                            {modal.isFree ? "No payment required. Start immediately." : "30-day money-back guarantee."}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
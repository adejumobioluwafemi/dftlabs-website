import CircuitBackground from "./components/CircuitBackground";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Sectors from "./components/Sectors";
import Products from "./components/Products";
import Blog from "./components/Blog";
import Courses from "./components/Courses";
import Events from "./components/Events";
import Jobs from "./components/Jobs";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import "./styles/globals.css";

// Announcement banner
function Banner() {
  return (
    <div style={{
      background: "linear-gradient(90deg, #1e3a5f, #2d5a8e, #1e3a5f)",
      borderBottom: "1px solid rgba(74,143,212,0.3)",
      padding: "9px 24px", textAlign: "center",
      position: "relative", zIndex: 100,
    }}>
      <span style={{ fontSize: 12.5, color: "#7CB9E8", fontWeight: 500 }}>
        🚀 <strong style={{ color: "#fff" }}>MedScan AI v2.0</strong> is live — Multi-organ support, 40% faster inference.{" "}
        <span style={{ color: "#4A8FD4", fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}>
          Read the release notes →
        </span>
      </span>
    </div>
  );
}

export default function App() {
  return (
    <>
      <CircuitBackground />
      <Banner />
      <Navbar />
      <Hero />
      <Sectors />
      <Products />
      <Blog />
      <Courses />
      <Events />
      <Jobs />
      <Contact />
      <Footer />
    </>
  );
}
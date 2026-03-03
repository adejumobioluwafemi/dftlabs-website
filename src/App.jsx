import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Pages
import Home from "./pages/Home";
import BlogPage from "./pages/BlogPage";
import BlogPost from "./pages/BlogPost";
import JobsPage from "./pages/JobsPage";
import NotFound from "./pages/NotFound";
import AboutPage from "./pages/AboutPage";
import EventsPage from "./pages/EventsPage";
import EventDetail from "./pages/EventDetail";

// Admin
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBlog from "./pages/admin/AdminBlog";
import AdminJobs from "./pages/admin/AdminJobs";
import AdminEvents from "./pages/admin/AdminEvents";

// Shared layout components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import "./styles/globals.css";

// Announcement Banner
function Banner() {
  return (
    <div style={{
      background: "linear-gradient(90deg, #1e3a5f, #2d5a8e, #1e3a5f)",
      borderBottom: "1px solid rgba(74,143,212,0.3)",
      padding: "9px 24px", textAlign: "center", position: "relative", zIndex: 100,
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

// Main site layout (with navbar/footer)
function SiteLayout({ children }) {
  return (
    <>
      <Banner />
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={
            <SiteLayout>
              <Home />
            </SiteLayout>
          } />

          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetail />} />

          {/* Admin routes — protected inside AdminLayout */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="blog" element={<AdminBlog />} />
            <Route path="jobs" element={<AdminJobs />} />
            <Route path="events" element={<AdminEvents />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
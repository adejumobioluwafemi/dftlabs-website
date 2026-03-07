// src/pages/Home.jsx
// Just re-exports everything from App's current content
import CircuitBackground from "../components/CircuitBackground";
import Hero from "../components/Hero";
import Sectors from "../components/Sectors";
import Products from "../components/Products";
import Blog from "../components/Blog";
//import Courses from "../components/Courses";
import Events from "../components/Events";
import Jobs from "../components/Jobs";
import Contact from "../components/Contact";

export default function Home() {
    return (
        <>
            <CircuitBackground />
            <Hero />
            <Sectors />
            <Products />
            <Blog />
            {/* <Courses /> */}
            <Events />
            <Jobs />
            <Contact />
        </>
    );
}
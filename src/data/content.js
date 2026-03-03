
export const NAV_LINKS = ["About", "Products", "Blog", "Courses", "Events", "Jobs", "Contact"];

export const SECTORS = [
    {
        icon: "🏥", label: "Healthcare",
        desc: "AI diagnostics, patient flow optimization, medical imaging & clinical decision support."
    },
    {
        icon: "🌾", label: "Agriculture",
        desc: "Precision farming, crop disease detection, yield prediction & autonomous field intelligence."
    },
    {
        icon: "🏦", label: "Banking",
        desc: "Fraud detection, credit scoring, document automation & intelligent financial workflows."
    },
    {
        icon: "🎓", label: "Education",
        desc: "Adaptive learning systems, automated grading, student analytics & personalized curricula."
    },
];

export const APPS = [
    { name: "MedScan AI", sector: "Healthcare", status: "Live", statusColor: "#22c55e", desc: "Real-time medical image analysis powered by deep learning models trained on diverse clinical data." },
    { name: "CropMind", sector: "Agriculture", status: "Beta", statusColor: "#f59e0b", desc: "Satellite + drone imagery fusion for early disease detection and precision yield forecasting." },
    { name: "VaultIQ", sector: "Banking", status: "Live", statusColor: "#22c55e", desc: "End-to-end fraud detection pipeline with explainable AI outputs for compliance teams." },
    { name: "LearnForge", sector: "Education", status: "Coming Soon", statusColor: "#8b5cf6", desc: "Adaptive curriculum engine that personalizes learning paths using real-time student performance data." },
    { name: "AgriBot 2.0", sector: "Agriculture", status: "Beta", statusColor: "#f59e0b", desc: "Autonomous field scouting agent with multi-sensor fusion and natural language farm reports." },
    { name: "DocuFlow", sector: "Banking", status: "Live", statusColor: "#22c55e", desc: "Intelligent document processing — extract, classify, validate banking documents at scale." },
];

export const BLOG_POSTS = [
    { tag: "Research Digest", title: "GPT-4o Vision Capabilities in Clinical Settings: What We Found", date: "Feb 28, 2026", read: "6 min", image: null },
    { tag: "Opinion", title: "Why Africa's Agriculture Sector Will Be the Next AI Frontier", date: "Feb 20, 2026", read: "8 min", image: null },
    { tag: "Announcement", title: "DFT Labs Launches MedScan AI v2.0 with Multi-Organ Support", date: "Feb 12, 2026", read: "4 min", image: null },
];


export const EVENTS = [
    {
        id: "healthcare-workshop-mar26",
        title: "AI in Healthcare Workshop",
        date: "Mar 22, 2026",
        time: "9:00 AM – 5:00 PM WAT",
        type: "Workshop",
        location: "Lagos, Nigeria + Virtual",
        spots: 40,
        filled: 28,
        price: "Free",
        image: null,
        shortDesc: "A full-day hands-on workshop on deploying AI in clinical environments.",
        description: `## About This Workshop

This intensive one-day workshop is designed for healthcare professionals, medical informaticists, and AI engineers working at the intersection of technology and medicine.

## What You'll Learn

You'll leave with practical skills in deploying computer vision models for medical imaging, building clinical decision support pipelines, and understanding regulatory considerations for health AI in West Africa.

## Agenda

**Morning Session (9 AM – 12 PM)**
- State of AI in African Healthcare
- Medical imaging fundamentals for AI engineers
- Hands-on: Building a chest X-ray classifier with PyTorch

**Afternoon Session (1 PM – 5 PM)**
- Clinical deployment considerations and WHO guidelines
- Explainable AI for medical use cases
- Hands-on: Integrating MedScan AI into a mock EHR workflow
- Panel discussion: Practitioners and policymakers

## Who Should Attend

Healthcare professionals curious about AI, AI engineers entering the health sector, hospital IT teams, and health startup founders.

## Facilitators

Led by the DFT Labs research team with guest speakers from partner hospitals.`,
        speakers: [
            { name: "DFT Labs Research Team", role: "AI Engineers & Researchers" },
            { name: "Guest Clinical Advisor", role: "Consultant Radiologist" },
        ],
    },
    {
        id: "agribusiness-seminar-apr26",
        title: "Automation for Agribusiness",
        date: "Apr 10, 2026",
        time: "10:00 AM – 3:00 PM WAT",
        type: "Seminar",
        location: "Abuja, Nigeria",
        spots: 60,
        filled: 12,
        price: "₦15,000",
        image: null,
        shortDesc: "A seminar on deploying AI and automation tools across the agricultural value chain.",
        description: `## About This Seminar

Designed for agribusiness owners, extension workers, farm managers, and agritech founders who want to understand and apply AI across the agricultural value chain.

## Topics Covered

- Precision agriculture fundamentals
- Drone and satellite imagery for crop monitoring
- Yield prediction models: what works in African contexts
- Case study: CropMind deployment in smallholder farms
- Building data pipelines from field sensors

## Format

A mix of presentations, case studies, and a live demo of CropMind's satellite analysis dashboard.

## Who Should Attend

Farm managers, agritech entrepreneurs, agricultural extension officers, and investors in the agri sector.`,
        speakers: [
            { name: "DFT Labs AgriTech Team", role: "CropMind Engineers" },
        ],
    },
    {
        id: "open-day-may26",
        title: "DFT Labs Open Day",
        date: "May 3, 2026",
        time: "2:00 PM – 6:00 PM WAT",
        type: "Open Day",
        location: "Virtual",
        spots: 200,
        filled: 87,
        price: "Free",
        image: null,
        shortDesc: "Join us virtually for product demos, Q&A, and a behind-the-scenes look at what we're building.",
        description: `## What is DFT Labs Open Day?

Once a quarter, we open our doors (virtually) to the community — developers, domain experts, students, and curious minds who want to see what we're working on.

## What to Expect

- Live demos of all active DFT Labs products
- Behind-the-scenes look at our AI agent infrastructure
- Q&A with the founding team
- Preview of upcoming product releases
- Networking breakout rooms by sector

## Format

Fully virtual via Google Meet. Link sent upon registration.

## Who Should Attend

Anyone interested in AI, automation, and what DFT Labs is building. No technical background required.`,
        speakers: [
            { name: "Full DFT Labs Team", role: "Founders & Engineers" },
        ],
    },
];

// ── Registrations store (will move to backend later) ─────────────────────────
export const REGISTRATIONS_STORE = {};

export const COURSES = [
    { title: "Applied ML for Healthcare", level: "Intermediate", duration: "6 weeks", students: 340, price: "$149" },
    { title: "LLM Engineering Bootcamp", level: "Advanced", duration: "8 weeks", students: 580, price: "$199" },
    { title: "AI Automation with Python", level: "Beginner", duration: "4 weeks", students: 920, price: "Free" },
];

export const JOBS = [
    { role: "ML Engineer — Healthcare AI", type: "Full-time", location: "Remote", company: "MedTech Africa", sector: "Healthcare" },
    { role: "Data Scientist — AgriTech", type: "Contract", location: "Nairobi, KE", company: "FarmSense Labs", sector: "Agriculture" },
    { role: "AI Product Manager", type: "Full-time", location: "Lagos, NG", company: "Finterra", sector: "Banking" },
    { role: "NLP Engineer — EdTech", type: "Full-time", location: "Remote", company: "LearnBridge", sector: "Education" },
];

// ── Extended Jobs (for /jobs page) ───────────────────────────────────────────
export const ALL_JOBS = [
    { id: 1, role: "ML Engineer — Healthcare AI", type: "Full-time", location: "Remote", company: "MedTech Africa", sector: "Healthcare", posted: "2 days ago", salary: "$80k–$110k" },
    { id: 2, role: "Data Scientist — AgriTech", type: "Contract", location: "Nairobi, KE", company: "FarmSense Labs", sector: "Agriculture", posted: "3 days ago", salary: "$60k–$80k" },
    { id: 3, role: "AI Product Manager", type: "Full-time", location: "Lagos, NG", company: "Finterra", sector: "Banking", posted: "5 days ago", salary: "$70k–$95k" },
    { id: 4, role: "NLP Engineer — EdTech", type: "Full-time", location: "Remote", company: "LearnBridge", sector: "Education", posted: "1 week ago", salary: "$75k–$100k" },
    { id: 5, role: "Computer Vision Engineer", type: "Full-time", location: "Accra, GH", company: "VisionHealth", sector: "Healthcare", posted: "1 week ago", salary: "$70k–$90k" },
    { id: 6, role: "AI Research Scientist", type: "Full-time", location: "Remote", company: "AgriMind Global", sector: "Agriculture", posted: "2 weeks ago", salary: "$90k–$130k" },
    { id: 7, role: "MLOps Engineer", type: "Full-time", location: "Cape Town, ZA", company: "BankStream AI", sector: "Banking", posted: "2 weeks ago", salary: "$85k–$115k" },
    { id: 8, role: "Curriculum AI Specialist", type: "Part-time", location: "Remote", company: "EduForge", sector: "Education", posted: "2 weeks ago", salary: "$40k–$55k" },
    { id: 9, role: "LLM Engineer", type: "Full-time", location: "Remote", company: "HealthChat AI", sector: "Healthcare", posted: "3 weeks ago", salary: "$95k–$130k" },
    { id: 10, role: "Precision Agriculture AI Lead", type: "Full-time", location: "Abuja, NG", company: "CropLogic", sector: "Agriculture", posted: "3 weeks ago", salary: "$65k–$85k" },
    { id: 11, role: "Fraud Detection Engineer", type: "Contract", location: "Remote", company: "SecureBank Tech", sector: "Banking", posted: "3 weeks ago", salary: "$70k–$95k" },
    { id: 12, role: "Adaptive Learning Engineer", type: "Full-time", location: "Kigali, RW", company: "SkillMesh", sector: "Education", posted: "1 month ago", salary: "$60k–$80k" },
];

export const STATS = [
    ["6+", "Products Built"],
    ["4", "Sectors Served"],
    ["2k+", "Users"],
    ["94%", "Accuracy Avg"],
];

// ── Extended Blog Posts (for /blog page) ─────────────────────────────────────
export const ALL_BLOG_POSTS = [
    {
        slug: "gpt4o-vision-clinical-settings",
        tag: "Research Digest",
        title: "GPT-4o Vision Capabilities in Clinical Settings: What We Found",
        date: "Feb 28, 2026",
        read: "6 min",
        author: "DFT Labs Team",
        image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&q=80",
        excerpt: "We ran a series of experiments using GPT-4o's vision capabilities on de-identified clinical imaging data. Here's what performed well, what didn't, and what it means for healthcare AI practitioners.",
        content: `## Overview\n\nOver the past three weeks, the DFT Labs research team ran structured evaluations of GPT-4o's multimodal capabilities against clinical imaging tasks...\n\n## Key Findings\n\nThe model showed strong performance on dermatology images and chest X-ray classification but struggled with fine-grained pathology slides...\n\n## DFT Labs Take\n\nGPT-4o is not a clinical diagnostic tool — yet. But as an assistive layer for radiologist triage queues, the throughput gains are hard to ignore.`,
    },
    {
        slug: "africa-agriculture-ai-frontier",
        tag: "Opinion",
        title: "Why Africa's Agriculture Sector Will Be the Next AI Frontier",
        date: "Feb 20, 2026",
        read: "8 min",
        author: "DFT Labs Team",
        image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&q=80",
        excerpt: "The combination of mobile-first infrastructure, climate urgency, and a young technical workforce makes sub-Saharan Africa uniquely positioned for an agricultural AI revolution.",
        content: `## The Opportunity Nobody Is Talking About\n\nWhile most AI investment flows into US and EU markets, the highest-impact opportunities may lie elsewhere...\n\n## Why Now\n\nSmartphone penetration, affordable satellite data, and government digitization programs have created the data foundation that was missing five years ago...\n\n## DFT Labs Take\n\nWe're building CropMind with this thesis at its core. The model that wins African agriculture won't come from Silicon Valley — it'll be trained here.`,
    },
    {
        slug: "medscan-ai-v2-launch",
        tag: "Announcement",
        title: "DFT Labs Launches MedScan AI v2.0 with Multi-Organ Support",
        date: "Feb 12, 2026",
        read: "4 min",
        author: "DFT Labs Team",
        image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&q=80",
        excerpt: "MedScan AI v2.0 is now live with expanded multi-organ support, a 40% improvement in inference speed, and a new explainability dashboard for clinical teams.",
        content: `## What's New in v2.0\n\nAfter three months of beta testing with partner clinics, MedScan AI v2.0 ships with the following improvements...\n\n## Multi-Organ Support\n\nVersion 1.x was limited to chest and abdominal imaging. v2.0 adds cardiac, neurological, and musculoskeletal scan support...\n\n## Explainability Dashboard\n\nEvery prediction now ships with a visual attention map and confidence breakdown by region — designed for clinical review workflows.`,
    },
    {
        slug: "llm-fine-tuning-low-resource",
        tag: "Research Digest",
        title: "Fine-tuning LLMs in Low-Resource African Languages: A Practical Guide",
        date: "Feb 5, 2026",
        read: "10 min",
        author: "DFT Labs Team",
        image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&q=80",
        excerpt: "Hausa, Yoruba, Igbo, and Swahili are massively underrepresented in large language model training data. We share our approach to domain-specific fine-tuning for education applications.",
        content: `## The Data Gap\n\nMost foundation models perform poorly on African languages due to severe training data imbalance...\n\n## Our Approach\n\nWe used a combination of synthetic data generation, community-sourced text corpora, and curriculum-aligned datasets...\n\n## Results\n\nAfter fine-tuning on 2.3M tokens of Yoruba educational content, our LearnForge model outperformed GPT-4o on standardized Nigerian curriculum benchmarks.`,
    },
    {
        slug: "automation-banking-compliance",
        tag: "Opinion",
        title: "The Hidden Automation Opportunity in African Banking Compliance",
        date: "Jan 28, 2026",
        read: "7 min",
        author: "DFT Labs Team",
        image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&q=80",
        excerpt: "Compliance document processing is eating 30-40% of operational costs at mid-tier African banks. AI automation can cut that in half — and we're building the tools to do it.",
        content: `## The Compliance Burden\n\nRegulatory reporting requirements have tripled in complexity over the past decade...\n\n## Where AI Fits\n\nDocument classification, entity extraction, and anomaly flagging are well-solved problems that most banks haven't yet deployed...\n\n## DFT Labs Take\n\nVaultIQ's next release will include a compliance workflow module built specifically for CBN and SEC reporting requirements.`,
    },
    {
        slug: "deepfly-research-agent-architecture",
        tag: "Technical",
        title: "How We Built Our AI Research Digest Agent with LangGraph",
        date: "Jan 20, 2026",
        read: "12 min",
        author: "DFT Labs Team",
        image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&q=80",
        excerpt: "A deep dive into the multi-agent architecture behind our weekly AI research digest — ArXiv crawler, summarizer, opinion writer, and admin notification system.",
        content: `## Architecture Overview\n\nThe research digest agent is a four-node LangGraph pipeline running on a weekly cron schedule...\n\n## The Nodes\n\n1. Crawler — fetches papers from ArXiv, HuggingFace, and Papers With Code\n2. Filter — relevance scoring against our four sectors\n3. Summarizer — extracts key findings and methodology\n4. Opinion Writer — generates DFT Labs editorial perspective\n\n## Lessons Learned\n\nThe hardest part wasn't the AI — it was reliable PDF parsing across inconsistent paper formats.`,
    },
];


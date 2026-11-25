/**
 * Single source of truth for every factual claim on the site.
 *
 * Everything here traces to public/resume.pdf. If the resume changes, this
 * file changes with it — no section invents facts of its own.
 */
export const personalInfo = {
  name: "Aryan Seth",
  title: "Full Stack & GenAI Engineer",
  tagline: "Engineering the future, one deploy at a time.",
  location: "Jaunpur, Uttar Pradesh, India",
  email: "iiitianaryan@gmail.com",
  phone: "+91 9795785251",
  website: "https://aryantechie.in",
  github: "https://github.com/aryanseth9795",
  linkedin: "https://linkedin.com/in/aryanseth9795",
  resumeUrl: "/resume.pdf",
  // Mirrors the resume's "Areas of Interest".
  roles: [
    "Full Stack Engineer",
    "GenAI Engineer",
    "Agentic AI Developer",
    "Backend Engineer",
  ],
};

/**
 * Rendered identically in both modes — the mode only changes the framing
 * around these paragraphs, never the facts inside them.
 */
export const about = [
  "I build full-stack applications with an AI layer that actually earns its place — retrieval that returns the right document, agents that finish the task, interfaces people keep using after the demo.",
  "At UltraTech Cement I built internal tools used by procurement and legal teams: contract comparison and risk analysis, a procurement chatbot, and commodity news intelligence — three GenAI applications shipped to production on Azure. The stack ran React and Next.js on the front, FastAPI and Python behind it, with PostgreSQL, MongoDB, Redis, Docker and LangGraph underneath. After that I shipped ERP and logistics modules on the MERN stack at FilFlo, for brands operating in quick-commerce.",
  "Before that I spent four years at IIIT Bhagalpur solving 700+ DSA problems and shipping side projects that real people used. I care about systems that stay up, code the next person can read, and interfaces that feel considered. I'm currently open to backend, full-stack, and GenAI engineering roles.",
];

/** Most recent first. */
export const experiences = [
  {
    company: "FilFlo",
    role: "Software Engineer",
    period: "May 2026 – Jun 2026",
    location: "Gurgaon, Haryana",
    description:
      "Developed and maintained ERP and logistics modules on the MERN stack for brand clients operating in the quick-commerce space. Built and supported order, inventory, and logistics workflows end-to-end, contributing to both frontend interfaces and backend API/service logic.",
    tags: ["React", "Node.js", "Express", "MongoDB", "ERP", "Logistics"],
    highlight: false,
  },
  {
    company: "UltraTech Cement Ltd. (Aditya Birla Group) — Digital Cell",
    role: "SDE Intern (GenAI / Full Stack)",
    period: "Aug 2025 – Apr 2026",
    location: "Remote",
    description:
      "Engineered 4–5 internal GenAI applications with React/Next.js and Python, integrating OpenAI, Gemini and Claude via LangChain and LangGraph agentic pipelines. Architected Navigo, a multi-step agent for contract comparison and risk analysis with clause extraction and diff highlighting; built FuelInsights, a RAG procurement chatbot with tool-calling; and Sentiment Pulse, a commodity news intelligence system. Owned secure document ingestion via Azure Blob Storage, plus CI/CD and production deployment across the Azure ecosystem.",
    tags: [
      "Next.js",
      "FastAPI",
      "Python",
      "LangGraph",
      "LangChain",
      "RAG",
      "Azure",
    ],
    highlight: true,
  },
];

export const education = [
  {
    institution: "IIIT Bhagalpur",
    degree: "B.Tech — Electronics & Communication Engineering",
    period: "Aug 2021 – May 2025",
    grade: "CGPA 7.73 / 10",
    highlights: [
      "700+ DSA problems solved across LeetCode and CodeChef",
      "Active full-stack developer throughout college",
      "Built multiple production-grade projects during studies",
    ],
  },
  {
    institution: "R.N. Tagore Sr. Sec. School",
    degree: "Senior Secondary (Class XII) — CBSE",
    period: "Apr 2017 – Apr 2019",
    grade: "89.5%",
    highlights: [
      "Strong foundation in mathematics and physics",
      "Developed early interest in programming and technology",
    ],
  },
  {
    institution: "R.N. Tagore Sr. Sec. School",
    degree: "Secondary (Class X) — CBSE",
    period: "Apr 2015 – Apr 2017",
    grade: "CGPA 10 / 10",
    highlights: [
      "Perfect 10 CGPA",
      "Developed early interest in programming and technology",
    ],
  },
];

export interface Project {
  name: string;
  category: string;
  description: string;
  tags: string[];
  featured: boolean;
  color: string;
  /** "#" when there is nothing to link to — the card hides the button. */
  link: string;
  github: string;
  /** Omitted when no screenshot exists — the card draws a placeholder. */
  image?: string;
}

export const projects: Project[] = [
  {
    name: "JobberAI",
    category: "GenAI / Agentic",
    description:
      "Autonomous job-application agent. Gemini Flash multimodal inference extracts structured JD metadata from plain text or screenshots at >95% field-level accuracy, feeding a 5-node LangGraph state machine: JD extraction → ChromaDB semantic profile retrieval → vector duplicate detection → personalised email synthesis → human-in-the-loop approval. Cuts per-application effort from 10 minutes to under 60 seconds.",
    tags: [
      "LangGraph",
      "FastAPI",
      "ChromaDB",
      "Gemini Flash",
      "Next.js",
      "MongoDB",
    ],
    featured: true,
    color: "#4fc3f7",
    link: "https://jobberai.aryantechie.in",
    github: "https://github.com/aryanseth9795/jobberai",
    image: "/jobberai.svg",
  },
  {
    name: "Stock Labs",
    category: "Full Stack Web App",
    description:
      "Cross-platform crypto paper-trading platform (web + mobile) covering 50+ symbols with 1-second live tick simulation over persistent WebSockets. Redis Pub/Sub decouples the price feed from portfolio computation for stateless worker scale-out; Prisma on PostgreSQL enforces ACID integrity with zero anomalies under high-concurrency buy/sell collisions. Validated at 1,000 concurrent users.",
    tags: [
      "Next.js",
      "TypeScript",
      "Socket.IO",
      "Redis",
      "Prisma",
      "PostgreSQL",
    ],
    featured: true,
    color: "#ffd700",
    link: "https://stocklabs.aryantechie.in",
    github: "https://github.com/aryanseth9795",
    image: "/stocklab.png",
  },
  {
    name: "ChatsUp",
    category: "Full Stack Web App",
    description:
      "Real-time MERN chat application with persistent history, media storage, Socket.io, and end-to-end encrypted messaging.",
    tags: ["MERN", "WebSocket", "Redux"],
    featured: false,
    color: "#e62429",
    link: "https://chatsup.aryantechie.in",
    github: "https://github.com/aryanseth9795",
    image: "/chatup.png",
  },
  {
    name: "Finzz — P2P Finance App",
    category: "Mobile App",
    description:
      "Peer-to-peer expense management on React Native (Expo) with a dual-ledger architecture — a private personal ledger with category tagging, plus collaborative shared ledgers between connected friends. Every shared expense triggers an FCM push the counterparty must Verify or Reject, creating a mutual-consent ledger that eliminates disputed IOUs. A month-end rollover engine auto-generates carry-forward entries, and an on-device PDF generator renders printable financial infographics offline.",
    tags: [
      "React Native",
      "Expo",
      "Node.js",
      "Express",
      "MongoDB",
      "Firebase FCM",
    ],
    featured: true,
    color: "#4fc3f7",
    link: "https://finzz.aryantechie.in",
    github: "https://github.com/aryanseth9795/finzz-backend",
    image: "/finzz.png",
  },
  {
    name: "UR Shop",
    category: "Mobile App",
    description:
      "Cross-platform e-commerce for a real cosmetics & grocery client, handling live customer transactions end-to-end across web (Next.js) and mobile (Expo) — multi-filter catalog, cart lifecycle, and checkout with persistent order history. RESTful Node.js microservices back it with an inventory-aware order engine enforcing stock-decrement atomicity. TanStack Query brings perceived load under 200ms on 3G via request deduplication, stale-while-revalidate, and optimistic mutations.",
    tags: [
      "Next.js",
      "React Native",
      "Node.js",
      "Express",
      "MongoDB",
      "TanStack Query",
    ],
    featured: false,
    color: "#ff6b35",
    link: "https://urshop.aryantechie.in",
    // Private repo — paid commercial engagement.
    github: "#",
    image: "/urshop.png",
  },
  {
    name: "SSJ – Shri Sai Jeweller",
    category: "Mobile App",
    description:
      "Jewellery business app with live gold/silver rates, product catalog, and transparent pricing.",
    tags: ["React Native", "MongoDB"],
    featured: false,
    color: "#ffd700",
    link: "#",
    github: "#",
    image: "/ssj-web.png",
  },
  {
    name: "SSJ – Shri Sai Jewellers",
    category: "Website App",
    description:
      "Jewellery business app with live gold/silver rates, product catalog, and transparent pricing.",
    tags: ["React", "Express", "MongoDB", "SSE", "Tailwind"],
    featured: false,
    color: "#ffa726",
    link: "https://ssj.aryantechie.in",
    github: "https://github.com/aryanseth9795/ssj_web",
    image: "/ssj-web.png",
  },
  {
    name: "Stock Lab (Mobile)",
    category: "Mobile App",
    description:
      "Mobile companion for Stock Labs — real-time crypto tracking with WebSocket-powered live streams.",
    tags: ["React Native", "WebSocket"],
    featured: false,
    color: "#ffd700",
    link: "https://stocklabs.aryantechie.in",
    github: "#",
    image: "/stockPic.png",
  },
  {
    name: "ChatsUp (Mobile)",
    category: "Mobile App",
    description:
      "Mobile version of ChatsUp with real-time messaging, push notifications, and media sharing.",
    tags: ["React Native", "Socket.io"],
    featured: false,
    color: "#e62429",
    link: "https://chatsup.aryantechie.in",
    github: "#",
    image: "/image-5.png",
  },
  {
    name: "Asha Jeweller",
    category: "Mobile App",
    description:
      "Jewellery store management with live rate tracking and customer portal.",
    tags: ["React Native", "Express"],
    featured: false,
    color: "#ffa726",
    link: "https://ssj.aryantechie.in",
    github: "#",
  },
  {
    name: "Jarvis Desktop AI",
    category: "Applications",
    description:
      "Desktop AI assistant built with Electron and Python ML backend for task automation and intelligent responses.",
    tags: ["Electron", "Python", "AI/ML"],
    featured: false,
    color: "#4fc3f7",
    link: "#",
    github: "#",
  },
  {
    name: "LMS",
    category: "Full Stack Web App",
    description:
      "Learning Management System with course management, user authentication, and content delivery.",
    tags: ["MERN", "Redux", "Express"],
    featured: false,
    color: "#e62429",
    link: "https://lms.aryantechie.in",
    github: "https://github.com/aryanseth9795",
    image: "/project-2.png",
  },
  {
    name: "Money Manager",
    category: "Full Stack Web App",
    description:
      "Personal finance tracker with expense categorization, budget management, and visual analytics.",
    tags: ["Next.js", "Tailwind", "MongoDB"],
    featured: false,
    color: "#ffd700",
    link: "https://moneymanager.aryantechie.in",
    github: "https://github.com/aryanseth9795",
    image: "/project-3.png",
  },
  {
    name: "News247",
    category: "Frontend App",
    description:
      "Real-time news aggregation platform with location-based news, category filtering, and responsive design.",
    tags: ["Next.js", "Tailwind", "API"],
    featured: false,
    color: "#ff6b35",
    link: "https://news247.aryantechie.in",
    github: "https://github.com/aryanseth9795",
    image: "/news247.png",
  },
  {
    name: "Weather App",
    category: "Frontend App",
    description:
      "Weather forecast application with real-time data and location-based search.",
    tags: ["Vanilla JS", "API"],
    featured: false,
    color: "#4fc3f7",
    link: "https://aryantechie9795.github.io/weather/",
    github: "#",
    image: "/weather.png",
  },
  {
    name: "Ziggy (Restaurant)",
    category: "Frontend App",
    description:
      "Modern restaurant landing page with menu showcase and responsive design.",
    tags: ["HTML", "CSS", "JS"],
    featured: false,
    color: "#ffa726",
    link: "https://aryanseth9795.github.io/restro",
    github: "#",
    image: "/restro.png",
  },
  {
    name: "To-Do App",
    category: "Frontend App",
    description:
      "Task management app with CRUD operations and persistent local storage.",
    tags: ["Vanilla JS"],
    featured: false,
    color: "#e62429",
    link: "https://aryanseth9795.github.io/To-do-List/",
    github: "#",
    image: "/todo.png",
  },
  {
    name: "News24x7 (Website)",
    category: "Full Stack Web App",
    description:
      "Full-featured news platform with category filtering, real-time updates, and responsive design.",
    tags: ["Next.js", "Tailwind", "API"],
    featured: false,
    color: "#ef5350",
    link: "https://news247.aryantechie.in",
    github: "#",
    image: "/news247.png",
  },
];

export const skills = {
  Languages: [
    "TypeScript",
    "JavaScript",
    "Python",
    "C++",
    "C",
    "SQL",
    "HTML",
    "CSS",
  ],
  GenAI: [
    "LangChain",
    "LangGraph",
    "RAG",
    "Agentic Workflows",
    "OpenAI",
    "Gemini",
    "Claude",
    "Prompt Engineering",
  ],
  "AI / ML": ["TensorFlow", "HuggingFace"],
  Frontend: ["React", "Next.js", "Redux", "Tailwind CSS", "ShadcnUI", "MUI"],
  Mobile: ["React Native", "Expo"],
  Backend: [
    "Node.js",
    "Express",
    "FastAPI",
    "Prisma",
    "SQLAlchemy",
    "Socket.IO",
  ],
  Databases: [
    "PostgreSQL",
    "MongoDB",
    "MySQL",
    "Redis",
    "ChromaDB",
    "Cloudinary",
  ],
  "DevOps / Cloud": ["Azure", "AWS", "Docker", "CI/CD", "Netlify"],
  Concepts: [
    "REST APIs",
    "Microservices",
    "WebSockets",
    "JWT Auth",
    "ACID Transactions",
    "Event-Driven Architecture",
    "Agile",
  ],
  Tools: ["Git", "GitHub", "VS Code", "Postman", "Electron"],
};

export const stats = [
  { label: "DSA Problems Solved", value: 700, suffix: "+" },
  { label: "Production Apps Shipped", value: 7, suffix: "+" },
  { label: "GenAI Apps at UltraTech", value: 3, suffix: "" },
  { label: "AWS Certification", value: 1, suffix: "" },
];

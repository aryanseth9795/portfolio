import type { Metadata, Viewport } from "next";
import "./globals.css";
import { fontVariables } from "@/lib/fonts";
import ModeScript from "@/components/mode/ModeScript";
import ModeProvider from "@/components/mode/ModeProvider";

const SITE_URL = "https://aryantechie.in";

const TITLE = "Aryan Seth — Full Stack & GenAI Engineer";

/** Kept to ~155 chars so search results don't truncate it mid-clause. */
const DESCRIPTION =
  "Aryan Seth — Full Stack & GenAI engineer. Builds LangGraph agentic systems, RAG pipelines and production APIs on Azure. Previously @ UltraTech Cement (Aditya Birla Group). Open to backend, full-stack and GenAI roles.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s — Aryan Seth",
  },
  description: DESCRIPTION,
  applicationName: "Aryan Seth — Portfolio",
  keywords: [
    // Identity
    "Aryan Seth",
    "Aryan Seth portfolio",
    "aryantechie",
    // Roles he is searchable for
    "Full Stack Engineer",
    "GenAI Engineer",
    "Backend Engineer",
    "Software Development Engineer",
    // The GenAI stack — the differentiator on the resume
    "LangGraph",
    "LangChain",
    "RAG",
    "Agentic AI",
    "LLM applications",
    "Prompt Engineering",
    // Core stack
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "FastAPI",
    "React Native",
    "Python",
    // Infra
    "Azure",
    "PostgreSQL",
    "MongoDB",
    "Redis",
    "Docker",
    "REST APIs",
    "WebSockets",
    // Background
    "IIIT Bhagalpur",
  ],
  authors: [{ name: "Aryan Seth", url: SITE_URL }],
  creator: "Aryan Seth",
  publisher: "Aryan Seth",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Aryan Seth",
    title: TITLE,
    description:
      "Full Stack & GenAI engineer. LangGraph agentic systems, RAG pipelines, and production APIs that ship. Open to backend, full-stack and GenAI roles.",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description:
      "Full Stack & GenAI engineer. LangGraph agentic systems, RAG pipelines, and production APIs that ship.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "technology",
};

/** The tab strip is part of the chrome — it should follow the active mode. */
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0a0a0b" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0b" },
  ],
  colorScheme: "dark",
};

/**
 * Person schema, so search engines resolve the name to an entity rather than
 * guessing from prose. Values trace to lib/data.ts and public/resume.pdf.
 */
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Aryan Seth",
  url: SITE_URL,
  email: "mailto:iiitianaryan@gmail.com",
  jobTitle: "Full Stack & GenAI Engineer",
  description: DESCRIPTION,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Jaunpur",
    addressRegion: "Uttar Pradesh",
    addressCountry: "IN",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Indian Institute of Information Technology, Bhagalpur",
  },
  knowsAbout: [
    "Generative AI",
    "LangGraph",
    "LangChain",
    "Retrieval-Augmented Generation",
    "Full Stack Development",
    "Backend Engineering",
    "React",
    "Next.js",
    "FastAPI",
    "Azure",
  ],
  sameAs: [
    "https://github.com/aryanseth9795",
    "https://linkedin.com/in/aryanseth9795",
  ],
};

/**
 * Chrome that sits above the page in every mode. Each layer's visibility is
 * driven by --chrome-opacity / --noise-opacity, so switching modes fades them
 * rather than mounting and unmounting mid-transition.
 */
function GlobalChrome() {
  return (
    <>
      <div className="noise-overlay" aria-hidden="true" />
      <div className="scan-lines" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />
      <div className="hud-frame" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: ModeScript mutates data-mode on this element
    // before React hydrates, so server and client markup differ by design.
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head>
        <ModeScript />
        <script
          type="application/ld+json"
          // Serialized from a local literal, never user input.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </head>
      <body>
        <ModeProvider>
          {children}
          <GlobalChrome />
        </ModeProvider>
      </body>
    </html>
  );
}

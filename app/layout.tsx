import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aryan Seth — Full Stack & GenAI Engineer",
  description:
    "Portfolio of Aryan Seth — a Full Stack & GenAI Engineer building intelligent, production-grade applications. Currently @ UltraTech Cement (Aditya Birla Group).",
  keywords: [
    "Aryan Seth",
    "Software Engineer",
    "Full Stack Developer",
    "GenAI",
    "React",
    "Next.js",
    "Portfolio",
  ],
  authors: [{ name: "Aryan Seth" }],
  openGraph: {
    title: "Aryan Seth — Full Stack & GenAI Engineer",
    description:
      "Building intelligent systems that ship. Full Stack & GenAI Engineer portfolio.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        {/* Noise overlay */}
        <div className="noise-overlay" aria-hidden="true" />
      </body>
    </html>
  );
}

/**
 * Brand marks for the skills grid.
 *
 * Imported by name rather than as a namespace so the bundler keeps only the
 * ~30 icons actually used out of simple-icons' 3400+.
 *
 * Some brands are absent from simple-icons (Azure, AWS, OpenAI, VS Code were
 * removed under brand policy; SQL is not a brand). Those resolve to undefined
 * and SkillIcon falls back to a monogram.
 */
import {
  siReact,
  siNextdotjs,
  siRedux,
  siTailwindcss,
  siShadcnui,
  siMui,
  siHtml5,
  siCss,
  siExpo,
  siTypescript,
  siJavascript,
  siPython,
  siCplusplus,
  siC,
  siNodedotjs,
  siExpress,
  siFastapi,
  siPrisma,
  siSqlalchemy,
  siSocketdotio,
  siPostgresql,
  siMongodb,
  siMysql,
  siRedis,
  siCloudinary,
  siDocker,
  siNetlify,
  siGit,
  siGithub,
  siPostman,
  siElectron,
  siLangchain,
  siLanggraph,
  siGooglegemini,
  siClaude,
  siTensorflow,
  siHuggingface,
} from "simple-icons";

export interface BrandIcon {
  path: string;
  hex: string;
  title: string;
}

export const skillIcons: Record<string, BrandIcon | undefined> = {
  // Languages
  TypeScript: siTypescript,
  JavaScript: siJavascript,
  Python: siPython,
  "C++": siCplusplus,
  C: siC,
  HTML: siHtml5,
  CSS: siCss,

  // GenAI — RAG, Agentic Workflows, Prompt Engineering and ChromaDB are
  // techniques or unlisted brands, so they fall through to a monogram.
  LangChain: siLangchain,
  LangGraph: siLanggraph,
  Gemini: siGooglegemini,
  Claude: siClaude,

  // AI / ML
  TensorFlow: siTensorflow,
  HuggingFace: siHuggingface,

  // Frontend
  React: siReact,
  "Next.js": siNextdotjs,
  Redux: siRedux,
  "Tailwind CSS": siTailwindcss,
  ShadcnUI: siShadcnui,
  MUI: siMui,

  // Mobile — simple-icons has no dedicated React Native mark
  "React Native": siReact,
  Expo: siExpo,

  // Backend
  "Node.js": siNodedotjs,
  Express: siExpress,
  FastAPI: siFastapi,
  Prisma: siPrisma,
  SQLAlchemy: siSqlalchemy,
  "Socket.IO": siSocketdotio,

  // Databases
  PostgreSQL: siPostgresql,
  MongoDB: siMongodb,
  MySQL: siMysql,
  Redis: siRedis,
  Cloudinary: siCloudinary,

  // DevOps / Cloud — Azure, AWS and CI/CD have no usable mark here
  Docker: siDocker,
  Netlify: siNetlify,

  // Tools
  Git: siGit,
  GitHub: siGithub,
  Postman: siPostman,
  Electron: siElectron,
};

/**
 * Brand colors are chosen for white backgrounds, so several are black or near
 * black — Express, Next.js, GitHub, Socket.io, Expo, Prisma would all vanish
 * against this palette. Lift anything too dark toward white, keeping its hue.
 */
export function displayHex(hex: string): string {
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  const luma = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  const MIN = 0.46;
  if (luma >= MIN) return `#${hex}`;

  const t = Math.min((MIN - luma) / (1 - luma) * 1.15, 0.86);
  const lift = (c: number) =>
    Math.round(c + (255 - c) * t)
      .toString(16)
      .padStart(2, "0");

  return `#${lift(r)}${lift(g)}${lift(b)}`;
}

/** Initials for skills with no brand mark, e.g. "VS Code" -> "VS". */
export function monogram(name: string): string {
  const words = name.replace(/[^\w\s.]/g, "").split(/\s+/).filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

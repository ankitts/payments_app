export type CourseProduct = {
  id: string;
  name: string;
  eyebrow: string;
  description: string;
  amountMinor: number;
  currency: "INR";
  accent: string;
  features: string[];
  isCombo?: boolean;
};

const INDIVIDUAL_COURSES = [
  {
    id: "web-dev",
    name: "Web Dev Mastery",
    eyebrow: "Web dev",
    description: "Build polished full-stack apps with modern frontend and APIs.",
    amountMinor: 150000,
    currency: "INR",
    accent: "#61dafb",
    features: ["React and Next.js", "API design", "Deployment workflow"],
  },
  {
    id: "ml-ai-agents",
    name: "ML, AI & Agents",
    eyebrow: "ML & AI",
    description: "Ship useful AI features, agent workflows, and model-backed apps.",
    amountMinor: 200000,
    currency: "INR",
    accent: "#ffd43b",
    features: ["Model basics", "Agent patterns", "Evaluation loops"],
  },
  {
    id: "web3-blockchain-rust",
    name: "Web3, Blockchain & Rust",
    eyebrow: "Web3 + Rust",
    description: "Learn blockchain systems, smart contracts, and Rust fundamentals.",
    amountMinor: 175000,
    currency: "INR",
    accent: "#ff9900",
    features: ["Rust foundations", "Smart contracts", "Wallet flows"],
  },
  {
    id: "cpp-low-latency",
    name: "C++ Low Latency",
    eyebrow: "C++ systems",
    description: "Write fast C++ for performance-critical and low-latency systems.",
    amountMinor: 175000,
    currency: "INR",
    accent: "#a78bfa",
    features: ["Modern C++", "Profiling", "Latency tuning"],
  },
] satisfies CourseProduct[];

const comboAmountMinor = Math.round(
  INDIVIDUAL_COURSES.reduce((sum, course) => sum + course.amountMinor, 0) * 0.7,
);

export const COURSE_PRODUCTS = [
  ...INDIVIDUAL_COURSES,
  {
    id: "complete-combo",
    name: "Complete Tech Stack Combo",
    eyebrow: "Best value",
    description: "Get every track together at 70% of the combined price.",
    amountMinor: comboAmountMinor,
    currency: "INR",
    accent: "#5b8cff",
    features: ["All four courses", "Lifetime access", "30% bundle savings"],
    isCombo: true,
  },
] satisfies CourseProduct[];

export const DEFAULT_COURSE_ID = "complete-combo";

export function getCourseProduct(courseId?: string | null): CourseProduct {
  return (
    COURSE_PRODUCTS.find((course) => course.id === courseId) ??
    COURSE_PRODUCTS.find((course) => course.id === DEFAULT_COURSE_ID) ??
    COURSE_PRODUCTS[0]
  );
}

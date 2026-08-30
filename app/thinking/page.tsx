import type { Metadata } from "next";
import ThinkingContent from "./ThinkingContent";

export const metadata: Metadata = {
  title: { absolute: "How We Think — Aivik" },
  description:
    "Aivik's point of view on AI, operations, and why most projects fail. Read before you buy.",
  alternates: {
    canonical: "https://aivik.eu/thinking",
  },
};

export default function ThinkingPage() {
  return <ThinkingContent />;
}

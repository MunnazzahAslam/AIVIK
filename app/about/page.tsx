import type { Metadata } from "next";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import AboutContent from "../components/AboutContent";

export const metadata: Metadata = {
  title: "About",
  description:
    "AIVIK is a Germany-registered software engineering and AI automation company. Learn how we work and why clients keep direct access to the engineers building their product.",
  alternates: {
    canonical: "https://aivik.eu/about",
  },
};

export default function About() {
  return (
    <main>
      <Nav />
      <AboutContent />
      <Footer />
    </main>
  );
}

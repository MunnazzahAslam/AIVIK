import Nav from "./components/Nav";
import Hero from "./components/Hero";
// import Services from "./components/Services"; // "What we build." — disabled for now, kept for later use
import CloserLook from "./components/CloserLook";
import WhyAivik from "./components/WhyAivik";
import Process from "./components/Process";
import GetAQuote from "./components/GetAQuote";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      {/* <Services /> */}
      <CloserLook />
      <Process />
      <WhyAivik />
      <GetAQuote />
      <Footer />
    </main>
  );
}

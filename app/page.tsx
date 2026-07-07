import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Services from "./components/Services";
import WhyAivik from "./components/WhyAivik";
import WhyAivikFlip from "./components/WhyAivikFlip";
import WhyAivikPuzzle from "./components/WhyAivikPuzzle";
import WhyAivikCircuit from "./components/WhyAivikCircuit";
import Process from "./components/Process";
import GetAQuote from "./components/GetAQuote";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <Services />
      <WhyAivik />
      <WhyAivikFlip />
      <WhyAivikPuzzle />
      <WhyAivikCircuit />
      <Process />
      <GetAQuote />
      <Footer />
    </main>
  );
}

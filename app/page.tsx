import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Services from "./components/Services";
import WhyAivik from "./components/WhyAivik";
import Process from "./components/Process";
import GetAQuote from "./components/GetAQuote";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <Services />
      <Process />
      <WhyAivik />
      <GetAQuote />
      <Footer />
    </main>
  );
}

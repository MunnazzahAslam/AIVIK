import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Services from "./components/Services";
import WhyChooseUs from "./components/WhyChooseUs";
import Process from "./components/Process";
import GetAQuote from "./components/GetAQuote";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <Services />
      <WhyChooseUs />
      <Process />
      <GetAQuote />
      <Footer />
    </main>
  );
}

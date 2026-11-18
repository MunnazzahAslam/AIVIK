import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import Nav from "@/app/components/Nav";
import Hero from "@/app/components/Hero";
import Services from "@/app/components/Services";
import UseCasesTeaser from "@/app/components/use-cases/UseCasesTeaser";
import WhyAixik from "@/app/components/WhyAixik";
import Process from "@/app/components/Process";
import GetAQuote from "@/app/components/GetAQuote";
import Footer from "@/app/components/Footer";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <Nav />
      <Hero />
      <Services />
      <UseCasesTeaser />
      <Process />
      <WhyAixik />
      <GetAQuote />
      <Footer />
    </main>
  );
}

import { LangProvider } from "@/lib/i18n";
import LangHtmlSync from "@/components/LangHtmlSync";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import WhyUs from "@/components/WhyUs";
import HowItWorks from "@/components/HowItWorks";
import Membership from "@/components/Membership";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import QuoteForm from "@/components/QuoteForm";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";

export default function Home() {
  return (
    <LangProvider>
      <LangHtmlSync />
      <Navbar />
      <main>
        <Hero />
        <Services />
        <WhyUs />
        <HowItWorks />
        <Membership />
        <Testimonials />
        <FAQ />
        <QuoteForm />
      </main>
      <Footer />
      <ChatBot />
    </LangProvider>
  );
}
import { LangProvider } from "@/lib/i18n";
import dynamic from "next/dynamic";
import LangHtmlSync from "@/components/LangHtmlSync";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PartnerMarquee from "@/components/PartnerMarquee";
import CertMarquee from "@/components/CertMarquee";
import SectionDivider from "@/components/SectionDivider";
import StatStrip from "@/components/StatStrip";
import QuoteForm from "@/components/QuoteForm";
import Footer from "@/components/Footer";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import CookieBanner from "@/components/CookieBanner";
import FloatingCTA from "@/components/FloatingCTA";
import ScrollToTop from "@/components/ScrollToTop";
import AbandonmentBanner from "@/components/AbandonmentBanner";
import ScrollDepthTracker from "@/components/ScrollDepthTracker";

// ── Lazy-load heavy below-the-fold components ─────────────────────────────────
const Services        = dynamic(() => import("@/components/Services"));
const WhyUs           = dynamic(() => import("@/components/WhyUs"));
const ComparisonTable = dynamic(() => import("@/components/ComparisonTable"));
const HowItWorks      = dynamic(() => import("@/components/HowItWorks"));
const Membership      = dynamic(() => import("@/components/Membership"));
const Testimonials    = dynamic(() => import("@/components/Testimonials"));
const AwardsStrip     = dynamic(() => import("@/components/AwardsStrip"));
const TeamSection     = dynamic(() => import("@/components/TeamSection"));
const FAQ             = dynamic(() => import("@/components/FAQ"));
const LiveProof       = dynamic(() => import("@/components/LiveProof"));
const TrustBadges     = dynamic(() => import("@/components/TrustBadges"));
const ChatBot         = dynamic(() => import("@/components/ChatBot"));
const WelcomeToast    = dynamic(() => import("@/components/WelcomeToast"));
const DotNav          = dynamic(() => import("@/components/DotNav"));
const ExitModal       = dynamic(() => import("@/components/ExitModal"));
const CommandPalette  = dynamic(() => import("@/components/CommandPalette"));
const MobileBottomNav = dynamic(() => import("@/components/MobileBottomNav"));

export default function Home() {
  return (
    <LangProvider>
      <LangHtmlSync />
      <ScrollProgressBar />
      <Navbar />
      <FloatingCTA />
      <ScrollToTop />
      <WelcomeToast />
      <DotNav />
      <ExitModal />
      <WhatsAppFloat />
      <CookieBanner />
      <CommandPalette />
      <MobileBottomNav />
      <AbandonmentBanner />
      <ScrollDepthTracker />
      <main id="main-content" className="noise relative">
        <Hero />
        <PartnerMarquee />
        <CertMarquee />
        <SectionDivider color="#141414" flip className="-mt-1" />
        <Services />
        <WhyUs />
        <ComparisonTable />
        <SectionDivider color="#0A0A0A" flip className="-mt-1" />
        <HowItWorks />
        <StatStrip />
        <Membership />
        <Testimonials />
        <AwardsStrip />
        <TeamSection />
        <FAQ />
        <LiveProof />
        <TrustBadges />
        <QuoteForm />
      </main>
      <Footer />
      <ChatBot />
    </LangProvider>
  );
}

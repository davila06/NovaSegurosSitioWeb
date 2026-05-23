import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import SplashScreen from "@/components/SplashScreen";
import CursorSpotlight from "@/components/CursorSpotlight";
import SectionDeepLink from "@/components/SectionDeepLink";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import MetaPixel from "@/components/MetaPixel";
import MicrosoftClarity from "@/components/MicrosoftClarity";
import UTMCapture from "@/components/UTMCapture";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import { ThemeProvider } from "@/lib/theme";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://novaseguros.cr"),
  title: "NovaSeguros — Protección Premium en Costa Rica",
  description:
    "Seguros personales y empresariales con asesoría experta, atención VIP y cobertura premium. Protegemos lo que más valoras. / Premium personal and business insurance in Costa Rica.",
  keywords: ["seguros", "insurance", "Costa Rica", "NovaSeguros", "seguros auto", "seguros médicos", "seguros empresas"],
  alternates: {
    canonical: "https://novaseguros.cr",
  },
  icons: {
    icon: [
      { url: "/favicon.ico",    sizes: "32x32",    type: "image/x-icon" },
      { url: "/icon.png",       sizes: "512x512",  type: "image/png"    },
    ],
    shortcut: "/favicon.ico",
    apple:    [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "NovaSeguros — Protección Premium en Costa Rica",
    description: "Seguros personales y empresariales con asesoría experta, atención VIP y cobertura premium.",
    siteName: "NovaSeguros",
    locale: "es_CR",
    type: "website",
    url: "https://novaseguros.cr",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "NovaSeguros — Protección Premium en Costa Rica" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NovaSeguros — Protección Premium en Costa Rica",
    description: "Seguros personales y empresariales con asesoría experta, atención VIP y cobertura premium.",
    images: ["/opengraph-image"],
  },
};

// ─── JSON-LD structured data ─────────────────────────────────────────────────
const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "InsuranceAgency",
  name: "NovaSeguros",
  description: "Correduría de seguros premium en Costa Rica. Seguros de auto, vida, salud, hogar, viaje, mascotas y empresariales.",
  url: "https://novaseguros.cr",
  telephone: "+50689875225",
  email: "hola@novaseguros.cr",
  logo: "https://novaseguros.cr/imagenOficial.png",
  address: {
    "@type": "PostalAddress",
    addressLocality: "San José",
    addressCountry: "CR",
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"],
    opens: "08:00",
    closes: "18:00",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    bestRating: "5",
    reviewCount: "500",
  },
  sameAs: [
    "https://www.instagram.com/novaseguros",
    "https://www.facebook.com/novaseguros",
    "https://www.linkedin.com/company/novaseguros",
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "¿Qué seguros ofrecen?",
      acceptedAnswer: { "@type": "Answer", text: "Seguros de Auto, Vida, Salud, Hogar, Viaje y Mascotas para personas, y para empresas: PYMES, Flotillas, Riesgos Laborales y más." } },
    { "@type": "Question", name: "¿Cuánto tarda una cotización?",
      acceptedAnswer: { "@type": "Answer", text: "En menos de 15 minutos te brindamos una cotización personalizada." } },
    { "@type": "Question", name: "¿Están regulados por la SUGESE?",
      acceptedAnswer: { "@type": "Answer", text: "Sí. NovaSeguros opera bajo supervisión de la SUGESE (Superintendencia General de Seguros de Costa Rica)." } },
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  url: "https://novaseguros.cr",
  name: "NovaSeguros",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://novaseguros.cr/#faq?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${cormorant.variable} ${dmSans.variable} h-full`}>
      <head>
        {/* Resource hints — reduces latency for third-party origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://connect.facebook.net" />
        <link rel="preconnect" href="https://www.clarity.ms" />
        <link rel="preconnect" href="https://calendly.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://analytics.google.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="min-h-full">
        {/* Skip to main content — accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999]
                     focus:bg-gold focus:text-navy-deep focus:px-4 focus:py-2 focus:rounded-sm
                     focus:text-sm focus:font-bold focus:shadow-lg"
        >
          Saltar al contenido
        </a>
        <GoogleAnalytics />
        <MetaPixel />
        <MicrosoftClarity />
        <UTMCapture />
        <ThemeProvider>
          <SplashScreen />
          <CustomCursor />
          <CursorSpotlight />
          <SectionDeepLink />
          <PWAInstallPrompt />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

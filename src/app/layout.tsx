import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

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
  title: "NovaSeguros — Protección Premium en Costa Rica",
  description:
    "Seguros personales y empresariales con asesoría experta, atención VIP y cobertura premium. Protegemos lo que más valoras. / Premium personal and business insurance in Costa Rica.",
  keywords: ["seguros", "insurance", "Costa Rica", "NovaSeguros", "seguros auto", "seguros médicos", "seguros empresas"],
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
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "NovaSeguros — Protección Premium en Costa Rica" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NovaSeguros — Protección Premium en Costa Rica",
    description: "Seguros personales y empresariales con asesoría experta, atención VIP y cobertura premium.",
    images: ["/opengraph-image"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "InsuranceAgency",
  name: "NovaSeguros",
  description: "Correduría de seguros premium en Costa Rica. Seguros de auto, vida, salud, hogar, viaje, mascotas y empresariales.",
  url: "https://novaseguros.cr",
  telephone: "+50621000000",
  email: "hola@novaseguros.cr",
  logo: "https://novaseguros.cr/imagenOficial.png",
  address: {
    "@type": "PostalAddress",
    addressLocality: "San José",
    addressCountry: "CR",
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${cormorant.variable} ${dmSans.variable} h-full`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}

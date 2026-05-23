import { notFound } from "next/navigation";
import Link from "next/link";
import { INSURANCE_PAGES, getInsurancePage, generateMetadata as getPageMeta } from "@/app/seguros/content";
import type { Metadata } from "next";

export function generateStaticParams() {
  return INSURANCE_PAGES.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return getPageMeta(slug);
}

export default async function InsuranceLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getInsurancePage(slug);
  if (!page) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: page.headline,
    description: page.description,
    brand: { "@type": "Brand", name: "NovaSeguros" },
    offers: {
      "@type": "Offer",
      priceCurrency: "CRC",
      price: page.price.replace(/[^\d,]/g, ""),
      availability: "https://schema.org/InStock",
      url: `https://novaseguros.cr/seguros/${slug}`,
    },
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: page.headline,
    description: page.description,
    serviceType: slug,
    provider: {
      "@type": "Organization",
      name: "NovaSeguros",
      url: "https://novaseguros.cr",
    },
    areaServed: {
      "@type": "Country",
      name: "Costa Rica",
    },
    url: `https://novaseguros.cr/seguros/${slug}`,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "NovaSeguros", item: "https://novaseguros.cr" },
      { "@type": "ListItem", position: 2, name: "Seguros",     item: "https://novaseguros.cr/seguros" },
      { "@type": "ListItem", position: 3, name: page.headline, item: `https://novaseguros.cr/seguros/${slug}` },
    ],
  };

  return (
    <div
      className="min-h-screen bg-navy text-cream"
      style={{ fontFamily: "var(--font-dm-sans, sans-serif)" }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* Gold top bar */}
      <div className="h-1 bg-gradient-to-r from-gold-dark via-gold to-gold-light" />

      {/* Hero */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-gold/4 blur-[130px]" />
        </div>
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gold text-sm mb-8 hover:underline"
          >
            ← NovaSeguros
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-gold" />
            <span className="text-gold text-xs tracking-[0.25em] uppercase font-medium">
              NovaSeguros · Costa Rica
            </span>
          </div>

          <h1
            className="text-5xl lg:text-6xl font-light leading-tight mb-6"
            style={{ fontFamily: "var(--font-cormorant, serif)" }}
          >
            {page.headline.split(" ").slice(0, -1).join(" ")}{" "}
            <span className="font-semibold italic" style={{
              background: "linear-gradient(135deg,#C8A96E 0%,#EDD898 50%,#A07840 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              {page.headline.split(" ").slice(-1)[0]}
            </span>
          </h1>

          <p className="text-silver text-lg leading-relaxed max-w-2xl mb-4">
            {page.sub}
          </p>

          <p className="text-gold font-semibold text-xl mb-10">{page.price}</p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={`/#quote?type=${slug}`}
              className="inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-light
                         text-navy-deep text-sm font-bold px-8 py-4 rounded-sm
                         transition-all duration-300 hover:shadow-[0_0_30px_rgba(201,168,76,0.4)]"
            >
              Cotizar ahora — gratis →
            </Link>
            <a
              href={`https://wa.me/50689875225?text=${encodeURIComponent(`Hola, me interesa cotizar un ${page.headline} con NovaSeguros.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-gold/30
                         hover:border-gold/60 text-cream text-sm font-medium px-8 py-4
                         rounded-sm transition-all duration-300 hover:bg-gold/5"
            >
              WhatsApp directo
            </a>
          </div>
        </div>
      </section>

      {/* Coverages */}
      <section className="py-16 lg:py-20 border-t border-gold/10">
        <div className="max-w-5xl mx-auto px-6">
          <h2
            className="text-3xl font-light mb-2"
            style={{ fontFamily: "var(--font-cormorant, serif)" }}
          >
            ¿Qué <span className="font-semibold italic">incluye</span>?
          </h2>
          <p className="text-silver text-sm mb-10">
            Cobertura estándar. Tu asesor puede personalizarla según tu perfil.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {page.coverages.map((cov) => (
              <div
                key={cov}
                className="flex items-start gap-3 p-4 rounded-sm border border-gold/15 bg-gold/3 hover:border-gold/30 transition-colors"
              >
                <span className="text-gold mt-0.5 shrink-0">✓</span>
                <span className="text-silver text-sm">{cov}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA footer */}
      <section className="py-16 border-t border-gold/10 text-center">
        <div className="max-w-xl mx-auto px-6">
          <p
            className="text-2xl font-light mb-6"
            style={{ fontFamily: "var(--font-cormorant, serif)" }}
          >
            ¿Listo para estar <span className="font-semibold italic text-gold">protegido</span>?
          </p>
          <Link
            href={`/#quote?type=${slug}`}
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light
                       text-navy-deep text-sm font-bold px-10 py-4 rounded-sm
                       transition-all duration-300 hover:shadow-[0_0_30px_rgba(201,168,76,0.4)]"
          >
            Cotización gratis en 15 minutos →
          </Link>
          <p className="text-silver/50 text-xs mt-4">Sin compromisos · 100% digital</p>
        </div>
      </section>

      {/* Social share */}
      <section className="py-10 border-t border-gold/10">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-silver/50 text-xs tracking-[0.2em] uppercase mb-4">Compartir</p>
          <div className="flex flex-wrap gap-2">
            {/* WhatsApp */}
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`${page.headline} — NovaSeguros 🛡️\nhttps://novaseguros.cr/seguros/${slug}`)}`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-gold/15 hover:border-emerald-500/40
                         hover:bg-emerald-500/5 text-silver hover:text-emerald-300
                         text-xs px-4 py-2 rounded-full transition-all duration-200"
              aria-label="Compartir por WhatsApp"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp
            </a>
            {/* X (Twitter) */}
            <a
              href={`https://x.com/intent/tweet?text=${encodeURIComponent(`${page.headline} con NovaSeguros 🛡️ ${page.price}`)}&url=${encodeURIComponent(`https://novaseguros.cr/seguros/${slug}`)}`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-gold/15 hover:border-sky-500/40
                         hover:bg-sky-500/5 text-silver hover:text-sky-300
                         text-xs px-4 py-2 rounded-full transition-all duration-200"
              aria-label="Compartir en X"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              X
            </a>
            {/* Facebook */}
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://novaseguros.cr/seguros/${slug}`)}`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-gold/15 hover:border-blue-500/40
                         hover:bg-blue-500/5 text-silver hover:text-blue-300
                         text-xs px-4 py-2 rounded-full transition-all duration-200"
              aria-label="Compartir en Facebook"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Facebook
            </a>
            {/* LinkedIn */}
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://novaseguros.cr/seguros/${slug}`)}`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-gold/15 hover:border-blue-400/40
                         hover:bg-blue-400/5 text-silver hover:text-blue-200
                         text-xs px-4 py-2 rounded-full transition-all duration-200"
              aria-label="Compartir en LinkedIn"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* Other insurances */}
      <section className="py-12 border-t border-gold/10">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-silver/50 text-xs tracking-[0.2em] uppercase mb-5">También te puede interesar</p>
          <div className="flex flex-wrap gap-3">
            {INSURANCE_PAGES.filter(p => p.slug !== slug).map(p => (
              <Link
                key={p.slug}
                href={`/seguros/${p.slug}`}
                className="text-sm text-silver hover:text-gold border border-gold/15 hover:border-gold/40
                           px-4 py-2 rounded-full transition-all duration-200"
              >
                {p.headline}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const GA_ID        = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const CONSENT_KEY  = "nova_cookie_v2";

export default function GoogleAnalytics() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const check = () => {
      try {
        const raw = localStorage.getItem(CONSENT_KEY);
        if (!raw) return;
        setEnabled((JSON.parse(raw) as { analytics?: boolean }).analytics === true);
      } catch { /* ignore */ }
    };
    check();
    window.addEventListener("storage", check);
    // Also re-check when cookie banner fires a custom event
    window.addEventListener("nova:cookie-saved", check);
    return () => {
      window.removeEventListener("storage", check);
      window.removeEventListener("nova:cookie-saved", check);
    };
  }, []);

  if (!GA_ID || !enabled) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_ID}', { send_page_view: true });
      `}</Script>
    </>
  );
}

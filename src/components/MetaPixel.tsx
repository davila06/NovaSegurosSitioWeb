"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const PIXEL_ID    = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const CONSENT_KEY = "nova_cookie_v2";

export default function MetaPixel() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const check = () => {
      try {
        const raw = localStorage.getItem(CONSENT_KEY);
        if (!raw) return;
        setEnabled((JSON.parse(raw) as { marketing?: boolean }).marketing === true);
      } catch { /* ignore */ }
    };
    check();
    window.addEventListener("storage", check);
    window.addEventListener("nova:cookie-saved", check);
    return () => {
      window.removeEventListener("storage", check);
      window.removeEventListener("nova:cookie-saved", check);
    };
  }, []);

  if (!PIXEL_ID || !enabled) return null;

  return (
    <Script id="meta-pixel" strategy="afterInteractive">{`
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
      n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
      document,'script','https://connect.facebook.net/en_US/fbevents.js');
      fbq('init','${PIXEL_ID}');fbq('track','PageView');
    `}</Script>
  );
}

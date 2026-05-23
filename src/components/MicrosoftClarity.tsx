"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
const CONSENT_KEY = "nova_cookie_v2";

/** Microsoft Clarity — only loads when analytics cookies are consented. */
export default function MicrosoftClarity() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const check = () => {
      try {
        const raw = localStorage.getItem(CONSENT_KEY);
        if (!raw) return;
        const prefs = JSON.parse(raw) as { analytics?: boolean };
        setEnabled(prefs.analytics === true);
      } catch { /* ignore */ }
    };

    check();
    window.addEventListener("nova:cookie-saved", check);
    window.addEventListener("storage", check);

    return () => {
      window.removeEventListener("nova:cookie-saved", check);
      window.removeEventListener("storage", check);
    };
  }, []);

  if (!CLARITY_ID || !enabled) return null;

  return (
    <Script id="ms-clarity" strategy="afterInteractive">{`
      (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window,document,"clarity","script","${CLARITY_ID}");
    `}</Script>
  );
}

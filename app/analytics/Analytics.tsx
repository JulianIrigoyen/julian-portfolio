"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/* Every provider is gated on its env var. With none set the site renders and
   builds exactly as before — no scripts, no network calls, no errors. */
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID || "";
const GTAG_ID = process.env.NEXT_PUBLIC_GTAG_ID || "";

declare global {
  interface Window {
    clarity?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export default function Analytics() {
  const pathname = usePathname();
  const first = useRef(true);

  /* Clarity follows history changes on its own, but it does not know what a
     page means to us. The tag is what makes the recording list filterable —
     and here it is the only way to tell / apart from /console. */
  useEffect(() => {
    if (!CLARITY_ID || typeof window.clarity !== "function") return;
    window.clarity("set", "page", pathname);
  }, [pathname]);

  /* gtag('config') fires one page_view on load. Client-side navigation after
     that is invisible to GA4 unless we send it ourselves. */
  useEffect(() => {
    if (!GTAG_ID) return;
    if (first.current) {
      first.current = false;
      return;
    }
    if (typeof window.gtag !== "function") return;
    window.gtag("event", "page_view", {
      page_path: pathname,
      page_location: window.location.href,
    });
  }, [pathname]);

  return (
    <>
      {CLARITY_ID && (
        <Script id="ms-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,"clarity","script","${CLARITY_ID}");`}
        </Script>
      )}

      {GTAG_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GTAG_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config','${GTAG_ID}');`}
          </Script>
        </>
      )}
    </>
  );
}

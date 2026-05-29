"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

export default function AdManager() {
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    // Fetch settings on client side
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data);
      })
      .catch(console.error);
  }, []);

  return (
    <>
      {/* Header Scripts / Meta tags */}
      {settings.ad_header_script && (
        <div dangerouslySetInnerHTML={{ __html: settings.ad_header_script }} />
      )}

      {/* Pop-under Scripts (Adsterra, Monetag, etc.) */}
      {settings.ad_popunder_script && (
        <div dangerouslySetInnerHTML={{ __html: settings.ad_popunder_script }} />
      )}

      {/* Pop-up / Interstitial */}
      {settings.ad_popup_script && (
        <div dangerouslySetInnerHTML={{ __html: settings.ad_popup_script }} />
      )}
    </>
  );
}

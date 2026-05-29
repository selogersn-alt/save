import DownloadClient from "./DownloadClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Téléchargement en cours... | Save.digitalh",
  description: "Récupération de votre vidéo en haute qualité.",
  robots: {
    index: false,
    follow: false,
  }
};

async function getSettings() {
  try {
    const res = await fetch(`${process.env.API_URL || 'http://api:3001'}/api/settings`, { cache: 'no-store' });
    if (!res.ok) return {};
    return res.json();
  } catch { return {}; }
}

export default async function DownloadPage({ params }: { params: { id: string } }) {
  const settings = await getSettings();
  
  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center">
      {/* Background effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-purple-600/10 blur-[120px] mix-blend-screen pointer-events-none"></div>
      
      <DownloadClient id={params.id} adBannerHtml={settings.ad_banner_html || ""} />
    </main>
  );
}

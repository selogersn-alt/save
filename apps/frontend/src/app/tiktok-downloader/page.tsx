import DownloaderForm from "@/components/DownloaderForm";
import { Sparkles, Video, CheckCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Téléchargeur Vidéo TikTok Sans Filigrane | Save.digitalh",
  description: "Téléchargez des vidéos TikTok sans logo ni filigrane en HD MP4 ou MP3 gratuitement. Rapide, illimité et compatible iPhone/Android.",
  keywords: ["tiktok downloader", "télécharger tiktok sans filigrane", "tiktok mp4", "tiktok mp3", "télécharger video tiktok gratuit"],
};

async function getSettings() {
  try {
    const res = await fetch(`${process.env.API_URL || 'http://api:3001'}/api/settings`, { cache: 'no-store' });
    if (!res.ok) return {};
    return res.json();
  } catch { return {}; }
}

export default async function TikTokDownloader() {
  const settings = await getSettings();

  return (
    <main className="relative min-h-screen overflow-hidden flex flex-col items-center pt-10 px-4">
      {/* Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-pink-600/20 blur-[120px] mix-blend-screen animate-float"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-600/20 blur-[120px] mix-blend-screen animate-float" style={{ animationDelay: "2s" }}></div>

      {/* Banner Ad from Admin Settings */}
      {settings.ad_banner_html && (
        <div className="w-full max-w-4xl mx-auto mb-8 flex justify-center z-20" dangerouslySetInnerHTML={{ __html: settings.ad_banner_html }} />
      )}

      <div className="z-10 w-full max-w-4xl text-center space-y-8 flex-1">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm font-medium text-pink-300 mb-4">
          <Sparkles className="w-4 h-4" />
          <span>100% Gratuit et Sans Filigrane</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          Téléchargeur <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-blue-500">TikTok</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12">
          Collez le lien de la vidéo TikTok ci-dessous. Nous la téléchargeons instantanément en qualité HD originale, sans le logo TikTok (watermark).
        </p>

        <DownloaderForm platform="tiktok" />

        <div className="text-left mt-24 mb-12 max-w-4xl mx-auto glass-card p-8 rounded-3xl space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-extrabold text-white">Comment télécharger une vidéo TikTok sans filigrane ?</h2>
              <ol className="space-y-6 text-slate-300">
                <li className="flex gap-4">
                  <div className="bg-pink-500/20 text-pink-400 font-bold w-8 h-8 rounded-full flex items-center justify-center shrink-0">1</div>
                  <div>
                    <strong className="text-white block mb-1">Copiez le lien TikTok</strong>
                    Ouvrez l'application TikTok, choisissez la vidéo, appuyez sur "Partager" puis "Copier le lien".
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="bg-pink-500/20 text-pink-400 font-bold w-8 h-8 rounded-full flex items-center justify-center shrink-0">2</div>
                  <div>
                    <strong className="text-white block mb-1">Collez le lien</strong>
                    Revenez sur cette page et collez le lien dans le champ de texte ci-dessus.
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="bg-pink-500/20 text-pink-400 font-bold w-8 h-8 rounded-full flex items-center justify-center shrink-0">3</div>
                  <div>
                    <strong className="text-white block mb-1">Téléchargez</strong>
                    Cliquez sur le bouton Télécharger et choisissez votre format (Vidéo MP4 ou Musique MP3).
                  </div>
                </li>
              </ol>
            </div>
            
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1611605698335-8b15d27e03f9?w=600&auto=format&fit=crop&q=60" 
                alt="TikTok Downloader Illustration" 
                className="w-full h-72 object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex items-end p-4">
                <span className="text-xs font-semibold bg-pink-500 text-white px-2.5 py-1 rounded-md shadow-lg">HD & No Watermark</span>
              </div>
            </div>
          </div>

          <hr className="border-slate-800" />

          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Pourquoi choisir notre téléchargeur TikTok ?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300 text-sm">
              <div className="flex gap-2">
                <CheckCircle className="w-5 h-5 text-pink-400 shrink-0" />
                <span><strong>Sans logo TikTok :</strong> Les vidéos sont extraites dans leur version brute, sans aucun filigrane gênant.</span>
              </div>
              <div className="flex gap-2">
                <CheckCircle className="w-5 h-5 text-pink-400 shrink-0" />
                <span><strong>Qualité originale HD :</strong> Conserve la résolution originale (1080p) pour une netteté absolue.</span>
              </div>
              <div className="flex gap-2">
                <CheckCircle className="w-5 h-5 text-pink-400 shrink-0" />
                <span><strong>Extraction audio MP3 :</strong> Permet d'extraire la musique ou le son de fond de n'importe quel TikTok en MP3.</span>
              </div>
              <div className="flex gap-2">
                <CheckCircle className="w-5 h-5 text-pink-400 shrink-0" />
                <span><strong>Aucune limite :</strong> Téléchargez autant de vidéos que vous le souhaitez, entièrement gratuitement.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

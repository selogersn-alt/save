import DownloaderForm from "@/components/DownloaderForm";
import { Sparkles, Video, CheckCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Téléchargeur Vidéo TikTok Sans Filigrane | Save.digitalh",
  description: "Téléchargez des vidéos TikTok sans logo ni filigrane en HD MP4 ou MP3 gratuitement. Rapide, illimité et compatible iPhone/Android.",
  keywords: ["tiktok downloader", "télécharger tiktok sans filigrane", "tiktok mp4", "tiktok mp3", "télécharger video tiktok gratuit"],
};

export default function TikTokDownloader() {
  return (
    <main className="relative min-h-screen overflow-hidden flex flex-col items-center pt-20 px-4">
      {/* Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-pink-600/20 blur-[120px] mix-blend-screen animate-float"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-600/20 blur-[120px] mix-blend-screen animate-float" style={{ animationDelay: "2s" }}></div>

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

        <div className="text-left mt-24 mb-12 max-w-3xl mx-auto glass-card p-8 rounded-3xl">
          <h2 className="text-2xl font-bold mb-6 text-white">Comment télécharger une vidéo TikTok sans filigrane ?</h2>
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
      </div>
    </main>
  );
}

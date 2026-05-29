import DownloaderForm from "@/components/DownloaderForm";
import { Sparkles } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Convertisseur YouTube MP4 & MP3 | Save.digitalh",
  description: "Téléchargez des vidéos YouTube en haute qualité MP4 ou convertissez-les en MP3 gratuitement. Rapide, sans installation de logiciel.",
  keywords: ["youtube downloader", "télécharger youtube", "youtube mp4", "youtube mp3", "youtube convertisseur"],
};

export default function YouTubeDownloader() {
  return (
    <main className="relative min-h-screen overflow-hidden flex flex-col items-center pt-20 px-4">
      {/* Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-red-600/20 blur-[120px] mix-blend-screen animate-float"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-slate-600/20 blur-[120px] mix-blend-screen animate-float" style={{ animationDelay: "2s" }}></div>

      <div className="z-10 w-full max-w-4xl text-center space-y-8 flex-1">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm font-medium text-red-400 mb-4">
          <Sparkles className="w-4 h-4" />
          <span>Qualité Originale Garantie</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          Convertisseur <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-400">YouTube</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12">
          Convertissez vos vidéos YouTube préférées en MP4 (haute définition) ou en MP3. C'est rapide, sans pub intrusive et 100% gratuit.
        </p>

        <DownloaderForm platform="youtube" />

        <div className="text-left mt-24 mb-12 max-w-3xl mx-auto glass-card p-8 rounded-3xl">
          <h2 className="text-2xl font-bold mb-6 text-white">Comment télécharger une vidéo YouTube ?</h2>
          <ol className="space-y-6 text-slate-300">
            <li className="flex gap-4">
              <div className="bg-red-500/20 text-red-400 font-bold w-8 h-8 rounded-full flex items-center justify-center shrink-0">1</div>
              <div>
                <strong className="text-white block mb-1">Copiez l'URL de la vidéo</strong>
                Allez sur YouTube, trouvez votre vidéo, et copiez l'adresse complète dans la barre de votre navigateur (ou cliquez sur Partager).
              </div>
            </li>
            <li className="flex gap-4">
              <div className="bg-red-500/20 text-red-400 font-bold w-8 h-8 rounded-full flex items-center justify-center shrink-0">2</div>
              <div>
                <strong className="text-white block mb-1">Collez le lien</strong>
                Revenez sur cette page et collez l'adresse de la vidéo dans notre formulaire.
              </div>
            </li>
            <li className="flex gap-4">
              <div className="bg-red-500/20 text-red-400 font-bold w-8 h-8 rounded-full flex items-center justify-center shrink-0">3</div>
              <div>
                <strong className="text-white block mb-1">Convertissez</strong>
                Choisissez MP4 pour la vidéo ou MP3 pour la musique, et appuyez sur Télécharger !
              </div>
            </li>
          </ol>
        </div>
      </div>
    </main>
  );
}

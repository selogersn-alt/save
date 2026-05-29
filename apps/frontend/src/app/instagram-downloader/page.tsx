import DownloaderForm from "@/components/DownloaderForm";
import { Sparkles } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Téléchargeur Vidéo & Reels Instagram | Save.digitalh",
  description: "Téléchargez des vidéos, Reels et IGTV depuis Instagram en qualité HD. Outil gratuit, rapide et anonyme.",
  keywords: ["instagram downloader", "télécharger instagram reels", "instagram mp4", "telecharger video instagram", "instagram save"],
};

export default function InstagramDownloader() {
  return (
    <main className="relative min-h-screen overflow-hidden flex flex-col items-center pt-20 px-4">
      {/* Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-fuchsia-600/20 blur-[120px] mix-blend-screen animate-float"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-orange-600/20 blur-[120px] mix-blend-screen animate-float" style={{ animationDelay: "2s" }}></div>

      <div className="z-10 w-full max-w-4xl text-center space-y-8 flex-1">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm font-medium text-fuchsia-300 mb-4">
          <Sparkles className="w-4 h-4" />
          <span>Vidéos, Reels & IGTV</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          Téléchargeur <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-orange-400">Instagram</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12">
          Sauvegardez facilement des vidéos et des Reels Instagram directement sur votre appareil, en HD et de manière totalement anonyme.
        </p>

        <DownloaderForm platform="instagram" />

        <div className="text-left mt-24 mb-12 max-w-3xl mx-auto glass-card p-8 rounded-3xl">
          <h2 className="text-2xl font-bold mb-6 text-white">Comment télécharger un Reel Instagram ?</h2>
          <ol className="space-y-6 text-slate-300">
            <li className="flex gap-4">
              <div className="bg-fuchsia-500/20 text-fuchsia-400 font-bold w-8 h-8 rounded-full flex items-center justify-center shrink-0">1</div>
              <div>
                <strong className="text-white block mb-1">Trouvez la vidéo</strong>
                Sur Instagram, trouvez la vidéo ou le Reel que vous souhaitez télécharger. Appuyez sur les trois petits points ou l'icône de partage, et sélectionnez "Copier le lien".
              </div>
            </li>
            <li className="flex gap-4">
              <div className="bg-fuchsia-500/20 text-fuchsia-400 font-bold w-8 h-8 rounded-full flex items-center justify-center shrink-0">2</div>
              <div>
                <strong className="text-white block mb-1">Collez l'URL</strong>
                Revenez ici, collez le lien dans le grand champ de recherche de la page.
              </div>
            </li>
            <li className="flex gap-4">
              <div className="bg-fuchsia-500/20 text-fuchsia-400 font-bold w-8 h-8 rounded-full flex items-center justify-center shrink-0">3</div>
              <div>
                <strong className="text-white block mb-1">Sauvegardez</strong>
                Appuyez sur le bouton Télécharger et la vidéo s'enregistrera sur votre appareil en qualité optimale.
              </div>
            </li>
          </ol>
        </div>
      </div>
    </main>
  );
}

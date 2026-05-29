import DownloaderForm from "@/components/DownloaderForm";
import { Sparkles } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Téléchargeur Vidéo & Reels Instagram | Save.digitalh",
  description: "Téléchargez des vidéos, Reels et IGTV depuis Instagram en qualité HD. Outil gratuit, rapide et anonyme.",
  keywords: ["instagram downloader", "télécharger instagram reels", "instagram mp4", "telecharger video instagram", "instagram save"],
};

async function getSettings() {
  try {
    const res = await fetch(`${process.env.API_URL || 'http://api:3001'}/api/settings`, { cache: 'no-store' });
    if (!res.ok) return {};
    return res.json();
  } catch { return {}; }
}

export default async function InstagramDownloader() {
  const settings = await getSettings();

  return (
    <main className="relative min-h-screen overflow-hidden flex flex-col items-center pt-10 px-4">
      {/* Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-fuchsia-600/20 blur-[120px] mix-blend-screen animate-float"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-orange-600/20 blur-[120px] mix-blend-screen animate-float" style={{ animationDelay: "2s" }}></div>

      {/* Banner Ad from Admin Settings */}
      {settings.ad_banner_html && (
        <div className="w-full max-w-4xl mx-auto mb-8 flex justify-center z-20" dangerouslySetInnerHTML={{ __html: settings.ad_banner_html }} />
      )}

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

        <div className="text-left mt-24 mb-12 max-w-4xl mx-auto glass-card p-8 rounded-3xl space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-extrabold text-white">Comment télécharger un Reel Instagram ?</h2>
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
            
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1611262588024-d12430b98920?w=600&auto=format&fit=crop&q=60" 
                alt="Instagram Downloader Illustration" 
                className="w-full h-72 object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex items-end p-4">
                <span className="text-xs font-semibold bg-fuchsia-600 text-white px-2.5 py-1 rounded-md shadow-lg">HD & Anonymous</span>
              </div>
            </div>
          </div>

          <hr className="border-slate-800" />

          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Pourquoi choisir notre téléchargeur Instagram ?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300 text-sm">
              <div className="flex gap-2">
                <CheckCircle className="w-5 h-5 text-fuchsia-400 shrink-0" />
                <span><strong>Sauvegarde 100% anonyme :</strong> Téléchargez les vidéos et Reels sans laisser aucune trace ni avertir l'auteur.</span>
              </div>
              <div className="flex gap-2">
                <CheckCircle className="w-5 h-5 text-fuchsia-400 shrink-0" />
                <span><strong>Haute compatibilité de formats :</strong> Prend en charge les Reels, les publications vidéos simples, le format IGTV, et même les carrousels photos.</span>
              </div>
              <div className="flex gap-2">
                <CheckCircle className="w-5 h-5 text-fuchsia-400 shrink-0" />
                <span><strong>Sans application externe :</strong> Économisez de l'espace sur votre téléphone en évitant d'installer d'autres applications de téléchargement.</span>
              </div>
              <div className="flex gap-2">
                <CheckCircle className="w-5 h-5 text-fuchsia-400 shrink-0" />
                <span><strong>Téléchargements illimités :</strong> Utilisez l'outil autant de fois que souhaité, sans restriction de débit ni de quantité.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

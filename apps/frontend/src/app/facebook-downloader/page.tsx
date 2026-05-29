import DownloaderForm from "@/components/DownloaderForm";
import { Sparkles, Facebook, Info, Shield, CheckCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Téléchargeur Vidéo Facebook & Reels Gratuit | Save.digitalh",
  description: "Téléchargez des vidéos Facebook, Reels et vidéos privées en ligne en HD MP4 gratuitement. Rapide, anonyme et sans inscription.",
  keywords: ["facebook downloader", "télécharger video facebook", "facebook reels downloader", "téléchargement facebook hd", "sauvegarder video facebook"],
};

async function getSettings() {
  try {
    const res = await fetch(`${process.env.API_URL || 'http://api:3001'}/api/settings`, { cache: 'no-store' });
    if (!res.ok) return {};
    return res.json();
  } catch { return {}; }
}

export default async function FacebookDownloader() {
  const settings = await getSettings();

  return (
    <main className="relative min-h-screen overflow-hidden flex flex-col items-center pt-10 px-4">
      {/* Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-600/20 blur-[120px] mix-blend-screen animate-float"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-slate-600/20 blur-[120px] mix-blend-screen animate-float" style={{ animationDelay: "2s" }}></div>

      {/* Banner Ad from Admin Settings */}
      {settings.ad_banner_html && (
        <div className="w-full max-w-4xl mx-auto mb-8 flex justify-center z-20" dangerouslySetInnerHTML={{ __html: settings.ad_banner_html }} />
      )}

      <div className="z-10 w-full max-w-4xl text-center space-y-8 flex-1">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm font-medium text-blue-300 mb-4">
          <Sparkles className="w-4 h-4" />
          <span>Vidéos, Réels & Vidéos Privées</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          Téléchargeur <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">Facebook</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12">
          Sauvegardez instantanément des vidéos de profil, des pages et des Reels Facebook directement en qualité HD, 100% gratuitement et de manière sécurisée.
        </p>

        <DownloaderForm platform="facebook" />

        {/* Informative / SEO Copy explaining how to download */}
        <div className="text-left mt-24 mb-12 max-w-3xl mx-auto glass-card p-8 rounded-3xl space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-6 text-white">Comment télécharger une vidéo ou un Reel Facebook ?</h2>
            <ol className="space-y-6 text-slate-300">
              <li className="flex gap-4">
                <div className="bg-blue-500/20 text-blue-400 font-bold w-8 h-8 rounded-full flex items-center justify-center shrink-0">1</div>
                <div>
                  <strong className="text-white block mb-1">Copiez le lien Facebook</strong>
                  Sur l'application Facebook ou le site web, cliquez sur "Partager" sous la vidéo ou le Reel, puis sélectionnez "Copier le lien".
                </div>
              </li>
              <li className="flex gap-4">
                <div className="bg-blue-500/20 text-blue-400 font-bold w-8 h-8 rounded-full flex items-center justify-center shrink-0">2</div>
                <div>
                  <strong className="text-white block mb-1">Collez l'adresse URL</strong>
                  Revenez sur cette page, collez le lien dans le champ de saisie ci-dessus.
                </div>
              </li>
              <li className="flex gap-4">
                <div className="bg-blue-500/20 text-blue-400 font-bold w-8 h-8 rounded-full flex items-center justify-center shrink-0">3</div>
                <div>
                  <strong className="text-white block mb-1">Lancez le téléchargement</strong>
                  Cliquez sur le bouton "Télécharger". Notre outil analysera le lien et vous fournira le fichier en format SD ou HD MP4 pour un téléchargement immédiat.
                </div>
              </li>
            </ol>
          </div>

          <hr className="border-slate-800" />

          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Pourquoi utiliser notre téléchargeur vidéo Facebook ?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300 text-sm">
              <div className="flex gap-2">
                <CheckCircle className="w-5 h-5 text-blue-400 shrink-0" />
                <span><strong>Qualité Haute Définition :</strong> Récupère les flux vidéos en HD (1080p ou supérieure) selon la source originale.</span>
              </div>
              <div className="flex gap-2">
                <CheckCircle className="w-5 h-5 text-blue-400 shrink-0" />
                <span><strong>Téléchargements de Reels :</strong> Totalement compatible avec les nouveaux formats Reels de Facebook.</span>
              </div>
              <div className="flex gap-2">
                <CheckCircle className="w-5 h-5 text-blue-400 shrink-0" />
                <span><strong>Rapide & Sans inscription :</strong> Pas besoin de créer un compte ni de partager des données personnelles.</span>
              </div>
              <div className="flex gap-2">
                <CheckCircle className="w-5 h-5 text-blue-400 shrink-0" />
                <span><strong>Compatibilité totale :</strong> Fonctionne à merveille sur PC, Mac, Android, iPhone et iPad.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

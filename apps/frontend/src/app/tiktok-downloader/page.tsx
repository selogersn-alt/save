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

        {/* SEO & FAQ Section inspirée de SnapTik */}
        <div className="text-left mt-24 mb-12 max-w-4xl mx-auto glass-card p-6 md:p-10 rounded-3xl space-y-12">
          
          <div className="space-y-6 text-slate-300 leading-relaxed">
            <h2 className="text-3xl font-extrabold text-white">Télécharger vidéo TikTok sans filigrane GRATUITEMENT</h2>
            <p>
              Notre plateforme est l'un des meilleurs téléchargeurs TikTok disponibles en ligne pour télécharger des vidéos TikTok sans filigrane (watermark). Vous n'avez pas besoin d'installer de logiciel sur votre ordinateur ou votre téléphone mobile. Tout ce dont vous avez besoin est un lien vidéo TikTok, et tout le traitement est effectué sur nos serveurs ultra-rapides. Vous êtes à un clic du téléchargement de vos vidéos préférées sur vos appareils.
            </p>

            <h3 className="text-2xl font-bold text-white mt-8 mb-4">Principales caractéristiques :</h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <CheckCircle className="w-6 h-6 text-pink-400 shrink-0" />
                <span><strong>Pas de filigrane :</strong> Profitez d'une meilleure qualité de visionnage, ce que la plupart des outils concurrents ne peuvent pas faire.</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="w-6 h-6 text-pink-400 shrink-0" />
                <span><strong>Tous vos appareils :</strong> Téléchargez des vidéos TikTok sur le support que vous souhaitez : mobile, PC ou tablette. TikTok permet uniquement de télécharger des vidéos via son application, et ces vidéos contiennent un filigrane gênant.</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="w-6 h-6 text-pink-400 shrink-0" />
                <span><strong>Directement via navigateur :</strong> Nous voulons que les choses soient simples pour vous. Pas besoin de télécharger ou d'installer de logiciels ni d'extensions suspectes.</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="w-6 h-6 text-pink-400 shrink-0" />
                <span><strong>100% Gratuit :</strong> C'est toujours gratuit. Nous plaçons seulement quelques publicités discrètes qui soutiennent le maintien de nos services.</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="w-6 h-6 text-pink-400 shrink-0" />
                <span><strong>Prise en charge des Carrousels (Photos) :</strong> Notre outil offre la possibilité de télécharger les diaporamas photos TikTok. Vous pouvez télécharger chaque image individuellement en haute définition.</span>
              </li>
            </ul>
          </div>

          <hr className="border-slate-800" />

          {/* Foire Aux Questions (FAQ) Accordion */}
          <div className="space-y-6">
            <h2 className="text-3xl font-extrabold text-white mb-8">Foire Aux Questions (FAQ)</h2>
            
            <div className="space-y-4">
              <details className="group bg-slate-900/50 rounded-2xl border border-slate-800 open:bg-slate-900/80 transition-all">
                <summary className="flex cursor-pointer items-center justify-between p-5 font-semibold text-white">
                  Comment obtenir le lien de téléchargement vidéo TikTok ?
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-5 pb-5 text-slate-400 leading-relaxed">
                  Ouvrez l'application TikTok sur votre téléphone ou le site web sur votre ordinateur. Choisissez la vidéo que vous souhaitez télécharger. Appuyez sur le bouton Partager (la flèche) en bas à droite. Cliquez sur "Copier le lien".
                </div>
              </details>

              <details className="group bg-slate-900/50 rounded-2xl border border-slate-800 open:bg-slate-900/80 transition-all">
                <summary className="flex cursor-pointer items-center justify-between p-5 font-semibold text-white">
                  Où sont enregistrées les vidéos TikTok après leur téléchargement ?
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-5 pb-5 text-slate-400 leading-relaxed">
                  Par défaut, les vidéos sont enregistrées dans le dossier "Téléchargements" de votre navigateur web, que ce soit sur un ordinateur (Windows/Mac) ou sur votre smartphone (Android/iOS).
                </div>
              </details>

              <details className="group bg-slate-900/50 rounded-2xl border border-slate-800 open:bg-slate-900/80 transition-all">
                <summary className="flex cursor-pointer items-center justify-between p-5 font-semibold text-white">
                  Conservez-vous une copie des vidéos téléchargées ?
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-5 pb-5 text-slate-400 leading-relaxed">
                  Non, nous ne stockons aucune vidéo et nous ne conservons aucune copie des vidéos téléchargées. Toutes les vidéos sont directement issues des serveurs originaux de TikTok (CDN). De plus, nous ne suivons pas l'historique de téléchargement de nos utilisateurs.
                </div>
              </details>

              <details className="group bg-slate-900/50 rounded-2xl border border-slate-800 open:bg-slate-900/80 transition-all">
                <summary className="flex cursor-pointer items-center justify-between p-5 font-semibold text-white">
                  Dois-je payer pour télécharger des vidéos TikTok ?
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-5 pb-5 text-slate-400 leading-relaxed">
                  Non ! Notre outil est 100% gratuit à vie. Vous n'avez pas besoin de payer le moindre centime.
                </div>
              </details>

              <details className="group bg-slate-900/50 rounded-2xl border border-slate-800 open:bg-slate-900/80 transition-all">
                <summary className="flex cursor-pointer items-center justify-between p-5 font-semibold text-white">
                  Comment télécharger sur iPhone (iOS) ?
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-5 pb-5 text-slate-400 leading-relaxed">
                  Grâce à la politique d'Apple, vous pouvez désormais utiliser notre site Web directement depuis le navigateur Safari de votre iPhone (sous iOS 13 ou supérieur). Copiez le lien de la vidéo TikTok, collez-le ici et cliquez sur Télécharger. La vidéo sera sauvegardée dans vos fichiers ou votre pellicule.
                </div>
              </details>

              <details className="group bg-slate-900/50 rounded-2xl border border-slate-800 open:bg-slate-900/80 transition-all">
                <summary className="flex cursor-pointer items-center justify-between p-5 font-semibold text-white">
                  Fournissez-vous une solution de téléchargement TikTok MP3 ?
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-5 pb-5 text-slate-400 leading-relaxed">
                  Absolument ! Lors du téléchargement de n'importe quelle vidéo, notre système extrait automatiquement l'audio d'origine et vous propose un bouton pour télécharger le format MP3 (Musique) en haute qualité.
                </div>
              </details>
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 mt-8">
            <h4 className="font-bold text-amber-500 mb-2">Remarque importante :</h4>
            <p className="text-sm text-slate-400">
              Notre outil n'est pas affilié à TikTok, ByteDance Ltd, ni aucun autre réseau social. Nous aidons uniquement les utilisateurs à télécharger du contenu public sans filigrane à des fins personnelles. Si vous rencontrez des problèmes avec d'autres sites web, essayez le nôtre, nous mettons constamment à jour nos serveurs pour permettre une extraction fluide. Merci !
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}

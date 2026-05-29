import Link from "next/link";
import { Sparkles, Info, ArrowLeft, Heart, Zap, Shield, CheckCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À Propos de Nous | Save.digitalh",
  description: "Apprenez-en plus sur Save.digitalh.net, le téléchargeur vidéo haute performance, conçu pour la rapidité, la gratuité et le respect de la vie privée.",
};

export default function AboutPage() {
  return (
    <main className="relative min-h-screen overflow-hidden flex flex-col items-center pt-10 px-4">
      {/* Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-purple-600/10 blur-[120px] mix-blend-screen animate-float"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-600/10 blur-[120px] mix-blend-screen animate-float" style={{ animationDelay: "2s" }}></div>

      <div className="z-10 w-full max-w-3xl space-y-8 pb-20">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Retour à l'accueil
        </Link>

        <div className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm font-medium text-purple-300">
            <Info className="w-4 h-4" />
            <span>Qui Sommes-Nous ?</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            À Propos de Save.digitalh
          </h1>
          <p className="text-slate-400">Le téléchargeur de vidéos universel de nouvelle génération.</p>
        </div>

        <hr className="border-slate-800" />

        <div className="glass-card p-8 rounded-3xl border border-slate-800 space-y-8 text-slate-300">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Notre Mission</h2>
            <p>
              Créée en 2026, la plateforme <strong>Save.digitalh.net</strong> a pour objectif de proposer l'outil le plus simple, le plus rapide et le plus sécurisé pour télécharger des vidéos et musiques depuis les réseaux sociaux les plus populaires du monde.
            </p>
            <p>
              Nous pensons que chaque utilisateur doit pouvoir sauvegarder ses souvenirs et ses vidéos préférées pour une consultation hors ligne sans contrainte ni logo publicitaire intrusif (filigrane / watermark).
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Nos Valeurs Fondamentales</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl space-y-2">
                <Zap className="w-6 h-6 text-yellow-400" />
                <h3 className="font-bold text-white">Vitesse Ultime</h3>
                <p className="text-xs text-slate-400">Nos algorithmes d'extraction récupèrent vos flux multimédias en quelques secondes seulement.</p>
              </div>

              <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl space-y-2">
                <Shield className="w-6 h-6 text-green-400" />
                <h3 className="font-bold text-white">Respect Privé</h3>
                <p className="text-xs text-slate-400">Aucun enregistrement d'historique ni collecte de données. Vos téléchargements sont anonymes.</p>
              </div>

              <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl space-y-2">
                <Heart className="w-6 h-6 text-pink-400" />
                <h3 className="font-bold text-white">100% Gratuit</h3>
                <p className="text-xs text-slate-400">Pas de formule d'abonnement, pas d'inscription. Tout notre service est entièrement accessible gratuitement.</p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Technologie et Haute Performance</h2>
            <p>
              Développé sur une architecture robuste basée sur <strong>Next.js</strong> en frontend et un serveur haute performance asynchrone, notre service gère d'importantes charges de requêtes simultanées pour assurer une disponibilité maximale même aux heures de grande affluence.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

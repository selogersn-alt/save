import Link from "next/link";
import { Sparkles, Shield, ArrowLeft, Lock } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de Confidentialité | Save.digitalh",
  description: "Découvrez notre politique de confidentialité stricte. Pas de conservation de données personnelles ni d'historique de téléchargements.",
};

export default function PrivacyPage() {
  return (
    <main className="relative min-h-screen overflow-hidden flex flex-col items-center pt-10 px-4">
      {/* Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-600/10 blur-[120px] mix-blend-screen animate-float"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-purple-600/10 blur-[120px] mix-blend-screen animate-float" style={{ animationDelay: "2s" }}></div>

      <div className="z-10 w-full max-w-3xl space-y-8 pb-20">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Retour à l'accueil
        </Link>

        <div className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm font-medium text-blue-300">
            <Shield className="w-4 h-4" />
            <span>Sécurité & Vie Privée</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Politique de Confidentialité
          </h1>
          <p className="text-slate-400">Dernière mise à jour : 29 mai 2026</p>
        </div>

        <hr className="border-slate-800" />

        <div className="glass-card p-8 rounded-3xl border border-slate-800 space-y-6 text-slate-300">
          <div className="flex items-center gap-4 bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl mb-4">
            <Lock className="w-8 h-8 text-blue-400 shrink-0" />
            <p className="text-sm text-blue-300 font-medium">
              Chez Save.digitalh.net, nous croyons fermement en l'anonymat et à la confidentialité. Nous ne suivons pas vos téléchargements et ne conservons aucun journal d'activité.
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-white">1. Collecte des données personnelles</h2>
            <p>
              Nous **ne collectons aucune donnée d'identification personnelle** (comme vos noms, adresses, emails ou numéros de téléphone) lorsque vous visitez ou utilisez notre outil de téléchargement vidéo. L'accès à nos fonctionnalités est entièrement anonyme et sans inscription préalable.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-white">2. Historique des téléchargements</h2>
            <p>
              Notre système ne garde **aucun historique permanent** des liens que vous soumettez ou des fichiers que vous téléchargez. Dès que la requête d'extraction est traitée avec succès, les données temporaires correspondantes sont purgées. Aucun fichier vidéo ou audio n'est stocké sur nos serveurs.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-white">3. Utilisation des Cookies</h2>
            <p>
              Save.digitalh.net peut utiliser des cookies de session pour améliorer votre confort d'utilisation (par exemple, pour mémoriser vos choix de format vidéo SD/HD). Nous intégrons également des partenaires publicitaires tiers qui peuvent utiliser des cookies pour diffuser des publicités pertinentes et non intrusives.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-white">4. Sécurité des données</h2>
            <p>
              Toutes les connexions vers notre site internet sont sécurisées par un protocole de chiffrement SSL standard de bout en bout (HTTPS). Vos requêtes et extractions transitent de manière cryptée pour garantir qu'aucune tierce partie ne puisse intercepter vos activités.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

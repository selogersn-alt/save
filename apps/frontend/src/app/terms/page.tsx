import Link from "next/link";
import { Sparkles, FileText, ArrowLeft, Shield } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions d'Utilisation | Save.digitalh",
  description: "Consultez les conditions d'utilisation générales de la plateforme Save.digitalh.net pour le téléchargement sécurisé de vidéos.",
};

export default function TermsPage() {
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
            <FileText className="w-4 h-4" />
            <span>Document Légal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Conditions d'Utilisation
          </h1>
          <p className="text-slate-400">Dernière mise à jour : 29 mai 2026</p>
        </div>

        <hr className="border-slate-800" />

        <div className="glass-card p-8 rounded-3xl border border-slate-800 space-y-6 text-slate-300">
          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-white">1. Acceptation des conditions</h2>
            <p>
              En accédant et en utilisant la plateforme <strong>Save.digitalh.net</strong>, vous acceptez sans réserve d'être lié par les présentes conditions générales d'utilisation. Si vous n'acceptez pas ces conditions, veuillez cesser immédiatement d'utiliser ce site.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-white">2. Utilisation autorisée</h2>
            <p>
              Notre outil de téléchargement vidéo est conçu uniquement pour un usage strictement **personnel, privé et non commercial**. 
            </p>
            <p>
              L'utilisateur s'engage à respecter les droits de propriété intellectuelle des créateurs de contenus. Vous ne devez pas utiliser ce service pour télécharger des œuvres protégées par le droit d'auteur sans l'autorisation expresse de leur auteur d'origine.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-white">3. Propriété intellectuelle</h2>
            <p>
              Save.digitalh.net n'héberge aucun contenu vidéo ou audio sur ses serveurs. Toutes les vidéos téléchargées via notre service proviennent directement des serveurs CDN des réseaux sociaux concernés (TikTok, YouTube, Instagram, Facebook). 
            </p>
            <p>
              Les logos, designs et marques déposées de ces réseaux sociaux appartiennent à leurs propriétaires respectifs et ne sont utilisés ici qu'à titre d'illustration fonctionnelle.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-white">4. Clause de non-responsabilité</h2>
            <p>
              Le service est fourni "en l'état" et "selon disponibilité". Save.digitalh.net ne peut garantir que le service sera ininterrompu, exempt d'erreurs ou exempt de tout virus informatique. Nous déclinons toute responsabilité en cas de mauvaise utilisation de notre plateforme ou de violation de droits de tiers par nos utilisateurs.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-white">5. Modifications des conditions</h2>
            <p>
              Nous nous réservons le droit de modifier les présentes conditions d'utilisation à tout moment et sans préavis. Nous vous invitons à consulter régulièrement cette page pour vous tenir informé des éventuels changements.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

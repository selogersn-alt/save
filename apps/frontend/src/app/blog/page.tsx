import Link from "next/link";
import { Sparkles, BookOpen, Calendar, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guides & Tutoriels de Téléchargement Vidéo | Save.digitalh",
  description: "Apprenez à télécharger des vidéos depuis TikTok, YouTube, Instagram et Facebook. Conseils SEO, guides pas à pas et actualités.",
  keywords: ["tutoriel téléchargement", "télécharger video tiktok", "youtube mp3", "seo video downloader"],
};

async function getPosts() {
  try {
    const res = await fetch(`${process.env.API_URL || 'http://api:3001'}/api/posts`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

async function getSettings() {
  try {
    const res = await fetch(`${process.env.API_URL || 'http://api:3001'}/api/settings`, { cache: 'no-store' });
    if (!res.ok) return {};
    return res.json();
  } catch { return {}; }
}

export default async function BlogHub() {
  const posts = await getPosts();
  const settings = await getSettings();

  return (
    <main className="relative min-h-screen overflow-hidden flex flex-col items-center pt-10 px-4">
      {/* Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-purple-600/10 blur-[120px] mix-blend-screen animate-float"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-600/10 blur-[120px] mix-blend-screen animate-float" style={{ animationDelay: "2s" }}></div>

      {/* Banner Ad from Admin Settings */}
      {settings.ad_banner_html && (
        <div className="w-full max-w-4xl mx-auto mb-8 flex justify-center z-20" dangerouslySetInnerHTML={{ __html: settings.ad_banner_html }} />
      )}

      <div className="z-10 w-full max-w-5xl space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm font-medium text-purple-300 mb-2">
            <Sparkles className="w-4 h-4" />
            <span>SEO & Tutoriels Officiels</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Guides & <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Ressources</span>
          </h1>
          
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Découvrez nos guides complets pour maîtriser le téléchargement de médias sur tous les réseaux sociaux et booster votre présence en ligne.
          </p>
        </div>

        {/* Blog Posts Grid */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {posts.map((post: any) => (
              <article 
                key={post.id} 
                className="glass-card hover:bg-white/5 transition-all duration-300 rounded-3xl p-6 flex flex-col justify-between group border border-slate-800 hover:border-purple-500/30 shadow-lg hover:shadow-purple-500/5"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs text-purple-400 font-semibold uppercase tracking-wider">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Guide de téléchargement</span>
                  </div>
                  
                  <h2 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  
                  <p className="text-slate-400 text-sm line-clamp-3">
                    {post.metaDescription || "Découvrez comment utiliser notre outil de téléchargement gratuit, rapide et de haute qualité."}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-800 flex justify-between items-center">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString('fr-FR') : 'Récent'}</span>
                  </div>
                  
                  <Link 
                    href={`/blog/${post.slug}`} 
                    className="flex items-center gap-1 text-sm text-purple-400 font-bold group-hover:gap-2 transition-all"
                  >
                    Lire l'article
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 glass-card rounded-3xl border border-slate-800">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-400 mb-2">Aucun article publié</h3>
            <p className="text-slate-500">Revenez bientôt pour de nouveaux guides et articles SEO !</p>
          </div>
        )}
      </div>
    </main>
  );
}

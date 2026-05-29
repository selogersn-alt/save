import DownloaderForm from "@/components/DownloaderForm";
import { Sparkles, Video, Music, Globe } from "lucide-react";

async function getSettings() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:13001'}/api/settings`, { cache: 'no-store' });
    if (!res.ok) return {};
    return res.json();
  } catch { return {}; }
}

async function getPosts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:13001'}/api/posts`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export default async function Home() {
  const settings = await getSettings();
  const posts = await getPosts();

  return (
    <main className="relative min-h-screen overflow-hidden flex flex-col items-center pt-20 px-4">
      {/* AdBlock (Header) */}
      {settings.header_ad && (
        <div className="w-full max-w-4xl mx-auto mb-8 flex justify-center" dangerouslySetInnerHTML={{ __html: settings.header_ad }} />
      )}

      {/* Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-purple-600/20 blur-[120px] mix-blend-screen animate-float"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-600/20 blur-[120px] mix-blend-screen animate-float" style={{ animationDelay: "2s" }}></div>

      <div className="z-10 w-full max-w-4xl text-center space-y-8 flex-1">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm font-medium text-purple-300 mb-4 animate-bounce">
          <Sparkles className="w-4 h-4" />
          <span>Plateforme Vidéo Nouvelle Génération</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          Téléchargez n'importe où, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 animate-gradient-x">sans filigrane.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12">
          TikTok, YouTube, Instagram... Collez le lien. Nous extrayons la vidéo ou la musique en qualité originale en quelques secondes.
        </p>

        <DownloaderForm />

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 text-left">
          {[
            { icon: Video, title: "Qualité HD", desc: "Sans watermark, 4K & 1080p natif." },
            { icon: Music, title: "Audio MP3", desc: "Extraction audio haute fidélité 320kbps." },
            { icon: Globe, title: "Universel", desc: "Compatible TikTok, YouTube, Insta, Facebook." },
          ].map((feat, i) => (
            <div key={i} className="glass-card p-6 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer group">
              <feat.icon className="w-8 h-8 text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-lg mb-2">{feat.title}</h3>
              <p className="text-slate-400 text-sm">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SEO Texts / Blog Section */}
      <div className="w-full bg-slate-900/50 border-t border-slate-800 mt-20 py-12 px-4 z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Guides & Informations</h2>
          <div className="grid gap-6">
            {posts.length > 0 ? (
              posts.map((post: any) => (
                <article key={post.id} className="p-6 glass-card rounded-2xl">
                  <h3 className="text-xl font-bold text-purple-300 mb-2">{post.title}</h3>
                  <div className="text-slate-400 prose prose-invert" dangerouslySetInnerHTML={{ __html: post.content }} />
                </article>
              ))
            ) : (
              <p className="text-slate-500">Aucun article publié pour le moment.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

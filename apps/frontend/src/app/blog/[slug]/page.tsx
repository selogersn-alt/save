import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, ArrowLeft, BookOpen, Clock, ShieldCheck, HelpCircle } from "lucide-react";
import type { Metadata } from "next";

interface Props {
  params: {
    slug: string;
  };
}

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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const posts = await getPosts();
  const post = posts.find((p: any) => p.slug === params.slug);
  
  if (!post) {
    return {
      title: "Article non trouvé | Save.digitalh",
    };
  }

  return {
    title: `${post.title} | Save.digitalh`,
    description: post.metaDescription || "Guide officiel de téléchargement vidéo et audio en haute qualité.",
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      type: "article",
      url: `https://save.digitalh.net/blog/${post.slug}`,
    }
  };
}

export default async function BlogPostPage({ params }: Props) {
  const posts = await getPosts();
  const post = posts.find((p: any) => p.slug === params.slug);
  const settings = await getSettings();

  if (!post) {
    notFound();
  }

  // Calculate approximate reading time
  const words = post.content ? post.content.replace(/<[^>]*>/g, '').split(/\s+/).length : 0;
  const readTime = Math.ceil(words / 200) || 3;

  return (
    <main className="relative min-h-screen overflow-hidden flex flex-col items-center pt-10 px-4">
      {/* Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-purple-600/10 blur-[120px] mix-blend-screen animate-float"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-600/10 blur-[120px] mix-blend-screen animate-float" style={{ animationDelay: "2s" }}></div>

      {/* Banner Ad from Admin Settings */}
      {settings.ad_banner_html && (
        <div className="w-full max-w-4xl mx-auto mb-8 flex justify-center z-20" dangerouslySetInnerHTML={{ __html: settings.ad_banner_html }} />
      )}

      <div className="z-10 w-full max-w-3xl space-y-8 pb-20">
        {/* Back Link */}
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux guides
        </Link>

        {/* Article Header */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-purple-400" />
              {post.createdAt ? new Date(post.createdAt).toLocaleDateString('fr-FR') : 'Récent'}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-purple-400" />
              {readTime} min de lecture
            </span>
            <span className="flex items-center gap-1 uppercase bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-md font-semibold tracking-wider">
              Guide Officiel
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {post.title}
          </h1>

          {post.metaDescription && (
            <p className="text-lg text-slate-400 italic border-l-2 border-purple-500 pl-4 py-1">
              {post.metaDescription}
            </p>
          )}
        </div>

        <hr className="border-slate-800" />

        {/* Styled Post Content container */}
        <article className="glass-card p-8 rounded-3xl border border-slate-800/80 shadow-2xl relative">
          <div 
            className="text-slate-300 space-y-6 leading-relaxed text-base break-words 
              [&_h1]:text-3xl [&_h1]:font-extrabold [&_h1]:text-white [&_h1]:mt-8 [&_h1]:mb-4
              [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:text-purple-300
              [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-white [&_h3]:mt-6 [&_h3]:mb-3
              [&_p]:text-slate-300 [&_p]:mb-4
              [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:mb-6 [&_ul]:text-slate-300
              [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_ol]:mb-6 [&_ol]:text-slate-300
              [&_li]:text-slate-300
              [&_strong]:text-white [&_strong]:font-semibold
              [&_a]:text-purple-400 [&_a]:underline [&_a]:hover:text-purple-300
              [&_blockquote]:border-l-4 [&_blockquote]:border-purple-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:bg-slate-900/30 [&_blockquote]:py-2 [&_blockquote]:rounded-r-lg [&_blockquote]:my-4"
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />
        </article>

        {/* Custom Interactive Feedback Card */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-10 h-10 text-green-400 shrink-0" />
            <div>
              <h4 className="font-bold text-white text-sm">Téléchargements Sécurisés & Anonymes</h4>
              <p className="text-xs text-slate-400">Save.digitalh utilise des protocoles chiffrés pour préserver votre vie privée.</p>
            </div>
          </div>
          <Link 
            href="/" 
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-purple-500/20"
          >
            Télécharger une vidéo
          </Link>
        </div>
      </div>
    </main>
  );
}

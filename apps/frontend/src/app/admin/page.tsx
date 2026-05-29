"use client";
import { useState, useEffect } from "react";
import { Settings, Edit3, Save } from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'ads' | 'blog'>('ads');
  const [adCode, setAdCode] = useState("");
  const [post, setPost] = useState({ title: '', slug: '', content: '', metaDescription: '' });
  const [status, setStatus] = useState("");

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:13001';
    fetch(`${apiUrl}/api/settings`)
      .then(res => res.json())
      .then(data => {
        if (data.header_ad) setAdCode(data.header_ad);
      })
      .catch(console.error);
  }, []);

  const saveAd = async () => {
    setStatus("Sauvegarde...");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:13001';
    await fetch(`${apiUrl}/api/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'header_ad', value: adCode })
    });
    setStatus("Publicité sauvegardée !");
  };

  const savePost = async () => {
    setStatus("Sauvegarde...");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:13001';
    await fetch(`${apiUrl}/api/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post)
    });
    setStatus("Article publié !");
    setPost({ title: '', slug: '', content: '', metaDescription: '' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Settings className="w-8 h-8 text-purple-500" />
          Panneau d'Administration
        </h1>

        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => setActiveTab('ads')}
            className={`px-6 py-3 rounded-xl font-bold ${activeTab === 'ads' ? 'bg-purple-600' : 'bg-slate-800'}`}
          >
            Gestion des Publicités
          </button>
          <button 
            onClick={() => setActiveTab('blog')}
            className={`px-6 py-3 rounded-xl font-bold ${activeTab === 'blog' ? 'bg-purple-600' : 'bg-slate-800'}`}
          >
            Articles SEO (Blog)
          </button>
        </div>

        {status && <div className="mb-6 p-4 bg-green-500/20 text-green-400 rounded-xl">{status}</div>}

        {activeTab === 'ads' && (
          <div className="glass-card p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <h2 className="text-xl font-bold mb-4">Code Publicitaire (Header / Bannières)</h2>
            <textarea 
              className="w-full h-48 bg-slate-950 border border-slate-700 rounded-xl p-4 text-slate-300 font-mono"
              placeholder="<!-- Insérez le script AdSense ou PropellerAds ici -->"
              value={adCode}
              onChange={(e) => setAdCode(e.target.value)}
            />
            <button onClick={saveAd} className="mt-4 bg-purple-600 px-6 py-3 rounded-xl font-bold flex items-center gap-2">
              <Save className="w-5 h-5" /> Enregistrer les Pubs
            </button>
          </div>
        )}

        {activeTab === 'blog' && (
          <div className="glass-card p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h2 className="text-xl font-bold mb-4">Créer un Nouvel Article</h2>
            <input 
              type="text" placeholder="Titre de l'article (ex: Comment télécharger une vidéo TikTok)"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-slate-300"
              value={post.title} onChange={e => setPost({...post, title: e.target.value})}
            />
            <input 
              type="text" placeholder="Slug (ex: telecharger-tiktok)"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-slate-300"
              value={post.slug} onChange={e => setPost({...post, slug: e.target.value})}
            />
            <input 
              type="text" placeholder="Meta description pour Google"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-slate-300"
              value={post.metaDescription} onChange={e => setPost({...post, metaDescription: e.target.value})}
            />
            <textarea 
              placeholder="Contenu de l'article (HTML supporté)..."
              className="w-full h-64 bg-slate-950 border border-slate-700 rounded-xl p-4 text-slate-300"
              value={post.content} onChange={e => setPost({...post, content: e.target.value})}
            />
            <button onClick={savePost} className="mt-4 bg-purple-600 px-6 py-3 rounded-xl font-bold flex items-center gap-2">
              <Edit3 className="w-5 h-5" /> Publier l'article
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import { Settings, Edit3, Save } from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'ads' | 'blog'>('ads');
  const [ads, setAds] = useState({
    ad_header_script: "",
    ad_popunder_script: "",
    ad_popup_script: "",
    ad_banner_html: ""
  });

  useEffect(() => {
    fetch(`/api/settings`)
      .then(res => res.json())
      .then(data => {
        setAds({
          ad_header_script: data.ad_header_script || "",
          ad_popunder_script: data.ad_popunder_script || "",
          ad_popup_script: data.ad_popup_script || "",
          ad_banner_html: data.ad_banner_html || ""
        });
      })
      .catch(console.error);
  }, []);

  const saveAds = async () => {
    setStatus("Sauvegarde des publicités...");
    
    // Save each ad sequentially
    for (const [key, value] of Object.entries(ads)) {
      await fetch(`/api/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value })
      });
    }
    
    setStatus("Machine à publicités sauvegardée !");
  };

  const savePost = async () => {
    setStatus("Sauvegarde...");
    await fetch(`/api/posts`, {
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
            Machine à Publicités
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
          <div className="glass-card p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2">Scripts d'En-tête (Header / Meta)</h2>
              <p className="text-sm text-slate-400 mb-2">Ex: Google AdSense Auto-ads, balises de vérification.</p>
              <textarea 
                className="w-full h-32 bg-slate-950 border border-slate-700 rounded-xl p-4 text-slate-300 font-mono"
                value={ads.ad_header_script}
                onChange={(e) => setAds({...ads, ad_header_script: e.target.value})}
              />
            </div>

            <div>
              <h2 className="text-xl font-bold mb-2">Pop-Under Scripts</h2>
              <p className="text-sm text-slate-400 mb-2">Ex: Monetag, Adsterra popunders (S'ouvrent en arrière-plan).</p>
              <textarea 
                className="w-full h-32 bg-slate-950 border border-slate-700 rounded-xl p-4 text-slate-300 font-mono"
                value={ads.ad_popunder_script}
                onChange={(e) => setAds({...ads, ad_popunder_script: e.target.value})}
              />
            </div>

            <div>
              <h2 className="text-xl font-bold mb-2">Pop-Up / Interstitial Scripts</h2>
              <p className="text-sm text-slate-400 mb-2">Ex: Scripts de recouvrement (Pop-up classique).</p>
              <textarea 
                className="w-full h-32 bg-slate-950 border border-slate-700 rounded-xl p-4 text-slate-300 font-mono"
                value={ads.ad_popup_script}
                onChange={(e) => setAds({...ads, ad_popup_script: e.target.value})}
              />
            </div>

            <div>
              <h2 className="text-xl font-bold mb-2">Bannière Principale (HTML)</h2>
              <p className="text-sm text-slate-400 mb-2">Code HTML de la bannière affichée juste au-dessus du champ de téléchargement.</p>
              <textarea 
                className="w-full h-32 bg-slate-950 border border-slate-700 rounded-xl p-4 text-slate-300 font-mono"
                value={ads.ad_banner_html}
                onChange={(e) => setAds({...ads, ad_banner_html: e.target.value})}
              />
            </div>

            <button onClick={saveAds} className="mt-4 bg-purple-600 px-6 py-3 rounded-xl font-bold flex items-center gap-2">
              <Save className="w-5 h-5" /> Enregistrer la Machine à Pubs
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

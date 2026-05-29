"use client";

import { useState } from "react";
import { Download, Video, Music } from "lucide-react";

export default function DownloaderForm() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleDownload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    
    try {
      const formData = new FormData(e.currentTarget);
      const action = formData.get('action');

      const res = await fetch(`/api/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, action })
      });
      
      if (!res.ok) throw new Error("Erreur lors de la communication avec l'API.");
      const data = await res.json();
      
      const pollStatus = async (id: string) => {
        try {
          const statusRes = await fetch(`/api/status/${id}`);
          if (!statusRes.ok) throw new Error("Impossible de récupérer le statut.");
          const statusData = await statusRes.json();
          
          if (statusData.status === 'completed') {
            setResult(statusData.result);
            setLoading(false);
          } else if (statusData.status === 'failed') {
            setError(statusData.result?.error || "L'extraction a échoué.");
            setLoading(false);
          } else {
            setTimeout(() => pollStatus(id), 2000);
          }
        } catch (err: any) {
          setError(err.message);
          setLoading(false);
        }
      };
      
      pollStatus(data.id);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 relative z-10">
      <form onSubmit={handleDownload} className="glass-card p-6 md:p-8 rounded-3xl w-full flex flex-col gap-6 shadow-2xl transition-all duration-300 hover:shadow-purple-500/10 border-t border-purple-500/20">
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input 
              type="url" 
              required
              placeholder="Collez le lien TikTok, YouTube ou Instagram ici..." 
              className="w-full bg-slate-900/80 border border-slate-700/50 rounded-2xl pl-6 pr-12 py-5 text-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-slate-500 text-white shadow-inner"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold px-10 py-5 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-wait shadow-lg shadow-purple-500/20"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span className="text-lg">Analyse...</span>
              </>
            ) : (
              <>
                <Download className="w-6 h-6" />
                <span className="text-lg">Télécharger</span>
              </>
            )}
          </button>
        </div>

        <div className="flex items-center justify-center gap-8 text-base font-medium mt-2">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative flex items-center justify-center">
              <input type="radio" name="action" value="video" defaultChecked className="peer sr-only" />
              <div className="w-5 h-5 rounded-full border-2 border-slate-600 peer-checked:border-purple-500 peer-checked:bg-purple-500 transition-all"></div>
              <div className="absolute w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity"></div>
            </div>
            <span className="text-slate-300 group-hover:text-white transition-colors flex items-center gap-2">
              <Video className="w-4 h-4 text-purple-400" /> Vidéo HD (MP4)
            </span>
          </label>
          
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative flex items-center justify-center">
              <input type="radio" name="action" value="audio" className="peer sr-only" />
              <div className="w-5 h-5 rounded-full border-2 border-slate-600 peer-checked:border-blue-500 peer-checked:bg-blue-500 transition-all"></div>
              <div className="absolute w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity"></div>
            </div>
            <span className="text-slate-300 group-hover:text-white transition-colors flex items-center gap-2">
              <Music className="w-4 h-4 text-blue-400" /> Audio (MP3)
            </span>
          </label>
        </div>
      </form>

      {/* Error State */}
      {error && (
        <div className="glass-card p-4 rounded-2xl w-full text-red-400 font-medium">
          🚨 {error}
        </div>
      )}

      {/* Results Display */}
      {result && (
        <div className="glass-card p-8 rounded-3xl w-full animate-fade-in text-left">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {result.thumbnail && (
              <img src={result.thumbnail} alt="Thumbnail" className="w-full md:w-48 h-auto rounded-xl object-cover shadow-lg" />
            )}
            <div className="flex-1 space-y-4">
              <h2 className="text-2xl font-bold line-clamp-2">{result.title}</h2>
              <p className="text-slate-400 text-sm">Durée: {result.duration_string || "N/A"} • Extrait via {result.extractor}</p>
              
              <div className="flex flex-wrap gap-3 mt-4">
                {result.url && (
                  <a href={result.url} target="_blank" rel="noreferrer" className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-medium inline-flex items-center gap-2 transition-colors">
                    <Video className="w-4 h-4" /> Vidéo HD (Direct)
                  </a>
                )}
                {result.formats?.filter((f: any) => f.vcodec !== 'none' && f.acodec !== 'none').slice(0, 2).map((fmt: any, idx: number) => (
                  <a key={idx} href={fmt.url} target="_blank" rel="noreferrer" className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium inline-flex items-center gap-2 transition-colors">
                    <Download className="w-4 h-4" /> {fmt.resolution || fmt.format_note} ({fmt.ext})
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

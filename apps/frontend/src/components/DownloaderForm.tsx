"use client";

import { useState } from "react";
import { Download, Video, Music } from "lucide-react";
import { useRouter } from "next/navigation";

interface DownloaderFormProps {
  platform?: "all" | "tiktok" | "youtube" | "instagram";
}

export default function DownloaderForm({ platform = "all" }: DownloaderFormProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const getPlaceholder = () => {
    switch(platform) {
      case "tiktok": return "Collez le lien de la vidéo TikTok ici...";
      case "youtube": return "Collez le lien YouTube ici...";
      case "instagram": return "Collez le lien de la vidéo ou du Reel Instagram ici...";
      default: return "Collez le lien TikTok, YouTube ou Instagram ici...";
    }
  };

  const handleDownload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const formData = new FormData(e.currentTarget);
      const action = formData.get('action');

      const res = await fetch(`/api/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, action })
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Erreur API (${res.status}): ${errorText}`);
      }
      const data = await res.json();
      
      // Redirect to the dedicated download page
      router.push(`/download/${data.id}`);
      
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
              placeholder={getPlaceholder()} 
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
                <span className="text-lg">Préparation...</span>
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
              <Video className="w-4 h-4 text-purple-400" /> Vidéo (MP4)
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
    </div>
  );
}

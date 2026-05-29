"use client";

import { useEffect, useState } from "react";
import { Download, Video, Music, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";

interface DownloadResultProps {
  id: string;
  adBannerHtml: string;
}

export default function DownloadResult({ id, adBannerHtml }: DownloadResultProps) {
  const [status, setStatus] = useState<string>("processing");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const poll = async () => {
      try {
        const res = await fetch(`/api/status/${id}`);
        if (!res.ok) {
          if (res.status === 404) throw new Error("Téléchargement introuvable ou expiré.");
          throw new Error("Erreur de connexion avec le serveur.");
        }
        
        const data = await res.json();
        setStatus(data.status);

        if (data.status === "completed") {
          setResult(data.result);
        } else if (data.status === "failed") {
          setError(data.result?.error || "L'extraction a échoué.");
        } else {
          timeoutId = setTimeout(poll, 2000); // continue polling
        }
      } catch (err: any) {
        setStatus("failed");
        setError(err.message);
      }
    };

    poll();
    return () => clearTimeout(timeoutId);
  }, [id]);

  // Tri intelligent des formats
  let hdFormat: any = null;
  let sdFormat: any = null;
  let audioFormat: any = null;
  let imageUrls: string[] = [];

  if (result) {
    const formats = result.formats || [];
    
    // Audio (Best audio only)
    audioFormat = formats.find((f: any) => f.vcodec === 'none' && f.acodec !== 'none') || formats[0];
    
    // Vidéos (Avec video + audio mixé)
    const videoFormats = formats.filter((f: any) => f.vcodec !== 'none' && f.acodec !== 'none');
    
    // HD: La plus haute résolution ou direct URL
    hdFormat = result.url ? { url: result.url, format_note: "Qualité Max", ext: "mp4" } : videoFormats.reduce((prev: any, current: any) => {
      return (prev.height > current.height) ? prev : current;
    }, videoFormats[0]);

    // SD: Une qualité inférieure (ex: 480p ou 360p)
    sdFormat = videoFormats.find((f: any) => f.height && f.height <= 480) || 
               videoFormats.find((f: any) => f.height && f.height < (hdFormat?.height || 720));

    // Détection des images (Carrousels Instagram, Slides TikTok, etc.)
    if (result.images && Array.isArray(result.images)) {
      imageUrls = result.images;
    } else if (result.entries && Array.isArray(result.entries)) {
      imageUrls = result.entries
        .map((entry: any) => entry.url || entry.thumbnail)
        .filter((url: any) => url && typeof url === 'string');
    } else if (result.url && typeof result.url === 'string' && (result.url.includes('.jpg') || result.url.includes('.png') || result.url.includes('.webp') || result.url.includes('.jpeg'))) {
      imageUrls = [result.url];
    } else if (result.extractor === 'instagram' && (!formats || formats.length === 0 || !formats.some((f: any) => f.vcodec !== 'none'))) {
      if (result.url) imageUrls = [result.url];
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 relative z-10 pt-24 px-4 pb-20">
      
      {/* Emplacement Publicitaire Ultra-Premium */}
      {adBannerHtml && (
        <div className="w-full flex justify-center mb-12 bg-slate-900/50 p-4 rounded-3xl border border-slate-800" 
             dangerouslySetInnerHTML={{ __html: adBannerHtml }} />
      )}

      {status === "processing" || status === "pending" ? (
        <div className="glass-card p-12 rounded-3xl w-full text-center flex flex-col items-center justify-center space-y-6">
          <Loader2 className="w-16 h-16 text-purple-500 animate-spin" />
          <h2 className="text-2xl font-bold text-white">Extraction en cours...</h2>
          <p className="text-slate-400">Veuillez patienter pendant que nous récupérons la meilleure qualité possible. Ne fermez pas cette page.</p>
          <div className="w-full max-w-md h-2 bg-slate-800 rounded-full overflow-hidden mt-8">
            <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 w-1/2 animate-pulse rounded-full"></div>
          </div>
        </div>
      ) : status === "failed" ? (
        <div className="glass-card p-12 rounded-3xl w-full text-center space-y-6 border border-red-500/30">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
          <h2 className="text-2xl font-bold text-red-400">Échec du téléchargement</h2>
          <p className="text-slate-300">{error}</p>
          <Link href="/" className="inline-block mt-4 px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-colors">
            Réessayer avec un autre lien
          </Link>
        </div>
      ) : (
        <div className="glass-card p-8 md:p-12 rounded-3xl w-full animate-fade-in text-left">
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            
            {/* Miniature */}
            {result?.thumbnail ? (
              <div className="w-full lg:w-1/3 shrink-0">
                <img src={result.thumbnail} alt="Thumbnail" className="w-full aspect-video lg:aspect-[4/5] rounded-2xl object-cover shadow-2xl border border-slate-800" />
              </div>
            ) : imageUrls.length > 0 ? (
              <div className="w-full lg:w-1/3 shrink-0">
                <img src={imageUrls[0]} alt="Thumbnail Image" className="w-full aspect-video lg:aspect-[4/5] rounded-2xl object-cover shadow-2xl border border-slate-800" />
              </div>
            ) : (
              <div className="w-full lg:w-1/3 aspect-video bg-slate-800 rounded-2xl flex items-center justify-center shrink-0">
                <Video className="w-12 h-12 text-slate-600" />
              </div>
            )}

            {/* Infos et Boutons */}
            <div className="flex-1 space-y-6 w-full">
              <div>
                <h1 className="text-3xl font-extrabold line-clamp-2 text-white mb-2">{result?.title || "Média Prêt !"}</h1>
                <p className="text-slate-400 font-medium">Source: <span className="capitalize">{result?.extractor}</span> {result?.duration_string ? `• Durée: ${result.duration_string}` : ""}</p>
              </div>
              
              <div className="space-y-4 pt-4">
                {/* Images Download Gallery (TikTok Slides or Instagram Carousels) */}
                {imageUrls.length > 0 && (
                  <div className="space-y-4 pt-2">
                    <h3 className="text-xl font-bold text-white mb-2">Télécharger les Images HD</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {imageUrls.map((imgUrl, index) => (
                        <div key={index} className="relative group rounded-2xl overflow-hidden border border-slate-850 bg-slate-900/50 aspect-square flex flex-col justify-between p-3">
                          <img src={imgUrl} alt={`Slide ${index + 1}`} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-60" />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                          
                          <span className="z-10 bg-slate-950/70 backdrop-blur-md px-2 py-0.5 rounded-lg text-xs font-semibold text-white w-max">
                            Image {index + 1}
                          </span>
                          
                          <a 
                            href={`/api/download-proxy?url=${encodeURIComponent(imgUrl)}&filename=${encodeURIComponent(result?.title || 'image')}-${index + 1}.jpg`}
                            download
                            className="z-10 w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-purple-500/20 active:scale-95"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Télécharger
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bouton HD (Only if not purely an image post) */}
                {hdFormat && !imageUrls.length && (
                  <a href={`/api/download-proxy?url=${encodeURIComponent(hdFormat.url)}&filename=${encodeURIComponent(result?.title || 'video')}.${hdFormat.ext || 'mp4'}`} 
                     download
                     className="w-full group relative flex items-center justify-between p-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-2xl transition-all shadow-lg hover:shadow-purple-500/25 active:scale-[0.98]">
                    <div className="flex items-center gap-4">
                      <div className="bg-white/20 p-3 rounded-xl"><Download className="w-6 h-6 text-white" /></div>
                      <div className="text-left">
                        <div className="font-bold text-white text-lg">Télécharger Vidéo HD</div>
                        <div className="text-white/70 text-sm">Qualité Maximale ({hdFormat.ext})</div>
                      </div>
                    </div>
                  </a>
                )}

                {/* Bouton SD (Only if not purely an image post) */}
                {sdFormat && sdFormat.url !== hdFormat?.url && !imageUrls.length && (
                  <a href={`/api/download-proxy?url=${encodeURIComponent(sdFormat.url)}&filename=${encodeURIComponent(result?.title || 'video-sd')}.${sdFormat.ext || 'mp4'}`}
                     download
                     className="w-full group relative flex items-center justify-between p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-2xl transition-all active:scale-[0.98]">
                    <div className="flex items-center gap-4">
                      <div className="bg-slate-900 p-3 rounded-xl"><Video className="w-6 h-6 text-slate-300" /></div>
                      <div className="text-left">
                        <div className="font-bold text-white text-lg">Télécharger Vidéo SD</div>
                        <div className="text-slate-400 text-sm">Qualité Normale {sdFormat.format_note && `(${sdFormat.format_note})`}</div>
                      </div>
                    </div>
                  </a>
                )}

                {/* Bouton Audio (Only if not purely an image post) */}
                {audioFormat && !imageUrls.length && (
                  <a href={`/api/download-proxy?url=${encodeURIComponent(audioFormat.url)}&filename=${encodeURIComponent(result?.title || 'audio')}.${audioFormat.ext || 'mp3'}`}
                     download
                     className="w-full group relative flex items-center justify-between p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-2xl transition-all active:scale-[0.98]">
                    <div className="flex items-center gap-4">
                      <div className="bg-slate-900 p-3 rounded-xl"><Music className="w-6 h-6 text-slate-300" /></div>
                      <div className="text-left">
                        <div className="font-bold text-white text-lg">Télécharger Audio</div>
                        <div className="text-slate-400 text-sm">Format MP3/M4A ({audioFormat.ext})</div>
                      </div>
                    </div>
                  </a>
                )}
              </div>
              
              <p className="text-xs text-slate-500 text-center mt-6">
                En téléchargeant ce média, vous acceptez nos conditions d'utilisation. Réservé à un usage personnel.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

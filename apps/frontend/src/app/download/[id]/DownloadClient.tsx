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
  let carouselImages: string[] = [];
  let carouselVideos: any[] = [];

  if (result) {
    const formats = result.formats || [];
    
    // Audio (Best audio only)
    audioFormat = formats.find((f: any) => f.vcodec === 'none' && f.acodec !== 'none') || formats[0];
    
    // Vidéos (Avec video + audio mixé)
    const videoFormats = formats.filter((f: any) => f.vcodec !== 'none' && f.acodec !== 'none');
    
    // HD: On privilégie les formats vidéo directs extraits, et on se replie sur result.url uniquement s'il n'y en a pas
    hdFormat = videoFormats.length > 0
      ? videoFormats.reduce((prev: any, current: any) => (prev.height > current.height) ? prev : current, videoFormats[0])
      : (result.url ? { url: result.url, format_note: "Qualité Max", ext: "mp4" } : null);

    // SD: Une qualité inférieure (ex: 480p ou 360p)
    sdFormat = videoFormats.find((f: any) => f.height && f.height <= 480) || 
               videoFormats.find((f: any) => f.height && f.height < (hdFormat?.height || 720));

    // Une playlist est considérée comme un compte/chaîne si l'extracteur le spécifie
    // ou si l'URL ne correspond pas à un post/vidéo unique.
    const isProfileOrPlaylist = result.entries && Array.isArray(result.entries) && result.entries.length > 0 &&
      (result.extractor?.includes('user') || result.extractor?.includes('channel') || result.extractor?.includes('tab') || result.extractor?.includes('playlist') ||
       (!result.original_url?.includes('/p/') && !result.original_url?.includes('/reel/') && !result.original_url?.includes('/video/')));

    if (result.entries && Array.isArray(result.entries) && !isProfileOrPlaylist) {
      result.entries.forEach((entry: any) => {
        const hasVideo = (entry.formats && entry.formats.some((f: any) => f.vcodec !== 'none')) ||
                         (entry.vcodec && entry.vcodec !== 'none') ||
                         (entry.url && entry.url.includes('.mp4')) ||
                         (entry.ext === 'mp4');
                         
        if (hasVideo) {
          let videoUrl = entry.url;
          if (entry.formats && entry.formats.length > 0) {
            const bestFormat = entry.formats.reduce((prev: any, current: any) => (prev.height > current.height) ? prev : current, entry.formats[0]);
            videoUrl = bestFormat.url || videoUrl;
          }
          carouselVideos.push({
            title: entry.title || `Vidéo ${carouselVideos.length + 1}`,
            url: videoUrl,
            thumbnail: entry.thumbnail || result.thumbnail || '/favicon.svg',
            ext: entry.ext || 'mp4'
          });
        } else {
          const imgUrl = entry.url || entry.thumbnail;
          if (imgUrl) {
            carouselImages.push(imgUrl);
          }
        }
      });
    }

    // Détection des images (Carrousels Instagram, Slides TikTok, etc.)
    if (carouselImages.length > 0) {
      imageUrls = carouselImages;
    } else if (result.images && Array.isArray(result.images)) {
      imageUrls = result.images;
    } else if (result.url && typeof result.url === 'string' && (result.url.includes('.jpg') || result.url.includes('.png') || result.url.includes('.webp') || result.url.includes('.jpeg'))) {
      imageUrls = [result.url];
    } else if (result.extractor === 'instagram' && (!formats || formats.length === 0 || !formats.some((f: any) => f.vcodec !== 'none'))) {
      if (result.url) imageUrls = [result.url];
    }
  }

  const isAccountOrPlaylist = result && result.entries && Array.isArray(result.entries) && result.entries.length > 0 &&
    (result.extractor?.includes('user') || result.extractor?.includes('channel') || result.extractor?.includes('tab') || result.extractor?.includes('playlist') ||
     (!result.original_url?.includes('/p/') && !result.original_url?.includes('/reel/') && !result.original_url?.includes('/video/')));

  const downloadCSV = () => {
    if (!result || !result.entries) return;
    
    const headers = [
      "ID",
      "Titre/Description",
      "Lien Publication",
      "Description Complete",
      "Nombre de Vues",
      "Nombre de Likes",
      "Nombre de Commentaires",
      "Duree",
      "Auteur/Compte",
      "Date de publication",
      "URL Miniature"
    ];
    
    const csvRows = [
      headers.join(","),
      ...result.entries.map((entry: any) => {
        const row = [
          entry.id || "",
          entry.title || entry.description || "",
          entry.url || "",
          entry.description || "",
          entry.view_count || 0,
          entry.like_count || 0,
          entry.comment_count || 0,
          entry.duration || "",
          entry.uploader || result.title || "",
          entry.upload_date || "",
          entry.thumbnail || ""
        ];
        
        // Échapper les guillemets et virgules pour un CSV valide
        return row.map(val => {
          const str = String(val).replace(/"/g, '""');
          return `"${str}"`;
        }).join(",");
      })
    ];
    
    const csvContent = "\uFEFF" + csvRows.join("\n"); // Encodage UTF-8 BOM pour Excel
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    
    const cleanTitle = (result.title || "export").toLowerCase().replace(/[^a-z0-9]/g, "_");
    link.download = `donnees_compte_${cleanTitle}.csv`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAllImages = () => {
    imageUrls.forEach((imgUrl, index) => {
      setTimeout(() => {
        const link = document.createElement("a");
        const filename = `${result?.title || 'image'}-${index + 1}.jpg`;
        link.href = `/api/download-proxy?url=${encodeURIComponent(imgUrl)}&filename=${encodeURIComponent(filename)}`;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, index * 400);
    });
  };

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
          <Link href="/" className="mt-8 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-sm rounded-2xl transition-all shadow-md hover:scale-[1.02] active:scale-95">
            Annuler et retourner à l'accueil
          </Link>
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
                <p className="text-slate-400 font-medium">
                  {isAccountOrPlaylist ? (
                    <>Type: <span className="text-purple-400 font-semibold">Données de Compte / Playlist</span> • </>
                  ) : null}
                  Source: <span className="capitalize">{result?.extractor || "Inconnue"}</span> {result?.duration_string ? `• Durée: ${result.duration_string}` : ""}
                </p>
              </div>
              
              {isAccountOrPlaylist ? (
                /* --- VUE SCRAPER & EXPORT CSV COMPTE --- */
                <div className="space-y-6 pt-4 w-full">
                  <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="font-semibold text-white">Analyse du compte terminée !</span>
                    </div>
                    <p className="text-sm text-slate-300">
                      Nous avons extrait avec succès les publications et les statistiques de ce compte. Téléchargez le tableau complet au format CSV pour l'ouvrir dans Excel ou Google Sheets.
                    </p>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-400">
                      <div>Publications trouvées : <strong className="text-white">{result.entries.length}</strong></div>
                      <div>Propriétaire : <strong className="text-white">{result.entries[0]?.uploader || result.title || "Inconnu"}</strong></div>
                    </div>
                  </div>

                  <button 
                    onClick={downloadCSV}
                    className="w-full group relative flex items-center justify-between p-5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-2xl transition-all shadow-lg hover:shadow-purple-500/25 active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-4 text-left">
                      <div className="bg-white/20 p-3 rounded-xl">
                        <Download className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-xl">Télécharger les Données du Compte (CSV)</div>
                        <div className="text-white/80 text-sm">Tableau Excel contenant {result.entries.length} publications avec statistiques de vues, likes et liens.</div>
                      </div>
                    </div>
                  </button>

                  {/* Tableau interactif glassmorphic d'aperçu des posts */}
                  <div className="space-y-3 pt-4">
                    <h3 className="text-lg font-bold text-white">Aperçu des publications extraites</h3>
                    <div className="overflow-x-auto border border-slate-800 rounded-2xl">
                      <table className="w-full border-collapse text-left text-sm text-slate-300">
                        <thead className="bg-slate-950/60 text-slate-450 font-semibold">
                          <tr>
                            <th className="p-4 border-b border-slate-800">Titre / Description</th>
                            <th className="p-4 border-b border-slate-800">Date</th>
                            <th className="p-4 border-b border-slate-800 text-right">Vues</th>
                            <th className="p-4 border-b border-slate-800 text-right">Likes</th>
                            <th className="p-4 border-b border-slate-800 text-center">Lien</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50 bg-slate-900/10">
                          {result.entries.slice(0, 5).map((entry: any, index: number) => (
                            <tr key={index} className="hover:bg-slate-800/20 transition-colors">
                              <td className="p-4 max-w-xs truncate font-medium text-white" title={entry.title || entry.description}>
                                {entry.title || entry.description || `Publication #${index + 1}`}
                              </td>
                              <td className="p-4 whitespace-nowrap text-slate-400">
                                {entry.upload_date ? (
                                  entry.upload_date.length === 8 ? 
                                    `${entry.upload_date.slice(6, 8)}/${entry.upload_date.slice(4, 6)}/${entry.upload_date.slice(0, 4)}` : 
                                    entry.upload_date
                                ) : "N/A"}
                              </td>
                              <td className="p-4 text-right font-mono text-xs text-purple-300">
                                {entry.view_count ? Number(entry.view_count).toLocaleString() : "-"}
                              </td>
                              <td className="p-4 text-right font-mono text-xs text-blue-300">
                                {entry.like_count ? Number(entry.like_count).toLocaleString() : "-"}
                              </td>
                              <td className="p-4 text-center">
                                {entry.url ? (
                                  <a 
                                    href={entry.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center p-1.5 bg-slate-800 hover:bg-purple-650 rounded-lg text-white transition-colors"
                                    title="Voir la publication originale"
                                  >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                  </a>
                                ) : "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {result.entries.length > 5 && (
                      <p className="text-xs text-slate-500 italic text-right">
                        + {result.entries.length - 5} autres publications sont incluses dans le fichier CSV.
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                /* --- VUE TELECHARGEMENT DE MEDIAS UNIQUE --- */
                <div className="space-y-6 pt-4 w-full">
                  
                  {/* Message d'aide intelligent pour Instagram (Contournement des blocages IP) */}
                  {result?.extractor === 'instagram' && (
                    <div className="bg-amber-500/10 border border-amber-500/25 p-5 rounded-2xl text-left space-y-2 animate-fade-in">
                      <div className="flex items-center gap-2.5 text-amber-400 font-bold text-sm">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        Astuce de Téléchargement Instagram
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Instagram restreint parfois les serveurs d'hébergement. Si le bouton principal de téléchargement échoue (ou génère un fichier illisible), utilisez le bouton <strong>"Lien Direct"</strong> situé juste à côté. Cela ouvrira l'image ou la vidéo en direct dans un nouvel onglet, où vous pourrez faire un clic droit ou appui long pour l'enregistrer instantanément !
                      </p>
                    </div>
                  )}
                  
                  {/* Vidéos de Carrousel (Multi-vidéos Instagram / TikTok) */}
                  {carouselVideos.length > 0 && (
                    <div className="space-y-4 pt-2 w-full">
                      <h3 className="text-xl font-bold text-white mb-2">Télécharger les Vidéos du Carrousel (HD)</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {carouselVideos.map((video, index) => (
                          <div key={index} className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center gap-4 bg-slate-900/40 hover:bg-slate-900/60 transition-colors w-full">
                            <img src={video.thumbnail} alt={`Thumb ${index + 1}`} className="w-20 aspect-video rounded-xl object-cover border border-slate-800 shrink-0" />
                            <div className="flex-grow text-left min-w-0 flex flex-col justify-between h-full">
                              <h4 className="font-bold text-white text-sm truncate">{video.title}</h4>
                              <p className="text-slate-400 text-xs mt-1">Format: {video.ext.toUpperCase()}</p>
                              
                              <div className="flex items-center gap-2 mt-3">
                                <a 
                                  href={`/api/download-proxy?url=${encodeURIComponent(video.url)}&filename=${encodeURIComponent(result?.title || 'video')}-${index + 1}.${video.ext}`}
                                  download
                                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-purple-650 to-indigo-650 hover:from-purple-550 hover:to-indigo-550 text-white font-bold text-xs rounded-xl transition-all shadow-md active:scale-95"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                  Télécharger
                                </a>
                                <a 
                                  href={video.url} 
                                  target="_blank" 
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-350 hover:text-white font-bold text-xs rounded-xl transition-all border border-slate-700 active:scale-95"
                                  title="Ouvrir dans un nouvel onglet si le bouton principal échoue"
                                >
                                  Lien Direct
                                </a>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Images Download Gallery (TikTok Slides or Instagram Carousels) */}
                  {imageUrls.length > 0 && (
                    <div className="space-y-8 pt-4 w-full">
                      {/* Top Header Card */}
                      <div className="glass-card p-6 rounded-3xl border border-slate-800/80 bg-slate-950/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                        <div className="text-left">
                          <h3 className="text-2xl font-extrabold text-white">Images HD Disponibles</h3>
                          <p className="text-slate-400 text-sm mt-1">Nous avons extrait {imageUrls.length} image{imageUrls.length > 1 ? 's' : ''} en haute définition.</p>
                        </div>
                        {imageUrls.length > 1 && (
                          <button 
                            onClick={downloadAllImages}
                            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-sm rounded-2xl transition-all shadow-xl shadow-emerald-950/50 hover:shadow-emerald-500/25 active:scale-95 shrink-0"
                          >
                            <Download className="w-5 h-5 animate-pulse" />
                            Télécharger TOUTES les images en 1 Clic
                          </button>
                        )}
                      </div>

                      {/* Flux Vertical Instagram Premium - Images non coupées avec bouton en-dessous */}
                      <div className="max-w-2xl mx-auto flex flex-col gap-10 w-full">
                        {imageUrls.map((imgUrl, index) => (
                          <div key={index} className="glass-card p-6 rounded-3xl border border-slate-800/80 bg-slate-900/35 hover:bg-slate-900/50 transition-all flex flex-col gap-6 w-full shadow-xl">
                            {/* Image Container with Original Aspect Ratio */}
                            <div className="relative rounded-2xl overflow-hidden border border-slate-850/60 bg-slate-950/60 flex items-center justify-center w-full">
                              <img 
                                src={imgUrl} 
                                alt={`Image ${index + 1}`} 
                                className="w-full h-auto object-contain max-h-[800px] rounded-2xl shadow-inner transition-transform duration-500 hover:scale-[1.01]" 
                                loading="lazy"
                              />
                              
                              <span className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-xs font-bold text-white border border-slate-800/50">
                                Image {index + 1} / {imageUrls.length}
                              </span>
                            </div>
                            
                            {/* Download Buttons Below the Image */}
                            <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                              <a 
                                href={`/api/download-proxy?url=${encodeURIComponent(imgUrl)}&filename=${encodeURIComponent(result?.title || 'image')}-${index + 1}.jpg`}
                                download
                                className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-indigo-650 hover:from-purple-500 hover:to-indigo-550 text-white font-extrabold text-sm rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-purple-950/40 hover:shadow-purple-500/20 active:scale-[0.98]"
                              >
                                <Download className="w-5 h-5" />
                                Télécharger en HD
                              </a>
                              <a 
                                href={imgUrl} 
                                target="_blank" 
                                rel="noreferrer"
                                className="w-full sm:w-auto py-4 px-6 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white font-extrabold text-sm rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                                title="Ouvrir l'image en direct dans un nouvel onglet"
                              >
                                Lien Direct
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Bouton HD (Only if not purely an image or multi-video post) */}
                  {hdFormat && !imageUrls.length && !carouselVideos.length && (
                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                      <a href={`/api/download-proxy?url=${encodeURIComponent(hdFormat.url)}&filename=${encodeURIComponent(result?.title || 'video')}.${hdFormat.ext || 'mp4'}`} 
                         download
                         className="flex-grow group relative flex items-center justify-between p-4 bg-gradient-to-r from-purple-650 to-indigo-650 hover:from-purple-550 hover:to-indigo-550 rounded-2xl transition-all shadow-lg active:scale-[0.98]">
                        <div className="flex items-center gap-4">
                          <div className="bg-white/20 p-3 rounded-xl"><Download className="w-6 h-6 text-white" /></div>
                          <div className="text-left">
                            <div className="font-bold text-white text-lg">Télécharger Vidéo HD</div>
                            <div className="text-white/70 text-sm">Qualité Maximale ({hdFormat.ext})</div>
                          </div>
                        </div>
                      </a>
                      {result?.extractor === 'instagram' && (
                        <a href={hdFormat.url} 
                           target="_blank"
                           rel="noreferrer"
                           className="px-6 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-350 hover:text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                           title="Lien miroir en direct"
                        >
                          Lien Direct (Miroir)
                        </a>
                      )}
                    </div>
                  )}

                  {/* Bouton SD (Only if not purely an image or multi-video post) */}
                  {sdFormat && sdFormat.url !== hdFormat?.url && !imageUrls.length && !carouselVideos.length && (
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

                  {/* Bouton Audio (Only if not purely an image or multi-video post) */}
                  {audioFormat && !imageUrls.length && !carouselVideos.length && (
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
              )}
              
              {/* Bouton global premium pour télécharger un autre média */}
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8 border-t border-slate-800/60 w-full">
                <Link href="/" className="px-10 py-4 bg-gradient-to-r from-purple-650 to-indigo-650 hover:from-purple-550 hover:to-indigo-550 text-white font-extrabold text-sm rounded-2xl flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-purple-950/20">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Télécharger une autre vidéo / image
                </Link>
              </div>

              <p className="text-xs text-slate-500 text-center mt-6">
                En téléchargeant ces données ou médias, vous acceptez nos conditions d'utilisation. Réservé à un usage personnel.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

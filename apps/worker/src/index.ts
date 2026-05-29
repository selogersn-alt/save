import { Worker, Job } from 'bullmq';
import Redis from 'ioredis';
import { create } from 'youtube-dl-exec';
import { getDb, extractions, settings } from '@telechargeur/database';
import { eq } from 'drizzle-orm';
import OpenAI from 'openai';
import fs from 'fs';

const youtubedl = create('/usr/local/bin/yt-dlp');

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379', 10);
const redisConnection = new Redis({ host: REDIS_HOST, port: REDIS_PORT, maxRetriesPerRequest: null });

const db = getDb(process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:15432/telechargeur');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });

// Options spécifiques pour maximiser la qualité et contourner les blocages
const getExtractorOptions = (url: string, action: string, cookiesPath?: string) => {
  const baseOptions: any = {
    dumpJson: true,
    noCheckCertificates: true,
    noWarnings: true,
    ignoreErrors: true, // Ignorer les erreurs non critiques
    ignoreNoFormatsError: true, // IMPORTANT : Empêche yt-dlp de lever une erreur fatale s'il n'y a pas de vidéo (ex: posts d'images)
    forceIpv4: true, // IMPORTANT : Force la liaison IP sur IPv4 pour correspondre parfaitement au proxy API Node
    addHeader: [
      'referer:google.com',
      'user-agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    ],
  };

  if (cookiesPath) {
    baseOptions.cookies = cookiesPath;
  }

  if (url.includes('tiktok.com')) {
    baseOptions.extractorArgs = 'tiktok:api_hostname=api16-normal-c-useast1a.tiktokv.com';
  }

  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    if (action === 'summary') {
      baseOptions.writeAutoSub = true;
      baseOptions.subLang = 'en,fr';
      baseOptions.skipDownload = true; // On veut juste le JSON et les sous-titres
    } else {
      baseOptions.format = 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best';
    }
  }

  return baseOptions;
};

const worker = new Worker(
  'extraction',
  async (job: Job) => {
    const { id, url, action } = job.data;
    console.log(`[JOB ${job.id}] Démarrage extraction URL: ${url} (Action: ${action})`);
    
    let cookiesPath: string | undefined = undefined;
    try {
      await db.update(extractions).set({ status: 'processing', updatedAt: new Date() }).where(eq(extractions.id, id));

      // Récupération des cookies Netscape s'ils sont enregistrés dans l'administration
      try {
        const settingsRecords = await db.select().from(settings);
        const settingsMap = settingsRecords.reduce((acc: any, curr: any) => ({ ...acc, [curr.key]: curr.value }), {});
        const instaCookies = settingsMap.instagram_cookies;

        if (instaCookies && instaCookies.trim().length > 0) {
          // Utilisation d'un fichier temporaire unique dans le dossier local du conteneur
          cookiesPath = `/tmp/insta_cookies_${job.id}.txt`;
          await fs.promises.writeFile(cookiesPath, instaCookies, 'utf-8');
          console.log(`[JOB ${job.id}] Fichier cookies d'authentification généré avec succès.`);
        }
      } catch (cookieErr) {
        console.warn(`[JOB ${job.id}] Impossible de récupérer ou d'écrire les cookies:`, cookieErr);
      }

      const options = getExtractorOptions(url, action, cookiesPath);
      console.log(`[JOB ${job.id}] Requête youtube-dl-exec...`);
      let output: any;
      try {
        output = await youtubedl(url, options);
      } catch (dlErr: any) {
        // yt-dlp renvoie souvent un code d'erreur 1 pour les posts Instagram sans vidéos (images pures)
        // en disant "No video formats found!", mais il réussit quand même à afficher le JSON contenant l'URL de l'image !
        if (dlErr.stdout) {
          try {
            const stdoutStr = String(dlErr.stdout);
            const jsonStartIndex = stdoutStr.indexOf('{');
            if (jsonStartIndex !== -1) {
              output = JSON.parse(stdoutStr.substring(jsonStartIndex));
              console.log(`[JOB ${job.id}] JSON récupéré avec succès depuis la sortie d'erreur (contournement image Instagram).`);
            }
          } catch (parseErr) {
            console.log(`[JOB ${job.id}] Impossible de parser le JSON depuis stdout.`);
          }
        }
        
        // FALLBACK D'URGENCE COMPLET POUR INSTAGRAM (Si yt-dlp échoue)
        if (!output && (url.includes('instagram.com/p/') || url.includes('instagram.com/reel/'))) {
          console.log(`[JOB ${job.id}] Tentative de Fallback d'urgence via API publique Instagram...`);
          try {
            const shortcodeMatch = url.match(/(?:p|reel)\/([a-zA-Z0-9_-]+)/);
            if (shortcodeMatch) {
              const shortcode = shortcodeMatch[1];
              // On utilise l'API graphql publique pour récupérer les données du post sans yt-dlp
              const gqlUrl = `https://www.instagram.com/graphql/query/?query_hash=b3055c01b4b222b8a47dc12b090e4e64&variables={"shortcode":"${shortcode}"}`;
              const res = await fetch(gqlUrl, {
                headers: {
                   'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }
              });
              
              if (res.ok) {
                const data = await res.json();
                const media = data?.data?.shortcode_media;
                if (media) {
                  let carouselEntries: any[] = [];
                  
                  // Gestion des carrousels
                  if (media.edge_sidecar_to_children && media.edge_sidecar_to_children.edges) {
                    carouselEntries = media.edge_sidecar_to_children.edges.map((edge: any, index: number) => {
                      const node = edge.node;
                      return {
                        id: node.id || String(index),
                        title: `Slide ${index + 1}`,
                        url: node.is_video ? node.video_url : node.display_url,
                        thumbnail: node.display_url,
                        ext: node.is_video ? 'mp4' : 'jpg',
                        vcodec: node.is_video ? 'h264' : 'none',
                        formats: [] 
                      };
                    });
                  }

                  output = {
                    extractor: 'instagram',
                    title: media.edge_media_to_caption?.edges[0]?.node?.text || `Post Instagram ${shortcode}`,
                    url: media.is_video ? media.video_url : media.display_url,
                    thumbnail: media.display_url,
                    original_url: url,
                    entries: carouselEntries.length > 0 ? carouselEntries : undefined
                  };
                  console.log(`[JOB ${job.id}] Fallback GraphQL Instagram réussi !`);
                }
              }
            }
          } catch(fallbackErr) {
            console.error(`[JOB ${job.id}] Fallback Instagram GraphQL a également échoué:`, fallbackErr);
          }
        }

        if (!output) {
          const errDump = dlErr ? (dlErr.shortMessage || dlErr.message || String(dlErr)) : "Inconnue";
          throw new Error(`Erreur critique: ${errDump}`);
        }
      }

      const videoData: any = {
        title: output.title,
        thumbnail: output.thumbnail,
        thumbnails: output.thumbnails || [],
        duration: output.duration_string || `${output.duration}s`,
        extractor: output.extractor,
        original_url: output.original_url,
        url: output.url || output.webpage_url,
      };

      if (action !== 'summary') {
        // Changement critique : yt-dlp trie les formats du pire au meilleur.
        // On prend les 40 DERNIERS (slice(-40)) pour être sûr d'avoir les formats HD (720p, 1080p).
        // On enlève le vcodec || 'none' pour ne pas fausser le frontend sur TikTok/Instagram.
        videoData.formats = output.formats?.filter((f: any) => f.url && !f.url.includes('.m3u8')).map((f: any) => ({
          format_id: f.format_id,
          ext: f.ext,
          resolution: f.resolution,
          height: f.height || null,
          width: f.width || null,
          filesize: f.filesize || null,
          vcodec: f.vcodec, // Ne pas forcer à 'none'
          acodec: f.acodec, // Ne pas forcer à 'none'
          url: f.url
        })).slice(-40);
      }

      if (output.entries && Array.isArray(output.entries)) {
        videoData.entries = output.entries.map((entry: any) => {
          let entryFormats = [];
          if (entry.formats) {
            entryFormats = entry.formats.filter((f: any) => f.url && !f.url.includes('.m3u8')).map((f: any) => ({
              format_id: f.format_id,
              ext: f.ext,
              resolution: f.resolution,
              height: f.height || null,
              width: f.width || null,
              filesize: f.filesize || null,
              vcodec: f.vcodec,
              acodec: f.acodec,
              url: f.url
            })).slice(-40);
          }
          return {
            id: entry.id,
            title: entry.title || entry.description || '',
            url: entry.url || entry.webpage_url || entry.original_url || '',
            description: entry.description || '',
            view_count: entry.view_count || 0,
            like_count: entry.like_count || 0,
            comment_count: entry.comment_count || 0,
            duration: entry.duration_string || (entry.duration ? `${entry.duration}s` : ''),
            uploader: entry.uploader || entry.uploader_id || '',
            upload_date: entry.upload_date || '',
            thumbnail: entry.thumbnail || '',
            thumbnails: entry.thumbnails || [],
            formats: entryFormats,
            ext: entry.ext || '',
            vcodec: entry.vcodec
          };
        });
      }

      // Traitement du résumé via IA
      if (action === 'summary') {
        console.log(`[JOB ${job.id}] Génération du résumé IA...`);
        let transcript = "";
        
        // Tentative de récupération des sous-titres (si présents dans la sortie de yt-dlp)
        const subs = output.requested_subtitles || output.automatic_captions;
        if (subs) {
          const frSub = subs['fr'] || subs['en'];
          if (frSub && frSub.length > 0) {
            const subUrl = frSub.find((s: any) => s.ext === 'json3')?.url || frSub[0].url;
            try {
              const res = await fetch(subUrl);
              const data = await res.text();
              transcript = data.substring(0, 8000); // Récupérer un bout des sous-titres
            } catch (e) {
              console.warn("Impossible de télécharger les sous-titres", e);
            }
          }
        }

        if (!transcript) {
          transcript = `Titre: ${output.title}\nDescription: ${output.description}`;
        }

        if (process.env.OPENAI_API_KEY) {
          const chatCompletion = await openai.chat.completions.create({
            messages: [{ role: 'system', content: 'Tu es un expert qui résume des vidéos de manière concise. Fournis un résumé en 3 points.' }, { role: 'user', content: `Résume le contenu suivant issu d'une vidéo : \n\n${transcript}` }],
            model: 'gpt-4o-mini',
          });
          videoData.ai_summary = chatCompletion.choices[0].message.content;
        } else {
          videoData.ai_summary = "La clé OPENAI_API_KEY n'est pas configurée. Impossible de générer le résumé.";
        }
      }

      console.log(`[JOB ${job.id}] Succès.`);

      await db.update(extractions).set({
        status: 'completed',
        result: videoData,
        platform: output.extractor || 'unknown',
        updatedAt: new Date()
      }).where(eq(extractions.id, id));

    } catch (error: any) {
      console.error(`[JOB ${job.id}] Échec:`, error);
      await db.update(extractions).set({
        status: 'failed',
        result: { error: error.message || 'Erreur inconnue lors de l\'extraction.' },
        updatedAt: new Date()
      }).where(eq(extractions.id, id));
      throw error;
    } finally {
      if (cookiesPath) {
        try {
          await fs.promises.unlink(cookiesPath);
          console.log(`[JOB ${job.id}] Fichier temporaire cookies supprimé.`);
        } catch (err) {
          console.warn(`[JOB ${job.id}] Impossible de supprimer le fichier temporaire cookies:`, err);
        }
      }
    }
  },
  { connection: redisConnection as any, concurrency: 5 }
);

worker.on('completed', job => {
  console.log(`✅ Job ${job.id} terminé avec succès.`);
});

worker.on('failed', (job, err) => {
  console.error(`❌ Job ${job?.id} a échoué: ${err.message}`);
});

console.log('🚀 Worker d\'extraction haute performance démarré...');

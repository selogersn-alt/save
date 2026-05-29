import { Worker, Job } from 'bullmq';
import Redis from 'ioredis';
import youtubedl from 'youtube-dl-exec';
import { getDb, extractions } from '@telechargeur/database';
import { eq } from 'drizzle-orm';
import OpenAI from 'openai';

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379', 10);
const redisConnection = new Redis({ host: REDIS_HOST, port: REDIS_PORT, maxRetriesPerRequest: null });

const db = getDb(process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:15432/telechargeur');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });

// Options spécifiques pour maximiser la qualité et contourner les blocages
const getExtractorOptions = (url: string, action: string) => {
  const baseOptions: any = {
    dumpJson: true,
    noCheckCertificates: true,
    noWarnings: true,
    addHeader: [
      'referer:google.com',
      'user-agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    ],
  };

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
    
    try {
      await db.update(extractions).set({ status: 'processing', updatedAt: new Date() }).where(eq(extractions.id, id));

      const options = getExtractorOptions(url, action);
      console.log(`[JOB ${job.id}] Requête youtube-dl-exec...`);
      const output: any = await youtubedl(url, options);

      const videoData: any = {
        title: output.title,
        thumbnail: output.thumbnail,
        duration: output.duration_string || `${output.duration}s`,
        extractor: output.extractor,
        original_url: output.original_url,
        url: output.url || output.webpage_url,
      };

      if (action !== 'summary') {
        videoData.formats = output.formats?.filter((f: any) => f.url && f.protocol === 'https').map((f: any) => ({
          format_id: f.format_id,
          ext: f.ext,
          resolution: f.resolution,
          filesize: f.filesize,
          vcodec: f.vcodec,
          acodec: f.acodec,
          url: f.url
        })).slice(0, 10);
      }

      if (output.entries && Array.isArray(output.entries)) {
        videoData.entries = output.entries.map((entry: any) => ({
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
          thumbnail: entry.thumbnail || ''
        }));
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

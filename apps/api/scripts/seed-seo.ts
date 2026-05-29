import { getDb, posts } from '@telechargeur/database';

const db = getDb(process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/telechargeur');

const articles = [
  {
    title: "Télécharger une vidéo TikTok sans filigrane : Le Guide Rapide",
    slug: "telecharger-video-tiktok-sans-filigrane",
    metaDescription: "Découvrez la méthode la plus rapide pour télécharger une vidéo TikTok sans filigrane (no watermark) en HD MP4, gratuitement et sans application.",
    content: `
      <h2>Le meilleur outil pour sauvegarder une vidéo TikTok</h2>
      <p>Vous cherchez à <strong>télécharger une vidéo TikTok sans filigrane</strong> (le fameux <em>watermark</em>) pour la repartager sur d'autres réseaux sociaux ou simplement la garder sur votre téléphone ? Vous êtes au bon endroit.</p>
      
      <h3>Pourquoi utiliser un TikTok downloader sans filigrane ?</h3>
      <p>TikTok appose automatiquement son logo sur toutes les vidéos téléchargées directement depuis l'application. Avec notre outil, vous pouvez <strong>sauvegarder une vidéo TikTok</strong> en qualité HD originale, et ce, sans aucun logo.</p>
      
      <ul>
        <li><strong>Gratuit :</strong> Notre <em>free video downloader</em> est accessible à tous.</li>
        <li><strong>Sans application :</strong> Pas besoin d'installer un logiciel lourd, tout se fait en ligne (<em>online video downloader</em>).</li>
        <li><strong>Qualité HD :</strong> Profitez d'un téléchargement TikTok HD en format MP4.</li>
        <li><strong>Format Audio :</strong> Vous pouvez même extraire l'audio et <em>convert TikTok to MP3</em> en un clic.</li>
      </ul>
      
      <h3>Comment ça marche ?</h3>
      <ol>
        <li>Ouvrez TikTok et copiez le lien de la vidéo.</li>
        <li>Collez-le dans notre champ de recherche en haut de la page.</li>
        <li>Cliquez sur Télécharger et choisissez <strong>Download TikTok MP4</strong> ou MP3.</li>
      </ol>
      <p>C'est la solution la plus efficace sur le marché (<em>fast video download</em>), idéale même pour les connexions lentes (<em>low data video downloader</em>).</p>
    `
  },
  {
    title: "Convertir YouTube en MP3 et MP4 : Outil en ligne gratuit",
    slug: "convertir-youtube-mp3-mp4",
    metaDescription: "Le meilleur YouTube converter gratuit pour télécharger une vidéo YouTube en HD MP4 ou convertir YouTube en MP3 haute qualité, sans inscription.",
    content: `
      <h2>Convertisseur YouTube 100% Gratuit</h2>
      <p>Écouter de la musique hors ligne ou garder un tutoriel vidéo sous la main n'a jamais été aussi simple. Notre <strong>YouTube converter</strong> vous permet de <em>télécharger une vidéo YouTube</em> en quelques secondes.</p>
      
      <h3>YouTube MP4 et Haute Définition</h3>
      <p>La plupart des outils sur internet réduisent la qualité de vos vidéos. Ici, nous garantissons un <strong>YouTube HD download</strong>. Que ce soit en 1080p ou 4K, vous récupérez la vidéo telle qu'elle a été publiée par son créateur.</p>
      
      <h3>Extraction et conversion YouTube MP3</h3>
      <p>Besoin uniquement du son ? Utilisez notre fonction <em>audio extractor</em>. C'est le meilleur moyen de <strong>convertir YouTube en MP3</strong> avec une qualité audio supérieure (jusqu'à 320kbps). Parfait pour créer vos playlists hors ligne sur votre mobile (<em>Android video downloader</em>).</p>
      
      <h3>Étapes pour télécharger musique YouTube</h3>
      <ul>
        <li>Copiez l'URL de la vidéo YouTube.</li>
        <li>Insérez le lien sur notre page.</li>
        <li>Sélectionnez l'option <strong>YouTube to MP4</strong> ou l'option MP3.</li>
        <li>Votre fichier est prêt !</li>
      </ul>
    `
  },
  {
    title: "Comment Télécharger un Reel Instagram (Vidéo & Story)",
    slug: "telecharger-reel-instagram-video",
    metaDescription: "Astuce facile pour télécharger un Reel Instagram, une vidéo IGTV ou une Story directement sur votre téléphone, rapidement et anonymement.",
    content: `
      <h2>L'outil ultime pour sauvegarder une vidéo Instagram</h2>
      <p>Instagram ne propose pas de bouton officiel pour <strong>télécharger une vidéo Instagram</strong> directement dans votre galerie. Heureusement, notre outil agit comme un <em>Instagram video downloader</em> parfait, accessible depuis n'importe quel navigateur.</p>
      
      <h3>Sauvegarder un Instagram Reel en 1 clic</h3>
      <p>Les Reels sont le format le plus populaire actuellement. Si vous vous demandez comment <em>download Instagram reel</em>, la réponse est simple. Copiez le lien de partage du Reel et utilisez notre plateforme. C'est un processus sans aucune application tierce (<em>no app needed</em>).</p>
      
      <h3>Les avantages de notre Instagram Downloader</h3>
      <ul>
        <li><strong>Anonymat garanti :</strong> Vous pouvez regarder et <em>save Instagram video</em> sans que le créateur ne soit notifié.</li>
        <li><strong>Qualité parfaite :</strong> Le téléchargement se fait en résolution maximale.</li>
        <li><strong>Tout-en-un :</strong> Fonctionne comme un <em>Instagram story downloader</em> et un récupérateur de Reels.</li>
      </ul>
      <p>Ne perdez plus jamais les vidéos inspirantes de votre feed. Utilisez le meilleur <em>best Instagram reel downloader online</em> !</p>
    `
  },
  {
    title: "Télécharger une vidéo Facebook : Guide Pratique",
    slug: "telecharger-video-facebook-reels",
    metaDescription: "Téléchargez n'importe quelle vidéo Facebook ou Facebook Reels facilement. Outil en ligne gratuit, sans logiciel à installer.",
    content: `
      <h2>Le meilleur Facebook Video Downloader</h2>
      <p>Découvrez comment <strong>télécharger une vidéo Facebook</strong> pour la regarder hors connexion. Beaucoup d'utilisateurs cherchent à garder une trace des moments familiaux ou des tutoriels partagés sur Facebook.</p>
      
      <h3>Téléchargement Facebook Reel et Vidéos Classiques</h3>
      <p>Facebook a récemment poussé le format des vidéos courtes. Notre plateforme fait également office de <em>Facebook reels downloader</em>. Vous pouvez désormais <em>save Facebook video</em> depuis votre smartphone ou votre ordinateur avec une facilité déconcertante.</p>
      
      <h3>Comment faire ? (Facebook video downloader no app)</h3>
      <p>Il n'y a rien à installer ! Voici les étapes :</p>
      <ol>
        <li>Sur Facebook, cliquez sur "Partager" puis "Copier le lien".</li>
        <li>Allez sur notre <strong>online video downloader</strong>.</li>
        <li>Collez le lien et appuyez sur télécharger.</li>
      </ol>
      <p>En quelques secondes, la vidéo est à vous en format MP4 (<em>MP4 converter</em>).</p>
    `
  },
  {
    title: "Best Free Online Video Downloader : Fast & No App",
    slug: "best-free-online-video-downloader",
    metaDescription: "Looking for a free online video downloader? Download videos from TikTok, YouTube, Instagram and Facebook fast, free, and without watermark.",
    content: `
      <h2>The Ultimate Video Downloader for all platforms</h2>
      <p>If you're searching for a reliable <strong>free video downloader</strong>, you've found the right place. Our tool is designed to help you <em>download video</em> files from across the web without the hassle of downloading suspicious apps.</p>
      
      <h3>Why choose our online video downloader?</h3>
      <ul>
        <li><strong>No Watermark Downloader :</strong> Get pristine, clean videos. Especially useful if you want to <em>remove watermark TikTok</em> or get a <em>TikTok without watermark</em>.</li>
        <li><strong>Fast Video Download :</strong> Our servers process requests in seconds.</li>
        <li><strong>Video to MP3 :</strong> Not only a video tool, but a powerful <em>audio extractor</em>.</li>
        <li><strong>Mobile Downloader :</strong> Perfectly optimized for mobile devices, serving as a robust <em>Android video downloader</em>.</li>
      </ul>
      
      <h3>Save Video Online Safely</h3>
      <p>We believe in providing a seamless experience. Whether you need a <em>download TikTok video without watermark HD</em>, or a simple <em>YouTube to MP3 high quality</em> conversion, our <strong>MP4 converter</strong> does it all in one click.</p>
    `
  }
];

async function seed() {
  console.log("🌱 Démarrage du Seeding SEO...");
  
  for (const article of articles) {
    console.log(`Insertion de l'article : ${article.title}`);
    try {
      await db.insert(posts).values({
        title: article.title,
        slug: article.slug,
        metaDescription: article.metaDescription,
        content: article.content,
      });
      console.log(`✅ Article inséré : ${article.slug}`);
    } catch (err: any) {
      if (err.code === '23505') {
        console.log(`⚠️ Article déjà existant (slug: ${article.slug})`);
      } else {
        console.error(`❌ Erreur lors de l'insertion de ${article.slug} :`, err.message);
      }
    }
  }

  console.log("🎉 Seeding terminé avec succès !");
  process.exit(0);
}

seed();

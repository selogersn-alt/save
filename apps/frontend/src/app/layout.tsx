import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Save.digitalh.net | Téléchargeur Vidéo HD & Audio MP3 Gratuit",
  description: "Téléchargez des vidéos TikTok sans filigrane, YouTube et Instagram en MP4 HD ou MP3. Outil ultra rapide, sans limite, 100% gratuit et sans inscription.",
  keywords: ["télécharger vidéo tiktok", "télécharger youtube mp4", "youtube to mp3", "télécharger video instagram", "sans filigrane", "gratuit", "convertisseur mp4"],
  authors: [{ name: "DigitalH" }],
  openGraph: {
    title: "Téléchargeur Vidéo Universel | Save.digitalh.net",
    description: "Le meilleur outil pour télécharger vos vidéos préférées depuis TikTok, YouTube et Instagram. Rapide, gratuit et en haute qualité.",
    url: 'https://save.digitalh.net',
    siteName: 'Save DigitalH',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Téléchargeur Vidéo Universel | Save.digitalh.net",
    description: "Le meilleur outil pour télécharger vos vidéos préférées depuis TikTok, YouTube et Instagram. Rapide, gratuit et en haute qualité.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://save.digitalh.net',
  },
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body className={`${inter.className} min-h-screen bg-slate-950 text-slate-50 selection:bg-purple-500/30`}>
        {children}
      </body>
    </html>
  );
}

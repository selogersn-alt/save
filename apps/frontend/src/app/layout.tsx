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

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import AdManager from "@/components/AdManager";
import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body className={`${inter.className} min-h-screen bg-slate-950 text-slate-50 selection:bg-purple-500/30 flex flex-col pt-16`}>
        {/* Script publicitaire principal du réseau CPM (Monétisation pop-under / interstitiels) */}
        <Script 
          src="https://pl29583544.effectivecpmnetwork.com/19/ae/64/19ae6409d1812af8bbb2f146d89d9db8.js" 
          strategy="afterInteractive" 
        />
        <AdManager />
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

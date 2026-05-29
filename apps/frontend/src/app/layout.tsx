import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Save.digitalh.net | Téléchargeur Vidéo HD & Audio MP3 Gratuit",
  description: "Téléchargez des vidéos TikTok sans filigrane, YouTube et Instagram en MP4 HD ou MP3. Ultra rapide, sans limite, 100% gratuit.",
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

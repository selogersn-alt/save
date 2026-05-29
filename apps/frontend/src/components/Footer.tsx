import Link from "next/link";
import { Download, Video, Music, Info, Shield, FileText, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-slate-900 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="bg-purple-600 p-2 rounded-xl">
                <Download className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                Save.digitalh
              </span>
            </Link>
            <p className="text-slate-400 text-sm">
              L'outil ultime pour télécharger vos vidéos préférées depuis TikTok, YouTube, Instagram et Facebook. Gratuit, rapide, et sans filigrane.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Outils Gratuits</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/tiktok-downloader" className="hover:text-purple-400 transition-colors flex items-center gap-2">
                  <Video className="w-4 h-4" /> TikTok Downloader
                </Link>
              </li>
              <li>
                <Link href="/youtube-downloader" className="hover:text-purple-400 transition-colors flex items-center gap-2">
                  <Video className="w-4 h-4" /> YouTube to MP4/MP3
                </Link>
              </li>
              <li>
                <Link href="/instagram-downloader" className="hover:text-purple-400 transition-colors flex items-center gap-2">
                  <Video className="w-4 h-4" /> Instagram Downloader
                </Link>
              </li>
              <li>
                <Link href="/facebook-downloader" className="hover:text-purple-400 transition-colors flex items-center gap-2">
                  <Facebook className="w-4 h-4" /> Facebook Downloader
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Informations</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/blog" className="hover:text-purple-400 transition-colors flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Guides & Ressources
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-purple-400 transition-colors flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-purple-400 transition-colors flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-purple-400 transition-colors flex items-center gap-2">
                  <Info className="w-4 h-4" /> À propos
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Avertissement</h3>
            <p className="text-slate-500 text-xs">
              Save.digitalh.net n'est pas affilié à TikTok, YouTube, Instagram, Facebook, ou toute autre entreprise. Nous n'hébergeons aucun fichier sur nos serveurs. L'utilisateur est seul responsable des contenus téléchargés.
            </p>
          </div>

        </div>
        
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p>© {new Date().getFullYear()} Save.digitalh.net. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}

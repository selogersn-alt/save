"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Download, Video, Youtube, Instagram, Facebook, Settings } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    {
      href: "/tiktok-downloader",
      label: "TikTok",
      icon: Video,
      color: "text-pink-400 hover:text-pink-300",
      activeBg: "bg-pink-500/10 text-pink-400 border-pink-500/30"
    },
    {
      href: "/youtube-downloader",
      label: "YouTube",
      icon: Youtube,
      color: "text-red-500 hover:text-red-400",
      activeBg: "bg-red-500/10 text-red-500 border-red-500/30"
    },
    {
      href: "/instagram-downloader",
      label: "Instagram",
      icon: Instagram,
      color: "text-fuchsia-400 hover:text-fuchsia-300",
      activeBg: "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/30"
    },
    {
      href: "/facebook-downloader",
      label: "Facebook",
      icon: Facebook,
      color: "text-blue-500 hover:text-blue-400",
      activeBg: "bg-blue-500/10 text-blue-500 border-blue-500/30"
    }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-xl shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
            <Download className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
            Save.digitalh
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-transparent transition-all ${
                  isActive
                    ? link.activeBg
                    : `text-slate-300 hover:bg-slate-900 ${link.color}`
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
          >
            <Settings className="w-3.5 h-3.5" />
            Admin
          </Link>
        </div>
      </div>
    </header>
  );
}

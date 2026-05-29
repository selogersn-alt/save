"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";

export default function SetupAdmin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Erreur de configuration.");
      }

      // Stocker le token dans un cookie
      document.cookie = `admin_token=${data.token}; path=/; max-age=86400; SameSite=Strict`;
      
      router.push("/admin");
      
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-purple-600/20 blur-[100px] rounded-full"></div>
      
      <div className="glass-card p-10 rounded-3xl w-full max-w-md z-10 animate-fade-in text-center">
        <ShieldCheck className="w-16 h-16 text-purple-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-white mb-2">Bienvenue Administrateur</h1>
        <p className="text-slate-400 mb-8">Veuillez créer votre mot de passe maître pour sécuriser l'accès.</p>
        
        <form onSubmit={handleSetup} className="space-y-6">
          <div>
            <input 
              type="password" 
              required
              minLength={6}
              placeholder="Nouveau mot de passe" 
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          {error && <div className="text-red-400 text-sm">{error}</div>}
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 rounded-xl transition-all"
          >
            {loading ? "Création..." : "Verrouiller le Panel"}
          </button>
        </form>
      </div>
    </div>
  );
}

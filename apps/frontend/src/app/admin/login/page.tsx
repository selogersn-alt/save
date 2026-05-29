"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function LoginAdmin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        if (res.status === 404) {
          router.push("/admin/setup");
          return;
        }
        throw new Error(data.error || "Identifiants invalides.");
      }

      // Stocker le token dans un cookie
      document.cookie = `admin_token=${data.token}; path=/; max-age=86400; SameSite=Strict`;
      
      // Force reload to apply middleware
      window.location.href = "/admin";
      
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-blue-600/10 blur-[100px] rounded-full"></div>
      
      <div className="glass-card p-10 rounded-3xl w-full max-w-md z-10 animate-fade-in text-center border-t border-slate-700/50">
        <Lock className="w-16 h-16 text-slate-400 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-white mb-2">Accès Restreint</h1>
        <p className="text-slate-400 mb-8">Veuillez entrer le mot de passe administrateur.</p>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input 
              type="password" 
              required
              placeholder="Mot de passe" 
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          {error && <div className="text-red-400 text-sm">{error}</div>}
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-xl transition-all"
          >
            {loading ? "Vérification..." : "Déverrouiller"}
          </button>
        </form>
      </div>
    </div>
  );
}

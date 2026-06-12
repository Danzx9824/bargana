"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const { signIn, signUp, signInWithOAuth, loading } = useAuth();
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      await signUp(email, password, username);
    } else {
      await signIn(email, password);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-surface border border-border rounded-xl p-8">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold rounded-lg flex items-center justify-center text-background font-bold text-2xl">B</div>
            <span className="text-3xl font-bold">Bargana</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          {isSignUp && (
            <div>
              <label className="block text-sm text-muted mb-1.5">Nome de Usuário</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full bg-background border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:border-gold transition-colors" placeholder="gamer123" />
            </div>
          )}
          <div>
            <label className="block text-sm text-muted mb-1.5">E-mail</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-background border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:border-gold transition-colors" placeholder="seu@email.com" />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1.5">Senha</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="w-full bg-background border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:border-gold transition-colors" placeholder="••••••••" />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-gold hover:bg-gold-dark text-background font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin" size={18} /> : (isSignUp ? "Criar Conta" : "Entrar")}
          </button>
        </form>

        <button onClick={() => setIsSignUp(!isSignUp)} className="w-full text-center text-sm text-gold hover:underline mb-6">
          {isSignUp ? "Já tem conta? Faça login" : "Não tem conta? Cadastre-se"}
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
          <div className="relative flex justify-center text-xs"><span className="bg-surface px-2 text-muted">ou continue com</span></div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => signInWithOAuth("google")} className="flex items-center justify-center gap-2 bg-background border border-border rounded-lg py-2.5 hover:bg-surface hover:border-muted transition-colors">
            Google
          </button>
          <button onClick={() => signInWithOAuth("discord")} className="flex items-center justify-center gap-2 bg-[#5865F2]/10 border border-[#5865F2]/30 text-[#5865F2] rounded-lg py-2.5 hover:bg-[#5865F2]/20 transition-colors">
            Discord
          </button>
        </div>
      </div>
    </div>
  );
}
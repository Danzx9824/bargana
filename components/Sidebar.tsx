"use client";

import { X, Home, Tag, Heart, User, Settings, LogOut } from "lucide-react";
import Link from "next/link";

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose}></div>}
      
      <aside className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-surface border-r border-border z-40 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-4 flex justify-end md:hidden">
          <button onClick={onClose}><X size={20} /></button>
        </div>
        
        <nav className="flex flex-col gap-1 p-4">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white bg-gold/10 text-gold border border-gold/20">
            <Home size={18} /> Início
          </Link>
          <Link href="/deal" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted hover:text-white hover:bg-background transition-colors">
            <Tag size={18} /> Ofertas
          </Link>
          <Link href="/wishlist" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted hover:text-white hover:bg-background transition-colors">
            <Heart size={18} /> Lista de Desejos
          </Link>
          <Link href="/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted hover:text-white hover:bg-background transition-colors">
            <User size={18} /> Meu Perfil
          </Link>
          
          <div className="mt-6 pt-6 border-t border-border">
            <p className="px-3 text-xs text-muted mb-2 uppercase tracking-wider">Preparação Futura</p>
            <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted hover:text-white hover:bg-background transition-colors w-full">
              <Settings size={18} /> Dashboard
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
}
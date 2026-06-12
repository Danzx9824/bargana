"use client";

import { useState } from "react";
import { Search, Bell, Heart, User, Menu, X } from "lucide-react";

export default function Header({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-surface border-b border-border z-50 flex items-center px-4 md:px-6">
      <button onClick={onToggleSidebar} className="md:hidden mr-4 text-white hover:text-gold transition-colors">
        <Menu size={24} />
      </button>
      
      <div className="flex items-center gap-2 mr-6">
        <div className="w-8 h-8 bg-gold rounded-md flex items-center justify-center text-background font-bold text-lg">B</div>
        <span className="text-xl font-bold hidden sm:block">Bargana</span>
      </div>

      <div className="flex-1 max-w-xl relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
        <input 
          type="text" 
          placeholder="Pesquisar jogos, hardwares, periféricos..." 
          className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-gold transition-colors"
        />
      </div>

      <div className="flex items-center gap-4 ml-6">
        <button className="relative text-muted hover:text-gold transition-colors">
          <Heart size={20} />
        </button>
        <button className="relative text-muted hover:text-gold transition-colors">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-gold rounded-full"></span>
        </button>
        <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold flex items-center justify-center text-gold cursor-pointer hover:bg-gold hover:text-background transition-all">
          <User size={16} />
        </div>
      </div>
    </header>
  );
}
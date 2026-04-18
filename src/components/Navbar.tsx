'use client';

import React from 'react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-[999] px-10 py-4 flex items-center justify-between bg-navbar border-b border-white/5 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <div className="w-2.5 h-2.5 bg-accent rounded-full animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
        <span className="text-lg font-black text-white uppercase tracking-tighter">NodeControl</span>
      </div>
      <div className="flex items-center gap-8">
        {['Logic', 'Sync', 'Terminal'].map(item => (
          <a key={item} href="#" className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-accent transition-all">{item}</a>
        ))}
        <button className="px-5 py-1.5 bg-accent text-black rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white transition-colors">Access</button>
      </div>
    </nav>
  );
}

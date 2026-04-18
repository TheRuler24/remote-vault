'use client';

import React from 'react';

export function DataBarItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-center gap-6 group hover:translate-y-[-2px] transition-all">
      <div className="p-3 bg-white/5 rounded-lg text-emerald group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div>
        <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] block mb-1">{label}</span>
        <span className="text-2xl font-black text-white tracking-tighter font-serif">{value}</span>
      </div>
    </div>
  );
}

export function TimelineItem({ num, title, desc }: { num: string, title: string, desc: string }) {
  return (
    <div className="flex gap-16 group">
      <span className="text-6xl font-black text-white/5 italic font-serif transition-colors group-hover:text-emerald/20">{num}</span>
      <div className="border-l border-white/5 pl-16 group-hover:border-emerald/30 transition-colors duration-1000">
        <h4 className="text-3xl font-black text-white mb-6 uppercase tracking-widest font-outfit">{title}</h4>
        <p className="text-text-muted text-xl font-light italic leading-relaxed max-w-xl">{desc}</p>
      </div>
    </div>
  );
}

export function FooterLinkCol({ title, links }: { title: string, links: string[] }) {
  return (
    <div>
      <span className="text-technical text-white/30 mb-8 block">{title}</span>
      <div className="flex flex-col gap-4">
        {links.map(link => (
          <a key={link} href="#" className="text-sm font-medium text-white/20 hover:text-emerald transition-colors">{link}</a>
        ))}
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FooterLinkCol } from './UIElements';

export default function Footer() {
  return (
    <footer className="py-40 border-t border-white/5 text-center relative overflow-hidden">
      <div className="container-7xl relative z-10">
        <motion.h2
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="text-[10vw] font-black text-white mb-20 tracking-tighter"
        >
          Commence <span className="text-white/5 italic">Sync.</span>
        </motion.h2>
        <button className="btn-monolith mb-32 px-20">Secure Terminal Access</button>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-20 py-20 text-left border-t border-white/5 pt-20">
          <div>
            <span className="text-technical text-emerald mb-8 block">Architecture</span>
            <p className="text-text-muted text-sm font-light italic">Building the infrastructure of the next digital age through architectural excellence.</p>
          </div>
          <FooterLinkCol title="Systems" links={['Experience', 'Innovation', 'Protocols']} />
          <FooterLinkCol title="Network" links={['Nodes', 'Security', 'Telemetry']} />
          <div className="text-right flex flex-col items-end">
            <span className="text-technical text-white/20 mb-8 block">Lead Architect</span>
            <span className="signature text-4xl lowercase opacity-60">aadi</span>
          </div>
        </div>

        <div className="mt-20 text-[8px] text-white/5 font-black uppercase tracking-[1em]">
          © 2026 NodeControl // All Rights Reserved
        </div>
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20rem] font-black text-white/[0.02] select-none pointer-events-none">
        SYNC
      </div>
    </footer>
  );
}

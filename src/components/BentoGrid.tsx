'use client';

import React from 'react';
import { Layers, Cpu, Globe, Terminal, Target } from 'lucide-react';

export default function BentoGrid() {
  return (
    <section className="py-80 relative overflow-hidden bg-black">
      <div className="container-7xl">
        <div className="mb-48 max-w-2xl px-4">
          <span className="text-technical text-accent mb-10 block opacity-50 text-xs">Modular Infrastructure</span>
          <h2 className="text-6xl font-black text-white leading-tight uppercase tracking-tighter">Architected<br />for Scale.</h2>
        </div>

        <div className="grid-12">
          <div className="span-8 glass-panel bento-card border-emerald/10 group overflow-hidden">
            <div className="absolute top-0 right-0 p-12 text-emerald/5 group-hover:text-emerald/20 transition-all duration-1000">
              <Layers size={180} />
            </div>
            <div>
              <span className="text-technical text-emerald mb-6 block">01 / Foundation</span>
              <h3 className="text-5xl text-white mb-8">Quantum Isolation Layer</h3>
              <p className="text-text-muted text-xl max-w-sm font-light italic leading-relaxed">
                Every process is isolated in a secure quantum-level vault, ensuring zero-day reliability across the entire mesh.
              </p>
            </div>
            <div className="flex items-center gap-6 mt-12">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex-center text-emerald">
                <Cpu size={20} />
              </div>
              <span className="text-technical text-white/20 tracking-widest">Hardware Verified</span>
            </div>
          </div>

          <div className="span-4 glass-panel bento-card">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex-center text-emerald mb-10">
              <Globe size={28} />
            </div>
            <div>
              <h3 className="text-4xl text-white mb-6">Global Equilibrium.</h3>
              <p className="text-text-muted text-lg font-light italic">Automatic load balancing across 48 global regions with no single point of failure.</p>
            </div>
          </div>

          <div className="span-4 glass-panel bento-card">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex-center text-emerald mb-10">
              <Terminal size={28} />
            </div>
            <div>
              <h3 className="text-4xl text-white mb-6">Node Console.</h3>
              <p className="text-text-muted text-lg font-light italic">Real-time telemetry and management tools for extreme control.</p>
            </div>
          </div>

          <div className="span-8 glass-panel bento-card bg-surface">
            <div className="flex-between">
              <div className="max-w-md">
                <span className="text-technical text-emerald mb-6 block">04 / Performance</span>
                <h3 className="text-5xl text-white mb-8">Hyper-Tunneling Protocol</h3>
                <p className="text-text-muted text-xl font-light italic leading-relaxed">Our proprietary routing engine achieves sub-millisecond sync across any node distance.</p>
              </div>
              <div className="w-40 h-40 border border-emerald/20 rounded-full flex-center animate-pulse-soft">
                <Target className="text-emerald" size={40} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

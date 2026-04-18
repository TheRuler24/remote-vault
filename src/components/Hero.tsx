'use client';

import React from 'react';
import { motion, MotionValue } from 'framer-motion';
import { Command } from 'lucide-react';

interface HeroProps {
  y: MotionValue<number>;
  opacity: MotionValue<number>;
  scale: MotionValue<number>;
}

export default function Hero({ y, opacity, scale }: HeroProps) {
  return (
    <section className="relative h-screen flex flex-col items-center pt-[35vh] px-8 overflow-hidden text-center z-10">
      <motion.div
        style={{ y, opacity, scale }}
        className="max-w-4xl mx-auto flex flex-col items-center relative z-20"
      >
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-4 mb-12"
        >
          <div className="w-8 h-8 border-2 border-accent rounded-xl flex items-center justify-center text-accent shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <div className="w-1.5 h-1.5 bg-accent rounded-full animate-ping" />
          </div>
          <span className="text-xl font-black text-white uppercase tracking-tighter">NodeControl</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl md:text-7xl font-black leading-[1.1] mb-16 text-white tracking-tight"
        >
          Digital <span className="text-white/5 italic">Excellence</span> <br />
          through <span className="italic font-serif text-accent opacity-40 lowercase">Control.</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-8"
        >
          <button className="btn-monolith shadow-[0_30px_60px_rgba(16,185,129,0.3)]">
            <Command size={20} />
            Launch Sequence
          </button>
          <button className="btn-pill-outline bg-white/5">View use cases</button>
        </motion.div>
      </motion.div>

      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-emerald/5 rounded-full blur-[120px] animate-pulse" />
      </div>
    </section>
  );
}

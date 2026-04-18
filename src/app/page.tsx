'use client';

import React, { useState, useEffect } from 'react';
import { useScroll, useTransform } from 'framer-motion';

// Component Imports
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import DataBar from '@/components/DataBar';
import BentoGrid from '@/components/BentoGrid';
import Timeline from '@/components/Timeline';
import Footer from '@/components/Footer';

export default function Home() {
  const [isReady, setIsReady] = useState(false);
  const { scrollY } = useScroll();

  // Parallax Controllers (Managed at page level for shared context if needed)
  const yHero = useTransform(scrollY, [0, 1000], [0, 400]);
  const opacityHero = useTransform(scrollY, [0, 500], [1, 0]);
  const scaleHero = useTransform(scrollY, [0, 500], [1, 0.95]);

  useEffect(() => {
    setIsReady(true);
  }, []);

  if (!isReady) return <div className="bg-black min-h-screen" />;

  return (
    <main className="relative flex flex-col">
      {/* Background Static Layers */}
      <div className="star-background" />
      <div className="noise-overlay" />
      <div className="glow-spot top-[-20vw] left-[-10vw]" />

      {/* Modular Sectional Architecture */}
      <Navbar />
      
      <Hero 
        y={yHero} 
        opacity={opacityHero} 
        scale={scaleHero} 
      />

      <BentoGrid />
      
      <Timeline />
      
      <Footer />
    </main>
  );
}

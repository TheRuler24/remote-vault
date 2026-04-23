"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RemoteVaultIcon } from "@/components/RemoteVaultIcon";

export default function Loading() {
  const [loadingText, setLoadingText] = useState("INITIALIZING SECURE TUNNEL");
  
  useEffect(() => {
    const texts = [
      "ESTABLISHING HANDSHAKE...",
      "VERIFYING END-TO-END ENCRYPTION...",
      "SYNCING HARDWARE REGISTRY...",
      "ACCESSING REMOTE VAULT..."
    ];
    let i = 0;
    const interval = setInterval(() => {
      setLoadingText(texts[i]);
      i = (i + 1) % texts.length;
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-[#05070a] flex flex-col items-center justify-center overflow-hidden">
      {/* Background Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #3b82f6 1px, transparent 1px),
            linear-gradient(to bottom, #3b82f6 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Radial Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.1)_0%,rgba(5,7,10,1)_70%)] pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center">
        <RemoteVaultIcon size={120} animated={true} />
        
        <div className="mt-12 flex flex-col items-center space-y-4">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-blue-500"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
          
          <AnimatePresence mode="wait">
            <motion.p
              key={loadingText}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
              className="text-xs font-bold text-blue-400 uppercase tracking-[0.3em] font-mono"
            >
              {loadingText}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

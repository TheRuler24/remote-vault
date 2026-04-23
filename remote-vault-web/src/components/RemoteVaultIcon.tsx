"use client";

import React from "react";
import { motion } from "framer-motion";

interface RemoteVaultIconProps {
  className?: string;
  size?: number;
  animated?: boolean;
}

export function RemoteVaultIcon({ className = "", size = 40, animated = false }: RemoteVaultIconProps) {
  const containerVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const shieldVariants = {
    initial: { pathLength: 0, opacity: 0 },
    animate: { 
      pathLength: 1, 
      opacity: 1,
      transition: { duration: 1.5, ease: "easeInOut", repeat: animated ? Infinity : 0, repeatType: "reverse" as const }
    }
  };

  const coreVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: [0.5, 1, 0.5],
      transition: { duration: 2, ease: "easeInOut", repeat: animated ? Infinity : 0 }
    }
  };

  return (
    <motion.div 
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      variants={containerVariants}
      initial={animated ? "initial" : false}
      animate={animated ? "animate" : false}
    >
      <div className="absolute inset-0 bg-blue-600/20 blur-xl rounded-full" />
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 drop-shadow-[0_0_15px_rgba(37,99,235,0.5)]"
      >
        {/* Outer Shield Hexagon */}
        <motion.path
          d="M50 5L90 25V60L50 95L10 60V25L50 5Z"
          stroke="url(#blue-gradient)"
          strokeWidth="4"
          strokeLinejoin="round"
          variants={animated ? shieldVariants : undefined}
          initial={animated ? "initial" : undefined}
          animate={animated ? "animate" : undefined}
        />
        
        {/* Inner Tech Core (V shape) */}
        <motion.path
          d="M30 35L50 65L70 35"
          stroke="#FFFFFF"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={animated ? coreVariants : undefined}
          initial={animated ? "initial" : undefined}
          animate={animated ? "animate" : undefined}
        />
        
        <motion.circle 
          cx="50" 
          cy="65" 
          r="4" 
          fill="#3B82F6" 
          variants={animated ? coreVariants : undefined}
          initial={animated ? "initial" : undefined}
          animate={animated ? "animate" : undefined}
        />

        <defs>
          <linearGradient id="blue-gradient" x1="50" y1="5" x2="50" y2="95" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A5FA" />
            <stop offset="0.5" stopColor="#3B82F6" />
            <stop offset="1" stopColor="#1E3A8A" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
}

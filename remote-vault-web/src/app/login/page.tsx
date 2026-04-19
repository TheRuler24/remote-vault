"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Shield, ArrowRight, ShieldAlert } from "lucide-react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleSignIn = async (provider: string) => {
    setIsLoading(provider);
    await signIn(provider, { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-[#05070a] flex items-center justify-center relative overflow-hidden text-gray-200">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/bg-vault-premium.png" 
          alt="Vault" 
          fill 
          style={{ objectFit: "cover", opacity: 0.25 }} 
          priority 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] via-transparent to-[#05070a]" />
      </div>

      {/* Floating Accent Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] z-0" />

      {/* Login Card */}
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-md p-10 md:p-12 rounded-[2rem] bg-white/[0.02] border border-white/5 backdrop-blur-2xl shadow-2xl relative z-10 mx-6 overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
        
        {/* Header */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 mb-6 border border-blue-400/20">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white text-center uppercase tracking-tighter mb-2">
            Establish Link
          </h1>
          <p className="text-gray-400 text-center font-mono text-xs uppercase tracking-widest">
            Identity verification required
          </p>
        </div>

        {/* OAuth Buttons */}
        <div className="space-y-4">
          <button
            onClick={() => handleSignIn("google")}
            disabled={isLoading !== null}
            className="w-full relative flex items-center justify-center gap-4 py-4 px-6 rounded-xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all group overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading === "google" ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {/* Google SVG */}
                <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span className="font-bold text-sm tracking-wide">Continue with Google</span>
                <ArrowRight className="absolute right-6 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-gray-400" size={18} />
              </>
            )}
          </button>

          <button
            onClick={() => handleSignIn("github")}
            disabled={isLoading !== null}
            className="w-full relative flex items-center justify-center gap-4 py-4 px-6 rounded-xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all group overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading === "github" ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {/* GitHub SVG */}
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0 text-white">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <span className="font-bold text-sm tracking-wide">Continue with GitHub</span>
                <ArrowRight className="absolute right-6 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-gray-400" size={18} />
              </>
            )}
          </button>
        </div>

        {/* Security Notice */}
        <div className="mt-10 p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 flex items-start gap-4">
          <ShieldAlert className="text-blue-500 shrink-0 mt-0.5" size={18} />
          <div>
            <span className="block font-bold text-blue-400 text-sm mb-1 uppercase tracking-wider">Zero Knowledge Policy</span>
            <p className="text-gray-500 text-xs leading-relaxed">
              RemoteVault does not store passwords. Authentication is managed solely through your selected provider. 
              Your encryption keys are derived locally post-authentication.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

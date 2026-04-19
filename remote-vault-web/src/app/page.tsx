"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, Smartphone, Laptop, Globe, Lock, ArrowRight, Download, Server, Terminal, Menu, X, Check, Zap, Cpu, Activity, HardDrive, Share2, Layers, Key, ShieldAlert
} from "lucide-react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Home() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoading, setIsLoading] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    
    // Automatically reveal the login card after 10 seconds
    const timer = setTimeout(() => {
      setShowLoginModal(true);
    }, 10000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const handleSignIn = async (provider: string) => {
    setIsLoading(provider);
    await signIn(provider, { callbackUrl: "/" });
  };

  const heroStyle: React.CSSProperties = {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    backgroundColor: "#05070a",
    overflow: "hidden",
    textAlign: "center"
  };

  const navStyle: React.CSSProperties = {
     position: "fixed",
     top: 0,
     left: 0,
     right: 0,
     zIndex: 100,
     padding: isScrolled ? "1rem 1.5rem" : "2rem 1.5rem",
     transition: "all 0.3s ease",
     backgroundColor: isScrolled ? "rgba(5, 7, 10, 0.9)" : "transparent",
     borderBottom: isScrolled ? "1px solid rgba(255, 255, 255, 0.1)" : "none",
     backdropFilter: isScrolled ? "blur(20px)" : "none"
  };

  return (
    <div style={{ backgroundColor: "#05070a", color: "#e5e7eb" }} className="min-h-screen selection:bg-blue-500/30">
      {/* 1. Navbar */}
      <nav style={navStyle}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black text-white tracking-tighter uppercase">RemoteVault</span>
          </div>
          
          <div className="flex items-center gap-6">
            <button onClick={() => session ? window.location.href = "/dashboard" : setShowLoginModal(true)} className="hidden sm:block px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl transition-all shadow-xl hover:bg-blue-500 active:scale-95">
              {session ? "Enter Dashboard" : "Launch Portal"}
            </button>
            <button className="text-white p-2 hover:bg-white/5 flex items-center justify-center rounded-xl transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Sliding Sidebar */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="relative w-full max-w-[320px] h-full bg-[#05070a]/80 backdrop-blur-xl border-l border-white/10 shadow-2xl flex flex-col p-6 z-10"
            >
              <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-lg font-black text-white tracking-tighter uppercase">RemoteVault</span>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                >
                   <X size={20} />
                </button>
              </div>

              <div className="flex flex-col gap-2 flex-1">
                {[
                  { name: "Home Base", href: "/", icon: Globe },
                  { name: "Add Device", href: "/dashboard/add-device", icon: Server },
                  { name: "Download Agent", href: "/downloads", icon: Download },
                  { name: "Protocol Architecture", href: "#protocol", icon: Layers },
                  { name: "Docs & Security", href: "#security", icon: ShieldAlert },
                ].filter(item => !(pathname === "/" && item.name === "Home Base")).map((item, id) => {
                  const Icon = item.icon;
                  return (
                    <a 
                      key={id} 
                      href={item.href} 
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition-all uppercase tracking-widest group"
                    >
                      <Icon className="w-5 h-5 text-gray-500 group-hover:text-blue-400 transition-colors" />
                      {item.name}
                    </a>
                  );
                })}
              </div>

              <div className="mt-8 pt-6 border-t border-white/5">
                <button onClick={() => { session ? window.location.href = "/dashboard" : setShowLoginModal(true); setMobileMenuOpen(false); }} className="w-full py-3.5 bg-white/5 border border-white/10 text-white font-bold text-sm rounded-xl hover:bg-blue-600 hover:border-blue-500 transition-all uppercase tracking-widest flex items-center justify-center gap-3 group">
                  <Terminal className="w-4 h-4 group-hover:text-white text-gray-400 transition-colors" />
                  {session ? "Web Terminal" : "Establish Link"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Hero Section */}
      <section style={heroStyle} className="px-6">
        <div className="absolute inset-0 z-0">
          <Image src="/bg-vault-premium.png" alt="Vault" fill style={{ objectFit: "cover", opacity: 0.35 }} priority />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#05070a]/60 to-[#05070a]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto flex flex-col items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }} className="flex flex-col items-center">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono uppercase tracking-[0.3em] mb-12">
              <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,1)]" />
              Protocol v1.0.4 Online
            </div>
            
            <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[0.95] mb-10 text-center drop-shadow-2xl uppercase">
              Global <span className="text-blue-500">Access.</span><br />
              Local <span className="text-white">Privacy.</span>
            </h1>

            <p className="text-gray-400 text-xl md:text-2xl max-w-3xl mx-auto font-light leading-relaxed mb-16 px-4">
              A military-grade encrypted bridge from your web browser directly to your home hardware.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full">
              <button onClick={() => session ? window.location.href = "/dashboard" : setShowLoginModal(true)} className="w-full sm:w-auto px-12 py-5 bg-blue-600 text-white font-black text-xl rounded-2xl hover:bg-blue-500 transition-all transform hover:-translate-y-1 shadow-2xl active:scale-95 flex items-center justify-center gap-3 tracking-tighter">
                {session ? "Enter Terminal" : "Launch Terminal"} <ArrowRight strokeWidth={3} />
              </button>
              <button className="w-full sm:w-auto px-12 py-5 bg-white/5 border border-white/10 text-white font-bold text-xl rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-3 backdrop-blur-xl group tracking-tighter">
                <Download className="group-hover:translate-y-1 transition-transform" /> Get Agent
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. Features Section */}
      <section id="features" className="relative py-64 max-w-7xl mx-auto px-6">
        <div className="text-center mb-32 space-y-6">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter">Encrypted Infrastructure.</h2>
          <p className="text-gray-500 text-2xl font-light italic">Own your nodes. Secure your legacy.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { Icon: Zap, t: "Instant P2P", d: "High-speed tunneling with dedicated relay optimization. Experience negligible latency across continents." },
            { Icon: Lock, t: "E2E AES-256", d: "Military grade data segmentation. Your encryption keys never leave your local device environment." },
            { Icon: Smartphone, t: "Mobile Bridge", d: "Access mobile storage via USB-Passthrough proxy. Manage phone files from any desktop." },
            { Icon: Cpu, t: "Go System Agent", d: "Minimalist memory footprint for persistent nodes. Runs silently in the background of any OS." },
            { Icon: Terminal, t: "Pro Console", d: "Full system audit logs and management terminal for granular control over every shared byte." },
            { Icon: Globe, t: "Global Network", d: "Distributed entry points for worldwide access. Bypass geo-locking and firewall restrictions." },
          ].map((f, i) => (
            <div key={i} className="p-10 rounded-[2rem] bg-white/[0.03] border border-white/5 hover:border-blue-500/50 hover:bg-white/[0.05] transition-all group overflow-hidden relative">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-14 h-14 rounded-2xl bg-blue-600/10 flex items-center justify-center mb-8 text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <f.Icon size={30} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-tighter">{f.t}</h3>
              <p className="text-gray-500 leading-relaxed text-lg">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Protocol Hub */}
      <section id="protocol" className="py-64 bg-gradient-to-b from-[#05070a] via-[#080a0f] to-[#05070a] border-y border-white/5 overflow-hidden relative">
        <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-blue-500/20 via-transparent to-blue-500/20" />
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
            <div className="space-y-12 text-center lg:text-left">
               <h2 className="text-5xl md:text-7xl font-black text-white leading-[0.95] tracking-tighter italic uppercase underline decoration-blue-500 decoration-8 underline-offset-8">Zero Knowledge.</h2>
               <p className="text-gray-400 text-xl font-light">By the time your data hits our relay, it's already a cryptographically sealed black box. We act as the router, never the repository.</p>
               <div className="space-y-10">
                  {[
                    { q: "01", t: "Authorize", d: "Handshake via OAuth 2.0 standards with ephemeral token generation." },
                    { q: "02", t: "Bind", d: "Agent creates a persistent, reverse-tunneled stream to your browser." },
                    { q: "03", t: "Stream", d: "Encrypted segments bypass Relay storage entirely for raw speed." },
                  ].map((s, i) => (
                    <div key={i} className="flex flex-col lg:flex-row items-center lg:items-start gap-6 group">
                       <span className="text-4xl font-black text-blue-900 group-hover:text-blue-500 transition-colors italic font-mono">{s.q}</span>
                       <div>
                          <h4 className="font-bold text-2xl text-white mb-2 uppercase">{s.t}</h4>
                          <p className="text-gray-500 text-lg">{s.d}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
            <div className="relative aspect-square md:aspect-video rounded-[3rem] border border-white/10 bg-black/40 flex items-center justify-center p-10 overflow-hidden group shadow-2xl">
                <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity blur-3xl" />
                <div className="flex items-center gap-10 relative z-10">
                   <div className="flex flex-col items-center gap-4">
                      <Laptop size={64} className="text-gray-500 group-hover:text-white transition-colors" />
                      <span className="text-[10px] font-mono text-gray-700 uppercase">Local Node</span>
                   </div>
                   <div className="w-16 md:w-40 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
                   <div className="p-8 rounded-[2.5rem] bg-blue-600/10 border border-blue-500/20 relative shadow-2xl">
                      <Server size={64} className="text-blue-500 animate-pulse" />
                      <div className="absolute -inset-4 bg-blue-500/20 blur-2xl rounded-full" />
                   </div>
                   <div className="w-16 md:w-40 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
                   <div className="flex flex-col items-center gap-4">
                      <Globe size={64} className="text-gray-500 group-hover:text-white transition-colors" />
                      <span className="text-[10px] font-mono text-gray-700 uppercase">Remote Hub</span>
                   </div>
                </div>
                <motion.div animate={{ x: [-300, 300], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className="absolute h-[2px] w-24 bg-gradient-to-r from-transparent via-blue-400 to-transparent top-1/2 -translate-y-1/2" />
            </div>
        </div>
      </section>

      {/* 5. Infrastructure Mesh Network */}
      <section id="infrastructure" className="py-64 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
             <div className="order-2 lg:order-1 relative aspect-square bg-white/[0.01] rounded-full border border-white/5 flex items-center justify-center p-12">
                <div className="absolute inset-0 bg-blue-500/5 rounded-full blur-3xl" />
                <div className="grid grid-cols-3 gap-8 relative z-10">
                   {[Activity, Globe, Shield, HardDrive, Share2, Layers].map((SI, i) => (
                     <div key={i} className="w-24 h-24 rounded-3xl bg-black border border-white/10 flex items-center justify-center text-gray-600 hover:text-blue-500 hover:border-blue-500/30 transition-all transform hover:scale-110 shadow-xl">
                        <SI size={40} />
                     </div>
                   ))}
                </div>
             </div>
             <div className="order-1 lg:order-2 space-y-12">
                <div className="space-y-6 text-center lg:text-left">
                  <h2 className="text-5xl md:text-8xl font-black text-white leading-none tracking-tighter uppercase">Mesh<br/>Dynamic.</h2>
                  <p className="text-gray-400 text-xl font-light italic">Distributed entry points for the modern nomad.</p>
                </div>
                <div className="space-y-4">
                    {[
                      "99.99% Node Availability via Multi-Link Relay",
                      "Ultra-Low Latency WebSocket (WSS) Infrastructure",
                      "Automatic Firewall Traversal with Reverse-Proxying",
                      "Edge Optimization for 4K Content Streaming"
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-4 p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                        <div className="w-6 h-6 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                          <Check size={14} className="text-blue-500" />
                        </div>
                        <span className="text-gray-300 font-mono text-sm tracking-widest uppercase">{item}</span>
                      </div>
                    ))}
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 6. Security Deep Dive */}
      <section id="security" className="py-64 bg-gradient-to-b from-[#05070a] via-black to-[#05070a] border-y border-white/5 relative uppercase">
        <div className="max-w-5xl mx-auto px-6 text-center">
           <div className="inline-block px-10 py-4 rounded-3xl bg-red-600/10 border border-red-500/30 text-red-500 font-black text-xl mb-12 uppercase tracking-tighter shadow-xl shadow-red-500/10">
             Hardened Standard
           </div>
           <h2 className="text-6xl md:text-9xl font-black text-white tracking-tighter mb-16 uppercase">UNBREAKABLE.</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div className="p-12 rounded-[3.5rem] bg-white/[0.02] border border-white/5 space-y-8">
                 <Key className="text-blue-500" size={50} />
                 <h3 className="text-4xl font-bold text-white uppercase tracking-tighter">Private Keys</h3>
                 <p className="text-gray-500 text-lg leading-relaxed">RemoteVault uses a local-first keychain approach. Your private access keys are derived using PBKDF2 on your home machine. Even if our servers are compromised, your data remains an encrypted ghost.</p>
              </div>
              <div className="p-12 rounded-[3.5rem] bg-white/[0.02] border border-white/5 space-y-8">
                 <Lock className="text-blue-500" size={50} />
                 <h3 className="text-4xl font-bold text-white uppercase tracking-tighter">AES-256-GCM</h3>
                 <p className="text-gray-500 text-lg leading-relaxed">Every binary chunk is wrapped in GCM authenticated encryption. This ensures not only secrecy but also absolute data integrity—preventing any tampering during the relay transit phase.</p>
              </div>
           </div>
        </div>
      </section>

      <footer className="py-32 px-6 border-t border-white/5 bg-[#030508] text-center relative overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-600 via-transparent to-blue-600 opacity-20" />
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
             <div className="flex flex-col items-center md:items-start gap-6">
                <div className="flex items-center gap-3">
                   <Shield size={32} className="text-blue-600" />
                   <span className="text-xl font-black text-white tracking-widest uppercase">RemoteVault</span>
                </div>
                <p className="text-gray-600 text-xs font-mono uppercase tracking-widest leading-relaxed text-center md:text-left">
                  Decentralized device bridging protocol. Digital sovereignty for the modern age.
                </p>
             </div>
             <div className="flex flex-col items-center gap-4">
                <span className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.5em] mb-4">Core Mesh</span>
                <div className="flex flex-wrap justify-center gap-6 text-[10px] font-mono font-bold text-gray-700 tracking-[0.1em] uppercase">
                  <a href="#" className="hover:text-white transition-colors">Documentation</a>
                  <a href="#" className="hover:text-white transition-colors">Security Audit</a>
                  <a href="#" className="hover:text-white transition-colors">Relay Specs</a>
                </div>
             </div>
             <div className="flex flex-col items-center md:items-end gap-6 text-[10px] font-mono font-bold text-gray-700 tracking-widest">
                <span>© 2026 REMOTEVAULT</span>
                <span className="text-blue-900">ENCRYPTION: AES-256-GCM ACTIVE</span>
             </div>
          </div>
          <p className="text-[10px] font-mono text-gray-900 tracking-[1em] uppercase border-t border-white/[0.02] pt-12">
            V1.0.4.5 — NODE CONNECTION STABLE — SECURE_TUNNEL_READY
          </p>
        </div>
      </footer>

      {/* 10-Second Automatic Login Overlay (hidden if already logged in) */}
      <AnimatePresence>
        {showLoginModal && !session && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
          >
            <div className="absolute inset-0 z-0 cursor-default" />
            
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md p-10 md:p-12 rounded-[2rem] bg-white/[0.02] border border-white/5 backdrop-blur-2xl shadow-2xl relative z-10 overflow-hidden"
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
                      <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      <span className="font-bold text-sm text-white tracking-wide">Continue with Google</span>
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
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0 text-white">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      <span className="font-bold text-sm text-white tracking-wide">Continue with GitHub</span>
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

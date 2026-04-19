"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  Cpu, 
  History, 
  Activity, 
  Settings, 
  LogOut, 
  Terminal, 
  Menu,
  X,
  SignalHigh,
  Layers,
  Globe,
  ChevronRight,
  Monitor,
  LayoutDashboard,
  Zap,
  User,
  ExternalLink,
  ShieldAlert
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Hardware Nodes", href: "/dashboard", icon: Cpu },
    { label: "Audit Logs", href: "/dashboard/logs", icon: History },
    { label: "Live Terminal", href: "/dashboard/terminal", icon: Terminal },
    { label: "Security Config", href: "/dashboard/settings", icon: ShieldAlert },
  ];

  return (
    <div className="min-h-screen bg-[#020408] text-slate-200 font-sans flex flex-col selection:bg-blue-500/30">
      
      {/* 1. REFINED PROFESSIONAL NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-[100] h-16 md:h-20 bg-[#020408]/80 backdrop-blur-xl border-b border-white/5 flex items-center px-6 md:px-12 transition-all">
        <div className="max-w-[1600px] mx-auto w-full flex items-center justify-between">
          
          <Link href="/" className="flex items-center gap-3 group transition-transform active:scale-95">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20 border border-blue-400/20">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight leading-none">RemoteVault</span>
          </Link>

          <div className="flex items-center gap-4 md:gap-8">
            {/* Status indicators: Subtle & Professional */}
            <div className="hidden sm:flex items-center gap-6 px-5 py-2 bg-white/5 border border-white/10 rounded-full">
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                   <span className="text-[11px] font-semibold text-emerald-500 uppercase tracking-wider">System Online</span>
                </div>
                <div className="w-px h-3 bg-white/10" />
                <div className="flex items-center gap-2">
                   <SignalHigh className="text-blue-500" size={13} />
                   <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Mesh Secure</span>
                </div>
            </div>

            <button 
              onClick={() => setMenuOpen(true)}
              className="flex items-center gap-3 pl-4 pr-3 py-1.5 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:border-white/20 transition-all group active:scale-95 shadow-sm"
            >
               <span className="text-xs font-bold text-white hidden md:block">Menu</span>
               <div className="w-8 h-8 flex items-center justify-center bg-blue-600 rounded-full shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform">
                  <Menu size={16} className="text-white" />
               </div>
            </button>
          </div>
        </div>
      </nav>

      {/* 2. ENTERPRISE DRAWER (OVERLAY) */}
      <AnimatePresence>
        {menuOpen && (
          <div className="fixed inset-0 z-[200] flex justify-end">
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setMenuOpen(false)}
               className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-[380px] h-full bg-[#080b11] border-l border-white/10 shadow-2xl flex flex-col p-8 md:p-10 overflow-y-auto"
            >
               <div className="flex items-center justify-between mb-12">
                  <div className="flex items-center gap-3">
                    <Cpu className="text-blue-500" size={24} />
                    <span className="font-bold text-white uppercase tracking-widest text-sm">Navigation</span>
                  </div>
                  <button 
                    onClick={() => setMenuOpen(false)}
                    className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                  >
                    <X size={24} />
                  </button>
               </div>

               <div className="flex-1 space-y-2">
                  {navItems.map((item, index) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={index}
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        className={`flex items-center justify-between px-6 py-4 rounded-2xl transition-all group ${
                          isActive
                            ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20"
                            : "text-slate-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <item.icon size={20} className={isActive ? "text-white" : "text-slate-500 group-hover:text-blue-500 transition-colors"} />
                          <span className="text-sm font-bold tracking-wide">{item.label}</span>
                        </div>
                        <ChevronRight size={14} className={`opacity-0 group-hover:opacity-100 transition-all ${isActive ? 'opacity-100' : ''}`} />
                      </Link>
                    );
                  })}
               </div>

               <div className="mt-12 pt-10 border-t border-white/5 space-y-8">
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                     <div className="w-12 h-12 rounded-full bg-blue-600/10 flex items-center justify-center border border-blue-500/20">
                        <User className="text-blue-500" size={20} />
                     </div>
                     <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate leading-tight">{session?.user?.name || 'Administrator'}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Global Access Level</p>
                     </div>
                  </div>

                  <div className="space-y-3">
                     <button className="w-full py-3 px-6 bg-white/5 border border-white/10 rounded-xl text-slate-400 text-xs font-bold hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                        <ExternalLink size={14} /> Documentation
                     </button>
                     <button 
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="w-full py-4 px-6 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-lg active:scale-95"
                     >
                        Sign Out & Secure Session
                     </button>
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main className="flex-1 w-full pt-24 md:pt-32 relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 pb-20">
          {/* Professional Background Gradient */}
          <div className="fixed top-0 right-0 w-full h-[500px] bg-gradient-to-b from-blue-600/[0.03] to-transparent pointer-events-none -z-10" />
          
          {children}
      </main>

    </div>
  );
}

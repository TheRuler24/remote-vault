"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSession, signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { ShieldCheck, ArrowRight, Smartphone, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

function AuthContent() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl');
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  if (!returnUrl) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#05070a] p-6 text-white">
        <AlertTriangle size={64} className="text-red-500 mb-6" />
        <h1 className="text-2xl font-black uppercase tracking-tighter mb-2">Invalid Request</h1>
        <p className="text-slate-400 text-center text-sm max-w-md">
          No return URL provided. This page must be opened directly from the RemoteVault Universal Agent.
        </p>
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#05070a] text-blue-500">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  const handleAuthorize = () => {
    setIsAuthorizing(true);
    // Securely generate an auth token in a real app. Here we use the email as a placeholder token.
    const token = Buffer.from(session?.user?.email || "unknown").toString('base64');
    
    setTimeout(() => {
      // Redirect back to the mobile app
      window.location.href = `${returnUrl}?token=${token}`;
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#05070a] p-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.1)_0%,rgba(5,7,10,1)_70%)] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm p-8 rounded-3xl bg-white/[0.02] border border-blue-500/20 backdrop-blur-2xl shadow-2xl relative z-10"
      >
        <div className="flex justify-center mb-8">
           <div className="relative flex items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-blue-600/20 flex items-center justify-center border border-blue-500/30">
                 <Smartphone size={32} className="text-blue-500" />
              </div>
              <div className="absolute -right-4 -bottom-4 w-10 h-10 rounded-full bg-[#05070a] border border-blue-500/20 flex items-center justify-center">
                 <ShieldCheck size={20} className="text-emerald-500" />
              </div>
           </div>
        </div>

        <h1 className="text-2xl font-black text-white text-center uppercase tracking-tighter mb-2">
          Device Link
        </h1>
        
        {session ? (
          <>
            <p className="text-slate-400 text-center text-xs mb-8">
              Authenticate this mobile agent with your operator profile.
            </p>
            
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 mb-8 flex items-center gap-4">
              {session.user?.image ? (
                 <img src={session.user.image} alt="Profile" className="w-10 h-10 rounded-full" />
              ) : (
                 <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center">
                    <span className="text-blue-500 font-bold">{session.user?.name?.charAt(0) || "U"}</span>
                 </div>
              )}
              <div className="flex-1 min-w-0">
                 <p className="text-white text-sm font-bold truncate">{session.user?.name}</p>
                 <p className="text-slate-500 text-xs truncate">{session.user?.email}</p>
              </div>
            </div>

            <button
              onClick={handleAuthorize}
              disabled={isAuthorizing}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-widest text-xs rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isAuthorizing ? 'AUTHORIZING...' : 'AUTHORIZE AGENT'}
              {!isAuthorizing && <ArrowRight size={16} />}
            </button>
          </>
        ) : (
          <>
            <p className="text-slate-400 text-center text-xs mb-8">
              You must be signed into RemoteVault to authorize a new agent.
            </p>
            
            <button
              onClick={() => signIn("google")}
              className="w-full py-4 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white font-bold uppercase tracking-widest text-xs rounded-xl transition-all flex items-center justify-center gap-2"
            >
              SIGN IN TO CONTINUE
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default function AgentAuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#05070a]" />}>
      <AuthContent />
    </Suspense>
  );
}

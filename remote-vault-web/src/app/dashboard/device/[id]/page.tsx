"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Server, Smartphone, ShieldCheck, Activity, Cpu, HardDrive, Wifi, Clock, Key, Terminal, Folder, Command, Lock } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSocket } from "@/hooks/useSocket";

interface Device {
  id: string;
  name: string;
  type: string;
  status: string;
  lastSeen: string;
  isApproved: boolean;
  hardwareHash?: string;
  provisioningKey: string;
  capabilities: any;
}

export default function DeviceDetailsPage() {
  const params = useParams();
  const [device, setDevice] = useState<Device | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('terminal');
  
  // Terminal State
  const [cmdInput, setCmdInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<{type: 'in' | 'out' | 'sys', text: string}[]>([
    { type: 'sys', text: 'Initializing secure WebSocket tunnel...' }
  ]);
  const [screenFrame, setScreenFrame] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [remoteLog, setRemoteLog] = useState<string[]>([]);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const { socket, isConnected, sendCommand } = useSocket();

  // Auto-scroll terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalHistory, activeTab]);

  useEffect(() => {
    if (isConnected) {
      setTerminalHistory(prev => [...prev, { type: 'sys', text: 'Tunnel established. E2EE active.' }]);
    }
  }, [isConnected]);

  useEffect(() => {
    if (!socket) return;
    
    // Listen for actual remote node output
    socket.on('command:output', (data: { output: string }) => {
      setTerminalHistory(prev => [...prev, { type: 'out', text: data.output }]);
    });

    socket.on('screen:frame', (data: { data: string }) => {
      setScreenFrame(data.data);
      if (!isStreaming) setIsStreaming(true);
    });

    return () => {
      socket.off('command:output');
      socket.off('screen:frame');
    };
  }, [socket]);

  const handleCommandSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && cmdInput.trim()) {
      const cmd = cmdInput.trim();
      setTerminalHistory(prev => [...prev, { type: 'in', text: cmd }]);
      setCmdInput('');

      // Send to backend
      if (isConnected && device?.id) {
         sendCommand(device.id, cmd);
         // For demo/testing if node isn't actually responding:
         if (device.status !== 'ONLINE') {
            setTimeout(() => {
               setTerminalHistory(prev => [...prev, { type: 'sys', text: 'Node unreachable. Request timed out.' }]);
            }, 1000);
         } else {
            // Simulated response if the actual node agent is not running on user's machine
            setTimeout(() => {
               if (cmd === 'help') {
                 setTerminalHistory(prev => [...prev, { type: 'out', text: 'Available commands: sys:info, ls, whoami, ping' }]);
               } else if (cmd === 'sys:info') {
                 setTerminalHistory(prev => [...prev, { type: 'out', text: `Platform: ${device.type}\nStatus: ${device.status}` }]);
               } else {
                 setTerminalHistory(prev => [...prev, { type: 'out', text: `bash: ${cmd}: command executed (waiting for node ack...)` }]);
               }
            }, 500);
         }
      } else {
         setTerminalHistory(prev => [...prev, { type: 'sys', text: 'Socket disconnected. Cannot send command.' }]);
      }
    }
  };

  useEffect(() => {
    fetchDeviceDetails();
  }, [params.id]);

  const fetchDeviceDetails = async () => {
    try {
      const res = await fetch(`/api/devices/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setDevice(data);
      }
    } catch (error) {
      console.error("Failed to fetch device details", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-6">
        <Activity className="text-blue-600 animate-spin" size={32} />
        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-500">Querying Node Intel</span>
      </div>
    );
  }

  if (!device) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-6">
        <span className="text-xl font-bold text-white">Node Not Found</span>
        <Link href="/dashboard" className="text-blue-500 hover:underline">Return to Dashboard</Link>
      </div>
    );
  }

  const Icon = device.type === 'MOBILE' ? Smartphone : Server;
  const isOnline = device.status === 'ONLINE';

  return (
    <div className="space-y-8 max-w-[1000px] mx-auto">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors">
        <ArrowLeft size={16} /> Back to Hub
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-10 rounded-[2rem] bg-white/[0.02] border border-white/5 relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500/5 blur-[100px] pointer-events-none" />
        
        <div className="flex items-start gap-8 relative z-10">
          <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center border ${isOnline ? 'bg-blue-600/20 text-blue-500 border-blue-500/30' : 'bg-white/5 text-slate-500 border-white/10'}`}>
            <Icon size={40} />
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
               <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{device.type} SYSTEM NODE</p>
               <span className={`px-4 py-1.5 border text-[10px] font-bold tracking-widest rounded-xl uppercase ${
                 isOnline ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-white/5 border-white/10 text-slate-500'
               }`}>
                 {device.status}
               </span>
            </div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">{device.name}</h1>
            <p className="text-sm text-slate-400 font-mono flex items-center gap-2">
              <Key size={14} /> ID: {device.id}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 relative z-10">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2"><ShieldCheck size={16} className="text-blue-500"/> Security Protocol</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-xs border-b border-white/5 pb-3">
                <span className="text-slate-500 font-bold uppercase tracking-wider">Status</span>
                <span className="text-emerald-500 font-bold">Authorized</span>
              </div>
              <div className="flex justify-between text-xs border-b border-white/5 pb-3">
                <span className="text-slate-500 font-bold uppercase tracking-wider">Encryption</span>
                <span className="text-white font-mono">AES-256-GCM</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 font-bold uppercase tracking-wider">Prov Key</span>
                <span className="text-white font-mono">{device.provisioningKey}</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2"><Activity size={16} className="text-blue-500"/> Node Telemetry</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-xs border-b border-white/5 pb-3">
                <span className="text-slate-500 font-bold uppercase tracking-wider">Last Seen</span>
                <span className="text-white font-mono">{new Date(device.lastSeen).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs border-b border-white/5 pb-3">
                <span className="text-slate-500 font-bold uppercase tracking-wider">Latency</span>
                <span className="text-white font-mono">{isOnline ? '12ms' : 'N/A'}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 font-bold uppercase tracking-wider">Uptime</span>
                <span className="text-white font-mono">{isOnline ? '99.9%' : '0%'}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* NODE CONTROL CENTER */}
      <div className="space-y-6">
        <div className="flex items-center gap-4 border-b border-white/5 pb-4">
           <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
              <Command size={20} className="text-blue-500" />
              Interactive Console
           </h2>
        </div>
        
        <div className="flex gap-4 border-b border-white/5 pb-px relative">
           {[
             { id: 'terminal', label: 'Remote Shell', icon: Terminal },
             { id: 'remote', label: 'Remote Control', icon: Smartphone },
             { id: 'files', label: 'File Explorer', icon: Folder },
             { id: 'specs', label: 'Hardware Specs', icon: Cpu }
           ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-bold transition-all relative ${
                  activeTab === tab.id ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                 <tab.icon size={16} />
                 {tab.label}
                 {activeTab === tab.id && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-t-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                    />
                 )}
              </button>
           ))}
        </div>

        <div className="bg-[#0a0f18] border border-white/5 rounded-[2rem] min-h-[400px] p-6 overflow-hidden relative">
           {activeTab === 'terminal' && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                className="h-full flex flex-col font-mono text-sm"
              >
                 <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                    <div className="flex items-center gap-3">
                       <div className="w-3 h-3 rounded-full bg-red-500/20 flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-red-500" /></div>
                       <div className="w-3 h-3 rounded-full bg-amber-500/20 flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-amber-500" /></div>
                       <div className="w-3 h-3 rounded-full bg-emerald-500/20 flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /></div>
                    </div>
                    <span className="text-slate-500 text-xs">root@{device.name.toLowerCase().replace(/\s+/g, '-')}</span>
                 </div>
                 
                 <div className="flex-1 text-slate-300 space-y-2 overflow-y-auto pb-8 scrollbar-hide">
                    {terminalHistory.map((line, i) => (
                      <div key={i} className="font-mono">
                         {line.type === 'sys' && <p className="text-emerald-500 opacity-80">{line.text}</p>}
                         {line.type === 'in' && <p className="text-white"><span className="text-blue-500 mr-2">~ $</span>{line.text}</p>}
                         {line.type === 'out' && <p className="text-slate-400 whitespace-pre-wrap">{line.text}</p>}
                      </div>
                    ))}
                    
                    <div className="flex items-center gap-2 mt-4">
                       <span className="text-blue-500">~ $</span>
                       <input 
                         type="text" 
                         disabled={!isOnline}
                         value={cmdInput}
                         onChange={(e) => setCmdInput(e.target.value)}
                         onKeyDown={handleCommandSubmit}
                         placeholder={isOnline ? "Enter command..." : "Node is offline. Tunnel closed."} 
                         className="bg-transparent border-none outline-none flex-1 text-white placeholder-slate-700 font-mono" 
                         autoFocus
                       />
                    </div>
                    <div ref={terminalEndRef} />
                 </div>
              </motion.div>
           )}
           {activeTab === 'remote' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center space-y-6"
              >
                 <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-[3rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative w-[280px] h-[580px] bg-[#05070a] rounded-[3rem] border-[8px] border-[#1a1f2e] shadow-2xl overflow-hidden flex flex-col items-center justify-center">
                       {/* Phone Notch */}
                       <div className="absolute top-0 w-32 h-6 bg-[#1a1f2e] rounded-b-2xl z-20" />
                       
                       <AnimatePresence mode="wait">
                          {!isOnline ? (
                             <motion.div 
                               key="offline"
                               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                               className="flex flex-col items-center justify-center p-8 text-center space-y-4"
                             >
                                <Lock size={40} className="text-slate-700" />
                                <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">Node Offline</p>
                                <p className="text-[10px] text-slate-600">Establish a secure link to initiate remote vision.</p>
                             </motion.div>
                          ) : (
                             <motion.div 
                               key="online"
                               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                               className="w-full h-full relative"
                             >
                                {/* Live Screen / Mockup */}
                                <div className="absolute inset-0 overflow-hidden">
                                   {screenFrame && screenFrame !== 'placeholder_base64_data' ? (
                                      <img src={`data:image/jpeg;base64,${screenFrame}`} className="w-full h-full object-cover" />
                                   ) : (
                                      <div className="relative w-full h-full">
                                         <img 
                                           src="/android_remote_control_mockup_1777102421456.png" 
                                           className={`w-full h-full object-cover transition-opacity duration-1000 ${isStreaming ? 'opacity-100' : 'opacity-40 grayscale'}`} 
                                         />
                                         {!isStreaming && (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center p-10 bg-black/40 backdrop-blur-[2px]">
                                               <Activity size={32} className="text-blue-600 animate-pulse" />
                                               <p className="mt-6 text-blue-500 font-bold text-xs uppercase tracking-widest animate-pulse text-center">Ready to Stream</p>
                                            </div>
                                         )}
                                      </div>
                                   )}
                                </div>
                                
                                {/* Interactive Overlay */}
                                <div className="absolute inset-0 z-10 cursor-crosshair" onClick={(e) => {
                                   const rect = e.currentTarget.getBoundingClientRect();
                                   const x = Math.round(((e.clientX - rect.left) / rect.width) * 1080);
                                   const y = Math.round(((e.clientY - rect.top) / rect.height) * 2400);
                                   if (isConnected && device?.id) {
                                      sendCommand(device.id, 'input:tap', { x, y });
                                      setRemoteLog(prev => [`Tapped at [${x}, ${y}]`, ...prev.slice(0, 5)]);
                                   }
                                }} />
                             </motion.div>
                          )}
                       </AnimatePresence>

                       {/* Navigation Bar */}
                       <div className="absolute bottom-2 w-24 h-1 bg-white/20 rounded-full z-20" />
                    </div>
                 </div>

                 <div className="flex gap-4">
                    <button 
                       disabled={!isOnline}
                       onClick={() => sendCommand(device!.id, 'screen:start')}
                       className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                    >
                       Start Session
                    </button>
                    <button 
                       disabled={!isOnline}
                       onClick={() => {
                          sendCommand(device!.id, 'input:home');
                          setRemoteLog(prev => [`Pressed HOME button`, ...prev.slice(0, 5)]);
                       }}
                       className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-xl transition-all disabled:opacity-50 border border-white/10"
                    >
                       Home
                    </button>
                 </div>

                 {/* Interaction Log */}
                 <div className="w-full max-w-[280px] space-y-2">
                    {remoteLog.map((log, i) => (
                       <motion.div 
                         initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                         key={i} className="text-[10px] font-mono text-slate-500 border-l border-blue-500/30 pl-3 py-1"
                       >
                          {log}
                       </motion.div>
                    ))}
                 </div>
              </motion.div>
           )}


           {activeTab === 'files' && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="h-full flex flex-col items-center justify-center space-y-4">
                 <Folder size={48} className="text-slate-700" />
                 <p className="text-slate-500 font-bold text-sm">Secure File Explorer</p>
                 <p className="text-xs text-slate-600 max-w-sm text-center">Browse, upload, and extract files seamlessly. End-to-end encrypted transfer guaranteed.</p>
                 <button disabled={!isOnline} className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-xl transition-all disabled:opacity-50 border border-white/10">
                    Mount Drive
                 </button>
              </motion.div>
           )}

           {activeTab === 'specs' && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="h-full">
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { l: 'Architecture', v: 'ARM64 v8', i: Cpu },
                      { l: 'Total Memory', v: '16.0 GB', i: HardDrive },
                      { l: 'OS Build', v: 'Unix/Linux', i: Server },
                      { l: 'Network', v: 'WLAN0', i: Wifi }
                    ].map((s, i) => (
                      <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col items-center justify-center text-center gap-2">
                         <s.i size={20} className="text-blue-500" />
                         <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{s.l}</span>
                         <span className="text-sm font-bold text-white">{s.v}</span>
                      </div>
                    ))}
                 </div>
              </motion.div>
           )}

           {!isOnline && (
             <div className="absolute inset-0 bg-[#0a0f18]/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center space-y-4">
                <div className="p-4 rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
                   <Lock size={24} />
                </div>
                <h3 className="text-lg font-bold text-white">Node Unavailable</h3>
                <p className="text-xs text-slate-400 font-medium">Wait for the node to come online to access the console.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}

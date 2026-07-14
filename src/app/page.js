'use client'; 

import { useState, useEffect } from 'react';
import './globals.css'; 

export default function Home() {
  const [results, setResults] = useState(null);
  const [isDrawTime, setIsDrawTime] = useState(false);
  const [loading, setLoading] = useState(true);

  // List of all operators we want to display
  const operators = [
    { id: 'magnum', name: 'MAGNUM 4D', color: 'text-yellow-400', border: 'border-yellow-400' },
    { id: 'toto', name: 'SPORTS TOTO', color: 'text-red-500', border: 'border-red-500' },
    { id: 'damacai', name: 'DA MA CAI 1+3D', color: 'text-blue-400', border: 'border-blue-400' },
    { id: 'sabah', name: 'SABAH 88', color: 'text-orange-500', border: 'border-orange-500' },
    { id: 'sarawak', name: 'SPECIAL CASHSWEEP', color: 'text-green-500', border: 'border-green-500' },
    { id: 'sandakan', name: 'SANDAKAN 4D', color: 'text-purple-400', border: 'border-purple-400' },
    { id: 'singapore', name: 'SINGAPORE POOLS', color: 'text-cyan-400', border: 'border-cyan-400' },
  ];

  const checkIsDrawTime = () => {
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kuala_Lumpur" }));
    const day = now.getDay(); 
    const hour = now.getHours();
    const isDrawDay = day === 0 || day === 3 || day === 6; // Sun, Wed, Sat
    const isDrawHour = (hour >= 19 && hour <= 20); // 7 PM - 8 PM Live Draw
    return isDrawDay && isDrawHour;
  };

  const fetchResults = async () => {
    try {
      const response = await fetch('/api/get-4d', { cache: 'no-store' });
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("UI fetch execution failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
    const intervalId = setInterval(() => {
      const activeDraw = checkIsDrawTime();
      setIsDrawTime(activeDraw);
      if (activeDraw) fetchResults();
    }, 15000); // Poll every 15 seconds during live draws
    return () => clearInterval(intervalId);
  }, []);

  // Helper to extract data for a specific provider from the API response
  const getProviderData = (providerId) => {
    if (!results) return null;
    // Adapt this based on your exact API JSON structure
    if (results[providerId]) return results[providerId];
    if (Array.isArray(results)) return results.find(r => r.provider?.toLowerCase().includes(providerId.toLowerCase()));
    return null; // Fallback if awaiting data
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-slate-400 font-medium">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mb-4"></div>
        <p className="tracking-widest uppercase text-xs">Connecting to Secure Data Feed...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        <header className="mb-10 text-center flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2">
            NEO<span className="text-yellow-400">4D</span> <span className="text-slate-600 font-light">LIVE</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-400 font-semibold tracking-[0.2em] uppercase">
            High Performance Real-Time Engine
          </p>
          
          {isDrawTime ? (
            <div className="mt-6 bg-red-950/40 border border-red-500/30 text-red-400 px-6 py-2 rounded-full flex items-center gap-3 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <span className="text-xs font-bold tracking-widest uppercase">Live Draw in Progress</span>
            </div>
          ) : (
            <div className="mt-6 border border-slate-800 text-slate-500 px-6 py-2 rounded-full flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-slate-600"></span>
              <span className="text-xs font-bold tracking-widest uppercase">Draw Completed / Standby</span>
            </div>
          )}
        </header>

        {/* Dynamic Grid for all Operators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {operators.map((op) => {
            const data = getProviderData(op.id);
            
            return (
              <div key={op.id} className={`bg-[#0a0a0a] rounded-2xl overflow-hidden border-t-4 ${op.border} border border-slate-800/80 shadow-xl relative group hover:border-slate-700 transition-colors`}>
                
                {/* Header */}
                <div className="bg-slate-900/50 px-5 py-4 flex justify-between items-center border-b border-slate-800/80">
                  <h2 className={`${op.color} font-black text-lg tracking-wider uppercase`}>{op.name}</h2>
                  <span className="text-[10px] text-slate-500 font-mono font-bold">{data?.date || results?.date || 'PENDING'}</span>
                </div>

                {/* Main Prizes */}
                <div className="p-5 space-y-3">
                  <div className="flex justify-between items-center bg-slate-900/40 p-3 rounded-lg border border-slate-800/50">
                    <span className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">1st Prize</span>
                    <span className="text-3xl font-mono font-black text-white tracking-[0.15em]">{data?.numbers?.first || data?.p1 || '----'}</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-900/20 p-3 rounded-lg border border-slate-800/30">
                    <span className="text-slate-500 text-[11px] font-bold uppercase tracking-widest">2nd Prize</span>
                    <span className="text-2xl font-mono font-black text-slate-300 tracking-[0.15em]">{data?.numbers?.second || data?.p2 || '----'}</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-900/20 p-3 rounded-lg border border-slate-800/30">
                    <span className="text-slate-500 text-[11px] font-bold uppercase tracking-widest">3rd Prize</span>
                    <span className="text-2xl font-mono font-black text-slate-300 tracking-[0.15em]">{data?.numbers?.third || data?.p3 || '----'}</span>
                  </div>
                </div>

                {/* Special & Consolation */}
                <div className="px-5 pb-5 grid grid-cols-2 gap-4 border-t border-slate-800/60 pt-4 bg-[#050505]">
                  <div>
                    <h3 className="text-[9px] font-black text-slate-600 uppercase tracking-widest text-center mb-2">Special</h3>
                    <div className="grid grid-cols-2 gap-1.5 text-center">
                      {data?.numbers?.special?.length > 0 ? (
                        data.numbers.special.map((num, i) => (
                          <div key={i} className="font-mono text-slate-400 font-semibold bg-slate-900/80 py-1 rounded text-sm border border-slate-800">{num}</div>
                        ))
                      ) : (
                        Array(10).fill('----').map((num, i) => (
                          <div key={i} className="font-mono text-slate-700 bg-slate-900/30 py-1 rounded text-sm">{num}</div>
                        ))
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-[9px] font-black text-slate-600 uppercase tracking-widest text-center mb-2">Consolation</h3>
                    <div className="grid grid-cols-2 gap-1.5 text-center">
                      {data?.numbers?.consolation?.length > 0 ? (
                        data.numbers.consolation.map((num, i) => (
                          <div key={i} className="font-mono text-slate-400 font-semibold bg-slate-900/80 py-1 rounded text-sm border border-slate-800">{num}</div>
                        ))
                      ) : (
                        Array(10).fill('----').map((num, i) => (
                          <div key={i} className="font-mono text-slate-700 bg-slate-900/30 py-1 rounded text-sm">{num}</div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <footer className="mt-16 mb-8 text-center text-[10px] text-slate-600 font-medium tracking-widest border-t border-slate-900 pt-8">
          <p>&copy; {new Date().getFullYear()} NEO4D LIVE ENGINE. ALL RIGHTS RESERVED.</p>
          <p className="mt-2">Independent data verification platform. Not affiliated with official gaming boards.</p>
        </footer>

      </div>
    </main>
  );
}
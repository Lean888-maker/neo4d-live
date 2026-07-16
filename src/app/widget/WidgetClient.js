'use client';

import React from 'react';

export default function WidgetClient({ data }) {
  const magnum = data.magnum || {};
  const toto = data.toto || {};
  const damacai = data.damacai || {};
  
  const hasDraw = magnum.drawNo && magnum.drawNo !== '----';
  const drawDate = hasDraw ? magnum.drawNo : 'Latest Results';

  return (
    <div className="bg-slate-900 min-h-screen text-slate-200 font-sans p-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-md bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-700">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-800 p-4 text-center">
          <h2 className="text-xl font-bold text-white tracking-wider">NEO4D LIVE</h2>
          <p className="text-red-200 text-sm">{drawDate}</p>
        </div>

        {/* Results Body */}
        <div className="p-4 space-y-6">
          {/* Magnum */}
          <div className="flex justify-between items-center bg-slate-900 p-3 rounded-xl border border-slate-700/50">
            <div className="text-red-500 font-bold text-lg">MAGNUM</div>
            <div className="text-right">
              <div className="text-xs text-slate-400">1st Prize</div>
              <div className="text-2xl font-black text-white">{magnum.p1 || '----'}</div>
            </div>
          </div>
          
          {/* Toto */}
          <div className="flex justify-between items-center bg-slate-900 p-3 rounded-xl border border-slate-700/50">
            <div className="text-red-500 font-bold text-lg">TOTO</div>
            <div className="text-right">
              <div className="text-xs text-slate-400">1st Prize</div>
              <div className="text-2xl font-black text-white">{toto.p1 || '----'}</div>
            </div>
          </div>

          {/* Da Ma Cai */}
          <div className="flex justify-between items-center bg-slate-900 p-3 rounded-xl border border-slate-700/50">
            <div className="text-blue-500 font-bold text-lg">DA MA CAI</div>
            <div className="text-right">
              <div className="text-xs text-slate-400">1st Prize</div>
              <div className="text-2xl font-black text-white">{damacai.p1 || '----'}</div>
            </div>
          </div>
        </div>

        {/* SEO Backlink Footer */}
        <div className="bg-slate-950 p-3 text-center border-t border-slate-800">
          <a 
            href="https://neo4d.live" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-slate-400 hover:text-white transition-colors duration-200"
          >
            Powered by <span className="font-bold text-red-500">NEO4D.LIVE</span>
          </a>
        </div>
      </div>
    </div>
  );
}

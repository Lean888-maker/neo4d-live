'use client';

import { useEffect, useState, useRef } from 'react';
import Script from 'next/script';

export default function PremiumPrelander() {
  const [tgUser, setTgUser] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isExternal, setIsExternal] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [boxState, setBoxState] = useState('closed'); // closed, opening, open
  const [prize, setPrize] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Detect if we are inside a Telegram WebApp iframe based on URL parameters
    const isTelegramEnvironment = window.location.hash.includes('tgWebAppData') || window.location.search.includes('tgWebAppData');
    
    if (!isTelegramEnvironment) {
      // Instantly load for external Ad Traffic. No 500ms delay. Prevents high bounce rate.
      setIsVerified(true);
      setIsExternal(true);
      setLoading(false);
      return;
    }

    // If we are in Telegram, poll for the SDK to be fully hydrated (up to 3 seconds for slow 3G)
    let attempts = 0;
    const initApp = async () => {
      const WebApp = window.Telegram?.WebApp;
      if (WebApp && WebApp.initData) {
        WebApp.ready();
        WebApp.expand();
        
        const user = WebApp.initDataUnsafe?.user;
        setTgUser(user);

        if (user) {
          try {
            const res = await fetch('/api/telegram/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ telegramUserId: user.id })
            });
            const data = await res.json();
            if (data.success && data.isMember) {
              setIsVerified(true);
            }
          } catch (e) {
            console.error("Verification failed", e);
          }
        }
        setLoading(false);
      } else {
        attempts++;
        if (attempts < 30) { // 30 * 100ms = 3000ms max wait
          setTimeout(initApp, 100);
        } else {
          // Absolute fallback if Telegram SDK totally fails
          setIsVerified(true);
          setIsExternal(true);
          setLoading(false);
        }
      }
    };
    initApp();
  }, []);

  const openFortuneBox = () => {
    if (typeof window !== 'undefined' && typeof window.trackRichAdsConversion === 'function') {
      window.trackRichAdsConversion();
    }
    if (boxState !== 'closed') return;
    
    setBoxState('opening');
    
    // Simulate chest shaking and opening sequence
    setTimeout(() => {
      const finalNumber = [
        Math.floor(Math.random() * 10),
        Math.floor(Math.random() * 10),
        Math.floor(Math.random() * 10),
        Math.floor(Math.random() * 10)
      ].join('');
      
      setPrize(finalNumber);
      setBoxState('open');
      setShowConfetti(true);
      
      // Turn off confetti animation after 4s
      setTimeout(() => setShowConfetti(false), 4000);
    }, 1800); // 1.8s shake time
  };

  const handleClaim = () => {
    if (typeof window !== 'undefined' && typeof window.trackRichAdsConversion === 'function') {
      window.trackRichAdsConversion();
    }
    if (!isExternal) {
      window.Telegram?.WebApp?.openLink('https://t.me/NEO4DLIVE');
    } else {
      window.location.href = 'https://t.me/NEO4DLIVE';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-pulse text-amber-500 font-bold text-xl tracking-widest">正在载入财神发财系统...</div>
      </div>
    );
  }

  if (!isVerified) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
        <h1 className="text-3xl font-bold text-red-500 mb-4 tracking-widest">访问被拒绝</h1>
        <p className="text-gray-300 mb-8">仅限NEO4D Telegram内部订阅者访问。</p>
        <button 
          onClick={() => { window.Telegram?.WebApp?.openTelegramLink('https://t.me/NEO4DLIVE'); }}
          className="bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black font-black py-4 px-8 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.5)] transition transform hover:scale-105"
        >
          验证会员身份
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0202] text-white flex flex-col items-center justify-between py-10 px-4 relative overflow-hidden">
      <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      
      {/* Premium Red/Gold Background effects */}
      <div className="absolute top-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-950/70 via-black to-black pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-amber-500/5 rounded-full blur-[80px] pointer-events-none"></div>

      {/* Confetti Particle Explosion */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(60)].map((_, i) => {
            const left = Math.random() * 100;
            const delay = Math.random() * 2;
            const duration = 2 + Math.random() * 2;
            const size = 6 + Math.random() * 10;
            const color = i % 2 === 0 ? 'bg-amber-400' : 'bg-red-500';
            return (
              <div 
                key={i}
                className={`absolute rounded-sm ${color} animate-[fall_${duration}s_ease-out_infinite]`}
                style={{
                  left: `${left}%`,
                  top: `-20px`,
                  width: `${size}px`,
                  height: `${size}px`,
                  animationDelay: `${delay}s`,
                  transform: `rotate(${Math.random() * 360}deg)`
                }}
              />
            );
          })}
        </div>
      )}

      {/* Header */}
      <div className="text-center relative z-10 w-full">
        <div className="inline-block bg-gradient-to-r from-red-600/20 to-amber-500/20 border border-red-500/30 px-6 py-2 rounded-full mb-4">
          <span className="text-amber-400 font-bold tracking-widest text-xs md:text-sm uppercase flex items-center justify-center gap-2">
            🧧 财神显灵 · 今日特别推荐
          </span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-amber-200 to-amber-500 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] mb-2">
          {tgUser?.first_name ? `${tgUser.first_name}, ` : ''}求取今日必中吉数
        </h1>
        <p className="text-gray-400 text-sm md:text-base font-medium tracking-wide">点击财神箱，获取您的专属好运4D号码</p>
      </div>

      {/* Cai Shen Fortune Box Component */}
      <div className="relative z-10 w-full max-w-sm my-6 flex flex-col items-center justify-center">
        {/* Chest Wrapper */}
        <div className={`w-64 h-64 relative cursor-pointer select-none transition-transform duration-300 ${boxState === 'opening' ? 'animate-[shake_0.5s_infinite]' : 'hover:scale-105 active:scale-95'}`} onClick={openFortuneBox}>
          
          {/* Closed Box State */}
          {boxState === 'closed' && (
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Outer Golden Aura */}
              <div className="absolute w-48 h-48 bg-amber-500/20 rounded-full filter blur-xl animate-pulse"></div>
              {/* Box Graphic */}
              <div className="w-44 h-44 bg-gradient-to-b from-red-600 via-red-800 to-red-950 rounded-2xl border-4 border-amber-500 shadow-[0_15px_30px_rgba(0,0,0,0.7)] flex flex-col items-center justify-between p-4 relative overflow-hidden">
                <div className="absolute top-0 w-full h-2 bg-amber-400"></div>
                {/* Chinese Character '吉' or '财' */}
                <div className="w-16 h-16 rounded-full border-4 border-amber-400 flex items-center justify-center bg-red-700 shadow-md my-auto">
                  <span className="text-amber-400 font-black text-3xl">吉</span>
                </div>
                <div className="text-amber-400 font-bold text-sm tracking-widest bg-black/40 px-3 py-1 rounded-full border border-amber-500/30">点我求字</div>
              </div>
            </div>
          )}

          {/* Shaking State */}
          {boxState === 'opening' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute w-56 h-56 bg-amber-500/35 rounded-full filter blur-2xl animate-ping"></div>
              <div className="w-44 h-44 bg-gradient-to-b from-red-600 via-red-800 to-red-950 rounded-2xl border-4 border-amber-400 shadow-[0_15px_40px_rgba(245,158,11,0.5)] flex items-center justify-center relative">
                <span className="text-amber-400 font-black text-4xl animate-bounce">⚡ 祈福中...</span>
              </div>
            </div>
          )}

          {/* Open Box State / Revealed Numbers */}
          {boxState === 'open' && (
            <div className="absolute inset-0 flex items-center justify-center animate-[pop_0.6s_cubic-bezier(0.175,0.885,0.32,1.275)]">
              {/* Massive Golden Ray */}
              <div className="absolute w-64 h-64 bg-amber-400/25 rounded-full filter blur-3xl animate-pulse"></div>
              {/* Premium Red Packet Display */}
              <div className="w-56 h-36 bg-gradient-to-b from-red-600 via-red-700 to-red-850 text-white rounded-xl border-4 border-amber-500 shadow-[0_20px_50px_rgba(245,158,11,0.6)] flex flex-col items-center justify-between p-4 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 font-black text-xs px-4 py-0.5 rounded-full border border-amber-300 shadow-md">NEO4D VIP</div>
                <div className="text-amber-200 text-xs font-bold tracking-widest mt-2">今日推荐必中吉数</div>
                <div className="text-4xl md:text-5xl font-black tracking-widest text-yellow-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] font-mono my-2 animate-pulse">
                  {prize}
                </div>
                <div className="text-[10px] text-red-200 border-t border-dashed border-red-500 w-full text-center pt-1 font-bold">请妥善保存，祝您今晚中奖！</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="relative z-10 w-full max-w-sm flex flex-col items-center gap-6">
        {boxState === 'closed' && (
          <button 
            className="w-full relative group overflow-hidden bg-gradient-to-b from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 px-8 py-5 rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.5)] transform transition-all duration-300 hover:scale-[1.02] active:scale-95"
            onClick={openFortuneBox}
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shine_1.5s_infinite]"></div>
            <span className="relative text-black font-black text-xl uppercase tracking-widest drop-shadow-sm">
              🔑 立即开启财神箱
            </span>
          </button>
        )}

        {boxState === 'open' && (
          <div className="w-full flex flex-col items-center gap-4 animate-[fadeIn_0.5s_ease-out]">
            <div className="text-amber-400 font-bold tracking-widest uppercase text-xs md:text-sm animate-pulse">🎉 号码已成功解锁！</div>
            <button 
              onClick={handleClaim} 
              className="w-full relative group overflow-hidden bg-gradient-to-b from-emerald-500 to-green-700 hover:from-emerald-400 hover:to-green-600 px-8 py-5 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.5)] transform transition-all duration-300 hover:scale-[1.02] active:scale-95"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shine_1.5s_infinite]"></div>
              <span className="relative text-white font-black text-lg md:text-xl uppercase tracking-widest drop-shadow-md">
                📱 点击进入TG频道核对开彩结果
              </span>
            </button>
            <button 
              onClick={() => {
                const text = encodeURIComponent(`我刚刚在 NEO4D 抽中了今日大伯公VIP必中吉数 ${prize}！马上点击获取你的专属号码，全马最快无广告实时开彩！ 👉 https://neo4d.live/telegram-supervip`);
                window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
              }}
              className="w-full relative group overflow-hidden bg-[#25D366] hover:bg-[#128C7E] px-8 py-4 rounded-2xl shadow-[0_0_20px_rgba(37,211,102,0.4)] transform transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
            >
              <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
              <span className="relative text-white font-bold text-base tracking-wide">
                分享幸运给朋友 (WhatsApp)
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Footer Social Proof */}
      <div className="relative z-10 mt-8 text-center border-t border-red-950/40 w-full pt-4">
        <p className="text-gray-500 text-[10px] md:text-xs tracking-widest uppercase">
          实时状态：用户***481刚刚通过财神箱求得发财号 {Math.floor(Math.random() * 8000 + 1000)}
        </p>
      </div>

      {/* Tailwind and Custom CSS Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shine {
          100% { transform: translateX(100%); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0% { transform: translate(1px, 1px) rotate(0deg); }
          10% { transform: translate(-1px, -2px) rotate(-1deg); }
          20% { transform: translate(-3px, 0px) rotate(1deg); }
          30% { transform: translate(0px, 2px) rotate(0deg); }
          40% { transform: translate(1px, -1px) rotate(1deg); }
          50% { transform: translate(-1px, 2px) rotate(-1deg); }
          60% { transform: translate(-3px, 1px) rotate(0deg); }
          70% { transform: translate(2px, 1px) rotate(-1deg); }
          80% { transform: translate(-1px, -1px) rotate(1deg); }
          90% { transform: translate(2px, 2px) rotate(0deg); }
          100% { transform: translate(1px, -2px) rotate(-1deg); }
        }
        @keyframes pop {
          0% { transform: scale(0.3); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fall {
          0% { transform: translateY(-50px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
      `}} />
    </div>
  );
}

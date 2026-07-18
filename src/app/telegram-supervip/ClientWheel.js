'use client';

import { useEffect, useState, useRef } from 'react';
import Script from 'next/script';

export default function PremiumPrelander() {
  const [tgUser, setTgUser] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isExternal, setIsExternal] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [spinning, setSpinning] = useState(false);
  const [digits, setDigits] = useState(['-', '-', '-', '-']);
  const [prize, setPrize] = useState(null);
  const intervalRef = useRef(null);

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

  const generateNumber = () => {
    if (spinning) return;
    setSpinning(true);
    setPrize(null);

    let startTime = Date.now();
    const finalNumber = [
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10)
    ];

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      
      setDigits(prev => {
        const newDigits = [...prev];
        // Reel 1 locks after 1.0s
        if (elapsed < 1000) newDigits[0] = Math.floor(Math.random() * 10);
        else newDigits[0] = finalNumber[0];
        
        // Reel 2 locks after 1.5s
        if (elapsed < 1500) newDigits[1] = Math.floor(Math.random() * 10);
        else newDigits[1] = finalNumber[1];
        
        // Reel 3 locks after 2.0s
        if (elapsed < 2000) newDigits[2] = Math.floor(Math.random() * 10);
        else newDigits[2] = finalNumber[2];
        
        // Reel 4 locks after 2.5s
        if (elapsed < 2500) newDigits[3] = Math.floor(Math.random() * 10);
        else newDigits[3] = finalNumber[3];
        
        return newDigits;
      });

      if (elapsed >= 2500) {
        clearInterval(intervalRef.current);
        setSpinning(false);
        setPrize(finalNumber.join(''));
      }
    }, 50);
  };

  const handleClaim = () => {
    if (!isExternal) {
      window.Telegram?.WebApp?.openLink('https://neo4d.live/zh');
    } else {
      window.location.href = 'https://t.me/NEO4DLIVE';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-pulse text-amber-500 font-bold text-xl tracking-widest">正在加载VIP系统...</div>
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
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-between py-12 px-4 relative overflow-hidden">
      <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      
      {/* Background premium effects */}
      <div className="absolute top-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/40 via-black to-black pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Header */}
      <div className="text-center relative z-10 w-full">
        <div className="inline-block bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 px-6 py-2 rounded-full mb-6">
          <span className="text-amber-400 font-bold tracking-widest text-sm uppercase">VIP专属通道</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-500 drop-shadow-lg mb-2">
          {tgUser?.first_name ? `${tgUser.first_name}, ` : ''}您的幸运4D
        </h1>
        <p className="text-gray-400 font-medium tracking-wide">生成今日高胜率号码</p>
      </div>

      {/* Slot Machine Display */}
      <div className="relative z-10 w-full max-w-md my-12">
        <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-2 rounded-3xl border border-gray-700 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="bg-black rounded-2xl p-6 md:p-8 flex justify-between items-center border border-gray-800 relative overflow-hidden">
            {/* Inner glass reflection */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
            
            {digits.map((digit, idx) => (
              <div key={idx} className="w-16 h-24 md:w-20 md:h-28 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 rounded-xl flex items-center justify-center border-2 border-gray-700 shadow-inner relative">
                <span className={`text-5xl md:text-6xl font-black tabular-nums tracking-tighter ${prize ? 'text-amber-400 drop-shadow-[0_0_15px_rgba(245,158,11,0.8)]' : 'text-white drop-shadow-md'}`}>
                  {digit}
                </span>
                {/* Horizontal line across digit like mechanical flip clock */}
                <div className="absolute top-1/2 left-0 w-full h-[2px] bg-black/50 -translate-y-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="relative z-10 w-full max-w-md flex flex-col items-center gap-6">
        {!prize ? (
          <button 
            className={`w-full relative group overflow-hidden bg-gradient-to-b from-amber-400 to-amber-600 px-8 py-5 rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.4)] transform transition-all duration-300 ${spinning ? 'opacity-80 cursor-not-allowed scale-95' : 'hover:scale-[1.02] active:scale-95'}`}
            onClick={generateNumber}
            disabled={spinning}
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shine_1.5s_infinite]"></div>
            <span className="relative text-black font-black text-2xl uppercase tracking-widest drop-shadow-sm">
              {spinning ? '生成中...' : '生成幸运号码'}
            </span>
          </button>
        ) : (
          <div className="w-full flex flex-col items-center gap-4 animate-[fadeIn_0.5s_ease-out]">
            <div className="text-amber-400 font-bold tracking-widest uppercase text-sm mb-2 animate-pulse">号码已成功锁定</div>
            <button 
              onClick={handleClaim} 
              className="w-full relative group overflow-hidden bg-gradient-to-b from-emerald-500 to-green-700 hover:from-emerald-400 hover:to-green-600 px-8 py-5 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.5)] transform transition-all duration-300 hover:scale-[1.02] active:scale-95"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shine_1.5s_infinite]"></div>
              <span className="relative text-white font-black text-xl md:text-2xl uppercase tracking-widest drop-shadow-md">
                {isExternal ? '加入VIP群组查看直播' : '立即查看开奖直播'}
              </span>
            </button>
            <button 
              onClick={() => {
                const text = encodeURIComponent(`我刚刚在 NEO4D 抽中了今日 VIP 开彩吉数 ${prize}！马上点击获取你的专属号码，全马最快无广告实时开彩！ 👉 https://neo4d.live/telegram-supervip`);
                window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
              }}
              className="w-full relative group overflow-hidden bg-[#25D366] hover:bg-[#128C7E] px-8 py-4 rounded-2xl shadow-[0_0_20px_rgba(37,211,102,0.4)] transform transition-all duration-300 hover:scale-[1.02] active:scale-95 mt-2 flex items-center justify-center gap-3"
            >
              {/* WhatsApp SVG Icon */}
              <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
              <span className="relative text-white font-bold text-lg md:text-xl tracking-wide">
                分享给朋友 (WhatsApp)
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Footer Social Proof */}
      <div className="relative z-10 mt-12 text-center border-t border-gray-800 w-full pt-6">
        <p className="text-gray-500 text-xs tracking-widest uppercase">
          实时动态：用户***921刚刚领取了4509
        </p>
      </div>

      {/* Tailwind Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shine {
          100% { transform: translateX(100%); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import styles from './Wheel.module.css';

export default function TelegramGame() {
  const [tgUser, setTgUser] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [spinning, setSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [prize, setPrize] = useState(null);

  const slices = [
    { id: 1, text: "8831" },
    { id: 2, text: "1299" },
    { id: 3, text: "7632" },
    { id: 4, text: "4509" },
    { id: 5, text: "9918" },
    { id: 6, text: "3201" },
  ];

  useEffect(() => {
    // Wait for Telegram WebApp SDK to load
    const initApp = async () => {
      const WebApp = window.Telegram?.WebApp;
      if (WebApp) {
        WebApp.ready();
        WebApp.expand(); // Full screen inside Telegram
        
        const user = WebApp.initDataUnsafe?.user;
        setTgUser(user);

        if (user) {
          // Verify they are actually subscribed to the channel
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
      } else {
        // Fallback for desktop browser testing (non-Telegram environment)
        console.warn("Telegram WebApp not detected. Running in mock mode.");
        setTgUser({ first_name: "Mock User", id: "123456" });
        setIsVerified(true);
      }
      setLoading(false);
    };

    // Small delay to ensure SDK is injected
    setTimeout(initApp, 500);
  }, []);

  const spinWheel = () => {
    if (spinning) return;
    setSpinning(true);
    setPrize(null);

    // Randomize winning slice (1 to 6)
    const winningIndex = Math.floor(Math.random() * 6);
    
    // Calculate rotation: 
    // Basic spins (e.g. 5 full rotations = 1800 deg) + angle to the winning slice.
    // Each slice is 60 degrees. To center the pointer on a slice, we calculate offset.
    const sliceAngle = 60;
    const baseSpins = 360 * 5; 
    
    // The exact angle needs to point to the winning index
    // 0 deg is top. We subtract (winningIndex * 60) to bring it to the top.
    const targetAngle = baseSpins - (winningIndex * sliceAngle) - (Math.random() * 40 - 20); // Add slight randomness so it doesn't land perfectly center every time

    const newRotation = wheelRotation + targetAngle + 3600; // Always spin forward a lot
    setWheelRotation(newRotation);

    // Wait for the CSS transition to finish (4 seconds)
    setTimeout(() => {
      setSpinning(false);
      setPrize(slices[winningIndex].text);
    }, 4000);
  };

  const handleClaim = () => {
    // Drive traffic back to the main site to check results
    const targetUrl = `https://neo4d.live/`;
    
    // Open link safely using Telegram SDK if available
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openLink(targetUrl);
    } else {
      window.location.href = targetUrl;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-pulse text-amber-500 font-bold text-xl">Loading NEO4D Live...</div>
      </div>
    );
  }

  if (!isVerified) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
        <h1 className="text-3xl font-bold text-red-500 mb-4">ACCESS DENIED</h1>
        <p className="text-gray-300 mb-8">You must be a subscriber of the NEO4D Live Telegram Channel to generate your daily lucky 4D numbers!</p>
        <button 
          onClick={() => { window.Telegram?.WebApp?.openTelegramLink('https://t.me/NEO4DLIVE'); }}
          className="bg-amber-500 hover:bg-amber-600 text-black font-bold py-4 px-8 rounded-full"
        >
          Join @NEO4DLIVE Now
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900 via-black to-black text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      
      {/* Background ambient light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-amber-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="mb-12 text-center relative z-10">
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 mb-3 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">
          Welcome, {tgUser?.first_name || 'VIP'}!
        </h1>
        <p className="text-lg text-amber-100/80 font-bold tracking-wide uppercase">Spin for today's lucky VIP number</p>
      </div>

      <div className={`${styles.wheelContainer} relative z-10`}>
        <div className={styles.pointer}></div>
        <div 
          className={styles.wheel}
          style={{ transform: `rotate(${wheelRotation}deg)` }}
        >
          <svg viewBox="0 0 320 320" width="100%" height="100%" style={{ filter: 'drop-shadow(inset 0 0 10px black)' }}>
            <g transform="translate(160, 160)">
              {slices.map((s, i) => (
                <g key={s.id} transform={`rotate(${i * 60})`}>
                  {/* 60-degree slice path centered at the top */}
                  <path 
                    d="M 0 0 L -80 -138.56 A 160 160 0 0 1 80 -138.56 Z" 
                    fill={i % 2 === 0 ? "#8b0000" : "#2c2c2c"} 
                  />
                  {/* Text perfectly centered inside the slice */}
                  <text 
                    y="-105" 
                    textAnchor="middle" 
                    fill={i % 2 === 0 ? "#ffffff" : "#ffd700"} 
                    fontSize="26" 
                    fontWeight="900" 
                    fontFamily="sans-serif"
                    style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.9), -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000" }}
                  >
                    {s.text}
                  </text>
                </g>
              ))}
            </g>
          </svg>
        </div>
      </div>

      <div className="relative z-10">
        {!prize ? (
          <button 
            className={styles.spinButton} 
            onClick={spinWheel}
            disabled={spinning}
          >
            {spinning ? 'SPINNING...' : 'SPIN NOW!'}
          </button>
        ) : (
          <div className="mt-10 bg-gradient-to-b from-gray-800 to-gray-900 border-2 border-amber-400 rounded-2xl p-8 text-center animate-bounce shadow-[0_0_30px_rgba(245,158,11,0.4)]">
            <h2 className="text-2xl font-black text-gray-300 mb-1 uppercase tracking-widest">Your Lucky Number:</h2>
            <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-600 mb-8 drop-shadow-lg tracking-widest">{prize}</p>
            
            <button onClick={handleClaim} className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 px-8 py-4 rounded-xl text-white font-black text-xl shadow-[0_0_20px_rgba(34,197,94,0.6)] transform transition hover:scale-105">
              CHECK LIVE RESULTS NOW
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

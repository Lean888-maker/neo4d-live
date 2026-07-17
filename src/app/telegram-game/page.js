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
    { id: 1, text: "RM10 Credit", color: "#dc2626" },
    { id: 2, text: "Try Again", color: "#1f2937" },
    { id: 3, text: "RM5 Credit", color: "#dc2626" },
    { id: 4, text: "Try Again", color: "#1f2937" },
    { id: 5, text: "Mystery Prize", color: "#dc2626" },
    { id: 6, text: "RM1 Credit", color: "#1f2937" },
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
    // Generate a unique promo code for the user
    const promoCode = `NEO-TG-${tgUser?.id || 'LUCKY'}`;
    const targetUrl = `https://neo4d.live/?promo=${promoCode}`;
    
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
        <p className="text-gray-300 mb-8">You must be a subscriber of the NEO4D Live Telegram Channel to play the Spinning Wheel and win free credits!</p>
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col items-center justify-center p-4">
      <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-black text-amber-500 mb-2 drop-shadow-md">Welcome, {tgUser?.first_name || 'Player'}!</h1>
        <p className="text-gray-400">Spin the wheel to win free iGaming credits today.</p>
      </div>

      <div className={styles.wheelContainer}>
        <div className={styles.pointer}></div>
        <div 
          className={styles.wheel}
          style={{ transform: `rotate(${wheelRotation}deg)` }}
        >
          {/* We use hardcoded texts in CSS for standard slices for visual simplicity, 
              or we can map them dynamically if we use complex CSS/SVG. 
              Given our CSS, we just put absolute divs. */}
          {slices.map((s, i) => (
             <div key={s.id} className={`${styles.sliceText} ${styles[`slice${i+1}`]}`}>
               {s.text}
             </div>
          ))}
        </div>
      </div>

      {!prize ? (
        <button 
          className={styles.spinButton} 
          onClick={spinWheel}
          disabled={spinning}
        >
          {spinning ? 'Spinning...' : 'SPIN NOW!'}
        </button>
      ) : (
        <div className="mt-8 bg-gray-800 border-2 border-amber-500 rounded-xl p-6 text-center animate-bounce">
          <h2 className="text-2xl font-bold text-white mb-2">You Won!</h2>
          <p className="text-3xl font-black text-amber-500 mb-6">{prize}</p>
          
          {prize.includes("Try Again") ? (
            <button onClick={() => setPrize(null)} className="bg-gray-600 hover:bg-gray-500 px-6 py-2 rounded-full text-white font-bold">
              Try Again Tomorrow
            </button>
          ) : (
            <button onClick={handleClaim} className="bg-green-500 hover:bg-green-600 px-8 py-3 rounded-full text-white font-black text-xl shadow-[0_0_15px_rgba(34,197,94,0.5)]">
              CLAIM REWARD NOW
            </button>
          )}
        </div>
      )}
    </div>
  );
}

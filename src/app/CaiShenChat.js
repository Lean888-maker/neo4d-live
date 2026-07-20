'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function CaiShenChat() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [chatState, setChatState] = useState(0);
  const [userZodiac, setUserZodiac] = useState('');
  const messagesEndRef = useRef(null);
  const initDone = useRef(false);

  // Critical fix: only show widget after client hydration to prevent logo flicker
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Initialize with welcome message exactly once
  useEffect(() => {
    if (isMounted && !initDone.current) {
      initDone.current = true;
      const timer = setTimeout(() => {
        setMessages([{ sender: 'bot', text: '哎哟老板！我是财神爷。今天想要发财拿吉数对吗？请问你的生肖是什么？' }]);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isMounted]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Don't render on telegram game page or before hydration
  if (!isMounted || pathname === '/telegram-game') return null;

  const handleSend = (text) => {
    const userText = text || input;
    if (!userText.trim()) return;

    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInput('');

    setTimeout(() => {
      if (chatState === 0) {
        setUserZodiac(userText);
        setMessages(prev => [...prev, { sender: 'bot', text: `啊，属${userText}！今天这个生肖的偏财磁场非常强。让我连线我的 **5年历史大数据(BigQuery)** 为你分析。告诉我，你昨晚梦到了什么？（或者回复'没有'）` }]);
        setChatState(1);
      } else if (chatState === 1) {
        setMessages(prev => [...prev, { sender: 'bot', text: `正在使用AI扫描 **2020-2024年** 所有的开奖记录，匹配你的生肖与梦境频率... 稍等啊...` }]);
        setTimeout(() => {
          const baseNum = (userText.length * 137 + userZodiac.length * 89) % 10000;
          const luckyNum = baseNum.toString().padStart(4, '0');
          setMessages(prev => [...prev, { 
            sender: 'bot', 
            text: `发啊！🧧 经过 **5年历史大数据运算**，你的专属超强发财字是 [ **${luckyNum}** ]。财神爷指示你**必须**把这个发财字分享到3个WhatsApp群，锁定你的财富磁场，不然财运就溜走咯！`,
            isFinal: luckyNum
          }]);
          setChatState(2);
        }, 3000);
      } else {
        setMessages(prev => [...prev, { sender: 'bot', text: `快去买你的发财字！记得先分享到WhatsApp聚财气！` }]);
      }
    }, 1000);
  };

  const handleShare = (luckyNum) => {
    const text = `财神爷刚刚赐给我今天的专属发财字 [ ${luckyNum} ]！你也来免费获取你的发财字：\nhttps://neo4d.live/ 🧧💰`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-slate-900 border border-amber-500/40 shadow-2xl rounded-2xl w-[90vw] md:w-80 h-96 mb-4 flex flex-col overflow-hidden">
          <div className="bg-gradient-to-r from-red-800 to-red-600 px-4 py-3 flex justify-between items-center shadow-md z-10">
            <div className="flex items-center gap-2">
              {/* Plain img tag: zero hydration flash, loads immediately */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/caishen.png" alt="财神爷" width={40} height={40} loading="eager" decoding="sync"
                className="w-10 h-10 rounded-full border-2 border-amber-500 object-cover shadow-sm bg-slate-800"
                onError={(e) => { e.currentTarget.style.visibility='hidden'; }}
              />
              <div>
                <h3 className="text-white font-black text-sm">财神爷</h3>
                <p className="text-red-200 text-[10px] leading-none">在线 - 人工智能算命</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} aria-label="Close chat" className="text-white hover:text-amber-300 p-1 text-lg leading-none">✖</button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/80">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`px-4 py-3 rounded-2xl text-sm max-w-[85%] ${
                  msg.sender === 'user' 
                    ? 'bg-amber-500 text-slate-950 rounded-br-sm font-bold' 
                    : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-sm leading-relaxed'
                }`}>
                  {msg.text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      return <strong key={i} className="text-amber-400 font-black">{part.slice(2, -2)}</strong>;
                    }
                    return part;
                  })}
                </div>
                {msg.isFinal && (
                  <button onClick={() => handleShare(msg.isFinal)}
                    className="mt-3 flex items-center gap-2 bg-[#25D366] text-white px-5 py-2.5 rounded-full text-sm font-black hover:scale-105 active:scale-95 transition-transform shadow-md">
                    <span>💬</span> 分享至 WhatsApp
                  </button>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-slate-900 border-t border-slate-800">
            {chatState === 0 && (
              <div className="flex gap-2 flex-wrap mb-3">
                {['龙', '蛇', '马', '羊'].map(z => (
                  <button key={z} onClick={() => handleSend(z)}
                    className="px-3 py-1.5 bg-slate-800 text-amber-500 rounded border border-slate-600 text-xs font-bold hover:bg-slate-700 active:scale-95 transition-all">{z}</button>
                ))}
              </div>
            )}
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
              <input type="text" value={input} onChange={e => setInput(e.target.value)}
                placeholder="输入你的回复..."
                className="flex-1 bg-slate-950 border border-slate-700 text-white text-sm rounded-full px-4 py-3 focus:outline-none focus:border-amber-500 transition-colors"
              />
              <button type="submit" disabled={!input.trim()}
                className="bg-amber-500 text-slate-900 rounded-full w-11 h-11 flex items-center justify-center font-black disabled:opacity-40 shadow-md text-lg shrink-0">↗</button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Bubble — plain <img> guarantees zero layout shift / flicker */}
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} aria-label="Open Cai Shen Fortune Chat"
          className="group relative flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full shadow-[0_0_25px_rgba(245,158,11,0.5)] hover:scale-105 active:scale-95 transition-transform duration-200 border-[3px] border-amber-200 cursor-pointer animate-bounce-slow will-change-transform">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/caishen.png" alt="财神爷" width={80} height={80} loading="eager" decoding="sync"
            className="w-[90%] h-[90%] object-cover rounded-full"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const fb = e.currentTarget.nextElementSibling;
              if (fb) fb.style.display = 'flex';
            }}
          />
          {/* Emoji fallback if /caishen.png 404s */}
          <span style={{display:'none'}} className="absolute inset-0 items-center justify-center text-3xl font-black text-white rounded-full bg-gradient-to-br from-amber-400 to-amber-600">財</span>
          
          <span className="absolute -top-1 -right-1 flex h-6 w-6">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-6 w-6 bg-red-600 border-2 border-white text-[10px] text-white font-black justify-center items-center shadow-lg">1</span>
          </span>
          
          <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 w-max px-4 py-2.5 bg-slate-900 text-amber-400 text-sm font-black rounded-xl border-2 border-amber-500/50 flex flex-col items-end shadow-2xl animate-pulse-subtle pointer-events-none">
            <span>点击获取财神爷今日吉数！</span>
            <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-0 h-0 border-y-8 border-y-transparent border-l-8 border-l-amber-500/50"></div>
          </span>
        </button>
      )}
    </div>
  );
}

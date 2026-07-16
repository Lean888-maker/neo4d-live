'use client';

import { useState, useEffect, useRef } from 'react';

export default function CaiShenChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [chatState, setChatState] = useState(0);
  const [userZodiac, setUserZodiac] = useState('');
  const messagesEndRef = useRef(null);

  // Initialize with welcome message only once
  useEffect(() => {
    if (messages.length === 0) {
      setTimeout(() => {
        setMessages([{ sender: 'bot', text: 'Aiyo Boss! I am Uncle Cai Shen 财神爷. You want lucky 4D number today right? What is your Chinese Zodiac?' }]);
      }, 500);
    }
  }, [messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (text) => {
    const userText = text || input;
    if (!userText.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInput('');

    // Simulate typing delay to inflate Dwell Time
    setTimeout(() => {
      if (chatState === 0) {
        setUserZodiac(userText);
        setMessages(prev => [...prev, { sender: 'bot', text: `Ah, ${userText}! Very good magnetic field today for this zodiac. Tell me, what did you dream about last night? (Or type 'nothing')` }]);
        setChatState(1);
      } else if (chatState === 1) {
        setMessages(prev => [...prev, { sender: 'bot', text: `Calculating wealth aura based on your dream and Zodiac... wait ah...` }]);
        
        setTimeout(() => {
          // Generate a deterministic random number based on input length
          const baseNum = (userText.length * 137 + userZodiac.length * 89) % 10000;
          const luckyNum = baseNum.toString().padStart(4, '0');
          
          setMessages(prev => [...prev, { 
            sender: 'bot', 
            text: `Huat ah! 🧧 Your supreme lucky number is [ **${luckyNum}** ]. Uncle Cai Shen says you MUST share this to 3 WhatsApp groups to lock in the wealth aura, otherwise the luck will fly away!`,
            isFinal: luckyNum
          }]);
          setChatState(2);
        }, 3000); // 3 seconds calculating (increases dwell time)
      } else {
        setMessages(prev => [...prev, { sender: 'bot', text: `Go buy your number now! Share to WhatsApp first for good luck!` }]);
      }
    }, 1000);
  };

  const handleShare = (luckyNum) => {
    const text = `Uncle Cai Shen just gave me my lucky 4D number [ ${luckyNum} ] for today! Get yours free at https://neo4d.live/ 🧧💰`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-slate-900 border border-amber-500/40 shadow-2xl rounded-2xl w-[90vw] md:w-80 h-96 mb-4 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-red-800 to-red-600 px-4 py-3 flex justify-between items-center shadow-md z-10">
            <div className="flex items-center gap-2">
              <img src="/caishen.png" alt="Uncle Cai Shen" className="w-10 h-10 rounded-full border-2 border-amber-500 object-cover shadow-sm bg-slate-900" />
              <div>
                <h3 className="text-white font-black text-sm">Uncle Cai Shen</h3>
                <p className="text-red-200 text-[10px] leading-none">Online - AI Oracle</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-amber-300">
              ✖
            </button>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/80 scroll-smooth">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`px-4 py-3 rounded-2xl text-base max-w-[85%] ${
                  msg.sender === 'user' 
                    ? 'bg-amber-500 text-slate-950 rounded-br-sm font-bold' 
                    : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-sm leading-relaxed'
                }`}>
                  {/* Markdown-style bold replacement */}
                  {msg.text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      return <strong key={i} className="text-amber-400 font-black text-2xl drop-shadow-md">{part.slice(2, -2)}</strong>;
                    }
                    return part;
                  })}
                </div>
                
                {msg.isFinal && (
                  <button 
                    onClick={() => handleShare(msg.isFinal)}
                    className="mt-3 flex items-center gap-2 bg-[#25D366] text-white px-5 py-2.5 rounded-full text-sm font-black hover:scale-105 transition-transform shadow-md"
                  >
                    <span className="text-lg">💬</span> Share to WhatsApp
                  </button>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="p-3 bg-slate-900 border-t border-slate-800">
            {chatState === 0 && (
              <div className="flex gap-2 flex-wrap mb-3">
                {['Dragon', 'Snake', 'Horse', 'Sheep'].map(z => (
                  <button key={z} onClick={() => handleSend(z)} className="px-3 py-1.5 bg-slate-800 text-amber-500/90 rounded border border-slate-600 text-xs font-bold hover:bg-slate-700">{z}</button>
                ))}
              </div>
            )}
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type your reply..."
                className="flex-1 bg-slate-950 border border-slate-700 text-white text-base rounded-full px-5 py-3 focus:outline-none focus:border-amber-500 transition-colors shadow-inner"
              />
              <button 
                type="submit" 
                disabled={!input.trim()}
                className="bg-amber-500 text-slate-900 rounded-full w-12 h-12 flex items-center justify-center font-black disabled:opacity-50 disabled:cursor-not-allowed shadow-md text-xl"
              >
                ↗
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Bubble */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full shadow-[0_0_25px_rgba(245,158,11,0.6)] hover:scale-105 transition-transform duration-300 border-[3px] border-amber-200 cursor-pointer animate-bounce-slow"
        >
          <img src="/caishen.png" alt="Cai Shen" className="w-[90%] h-[90%] object-cover rounded-full shadow-inner" />
          
          {/* Notification Badge */}
          <span className="absolute -top-1 -right-1 flex h-6 w-6">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-6 w-6 bg-red-600 border-2 border-white text-[10px] text-white font-black justify-center items-center shadow-lg">1</span>
          </span>
          
          {/* Tooltip (Always visible on mobile, hover on desktop) */}
          <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 w-max px-4 py-2.5 bg-slate-900 text-amber-400 text-sm font-black rounded-xl border-2 border-amber-500/50 flex flex-col items-end shadow-2xl animate-pulse-subtle">
            <span>点击获取财神爷今日吉数！</span>
            <span className="text-[10px] text-slate-300">Ask Uncle Cai Shen for Lucky Number!</span>
            {/* Right arrow pointer */}
            <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-0 h-0 border-y-8 border-y-transparent border-l-8 border-l-amber-500/50"></div>
          </span>
        </button>
      )}
    </div>
  );
}

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
              <div className="text-2xl">👲</div>
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
                <div className={`px-4 py-2 rounded-2xl text-sm max-w-[85%] ${
                  msg.sender === 'user' 
                    ? 'bg-amber-500 text-slate-950 rounded-br-sm font-medium' 
                    : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-sm leading-relaxed'
                }`}>
                  {/* Markdown-style bold replacement */}
                  {msg.text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      return <strong key={i} className="text-amber-400 font-black text-lg">{part.slice(2, -2)}</strong>;
                    }
                    return part;
                  })}
                </div>
                
                {msg.isFinal && (
                  <button 
                    onClick={() => handleShare(msg.isFinal)}
                    className="mt-2 flex items-center gap-1.5 bg-[#25D366] text-white px-3 py-1.5 rounded-full text-xs font-bold hover:scale-105 transition-transform"
                  >
                    <span>💬</span> Share to WhatsApp
                  </button>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="p-3 bg-slate-900 border-t border-slate-800">
            {chatState === 0 && (
              <div className="flex gap-2 flex-wrap mb-2">
                {['Dragon', 'Snake', 'Horse', 'Sheep'].map(z => (
                  <button key={z} onClick={() => handleSend(z)} className="px-2 py-1 bg-slate-800 text-amber-500/80 rounded border border-slate-700 text-[10px] hover:bg-slate-700">{z}</button>
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
                className="flex-1 bg-slate-950 border border-slate-700 text-white text-sm rounded-full px-4 py-2 focus:outline-none focus:border-amber-500 transition-colors"
              />
              <button 
                type="submit" 
                disabled={!input.trim()}
                className="bg-amber-500 text-slate-900 rounded-full w-9 h-9 flex items-center justify-center font-black disabled:opacity-50 disabled:cursor-not-allowed"
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
          className="group relative flex items-center justify-center w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.5)] hover:scale-110 transition-transform duration-300 border-2 border-amber-200"
        >
          <span className="text-3xl filter drop-shadow-md">👲</span>
          
          {/* Notification Badge */}
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border border-white text-[8px] text-white font-black justify-center items-center">1</span>
          </span>
          
          {/* Tooltip */}
          <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 w-max px-3 py-1.5 bg-slate-900 text-amber-400 text-xs font-bold rounded-lg border border-amber-500/30 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
            Ask Uncle Cai Shen for Lucky Number!
          </span>
        </button>
      )}
    </div>
  );
}

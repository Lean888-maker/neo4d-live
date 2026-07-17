export const metadata = {
  title: 'BREAKING: KL Man Wins RM50,000 Using Leaked Numbers',
  description: 'A new underground Telegram group is leaking highly accurate Tua Pek Kong numbers.',
};

export default function PromoPreLander() {
  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
      {/* Fake News Header */}
      <header className="bg-red-700 text-white p-4 shadow-md sticky top-0 z-50">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-black tracking-tighter">DAILY NEWS MY</div>
          <div className="text-sm font-bold opacity-80 uppercase">Sponsored Content</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto bg-white min-h-screen p-6 shadow-lg">
        <h1 className="text-3xl md:text-5xl font-black leading-tight mb-4 text-gray-900">
          Kuala Lumpur Man Wins RM50,000 Using <span className="text-red-600">Leaked 4D Numbers</span> Found on Telegram
        </h1>
        
        <div className="flex items-center text-sm text-gray-500 mb-6 border-b pb-4">
          <span>By <b>Investigative Team</b></span>
          <span className="mx-2">•</span>
          <span>Published Today</span>
        </div>

        {/* Fake Article Image / Hype Image */}
        <div className="w-full bg-yellow-100 border-4 border-yellow-400 rounded-xl p-8 text-center mb-8 shadow-inner">
          <h2 className="text-2xl font-bold text-red-700 mb-2">⚠️ URGENT UPDATE ⚠️</h2>
          <p className="text-lg text-gray-800 font-semibold">
            The private Telegram group is currently accepting new members for the next <b>24 hours</b> only!
          </p>
        </div>

        <article className="prose lg:prose-xl max-w-none mb-10 text-gray-700 leading-relaxed">
          <p>
            An ordinary man from Kuala Lumpur recently shocked his friends and family when he took home a massive RM50,000 jackpot. When asked about his secret, he revealed he had joined a private underground Telegram channel known as <b>NEO4D VIP</b>.
          </p>
          <p>
            This exclusive channel allegedly uses advanced algorithms and "Tua Pek Kong" dream analysis to leak highly accurate 4D prediction numbers for Magnum, Sports Toto, and Da Ma Cai. 
          </p>
          <p>
            <b>"I just joined the channel, spun their welcome wheel, and got RM10 in free credit,"</b> he said. <b>"Then I used their leaked numbers and hit the 1st prize. It was that easy."</b>
          </p>
        </article>

        {/* Massive Call To Action */}
        <div className="bg-gray-900 rounded-2xl p-8 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-red-500"></div>
          <h3 className="text-2xl font-black text-white mb-4">Want To Get Tomorrow's Leaked Numbers?</h3>
          <p className="text-gray-300 mb-8">Join the VIP Telegram channel and spin the wheel for RM10 Free Credit before the group goes private!</p>
          
          <a 
            href="https://t.me/neo4d_bot/spinwheel" 
            className="inline-block w-full md:w-auto bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-black text-2xl py-5 px-10 rounded-full shadow-[0_0_20px_rgba(34,197,94,0.6)] transform transition hover:scale-105 active:scale-95 animate-pulse"
          >
            👉 JOIN VIP TELEGRAM & SPIN
          </a>
          
          <p className="text-xs text-gray-500 mt-6">*100% Free to join. Must be 18+ to play.</p>
        </div>
      </main>
    </div>
  );
}

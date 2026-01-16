
import React, { useState } from 'react';

interface LobbyProps {
  onStart: (name: string) => void;
}

const Lobby: React.FC<LobbyProps> = ({ onStart }) => {
  const [name, setName] = useState('');
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-md w-full bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-10 rounded-3xl shadow-2xl relative">
      {copied && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs font-bold py-1 px-3 rounded-full animate-bounce shadow-lg">
          Link Copied!
        </div>
      )}
      
      <div className="text-center mb-10">
        <h1 className="text-5xl font-orbitron font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600 mb-2">
          TETROBATTLE
        </h1>
        <p className="text-slate-400 font-medium">Massive Multiplayer AI-Powered Tetris</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
            Pilot Callsign
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name..."
            className="w-full bg-slate-800/50 border-2 border-slate-700 focus:border-blue-500 outline-none rounded-xl px-4 py-3 text-lg transition-all text-white placeholder-slate-600"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => onStart(name || 'Player 1')}
            className="flex-1 bg-gradient-to-br from-blue-500 to-indigo-700 hover:from-blue-400 hover:to-indigo-600 text-white py-4 rounded-xl font-bold text-xl shadow-lg shadow-blue-900/20 transform transition-all hover:-translate-y-1 active:scale-95"
          >
            JOIN BATTLE
          </button>
          
          <button
            onClick={handleShare}
            title="Invite Friends"
            className="bg-slate-800 hover:bg-slate-700 text-white p-4 rounded-xl border border-slate-700 transition-all flex items-center justify-center group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </div>

        <div className="pt-4 flex items-center justify-between text-xs text-slate-500 uppercase tracking-widest font-bold">
          <span>Server: Global-01</span>
          <span>99+ Players Online</span>
        </div>
      </div>

      <div className="mt-10 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
        <h3 className="text-blue-400 text-xs font-bold uppercase mb-2">Pro Tip</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Share the link with friends to join the same global shard. AI commentary scales with your APM!
        </p>
      </div>
    </div>
  );
};

export default Lobby;

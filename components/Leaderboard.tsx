
import React from 'react';
import { Player } from '../types';

interface LeaderboardProps {
  players: Player[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ players }) => {
  return (
    <div className="space-y-3">
      <div className="flex justify-between px-4 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
        <span>Rank</span>
        <span>Player</span>
        <span>Score</span>
      </div>
      <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
        {players.map((p, i) => (
          <div 
            key={p.id} 
            className={`
              flex justify-between items-center p-3 rounded-xl border
              ${i === 0 ? 'bg-amber-500/10 border-amber-500/50' : 'bg-slate-800/50 border-slate-700/50'}
              ${p.id === 'me' ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-900' : ''}
            `}
          >
            <div className="flex items-center gap-4">
              <span className={`text-sm font-bold w-6 ${i === 0 ? 'text-amber-500' : 'text-slate-400'}`}>
                #{i + 1}
              </span>
              <span className="font-semibold text-slate-200">
                {p.name} {p.id === 'me' && '(You)'}
              </span>
            </div>
            <span className="font-orbitron text-sm text-blue-400">
              {p.score.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;

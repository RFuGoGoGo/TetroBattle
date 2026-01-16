
import React, { useMemo } from 'react';
import { Player } from '../types';
import { COLS, ROWS } from '../constants';

interface OpponentGridProps {
  player: Player;
}

const OpponentGrid: React.FC<OpponentGridProps> = ({ player }) => {
  // Generate a mock grid state for visual variety
  const grid = useMemo(() => {
    return Array.from({ length: 15 }, () => 
      Array.from({ length: 8 }, () => Math.random() > 0.85 ? 'G' : null)
    );
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="relative bg-slate-800/50 p-1 rounded border border-slate-700">
        {!player.isAlive && (
          <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center z-10 rounded">
             <span className="text-[8px] font-bold text-red-500">KO</span>
          </div>
        )}
        <div 
          className="grid gap-[1px]" 
          style={{ gridTemplateColumns: 'repeat(8, 4px)' }}
        >
          {grid.map((row, y) => row.map((cell, x) => (
            <div 
              key={`${y}-${x}`} 
              className={`w-1 h-1 rounded-[1px] ${cell ? 'bg-slate-500' : 'bg-slate-900'}`} 
            />
          )))}
        </div>
      </div>
      <div className="mt-1 text-[8px] font-bold text-slate-500 truncate w-full text-center">
        {player.name}
      </div>
    </div>
  );
};

export default OpponentGrid;

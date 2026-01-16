
import React, { useState, useEffect, useCallback } from 'react';
import { GameStatus, Player } from './types';
import Lobby from './components/Lobby';
import TetrisGame from './components/TetrisGame';
import Leaderboard from './components/Leaderboard';

const App: React.FC = () => {
  const [status, setStatus] = useState<GameStatus>(GameStatus.LOBBY);
  const [playerName, setPlayerName] = useState<string>('');
  const [players, setPlayers] = useState<Player[]>([]);

  // Simulate Multiplayer Lobby
  useEffect(() => {
    if (status === GameStatus.LOBBY) {
      const mockNames = ['TetrisPro_99', 'BlockMaster', 'QuickFinger', 'NeonRunner', 'ZenStacker'];
      const mockPlayers: Player[] = mockNames.map((name, i) => ({
        id: `bot${i}`,
        name,
        score: 0,
        isAlive: true,
        gridPreview: []
      }));
      setPlayers(mockPlayers);
    }
  }, [status]);

  const handleStartGame = (name: string) => {
    setPlayerName(name);
    setStatus(GameStatus.STARTING);
    setTimeout(() => {
      setStatus(GameStatus.PLAYING);
    }, 3000);
  };

  const handleGameOver = useCallback((finalScore: number) => {
    const currentPlayer: Player = { 
      id: 'me', 
      name: playerName || 'You', 
      score: finalScore, 
      isAlive: false, 
      gridPreview: [] 
    };
    
    setPlayers(prev => {
      const updated = prev.map(p => ({ ...p, score: Math.floor(Math.random() * 5000) }));
      return [...updated, currentPlayer].sort((a, b) => b.score - a.score);
    });
    
    setStatus(GameStatus.GAMEOVER);
  }, [playerName]);

  const handleQuit = () => {
    if (window.confirm('Are you sure you want to exit the current battle?')) {
      setStatus(GameStatus.LOBBY);
    }
  };

  const handlePlayAgain = () => {
    setStatus(GameStatus.LOBBY);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      {status === GameStatus.LOBBY && (
        <Lobby onStart={handleStartGame} />
      )}

      {status === GameStatus.STARTING && (
        <div className="text-center animate-pulse">
          <h1 className="text-7xl font-orbitron font-bold text-blue-500 mb-4">READY?</h1>
          <p className="text-2xl text-slate-400">Synchronizing with 99 other players...</p>
        </div>
      )}

      {status === GameStatus.PLAYING && (
        <TetrisGame 
          playerName={playerName} 
          opponents={players}
          onGameOver={handleGameOver}
          onQuit={handleQuit}
        />
      )}

      {status === GameStatus.GAMEOVER && (
        <div className="max-w-md w-full bg-slate-900/80 backdrop-blur-md p-8 rounded-2xl border border-blue-500 shadow-2xl">
          <h2 className="text-4xl font-orbitron font-bold text-red-500 text-center mb-6">GAME OVER</h2>
          <Leaderboard players={players} />
          <button
            onClick={handlePlayAgain}
            className="w-full mt-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all transform hover:scale-105 active:scale-95"
          >
            RETURN TO LOBBY
          </button>
        </div>
      )}
    </div>
  );
};

export default App;

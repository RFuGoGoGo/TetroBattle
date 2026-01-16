
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  createEmptyGrid, 
  getRandomPieceType, 
  createPiece, 
  isValidMove, 
  rotatePiece, 
  mergePiece, 
  clearLines, 
  getGhostPosition 
} from '../services/tetrisEngine';
import { Piece, PieceType, GameState, Player } from '../types';
import { COLS, ROWS, COLORS, PIECES } from '../constants';
import OpponentGrid from './OpponentGrid';
import { getGameCommentary } from '../services/geminiService';

interface TetrisGameProps {
  playerName: string;
  opponents: Player[];
  onGameOver: (score: number) => void;
  onQuit: () => void;
}

const TetrisGame: React.FC<TetrisGameProps> = ({ playerName, opponents, onGameOver, onQuit }) => {
  const [grid, setGrid] = useState(createEmptyGrid());
  const [activePiece, setActivePiece] = useState<Piece>(createPiece(getRandomPieceType()));
  const [nextPiece, setNextPiece] = useState<PieceType>(getRandomPieceType());
  const [holdPiece, setHoldPiece] = useState<PieceType | null>(null);
  const [canHold, setCanHold] = useState(true);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [commentary, setCommentary] = useState("Battle starting...");

  const drop = useCallback(() => {
    setActivePiece(prev => {
      const nextPos = { x: prev.pos.x, y: prev.pos.y + 1 };
      if (isValidMove(grid, prev, nextPos)) {
        return { ...prev, pos: nextPos };
      } else {
        const newGrid = mergePiece(grid, prev);
        const { newGrid: clearedGrid, linesCleared } = clearLines(newGrid);
        
        if (linesCleared > 0) {
          const points = [0, 100, 300, 500, 800][linesCleared] * level;
          setScore(s => s + points);
          setLines(l => {
            const newLines = l + linesCleared;
            if (Math.floor(newLines / 10) > Math.floor(l / 10)) {
              setLevel(prevLevel => prevLevel + 1);
            }
            return newLines;
          });
          
          if (linesCleared >= 2) {
             triggerCommentary(`Cleared ${linesCleared} lines!`);
          }
        }

        if (prev.pos.y <= 0) {
          onGameOver(score);
          return prev;
        }

        const next = createPiece(nextPiece);
        setNextPiece(getRandomPieceType());
        setCanHold(true);
        setGrid(clearedGrid);
        return next;
      }
    });
  }, [grid, level, nextPiece, onGameOver, score]);

  const triggerCommentary = async (event: string) => {
    const text = await getGameCommentary(score, lines, level, event);
    setCommentary(text);
  };

  const hardDrop = () => {
    const ghostPos = getGhostPosition(grid, activePiece);
    const lockedPiece = { ...activePiece, pos: ghostPos };
    const newGrid = mergePiece(grid, lockedPiece);
    const { newGrid: clearedGrid, linesCleared } = clearLines(newGrid);
    
    const points = [0, 100, 300, 500, 800][linesCleared] * level + (ghostPos.y - activePiece.pos.y) * 2;
    setScore(s => s + points);
    setLines(l => l + linesCleared);
    
    if (lockedPiece.pos.y <= 0 && linesCleared === 0) {
      onGameOver(score);
      return;
    }

    setGrid(clearedGrid);
    setActivePiece(createPiece(nextPiece));
    setNextPiece(getRandomPieceType());
    setCanHold(true);
  };

  const handleHold = () => {
    if (!canHold) return;
    if (holdPiece === null) {
      setHoldPiece(activePiece.type);
      setActivePiece(createPiece(nextPiece));
      setNextPiece(getRandomPieceType());
    } else {
      const currentType = activePiece.type;
      setActivePiece(createPiece(holdPiece));
      setHoldPiece(currentType);
    }
    setCanHold(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          setActivePiece(prev => {
            const nextPos = { x: prev.pos.x - 1, y: prev.pos.y };
            return isValidMove(grid, prev, nextPos) ? { ...prev, pos: nextPos } : prev;
          });
          break;
        case 'ArrowRight':
          setActivePiece(prev => {
            const nextPos = { x: prev.pos.x + 1, y: prev.pos.y };
            return isValidMove(grid, prev, nextPos) ? { ...prev, pos: nextPos } : prev;
          });
          break;
        case 'ArrowDown':
          drop();
          break;
        case 'ArrowUp':
          setActivePiece(prev => {
            const nextRot = rotatePiece(prev);
            return isValidMove(grid, prev, prev.pos, nextRot) ? { ...prev, rotation: nextRot } : prev;
          });
          break;
        case ' ':
          hardDrop();
          break;
        case 'c':
        case 'C':
          handleHold();
          break;
        case 'Escape':
          onQuit();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [grid, drop, hardDrop, handleHold, onQuit]);

  useEffect(() => {
    const dropInterval = Math.max(100, 1000 - (level - 1) * 100);
    const interval = setInterval(drop, dropInterval);
    return () => clearInterval(interval);
  }, [drop, level]);

  const ghostPos = getGhostPosition(grid, activePiece);

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start justify-center max-w-6xl w-full h-full p-2">
      <div className="hidden lg:flex flex-col gap-6 w-48">
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-700">
          <h3 className="text-slate-500 text-xs font-bold uppercase mb-4 tracking-widest">Hold</h3>
          <div className="w-20 h-20 mx-auto flex items-center justify-center bg-slate-800/50 rounded-lg">
            {holdPiece && (
               <div className="grid grid-cols-4 gap-1 p-2">
                {PIECES[holdPiece][0].map((row, y) => row.map((cell, x) => (
                  <div key={`${y}-${x}`} className={`w-3 h-3 ${cell ? COLORS[holdPiece] : ''}`} />
                )))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-700 space-y-4">
          <div>
            <div className="text-slate-500 text-xs font-bold uppercase tracking-widest">Score</div>
            <div className="text-2xl font-orbitron text-white">{score.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-slate-500 text-xs font-bold uppercase tracking-widest">Level</div>
            <div className="text-2xl font-orbitron text-purple-400">{level}</div>
          </div>
        </div>

        <button 
          onClick={onQuit}
          className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all"
        >
          Exit Battle
        </button>
      </div>

      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-b from-blue-500 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition"></div>
        <div className="relative bg-slate-950 p-1 border-2 border-slate-700/50 rounded-lg shadow-2xl">
          <div 
            className="grid gap-[1px] bg-slate-900/50" 
            style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`, width: '320px', height: '640px' }}
          >
            {grid.map((row, y) => row.map((cell, x) => {
              let isGhost = false;
              if (!cell) {
                const shape = PIECES[activePiece.type][activePiece.rotation];
                const gy = y - ghostPos.y;
                const gx = x - ghostPos.x;
                if (gy >= 0 && gy < shape.length && gx >= 0 && gx < shape[0].length && shape[gy][gx]) {
                  isGhost = true;
                }
              }

              let isActive = false;
              let activeType: PieceType | null = null;
              const shape = PIECES[activePiece.type][activePiece.rotation];
              const ay = y - activePiece.pos.y;
              const ax = x - activePiece.pos.x;
              if (ay >= 0 && ay < shape.length && ax >= 0 && ax < shape[0].length && shape[ay][ax]) {
                isActive = true;
                activeType = activePiece.type;
              }

              return (
                <div 
                  key={`${y}-${x}`} 
                  className={`
                    w-full h-full rounded-sm transition-all duration-75
                    ${cell ? COLORS[cell] : ''} 
                    ${isActive ? COLORS[activeType!] : ''} 
                    ${isGhost ? 'border-2 border-slate-700' : ''}
                    ${!cell && !isActive && !isGhost ? 'bg-slate-950/20' : ''}
                  `}
                />
              );
            }))}
          </div>
        </div>
        
        <div className="absolute -bottom-16 left-0 right-0 text-center animate-bounce">
          <div className="inline-block bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">
            AI: {commentary}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 flex-1 max-w-sm">
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-700">
          <h3 className="text-slate-500 text-xs font-bold uppercase mb-4 tracking-widest">Next</h3>
          <div className="w-20 h-20 mx-auto flex items-center justify-center bg-slate-800/50 rounded-lg">
            <div className="grid grid-cols-4 gap-1 p-2">
              {PIECES[nextPiece][0].map((row, y) => row.map((cell, x) => (
                <div key={`${y}-${x}`} className={`w-3 h-3 ${cell ? COLORS[nextPiece] : ''}`} />
              )))}
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-700">
          <h3 className="text-slate-500 text-xs font-bold uppercase mb-4 tracking-widest">Battle Status</h3>
          <div className="grid grid-cols-3 gap-3">
            {opponents.map(op => (
              <OpponentGrid key={op.id} player={op} />
            ))}
          </div>
        </div>
        
        {/* Mobile-only exit button */}
        <button 
          onClick={onQuit}
          className="lg:hidden bg-red-500 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest"
        >
          Quit Game
        </button>
      </div>
    </div>
  );
};

export default TetrisGame;

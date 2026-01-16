
export type PieceType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';

export interface Position {
  x: number;
  y: number;
}

export interface Piece {
  type: PieceType;
  pos: Position;
  rotation: number;
  shape: number[][];
}

export interface GameState {
  grid: (PieceType | 'G' | null)[][];
  score: number;
  lines: number;
  level: number;
  gameOver: boolean;
  nextPiece: PieceType;
  holdPiece: PieceType | null;
  canHold: boolean;
}

export interface Player {
  id: string;
  name: string;
  score: number;
  isAlive: boolean;
  gridPreview: (PieceType | 'G' | null)[][];
}

export enum GameStatus {
  LOBBY = 'LOBBY',
  STARTING = 'STARTING',
  PLAYING = 'PLAYING',
  GAMEOVER = 'GAMEOVER'
}

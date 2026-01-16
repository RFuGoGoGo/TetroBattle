
import { COLS, ROWS, PIECES, PIECE_TYPES } from '../constants';
import { Piece, PieceType, Position } from '../types';

export const createEmptyGrid = (): (PieceType | 'G' | null)[][] => 
  Array.from({ length: ROWS }, () => Array(COLS).fill(null));

export const getRandomPieceType = (): PieceType => 
  PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)];

export const createPiece = (type: PieceType): Piece => ({
  type,
  pos: { x: Math.floor(COLS / 2) - 1, y: 0 },
  rotation: 0,
  shape: PIECES[type][0]
});

export const isValidMove = (grid: (PieceType | 'G' | null)[][], piece: Piece, nextPos: Position, nextRotation?: number): boolean => {
  const rotation = nextRotation !== undefined ? nextRotation : piece.rotation;
  const shape = PIECES[piece.type][rotation];
  
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x] !== 0) {
        const newX = nextPos.x + x;
        const newY = nextPos.y + y;
        
        if (
          newX < 0 || 
          newX >= COLS || 
          newY >= ROWS || 
          (newY >= 0 && grid[newY][newX] !== null)
        ) {
          return false;
        }
      }
    }
  }
  return true;
};

export const rotatePiece = (piece: Piece): number => (piece.rotation + 1) % 4;

export const mergePiece = (grid: (PieceType | 'G' | null)[][], piece: Piece): (PieceType | 'G' | null)[][] => {
  const newGrid = grid.map(row => [...row]);
  const shape = PIECES[piece.type][piece.rotation];
  
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x] !== 0) {
        const gridY = piece.pos.y + y;
        const gridX = piece.pos.x + x;
        if (gridY >= 0) {
          newGrid[gridY][gridX] = piece.type;
        }
      }
    }
  }
  return newGrid;
};

export const clearLines = (grid: (PieceType | 'G' | null)[][]): { newGrid: (PieceType | 'G' | null)[][], linesCleared: number } => {
  let linesCleared = 0;
  const newGrid = grid.filter(row => {
    const isFull = row.every(cell => cell !== null);
    if (isFull) linesCleared++;
    return !isFull;
  });
  
  while (newGrid.length < ROWS) {
    newGrid.unshift(Array(COLS).fill(null));
  }
  
  return { newGrid, linesCleared };
};

export const getGhostPosition = (grid: (PieceType | 'G' | null)[][], piece: Piece): Position => {
  let ghostY = piece.pos.y;
  while (isValidMove(grid, piece, { x: piece.pos.x, y: ghostY + 1 })) {
    ghostY++;
  }
  return { x: piece.pos.x, y: ghostY };
};

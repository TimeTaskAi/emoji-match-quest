export type EmojiType = '🍓' | '🍇' | '🍊' | '🍋' | '🍉' | '🍬' | '🍭';

export type SpecialType = 'none' | 'striped_h' | 'striped_v' | 'bomb' | 'rainbow';

export interface Tile {
  id: string;
  type: EmojiType;
  special: SpecialType;
  row: number;
  col: number;
  isMatched?: boolean;
  isNew?: boolean;
}

export type BoardGrid = (Tile | null)[][];

export interface Position {
  row: number;
  col: number;
}

export interface MatchResult {
  tiles: Tile[];
  type: 'three' | 'four' | 'five' | 't_shape' | 'l_shape';
  emoji: EmojiType;
}

export interface LevelConfig {
  level: number;
  targetScore: number;
  maxMoves: number;
  availableEmojis: EmojiType[];
  targetItems?: { emoji: EmojiType; count: number }[];
  starScores: [number, number, number];
}

export interface GameState {
  score: number;
  movesRemaining: number;
  level: number;
  stars: number;
  isGameOver: boolean;
  isWon: boolean;
  isMoving: boolean;
  comboCount: number;
  targetsMet: boolean;
  targetItems: { emoji: EmojiType; count: number; current: number }[];
}

export interface Booster {
  id: string;
  name: string;
  icon: string;
  count: number;
  description: string;
}

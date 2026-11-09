export interface PlayerSaveData {
  highScore: number;
  highestLevel: number;
  coins: number;
  gems: number;
  starsMap: Record<number, number>; // level -> stars
  boosters: {
    hammer: number;
    bomb: number;
    rainbow: number;
    extraMoves: number;
  };
  settings: {
    soundEnabled: boolean;
    musicEnabled: boolean;
    hapticEnabled: boolean;
  };
}

const STORAGE_KEY = 'emoji_match_player_data_v1';

const DEFAULT_SAVE: PlayerSaveData = {
  highScore: 0,
  highestLevel: 1,
  coins: 500,
  gems: 10,
  starsMap: {},
  boosters: {
    hammer: 3,
    bomb: 2,
    rainbow: 1,
    extraMoves: 2,
  },
  settings: {
    soundEnabled: true,
    musicEnabled: true,
    hapticEnabled: true,
  },
};

export class GameRepository {
  public static load(): PlayerSaveData {
    if (typeof window === 'undefined') return DEFAULT_SAVE;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return DEFAULT_SAVE;
      return { ...DEFAULT_SAVE, ...JSON.parse(data) };
    } catch {
      return DEFAULT_SAVE;
    }
  }

  public static save(data: PlayerSaveData): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      console.error('Failed to save game data:', err);
    }
  }
}

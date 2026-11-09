import { EmojiType, LevelConfig } from './types';

export const ALL_EMOJIS: EmojiType[] = ['🍓', '🍇', '🍊', '🍋', '🍉', '🍬', '🍭'];

export const LEVELS: LevelConfig[] = [
  {
    level: 1,
    targetScore: 1200,
    maxMoves: 22,
    availableEmojis: ['🍓', '🍇', '🍊', '🍋'],
    starScores: [1200, 2000, 3000],
    targetItems: [{ emoji: '🍓', count: 12 }]
  },
  {
    level: 2,
    targetScore: 2400,
    maxMoves: 25,
    availableEmojis: ['🍓', '🍇', '🍊', '🍋', '🍉'],
    starScores: [2400, 4000, 5500],
    targetItems: [
      { emoji: '🍇', count: 15 },
      { emoji: '🍉', count: 10 }
    ]
  },
  {
    level: 3,
    targetScore: 4000,
    maxMoves: 28,
    availableEmojis: ['🍓', '🍇', '🍊', '🍋', '🍉', '🍬'],
    starScores: [4000, 6500, 9000],
    targetItems: [
      { emoji: '🍬', count: 15 },
      { emoji: '🍊', count: 15 }
    ]
  },
  {
    level: 4,
    targetScore: 6000,
    maxMoves: 30,
    availableEmojis: ALL_EMOJIS,
    starScores: [6000, 9500, 13000],
    targetItems: [
      { emoji: '🍭', count: 18 },
      { emoji: '🍬', count: 18 }
    ]
  },
  {
    level: 5,
    targetScore: 8500,
    maxMoves: 32,
    availableEmojis: ALL_EMOJIS,
    starScores: [8500, 13000, 18000],
    targetItems: [
      { emoji: '🍓', count: 20 },
      { emoji: '🍇', count: 20 },
      { emoji: '🍭', count: 15 }
    ]
  }
];

export function getLevelConfig(levelNumber: number): LevelConfig {
  const cfg = LEVELS.find((l) => l.level === levelNumber);
  if (cfg) return cfg;

  const baseLevel = (levelNumber - 1) % LEVELS.length;
  const multiplier = Math.floor((levelNumber - 1) / LEVELS.length) + 1;
  const template = LEVELS[baseLevel];

  return {
    level: levelNumber,
    targetScore: template.targetScore * multiplier,
    maxMoves: Math.max(18, template.maxMoves - Math.floor(multiplier / 2)),
    availableEmojis: template.availableEmojis,
    starScores: [
      template.starScores[0] * multiplier,
      template.starScores[1] * multiplier,
      template.starScores[2] * multiplier
    ],
    targetItems: template.targetItems?.map(ti => ({
      emoji: ti.emoji,
      count: ti.count + (multiplier * 2)
    }))
  };
}

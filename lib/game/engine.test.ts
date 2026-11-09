import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generateInitialGrid,
  findMatches,
  hasPossibleMoves,
  resolveMatches,
  resolveSpecialSwap,
  applyGravityAndRefill,
  createTile,
  findPossibleMove,
} from './engine';
import { Grid } from './types';

test('generateInitialGrid creates an 8x8 grid without matches and with valid moves', () => {
  const grid = generateInitialGrid();

  // Grid dimensions
  assert.equal(grid.length, 8);
  assert.equal(grid[0].length, 8);

  // All cells non-null initially
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      assert.ok(grid[r][c] !== null, `Tile at ${r},${c} should not be null`);
      assert.ok(grid[r][c]?.type, `Tile at ${r},${c} should have an emoji type`);
    }
  }

  // Initial grid should not have any starting matches
  const initialMatches = findMatches(grid);
  assert.equal(initialMatches.length, 0);

  // Initial grid must have at least one valid swap move
  assert.equal(hasPossibleMoves(grid), true);
});

test('findMatches identifies horizontal 3-matches, 4-matches, and 5-matches', () => {
  const grid: Grid = Array.from({ length: 8 }, () =>
    Array.from({ length: 8 }, () => createTile('🍬'))
  );
  // Break all with alternating emojis
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      grid[r][c] = createTile((r + c) % 2 === 0 ? '🍇' : '🍓');
    }
  }

  // Create explicit horizontal 4-match on row 2
  grid[2][1] = createTile('🍭');
  grid[2][2] = createTile('🍭');
  grid[2][3] = createTile('🍭');
  grid[2][4] = createTile('🍭');

  const matches = findMatches(grid);
  const lollipopMatch = matches.find(m => m.type === '🍭');
  assert.ok(lollipopMatch, 'Should find lollipop match');
  assert.equal(lollipopMatch.length, 4);
  assert.equal(lollipopMatch.orientation, 'horizontal');
});

test('resolveMatches generates Bomb on 4-match and grants combo points', () => {
  const grid: Grid = Array.from({ length: 8 }, () =>
    Array.from({ length: 8 }, () => createTile('🍬'))
  );
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      grid[r][c] = createTile((r + c) % 2 === 0 ? '🍇' : '🍓');
    }
  }

  // 4-match in a row
  grid[3][2] = createTile('🍊');
  grid[3][3] = createTile('🍊');
  grid[3][4] = createTile('🍊');
  grid[3][5] = createTile('🍊');

  const resolution = resolveMatches(grid, { row: 3, col: 3 }, 2);
  assert.ok(resolution, 'Should resolve matches');
  assert.equal(resolution.poppedPositions.length, 4);
  assert.equal(resolution.poppedCounts['🍊'], 4);
  // Combo 2 multiplier: 4 * 50 * 2 = 400 pts
  assert.equal(resolution.scoreGained, 400);

  // Should create a bomb at { row: 3, col: 3 }
  const bombCreated = resolution.newSpecialsCreated.find(s => s.special === 'bomb');
  assert.ok(bombCreated, 'Bomb should be created for 4-match');
  assert.equal(bombCreated.special, 'bomb');
  assert.equal(resolution.grid[3][3]?.special, 'bomb');
});

test('resolveSpecialSwap with Star + Emoji clears all of that emoji from the board', () => {
  const grid: Grid = Array.from({ length: 8 }, () =>
    Array.from({ length: 8 }, () => createTile('🍬'))
  );
  grid[4][4] = createTile('🍭', 'star');
  grid[4][5] = createTile('🧁', 'none');

  const resolution = resolveSpecialSwap(grid, 4, 4, 4, 5, 1);
  assert.ok(resolution.poppedPositions.length > 0);
  assert.equal(resolution.starsTriggered, 1);
  // All 🧁 cupcake tiles should be cleared
  assert.equal(resolution.grid[4][5], null);
});

test('applyGravityAndRefill drops floating tiles and fills empty slots', () => {
  const grid: Grid = Array.from({ length: 8 }, () =>
    Array.from({ length: 8 }, () => createTile('🍬'))
  );
  // Empty row 7
  for (let c = 0; c < 8; c++) {
    grid[7][c] = null;
  }
  const filled = applyGravityAndRefill(grid);
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      assert.ok(filled[r][c] !== null, `Tile at ${r},${c} must not be null`);
    }
  }
});

test('findPossibleMove finds an available matching swap on the board', () => {
  const grid = generateInitialGrid();
  const move = findPossibleMove(grid);
  assert.ok(move !== null, 'Should find at least one valid move on initial grid');
  assert.equal(typeof move.r1, 'number');
  assert.equal(typeof move.c1, 'number');
  assert.equal(typeof move.r2, 'number');
  assert.equal(typeof move.c2, 'number');
});

// constants.js
export const TYPE_LETTER = {
  cavalry: 'K',
  archer: 'B',
  guard: 'G',
  general: 'H',
  emperor: 'C',
  infantry: 'P',
};

export const RANK_NAMES = [
  "bawół", "czapla", "feniks", "małpa", "pies",
  "smok", "tygrys", "wąż", "żółw"
];

export const DIRS_8 = [
  { dx: 0, dy: -1 },  // Up
  { dx: 1, dy: -1 },  // Up-Right
  { dx: 1, dy: 0 },   // Right
  { dx: 1, dy: 1 },   // Down-Right
  { dx: 0, dy: 1 },   // Down
  { dx: -1, dy: 1 },  // Down-Left
  { dx: -1, dy: 0 },  // Left
  { dx: -1, dy: -1 }, // Up-Left
];

export const MAX_ARCHER_RANGE = 3;

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
  { dx: 1, dy: 0 }, { dx: -1, dy: 0 }, { dx: 0, dy: 1 }, { dx: 0, dy: -1 },
  { dx: 1, dy: 1 }, { dx: 1, dy: -1 }, { dx: -1, dy: 1 }, { dx: -1, dy: -1 }
];

export const MAX_ARCHER_RANGE = 3;
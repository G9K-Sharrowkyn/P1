// initialBoard.js
// ───────────────
// Tworzy startową pozycję i dodaje każdej figurze znacznik `lastMoved` = -1
// (potrzebny łucznikom do liczenia tur przygotowania).

export const createInitialBoard = () => {
  const emptyRow = Array(9).fill(null);
  const board     = Array(9).fill().map(() => [...emptyRow]);

  const put = (x, y, type, side, extra = {}) =>
    (board[y][x] = { type, team: side, lastMoved: -1, ...extra });

  const setup = (side) => {
    const row   = side === "white" ? 0 : 8;
    const front = side === "white" ? 2 : 6;

    put(4, row, "emperor", side, { hits: 0 });
    put(3, row, "general", side);
    put(5, row, "general", side);
    put(2, row, "guard",   side);
    put(6, row, "guard",   side);
    put(1, row, "archer",  side);
    put(7, row, "archer",  side);
    put(0, row, "cavalry", side);
    put(8, row, "cavalry", side);

    for (let i = 0; i < 9; i++) put(i, front, "infantry", side);
  };

  setup("white");
  setup("black");
  return board;
};

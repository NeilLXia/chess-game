export const numberToPiece: { [key: string]: string } = {
  "-1": "",
  0: "K",
  1: "P",
  2: "N",
  3: "B",
  4: "R",
  5: "Q",
  10: "K",
  11: "P",
  12: "N",
  13: "B",
  14: "R",
  15: "Q",
};

export const pieceToNumber: { [key: string]: { [key: string]: number } } = {
  K: { white: 0, black: 10 },
  P: { white: 1, black: 11 },
  N: { white: 2, black: 12 },
  B: { white: 3, black: 13 },
  R: { white: 4, black: 14 },
  Q: { white: 5, black: 15 },
};

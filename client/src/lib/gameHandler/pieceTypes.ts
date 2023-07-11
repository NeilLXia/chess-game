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

export const numberToUnicode: { [key: string]: string } = {
  "-1": "",
  0: "\u265A",
  1: "\u265F",
  2: "\u265E",
  3: "\u265D",
  4: "\u265C",
  5: "\u265B",
  10: "\u265A",
  11: "\u265F",
  12: "\u265E",
  13: "\u265D",
  14: "\u265C",
  15: "\u265B",
};

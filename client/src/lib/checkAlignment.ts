export const checkDiagonalAlignment = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => {
  return Math.abs(y1 - y2) === Math.abs(x1 - x2);
};

export const checkCardinalAlignment = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => {
  return Math.abs(y1 - y2) === 0 || Math.abs(x1 - x2) === 0;
};

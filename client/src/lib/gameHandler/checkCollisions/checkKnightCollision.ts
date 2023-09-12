// returns true if there's a piece of type target piece/color an L-shaped distance from the given location
const checkKnightCollision = (
  boardState: Array<number>,
  locationIndex: number,
  targetPiece: Array<number>
) => {
  const current = { x: locationIndex % 8, y: Math.floor(locationIndex / 8) };
  const moves = [
    { x: 1, y: 2 },
    { x: 2, y: 1 },
    { x: -1, y: 2 },
    { x: -2, y: 1 },
    { x: 1, y: -2 },
    { x: 2, y: -1 },
    { x: -1, y: -2 },
    { x: -2, y: -1 },
  ];

  const validMoves = new Set();
  const collisions = new Set();

  for (const move of moves) {
    const checkLoc = { x: current.x + move.x, y: current.y + move.y };
    if (
      checkLoc.x >= 0 &&
      checkLoc.x < 8 &&
      checkLoc.y >= 0 &&
      checkLoc.y < 8
    ) {
      const checkPiece = boardState[checkLoc.x + 8 * checkLoc.y];

      // if the checked piece is a target piece OR if the check piece is a piece and target piece was left blank
      if (checkPiece < 0) {
        validMoves.add(checkLoc.x + 8 * checkLoc.y);
        continue;
      }
      if (targetPiece.includes(checkPiece)) {
        collisions.add(checkLoc.x + 8 * checkLoc.y);
      }
    }
  }

  return { validMoves, collisions };
};

export default checkKnightCollision;

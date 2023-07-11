// returns true if there's a piece of type target piece/color an L-shaped distance from the given location
const checkAdjacentCollision = (
  boardState: Array<number>,
  locationIndex: number,
  targetPiece: Array<number>
) => {
  const current = { x: locationIndex % 8, y: Math.floor(locationIndex / 8) };

  const validMoves = new Set();
  const collisions = new Set();

  const moves = [
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 0, y: 1 },
    { x: -1, y: 1 },
    { x: -1, y: 0 },
    { x: -1, y: -1 },
    { x: 0, y: -1 },
    { x: 1, y: -1 },
  ];

  moves.forEach((move) => {
    const checkLoc = { x: current.x + move.x, y: current.y + move.y };
    if (
      checkLoc.x >= 0 &&
      checkLoc.x < 8 &&
      checkLoc.y >= 0 &&
      checkLoc.y < 8
    ) {
      const checkPiece = boardState[checkLoc.x + 8 * checkLoc.y];

      // if the space is empty, accept valid move
      if (checkPiece < 0) {
        validMoves.add(checkLoc.x + 8 * checkLoc.y);
      }

      // if the space has a target piece, return collision
      if (targetPiece.indexOf(checkPiece) >= 0) {
        collisions.add(checkLoc.x + 8 * checkLoc.y);
      }
    }
  });
  return { validMoves, collisions };
};

export default checkAdjacentCollision;

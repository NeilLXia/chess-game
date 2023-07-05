// returns true if there's a piece of type target piece/color an L-shaped distance from the given location
const checkLinearCollision = (
  boardState: Array<number>,
  locationIndex: number,
  direction: { x: number; y: number },
  targetPiece: Array<number>
) => {
  const validMoves = new Set();
  const collisions = new Set();

  const checkLoc = {
    x: (locationIndex % 8) + direction.x,
    y: Math.floor(locationIndex / 8) + direction.y,
  };

  while (
    checkLoc.x >= 0 &&
    checkLoc.x < 8 &&
    checkLoc.y >= 0 &&
    checkLoc.y < 8
  ) {
    const checkPiece = boardState[checkLoc.x + 8 * checkLoc.y];

    // if the checked piece is the target piece, store collision
    if (targetPiece.indexOf(checkPiece) !== -1) {
      collisions.add(checkLoc.x + 8 * checkLoc.y);
      return { validMoves, collisions };
    }

    // if the space is empty, accept valid move
    if (checkPiece !== -1) {
      return { validMoves, collisions };
    }

    validMoves.add(checkLoc.x + 8 * checkLoc.y);
    checkLoc.x += direction.x;
    checkLoc.y += direction.y;
  }
  return { validMoves, collisions };
};

export default checkLinearCollision;

import { pieceToNumber } from "./pieceTypes";
import checkKnightCollision from "./checkCollisions/checkKnightCollision";
import checkLinearCollision from "./checkCollisions/checkLinearCollision";
import checkAdjacentCollision from "./checkCollisions/checkAdjacentCollision";

interface checkBoardStateProps {
  boardState: Array<number>;
  userState: { [key: string]: any };
}

const checkBoardState = ({ boardState, userState }: checkBoardStateProps) => {
  const playerColor = userState?.playerTurn || "white";
  const opponentColor = playerColor === "white" ? "black" : "white";

  const kingIndex = boardState?.indexOf(pieceToNumber["K"][playerColor]);

  const pawnAttacks = [
    { x: 1, y: playerColor === "white" ? -1 : 1 },
    { x: -1, y: playerColor === "white" ? -1 : 1 },
  ];

  const diagonalMoves = [
    { x: 1, y: 1 },
    { x: -1, y: 1 },
    { x: 1, y: -1 },
    { x: -1, y: -1 },
  ];

  const orthogonalMoves = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
  ];
  // Check if there are any pawns attacking the king
  if (
    checkAdjacentCollision(boardState, kingIndex, [
      pieceToNumber["P"][opponentColor],
    ]).collisions.has(kingIndex + pawnAttacks[0].x + 8 * pawnAttacks[0].y) ||
    checkAdjacentCollision(boardState, kingIndex, [
      pieceToNumber["P"][opponentColor],
    ]).collisions.has(kingIndex + pawnAttacks[1].x + 8 * pawnAttacks[1].y)
  ) {
    return false;
  }

  // Check if there are any opposing knights attacking the king
  if (
    checkKnightCollision(boardState, kingIndex, [
      pieceToNumber["N"][opponentColor],
    ]).collisions.size > 0
  ) {
    return false;
  }

  // Check if there are any opposing bishops/queens attacking the king from a diagonal
  for (const diagonalMove of diagonalMoves) {
    if (
      checkLinearCollision(boardState, kingIndex, diagonalMove, [
        pieceToNumber["B"][opponentColor],
        pieceToNumber["Q"][opponentColor],
      ]).collisions.size > 0
    ) {
      return false;
    }
  }

  // Check if there are any opposing rooks/queens attacking the king from an orthogonal
  for (const orthogonalMove of orthogonalMoves) {
    if (
      checkLinearCollision(boardState, kingIndex, orthogonalMove, [
        pieceToNumber["R"][opponentColor],
        pieceToNumber["Q"][opponentColor],
      ]).collisions.size > 0
    ) {
      return false;
    }
  }
  return true;
};

export default checkBoardState;

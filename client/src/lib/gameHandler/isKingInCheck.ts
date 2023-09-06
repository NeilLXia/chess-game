import { pieceToNumber } from "./pieceTypes";
import checkKnightCollision from "./checkCollisions/checkKnightCollision";
import checkLinearCollision from "./checkCollisions/checkLinearCollision";
import checkAdjacentCollision from "./checkCollisions/checkAdjacentCollision";

interface isKingInCheckProps {
  boardState: Array<number>;
  userState: { [key: string]: any };
}

const isKingInCheck = ({ boardState, userState }: isKingInCheckProps) => {
  const playerColor = userState?.playerTurn || "white";
  const kingIndex = boardState?.indexOf(pieceToNumber["K"][playerColor]);

  if (isPawnAttackingKing(boardState, kingIndex, playerColor)) {
    return false;
  }

  if (isKnightAttackingKing(boardState, kingIndex, playerColor)) {
    return false;
  }

  if (isQueenOrBishopAttackingKing(boardState, kingIndex, playerColor)) {
    return false;
  }

  if (isQueenOrRookAttackingKing(boardState, kingIndex, playerColor)) {
    return false;
  }

  return true;
};

const isPawnAttackingKing = (
  boardState: Array<number>,
  kingIndex: number,
  playerColor: string
) => {
  const opponentColor = playerColor === "white" ? "black" : "white";
  const pawnAttacks = [
    { x: 1, y: playerColor === "white" ? -1 : 1 },
    { x: -1, y: playerColor === "white" ? -1 : 1 },
  ];

  for (const pawnAttack of pawnAttacks) {
    if (
      checkAdjacentCollision(boardState, kingIndex, [
        pieceToNumber["P"][opponentColor],
      ]).collisions.has(kingIndex + pawnAttack.x + 8 * pawnAttack.y)
    ) {
      return true;
    }
  }

  return false;
};

const isKnightAttackingKing = (
  boardState: Array<number>,
  kingIndex: number,
  playerColor: string
) => {
  const opponentColor = playerColor === "white" ? "black" : "white";
  return (
    checkKnightCollision(boardState, kingIndex, [
      pieceToNumber["N"][opponentColor],
    ]).collisions.size > 0
  );
};

const isQueenOrBishopAttackingKing = (
  boardState: Array<number>,
  kingIndex: number,
  playerColor: string
) => {
  const diagonalMoves = [
    { x: 1, y: 1 },
    { x: -1, y: 1 },
    { x: 1, y: -1 },
    { x: -1, y: -1 },
  ];
  const opponentColor = playerColor === "white" ? "black" : "white";

  for (const diagonalMove of diagonalMoves) {
    if (
      checkLinearCollision(boardState, kingIndex, diagonalMove, [
        pieceToNumber["B"][opponentColor],
        pieceToNumber["Q"][opponentColor],
      ]).collisions.size > 0
    ) {
      return true;
    }
  }

  return false;
};

const isQueenOrRookAttackingKing = (
  boardState: Array<number>,
  kingIndex: number,
  playerColor: string
) => {
  const orthogonalMoves = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
  ];
  const opponentColor = playerColor === "white" ? "black" : "white";

  for (const orthogonalMove of orthogonalMoves) {
    if (
      checkLinearCollision(boardState, kingIndex, orthogonalMove, [
        pieceToNumber["R"][opponentColor],
        pieceToNumber["Q"][opponentColor],
      ]).collisions.size > 0
    ) {
      return true;
    }
  }

  return false;
};

export default isKingInCheck;

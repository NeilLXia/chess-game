import isKingInCheck from "../isKingInCheck";
import checkLinearCollision from "../checkCollisions/checkLinearCollision";
import { pieceToNumber } from "../referenceData/pieceTypes";
import simulateBoardMove from "../simulateBoardMove";

const findBishopMoves = (
  boardState: Array<number>,
  userState: { [key: string]: any },
  index: number
) => {
  const playerColor = userState.playerTurn;
  const opponentColor = playerColor === "white" ? "black" : "white";
  const move = {
    moveRange: new Set(),
    attackRange: new Set(),
  };

  const diagonalMoves = [
    { x: 1, y: 1 },
    { x: -1, y: 1 },
    { x: 1, y: -1 },
    { x: -1, y: -1 },
  ];

  for (const diagonalMove of diagonalMoves) {
    const { validMoves, collisions } = checkLinearCollision(
      boardState,
      index,
      diagonalMove,
      [
        pieceToNumber["P"][opponentColor],
        pieceToNumber["N"][opponentColor],
        pieceToNumber["B"][opponentColor],
        pieceToNumber["R"][opponentColor],
        pieceToNumber["Q"][opponentColor],
      ]
    );

    validMoves.forEach((validMove: number) => {
      const newBoardState = simulateBoardMove(boardState, index, validMove);

      if (isKingInCheck({ boardState: newBoardState, userState })) {
        move.moveRange.add(validMove);
      }
    });

    collisions.forEach((collision: number) => {
      const newBoardState = simulateBoardMove(boardState, index, collision);

      if (isKingInCheck({ boardState: newBoardState, userState })) {
        move.attackRange.add(collision);
      }
    });
  }
  if (move.moveRange.size > 0 || move.attackRange.size > 0) {
    return move;
  }
};

export default findBishopMoves;

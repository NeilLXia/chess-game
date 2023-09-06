import isKingInCheck from "../isKingInCheck";
import checkAdjacentCollision from "../checkCollisions/checkAdjacentCollision";
import checkLinearCollision from "../checkCollisions/checkLinearCollision";
import { pieceToNumber } from "../pieceTypes";
import simulateBoardMove from "../simulateBoardMove";

const findKingMoves = (
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

  const { validMoves, collisions } = checkAdjacentCollision(boardState, index, [
    pieceToNumber["P"][opponentColor],
    pieceToNumber["N"][opponentColor],
    pieceToNumber["B"][opponentColor],
    pieceToNumber["R"][opponentColor],
    pieceToNumber["Q"][opponentColor],
  ]);

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

  // check for castling moves
  const orthogonalMoves = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
  ];

  for (const orthogonalMove of orthogonalMoves) {
    const { validMoves, collisions } = checkLinearCollision(
      boardState,
      index,
      orthogonalMove,
      [pieceToNumber["R"][playerColor]]
    );
    const queenCastleRook = playerColor === "white" ? 56 : 0;
    const kingCastleRook = playerColor === "white" ? 63 : 7;

    if (
      collisions.has(queenCastleRook) &&
      userState.canCastle[playerColor][queenCastleRook]
    ) {
      if (
        isKingInCheck({ boardState, userState }) &&
        isKingInCheck({
          boardState: simulateBoardMove(boardState, index, index - 1),
          userState,
        }) &&
        isKingInCheck({
          boardState: simulateBoardMove(boardState, index, index - 2),
          userState,
        })
      ) {
        move.moveRange.add(index - 2);
      }
    }

    if (
      collisions.has(kingCastleRook) &&
      userState.canCastle[playerColor][kingCastleRook]
    ) {
      if (
        isKingInCheck({ boardState, userState }) &&
        isKingInCheck({
          boardState: simulateBoardMove(boardState, index, index + 1),
          userState,
        }) &&
        isKingInCheck({
          boardState: simulateBoardMove(boardState, index, index + 2),
          userState,
        })
      ) {
        move.moveRange.add(index + 2);
      }
    }
  }

  if (move.moveRange.size > 0 || move.attackRange.size > 0) {
    return move;
  }
};

export default findKingMoves;

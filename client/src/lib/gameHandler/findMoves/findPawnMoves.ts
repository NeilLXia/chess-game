import checkAdjacentCollision from "../checkCollisions/checkAdjacentCollision";
import isKingInCheck from "../isKingInCheck";
import checkLinearCollision from "../checkCollisions/checkLinearCollision";
import { pieceToNumber } from "../referenceData/pieceTypes";
import simulateBoardMove from "../simulateBoardMove";

const findPawnMoves = (
  boardState: Array<number>,
  userState: { [key: string]: any },
  index: number
) => {
  const playerColor = userState?.turnNumber % 2 ? "black" : "white";
  const opponentColor = playerColor === "white" ? "black" : "white";
  const move = {
    moveRange: new Set(),
    attackRange: new Set(),
  };

  const { validMoves } = checkLinearCollision(
    boardState,
    index,
    { x: 0, y: playerColor === "white" ? -1 : 1 },
    []
  );
  const { collisions } = checkAdjacentCollision(boardState, index, [
    pieceToNumber["P"][opponentColor],
    pieceToNumber["N"][opponentColor],
    pieceToNumber["B"][opponentColor],
    pieceToNumber["R"][opponentColor],
    pieceToNumber["Q"][opponentColor],
  ]);

  if (validMoves.has(index + (playerColor === "white" ? -8 : 8))) {
    const newBoardState = simulateBoardMove(
      boardState,
      index,
      index + (playerColor === "white" ? -8 : 8)
    );

    if (isKingInCheck({ boardState: newBoardState, userState })) {
      move.moveRange.add(index + (playerColor === "white" ? -8 : 8));
    }
  }

  // if pawn is at base row, allow move 2
  if (
    Math.floor(index / 8) === (playerColor === "white" ? 6 : 1) &&
    validMoves.has(index + (playerColor === "white" ? -16 : 16))
  ) {
    const newBoardState = simulateBoardMove(
      boardState,
      index,
      index + (playerColor === "white" ? -16 : 16)
    );
    if (isKingInCheck({ boardState: newBoardState, userState })) {
      move.moveRange.add(index + (playerColor === "white" ? -16 : 16));
    }
  }

  // check pawn diagonal attacks
  if (collisions.has(index + (playerColor === "white" ? -9 : 9))) {
    const newBoardState = simulateBoardMove(
      boardState,
      index,
      index + (playerColor === "white" ? -9 : 9)
    );

    if (isKingInCheck({ boardState: newBoardState, userState })) {
      move.attackRange.add(index + (playerColor === "white" ? -9 : 9));
    }
  }
  if (collisions.has(index + (playerColor === "white" ? -7 : 7))) {
    const newBoardState = simulateBoardMove(
      boardState,
      index,
      index + (playerColor === "white" ? -7 : 7)
    );

    if (isKingInCheck({ boardState: newBoardState, userState })) {
      move.attackRange.add(index + (playerColor === "white" ? -7 : 7));
    }
  }

  // check en passant opportunities
  const oneRowForward = playerColor === "white" ? -8 : 8;

  if (
    index - 1 === userState.prevSecondSelection &&
    boardState[userState.prevSecondSelection] ===
      pieceToNumber["P"][opponentColor] &&
    Math.abs(userState.prevSecondSelection - userState.prevFirstSelection) /
      8 ===
      2
  ) {
    move.attackRange.add(index - 1 + oneRowForward);
  }

  if (
    index + 1 === userState.prevSecondSelection &&
    boardState[userState.prevSecondSelection] ===
      pieceToNumber["P"][opponentColor] &&
    Math.abs(userState.prevSecondSelection - userState.prevFirstSelection) /
      8 ===
      2
  ) {
    move.attackRange.add(index + 1 + oneRowForward);
  }

  // return piece as movable
  if (move.moveRange.size > 0 || move.attackRange.size > 0) {
    return move;
  }
};

export default findPawnMoves;

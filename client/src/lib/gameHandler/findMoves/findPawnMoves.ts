import checkAdjacentCollision from "../checkCollisions/checkAdjacentCollision";
import checkBoardState from "../checkBoardState";
import checkLinearCollision from "../checkCollisions/checkLinearCollision";
import { pieceToNumber } from "../pieceTypes";
import simulateBoardMove from "../simulateBoardMove";
import HistoryNode from "../historyNode";

const findPawnMoves = (
  boardState: Array<number>,
  userState: { [key: string]: any },
  history: Set<HistoryNode>,
  index: number
) => {
  const playerColor = userState.playerTurn;
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

    if (checkBoardState({ boardState: newBoardState, userState })) {
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
    if (checkBoardState({ boardState: newBoardState, userState })) {
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

    if (checkBoardState({ boardState: newBoardState, userState })) {
      move.attackRange.add(index + (playerColor === "white" ? -9 : 9));
    }
  }
  if (collisions.has(index + (playerColor === "white" ? -7 : 7))) {
    const newBoardState = simulateBoardMove(
      boardState,
      index,
      index + (playerColor === "white" ? -7 : 7)
    );

    if (checkBoardState({ boardState: newBoardState, userState })) {
      move.attackRange.add(index + (playerColor === "white" ? -7 : 7));
    }
  }

  // check en passant opportunities
  const oneRowForward = playerColor === "white" ? -8 : 8;
  const priorBoardState = userState.currentNode.parent
    ? userState.currentNode.parent.boardState
    : userState.currentNode.boardState;

  if (
    boardState[index - 1] === pieceToNumber["P"][opponentColor] &&
    boardState[index - 1 + 2 * oneRowForward] < 0 &&
    priorBoardState[index - 1 + 2 * oneRowForward] ===
      pieceToNumber["P"][opponentColor] &&
    priorBoardState[index - 1] < 0
  ) {
    move.attackRange.add(index - 1 + oneRowForward);
  }

  if (
    boardState[index + 1] === pieceToNumber["P"][opponentColor] &&
    boardState[index + 1 + 2 * oneRowForward] < 0 &&
    priorBoardState[index + 1 + 2 * oneRowForward] ===
      pieceToNumber["P"][opponentColor] &&
    priorBoardState[index + 1] < 0
  ) {
    move.attackRange.add(index + 1 + oneRowForward);
  }

  // return piece as movable
  if (move.moveRange.size > 0 || move.attackRange.size > 0) {
    return move;
  }
};

export default findPawnMoves;

import checkBoardState from "../checkBoardState";
import checkAdjacentCollision from "../checkCollisions/checkAdjacentCollision";
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

    if (checkBoardState({ boardState: newBoardState, userState })) {
      move.moveRange.add(validMove);
    }
  });

  collisions.forEach((collision: number) => {
    const newBoardState = simulateBoardMove(boardState, index, collision);

    if (checkBoardState({ boardState: newBoardState, userState })) {
      move.attackRange.add(collision);
    }
  });

  if (move.moveRange.size > 0 || move.attackRange.size > 0) {
    return move;
  }
};

export default findKingMoves;

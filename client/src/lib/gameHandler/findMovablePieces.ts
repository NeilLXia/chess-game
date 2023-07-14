import { pieceToNumber } from "./pieceTypes";
import findPawnMoves from "./findMoves/findPawnMoves";
import findKnightMoves from "./findMoves/findKnightMoves";
import findBishopMoves from "./findMoves/findBishopMoves";
import findRookMoves from "./findMoves/findRookMoves";
import findQueenMoves from "./findMoves/findQueenMoves";
import findKingMoves from "./findMoves/findKingMoves";

const findMovablePieces = (
  boardState: Array<number>,
  userState: { [key: string]: any }
) => {
  const moves = {} as { [key: number]: any };
  const playerColor = userState.playerTurn;

  for (let i = 0; i < boardState.length; i++) {
    const piece = boardState[i];

    if (piece === pieceToNumber["P"][playerColor]) {
      const move = findPawnMoves(boardState, userState, i);
      if (move) {
        moves[i] = move;
      }
    }
    if (piece === pieceToNumber["N"][playerColor]) {
      const move = findKnightMoves(boardState, userState, i);
      if (move) {
        moves[i] = move;
      }
    }
    if (piece === pieceToNumber["B"][playerColor]) {
      const move = findBishopMoves(boardState, userState, i);
      if (move) {
        moves[i] = move;
      }
    }
    if (piece === pieceToNumber["R"][playerColor]) {
      const move = findRookMoves(boardState, userState, i);
      if (move) {
        moves[i] = move;
      }
    }
    if (piece === pieceToNumber["Q"][playerColor]) {
      const move = findQueenMoves(boardState, userState, i);
      if (move) {
        moves[i] = move;
      }
    }
    if (piece === pieceToNumber["K"][playerColor]) {
      const move = findKingMoves(boardState, userState, i);
      if (move) {
        moves[i] = move;
      }
    }
  }
  return moves;
};

export default findMovablePieces;

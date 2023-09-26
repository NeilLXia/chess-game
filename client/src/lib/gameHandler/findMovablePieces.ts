import { pieceToNumber } from "./referenceData/pieceTypes";
import findPawnMoves from "./findMoves/findPawnMoves";
import findKnightMoves from "./findMoves/findKnightMoves";
import findBishopMoves from "./findMoves/findBishopMoves";
import findRookMoves from "./findMoves/findRookMoves";
import findQueenMoves from "./findMoves/findQueenMoves";
import findKingMoves from "./findMoves/findKingMoves";
import UserState from "./referenceData/userStateType";

const findMovablePieces = (boardState: Array<number>, userState: UserState) => {
  const moves: { [key: number]: Array<number> } = {};
  const playerColor = userState.turnNumber % 2 ? "black" : "white";

  const moveFinders: { [key: string]: Function } = {
    P: findPawnMoves,
    N: findKnightMoves,
    B: findBishopMoves,
    R: findRookMoves,
    Q: findQueenMoves,
    K: findKingMoves,
  };

  boardState.forEach((piece, i) => {
    Object.keys(pieceToNumber).forEach((pieceType) => {
      if (piece === pieceToNumber[pieceType][playerColor]) {
        const move = moveFinders[pieceType](boardState, userState, i);
        if (move) {
          moves[i] = move;
        }
      }
    });
  });

  return moves;
};

export default findMovablePieces;

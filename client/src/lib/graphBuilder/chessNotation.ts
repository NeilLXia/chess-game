import isKingInCheck from "../gameHandler/isKingInCheck";
import findMovablePieces from "../gameHandler/findMovablePieces";
import HistoryNode from "./historyNode";
import { numberToPiece } from "../gameHandler/referenceData/pieceTypes";
import UserState from "../gameHandler/referenceData/userStateType";

const columnToLetter = {
  0: "a",
  1: "b",
  2: "c",
  3: "d",
  4: "e",
  5: "f",
  6: "g",
  7: "h",
} as { [key: number]: string };

const chessNotation = (
  boardState: Array<number>,
  userState: UserState,
  priorNode: HistoryNode
) => {
  const piece = numberToPiece[boardState[userState.prevSecondSelection]];
  const indexFrom = `${columnToLetter[userState.prevSecondSelection % 8]}${
    Math.floor(userState.prevSecondSelection / 8) + 1
  }`;
  const indexTo = `${columnToLetter[userState.prevFirstSelection % 8]}${
    Math.floor(userState.prevFirstSelection / 8) + 1
  }`;
  const isCaptureMove =
    priorNode.boardState[userState.prevSecondSelection] >= 0;
  const isCheck = !isKingInCheck({
    boardState: boardState,
    userState: userState,
  });
  const isCheckmate =
    Object.keys(findMovablePieces(boardState, userState)).length === 0;
  const isKingCastle =
    numberToPiece[boardState[userState.prevSecondSelection]] === "K" &&
    userState.prevSecondSelection - userState.prevFirstSelection === 2;
  const isQueenCastle =
    numberToPiece[boardState[userState.prevSecondSelection]] === "K" &&
    userState.prevSecondSelection - userState.prevFirstSelection === -2;
  const moveString = `${piece === "P" ? "" : piece}${indexFrom}${
    isCaptureMove ? "x" : ""
  }${indexTo}`;

  return `${isKingCastle ? "0-0" : isQueenCastle ? "0-0-0" : moveString}${
    isCheckmate ? "#" : isCheck ? "+" : ""
  }`;
};

export default chessNotation;

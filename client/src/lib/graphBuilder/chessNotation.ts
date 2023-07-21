import checkBoardState from "../gameHandler/checkBoardState";
import findMovablePieces from "../gameHandler/findMovablePieces";
import HistoryNode from "../gameHandler/historyNode";
import { numberToPiece } from "../gameHandler/pieceTypes";

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
  userState: { [key: string]: any },
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
  const isCheck = !checkBoardState({
    boardState: boardState,
    userState: userState,
  });
  const isCheckmate =
    Object.keys(findMovablePieces(boardState, userState)).length === 0;

  return `${piece === "P" ? "" : piece}${indexFrom}${
    isCaptureMove ? "x" : ""
  }${indexTo}${isCheckmate ? "#" : isCheck ? "+" : ""}`;
};

export default chessNotation;

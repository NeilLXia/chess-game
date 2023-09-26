import chessNotation from "../../graphBuilder/chessNotation";

class HistoryNode {
  boardState: Array<number>;
  userState: { [key: string]: any };
  timer: { [key: string]: number };
  chessNotation: string;
  parent: HistoryNode;
  children: Set<HistoryNode>;

  constructor(
    boardState: Array<number>,
    userState: { [key: string]: any },
    parent: HistoryNode,
    timer: { [key: string]: any }
  ) {
    this.boardState = [...boardState];
    this.userState = { ...userState };
    this.timer = {
      white: timer.white.seconds + 60 * timer.white.minutes,
      black: timer.black.seconds + 60 * timer.black.minutes,
    };
    this.children = new Set() as Set<HistoryNode>;
    this.parent = parent;
    this.chessNotation = parent
      ? chessNotation(boardState, userState, parent)
      : "";
  }
}

export default HistoryNode;

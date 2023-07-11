class HistoryNode {
  boardState: Array<number>;
  timer: { [key: string]: number };
  parent: HistoryNode;
  children: Set<HistoryNode>;

  constructor(boardState: Array<number>, timer: { [key: string]: any }) {
    this.boardState = boardState;
    this.timer = {
      white: timer.white.seconds + 60 * timer.white.minutes,
      black: timer.black.seconds + 60 * timer.black.minutes,
    };
    this.children = new Set() as Set<HistoryNode>;
    this.parent = null;
  }
}

export default HistoryNode;

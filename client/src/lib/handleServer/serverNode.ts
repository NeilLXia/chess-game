class ServerNode {
  parent_state: string;
  board_state: string;
  user_state: { [key: string]: any };
  timer: { [key: string]: { seconds: number; minutes: number } };

  constructor(
    parentState: string,
    boardState: string,
    userState: { [key: string]: any },
    timer: { [key: string]: any }
  ) {
    this.parent_state = parentState;
    this.board_state = boardState;
    this.user_state = { ...userState };
    this.timer = {
      white: { seconds: timer.white.seconds, minutes: timer.white.minutes },
      black: { seconds: timer.black.seconds, minutes: timer.black.minutes },
    };
  }
}

export default ServerNode;

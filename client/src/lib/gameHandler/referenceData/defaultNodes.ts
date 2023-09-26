import ServerNode from "../../handleServer/serverNode";

export default [
  {
    parent_state: null,
    board_state:
      "15131416111413151212121212121212000000000000000000000000000000000000000000000000000000000000000002020202020202020503040601040305",
    user_state: {
      selection_1: -1,
      selection_2: -1,
      can_castle: {
        black: { "0": true, "7": true },
        white: { "56": true, "63": true },
      },
      turn_number: 0,
    },
    timer: {
      white: { minutes: 5, seconds: 0 },
      black: { minutes: 5, seconds: 0 },
    },
  },
] as ServerNode[];

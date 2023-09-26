import HistoryNode from "../gameHandler/referenceData/historyNode";

const postURL = "http://52.14.94.247:8000/game/add_node";

const updateServerTree = async (gameID: number, node: HistoryNode) => {
  const newNode = {
    game_id: gameID,
    newNode: {
      parent_state: node.parent.boardState,
      board_state: node.boardState
        .map((num: number) => (num + 1).toString().padStart(2, "0"))
        .join(""),
      user_state: {
        selection_1: node.userState.prevFirstSelection,
        selection_2: node.userState.prevSecondSelection,
        can_castle: node.userState.canCastle,
        turn_number: node.userState.turnNumber,
      },
      timer: node.timer,
    },
  };
  console.log(newNode.newNode.board_state);
  await fetch(postURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newNode),
  });
};

export default updateServerTree;

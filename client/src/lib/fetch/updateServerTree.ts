const postURL = "http://52.14.94.247:8000/game/add_node";

const updateServerTree = async (
  gameID: number,
  boardState: number[],
  userState: { [key: string]: any }
) => {
  console.log(gameID);
  const newNode = {
    game_id: gameID,
    newNode: {
      board_state: boardState.map((num: number) => (num + 1).toString()).join(),
      user_state: {
        selection_1: userState.prevFirstSelection,
        selection_2: userState.prevSecondSelection,
        can_castle: userState.canCastle,
        player_turn: userState.playerTurn,
      },
      timer: {
        white: { minutes: 5, seconds: 0 },
        black: { minutes: 5, seconds: 0 },
      },
    },
  };

  const response = await fetch(postURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newNode),
  });
  return response.json();
};

export default updateServerTree;

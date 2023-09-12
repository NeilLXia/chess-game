import initialBoardState from "../gameHandler/referenceData/initialBoardState";
import HistoryNode from "../gameHandler/referenceData/historyNode";

const postURL = "";

const startNewGame = async () => {
  const playerTimer = new Date().getTime() + 5 * 60000; // sets the initial timers for each player
  const boardState = initialBoardState; // stores the current board state
  const userState = {
    prevFirstSelection: -1,
    prevSecondSelection: -1,
    firstSelection: -1,
    secondSelection: -1,
    rootNode: JSON.stringify(initialBoardState),
    currentNode: JSON.stringify(initialBoardState), // current location in history
    gameWinner: "", // declare winner
    playerTurn: "white", // current player turn
    canCastle: {
      black: { 0: true, 7: true },
      white: { 56: true, 63: true },
    } as { [key: string]: { [key: string]: boolean } },
    isPromo: false, // indicates whether a pawn is up for promotion
    promoValue: "", // stores the selected pawn promotion value
  };

  const timer = {
    white: { minutes: 5, seconds: 0 },
    black: { minutes: 5, seconds: 0 },
  };

  // set the first history state to the board's initial state
  const history = new Map() as Map<string, HistoryNode>;
  const currentNode = new HistoryNode(boardState, userState, null, timer);
  history.set(JSON.stringify(boardState), currentNode);

  const response = await fetch(postURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(history),
  });
  return response.json();
};

export default startNewGame;

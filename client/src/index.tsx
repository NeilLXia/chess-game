import * as React from "react";
import { useState, useEffect, useRef } from "react";
import * as ReactDOM from "react-dom/client";
import "./css/app.css";
import {
  UserContext,
  BoardContext,
  HistoryContext,
} from "./contexts/userContext";
import initialBoardState from "./lib/gameHandler/referenceData/initialBoardState";
import ChessBoard from "./components/boardRender/chessBoard";
import gameHandler from "./lib/gameHandler/gameHandler";
import { useTimer } from "react-timer-hook";
import Header from "./components/header";
import HistoryNode from "./lib/gameHandler/referenceData/historyNode";
import GameEndDialog from "./components/dialogs/gameEndDialog";
import HistoryGraph from "./components/historyRender/historyGraph";

const defaultNodes = [
  {
    board_state:
      "15131416111413151212121212121212000000000000000000000000000000000000000000000000000000000000000002020202020202020503040601040305",
    user_state: {
      selection_1: -1,
      selection_2: -1,
      can_castle: {
        black: { "0": true, "7": true },
        white: { "56": true, "63": true },
      },
      player_turn: "white",
    },
    timer: {
      white: { minutes: 5, seconds: 0 },
      black: { minutes: 5, seconds: 0 },
    },
  },
];

// tree data from Django server
const nodes = document.getElementById("nodes")
  ? JSON.parse(document.getElementById("nodes").textContent)
  : defaultNodes;
const gameID = document.getElementById("game_id")
  ? JSON.parse(document.getElementById("game_id").textContent)
  : 1;
const mostRecentNode = nodes[nodes.length - 1];
const recentBoardState = mostRecentNode
  ? mostRecentNode["board_state"]
      .split(/(..)/g)
      .filter((s: string) => s)
      .map((s: string) => {
        return Number(s) - 1;
      })
  : initialBoardState;
const prevFirstSelection =
  nodes[nodes.length - 1]["user_state"]["selection_1"] || -1;
const prevSecondSelection =
  nodes[nodes.length - 1]["user_state"]["selection_2"] || -1;
const turnNumber = nodes[nodes.length - 1]["user_state"]["turn_number"] || 0;
const canCastle =
  nodes[nodes.length - 1]["user_state"]["can_castle"] ||
  ({
    black: { 0: true, 7: true },
    white: { 56: true, 63: true },
  } as { [key: string]: { [key: string]: boolean } });

const App = () => {
  const promoModalRef = useRef<HTMLDialogElement>(null);
  const gameEndModalRef = useRef<HTMLDialogElement>(null);
  const historyGraphRef = useRef<SVGSVGElement>(null);

  const playerTimer = new Date().getTime() + 5 * 60000; // sets the initial timers for each player
  const [moves, setMoves] = useState({}); // stores the available moves for the player
  const [boardState, setBoardState] = useState(
    recentBoardState || initialBoardState
  ); // stores the current board state
  const [userState, setUserState] = useState({
    prevFirstSelection: prevFirstSelection,
    prevSecondSelection: prevSecondSelection,
    firstSelection: -1,
    secondSelection: -1,
    rootNode: JSON.stringify(recentBoardState) + "0",
    currentNode: JSON.stringify(recentBoardState) + "0", // current location in history
    gameWinner: "", // declare winner
    turnNumber: turnNumber, // current player turn
    canCastle: canCastle,
    isPromo: false, // indicates whether a pawn is up for promotion
    promoValue: "", // stores the selected pawn promotion value
  });

  const timer = {
    white: useTimer({
      expiryTimestamp: new Date(playerTimer),
      onExpire: () =>
        setUserState((prevState) => {
          return { ...prevState, gameWinner: "Black" };
        }),
    }),
    black: useTimer({
      expiryTimestamp: new Date(playerTimer),
      onExpire: () =>
        setUserState((prevState) => {
          return { ...prevState, gameWinner: "White" };
        }),
    }),
  };

  // set the first history state to the board's initial state
  const [history, setHistory] = useState(() => {
    const currentNode = new HistoryNode(boardState, userState, null, timer);
    const historyMap = new Map() as Map<string, HistoryNode>;
    historyMap.set(
      JSON.stringify(boardState) + userState.turnNumber.toString(),
      currentNode
    );
    return historyMap;
  });

  useEffect(() => {
    gameHandler(
      gameID,
      { boardState, setBoardState },
      { userState, setUserState },
      { history, setHistory },
      promoModalRef,
      gameEndModalRef,
      setMoves,
      timer
    );
  }, [userState]);

  return (
    <div id="app">
      <div className="game-title" />
      <HistoryContext.Provider value={[history, setHistory]}>
        <BoardContext.Provider value={[boardState, setBoardState]}>
          <UserContext.Provider value={[userState, setUserState]}>
            <GameEndDialog gameEndModalRef={gameEndModalRef} />
            <div className="game-display">
              <Header timer={timer} />
              <ChessBoard moves={moves} promoModalRef={promoModalRef} />
            </div>
            <div className="history-display">
              <HistoryGraph historyGraphRef={historyGraphRef} />
            </div>
          </UserContext.Provider>
        </BoardContext.Provider>
      </HistoryContext.Provider>
    </div>
  );
};

const Root = ReactDOM.createRoot(document.getElementById("root")!);
Root.render(<App />);

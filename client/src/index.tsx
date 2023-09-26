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
import HistoryNode from "./lib/graphBuilder/historyNode";
import GameEndDialog from "./components/dialogs/gameEndDialog";
import HistoryGraph from "./components/historyRender/historyGraph";
import ServerNode from "./lib/handleServer/serverNode";
import UserState from "./lib/gameHandler/referenceData/userStateType";
import defaultNodes from "./lib/gameHandler/referenceData/defaultNodes";
import mapServerNode from "./lib/handleServer/mapServerNodes";

// tree data from Django server
const serverNodes: ServerNode[] = document.getElementById("nodes")
  ? JSON.parse(document.getElementById("nodes").textContent)
  : defaultNodes;
const gameID = document.getElementById("game_id")
  ? JSON.parse(document.getElementById("game_id").textContent)
  : 1;

const allNodes: any = mapServerNode(serverNodes);
const mostRecentNode = allNodes[allNodes.length - 1];
const historyNodes: Map<string, HistoryNode> = new Map();

allNodes.forEach((node: any) => {
  const parent =
    historyNodes.get(
      JSON.stringify(node.parentState) +
        (node.userState.turnNumber - 1).toString()
    ) || null;
  const historyNode = new HistoryNode(
    node.boardState,
    node.userState,
    parent,
    node.timer
  );
  historyNodes.set(
    JSON.stringify(node.boardState) + node.userState.turnNumber.toString(),
    historyNode
  );
});

const App = () => {
  const promoModalRef = useRef<HTMLDialogElement>(null);
  const gameEndModalRef = useRef<HTMLDialogElement>(null);
  const historyGraphRef = useRef<SVGSVGElement>(null);

  const playerTimer = new Date().getTime() + 5 * 60000; // sets the initial timers for each player
  const [moves, setMoves] = useState({}); // stores the available moves for the player
  const [boardState, setBoardState] = useState(
    mostRecentNode["boardState"] || initialBoardState
  ); // stores the current board state
  const [userState, setUserState] = useState(
    mostRecentNode.userState as UserState
  );

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
  const [history, setHistory] = useState(historyNodes);

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

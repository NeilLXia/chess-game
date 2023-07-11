import * as React from "react";
import { useState, useEffect } from "react";
import * as ReactDOM from "react-dom/client";

import "./css/app.css";

import {
  UserContext,
  BoardContext,
  HistoryContext,
} from "./contexts/userContext";
import initialBoardState from "./lib/gameHandler/initialBoardState";
import ChessBoard from "./components/chessBoard";
import gameHandler from "./lib/gameHandler/gameHandler";
import { useTimer } from "react-timer-hook";
import Header from "./components/header";
import HistoryNode from "./lib/gameHandler/historyNode";

const App = () => {
  const playerTimer = new Date().getTime() + 5 * 60000;

  const [boardState, setBoardState] = useState(initialBoardState);
  const [moves, setMoves] = useState({});
  const [userState, setUserState] = useState({
    prevSelection: -1,
    firstSelection: -1,
    secondSelection: -1,
    currentNode: null,
    timeExpire: "",
    playerTurn: "white",
    canCastle: {
      black: { 0: true, 7: true },
      white: { 56: true, 63: true },
    } as { [key: string]: { [key: string]: boolean } },
  });

  const timer = {
    white: useTimer({
      expiryTimestamp: new Date(playerTimer),
      onExpire: () =>
        setUserState((prevState) => {
          return { ...prevState, timeExpire: "white" };
        }),
    }),
    black: useTimer({
      expiryTimestamp: new Date(playerTimer),
      onExpire: () =>
        setUserState((prevState) => {
          return { ...prevState, timeExpire: "black" };
        }),
    }),
  };

  // set the first history state to the board's initial state
  const [history, setHistory] = useState(() => {
    const currentNode = new HistoryNode(boardState, timer);
    const historySet = new Set() as Set<HistoryNode>;
    historySet.add(currentNode);
    setUserState((prevState) => {
      return { ...prevState, currentNode };
    });
    return historySet;
  });

  useEffect(
    () =>
      gameHandler(
        { boardState, setBoardState },
        { userState, setUserState },
        { history, setHistory },
        setMoves,
        timer
      ),
    [userState]
  );

  const time = new Date();

  return (
    <div id="app">
      <div className="game-title"></div>
      <HistoryContext.Provider value={[history, setHistory]}>
        <BoardContext.Provider value={[boardState, setBoardState]}>
          <UserContext.Provider value={[userState, setUserState]}>
            <div className="game-display">
              <Header timer={timer} />
              <ChessBoard moves={moves} />
            </div>
            <div className="history-display">history/moves here!</div>
          </UserContext.Provider>
        </BoardContext.Provider>
      </HistoryContext.Provider>
    </div>
  );
};

const Root = ReactDOM.createRoot(document.getElementById("root")!);
Root.render(<App />);

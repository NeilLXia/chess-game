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
import Timer from "./components/timer";
import { useTimer } from "react-timer-hook";

const App = () => {
  const playerTimer = new Date().getTime() + 5 * 60000;

  const [boardState, setBoardState] = useState(initialBoardState);
  const [moves, setMoves] = useState({});
  const [userState, setUserState] = useState({
    prevSelection: -1,
    firstSelection: -1,
    secondSelection: -1,
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
  const [history, setHistory] = useState([
    {
      boardState,
      timer: {
        white: timer.white.seconds + 60 * timer.white.minutes,
        black: timer.black.seconds + 60 * timer.black.minutes,
      },
    },
  ]);

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
      <div className="game-title">CHESS</div>
      <HistoryContext.Provider value={[history, setHistory]}>
        <BoardContext.Provider value={[boardState, setBoardState]}>
          <UserContext.Provider value={[userState, setUserState]}>
            <div className="game-display">
              <div className="header">
                <div
                  className={`player-info ${
                    timer.white.isRunning ? "player-info-highlight" : ""
                  }`}
                  id="player-1"
                >
                  <div className="player-name">White Player</div>
                  <Timer
                    seconds={timer.white.seconds}
                    minutes={timer.white.minutes}
                    isRunning={timer.white.isRunning}
                  />
                </div>
                <div
                  className={`player-info ${
                    timer.black.isRunning ? "player-info-highlight" : ""
                  }`}
                  id="player-2"
                >
                  <div className="player-name">Black Player</div>
                  <Timer
                    seconds={timer.black.seconds}
                    minutes={timer.black.minutes}
                    isRunning={timer.black.isRunning}
                  />
                </div>
              </div>
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

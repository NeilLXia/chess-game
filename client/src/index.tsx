import * as React from "react";
import { useState, useEffect, useRef } from "react";
import * as ReactDOM from "react-dom/client";

import "./css/app.css";

import {
  UserContext,
  BoardContext,
  HistoryContext,
} from "./contexts/userContext";
import initialBoardState from "./lib/gameHandler/initialBoardState";
import ChessBoard from "./components/boardRender/chessBoard";
import gameHandler from "./lib/gameHandler/gameHandler";
import { useTimer } from "react-timer-hook";
import Header from "./components/header";
import HistoryNode from "./lib/gameHandler/historyNode";
import PromotionDialog from "./components/dialogs/promotionDialog";
import GameEndDialog from "./components/dialogs/gameEndDialog";
import HistoryGraph from "./components/historyRender/historyGraph";

const App = () => {
  const promoModalRef = useRef<HTMLDialogElement>(null);
  const gameEndModalRef = useRef<HTMLDialogElement>(null);

  const playerTimer = new Date().getTime() + 5 * 60000; // sets the initial timers for each player
  const [moves, setMoves] = useState({}); // stores the available moves for the player
  const [boardState, setBoardState] = useState(initialBoardState); // stores the current board state
  const [userState, setUserState] = useState({
    prevSelection: [-1, -1],
    firstSelection: -1,
    secondSelection: -1,
    rootNode: null,
    currentNode: null, // current location in history
    gameWinner: "", // declare winner
    playerTurn: "white", // current player turn
    canCastle: {
      black: { 0: true, 7: true },
      white: { 56: true, 63: true },
    } as { [key: string]: { [key: string]: boolean } },
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
    const currentNode = new HistoryNode(boardState, timer);
    const historySet = new Set() as Set<HistoryNode>;
    historySet.add(currentNode);
    setUserState((prevState) => {
      return { ...prevState, currentNode, rootNode: currentNode };
    });
    return historySet;
  });

  useEffect(() => {
    gameHandler(
      { boardState, setBoardState },
      { userState, setUserState },
      { history, setHistory },
      promoModalRef,
      gameEndModalRef,
      setMoves,
      timer
    );
  }, [userState]);

  useEffect(() => {}, [history]);

  const time = new Date();

  return (
    <div id="app">
      <div className="game-title" />
      <HistoryContext.Provider value={[history, setHistory]}>
        <BoardContext.Provider value={[boardState, setBoardState]}>
          <UserContext.Provider value={[userState, setUserState]}>
            <PromotionDialog
              promoModalRef={promoModalRef}
              userState={userState}
              setUserState={setUserState}
            />
            <GameEndDialog
              gameEndModalRef={gameEndModalRef}
              userState={userState}
            />
            <div className="game-display">
              <Header timer={timer} />
              <ChessBoard moves={moves} />
            </div>
            <div className="history-display">
              {/* <HistoryGraph history={history} userState={userState} /> */}
            </div>
          </UserContext.Provider>
        </BoardContext.Provider>
      </HistoryContext.Provider>
    </div>
  );
};

const Root = ReactDOM.createRoot(document.getElementById("root")!);
Root.render(<App />);

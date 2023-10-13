import * as React from "react";
import { useState, useEffect, useRef } from "react";
import * as ReactDOM from "react-dom/client";
import "./css/app.css";
import { UserContext, BoardContext, HistoryContext } from "./hooks/userContext";
import { useHistory } from "./hooks/useHistory";
import initialBoardState from "./lib/gameHandler/referenceData/initialBoardState";
import ChessBoard from "./components/board/chessBoard";
import gameHandler from "./lib/gameHandler/gameHandler";
import { useTimer } from "react-timer-hook";
import Header from "./components/header";
import GameEndDialog from "./components/dialogs/gameEndDialog";
import HistoryGraph from "./components/history/historyGraph";
import UserState from "./lib/gameHandler/referenceData/userStateType";
import mapServerNode from "./lib/handleServer/mapServerNodes";
import { gameID, serverNodes } from "./lib/handleServer/readServerData";

const allNodes: any = mapServerNode(serverNodes);
const mostRecentNode = allNodes[allNodes.length - 1];

const App = () => {
  const promoModalRef = useRef<HTMLDialogElement>(null);
  const gameEndModalRef = useRef<HTMLDialogElement>(null);
  const historyGraphRef = useRef<SVGSVGElement>(null);

  const [moves, setMoves] = useState<Object>({}); // stores the available moves for the player
  const [boardState, setBoardState] = useState<number[]>(
    mostRecentNode["boardState"] || initialBoardState
  ); // stores the current board state
  const [userState, setUserState] = useState<UserState>(
    mostRecentNode.userState
  );

  const playerTimer = new Date().getTime() + 5 * 60000; // sets the initial timers for each player
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
  const { history, addHistNode, translateExistingHist } = useHistory();
  if (!history) translateExistingHist(allNodes);

  useEffect(() => {
    gameHandler(
      gameID,
      { boardState, setBoardState },
      { userState, setUserState },
      { history, addHistNode },
      promoModalRef,
      gameEndModalRef,
      setMoves,
      timer
    );
  }, [userState]);

  return (
    <div id="app">
      <div className="game-title" />
      <HistoryContext.Provider value={[history, addHistNode]}>
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

import * as React from "react";
import { useState, useEffect } from "react";
import * as ReactDOM from "react-dom/client";

import "./css/app.css";

import {
  UserContext,
  BoardContext,
  HistoryContext,
} from "./contexts/userContext";
import initialBoardState from "./lib/initialBoardState";
import ChessBoard from "./components/chessBoard";
import findMovablePieces from "./lib/findMovablePieces";
import simulateBoardMove from "./lib/simulateBoardMove";

const App = () => {
  const [boardState, setBoardState] = useState(initialBoardState);
  const [moves, setMoves] = useState({});
  const [userState, setUserState] = useState({
    firstSelection: -1,
    secondSelection: -1,
    playerTurn: "white",
    canBlackCastle: true,
    canWhiteCastle: true,
  });

  // set the first history state to the board's initial state
  const [history, setHistory] = useState([boardState]);

  // game handler
  useEffect(() => {
    setMoves(() => findMovablePieces(boardState, userState));
    if (userState.secondSelection !== -1) {
      const [indexTo, indexFrom] = [
        userState.firstSelection,
        userState.secondSelection,
      ];

      [userState.firstSelection, userState.secondSelection] = [-1, -1];

      //cancel selection if selected piece is clicked
      if (indexTo === indexFrom) {
        return;
      }

      // update board state to reflect valid move
      setBoardState((prevState) => {
        const newBoardState = simulateBoardMove(prevState, indexTo, indexFrom);

        // add move to history
        setHistory((prevState) => [...prevState, newBoardState]);

        // switch player turn
        setUserState((prevState) => {
          const newUserState = { ...prevState };
          newUserState.playerTurn =
            newUserState.playerTurn === "white" ? "black" : "white";

          // determine new moves available for next player
          setMoves(() => findMovablePieces(newBoardState, newUserState));
          return newUserState;
        });
        return newBoardState;
      });
    }
  }, [userState]);

  return (
    <div id="app">
      <HistoryContext.Provider value={[history, setHistory]}>
        <BoardContext.Provider value={[boardState, setBoardState]}>
          <UserContext.Provider value={[userState, setUserState]}>
            <ChessBoard moves={moves} />
          </UserContext.Provider>
        </BoardContext.Provider>
      </HistoryContext.Provider>
    </div>
  );
};

const Root = ReactDOM.createRoot(document.getElementById("root")!);
Root.render(<App />);

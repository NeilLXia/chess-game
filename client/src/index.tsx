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
import ChessBoard from "./components/chessboard";
import findMovablePieces from "./lib/findMovablePieces";
import simulateBoardMove from "./lib/simulateBoardMove";

const App = () => {
  const [boardState, setBoardState] = useState(initialBoardState);
  const [moves, setMoves] = useState({});
  const [userState, setUserState] = useState({
    firstSelection: -1,
    secondSelection: -1,
    playerTurn: "white",
    canCastle: {
      black: { 0: true, 7: true },
      white: { 56: true, 63: true },
    } as { [key: string]: { [key: string]: boolean } },
  });

  // set the first history state to the board's initial state
  const [history, setHistory] = useState([boardState]);

  // game handler
  useEffect(() => {
    setMoves(() => findMovablePieces(boardState, userState, history));
    if (userState.secondSelection !== -1) {
      const [indexFrom, indexTo] = [
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
        const newBoardState = simulateBoardMove(prevState, indexFrom, indexTo);

        // check for castling moves
        const queenCastleRook = userState.playerTurn === "white" ? 56 : 0;
        const kingCastleRook = userState.playerTurn === "white" ? 63 : 7;
        const isPlayerKingMoveTwo =
          prevState[indexFrom] ===
            (userState.playerTurn === "white" ? 0 : 10) &&
          Math.abs(indexFrom - indexTo) === 2;

        const castlingBoardState = isPlayerKingMoveTwo
          ? indexTo - indexFrom > 0
            ? simulateBoardMove(newBoardState, kingCastleRook, indexTo - 1)
            : simulateBoardMove(newBoardState, queenCastleRook, indexTo + 1)
          : null;
        if (castlingBoardState) {
          userState.canCastle[userState.playerTurn][kingCastleRook] = false;
          userState.canCastle[userState.playerTurn][queenCastleRook] = false;
        }

        // check for en passant
        const oneRowForward = userState.playerTurn === "white" ? -8 : 8;
        const isPawnAttackingEmpty =
          prevState[indexFrom] ===
            (userState.playerTurn === "white" ? 1 : 11) &&
          prevState[indexTo] === -1 &&
          (Math.abs(indexTo - indexFrom) === 7 ||
            Math.abs(indexTo - indexFrom) === 9);

        const enPassantBoardState = isPawnAttackingEmpty
          ? simulateBoardMove(newBoardState, -1, indexTo - oneRowForward)
          : null;

        const finalBoardState = enPassantBoardState
          ? enPassantBoardState
          : castlingBoardState || newBoardState;

        // add move to history
        setHistory((prevState) => [...prevState, finalBoardState]);

        // switch player turn
        setUserState((prevState) => {
          const newUserState = { ...prevState };
          newUserState.playerTurn =
            newUserState.playerTurn === "white" ? "black" : "white";

          // determine new moves available for next player
          setMoves(() =>
            findMovablePieces(newBoardState, newUserState, history)
          );
          return newUserState;
        });
        return finalBoardState;
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

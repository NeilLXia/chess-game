import * as React from "react";
import { useContext } from "react";

import { UserContext, BoardContext } from "../contexts/userContext";
import overlayColors from "../lib/overlayColors";

interface ChessTileProps {
  square: {
    color: string;
    x: number;
    y: number;
    state: string;
  };
}

interface userStateProps {
  turn: string;
  selected: number;
  state: string;
}

const ChessTile = ({ square }: ChessTileProps) => {
  const [boardState, setBoardState] = useContext(BoardContext);
  const [userState, setUserState] = useContext(UserContext);

  const { color, x, y, state } = square;
  const piece = boardState[x + 8 * y];

  const pieceStyles = `board-piece ${
    piece.color === "white"
      ? "white-piece"
      : piece.color === "black"
      ? "black-piece"
      : ""
  }`;

  const overlayStyle = overlayColors(state);

  const selectSquare = () => {
    if (userState.state === "none" && state === "selectPiece") {
      setUserState((prevState: userStateProps) => ({
        turn: prevState.turn,
        selected: x + 8 * y,
        state: "move",
      }));
    }
    if (userState.state === "move" && state === "unselect") {
      setUserState((prevState: userStateProps) => ({
        turn: prevState.turn,
        selected: -1,
        state: "none",
      }));
    }
    if (
      userState.state === "move" &&
      (state === "movePiece" || state === "takePiece")
    ) {
      setBoardState((prevState: Array<{ color: string; type: string }>) => {
        prevState[x + 8 * y] = prevState[userState.selected];
        prevState[userState.selected] = { color: "", type: "" };
        return prevState;
      });
      setUserState((prevState: userStateProps) => ({
        turn: prevState.turn === "white" ? "black" : "white",
        selected: -1,
        state: "none",
      }));
    }
  };

  return (
    <div className="board-square" onClick={selectSquare}>
      <div className={overlayStyle} />
      <div className={`${color}-square`}>
        <div className={pieceStyles}>
          <div className="piece-icon">{piece.type}</div>
        </div>
      </div>
    </div>
  );
};

export default ChessTile;

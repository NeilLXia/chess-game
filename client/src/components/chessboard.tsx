import * as React from "react";
import { useContext } from "react";

import { UserContext } from "../contexts/userContext";
import ChessSquare from "./chessSquare";

const ChessBoard = ({ moves }: any) => {
  const [userState, setUserState] = useContext(UserContext);

  // render 8 x 8 square grid and mark them as either black or white
  const squares = Array.from(Array(64).keys()).map(
    (piece: number, index: number) => {
      const squareColor =
        ((index % 8) + Math.floor(index / 8)) % 2 ? "black" : "white";

      const noSelectionColor = moves[index] ? "blue" : "";
      const pieceSelectedColor =
        index === userState.firstSelection
          ? "grey"
          : moves[userState.firstSelection]?.attackRange.has(index)
          ? "red"
          : moves[userState.firstSelection]?.moveRange.has(index)
          ? "blue"
          : "";
      const prevSelectionColor =
        index === userState.prevSelection ? "yellow" : "";
      const overlayColor =
        userState.firstSelection !== -1 ? pieceSelectedColor : noSelectionColor;
      return { index, squareColor, overlayColor };
    }
  );

  return (
    <div className="chessboard">
      {squares.map(
        (square: {
          index: number;
          squareColor: string;
          overlayColor: string;
        }) => (
          <ChessSquare key={`${square.index}`} square={square} />
        )
      )}
    </div>
  );
};

export default ChessBoard;

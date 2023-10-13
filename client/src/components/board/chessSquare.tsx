import * as React from "react";
import { useContext } from "react";

import { UserContext, BoardContext } from "../../hooks/userContext";
import { numberToUnicode } from "../../lib/gameHandler/referenceData/pieceTypes";

interface ChessSquareProps {
  square: {
    index: number;
    squareColor: string;
    overlayColor: string;
  };
}

// renders the square and piece to the board
const ChessSquare = ({ square }: ChessSquareProps) => {
  const [boardState] = useContext(BoardContext);
  const [userState, setUserState] = useContext(UserContext);

  const { index, squareColor, overlayColor } = square;
  const piece = boardState[index];
  const pieceType = numberToUnicode[piece];

  const pieceClass =
    piece >= 10 ? "black-piece" : piece >= 0 ? "white-piece" : "";

  // determine square highlighting
  const overlayStyle = `overlay ${
    overlayColor === "blue" ? "overlay-blue" : ""
  } ${overlayColor === "red" ? "overlay-red" : ""} ${
    overlayColor === "grey" ? "overlay-grey" : ""
  } ${overlayColor === "yellow" ? "overlay-yellow" : ""}`;

  const handleSquareClick = () => {
    // store selection in state if player clicks on a highlighted square (not yellow)
    if (overlayColor && overlayColor !== "yellow") {
      setUserState((prevState: any) => ({
        ...prevState,
        firstSelection:
          prevState.firstSelection === -1 ? index : prevState.firstSelection,
        secondSelection:
          prevState.firstSelection === -1 ? prevState.secondSelection : index,
      }));
    }
  };

  return (
    <div className="board-square" onClick={handleSquareClick}>
      <div className={overlayStyle} />
      <div className={`${squareColor}-square`}>
        <div className={`board-piece ${pieceClass}`}>
          <div className="piece-icon">{pieceType}</div>
        </div>
      </div>
    </div>
  );
};

export default ChessSquare;

import * as React from "react";
import { useContext } from "react";

import { UserContext, BoardContext } from "../contexts/userContext";
import { numberToPiece, numberToUnicode } from "../lib/gameHandler/pieceTypes";

interface ChessSquareProps {
  square: {
    index: number;
    squareColor: string;
    overlayColor: string;
  };
}

// renders the square and piece to the board
const ChessSquare = ({ square }: ChessSquareProps) => {
  const [boardState, setBoardState] = useContext(BoardContext);
  const [userState, setUserState] = useContext(UserContext);

  const { index, squareColor, overlayColor } = square;
  const piece = boardState[index];
  const pieceType = numberToUnicode[piece];

  const pieceStyles = `board-piece ${
    piece >= 10 ? "black-piece" : piece >= 0 ? "white-piece" : ""
  }`;

  // determine square highlighting
  const overlayStyle = `overlay ${
    overlayColor === "blue" ? "overlay-blue" : ""
  } ${overlayColor === "red" ? "overlay-red" : ""} ${
    overlayColor === "grey" ? "overlay-grey" : ""
  } ${overlayColor === "yellow" ? "overlay-yellow" : ""}`;

  return (
    <div
      className="board-square"
      onClick={() => {
        // store selection in state if player clicks on a highlighted square
        if (overlayColor !== "") {
          setUserState((prevState: any) => {
            if (prevState.firstSelection === -1) {
              return { ...prevState, firstSelection: index };
            }
            return { ...prevState, secondSelection: index };
          });
        }
      }}
    >
      <div className={overlayStyle} />
      <div className={`${squareColor}-square`}>
        <div className={pieceStyles}>
          <div className="piece-icon">{pieceType}</div>
        </div>
      </div>
    </div>
  );
};

export default ChessSquare;

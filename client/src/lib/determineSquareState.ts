import { useContext } from "react";

import { UserContext, BoardContext } from "../contexts/userContext";

import inMoveRange from "./inMoveRange";
import {
  checkCardinalAlignment,
  checkDiagonalAlignment,
} from "./checkAlignment";
import checkCollision from "./checkCollision";
import checkExtension from "./checkExtension";

interface determineSquareStateProps {
  boardState: Array<{ color: string; type: string }>;
  color: string;
  x: number;
  y: number;
}

const determineSquareState = (props: determineSquareStateProps) => {
  const [boardState, setBoardState] = useContext(BoardContext);
  const [userState, setUserState] = useContext(UserContext);
  const { color, x, y } = props;
  const piece = boardState[x + 8 * y];
  const selectedIndex = userState.selected;
  const selectedPiece = boardState[selectedIndex];

  // Determine move conditions for a king in check
  const kingIndex = boardState.findIndex(
    (piece: { color: string; type: string }) =>
      piece.color === userState.turn && piece.type === "K"
  );

  const kingLocation = { x: kingIndex % 8, y: Math.floor(kingIndex / 8) };
  if (
    userState.state === "none" &&
    piece.type !== "" &&
    userState.turn === piece.color
  ) {
    if (checkCardinalAlignment(x, y, kingLocation.x, kingLocation.y)) {
      if (
        checkCollision({
          boardState,
          selectedIndex: kingIndex,
          x,
          y,
          isTakeAction: false,
        }) &&
        !checkExtension({
          boardState,
          selectedIndex: kingIndex,
          x,
          y,
          pieces: ["R", "Q"],
        })
      ) {
        return "";
      }
    }
    if (checkDiagonalAlignment(x, y, kingLocation.x, kingLocation.y)) {
      console.log(
        x,
        y,
        kingLocation.x,
        kingLocation.y,
        !checkCollision({
          boardState,
          selectedIndex: kingIndex,
          x,
          y,
          isTakeAction: false,
        }),
        checkExtension({
          boardState,
          selectedIndex: kingIndex,
          x,
          y,
          pieces: ["B", "Q"],
        })
      );
      if (
        !checkCollision({
          boardState,
          selectedIndex: kingIndex,
          x,
          y,
          isTakeAction: false,
        }) &&
        !checkExtension({
          boardState,
          selectedIndex: kingIndex,
          x,
          y,
          pieces: ["B", "Q"],
        })
      ) {
        return "";
      }
    }
    return "selectPiece";
  }

  if (userState.state === "move" && x + 8 * y === userState.selected) {
    return "unselect";
  }

  if (
    userState.state === "move" &&
    piece.type === "" &&
    inMoveRange({ boardState, selectedIndex, x, y, isTakeAction: false })
  ) {
    return "movePiece";
  }
  if (
    userState.state === "move" &&
    piece.type !== "" &&
    piece.color !== selectedPiece.color &&
    inMoveRange({ boardState, selectedIndex, x, y, isTakeAction: true })
  ) {
    return "takePiece";
  }

  return "";
};

export default determineSquareState;

import { useContext } from "react";

import { UserContext, BoardContext } from "../contexts/userContext";

import inMoveRange from "./inMoveRange";

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

  if (
    userState.state === "none" &&
    piece.type !== "" &&
    userState.turn === piece.color
  ) {
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

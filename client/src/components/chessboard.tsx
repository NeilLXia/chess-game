import * as React from "react";
import { useContext } from "react";

import { UserContext, BoardContext } from "../contexts/userContext";
import ChessPiece from "./chesstile";
import determineSquareState from "../lib/determineSquareState";

const Chessboard = () => {
  const [boardState, setBoardState] = useContext(BoardContext);

  const squareLocations = Array.from(Array(64).keys()).map((index) => {
    const x = index % 8;
    const y = Math.floor(index / 8);
    const color = (x + y) % 2 ? "black" : "white";
    const state = determineSquareState({ boardState, color, x, y });
    return { color, x, y, state };
  });

  return (
    <div className="chessboard">
      {squareLocations.map((square) => (
        <ChessPiece key={`${square.x}, ${square.y}`} square={square} />
      ))}
    </div>
  );
};

export default Chessboard;

import * as React from "react";

import ChessPiece from "./chesspiece";

interface ChessboardProps {
  boardState: Array<{ color: string; type: string }>;
  setBoardState: Function;
}

const Chessboard = ({ boardState, setBoardState }: ChessboardProps) => {
  const squareLocations = Array.from(Array(64).keys()).map((index) => {
    const x = index % 8;
    const y = Math.floor(index / 8);
    const color = (x + y) % 2 ? "black" : "white";
    const piece = boardState[index];
    return { color, x, y, piece };
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

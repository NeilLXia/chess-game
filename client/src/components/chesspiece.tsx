import * as React from "react";

interface ChessPieceProps {
  square: {
    color: string;
    x: number;
    y: number;
    piece: { color: string; type: string };
  };
}

const ChessPiece = ({ square }: ChessPieceProps) => {
  const pieceStyles = `board-piece ${
    square.piece.color === "white"
      ? "white-piece"
      : square.piece.color === "black"
      ? "black-piece"
      : ""
  }`;

  const selectPiece = () => {};

  return (
    <button
      className={`board-square ${square.color}-square`}
      onClick={selectPiece}
    >
      <div className={pieceStyles}>
        <div className="piece-icon">{square.piece.type}</div>
      </div>
    </button>
  );
};

export default ChessPiece;

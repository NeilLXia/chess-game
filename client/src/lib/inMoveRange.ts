import checkCollision from "./checkCollision";
import {
  checkCardinalAlignment,
  checkDiagonalAlignment,
} from "./checkAlignment";

interface inMoveRangeProps {
  boardState: Array<{ color: string; type: string }>;
  selectedIndex: number;
  x: number;
  y: number;
  isTakeAction: boolean;
}

const inMoveRange = ({
  boardState,
  selectedIndex,
  x,
  y,
  isTakeAction,
}: inMoveRangeProps) => {
  const selected = { x: selectedIndex % 8, y: Math.floor(selectedIndex / 8) };
  const selectedPiece = boardState[selectedIndex];

  if (selectedPiece.type === "P") {
    if (x === selected.x) {
      if (selectedPiece.color === "white") {
        if (selected.y === 6 && y === 4) {
          return true;
        }
        return selected.y - y === 1;
      }
      if (selected.y === 1 && y === 3) {
        return true;
      }
      return selected.y - y === -1;
    }
    if (isTakeAction) {
      if (
        selectedPiece.color === "white" &&
        selected.y - y === 1 &&
        Math.abs(selected.x - x) === 1
      ) {
        return true;
      }
      if (
        selectedPiece.color === "black" &&
        selected.y - y === -1 &&
        Math.abs(selected.x - x) === 1
      ) {
        return true;
      }
    }
  }

  if (selectedPiece.type === "N") {
    if (Math.abs(selected.y - y) === 1 && Math.abs(selected.x - x) === 2) {
      return true;
    }
    if (Math.abs(selected.y - y) === 2 && Math.abs(selected.x - x) === 1) {
      return true;
    }
  }

  if (selectedPiece.type === "K") {
    if (Math.abs(selected.y - y) <= 1 && Math.abs(selected.x - x) <= 1) {
      return true;
    }
  }

  if (selectedPiece.type === "B" || selectedPiece.type === "Q") {
    if (checkDiagonalAlignment(x, y, selected.x, selected.y)) {
      return checkCollision({
        boardState,
        selectedIndex,
        x,
        y,
        isTakeAction,
      });
    }
  }

  if (selectedPiece.type === "R" || selectedPiece.type === "Q") {
    if (checkCardinalAlignment(x, y, selected.x, selected.y)) {
      return checkCollision({
        boardState,
        selectedIndex,
        x,
        y,
        isTakeAction,
      });
    }
  }

  return false;
};

export default inMoveRange;

import checkCollision from "./checkCollision";

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
  const selectedX = selectedIndex % 8;
  const selectedY = Math.floor(selectedIndex / 8);
  const selectedPiece = boardState[selectedIndex];

  if (selectedPiece.type === "P") {
    if (x === selectedX) {
      if (selectedPiece.color === "white") {
        if (selectedY === 6 && y === 4) {
          return true;
        }
        return selectedY - y === 1;
      }
      if (selectedY === 1 && y === 3) {
        return true;
      }
      return selectedY - y === -1;
    }
    if (isTakeAction) {
      if (
        selectedPiece.color === "white" &&
        selectedY - y === 1 &&
        Math.abs(selectedX - x) === 1
      ) {
        return true;
      }
      if (
        selectedPiece.color === "black" &&
        selectedY - y === -1 &&
        Math.abs(selectedX - x) === 1
      ) {
        return true;
      }
    }
  }

  if (selectedPiece.type === "N") {
    if (Math.abs(selectedY - y) === 1 && Math.abs(selectedX - x) === 2) {
      return true;
    }
    if (Math.abs(selectedY - y) === 2 && Math.abs(selectedX - x) === 1) {
      return true;
    }
  }

  if (selectedPiece.type === "K") {
    if (Math.abs(selectedY - y) <= 1 && Math.abs(selectedX - x) <= 1) {
      return true;
    }
  }

  if (selectedPiece.type === "B" || selectedPiece.type === "Q") {
    if (Math.abs(selectedY - y) === Math.abs(selectedX - x)) {
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
    if (Math.abs(selectedY - y) === 0 || Math.abs(selectedX - x) === 0) {
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

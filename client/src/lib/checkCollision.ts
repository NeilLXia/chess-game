interface checkCollisionProps {
  boardState: Array<{ color: string; type: string }>;
  selectedIndex: number;
  x: number;
  y: number;
  isTakeAction: boolean;
}

const checkCollision = ({
  boardState,
  selectedIndex,
  x,
  y,
  isTakeAction,
}: checkCollisionProps) => {
  let selectedX = selectedIndex % 8;
  let selectedY = Math.floor(selectedIndex / 8);
  const directionX =
    x - selectedX ? (x - selectedX) / Math.abs(x - selectedX) : 0;
  const directionY =
    y - selectedY ? (y - selectedY) / Math.abs(y - selectedY) : 0;
  selectedX += directionX;
  selectedY += directionY;

  while (selectedX !== x || selectedY !== y) {
    if (boardState[selectedX + 8 * selectedY].type !== "") {
      return false;
    }
    selectedX += directionX;
    selectedY += directionY;
  }

  if (!isTakeAction && boardState[x + 8 * y].type !== "") {
    return false;
  }

  return true;
};

export default checkCollision;

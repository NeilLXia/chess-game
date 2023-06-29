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
  const selected = { x: selectedIndex % 8, y: Math.floor(selectedIndex / 8) };
  const direction = {
    x: x - selected.x ? (x - selected.x) / Math.abs(x - selected.x) : 0,
    y: y - selected.y ? (y - selected.y) / Math.abs(y - selected.y) : 0,
  };
  selected.x += direction.x;
  selected.y += direction.y;

  while (selected.x !== x || selected.y !== y) {
    if (boardState[selected.x + 8 * selected.y].type !== "") {
      return false;
    }
    selected.x += direction.x;
    selected.y += direction.y;
  }

  if (!isTakeAction && boardState[x + 8 * y].type !== "") {
    return false;
  }

  return true;
};

export default checkCollision;

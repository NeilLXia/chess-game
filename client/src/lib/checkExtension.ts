interface checkExtensionProps {
  boardState: Array<{ color: string; type: string }>;
  selectedIndex: number;
  x: number;
  y: number;
  pieces: Array<string>;
}

const checkExtension = ({
  boardState,
  selectedIndex,
  x,
  y,
  pieces,
}: checkExtensionProps) => {
  const selected = { x, y };
  const userColor = boardState[selectedIndex].color;
  const direction = {
    x:
      x - (selectedIndex % 8)
        ? (x - (selectedIndex % 8)) / Math.abs(x - (selectedIndex % 8))
        : 0,
    y:
      y - Math.floor(selectedIndex / 8)
        ? (y - Math.floor(selectedIndex / 8)) /
          Math.abs(y - Math.floor(selectedIndex / 8))
        : 0,
  };
  selected.x += direction.x;
  selected.y += direction.y;

  while (
    selected.x >= 0 &&
    selected.y >= 0 &&
    selected.x < 8 &&
    selected.y < 8
  ) {
    console.log(selected);
    const checkPiece = boardState[selected.x + 8 * selected.y];
    if (checkPiece.type !== "") {
      if (
        pieces.indexOf(checkPiece.type) !== -1 &&
        checkPiece.color !== userColor
      ) {
        return false;
      } else {
        return true;
      }
    }
    selected.x += direction.x;
    selected.y += direction.y;
  }

  return true;
};

export default checkExtension;

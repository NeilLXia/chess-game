const simulateBoardMove = (
  boardState: Array<number>,
  indexFrom: number,
  indexTo: number
) => {
  const newBoardState = [...boardState];
  const toPieceValue = indexFrom < 0 ? -1 : newBoardState[indexFrom];
  [newBoardState[indexTo], newBoardState[indexFrom]] = [toPieceValue, -1];

  return newBoardState;
};

export default simulateBoardMove;
